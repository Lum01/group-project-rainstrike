import React from 'react';
import { AIDispatchReport, ZoneData, CityPreset } from '../types/demand';
import { Sparkles, Navigation, Clock, ShieldCheck, Flame, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import analystAvatar from '../assets/images/fleet_analyst_avatar_1790305497989.jpg';

interface AIDispatchAdvisorProps {
  report: AIDispatchReport | null;
  isLoading: boolean;
  onRefresh: () => void;
  city: CityPreset;
  onSelectZoneByName: (zoneName: string) => void;
  onDispatchToZone: (zoneName: string, count: number) => void;
}

export const AIDispatchAdvisor: React.FC<AIDispatchAdvisorProps> = ({
  report,
  isLoading,
  onRefresh,
  city,
  onSelectZoneByName,
  onDispatchToZone,
}) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={analystAvatar}
              alt="Dispatch AI Analyst"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                AI Dispatch Operations Strategist
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous crowd & microclimate synthesis for optimal vehicle repositioning
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Synthesizing...' : 'Regenerate Tactical Analysis'}
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-medium">
            Synthesizing Doppler rain radar, venue schedules, and transit bottleneck feeds...
          </p>
          <span className="text-[11px] text-slate-500 font-mono">
            Optimizing fleet positioning vectors across {city.name}
          </span>
        </div>
      ) : !report ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          No dispatch report available. Click "Regenerate Tactical Analysis" to run the engine.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Executive Summary Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
              Executive Dispatch Intelligence
            </span>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Core Decision Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Top Priority Target
              </span>
              <div className="text-sm font-bold text-white font-mono truncate mt-0.5">
                {report.topPriorityZone}
              </div>
              <button
                onClick={() => onSelectZoneByName(report.topPriorityZone)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 mt-1 font-semibold"
              >
                Inspect Zone <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Recommended Staging
              </span>
              <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-0.5">
                {report.recommendedFleetRelocation} Cabs
              </div>
              <span className="text-[11px] text-slate-400">Pre-position before gridlock</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Surge Window
              </span>
              <div className="text-xl font-bold text-sky-400 font-mono tabular-nums mt-0.5">
                ~{report.surgeWindowMinutes} Mins
              </div>
              <span className="text-[11px] text-slate-400">Duration until crowd clears</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Est. Fare Multiplier
              </span>
              <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                {report.estimatedFareMultiplier}x
              </div>
              <span className="text-[11px] text-slate-400">
                Confidence: {(report.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Strategic Demand Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.strategicInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Action Items */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tactical Fleet Coordinator Action Items
            </h3>
            <div className="space-y-2">
              {report.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onDispatchToZone(report.topPriorityZone, report.recommendedFleetRelocation)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg flex items-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 -rotate-45" />
                Execute Recommended Staging ({report.recommendedFleetRelocation} Units)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
