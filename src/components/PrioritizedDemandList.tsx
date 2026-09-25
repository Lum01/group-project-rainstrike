/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TransportHub, PriorityLevel } from '../types/dispatch';
import { 
  CloudRain, 
  ArrowUpRight, 
  Send, 
  Search, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Users
} from 'lucide-react';

interface PrioritizedDemandListProps {
  hubs: TransportHub[];
  onSelectHub: (hub: TransportHub) => void;
  onInspectRoute: (hub: TransportHub) => void;
  onBroadcastForHub: (hub: TransportHub) => void;
}

export const PrioritizedDemandList: React.FC<PrioritizedDemandListProps> = ({
  hubs,
  onSelectHub,
  onInspectRoute,
  onBroadcastForHub
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter hubs
  const filteredHubs = hubs.filter(hub => {
    if (filterRegion !== 'all' && hub.region !== filterRegion) return false;
    if (filterPriority !== 'all' && hub.prediction.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        hub.name.toLowerCase().includes(q) ||
        hub.region.toLowerCase().includes(q) ||
        hub.category.toLowerCase().includes(q) ||
        hub.weather.condition.toLowerCase().includes(q) ||
        hub.routing.ingress.corridorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Critical Surge
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            High Demand
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            Stable
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
            Integrated LTA + NEA + OneMap Synthesis
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Prioritized Taxi Demand Forecast
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Ranked list of transport hubs sorted by Taxi Demand Index (TDI), ground supply deficit, and weather sensitivity.
          </p>
        </div>

        {/* Aggregate Quick Stats */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-300 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div>
            <span className="text-slate-500 block text-[11px]">Surge Hubs</span>
            <span className="text-red-400 font-bold text-base">
              {hubs.filter(h => h.prediction.priority === 'critical').length} Critical
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[11px]">Unmet Demand</span>
            <span className="text-amber-400 font-bold text-base">
              ~{hubs.reduce((acc, h) => acc + h.prediction.supplyDeficit, 0)} cabs
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[11px]">Rain Impact</span>
            <span className="text-sky-400 font-bold text-base">
              {hubs.filter(h => h.weather.rainfallRateMmHr > 10).length} Rain Sectors
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls (Functional segmented controls) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Segmented Control */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterPriority === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => setFilterPriority('critical')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterPriority === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical Surge
            </button>
            <button
              onClick={() => setFilterPriority('high')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterPriority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High Demand
            </button>
          </div>

          {/* Region Segmented Control */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {['all', 'East', 'West', 'Central', 'North', 'South'].map(r => (
              <button
                key={r}
                onClick={() => setFilterRegion(r)}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer capitalize ${
                  filterRegion === r ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'all' ? 'All Sectors' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transport hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Prioritized List: Domain-specific High-Density Data Grid */}
      <div className="space-y-3">
        {filteredHubs.map((hub, index) => {
          const tdi = hub.prediction.taxiDemandIndex;
          const isCritical = hub.prediction.priority === 'critical';

          return (
            <div
              key={hub.id}
              className={`rounded-xl border transition-all p-4 ${
                isCritical 
                  ? 'bg-slate-900/90 border-red-500/40 hover:border-red-500/70 shadow-sm shadow-red-950/20' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Zone: Rank, Title, Region, Reason */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-mono font-bold text-sm text-slate-300 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {getPriorityBadge(hub.prediction.priority)}
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-slate-400">{hub.region} Sector</span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-slate-400">{hub.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer truncate" onClick={() => onSelectHub(hub)}>
                      {hub.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hub.prediction.keyDriverReason}
                    </p>

                    {hub.events && hub.events.length > 0 && (
                      <div className="text-xs text-amber-300/90 font-medium flex items-center gap-1.5 pt-0.5">
                        <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Event: {hub.events[0].name} (~{hub.events[0].estimatedCrowd.toLocaleString()} attendees)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Zone: Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 shrink-0 text-xs font-mono tabular-nums border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                  {/* TDI Metric */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">Taxi Demand Index</span>
                    <div className="text-lg font-bold text-white flex items-baseline gap-1">
                      <span className={isCritical ? 'text-red-400' : 'text-slate-100'}>{tdi}</span>
                      <span className="text-xs text-slate-500 font-normal">/ 100</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">{hub.prediction.surgeMultiplier}x Surge</span>
                  </div>

                  {/* Demand vs Supply */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">Projected Demand</span>
                    <span className="text-slate-200 font-semibold text-sm">~{hub.prediction.projectedDemandPerMin} req/min</span>
                    <span className="text-[11px] text-red-400 block font-semibold">Deficit: +{hub.prediction.supplyDeficit} cabs</span>
                  </div>

                  {/* Weather Status */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">NEA Weather</span>
                    <div className="text-slate-200 font-sans font-medium flex items-center gap-1 text-xs mt-0.5">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{hub.weather.condition}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{hub.weather.rainfallRateMmHr} mm/hr ({hub.prediction.weatherMultiplier}x impact)</span>
                  </div>

                  {/* OneMap Ingress Window */}
                  <div>
                    <span className="text-slate-500 block text-[11px]">Best Ingress Window</span>
                    <span className="text-emerald-400 font-sans font-semibold text-xs block mt-0.5">
                      {hub.routing.ingress.bestTimeToEnter}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block font-sans" title={hub.routing.ingress.corridorName}>
                      {hub.routing.ingress.corridorName}
                    </span>
                  </div>
                </div>

                {/* Right Zone: Actions */}
                <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                  <button
                    onClick={() => onInspectRoute(hub)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 whitespace-nowrap"
                  >
                    <span>OneMap Route</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onBroadcastForHub(hub)}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredHubs.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-slate-800 bg-slate-900/40">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-300">No transport hubs found</div>
            <p className="text-xs text-slate-500 mt-1">Try changing your search terms or filter selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
