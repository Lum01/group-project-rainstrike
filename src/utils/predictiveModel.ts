/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransportHub, WeatherCondition, PriorityLevel } from '../types/dispatch';

export interface ModelParameters {
  weatherCondition?: WeatherCondition;
  isPeakRushHour?: boolean;
  mrtDisruptionActive?: boolean;
  timeOfDay?: string; // HH:MM
}

/**
 * Weather multiplier mapping: Rain strongly drives taxi booking conversion
 * Commuters in Singapore abandon unsheltered walking paths and bus stops during downpours.
 */
export function getWeatherMultiplier(condition: WeatherCondition): number {
  switch (condition) {
    case 'Heavy Thundery Showers':
      return 2.15;
    case 'Thundery Showers':
      return 1.85;
    case 'Heavy Rain':
      return 1.75;
    case 'Moderate Rain':
      return 1.45;
    case 'Passing Showers':
    case 'Light Rain':
    case 'Light Showers':
      return 1.25;
    case 'Cloudy':
    case 'Partly Cloudy (Day)':
    case 'Partly Cloudy (Night)':
      return 1.05;
    case 'Fair (Day)':
    case 'Fair (Night)':
    default:
      return 1.0;
  }
}

/**
 * Evaluates transport hub and re-calculates predictive metrics
 */
export function evaluateHubDemand(hub: TransportHub, params?: ModelParameters): TransportHub {
  const weather = params?.weatherCondition || hub.weather.condition;
  const weatherMult = getWeatherMultiplier(weather);

  // Check disruption factor
  const hasDisruption = params?.mrtDisruptionActive !== undefined 
    ? params.mrtDisruptionActive 
    : !!hub.humanTraffic.disruptionAlert;
  const disruptionMult = hasDisruption ? 1.55 : 1.0;

  // Base commuter cab conversion rate (typically 8% - 15% of arrivals seek taxi/private hire)
  const baseConversionRate = hub.category === 'Airport' 
    ? 0.22 
    : hub.category === 'CBD Hub' || hub.category === 'Retail Gateway' 
      ? 0.14 
      : 0.09;

  // Arrival rate per minute
  const totalInflowPerMin = hub.humanTraffic.mrtTapOutPerMin + hub.humanTraffic.busArrivalPerMin + (hub.humanTraffic.flightArrivalsNextHour ? hub.humanTraffic.flightArrivalsNextHour * 2.8 : 0);

  // Projected bookings per min
  const rawProjectedDemand = Math.round(totalInflowPerMin * baseConversionRate * weatherMult * disruptionMult);
  
  // Available ground supply
  const availableSupply = Math.max(1, hub.taxiSupply.availableTaxisInArea);

  // Supply deficit
  const supplyDeficit = Math.max(0, Math.round(rawProjectedDemand - (availableSupply * 0.35)));

  // Taxi Demand Index (TDI) formula: 
  // Ratio of demand to supply multiplied by queue severity & rain factor, bounded to 0-100
  const demandSupplyRatio = rawProjectedDemand / availableSupply;
  const queuePressure = Math.min(30, Math.round(hub.taxiSupply.queueLengthCommuters * 0.25));
  const rawTDI = Math.round((demandSupplyRatio * 45) + queuePressure);
  const taxiDemandIndex = Math.min(100, Math.max(15, rawTDI));

  // Determine priority level
  let priority: PriorityLevel = 'stable';
  if (taxiDemandIndex >= 80) {
    priority = 'critical';
  } else if (taxiDemandIndex >= 65) {
    priority = 'high';
  } else if (taxiDemandIndex >= 45) {
    priority = 'moderate';
  }

  // Calculate dynamic surge pricing recommendation (1.0x to 2.4x)
  const surgeMultiplier = Number(Math.min(2.4, Math.max(1.0, 1.0 + ((taxiDemandIndex - 40) / 45))).toFixed(2));

  // Recommended fleet reposition
  const recommendedDriverReposition = Math.max(5, Math.round(supplyDeficit * 1.3));

  // Generate tactical driver reason
  let keyDriverReason = `${weather} active. `;
  if (hasDisruption) {
    keyDriverReason += 'Active MRT line disruption causing major commuter transfer spillover. ';
  }
  if (hub.humanTraffic.flightArrivalsNextHour && hub.humanTraffic.flightArrivalsNextHour > 20) {
    keyDriverReason += `${hub.humanTraffic.flightArrivalsNextHour} scheduled flight waves landing within 60 mins. `;
  }
  if (hub.taxiSupply.queueLengthCommuters > 50) {
    keyDriverReason += `Taxi stand queue exceeds ${hub.taxiSupply.queueLengthCommuters} commuters (est. wait ${hub.taxiSupply.averageWaitTimeMins} mins).`;
  }

  return {
    ...hub,
    weather: {
      ...hub.weather,
      condition: weather,
      rainStatus: weatherMult >= 1.8 ? 'heavy_deluge' : weatherMult >= 1.4 ? 'moderate' : weatherMult > 1.1 ? 'light' : 'none'
    },
    prediction: {
      taxiDemandIndex,
      priority,
      projectedDemandPerMin: rawProjectedDemand,
      supplyDeficit,
      surgeMultiplier,
      weatherMultiplier: Number(weatherMult.toFixed(2)),
      disruptionMultiplier: Number(disruptionMult.toFixed(2)),
      recommendedDriverReposition,
      keyDriverReason
    }
  };
}

/**
 * Returns prioritized list of hubs sorted by demand urgency (highest TDI first)
 */
export function getPrioritizedHubList(hubs: TransportHub[], params?: ModelParameters): TransportHub[] {
  const evaluated = hubs.map(h => evaluateHubDemand(h, params));
  return evaluated.sort((a, b) => b.prediction.taxiDemandIndex - a.prediction.taxiDemandIndex);
}
