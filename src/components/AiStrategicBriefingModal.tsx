/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import avatarCommander from '../assets/images/avatar_fleet_commander_1790306034593.jpg';

interface AiStrategicBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherCondition: string;
  mrtDisruptionActive: boolean;
}

export const AiStrategicBriefingModal: React.FC<AiStrategicBriefingModalProps> = ({
  isOpen,
  onClose,
  weatherCondition,
  mrtDisruptionActive
}) => {
  const [briefingText, setBriefingText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBriefing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherCondition,
          mrtDisruption: mrtDisruptionActive
        })
      });
      const data = await res.json();
      setBriefingText(data.briefing || 'Unable to generate operational briefing.');
    } catch (e: any) {
      setBriefingText('Error connecting to operations intelligence engine: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBriefing();
    }
  }, [isOpen, weatherCondition, mrtDisruptionActive]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        {/* Header with Avatar & Title */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={avatarCommander}
              alt="Grab Singapore Operations Director"
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash Operations Intelligence
              </div>
              <h3 className="text-lg font-bold text-white">Grab Fleet Tactical Directive</h3>
              <p className="text-xs text-slate-400">Integrated telemetry synthesis (LTA Datamall + NEA Radar + SLA OneMap)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-300">Synthesizing Transit & Weather Telemetry...</div>
              <p className="text-xs text-slate-500">
                Evaluating commuter tap-outs, storm radar cells, and OneMap arterial bottlenecks across Singapore.
              </p>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 text-slate-200 text-xs leading-relaxed space-y-3 font-sans selection:bg-emerald-500 selection:text-black">
              {briefingText.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={fetchBriefing}
            disabled={isLoading}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-generate Directive</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
