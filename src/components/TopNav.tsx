/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Radio, RefreshCw, Send, Sparkles } from 'lucide-react';
import { WeatherCondition } from '../types/dispatch';

interface TopNavProps {
  activeTab: 'map' | 'prioritized' | 'onemap' | 'telemetry' | 'mcp';
  onSelectTab: (tab: 'map' | 'prioritized' | 'onemap' | 'telemetry' | 'mcp') => void;
  onOpenBroadcast: () => void;
  onOpenAiBriefing: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  simulatedWeather: WeatherCondition;
  onWeatherChange: (w: WeatherCondition) => void;
  mrtDisruptionActive: boolean;
  onToggleMrtDisruption: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenBroadcast,
  onOpenAiBriefing,
  onRefresh,
  isRefreshing,
  simulatedWeather,
  onWeatherChange,
  mrtDisruptionActive,
  onToggleMrtDisruption
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      {/* Top Bar: Exactly 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm shadow-emerald-500/10">
            GP
          </div>
          <button
            onClick={() => onSelectTab('map')}
            className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors cursor-pointer text-left"
          >
            GrabPulse SG
          </button>
        </div>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('map')}
            className={`cursor-pointer transition-colors hover:text-white pb-0.5 ${
              activeTab === 'map' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
            }`}
          >
            Demand Map
          </button>
          <button
            onClick={() => onSelectTab('prioritized')}
            className={`cursor-pointer transition-colors hover:text-white pb-0.5 ${
              activeTab === 'prioritized' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
            }`}
          >
            Prioritized Forecast
          </button>
          <button
            onClick={() => onSelectTab('onemap')}
            className={`cursor-pointer transition-colors hover:text-white pb-0.5 ${
              activeTab === 'onemap' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
            }`}
          >
            OneMap Routing
          </button>
          <button
            onClick={() => onSelectTab('telemetry')}
            className={`cursor-pointer transition-colors hover:text-white pb-0.5 ${
              activeTab === 'telemetry' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
            }`}
          >
            LTA & NEA Feeds
          </button>
          <button
            onClick={() => onSelectTab('mcp')}
            className={`cursor-pointer transition-colors hover:text-white pb-0.5 ${
              activeTab === 'mcp' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
            }`}
          >
            MCP Protocol Studio
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiBriefing}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            title="Generate AI Strategic Operations Briefing"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Fleet Briefing</span>
          </button>

          <button
            onClick={onOpenBroadcast}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Advisory</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Live Feeds"
            aria-label="Refresh telemetry feeds"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Secondary Operational Simulation Strip: Allows operator to test storm & breakdown scenarios */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Singapore Live Telemetry
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>LTA Datamall MCP Active</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>NEA Radar Synced</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>OneMap SLA Engine</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Weather condition override simulator */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="weather-select" className="text-slate-400">Simulate Weather:</label>
            <select
              id="weather-select"
              value={simulatedWeather}
              onChange={(e) => onWeatherChange(e.target.value as WeatherCondition)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Heavy Thundery Showers">Heavy Thundery Showers (Monsoon)</option>
              <option value="Thundery Showers">Thundery Showers</option>
              <option value="Moderate Rain">Moderate Rain</option>
              <option value="Passing Showers">Passing Showers</option>
              <option value="Cloudy">Cloudy (Overcast)</option>
              <option value="Fair (Day)">Fair & Clear</option>
            </select>
          </div>

          {/* MRT Disruption Toggle */}
          <button
            onClick={onToggleMrtDisruption}
            className={`px-2.5 py-0.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
              mrtDisruptionActive
                ? 'bg-red-500/20 text-red-300 border-red-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {mrtDisruptionActive ? 'MRT Disruption: ACTIVE' : 'MRT: Normal Ops'}
          </button>
        </div>
      </div>
    </header>
  );
};
