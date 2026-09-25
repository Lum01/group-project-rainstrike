/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_TRANSPORT_HUBS } from './src/data/singaporeHubs';
import { evaluateHubDemand, getPrioritizedHubList } from './src/utils/predictiveModel';
import { TransportHub, WeatherCondition } from './src/types/dispatch';
import mcpHandler from './api/mcp.js';
import { getStationCrowd, getTrafficIncidents } from './lib/ltaService.js';
import { getWeatherForecast } from './lib/weatherService.js';
import { calculateRoute } from './lib/routingService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -------------------------------------------------------------
// MCP Server Streamable HTTP Endpoints (Protocol 2025-11-25)
// -------------------------------------------------------------
app.post('/api/mcp', mcpHandler);
app.get('/api/mcp', mcpHandler);

// -------------------------------------------------------------
// Dedicated Transit & Weather API Routes
// -------------------------------------------------------------
app.get('/api/station_crowd', async (req: Request, res: Response) => {
  const stationCode = String(req.query.station_code || 'EW24');
  const result = await getStationCrowd(stationCode);
  res.status(result.isError ? 502 : 200).json(result.isError ? result : result.result);
});

app.get('/api/traffic_incidents', async (_req: Request, res: Response) => {
  const result = await getTrafficIncidents();
  res.status(result.isError ? 502 : 200).json(result.isError ? result : result.result);
});

app.get('/api/weather_forecast', async (req: Request, res: Response) => {
  const range = String(req.query.date_time_range || 'now');
  const result = await getWeatherForecast(range);
  res.status(result.isError ? 502 : 200).json(result.isError ? result : result.result);
});

app.get('/api/route_calculate', async (req: Request, res: Response) => {
  const { start, end, mode } = req.query;
  const result = await calculateRoute(String(start || ''), String(end || ''), (mode as any) || 'drive');
  res.status(result.isError ? 502 : 200).json(result.isError ? result : result.result);
});

// In-memory state of transport hubs
let currentHubs: TransportHub[] = JSON.parse(JSON.stringify(INITIAL_TRANSPORT_HUBS));
let broadcastHistory: any[] = [];

// Initialize Gemini SDK on server-side if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Fetch live 2-hour weather forecast from Singapore NEA (data.gov.sg)
 */
async function fetchLiveNeaForecast(): Promise<Record<string, string>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (!res.ok) return {};
    const data = await res.json();
    const forecasts = data.items?.[0]?.forecasts || [];
    const areaMap: Record<string, string> = {};
    for (const f of forecasts) {
      if (f.area && f.forecast) {
        areaMap[f.area.toLowerCase()] = f.forecast;
      }
    }
    return areaMap;
  } catch (err) {
    // Graceful fallback to simulated weather
    return {};
  }
}

// -------------------------------------------------------------
// REST API Endpoints for Frontend Console
// -------------------------------------------------------------

app.get('/api/hubs', async (req: Request, res: Response) => {
  const { weather, disruption } = req.query;
  const list = getPrioritizedHubList(currentHubs, {
    weatherCondition: weather as WeatherCondition | undefined,
    mrtDisruptionActive: disruption !== undefined ? disruption === 'true' : undefined
  });
  res.json({
    timestamp: new Date().toISOString(),
    hubs: list
  });
});

app.get('/api/hub/:id', (req: Request, res: Response) => {
  const hub = currentHubs.find(h => h.id === req.params.id);
  if (!hub) {
    return res.status(404).json({ error: 'Transport hub not found' });
  }
  res.json(evaluateHubDemand(hub));
});

app.post('/api/dispatch/broadcast', (req: Request, res: Response) => {
  const { hubId, surgeMultiplier, bonusIncentive } = req.body;
  const hub = currentHubs.find(h => h.id === hubId);
  if (!hub) {
    return res.status(404).json({ error: 'Hub not found' });
  }

  const broadcast = {
    id: `DISPATCH-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    targetHubId: hub.id,
    hubName: hub.name,
    surgeMultiplier: surgeMultiplier || hub.prediction.surgeMultiplier,
    bonusIncentive: bonusIncentive || 5.0,
    recommendedIngressRoute: hub.routing.ingress.corridorName,
    driversTargeted: Math.round(hub.prediction.recommendedDriverReposition * 2.2),
    acceptedDrivers: Math.round(hub.prediction.recommendedDriverReposition * 0.85),
    status: 'active'
  };

  broadcastHistory.unshift(broadcast);
  res.json({ success: true, broadcast });
});

app.get('/api/dispatch/history', (_req: Request, res: Response) => {
  res.json({ history: broadcastHistory });
});

// AI Strategic Fleet Briefing using Gemini 3.8 Flash
app.post('/api/ai/briefing', async (req: Request, res: Response) => {
  const { weatherCondition, mrtDisruption } = req.body;
  const prioritized = getPrioritizedHubList(currentHubs, {
    weatherCondition,
    mrtDisruptionActive: mrtDisruption
  });

  const criticalHubs = prioritized.filter(h => h.prediction.priority === 'critical' || h.prediction.priority === 'high');

  if (ai) {
    try {
      const prompt = `You are the Grab Singapore Fleet Operations Director AI.
Analyze the integrated live telemetry from Singapore LTA Datamall, NEA Weather nowcast, and OneMap traffic routing:

Top high-demand transit hubs:
${criticalHubs.map(h => `- ${h.name} (${h.region}): TDI=${h.prediction.taxiDemandIndex}/100, Deficit=${h.prediction.supplyDeficit} cabs, Surge=${h.prediction.surgeMultiplier}x, Weather="${h.weather.condition}", Ingress="${h.routing.ingress.corridorName}" (Best enter: ${h.routing.ingress.bestTimeToEnter}), Egress="${h.routing.egress.corridorName}" (Best exit: ${h.routing.egress.bestTimeToExit}), Reason="${h.prediction.keyDriverReason}"`).join('\n')}

Provide an operational 3-point dispatch directive for Grab Fleet Controllers:
1. Priority Fleet Reallocation Target (which 1-2 hubs need immediate driver re-routing before queues spillover)
2. OneMap Ingress/Egress Tactical Route Advice (which expressways to avoid, ERP timing, optimal entrance corridor)
3. Weather/Disruption Risk Window (timeframe where rain/fault will peak unmet demand)
Keep concise, tactical, and authoritative.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ briefing: response.text });
    } catch (err: any) {
      console.error('Gemini error, using algorithmic fallback:', err.message);
    }
  }

  // Fallback high-fidelity briefing if Gemini key is not configured or fails
  const topHub = prioritized[0];
  const secondHub = prioritized[1];
  const fallbackBriefing = `**GRAB FLEET OPERATIONAL DIRECTIVE — PRIORITY SURGE ALERT**

1. **Immediate Fleet Repositioning Target**: Re-route 50+ idle driver partners toward **${topHub.name}** (TDI: ${topHub.prediction.taxiDemandIndex}/100, Deficit: ${topHub.prediction.supplyDeficit} cabs). Second priority: **${secondHub?.name || 'Changi Airport'}**. LTA Datamall indicates passenger tap-out surge compounded by ${topHub.weather.condition}.

2. **OneMap Ingress & Egress Corridor Enforcement**:
   - Instruct drivers entering ${topHub.shortName} to use **${topHub.routing.ingress.corridorName}** during window **${topHub.routing.ingress.bestTimeToEnter}** to avoid arterial bottleneck queues.
   - For drop-offs, recommend egress via **${topHub.routing.egress.corridorName}** before congestion escalates.

3. **Peak Risk Window**: Expected surge pressure active over the next 45 minutes as NEA radar indicates rain intensity of ${topHub.weather.rainfallRateMmHr} mm/hr. Recommend locking in ${topHub.prediction.surgeMultiplier}x surge guarantee to maintain 85%+ driver acceptance.`;

  res.json({ briefing: fallbackBriefing });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`RainStrike Operations Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
