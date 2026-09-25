/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { getStationCrowd, getTrafficIncidents } from '../lib/ltaService.js';
import { getWeatherForecast } from '../lib/weatherService.js';
import { calculateRoute } from '../lib/routingService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    const errorPayload = {
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed' },
      id: null,
    };
    if (typeof res.status === 'function') {
      return res.status(405).json(errorPayload);
    }
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(errorPayload));
  }

  // Ensure accept header is compatible with MCP Streamable HTTP specification
  if (req.headers && (!req.headers['accept'] || !req.headers['accept'].includes('text/event-stream'))) {
    req.headers['accept'] = req.headers['accept']
      ? `${req.headers['accept']}, text/event-stream`
      : 'application/json, text/event-stream';
  }

  const server = new McpServer({
    name: 'rainstrike-mcp',
    version: '1.0.0',
  });

  // rs_station_crowd
  server.registerTool(
    'rs_station_crowd',
    {
      description:
        'Returns passenger volume trends and forecasted crowdedness levels at 30-minute intervals for the specified Singapore MRT station. Data is retrieved directly from the Land Transport Authority (LTA) DataMall Station Crowd Density Forecast API. Use this tool when assessing rail commuter volume, station platform congestion, and pickup surge potential for taxi and PHV drivers. It does not provide real-time bus passenger loads or non-rail transit crowd statistics.',
      inputSchema: {
        station_code: z
          .string()
          .describe(
            "Alphanumeric code of the Singapore MRT station (e.g., 'NS1', 'EW24', 'DT35', 'CC1', 'NE1', 'TE1', 'CG1', 'CE2') to query passenger volume trends and congestion levels."
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ station_code }) => {
      const resp = await getStationCrowd(station_code);
      if (resp.isError) {
        return {
          isError: true,
          content: [{ type: 'text', text: resp.message }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(resp.result) }],
      };
    }
  );

  // rs_traffic_incidents
  server.registerTool(
    'rs_traffic_incidents',
    {
      description:
        'Returns active road accidents, vehicle breakdowns, roadworks, and heavy congestion alerts across the Singapore expressway and arterial network. Data is read directly from the Singapore Land Transport Authority (LTA) DataMall Traffic Incidents API. Call this tool to identify live route obstructions, delays, and incident hotspots to guide driver detours. It does not cover planned future road closures or general traffic light operational statuses.',
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      const resp = await getTrafficIncidents();
      if (resp.isError) {
        return {
          isError: true,
          content: [{ type: 'text', text: resp.message }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(resp.result) }],
      };
    }
  );

  // rs_weather_forecast
  server.registerTool(
    'rs_weather_forecast',
    {
      description:
        'Returns forecasted rainfall intensity, storm warnings, and wet-weather conditions by time range across Singapore sectors. Data is read from the Singapore National Environment Agency (NEA) weather service API. Call this tool when predicting passenger surge triggered by sudden downpours or adverse driving conditions. It does not provide historical multi-year climate observations or typhoon tracking outside Singapore.',
      inputSchema: {
        date_time_range: z
          .string()
          .describe(
            "Target date-time string (ISO 8601 format like '2026-09-25T14:00:00', or date '2026-09-25', or keyword 'now') specifying the forecast window for rainfall and weather conditions."
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ date_time_range }) => {
      const resp = await getWeatherForecast(date_time_range);
      if (resp.isError) {
        return {
          isError: true,
          content: [{ type: 'text', text: resp.message }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(resp.result) }],
      };
    }
  );

  // rs_route_calculate
  server.registerTool(
    'rs_route_calculate',
    {
      description:
        'Returns travel distance and live duration estimates between origin and destination coordinates for drive, walk, or transit modes. Upstream is the GrabMaps routing API with hyperlocal Southeast Asian street network intelligence. Use this tool when calculating point-to-point journey times, driver repositioning distances, or passenger drop-off ETAs. It does not provide real-time toll transaction charges or variable electronic road pricing (ERP) debits.',
      inputSchema: {
        start: z
          .string()
          .describe("Origin starting coordinates in 'lat,lng' format (e.g., '1.3521,103.8198')."),
        end: z
          .string()
          .describe("Destination endpoint coordinates in 'lat,lng' format (e.g., '1.2966,103.8501')."),
        mode: z
          .enum(['drive', 'walk', 'transit'])
          .describe("Transportation mode for route calculation: 'drive', 'walk', or 'transit'."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ start, end, mode }) => {
      const resp = await calculateRoute(start, end, mode);
      if (resp.isError) {
        return {
          isError: true,
          content: [{ type: 'text', text: resp.message }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(resp.result) }],
      };
    }
  );

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', async () => {
    try {
      await transport.close();
    } catch (_) {}
    try {
      await server.close();
    } catch (_) {}
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
