/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WeatherCondition = 
  | 'Fair (Day)' 
  | 'Fair (Night)' 
  | 'Partly Cloudy (Day)' 
  | 'Partly Cloudy (Night)' 
  | 'Cloudy' 
  | 'Light Rain' 
  | 'Light Showers' 
  | 'Moderate Rain' 
  | 'Heavy Rain' 
  | 'Passing Showers' 
  | 'Thundery Showers' 
  | 'Heavy Thundery Showers' 
  | 'Hazy';

export type PriorityLevel = 'critical' | 'high' | 'moderate' | 'stable';

export interface TransportHub {
  id: string;
  name: string;
  shortName: string;
  code: string;
  region: 'East' | 'West' | 'North' | 'Central' | 'South' | 'North-East';
  coordinates: [number, number]; // [lat, lng]
  category: 'Airport' | 'Integrated Interchange' | 'CBD Hub' | 'Retail Gateway' | 'Ferry/Port' | 'Tech Hub';
  description: string;
  
  // LTA Datamall Metrics
  humanTraffic: {
    hourlyInflow: number; // commuters arriving / hour
    hourlyOutflow: number;
    mrtTapOutPerMin: number;
    busArrivalPerMin: number;
    flightArrivalsNextHour?: number;
    trend: 'rising' | 'peaking' | 'easing' | 'stable';
    disruptionAlert?: {
      line: string;
      message: string;
      delayMins: number;
      severity: 'moderate' | 'critical';
    };
  };

  // Ground Supply & Taxi Stands
  taxiSupply: {
    availableTaxisInArea: number; // within 1km
    queueLengthCommuters: number; // people waiting at taxi stands
    averageWaitTimeMins: number;
    unmetRequestsPerMin: number;
    historicalAverageSupply: number;
  };

  // NEA Weather Metrics
  weather: {
    condition: WeatherCondition;
    temperatureC: number;
    rainfallRateMmHr: number;
    stormOnsetProbability: number; // 0 - 100%
    nowcastWindow: string; // e.g. "Next 2 Hours"
    rainStatus: 'none' | 'light' | 'moderate' | 'heavy_deluge';
  };

  // Events & Special Conditions
  events?: {
    name: string;
    venue: string;
    estimatedCrowd: number;
    egressTime: string;
  }[];

  // Predictive Model Synthesis
  prediction: {
    taxiDemandIndex: number; // 0 - 100
    priority: PriorityLevel;
    projectedDemandPerMin: number; // estimated booking requests per min
    supplyDeficit: number; // unmet cabs
    surgeMultiplier: number; // e.g. 1.8x
    weatherMultiplier: number;
    disruptionMultiplier: number;
    recommendedDriverReposition: number;
    keyDriverReason: string;
  };

  // OneMap Routing Intelligence
  routing: {
    ingress: {
      corridorName: string;
      viaRoads: string[];
      currentDurationMins: number;
      historicalTypicalDurationMins: number;
      bestTimeToEnter: string;
      recommendedWindow: string;
      erpGantries: { name: string; rate: number; activePeriod: string }[];
      bottlenecks: string[];
      routeCoordinates: [number, number][]; // [lat, lng]
      instructions: string[];
    };
    egress: {
      corridorName: string;
      viaRoads: string[];
      currentDurationMins: number;
      historicalTypicalDurationMins: number;
      bestTimeToExit: string;
      recommendedWindow: string;
      clearanceAdvise: string;
      routeCoordinates: [number, number][];
      instructions: string[];
    };
    historicalHourlyDurations: {
      timeSlot: string;
      typicalDurationMins: number;
      predictedDurationMins: number;
      congestionIndex: number; // 1 - 10
    }[];
  };
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpToolCallRequest {
  tool: string;
  arguments: Record<string, any>;
}

export interface McpToolCallResponse {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: any;
  }>;
  isError?: boolean;
}

export interface DispatchAlertBroadcast {
  id: string;
  timestamp: string;
  targetHubId: string;
  hubName: string;
  surgeMultiplier: number;
  bonusIncentive: number;
  recommendedIngressRoute: string;
  driversTargeted: number;
  acceptedDrivers: number;
  status: 'active' | 'completed' | 'expired';
}
