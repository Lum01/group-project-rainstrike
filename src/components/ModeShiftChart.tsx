import React, { useState } from 'react';
import { CloudRain, Footprints, Bus, Car, Bike, Info, ArrowUpRight } from 'lucide-react';

interface ModeShiftChartProps {
  currentPrecipMm: number;
}

export const ModeShiftChart: React.FC<ModeShiftChartProps> = ({ currentPrecipMm }) => {
  const [testPrecip, setTestPrecip] = useState<number>(currentPrecipMm);

  // Compute urban modal split based on rain mm/h
  const calculateModalSplit = (rainMm: number) => {
    // Walking starts at 42% and drops rapidly as rain increases
    const walkPct = Math.max(2, Math.round(42 - rainMm * 2.5));
    // Cycling starts at 9% and drops to 0% by 5mm
    const bikePct = Math.max(0, Math.round(9 - rainMm * 1.8));
    // Transit starts at 37%, slightly absorbs walking, then drops when rain causes delays
    const transitPct = Math.max(20, Math.round(37 - (rainMm > 6 ? (rainMm - 6) * 1.2 : -rainMm * 0.8)));
    // Taxi absorbs everything else
    const taxiPct = Math.max(12, Math.min(78, 100 - (walkPct + bikePct + transitPct)));

    return { walkPct, bikePct, transitPct, taxiPct };
  };

  const { walkPct, bikePct, transitPct, taxiPct } = calculateModalSplit(testPrecip);
  const baselineTaxiPct = 12;
  const taxiDemandSurgeRatio = ((taxiPct / baselineTaxiPct) * 100 - 100).toFixed(0);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            Weather-Induced Urban Mode Shift & Hail Elasticity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical transportation model: how precipitation and storm conditions divert pedestrians and commuters into taxi cabs
          </p>
        </div>

        {/* Rain Level Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Precipitation Test:</span>
          <span className="font-bold text-sky-300 tabular-nums">{testPrecip} mm/h</span>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Simulate Rain Intensity on Commuters</span>
          <div className="flex items-center gap-1.5">
            {[0, 3, 8, 15, 22].map((preset) => (
              <button
                key={preset}
                onClick={() => setTestPrecip(preset)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  testPrecip === preset
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {preset === 0 ? 'Dry (0mm)' : `${preset}mm`}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="25"
          step="1"
          value={testPrecip}
          onChange={(e) => setTestPrecip(Number(e.target.value))}
          className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 mm/h (Sunny / Clear)</span>
          <span>5 mm/h (Light Shower)</span>
          <span>12 mm/h (Heavy Rain)</span>
          <span>20+ mm/h (Severe Storm)</span>
        </div>
      </div>

      {/* Segmented Mode Share Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Citywide Modal Share Distribution</span>
          <span className="text-amber-400 font-bold">
            Taxi Mode Surge: +{taxiDemandSurgeRatio}% vs baseline
          </span>
        </div>

        <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden flex p-1 border border-slate-800 gap-1">
          {/* Taxi (Amber) */}
          <div
            className="h-full bg-amber-500 rounded-lg transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-slate-950 overflow-hidden"
            style={{ width: `${taxiPct}%` }}
            title={`Taxi / Rideshare: ${taxiPct}%`}
          >
            {taxiPct > 10 && `Taxi ${taxiPct}%`}
          </div>

          {/* Public Transit (Sky Blue) */}
          <div
            className="h-full bg-sky-600 rounded-lg transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
            style={{ width: `${transitPct}%` }}
            title={`Public Transit: ${transitPct}%`}
          >
            {transitPct > 10 && `Transit ${transitPct}%`}
          </div>

          {/* Walking (Emerald) */}
          <div
            className="h-full bg-emerald-600 rounded-lg transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
            style={{ width: `${walkPct}%` }}
            title={`Walking: ${walkPct}%`}
          >
            {walkPct > 8 && `Walk ${walkPct}%`}
          </div>

          {/* Cycling (Violet) */}
          {bikePct > 0 && (
            <div
              className="h-full bg-purple-600 rounded-lg transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              style={{ width: `${bikePct}%` }}
              title={`Micromobility / Bike: ${bikePct}%`}
            >
              {bikePct > 4 && `${bikePct}%`}
            </div>
          )}
        </div>
      </div>

      {/* Mode Share Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-xs font-semibold">Taxi & Hailing</span>
            <Car className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            {taxiPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {testPrecip > 6
              ? 'Extreme surge: passengers abandon open bus stops & wet walks.'
              : testPrecip > 0
              ? 'Elevated demand as commuters avoid wet transit transfers.'
              : 'Typical dry equilibrium mode split.'}
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-sky-400 mb-1">
            <span className="text-xs font-semibold">Subway & Bus</span>
            <Bus className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-sky-300 font-mono tabular-nums">
            {transitPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Rail ridership holds, but surface bus stops experience severe queue drop-offs.
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-xs font-semibold">Pedestrian Walking</span>
            <Footprints className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono tabular-nums">
            {walkPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Walking tolerance drops from 1,200m down to under 250m once rain exceeds 4mm/h.
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <span className="text-xs font-semibold">Bicycles & Scooters</span>
            <Bike className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono tabular-nums">
            {bikePct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Micromobility collapses almost completely due to slippery roads and zero weather cover.
          </p>
        </div>
      </div>
    </div>
  );
};
