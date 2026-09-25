import React, { useState } from 'react';
import { ZoneData, WeatherConditionType, CrowdEvent, CityPreset } from '../types/demand';
import { CloudRain, Users, Car, Zap, Navigation, Layers, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface RadarMapProps {
  city: CityPreset;
  zones: ZoneData[];
  selectedZone: ZoneData | null;
  onSelectZone: (zone: ZoneData) => void;
  weatherCondition: WeatherConditionType;
  precipitationMm: number;
  tempC: number;
  windSpeedKmh: number;
  events: CrowdEvent[];
  timeSlot: string;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  city,
  zones,
  selectedZone,
  onSelectZone,
  weatherCondition,
  precipitationMm,
  tempC,
  windSpeedKmh,
  events,
  timeSlot,
}) => {
  const [activeLayers, setActiveLayers] = useState<{
    heatmap: boolean;
    weather: boolean;
    crowd: boolean;
    cabs: boolean;
  }>({
    heatmap: true,
    weather: true,
    crowd: true,
    cabs: true,
  });

  const [hoveredZone, setHoveredZone] = useState<ZoneData | null>(null);

  const toggleLayer = (layer: 'heatmap' | 'weather' | 'crowd' | 'cabs') => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Weather color theme
  const isRaining = precipitationMm > 0;
  const isHeavyRain = precipitationMm >= 8;

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <span className="text-xs font-semibold text-white tracking-wide">{city.name} Command Radar</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">{timeSlot}</span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg text-xs">
          <button
            onClick={() => toggleLayer('heatmap')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeLayers.heatmap ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Flame className="w-3 h-3" />
            Demand
          </button>
          <button
            onClick={() => toggleLayer('weather')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeLayers.weather ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            Weather Radar
          </button>
          <button
            onClick={() => toggleLayer('crowd')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeLayers.crowd ? 'bg-purple-500/20 text-purple-300 font-medium' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users className="w-3 h-3" />
            Crowd
          </button>
          <button
            onClick={() => toggleLayer('cabs')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeLayers.cabs ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Car className="w-3 h-3" />
            Fleet Supply
          </button>
        </div>
      </div>

      {/* Floating Microclimate Indicator on Top-Right */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl max-w-[210px]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <CloudRain className={`w-4 h-4 ${isRaining ? 'text-sky-400' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {weatherCondition.replace('_', ' ')}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-amber-400 tabular-nums">{tempC}°C</span>
        </div>
        <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
          <div className="flex justify-between">
            <span>Precipitation:</span>
            <span className={`font-semibold tabular-nums ${isHeavyRain ? 'text-rose-400' : 'text-sky-300'}`}>
              {precipitationMm} mm/h
            </span>
          </div>
          <div className="flex justify-between">
            <span>Wind Velocity:</span>
            <span className="text-slate-300 tabular-nums">{windSpeedKmh} km/h</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
            <span>Mode Conversion:</span>
            <span className="text-emerald-400 font-semibold tabular-nums">
              {precipitationMm > 8 ? '+190% Cabs' : precipitationMm > 2 ? '+65% Cabs' : 'Baseline'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas (SVG) */}
      <div className="relative flex-1 w-full h-full bg-[#070b14] overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
            </pattern>

            {/* Radial Radar Sweep Gradient */}
            <radialGradient id="radar-concentric" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.05)" />
              <stop offset="60%" stopColor="rgba(14, 165, 233, 0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* High Demand Heat Gradient */}
            <radialGradient id="heat-surge">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.45)" />
              <stop offset="40%" stopColor="rgba(245, 158, 11, 0.25)" />
              <stop offset="75%" stopColor="rgba(245, 158, 11, 0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Moderate Demand Heat Gradient */}
            <radialGradient id="heat-moderate">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.35)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Weather Rain Storm Gradient */}
            <radialGradient id="storm-cloud" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0.35)" />
              <stop offset="50%" stopColor="rgba(30, 58, 138, 0.22)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="650" fill="url(#radar-grid)" />

          {/* Concentric Distance Rings */}
          <circle cx="500" cy="325" r="120" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="325" r="220" fill="none" stroke="rgba(71, 85, 105, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="325" r="320" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="1" />
          <line x1="500" y1="20" x2="500" y2="630" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="50" y1="325" x2="950" y2="325" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="1" strokeDasharray="6 6" />

          {/* Main Highway Arteries */}
          <g stroke="rgba(100, 116, 139, 0.25)" strokeWidth="3" fill="none">
            <path d="M 80 120 Q 320 280 500 325 T 920 540" />
            <path d="M 120 580 Q 420 420 500 325 T 880 120" />
            <path d="M 220 50 C 450 140, 550 480, 780 620" stroke="rgba(100, 116, 139, 0.18)" strokeWidth="2" />
          </g>

          {/* Weather Cloud & Rain Radar Layer */}
          {activeLayers.weather && isRaining && (
            <g className="transition-opacity duration-700">
              {/* Rain cloud vectors */}
              <ellipse cx="480" cy="310" rx="340" ry="240" fill="url(#storm-cloud)" />
              <ellipse cx="640" cy="380" rx="220" ry="170" fill="url(#storm-cloud)" />
              {/* Moving rain front lines */}
              <g stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1.2" strokeLinecap="round">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const rx = 240 + (idx * 28) % 520;
                  const ry = 180 + ((idx * 37) % 300);
                  return (
                    <line
                      key={idx}
                      x1={rx}
                      y1={ry}
                      x2={rx - 8}
                      y2={ry + 14}
                      className="animate-pulse"
                      style={{ animationDuration: `${0.8 + (idx % 4) * 0.3}s` }}
                    />
                  );
                })}
              </g>
            </g>
          )}

          {/* Demand Heatmap Layer */}
          {activeLayers.heatmap && (
            <g className="transition-opacity duration-500">
              {zones.map((zone) => {
                const cx = (zone.x / 100) * 1000;
                const cy = (zone.y / 100) * 650;
                const heatRadius = Math.max(70, Math.min(180, (zone.predictedRiders / 4) * 0.9));
                const isHighSurge = zone.surgeMultiplier >= 2.2;

                return (
                  <circle
                    key={`heat-${zone.id}`}
                    cx={cx}
                    cy={cy}
                    r={heatRadius}
                    fill={isHighSurge ? 'url(#heat-surge)' : 'url(#heat-moderate)'}
                    className="animate-pulse"
                    style={{ animationDuration: `${2 + (zone.deficit > 200 ? 1 : 2)}s` }}
                  />
                );
              })}
            </g>
          )}

          {/* Crowd Density Rings */}
          {activeLayers.crowd && (
            <g>
              {zones.map((zone) => {
                const cx = (zone.x / 100) * 1000;
                const cy = (zone.y / 100) * 650;
                const crowdScale = Math.min(75, 25 + zone.currentCrowd / 800);

                return (
                  <g key={`crowd-${zone.id}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={crowdScale}
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.35)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={crowdScale * 1.35}
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.15)"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Animated Sweeping Radar Scan Line */}
          <g className="animate-radar-sweep">
            <line x1="500" y1="325" x2="980" y2="325" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" />
            <path
              d="M 500 325 L 980 325 A 480 480 0 0 0 880 120 Z"
              fill="rgba(245, 158, 11, 0.04)"
            />
          </g>

          {/* Zone Nodes / Markers */}
          {zones.map((zone) => {
            const cx = (zone.x / 100) * 1000;
            const cy = (zone.y / 100) * 650;
            const isSelected = selectedZone?.id === zone.id;
            const isHovered = hoveredZone?.id === zone.id;
            const hasSevereDeficit = zone.deficit > 300;

            return (
              <g
                key={zone.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectZone(zone)}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {/* Selected Halo Ring */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="46"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    className="animate-spin"
                    style={{ animationDuration: '14s' }}
                  />
                )}

                {/* Outer Node Base */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered || isSelected ? 34 : 28}
                  fill={hasSevereDeficit ? 'rgba(239, 68, 68, 0.22)' : 'rgba(15, 23, 42, 0.85)'}
                  stroke={
                    isSelected
                      ? '#f59e0b'
                      : hasSevereDeficit
                      ? '#ef4444'
                      : zone.surgeMultiplier > 1.8
                      ? '#f59e0b'
                      : '#38bdf8'
                  }
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Inner Surge Multiplier Text */}
                <text
                  x={cx}
                  y={cy - 2}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="var(--font-mono)"
                >
                  {zone.surgeMultiplier}x
                </text>

                <text
                  x={cx}
                  y={cy + 13}
                  textAnchor="middle"
                  fill={zone.deficit > 0 ? '#fca5a5' : '#86efac'}
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {zone.deficit > 0 ? `-${zone.deficit}` : `+${Math.abs(zone.deficit)}`}
                </text>

                {/* Zone Label Banner */}
                <g transform={`translate(${cx}, ${cy + 42})`}>
                  <rect
                    x="-70"
                    y="-11"
                    width="140"
                    height="22"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke="rgba(71, 85, 105, 0.5)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {zone.name.split('&')[0].trim()}
                  </text>
                </g>

                {/* Active Crowd Event Badge */}
                {events.some((ev) => ev.zoneId === zone.id && ev.status !== 'cleared') && (
                  <g transform={`translate(${cx + 20}, ${cy - 24})`}>
                    <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Tooltip on Hover */}
        {hoveredZone && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs w-64"
            style={{
              left: `${Math.min(72, Math.max(12, hoveredZone.x))}%`,
              top: `${Math.min(70, Math.max(12, hoveredZone.y - 12))}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white text-xs truncate">{hoveredZone.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                {hoveredZone.surgeMultiplier}x Surge
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Riders Seeking:</span>
                <span className="text-amber-400 font-bold text-sm tabular-nums">
                  {hoveredZone.predictedRiders}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nearby Cabs:</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  {hoveredZone.availableCabs}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fleet Deficit:</span>
                <span
                  className={`font-bold tabular-nums ${
                    hoveredZone.deficit > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {hoveredZone.deficit > 0 ? `-${hoveredZone.deficit} cabs` : `+${Math.abs(hoveredZone.deficit)} surplus`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Wait Time:</span>
                <span className="text-slate-200 font-bold tabular-nums">
                  ~{hoveredZone.avgWaitTimeMin} min
                </span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Willingness to Hail:</span>
              <span className="text-amber-300 font-bold">{hoveredZone.hailWillingnessPct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Map Legend */}
      <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping-slow" />
            <span className="text-[11px]">Critical Deficit ({'>'}200 cabs)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px]">High Surge Multiplier ({'>'}2.0x)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-[11px]">Normal Equilibrium</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 hidden sm:block">
          Click any zone node to open deep demand analytics & staging directions
        </div>
      </div>
    </div>
  );
};
