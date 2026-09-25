import React, { useState } from 'react';
import { ZoneData, CityPreset, CrowdEvent } from '../types/demand';
import { Car, Flame, Users, CloudRain, Clock, DollarSign, ArrowRight, ShieldCheck, ChevronRight, Check } from 'lucide-react';

interface ZoneInspectorProps {
  zone: ZoneData;
  city: CityPreset;
  events: CrowdEvent[];
  precipitationMm: number;
  onDispatchCabs: (zoneId: string, count: number) => void;
  onClose?: () => void;
}

export const ZoneInspector: React.FC<ZoneInspectorProps> = ({
  zone,
  city,
  events,
  precipitationMm,
  onDispatchCabs,
  onClose,
}) => {
  const [dispatchAmount, setDispatchAmount] = useState<number>(30);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);

  const activeZoneEvents = events.filter((e) => e.zoneId === zone.id);
  const hasDeficit = zone.deficit > 0;

  // Earnings estimation
  const estTripsPerHour = Math.min(2.8, Math.max(1.2, 1.8 * (zone.surgeMultiplier > 1.5 ? 1.3 : 1.0)));
  const estHourlyGross = Math.round(estTripsPerHour * zone.avgFareEstimate * zone.surgeMultiplier);

  const handleDispatch = () => {
    onDispatchCabs(zone.id, dispatchAmount);
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 2400);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
      {/* Zone Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              {zone.category.replace('_', ' ')} ZONE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">ID: {zone.id}</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">{zone.name}</h2>
        </div>

        {/* Surge Badge */}
        <div className="text-right">
          <div className="text-xl font-extrabold text-amber-400 font-mono tabular-nums leading-none">
            {zone.surgeMultiplier}x
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            Fare Multiplier
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Riders Wanting Cab</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {zone.predictedRiders}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {zone.hailWillingnessPct}% hail willingness
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Cabs</span>
            <Car className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {zone.availableCabs}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Within 1.5 km radius</span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Supply Deficit</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasDeficit ? 'bg-rose-500 animate-ping-slow' : 'bg-emerald-400'
              }`}
            />
          </div>
          <div
            className={`text-lg font-bold font-mono tabular-nums ${
              hasDeficit ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {hasDeficit ? `-${zone.deficit}` : `+${Math.abs(zone.deficit)}`}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {hasDeficit ? 'Cabs needed now' : 'Surplus available'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Wait Time</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono tabular-nums">
            ~{zone.avgWaitTimeMin} min
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Curbside queue</span>
        </div>
      </div>

      {/* Demand Synthesis Mathematical Breakdown */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
        <span className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Prediction Equation Factors</span>
          <span className="text-[10px] font-mono text-slate-500">D = B · W + E_crowd + T_friction</span>
        </span>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Baseline Zone Traffic:</span>
            <span className="text-slate-200 tabular-nums">{zone.baselineDemand} trips/h</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Current Crowd in Zone:</span>
            <span className="text-slate-200 tabular-nums">
              {zone.currentCrowd.toLocaleString()} pedestrians ({zone.crowdTrend > 0 ? `+${zone.crowdTrend}%` : `${zone.crowdTrend}%`})
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Weather Hail Elasticity:</span>
            <span className="text-sky-300 tabular-nums">
              {precipitationMm > 0 ? `+${Math.round(precipitationMm * 14)}% mode shift` : 'Baseline dry weather'}
            </span>
          </div>

          {activeZoneEvents.length > 0 && (
            <div className="flex items-center justify-between text-purple-400">
              <span>Active Venue Spillover:</span>
              <span className="font-bold tabular-nums">
                +{activeZoneEvents.reduce((acc, ev) => acc + ev.projectedTaxiDemand, 0)} riders
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Driver Economics / Hourly Yield Projection */}
      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3.5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-300 block">Driver Earnings Projection</span>
          <span className="text-[11px] text-slate-400">
            Est. ~{estTripsPerHour.toFixed(1)} rides/hr @ {city.currencySymbol}
            {zone.avgFareEstimate} base × {zone.surgeMultiplier}x surge
          </span>
        </div>

        <div className="text-right">
          <div className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
            {city.currencySymbol}
            {estHourlyGross}/hr
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">+84% vs cruising</span>
        </div>
      </div>

      {/* Fleet Dispatch Action Panel */}
      <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">Relocate & Stage Fleet Units</span>
          <span className="text-xs font-mono text-amber-400 font-bold tabular-nums">
            {dispatchAmount} Taxis
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={dispatchAmount}
            onChange={(e) => setDispatchAmount(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          {[20, 40, 80].map((preset) => (
            <button
              key={preset}
              onClick={() => setDispatchAmount(preset)}
              className={`flex-1 py-1 rounded text-[11px] font-mono transition-colors border ${
                dispatchAmount === preset
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              +{preset}
            </button>
          ))}
        </div>

        <button
          onClick={handleDispatch}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
            dispatchedSuccess
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          {dispatchedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              {dispatchAmount} Cabs Staged to {zone.name.split('&')[0]}!
            </>
          ) : (
            <>
              <Car className="w-4 h-4" />
              Dispatch {dispatchAmount} Units to {zone.name.split('&')[0]}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
