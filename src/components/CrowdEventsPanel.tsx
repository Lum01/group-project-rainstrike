import React from 'react';
import { CrowdEvent, ZoneData } from '../types/demand';
import { Users, Clock, MapPin, AlertCircle, Compass, Zap, Flame, ShieldAlert } from 'lucide-react';

interface CrowdEventsPanelProps {
  events: CrowdEvent[];
  zones: ZoneData[];
  onSelectZoneId: (zoneId: string) => void;
  selectedZoneId?: string;
  weatherPrecipMm: number;
  onDispatchCabs: (zoneId: string, count: number) => void;
}

export const CrowdEventsPanel: React.FC<CrowdEventsPanelProps> = ({
  events,
  zones,
  onSelectZoneId,
  selectedZoneId,
  weatherPrecipMm,
  onDispatchCabs,
}) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Crowd Venues & Mass Egress Demand Triggers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time stadium, concert, and transit crowd egress windows creating localized taxi shortages
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span className="text-purple-400 font-bold tabular-nums">{events.length}</span> Active Venues Monitored
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No mass crowd egress events currently detected in this metropolitan zone.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => {
            const matchedZone = zones.find((z) => z.id === ev.zoneId);
            const isSelected = selectedZoneId === ev.zoneId;
            const weatherMultiplier = weatherPrecipMm > 5 ? 1.65 : weatherPrecipMm > 0 ? 1.3 : 1.0;
            const weatherAdjustedDemand = Math.round(ev.projectedTaxiDemand * weatherMultiplier);

            return (
              <div
                key={ev.id}
                className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-purple-950/20 border-purple-500/60 ring-1 ring-purple-500/30'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider font-mono">
                      {ev.type.replace('_', ' ')}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                        ev.status === 'egress_soon'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : ev.status === 'ongoing'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ev.status === 'egress_soon' ? 'Egress in 15m' : ev.status}
                    </span>
                  </div>

                  {/* Venue and Event Title */}
                  <h3 className="text-sm font-bold text-white tracking-tight">{ev.eventName}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{ev.venueName}</span>
                    {matchedZone && <span className="text-slate-600">·</span>}
                    {matchedZone && <span className="text-slate-400">{matchedZone.name}</span>}
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Crowd</span>
                      <span className="font-bold text-slate-200 tabular-nums">
                        {ev.totalAttendees.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">Peak Egress</span>
                      <span className="font-bold text-amber-400 tabular-nums">{ev.egressPeakTime}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">Taxi Hails</span>
                      <span className="font-bold text-rose-400 tabular-nums">
                        ~{weatherAdjustedDemand} cabs
                      </span>
                    </div>
                  </div>

                  {/* Weather impact note */}
                  {weatherPrecipMm > 0 && (
                    <div className="mt-2 text-[11px] text-sky-400 flex items-center gap-1.5 bg-sky-950/30 px-2.5 py-1.5 rounded-lg border border-sky-900/40">
                      <Zap className="w-3 h-3 shrink-0" />
                      <span>
                        Rain ({weatherPrecipMm}mm/h) boosts taxi share from {ev.projectedTaxiSharePct}% to{' '}
                        {Math.min(78, Math.round(ev.projectedTaxiSharePct * weatherMultiplier))}%!
                      </span>
                    </div>
                  )}

                  {/* Recommended Staging Location */}
                  <div className="mt-3 text-[11px] text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block mb-0.5">
                      Recommended Fleet Staging Area:
                    </span>
                    <p className="text-slate-300 font-medium">{ev.recommendedStagingPoint}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectZoneId(ev.zoneId)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Inspect Zone on Radar
                  </button>

                  <button
                    onClick={() => onDispatchCabs(ev.zoneId, 30)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
                  >
                    Stage 30 Cabs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
