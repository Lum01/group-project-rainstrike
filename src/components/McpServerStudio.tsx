/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REGISTERED_MCP_TOOLS } from '../data/singaporeHubs';
import { Terminal, Play, CheckCircle2, AlertCircle, Copy, Cpu, Layers } from 'lucide-react';

export const McpServerStudio: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>(REGISTERED_MCP_TOOLS[3].name); // grab_predict_taxi_surge
  const [toolArgs, setToolArgs] = useState<string>(
    JSON.stringify({ hub_id: 'jurong_east', weather_override: 'Heavy Thundery Showers', mrt_disruption_override: true }, null, 2)
  );
  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'resources'>('tools');
  const [selectedResource, setSelectedResource] = useState<string>('lta://singapore/transport-hubs');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executionResponse, setExecutionResponse] = useState<any>(null);
  const [executionLatencyMs, setExecutionLatencyMs] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeToolDef = REGISTERED_MCP_TOOLS.find(t => t.name === selectedTool) || REGISTERED_MCP_TOOLS[0];

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    const def = REGISTERED_MCP_TOOLS.find(t => t.name === toolName);
    if (!def) return;

    // Preset sensible default parameters
    let defaultArgs: any = {};
    if (toolName === 'lta_datamall_get_hub_passenger_traffic') {
      defaultArgs = { hub_id: 'jurong_east', include_mrt_alerts: true };
    } else if (toolName === 'nea_weather_get_forecast') {
      defaultArgs = { sector: 'Jurong' };
    } else if (toolName === 'onemap_get_hub_ingress_egress') {
      defaultArgs = { hub_id: 'changi_airport', time_slot: '17:45' };
    } else if (toolName === 'onemap_get_open_map_layer') {
      defaultArgs = { layer_type: 'night_basemap' };
    } else if (toolName === 'grab_predict_taxi_surge') {
      defaultArgs = { hub_id: 'all', weather_override: 'Heavy Thundery Showers' };
    } else if (toolName === 'grab_get_prioritized_taxi_demand_list') {
      defaultArgs = { min_priority: 'all' };
    } else if (toolName === 'grab_dispatch_fleet_broadcast') {
      defaultArgs = { hub_id: 'jurong_east', bonus_incentive_sgd: 6.0, surge_multiplier: 2.1 };
    }

    setToolArgs(JSON.stringify(defaultArgs, null, 2));
  };

  const executeMcpTool = async () => {
    setIsLoading(true);
    setExecutionResponse(null);
    setExecutionLatencyMs(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(toolArgs);
    } catch (e: any) {
      setExecutionResponse({ error: `JSON parsing error: ${e.message}` });
      setIsLoading(false);
      return;
    }

    const payload = {
      jsonrpc: '2.0',
      id: `call-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: selectedTool,
        arguments: parsedArgs
      }
    };

    const startTime = performance.now();
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionLatencyMs(elapsed);
      setExecutionResponse(data);
    } catch (err: any) {
      setExecutionResponse({ error: `Network error: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const readMcpResource = async () => {
    setIsLoading(true);
    setExecutionResponse(null);
    setExecutionLatencyMs(null);

    const payload = {
      jsonrpc: '2.0',
      id: `read-${Date.now()}`,
      method: 'resources/read',
      params: {
        uri: selectedResource
      }
    };

    const startTime = performance.now();
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionLatencyMs(elapsed);
      setExecutionResponse(data);
    } catch (err: any) {
      setExecutionResponse({ error: `Network error: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!executionResponse) return;
    navigator.clipboard.writeText(JSON.stringify(executionResponse, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Model Context Protocol (MCP) Server Architecture
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Singapore Transit MCP Protocol Studio
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real JSON-RPC 2.0 MCP interface integrating LTA Datamall, NEA Weather, OneMap Routing, and Grab Predictive Models.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveSubTab('tools')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tools' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Tools ({REGISTERED_MCP_TOOLS.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('resources')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'resources' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Resources (3)</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'tools' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Registered Tools List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Registered MCP Tools
            </span>
            <div className="space-y-1.5">
              {REGISTERED_MCP_TOOLS.map(tool => {
                const isSelected = tool.name === selectedTool;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleToolSelect(tool.name)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-slate-200 truncate">
                      {tool.name}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Execution Workspace & JSON-RPC Viewer (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tool Details & Input Schema */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs text-emerald-400 font-mono">tools/call</span>
                  <h3 className="text-base font-bold text-white font-mono">{activeToolDef.name}</h3>
                </div>
                <button
                  onClick={executeMcpTool}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Execute MCP Tool</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeToolDef.description}
              </p>

              {/* JSON Arguments Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Input Arguments (JSON):</span>
                  <span className="text-[11px] text-slate-500 font-normal">JSON-RPC 2.0 params.arguments</span>
                </label>
                <textarea
                  rows={5}
                  value={toolArgs}
                  onChange={(e) => setToolArgs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 selection:bg-emerald-500 selection:text-black"
                />
              </div>
            </div>

            {/* Output Panel: JSON-RPC 2.0 Response */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-slate-300 font-medium">JSON-RPC 2.0 MCP Response</span>
                  {executionLatencyMs !== null && (
                    <span className="text-slate-500 font-mono tabular-nums">· {executionLatencyMs}ms</span>
                  )}
                </div>

                {executionResponse && (
                  <button
                    onClick={copyToClipboard}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="p-4 max-h-[380px] overflow-auto">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 py-6 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Executing tool call on Singapore transit MCP server...
                  </div>
                ) : executionResponse ? (
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-emerald-500 selection:text-black">
                    {JSON.stringify(executionResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="text-xs text-slate-500 text-center py-8">
                    Click &quot;Execute MCP Tool&quot; above to trigger live execution and view the JSON-RPC response.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Resources Tab */
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Registered MCP Transit Resources</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exposes read-only transit feeds as MCP URI schemes (`lta://`, `nea://`, `onemap://`) for LLM agents and external operator consoles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { uri: 'lta://singapore/transport-hubs', title: 'LTA Passenger Flows', desc: 'Commuter tap-out volumes & active train alerts' },
                { uri: 'nea://singapore/weather-nowcast', title: 'NEA Rain Nowcast', desc: '2-hour rain radar intensity & cloudburst probabilities' },
                { uri: 'onemap://singapore/traffic-routing-matrix', title: 'OneMap SG Routing', desc: 'Ingress & egress corridors with ERP avoidance' }
              ].map(res => (
                <div
                  key={res.uri}
                  onClick={() => setSelectedResource(res.uri)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                    selectedResource === res.uri
                      ? 'bg-slate-900 border-emerald-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-mono text-emerald-400 truncate">{res.uri}</div>
                  <div className="text-sm font-bold text-white">{res.title}</div>
                  <div className="text-[11px] text-slate-400">{res.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={readMcpResource}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Read Resource ({selectedResource})</span>
              </button>
            </div>
          </div>

          {/* Resource Output */}
          {executionResponse && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-96 overflow-auto">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(executionResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
