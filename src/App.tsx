/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { TransportHub, WeatherCondition } from './types/dispatch';
import { INITIAL_TRANSPORT_HUBS } from './data/singaporeHubs';
import { evaluateHubDemand, getPrioritizedHubList } from './utils/predictiveModel';
import { TopNav } from './components/TopNav';
import { SingaporeMap } from './components/SingaporeMap';
import { PrioritizedDemandList } from './components/PrioritizedDemandList';
import { OneMapRoutingAdvisor } from './components/OneMapRoutingAdvisor';
import { LtaNeaTelemetry } from './components/LtaNeaTelemetry';
import { McpServerStudio } from './components/McpServerStudio';
import { DispatchBroadcastModal } from './components/DispatchBroadcastModal';
import { AiStrategicBriefingModal } from './components/AiStrategicBriefingModal';

import bannerImg from './assets/images/grab_operator_dispatch_banner_1790306021278.jpg';
import { 
  AlertTriangle, 
  Flame, 
  Car, 
  CloudRain, 
  Send, 
  Compass, 
  Cpu, 
  ChevronRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [hubs, setHubs] = useState<TransportHub[]>(() => {
    return getPrioritizedHubList(INITIAL_TRANSPORT_HUBS);
  });
  const [selectedHub, setSelectedHub] = useState<TransportHub>(() => hubs[0]);
  const [activeTab, setActiveTab] = useState<'map' | 'prioritized' | 'onemap' | 'telemetry' | 'mcp'>('map');

  const [simulatedWeather, setSimulatedWeather] = useState<WeatherCondition>('Heavy Thundery Showers');
  const [mrtDisruptionActive, setMrtDisruptionActive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isAiBriefingModalOpen, setIsAiBriefingModalOpen] = useState<boolean>(false);
  const [broadcastBanner, setBroadcastBanner] = useState<any | null>(null);

  // Fetch updated hubs or evaluate locally
  const fetchHubs = async (weather: WeatherCondition, disruption: boolean) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/hubs?weather=${encodeURIComponent(weather)}&disruption=${disruption}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hubs && data.hubs.length > 0) {
          setHubs(data.hubs);
          setSelectedHub(prev => data.hubs.find((h: TransportHub) => h.id === prev.id) || data.hubs[0]);
          setIsRefreshing(false);
          return;
        }
      }
    } catch (e) {
      // Fallback local evaluation
    }

    // Local evaluation fallback
    const recalculated = getPrioritizedHubList(INITIAL_TRANSPORT_HUBS, {
      weatherCondition: weather,
      mrtDisruptionActive: disruption
    });
    setHubs(recalculated);
    setSelectedHub(prev => recalculated.find(h => h.id === prev.id) || recalculated[0]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchHubs(simulatedWeather, mrtDisruptionActive);
  }, [simulatedWeather, mrtDisruptionActive]);

  const handleWeatherChange = (newWeather: WeatherCondition) => {
    setSimulatedWeather(newWeather);
  };

  const handleToggleMrtDisruption = () => {
    setMrtDisruptionActive(!mrtDisruptionActive);
  };

  const handleSelectHub = (hub: TransportHub) => {
    setSelectedHub(hub);
  };

  const handleInspectOneMapRoute = (hub: TransportHub) => {
    setSelectedHub(hub);
    setActiveTab('onemap');
  };

  const handleBroadcastForHub = (hub: TransportHub) => {
    setSelectedHub(hub);
    setIsBroadcastModalOpen(true);
  };

  const handleBroadcastSuccess = (broadcast: any) => {
    setBroadcastBanner(broadcast);
    setTimeout(() => {
      setBroadcastBanner(null);
    }, 6000);
  };

  // KPI Calculations
  const criticalHubsCount = hubs.filter(h => h.prediction.priority === 'critical').length;
  const totalSupplyDeficit = hubs.reduce((acc, h) => acc + h.prediction.supplyDeficit, 0);
  const averageTdi = Math.round(hubs.reduce((acc, h) => acc + h.prediction.taxiDemandIndex, 0) / hubs.length);
  const rainImpactCount = hubs.filter(h => h.weather.rainfallRateMmHr > 10).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (3 Zones) */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
        onOpenAiBriefing={() => setIsAiBriefingModalOpen(true)}
        onRefresh={() => fetchHubs(simulatedWeather, mrtDisruptionActive)}
        isRefreshing={isRefreshing}
        simulatedWeather={simulatedWeather}
        onWeatherChange={handleWeatherChange}
        mrtDisruptionActive={mrtDisruptionActive}
        onToggleMrtDisruption={handleToggleMrtDisruption}
      />

      {/* Broadcast Success Banner */}
      {broadcastBanner && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Fleet Advisory Dispatched:</strong> Targeted ~{broadcastBanner.driversTargeted} drivers toward <strong>{broadcastBanner.hubName}</strong> with {broadcastBanner.surgeMultiplier}x surge guarantee via {broadcastBanner.recommendedIngressRoute}.
            </span>
          </div>
          <button
            onClick={() => setBroadcastBanner(null)}
            className="text-emerald-400 hover:text-emerald-200 cursor-pointer ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Operations Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Operations Executive Header & KPI Strip */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
          {/* Subtle dark backdrop banner */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img
              src={bannerImg}
              alt="Singapore Operations Command"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <span>RainStrike · Grab Operator Fleet Intelligence</span>
                  <span aria-hidden="true">·</span>
                  <span>Live Operations Room</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Predictive Taxi Surge & Multi-Hub Ingress Dispatch
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
                  Real-time intelligence engine integrating Singapore LTA Datamall passenger flows, NEA live rain radar nowcasts, and SLA OneMap dynamic road routing to forecast taxi demand surges and advise driver fleets on optimal entrance/exit corridors.
                </p>
              </div>

              {/* Quick Navigation Action Pills / Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('prioritized')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Prioritized List</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('mcp')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>MCP Studio</span>
                </button>
              </div>
            </div>

            {/* High-Density KPI Dashboard Strip (Tabular Numerals) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 font-mono tabular-nums">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Critical Surge Hubs</span>
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-400 mt-1">{criticalHubsCount} Hotspots</div>
                <span className="text-[11px] text-slate-500 font-sans">Requires urgent fleet rebalance</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Net Supply Deficit</span>
                  <Car className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400 mt-1">+{totalSupplyDeficit} Cabs</div>
                <span className="text-[11px] text-slate-500 font-sans">Unmet booking demand / min</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Average Taxi Demand Index</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{averageTdi} / 100</div>
                <span className="text-[11px] text-slate-500 font-sans">Elevated islandwide pressure</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Rain Radar</span>
                  <CloudRain className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold text-sky-400 mt-1">{rainImpactCount} Sectors</div>
                <span className="text-[11px] text-slate-500 font-sans">1.45x - 2.15x weather surge</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Tactical Map View */}
        {activeTab === 'map' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Singapore Live Tactical Demand & Routing Map</h2>
                <p className="text-xs text-slate-400">
                  Click any transport hub to inspect real-time LTA passenger flows, NEA rain radar cells, and OneMap ingress/egress corridors.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Selected:</span>
                <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {selectedHub.shortName} (TDI {selectedHub.prediction.taxiDemandIndex})
                </span>
              </div>
            </div>

            <SingaporeMap
              hubs={hubs}
              selectedHub={selectedHub}
              onSelectHub={handleSelectHub}
              onInspectOneMapRoute={handleInspectOneMapRoute}
              onBroadcastForHub={handleBroadcastForHub}
            />
          </section>
        )}

        {/* Tab 2: Prioritized Demand Forecast List */}
        {activeTab === 'prioritized' && (
          <PrioritizedDemandList
            hubs={hubs}
            onSelectHub={handleSelectHub}
            onInspectRoute={handleInspectOneMapRoute}
            onBroadcastForHub={handleBroadcastForHub}
          />
        )}

        {/* Tab 3: OneMap Routing Advisor */}
        {activeTab === 'onemap' && (
          <OneMapRoutingAdvisor
            hubs={hubs}
            selectedHub={selectedHub}
            onSelectHub={handleSelectHub}
            onBroadcastForHub={handleBroadcastForHub}
          />
        )}

        {/* Tab 4: LTA & NEA Telemetry Feeds */}
        {activeTab === 'telemetry' && (
          <LtaNeaTelemetry
            hubs={hubs}
            onSelectHub={handleSelectHub}
          />
        )}

        {/* Tab 5: Model Context Protocol (MCP) Studio */}
        {activeTab === 'mcp' && (
          <McpServerStudio />
        )}
      </main>

      {/* Broadcast Advisory Modal */}
      <DispatchBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        hubs={hubs}
        selectedHub={selectedHub}
        onBroadcastSuccess={handleBroadcastSuccess}
      />

      {/* AI Strategic Fleet Briefing Modal */}
      <AiStrategicBriefingModal
        isOpen={isAiBriefingModalOpen}
        onClose={() => setIsAiBriefingModalOpen(false)}
        weatherCondition={simulatedWeather}
        mrtDisruptionActive={mrtDisruptionActive}
      />

      {/* Standard Quiet Operations Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RainStrike · Grab Singapore Operations System</span>
            <span aria-hidden="true">·</span>
            <span>LTA Datamall MCP v2.1</span>
            <span aria-hidden="true">·</span>
            <span>NEA Weather Nowcast</span>
            <span aria-hidden="true">·</span>
            <span>SLA OneMap SG Routing</span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Real-time taxi fleet demand prediction & tactical corridor management
          </div>
        </div>
      </footer>
    </div>
  );
}
