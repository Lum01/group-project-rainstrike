/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TransportHub } from '../types/dispatch';
import { 
  Navigation, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Compass,
  CornerDownRight,
  ExternalLink
} from 'lucide-react';

interface OneMapRoutingAdvisorProps {
  hubs: TransportHub[];
  selectedHub: TransportHub;
  onSelectHub: (hub: TransportHub) => void;
  onBroadcastForHub: (hub: TransportHub) => void;
}

export const OneMapRoutingAdvisor: React.FC<OneMapRoutingAdvisorProps> = ({
  hubs,
  selectedHub,
  onSelectHub,
  onBroadcastForHub
}) => {
  const [activeDirection, setActiveDirection] = useState<'ingress' | 'egress'>('ingress');
  const routing = selectedHub.routing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            SLA OneMap Singapore Dynamic Routing Intelligence
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Ingress & Egress Tactical Routing Advisor
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time and historical road network telemetry advising Grab operators and drivers on optimal entrance/exit corridors and timing windows.
          </p>
        </div>

        {/* Hub Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="hub-advisor-select" className="text-xs text-slate-400">Target Hub:</label>
          <select
            id="hub-advisor-select"
            value={selectedHub.id}
            onChange={(e) => {
              const found = hubs.find(h => h.id === e.target.value);
              if (found) onSelectHub(found);
            }}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
          >
            {hubs.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Hub Summary Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {selectedHub.code}
          </div>
          <div>
            <div className="text-xs text-slate-400">{selectedHub.region} Sector · {selectedHub.category}</div>
            <div className="text-base font-bold text-white">{selectedHub.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Best Ingress Time</span>
            <span className="text-emerald-400 font-bold font-sans">{routing.ingress.bestTimeToEnter}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Best Egress Time</span>
            <span className="text-sky-400 font-bold font-sans">{routing.egress.bestTimeToExit}</span>
          </div>
          <button
            onClick={() => onBroadcastForHub(selectedHub)}
            className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-sans font-semibold text-xs transition-colors cursor-pointer"
          >
            Dispatch to This Corridor
          </button>
        </div>
      </div>

      {/* Corridor Direction Segmented Switcher */}
      <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs w-fit">
        <button
          onClick={() => setActiveDirection('ingress')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeDirection === 'ingress' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Optimal Ingress Corridor (Entering Hotspot)
        </button>
        <button
          onClick={() => setActiveDirection('egress')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeDirection === 'egress' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CornerDownRight className="w-3.5 h-3.5" />
          Optimal Egress Corridor (Exiting with Passenger)
        </button>
      </div>

      {/* Detailed Corridor Card */}
      {activeDirection === 'ingress' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Recommended Entry Corridor</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{routing.ingress.corridorName}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Via: {routing.ingress.viaRoads.join(' → ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Live Estimated Duration</span>
                <span className="text-base font-bold text-emerald-400">{routing.ingress.currentDurationMins} mins</span>
                <span className="text-slate-500 text-[10px] block">Typical: {routing.ingress.historicalTypicalDurationMins} mins</span>
              </div>
            </div>
          </div>

          {/* Operational Advisory Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Best Operational Time Window to Enter
              </div>
              <div className="text-base font-bold text-white">{routing.ingress.bestTimeToEnter}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {routing.ingress.recommendedWindow}. Entering in this window saves drivers an estimated 8-14 minutes of stationary queue time before arterial tailbacks peak.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Electronic Road Pricing (ERP) & Toll Guidance
              </div>
              {routing.ingress.erpGantries.length > 0 ? (
                <div className="space-y-1 text-xs">
                  {routing.ingress.erpGantries.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span>{g.name}</span>
                      <span className="font-mono tabular-nums font-semibold text-amber-300">
                        {g.rate > 0 ? `S$${g.rate.toFixed(2)} (${g.activePeriod})` : 'Free'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">Zero active ERP gantries along this recommended ingress corridor.</div>
              )}
              <div className="text-[11px] text-slate-500 pt-1">
                Route avoids peak S$3.00 city gantries while delivering drivers directly to pickup bays.
              </div>
            </div>
          </div>

          {/* Bottlenecks to Avoid */}
          {routing.ingress.bottlenecks.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3 text-xs text-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300">Identified OneMap Bottlenecks: </span>
                <span>{routing.ingress.bottlenecks.join(' · ')}</span>
              </div>
            </div>
          )}

          {/* Turn-by-turn road instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              OneMap Driver Navigation Directives
            </h4>
            <div className="space-y-1.5">
              {routing.ingress.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Recommended Exit Corridor</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{routing.egress.corridorName}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Via: {routing.egress.viaRoads.join(' → ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Live Estimated Duration</span>
                <span className="text-base font-bold text-sky-400">{routing.egress.currentDurationMins} mins</span>
                <span className="text-slate-500 text-[10px] block">Typical: {routing.egress.historicalTypicalDurationMins} mins</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Best Operational Time Window to Exit
              </div>
              <div className="text-base font-bold text-white">{routing.egress.bestTimeToExit}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {routing.egress.recommendedWindow}. Enables fastest passenger delivery and returns vehicle to arterial circulation.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Clearance & Traffic Flow Advisory
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {routing.egress.clearanceAdvise}
              </p>
            </div>
          </div>

          {/* Turn-by-turn road instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              OneMap Driver Departure Directives
            </h4>
            <div className="space-y-1.5">
              {routing.egress.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historical vs Forward Congestion Profile (Domain-specific scannable data grid) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Historical vs Forward Congestion Duration Curve (OneMap SG)
            </h3>
            <p className="text-xs text-slate-400">
              Corridor transit duration benchmark across operational hours. Blue indicates normal flow; Amber/Red indicates surge delays.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-600"></span>
              <span>Historical Typical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span>Predicted Today</span>
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono tabular-nums text-center">
          {routing.historicalHourlyDurations.map((item, index) => {
            const isWorst = item.congestionIndex >= 8;
            return (
              <div
                key={index}
                className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-1.5 ${
                  isWorst 
                    ? 'bg-red-950/20 border-red-800/50 text-red-200' 
                    : item.congestionIndex >= 6 
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-400">{item.timeSlot}</div>
                <div className="text-sm font-bold text-white">{item.predictedDurationMins}m</div>
                <div className="text-[10px] text-slate-500">Typ: {item.typicalDurationMins}m</div>
                <div className="text-[10px] text-slate-400">Idx: {item.congestionIndex}/10</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
