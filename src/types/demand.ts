export type WeatherConditionType =
  | 'clear'
  | 'cloudy'
  | 'light_rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'gusty_wind';

export interface ZoneData {
  id: string;
  name: string;
  category: 'transit' | 'sports_arena' | 'nightlife' | 'commercial' | 'airport' | 'shopping' | 'residential';
  x: number; // 0 to 100 for SVG/canvas coordinates
  y: number; // 0 to 100 for SVG/canvas coordinates
  radius: number;
  currentCrowd: number;
  peakCapacity: number;
  crowdTrend: number; // percentage change, e.g. +22%
  baselineDemand: number; // baseline taxi trips/hr
  predictedRiders: number; // predicted riders looking for a cab right now
  availableCabs: number; // nearby available taxis
  deficit: number; // predictedRiders - availableCabs
  surgeMultiplier: number; // e.g. 1.0 to 3.2
  avgWaitTimeMin: number;
  hailWillingnessPct: number; // % of crowd in zone likely to hail taxi
  avgFareEstimate: number; // in local currency
  chokepointDelayMin: number;
}

export interface CrowdEvent {
  id: string;
  venueName: string;
  eventName: string;
  type: 'sports' | 'concert' | 'conference' | 'flight_surge' | 'transit_breakdown' | 'nightlife';
  zoneId: string;
  totalAttendees: number;
  egressStartTime: string;
  egressPeakTime: string;
  status: 'upcoming' | 'ongoing' | 'egress_soon' | 'dispersing' | 'cleared';
  projectedTaxiSharePct: number;
  projectedTaxiDemand: number;
  recommendedStagingPoint: string;
}

export interface HourlyForecast {
  hour: string; // e.g. "17:00"
  hourNum: number;
  tempC: number;
  condition: WeatherConditionType;
  precipitationMm: number;
  rainProbability: number;
  windSpeedKmh: number;
  weatherDemandMultiplier: number;
  predictedCitywideRiders: number;
  fleetDeficitCitywide: number;
}

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
  description: string;
  zones: ZoneData[];
  events: CrowdEvent[];
  transitAlerts: {
    line: string;
    status: 'normal' | 'delayed' | 'suspended';
    description: string;
    impactZoneId: string;
  }[];
}

export interface AIDispatchReport {
  summary: string;
  topPriorityZone: string;
  recommendedFleetRelocation: number;
  surgeWindowMinutes: number;
  estimatedFareMultiplier: number;
  strategicInsights: string[];
  actionItems: string[];
  confidenceScore: number;
  timestamp?: string;
}
