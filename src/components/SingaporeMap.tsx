/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TransportHub } from '../types/dispatch';
import { CloudRain, Navigation, ArrowUpRight, ShieldAlert, Layers } from 'lucide-react';

interface SingaporeMapProps {
  hubs: TransportHub[];
  selectedHub: TransportHub;
  onSelectHub: (hub: TransportHub) => void;
  onInspectOneMapRoute: (hub: TransportHub) => void;
  onBroadcastForHub: (hub: TransportHub) => void;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  hubs,
  selectedHub,
  onSelectHub,
  onInspectOneMapRoute,
  onBroadcastForHub
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const weatherLayerRef = useRef<L.LayerGroup | null>(null);

  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true);
  const [showRoutesOverlay, setShowRoutesOverlay] = useState(true);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Singapore Coordinates: 1.3521, 103.8198
    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 12,
      minZoom: 11,
      maxZoom: 16,
      zoomControl: false
    });

    // Open basemap tiles: OpenStreetMap with dark tactical filter (Zero API key required)
    const openBasemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors · SLA OneMap SG · LTA Datamall MCP',
      maxZoom: 18,
      className: 'osm-dark-tiles'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    weatherLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Route Layers whenever hubs or selectedHub change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !routeLayerRef.current || !weatherLayerRef.current) return;

    layerGroupRef.current.clearLayers();
    routeLayerRef.current.clearLayers();
    weatherLayerRef.current.clearLayers();

    // 1. Weather Rain Radar Cells (NEA)
    if (showWeatherOverlay) {
      hubs.forEach(hub => {
        if (hub.weather.rainfallRateMmHr > 10) {
          const radius = hub.weather.rainfallRateMmHr > 30 ? 4500 : 3000;
          const isSevere = hub.weather.rainfallRateMmHr > 30;

          L.circle(hub.coordinates, {
            radius,
            color: isSevere ? '#ef4444' : '#38bdf8',
            fillColor: isSevere ? '#ef4444' : '#0284c7',
            fillOpacity: 0.18,
            weight: 1,
            dashArray: '4, 6'
          }).bindTooltip(`NEA Radar: ${hub.weather.condition} (${hub.weather.rainfallRateMmHr} mm/hr)`, {
            direction: 'top',
            className: 'bg-slate-900 text-slate-100 text-xs px-2 py-1 border border-slate-700 rounded'
          }).addTo(weatherLayerRef.current!);
        }
      });
    }

    // 2. Transport Hub Markers
    hubs.forEach(hub => {
      const isSelected = hub.id === selectedHub.id;
      const tdi = hub.prediction.taxiDemandIndex;
      const priority = hub.prediction.priority;

      // Determine marker color by demand priority
      const ringColor = priority === 'critical' 
        ? '#ef4444' 
        : priority === 'high' 
          ? '#f59e0b' 
          : priority === 'moderate' 
            ? '#10b981' 
            : '#64748b';

      const customIcon = L.divIcon({
        className: 'custom-hub-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${priority === 'critical' ? `<span class="absolute w-8 h-8 rounded-full animate-ping opacity-60" style="background-color: ${ringColor}"></span>` : ''}
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-slate-950 font-bold text-[11px] shadow-lg border-2 transition-transform duration-200 ${isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}" style="background-color: ${ringColor}; border-color: ${isSelected ? '#ffffff' : '#0f172a'}">
              ${tdi}
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] text-slate-200 font-medium pointer-events-none shadow">
              ${hub.shortName}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(hub.coordinates, { icon: customIcon }).addTo(layerGroupRef.current!);
      marker.on('click', () => {
        onSelectHub(hub);
      });
    });

    // 3. OneMap Ingress & Egress Route Polylines for Selected Hub
    if (showRoutesOverlay && selectedHub) {
      const ingressCoords = selectedHub.routing.ingress.routeCoordinates;
      const egressCoords = selectedHub.routing.egress.routeCoordinates;

      // Ingress Polyline (Emerald Green)
      if (ingressCoords && ingressCoords.length > 1) {
        L.polyline(ingressCoords, {
          color: '#10b981',
          weight: 4,
          opacity: 0.9,
          lineCap: 'round',
          dashArray: undefined
        }).bindTooltip(`OneMap Ingress: ${selectedHub.routing.ingress.corridorName} (${selectedHub.routing.ingress.currentDurationMins}m)`, {
          sticky: true,
          className: 'bg-slate-900 text-emerald-300 text-xs px-2 py-1 border border-emerald-800 rounded'
        }).addTo(routeLayerRef.current!);

        // Start marker of ingress
        L.circleMarker(ingressCoords[0], {
          radius: 5,
          color: '#10b981',
          fillColor: '#059669',
          fillOpacity: 1
        }).bindTooltip('Corridor Ingress Start', { direction: 'left' }).addTo(routeLayerRef.current!);
      }

      // Egress Polyline (Cyan/Sky)
      if (egressCoords && egressCoords.length > 1) {
        L.polyline(egressCoords, {
          color: '#38bdf8',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 6'
        }).bindTooltip(`OneMap Egress: ${selectedHub.routing.egress.corridorName} (${selectedHub.routing.egress.currentDurationMins}m)`, {
          sticky: true,
          className: 'bg-slate-900 text-sky-300 text-xs px-2 py-1 border border-sky-800 rounded'
        }).addTo(routeLayerRef.current!);
      }
    }
  }, [hubs, selectedHub, showWeatherOverlay, showRoutesOverlay, onSelectHub]);

  // Pan to selected hub when changed
  useEffect(() => {
    if (mapInstanceRef.current && selectedHub) {
      mapInstanceRef.current.flyTo(selectedHub.coordinates, 13, { duration: 0.8 });
    }
  }, [selectedHub.id]);

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/90 backdrop-blur border border-slate-800 rounded-lg p-1.5 shadow-lg">
        <span className="text-xs font-semibold text-slate-300 px-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Layers
        </span>
        <button
          onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            showWeatherOverlay ? 'bg-slate-800 text-sky-400 border border-sky-500/30' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          NEA Rain Radar
        </button>
        <button
          onClick={() => setShowRoutesOverlay(!showRoutesOverlay)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            showRoutesOverlay ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          OneMap Ingress/Egress
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 shadow-lg text-xs space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Taxi Demand Index (TDI)</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-300">Critical (&ge;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">High (65-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Moderate (45-64)</span>
          </div>
        </div>
      </div>

      {/* Selected Hub Floating Quick Drawer */}
      <div className="absolute top-4 right-4 z-10 w-80 sm:w-96 bg-slate-950/95 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-slate-400 font-medium">{selectedHub.region} Sector · {selectedHub.category}</div>
            <h3 className="text-base font-bold text-white leading-snug">{selectedHub.name}</h3>
          </div>
          <div className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
            selectedHub.prediction.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            selectedHub.prediction.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            TDI {selectedHub.prediction.taxiDemandIndex}
          </div>
        </div>

        {/* Real-time stats grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Weather (NEA)</span>
            <div className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>{selectedHub.weather.condition}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">{selectedHub.weather.rainfallRateMmHr} mm/hr</span>
          </div>
          <div>
            <span className="text-slate-500">Projected Demand</span>
            <div className="text-emerald-400 font-semibold font-mono tabular-nums text-sm mt-0.5">
              ~{selectedHub.prediction.projectedDemandPerMin} req / min
            </div>
            <span className="text-[11px] text-slate-500">Deficit: <span className="text-red-400 font-mono tabular-nums font-semibold">+{selectedHub.prediction.supplyDeficit} cabs</span></span>
          </div>
          <div>
            <span className="text-slate-500">LTA Station Inflow</span>
            <div className="text-slate-200 font-mono tabular-nums font-medium mt-0.5">
              {selectedHub.humanTraffic.mrtTapOutPerMin} tap-outs/min
            </div>
          </div>
          <div>
            <span className="text-slate-500">Available Taxis (1km)</span>
            <div className="text-slate-200 font-mono tabular-nums font-medium mt-0.5">
              {selectedHub.taxiSupply.availableTaxisInArea} cabs (Queue: {selectedHub.taxiSupply.queueLengthCommuters})
            </div>
          </div>
        </div>

        {/* Disruption Warning if active */}
        {selectedHub.humanTraffic.disruptionAlert && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-red-300">{selectedHub.humanTraffic.disruptionAlert.line}: </span>
              {selectedHub.humanTraffic.disruptionAlert.message}
            </div>
          </div>
        )}

        {/* OneMap Routing Quick Summary */}
        <div className="text-xs space-y-1 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase flex items-center justify-between">
            <span>OneMap Ingress Corridor</span>
            <span className="text-slate-400 font-mono tabular-nums">{selectedHub.routing.ingress.currentDurationMins} mins</span>
          </div>
          <div className="text-slate-300 font-medium">{selectedHub.routing.ingress.corridorName}</div>
          <div className="text-slate-500 text-[11px]">
            Best Time to Enter: <span className="text-slate-200 font-medium">{selectedHub.routing.ingress.bestTimeToEnter}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onInspectOneMapRoute(selectedHub)}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <span>OneMap Deep Dive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onBroadcastForHub(selectedHub)}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20"
          >
            <span>Dispatch Fleet</span>
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
