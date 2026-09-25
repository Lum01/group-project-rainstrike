/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransportHub } from '../types/dispatch';
import { 
  CloudRain, 
  Train, 
  Bus, 
  Plane, 
  Car, 
  AlertOctagon, 
  Activity, 
  Radio, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';

interface LtaNeaTelemetryProps {
  hubs: TransportHub[];
  onSelectHub: (hub: TransportHub) => void;
}

export const LtaNeaTelemetry: React.FC<LtaNeaTelemetryProps> = ({
  hubs,
  onSelectHub
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Government Open Data & Sensor Feeds
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">
          Singapore LTA Datamall & NEA Weather Feeds
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Real-time ingestion of MRT/bus commuter tap-outs, transit line alerts, taxi stand queues, and NEA 2-hour radar precipitation.
        </p>
      </div>

      {/* Disruption Alert Banner if active */}
      {hubs.some(h => h.humanTraffic.disruptionAlert) && (
        <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 text-red-100 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-red-300">
              Active LTA Rail Transit Incident Reported
            </div>
            {hubs.filter(h => h.humanTraffic.disruptionAlert).map(h => (
              <p key={h.id} className="text-xs text-red-200">
                <span className="font-semibold">{h.name} ({h.humanTraffic.disruptionAlert?.line}):</span> {h.humanTraffic.disruptionAlert?.message} (Est. Delay: {h.humanTraffic.disruptionAlert?.delayMins} mins). Taxi surge conversion triggered (+55%).
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Two-Column Telemetry View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: LTA Datamall Transit Flows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Train className="w-4 h-4 text-emerald-400" />
              LTA Datamall Transit Inflow & Taxi Queues
            </h3>
            <span className="text-xs text-slate-500 font-mono">Source: LTA Datamall v2.1</span>
          </div>

          <div className="space-y-3">
            {hubs.map(hub => (
              <div
                key={hub.id}
                onClick={() => onSelectHub(hub)}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-colors cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">{hub.region} · {hub.category}</span>
                    <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">{hub.name}</h4>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-xs text-slate-500 block">Total Inflow</span>
                    <span className="text-sm font-semibold text-slate-200">{hub.humanTraffic.hourlyInflow.toLocaleString()} /hr</span>
                  </div>
                </div>

                {/* Sub-metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Train className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{hub.humanTraffic.mrtTapOutPerMin} MRT/min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Bus className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{hub.humanTraffic.busArrivalPerMin} Bus/min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{hub.taxiSupply.queueLengthCommuters} in Queue</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: NEA Live Weather & Storm Radar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" />
              NEA Weather Nowcast & Rain Deluge Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">Source: NEA Singapore (Data.gov.sg)</span>
          </div>

          {/* Weather to Demand Formula Explanation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs space-y-2 text-slate-300">
            <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
              Weather-to-Taxi Surge Correlation Model
            </div>
            <p className="leading-relaxed">
              In Singapore&apos;s tropical climate, open walkways and uncovered bus stops cause immediate ridership deflection into ride-hailing services.
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono tabular-nums pt-1 text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block">Clear/Fair</span>
                <span className="text-slate-200 font-bold">1.00x Base</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block">Mod. Rain (15mm)</span>
                <span className="text-amber-400 font-bold">1.45x Demand</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block">Thunderstorm (40mm)</span>
                <span className="text-red-400 font-bold">2.15x Surge</span>
              </div>
            </div>
          </div>

          {/* Sector Weather Cards */}
          <div className="space-y-3">
            {hubs.map(hub => {
              const isHeavy = hub.weather.rainfallRateMmHr > 25;
              const isRain = hub.weather.rainfallRateMmHr > 5;

              return (
                <div
                  key={hub.id}
                  onClick={() => onSelectHub(hub)}
                  className={`border rounded-xl p-3.5 transition-colors cursor-pointer space-y-2 ${
                    isHeavy 
                      ? 'bg-slate-900/90 border-red-500/40 hover:border-red-500' 
                      : isRain 
                        ? 'bg-slate-900/70 border-sky-500/30 hover:border-sky-500/60' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">{hub.region} Sector</span>
                      <h4 className="text-sm font-bold text-white hover:text-sky-400 transition-colors">{hub.shortName}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <CloudRain className={`w-4 h-4 ${isHeavy ? 'text-red-400 animate-bounce' : isRain ? 'text-sky-400' : 'text-slate-500'}`} />
                      <div className="text-right font-mono tabular-nums text-xs">
                        <span className="text-white font-semibold block">{hub.weather.condition}</span>
                        <span className="text-slate-400">{hub.weather.rainfallRateMmHr} mm/hr · {hub.weather.temperatureC}°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Storm Onset: <span className="text-slate-200">{hub.weather.stormOnsetProbability}%</span></span>
                    <span>Surge Multiplier: <span className="text-emerald-400 font-semibold">{hub.prediction.weatherMultiplier}x</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
