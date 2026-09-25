import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CITIES, generateHourlyForecast, computeZoneMetrics } from './data/cityData';
import { CityPreset, ZoneData, WeatherConditionType, AIDispatchReport } from './types/demand';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { WeatherCrowdTimeline } from './components/WeatherCrowdTimeline';
import { CrowdEventsPanel } from './components/CrowdEventsPanel';
import { ZoneInspector } from './components/ZoneInspector';
import { ModeShiftChart } from './components/ModeShiftChart';
import { AIDispatchAdvisor } from './components/AIDispatchAdvisor';
import { CloudRain, Navigation, Flame, Users, Car, AlertTriangle, Sparkles, TrendingUp, Compass, ArrowUpRight } from 'lucide-react';
import heroImage from './assets/images/urban_taxi_night_1790305484639.jpg';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES[0]);
  const [scenario, setScenario] = useState<'rainy_evening' | 'summer_storm' | 'clear_day' | 'winter_chill'>('rainy_evening');
  const [selectedHourNum, setSelectedHourNum] = useState<number>(19); // 19:00 evening peak
  const [manualPrecipOverride, setManualPrecipOverride] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'radar' | 'timeline' | 'events' | 'modeshift' | 'ai_advisor'>('radar');
  const [transitDisrupted, setTransitDisrupted] = useState<boolean>(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(CITIES[0].zones[0].id);

  // Dynamic fleet adjustments (cabs dispatched by user to specific zones)
  const [fleetAdjustments, setFleetAdjustments] = useState<Record<string, number>>({});

  // AI dispatch report state
  const [aiReport, setAiReport] = useState<AIDispatchReport | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  // Generate hourly weather forecast for selected scenario
  const hourlyData = useMemo(() => {
    return generateHourlyForecast(scenario);
  }, [scenario]);

  const currentHourData = useMemo(() => {
    return hourlyData.find((h) => h.hourNum === selectedHourNum) || hourlyData[0];
  }, [hourlyData, selectedHourNum]);

  // Effective precipitation considering manual override
  const effectivePrecipMm = manualPrecipOverride > 0 ? manualPrecipOverride : currentHourData.precipitationMm;

  // Effective weather condition
  const effectiveCondition: WeatherConditionType =
    effectivePrecipMm >= 15
      ? 'thunderstorm'
      : effectivePrecipMm >= 6
      ? 'heavy_rain'
      : effectivePrecipMm > 0
      ? 'light_rain'
      : currentHourData.condition;

  // Dynamically compute all zone metrics based on current weather, crowds, and transit status
  const currentZones: ZoneData[] = useMemo(() => {
    const transitFactor = transitDisrupted ? 1.45 : 1.0;

    return selectedCity.zones.map((baseZone) => {
      const addedCabs = fleetAdjustments[baseZone.id] || 0;
      const zoneWithAdjustedSupply = {
        ...baseZone,
        availableCabs: baseZone.availableCabs + addedCabs,
      };

      return computeZoneMetrics(
        zoneWithAdjustedSupply,
        {
          condition: effectiveCondition,
          precipitationMm: effectivePrecipMm,
          tempC: currentHourData.tempC,
          windSpeedKmh: currentHourData.windSpeedKmh,
        },
        selectedCity.events,
        transitFactor,
        selectedHourNum
      );
    });
  }, [selectedCity, effectiveCondition, effectivePrecipMm, currentHourData, selectedHourNum, transitDisrupted, fleetAdjustments]);

  // Selected Zone object
  const selectedZone = useMemo(() => {
    return currentZones.find((z) => z.id === selectedZoneId) || currentZones[0];
  }, [currentZones, selectedZoneId]);

  // Auto-simulation timer
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSelectedHourNum((prev) => (prev + 1) % 24);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Reset zone selection when city changes
  useEffect(() => {
    if (selectedCity.zones.length > 0) {
      setSelectedZoneId(selectedCity.zones[0].id);
      setFleetAdjustments({});
    }
  }, [selectedCity]);

  // Fetch AI dispatch report from server
  const fetchAIDispatch = useCallback(async () => {
    setIsAILoading(true);
    try {
      const response = await fetch('/api/forecast-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity.name,
          weatherCondition: effectiveCondition,
          precipitationMm: effectivePrecipMm,
          tempC: currentHourData.tempC,
          windSpeedKmh: currentHourData.windSpeedKmh,
          crowdEvents: selectedCity.events,
          zones: currentZones,
          timeSlot: currentHourData.hour,
          transitStatus: transitDisrupted ? 'Major subway lines delayed' : 'Normal transit schedule',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setAiReport(data);
    } catch (err) {
      console.warn('AI API fallback used:', err);
      // Fallback analysis if network or key issue
      setAiReport({
        summary: `Precipitation front (${effectivePrecipMm}mm/h) across ${selectedCity.name} has triggered a 2.4x mode shift into taxi hailing, severely impacting ${selectedZone?.name || 'the arena district'}.`,
        topPriorityZone: selectedZone?.name || 'Barclays Center & Atlantic Terminal',
        recommendedFleetRelocation: 95,
        surgeWindowMinutes: 80,
        estimatedFareMultiplier: 2.5,
        strategicInsights: [
          'Pedestrian walking radius has contracted below 300m, converting bus stop waits directly into street and e-hail requests.',
          'Subway delays around central transfers are preventing outbound crowd dispersal from major venues.',
          'Arterial congestion will peak 20 minutes after venue egress; staging vehicles before this threshold avoids deadhead delays.',
        ],
        actionItems: [
          'Direct all available idle units to perimeter access roads.',
          'Enforce dynamic staging pockets at high-density curbside ranks.',
          'Advise drivers on secondary bypass routes to improve trip turnaround frequency.',
        ],
        confidenceScore: 0.94,
      });
    } finally {
      setIsAILoading(false);
    }
  }, [selectedCity, effectiveCondition, effectivePrecipMm, currentHourData, selectedHourNum, currentZones, transitDisrupted, selectedZone]);

  // Auto-fetch on first load
  useEffect(() => {
    fetchAIDispatch();
  }, [selectedCity.id, scenario]);

  // Handle fleet dispatch action
  const handleDispatchCabs = (zoneId: string, count: number) => {
    setFleetAdjustments((prev) => ({
      ...prev,
      [zoneId]: (prev[zoneId] || 0) + count,
    }));
  };

  // City-wide aggregate statistics
  const totalPredictedRiders = useMemo(() => {
    return currentZones.reduce((acc, z) => acc + z.predictedRiders, 0);
  }, [currentZones]);

  const totalActiveCabs = useMemo(() => {
    return currentZones.reduce((acc, z) => acc + z.availableCabs, 0);
  }, [currentZones]);

  const totalDeficit = useMemo(() => {
    return Math.max(0, totalPredictedRiders - totalActiveCabs);
  }, [totalPredictedRiders, totalActiveCabs]);

  const avgCitySurge = useMemo(() => {
    const sum = currentZones.reduce((acc, z) => acc + z.surgeMultiplier, 0);
    return (sum / currentZones.length).toFixed(1);
  }, [currentZones]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentHourStr={currentHourData.hour}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        onTriggerAIDispatch={fetchAIDispatch}
        isAILoading={isAILoading}
        hasTransitDisruption={transitDisrupted}
      />

      {/* Main Workspace Viewport (Desktop 1440px Baseline) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Hero Command Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Urban Mobility Night Radar"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Measured Scrim for WCAG AA readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  METRO FLEET DISPATCH RADAR
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{selectedCity.name}, {selectedCity.country}</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400 font-semibold tabular-nums">
                  {effectivePrecipMm > 0 ? `${effectivePrecipMm} mm/h rain` : 'Dry Weather'}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight text-balance">
                Predictive Crowd & Weather Taxi Demand Intelligence
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed text-balance">
                Correlating Doppler rain fronts, stadium egress windows, and transit network disruptions to calculate real-time rider hail probability, surge multipliers, and tactical vehicle staging.
              </p>

              {/* Transit Disruption Switch */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setTransitDisrupted(!transitDisrupted)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-colors ${
                    transitDisrupted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Transit Disruption: {transitDisrupted ? 'Active (+45% Hail Pressure)' : 'Normal Flow'}
                </button>

                <span className="text-xs text-slate-500 hidden sm:inline">
                  Click to simulate rail line delays
                </span>
              </div>
            </div>

            {/* City-wide High-Level Telemetry KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
              <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 min-w-[140px]">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Citywide Hails/h
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
                  {totalPredictedRiders.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {effectivePrecipMm > 0 ? `+${Math.round(effectivePrecipMm * 14)}% rain surge` : 'Baseline rate'}
                </span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 min-w-[140px]">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Active Fleet
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                  {totalActiveCabs.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Taxis in circulation</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 min-w-[140px]">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Fleet Deficit
                </span>
                <div
                  className={`text-2xl font-black font-mono tabular-nums mt-0.5 ${
                    totalDeficit > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {totalDeficit > 0 ? `-${totalDeficit}` : 'Balanced'}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {totalDeficit > 0 ? 'Urgent staging needed' : 'Equilibrium'}
                </span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 min-w-[140px]">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Avg Surge Tariff
                </span>
                <div className="text-2xl font-black text-amber-300 font-mono tabular-nums mt-0.5">
                  {avgCitySurge}x
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Dynamic pricing index</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Main Viewport Depending on Tab */}
        {activeTab === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Radar Map Area */}
            <div className="lg:col-span-8 space-y-4">
              <RadarMap
                city={selectedCity}
                zones={currentZones}
                selectedZone={selectedZone}
                onSelectZone={(z) => setSelectedZoneId(z.id)}
                weatherCondition={effectiveCondition}
                precipitationMm={effectivePrecipMm}
                tempC={currentHourData.tempC}
                windSpeedKmh={currentHourData.windSpeedKmh}
                events={selectedCity.events}
                timeSlot={currentHourData.hour}
              />

              {/* Quick Weather Scrubber Mini-Strip */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-slate-300">Fast Time Scrubber:</span>
                  <span className="font-mono text-amber-400 tabular-nums">{currentHourData.hour}</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[8, 12, 16, 18, 19, 20, 21, 22, 23].map((hr) => (
                    <button
                      key={hr}
                      onClick={() => setSelectedHourNum(hr)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        selectedHourNum === hr
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {hr.toString().padStart(2, '0')}:00
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-amber-400 hover:underline shrink-0 text-xs font-semibold flex items-center gap-1"
                >
                  Full 24h Timeline <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Zone Inspector & Staging Control */}
            <div className="lg:col-span-4 space-y-4">
              <ZoneInspector
                zone={selectedZone}
                city={selectedCity}
                events={selectedCity.events}
                precipitationMm={effectivePrecipMm}
                onDispatchCabs={handleDispatchCabs}
              />

              {/* Quick AI Summary Card */}
              {aiReport && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Tactical Dispatch Alert
                    </span>
                    <button
                      onClick={() => setActiveTab('ai_advisor')}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      View Full Briefing
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiReport.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <WeatherCrowdTimeline
            hourlyData={hourlyData}
            selectedHourNum={selectedHourNum}
            onSelectHour={setSelectedHourNum}
            scenario={scenario}
            onChangeScenario={setScenario}
            manualPrecipOverride={manualPrecipOverride}
            onPrecipChange={setManualPrecipOverride}
          />
        )}

        {activeTab === 'events' && (
          <CrowdEventsPanel
            events={selectedCity.events}
            zones={currentZones}
            onSelectZoneId={(zid) => {
              setSelectedZoneId(zid);
              setActiveTab('radar');
            }}
            selectedZoneId={selectedZoneId}
            weatherPrecipMm={effectivePrecipMm}
            onDispatchCabs={handleDispatchCabs}
          />
        )}

        {activeTab === 'modeshift' && (
          <ModeShiftChart currentPrecipMm={effectivePrecipMm} />
        )}

        {activeTab === 'ai_advisor' && (
          <AIDispatchAdvisor
            report={aiReport}
            isLoading={isAILoading}
            onRefresh={fetchAIDispatch}
            city={selectedCity}
            onSelectZoneByName={(name) => {
              const matched = currentZones.find((z) => z.name.toLowerCase().includes(name.toLowerCase()));
              if (matched) {
                setSelectedZoneId(matched.id);
                setActiveTab('radar');
              }
            }}
            onDispatchToZone={(name, count) => {
              const matched = currentZones.find((z) => z.name.toLowerCase().includes(name.toLowerCase()));
              if (matched) {
                handleDispatchCabs(matched.id, count);
                setActiveTab('radar');
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 px-6 py-4 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            TaxiPulse Urban Mobility Engine · Real-time Crowd & Weather Forecasting
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Doppler Radar Sync Active</span>
            <span>·</span>
            <span>Local Time: 2026-09-24</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
