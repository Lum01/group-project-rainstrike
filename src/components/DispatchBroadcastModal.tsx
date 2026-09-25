/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TransportHub } from '../types/dispatch';
import { X, Send, Radio, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

interface DispatchBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  hubs: TransportHub[];
  selectedHub: TransportHub;
  onBroadcastSuccess: (result: any) => void;
}

export const DispatchBroadcastModal: React.FC<DispatchBroadcastModalProps> = ({
  isOpen,
  onClose,
  hubs,
  selectedHub: initialHub,
  onBroadcastSuccess
}) => {
  const [targetHubId, setTargetHubId] = useState<string>(initialHub?.id || hubs[0].id);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(initialHub?.prediction.surgeMultiplier || 1.8);
  const [bonusIncentive, setBonusIncentive] = useState<number>(5.50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHub = hubs.find(h => h.id === targetHubId) || hubs[0];
  const reachableDrivers = Math.round(currentHub.prediction.recommendedDriverReposition * 2.4);

  const handleBroadcast = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/dispatch/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hubId: currentHub.id,
          surgeMultiplier,
          bonusIncentive
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully broadcasted push alert to ${data.broadcast.driversTargeted} drivers!`);
        onBroadcastSuccess(data.broadcast);
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1600);
      } else {
        setStatusMessage('Broadcast failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      setStatusMessage('Network error: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Broadcast Driver Surge Advisory</h3>
              <p className="text-xs text-slate-400">Push high-priority corridor re-routing to Grab Driver Partner app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hub Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Target Transport Hub Hotspot:</label>
          <select
            value={targetHubId}
            onChange={(e) => {
              setTargetHubId(e.target.value);
              const found = hubs.find(h => h.id === e.target.value);
              if (found) setSurgeMultiplier(found.prediction.surgeMultiplier);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {hubs.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} (TDI: {h.prediction.taxiDemandIndex} · Deficit: {h.prediction.supplyDeficit} cabs)
              </option>
            ))}
          </select>
        </div>

        {/* Incentive & Multiplier Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Surge Multiplier Guarantee:</label>
            <input
              type="number"
              step="0.05"
              min="1.0"
              max="2.5"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[11px] text-slate-500">Suggested: {currentHub.prediction.surgeMultiplier}x</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bonus Incentive (SGD):</label>
            <input
              type="number"
              step="0.5"
              min="0.0"
              max="20.0"
              value={bonusIncentive}
              onChange={(e) => setBonusIncentive(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[11px] text-slate-500">Flat completion payout</span>
          </div>
        </div>

        {/* OneMap Ingress Corridor Directive to be pushed */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <Navigation className="w-3.5 h-3.5" />
            Embedded OneMap Driver Navigation Corridor
          </div>
          <div className="text-slate-200 font-medium">{currentHub.routing.ingress.corridorName}</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Advise drivers: &quot;{currentHub.routing.ingress.instructions[0]}&quot; · Best window: {currentHub.routing.ingress.bestTimeToEnter}.
          </p>
        </div>

        {/* Fleet Reach Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono tabular-nums">
          <span>Drivers within 8km catchment:</span>
          <span className="text-white font-bold font-sans">~{reachableDrivers} active vehicles</span>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleBroadcast}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Broadcasting Push...' : 'Send Fleet Advisory'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
