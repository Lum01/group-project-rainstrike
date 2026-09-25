import React from 'react';
import { CloudRain, Navigation, MapPin, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { CITIES } from '../data/cityData';
import { CityPreset } from '../types/demand';

interface HeaderProps {
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  activeTab: 'radar' | 'timeline' | 'events' | 'modeshift' | 'ai_advisor';
  onSelectTab: (tab: 'radar' | 'timeline' | 'events' | 'modeshift' | 'ai_advisor') => void;
  currentHourStr: string;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onTriggerAIDispatch: () => void;
  isAILoading: boolean;
  hasTransitDisruption: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  activeTab,
  onSelectTab,
  currentHourStr,
  isSimulating,
  onToggleSimulate,
  onTriggerAIDispatch,
  isAILoading,
  hasTransitDisruption,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Zone 1: Single Wordmark Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Navigation className="w-5 h-5 -rotate-45" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            TaxiPulse
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
        <button
          onClick={() => onSelectTab('radar')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'radar'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Demand Radar
        </button>
        <button
          onClick={() => onSelectTab('timeline')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          24h Weather & Demand
        </button>
        <button
          onClick={() => onSelectTab('events')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'events'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Crowd Venues & Egress
          {selectedCity.events.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono">
              {selectedCity.events.length}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('modeshift')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'modeshift'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Rider Mode Elasticity
        </button>
        <button
          onClick={() => onSelectTab('ai_advisor')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ai_advisor'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Dispatch Strategist
        </button>
      </nav>

      {/* Zone 3: Actions & City Selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* City Selector */}
        <div className="relative">
          <select
            value={selectedCity.id}
            onChange={(e) => {
              const found = CITIES.find((c) => c.id === e.target.value);
              if (found) onSelectCity(found);
            }}
            className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>

        {/* Time Simulator Clock */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-slate-200 tabular-nums">{currentHourStr}</span>
          <button
            onClick={onToggleSimulate}
            title={isSimulating ? 'Pause 15m time tick' : 'Play 15m time tick'}
            className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              isSimulating
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isSimulating ? 'Pause' : 'Simulate'}
          </button>
        </div>

        {/* AI Tactical Dispatch Refresh */}
        <button
          onClick={onTriggerAIDispatch}
          disabled={isAILoading}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAILoading ? 'animate-spin' : ''}`} />
          {isAILoading ? 'Analyzing...' : 'AI Dispatch Intel'}
        </button>
      </div>
    </header>
  );
};
