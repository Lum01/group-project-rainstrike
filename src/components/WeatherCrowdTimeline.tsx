import React from 'react';
import { HourlyForecast, WeatherConditionType } from '../types/demand';
import { CloudRain, Sun, Wind, Thermometer, Droplets, Zap, TrendingUp, Sliders } from 'lucide-react';

interface WeatherCrowdTimelineProps {
  hourlyData: HourlyForecast[];
  selectedHourNum: number;
  onSelectHour: (hourNum: number) => void;
  scenario: 'rainy_evening' | 'summer_storm' | 'clear_day' | 'winter_chill';
  onChangeScenario: (scenario: 'rainy_evening' | 'summer_storm' | 'clear_day' | 'winter_chill') => void;
  manualPrecipOverride: number;
  onPrecipChange: (val: number) => void;
}

export const WeatherCrowdTimeline: React.FC<WeatherCrowdTimelineProps> = ({
  hourlyData,
  selectedHourNum,
  onSelectHour,
  scenario,
  onChangeScenario,
  manualPrecipOverride,
  onPrecipChange,
}) => {
  const selectedHourData = hourlyData.find((h) => h.hourNum === selectedHourNum) || hourlyData[0];

  const getWeatherIcon = (cond: WeatherConditionType) => {
    switch (cond) {
      case 'clear':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'thunderstorm':
        return <Zap className="w-4 h-4 text-amber-300" />;
      case 'heavy_rain':
      case 'light_rain':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'snow':
      case 'gusty_wind':
        return <Wind className="w-4 h-4 text-teal-300" />;
      default:
        return <CloudRain className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
      {/* Header and Scenario Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-400" />
            Weather Forecast & Taxi Demand Correlation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            24-hour predictive timeline showing precipitation impact on rider willingness to hail
          </p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-500 px-2 font-medium">Scenario:</span>
          <button
            onClick={() => onChangeScenario('rainy_evening')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              scenario === 'rainy_evening'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rainy Evening Peak
          </button>
          <button
            onClick={() => onChangeScenario('summer_storm')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              scenario === 'summer_storm'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flash Thunderstorm
          </button>
          <button
            onClick={() => onChangeScenario('winter_chill')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              scenario === 'winter_chill'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Winter Freezing Rain
          </button>
          <button
            onClick={() => onChangeScenario('clear_day')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              scenario === 'clear_day'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clear Skies Baseline
          </button>
        </div>
      </div>

      {/* Interactive Weather Severity Slider (What-If Tester) */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">What-If Rain Simulation</span>
              <span className="text-[11px] font-mono text-sky-400 font-bold tabular-nums">
                {manualPrecipOverride > 0 ? `${manualPrecipOverride} mm/h` : 'Using Forecast'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Drag to inject real-time rainstorm stress test and watch taxi queue surge instantly
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-72">
          <span className="text-[10px] text-slate-500 font-mono">0mm</span>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={manualPrecipOverride}
            onChange={(e) => onPrecipChange(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">25mm</span>
          {manualPrecipOverride > 0 && (
            <button
              onClick={() => onPrecipChange(0)}
              className="text-[10px] text-slate-400 hover:text-amber-400 underline shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 24-Hour Scroller Strip */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-[920px]">
          {hourlyData.map((h) => {
            const isSelected = h.hourNum === selectedHourNum;
            const hasHeavyRain = h.precipitationMm >= 6;
            const hasSurge = h.weatherDemandMultiplier >= 1.6;

            return (
              <button
                key={h.hour}
                onClick={() => onSelectHour(h.hourNum)}
                className={`flex-1 min-w-[70px] p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Hour */}
                <span className="text-[11px] font-mono text-slate-400 font-medium">{h.hour}</span>

                {/* Weather Icon */}
                <div className="my-0.5">{getWeatherIcon(h.condition)}</div>

                {/* Rain mm */}
                <div className="text-[10px] font-mono tabular-nums">
                  <span
                    className={
                      hasHeavyRain ? 'text-rose-400 font-bold' : h.precipitationMm > 0 ? 'text-sky-300' : 'text-slate-600'
                    }
                  >
                    {h.precipitationMm} mm
                  </span>
                </div>

                {/* Demand Multiplier Bar Height */}
                <div className="w-full bg-slate-900 rounded-full h-8 flex items-end p-0.5 mt-1">
                  <div
                    className={`w-full rounded-full transition-all ${
                      hasSurge ? 'bg-amber-500' : 'bg-sky-500/60'
                    }`}
                    style={{
                      height: `${Math.min(100, Math.max(15, (h.weatherDemandMultiplier - 0.8) * 80))}%`,
                    }}
                  />
                </div>

                {/* Demand Surge Multiplier */}
                <span className="text-[10px] font-mono font-semibold text-slate-200 tabular-nums">
                  {h.weatherDemandMultiplier}x
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Telemetry Detail Card */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Time Slot Selected
          </span>
          <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedHourData.hour}</div>
          <span className="text-[11px] text-slate-400 capitalize">
            {selectedHourData.condition.replace('_', ' ')}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Rainfall & Probability
          </span>
          <div className="text-sm font-bold text-sky-400 font-mono tabular-nums mt-0.5">
            {selectedHourData.precipitationMm} mm/h · {selectedHourData.rainProbability}% prob
          </div>
          <span className="text-[11px] text-slate-400">
            Wind: {selectedHourData.windSpeedKmh} km/h
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Citywide Taxi Riders
          </span>
          <div className="text-sm font-bold text-amber-400 font-mono tabular-nums mt-0.5">
            ~{selectedHourData.predictedCitywideRiders.toLocaleString()} hails/hr
          </div>
          <span className="text-[11px] text-slate-400">
            Weather Surge Factor: {selectedHourData.weatherDemandMultiplier}x
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
            Projected Fleet Deficit
          </span>
          <div
            className={`text-sm font-bold font-mono tabular-nums mt-0.5 ${
              selectedHourData.fleetDeficitCitywide > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {selectedHourData.fleetDeficitCitywide > 0
              ? `-${selectedHourData.fleetDeficitCitywide} cabs needed`
              : 'Fleet Balanced'}
          </div>
          <span className="text-[11px] text-slate-400">
            Surge window: ~{selectedHourData.precipitationMm > 6 ? '90 mins' : '45 mins'}
          </span>
        </div>
      </div>
    </div>
  );
};
