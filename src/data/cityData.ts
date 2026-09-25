import { CityPreset, HourlyForecast, WeatherConditionType, ZoneData, CrowdEvent } from '../types/demand';

export const CITIES: CityPreset[] = [
  {
    id: 'nyc',
    name: 'New York City',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    description: 'High-density urban grid with heavy dependence on yellow cabs and street hails, sensitive to Midtown congestion and stadium egress.',
    zones: [
      {
        id: 'nyc-midtown',
        name: 'Times Square & Midtown Core',
        category: 'commercial',
        x: 48,
        y: 42,
        radius: 12,
        currentCrowd: 34200,
        peakCapacity: 45000,
        crowdTrend: 18,
        baselineDemand: 280,
        predictedRiders: 460,
        availableCabs: 210,
        deficit: 250,
        surgeMultiplier: 2.1,
        avgWaitTimeMin: 14,
        hailWillingnessPct: 22,
        avgFareEstimate: 28,
        chokepointDelayMin: 8,
      },
      {
        id: 'nyc-barclays',
        name: 'Barclays Center & Atlantic Terminal',
        category: 'sports_arena',
        x: 62,
        y: 65,
        radius: 10,
        currentCrowd: 18900,
        peakCapacity: 20000,
        crowdTrend: 65,
        baselineDemand: 110,
        predictedRiders: 580,
        availableCabs: 95,
        deficit: 485,
        surgeMultiplier: 2.8,
        avgWaitTimeMin: 22,
        hailWillingnessPct: 38,
        avgFareEstimate: 36,
        chokepointDelayMin: 15,
      },
      {
        id: 'nyc-jfk',
        name: 'JFK Airport Terminals 4-8',
        category: 'airport',
        x: 82,
        y: 78,
        radius: 14,
        currentCrowd: 14500,
        peakCapacity: 18000,
        crowdTrend: 12,
        baselineDemand: 340,
        predictedRiders: 490,
        availableCabs: 310,
        deficit: 180,
        surgeMultiplier: 1.6,
        avgWaitTimeMin: 9,
        hailWillingnessPct: 44,
        avgFareEstimate: 70,
        chokepointDelayMin: 11,
      },
      {
        id: 'nyc-meatpacking',
        name: 'Meatpacking & Chelsea Nightlife',
        category: 'nightlife',
        x: 36,
        y: 52,
        radius: 9,
        currentCrowd: 12800,
        peakCapacity: 16000,
        crowdTrend: 42,
        baselineDemand: 160,
        predictedRiders: 390,
        availableCabs: 140,
        deficit: 250,
        surgeMultiplier: 2.4,
        avgWaitTimeMin: 16,
        hailWillingnessPct: 35,
        avgFareEstimate: 24,
        chokepointDelayMin: 6,
      },
      {
        id: 'nyc-grandcentral',
        name: 'Grand Central & Penn Station Belt',
        category: 'transit',
        x: 54,
        y: 35,
        radius: 11,
        currentCrowd: 28400,
        peakCapacity: 40000,
        crowdTrend: 28,
        baselineDemand: 320,
        predictedRiders: 610,
        availableCabs: 240,
        deficit: 370,
        surgeMultiplier: 2.3,
        avgWaitTimeMin: 18,
        hailWillingnessPct: 29,
        avgFareEstimate: 22,
        chokepointDelayMin: 9,
      },
      {
        id: 'nyc-financial',
        name: 'Wall Street & Financial District',
        category: 'commercial',
        x: 44,
        y: 74,
        radius: 9,
        currentCrowd: 16200,
        peakCapacity: 30000,
        crowdTrend: -15,
        baselineDemand: 180,
        predictedRiders: 210,
        availableCabs: 185,
        deficit: 25,
        surgeMultiplier: 1.1,
        avgWaitTimeMin: 4,
        hailWillingnessPct: 15,
        avgFareEstimate: 26,
        chokepointDelayMin: 4,
      },
    ],
    events: [
      {
        id: 'ev-nyc-1',
        venueName: 'Barclays Center',
        eventName: 'NBA Playoff Quarterfinals (Nets vs Celtics)',
        type: 'sports',
        zoneId: 'nyc-barclays',
        totalAttendees: 18200,
        egressStartTime: '21:30',
        egressPeakTime: '21:50',
        status: 'egress_soon',
        projectedTaxiSharePct: 34,
        projectedTaxiDemand: 620,
        recommendedStagingPoint: 'Flatbush Ave Service Ramp & Atlantic Yard Taxi Pocket',
      },
      {
        id: 'ev-nyc-2',
        venueName: 'Radio City Music Hall',
        eventName: 'Broadway Spring Gala Concert',
        type: 'concert',
        zoneId: 'nyc-midtown',
        totalAttendees: 5900,
        egressStartTime: '22:15',
        egressPeakTime: '22:30',
        status: 'upcoming',
        projectedTaxiSharePct: 42,
        projectedTaxiDemand: 240,
        recommendedStagingPoint: '6th Ave between 50th & 51st St (West Side)',
      },
      {
        id: 'ev-nyc-3',
        venueName: 'JFK Terminal 4 & 8',
        eventName: 'Transatlantic Flight Arrival Bank (14 heavies landed)',
        type: 'flight_surge',
        zoneId: 'nyc-jfk',
        totalAttendees: 4800,
        egressStartTime: '19:45',
        egressPeakTime: '20:30',
        status: 'ongoing',
        projectedTaxiSharePct: 52,
        projectedTaxiDemand: 380,
        recommendedStagingPoint: 'Terminal 4 Ground Transportation Level 1 Stand B',
      },
    ],
    transitAlerts: [
      {
        line: 'Subway L-Train & 4/5 Express',
        status: 'delayed',
        description: 'Signal malfunctions at Union Square causing 25-minute commuter hold, diverting passenger flow to surface hailing.',
        impactZoneId: 'nyc-grandcentral',
      },
      {
        line: 'Long Island Rail Road',
        status: 'normal',
        description: 'On-schedule operations across Atlantic Branch.',
        impactZoneId: 'nyc-barclays',
      },
    ],
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    description: 'Iconic black cab network deeply influenced by sudden Atlantic showers, Tube delays, and West End theatre egress.',
    zones: [
      {
        id: 'lon-westend',
        name: 'West End & Soho Theatreland',
        category: 'nightlife',
        x: 42,
        y: 45,
        radius: 12,
        currentCrowd: 38000,
        peakCapacity: 48000,
        crowdTrend: 34,
        baselineDemand: 310,
        predictedRiders: 680,
        availableCabs: 220,
        deficit: 460,
        surgeMultiplier: 2.5,
        avgWaitTimeMin: 19,
        hailWillingnessPct: 36,
        avgFareEstimate: 28,
        chokepointDelayMin: 12,
      },
      {
        id: 'lon-o2',
        name: 'The O2 Arena & Greenwich Peninsula',
        category: 'sports_arena',
        x: 75,
        y: 55,
        radius: 11,
        currentCrowd: 21500,
        peakCapacity: 22000,
        crowdTrend: 80,
        baselineDemand: 120,
        predictedRiders: 720,
        availableCabs: 110,
        deficit: 610,
        surgeMultiplier: 3.1,
        avgWaitTimeMin: 26,
        hailWillingnessPct: 45,
        avgFareEstimate: 42,
        chokepointDelayMin: 18,
      },
      {
        id: 'lon-kingscross',
        name: "King's Cross & St Pancras Int'l",
        category: 'transit',
        x: 48,
        y: 28,
        radius: 10,
        currentCrowd: 26000,
        peakCapacity: 35000,
        crowdTrend: 22,
        baselineDemand: 290,
        predictedRiders: 510,
        availableCabs: 280,
        deficit: 230,
        surgeMultiplier: 1.8,
        avgWaitTimeMin: 11,
        hailWillingnessPct: 28,
        avgFareEstimate: 24,
        chokepointDelayMin: 8,
      },
      {
        id: 'lon-canary',
        name: 'Canary Wharf Financial Hub',
        category: 'commercial',
        x: 68,
        y: 48,
        radius: 9,
        currentCrowd: 19500,
        peakCapacity: 32000,
        crowdTrend: -8,
        baselineDemand: 190,
        predictedRiders: 250,
        availableCabs: 210,
        deficit: 40,
        surgeMultiplier: 1.2,
        avgWaitTimeMin: 5,
        hailWillingnessPct: 18,
        avgFareEstimate: 32,
        chokepointDelayMin: 5,
      },
      {
        id: 'lon-heathrow',
        name: 'Heathrow Airport Terminals 2-5',
        category: 'airport',
        x: 18,
        y: 60,
        radius: 13,
        currentCrowd: 16800,
        peakCapacity: 22000,
        crowdTrend: 15,
        baselineDemand: 360,
        predictedRiders: 540,
        availableCabs: 340,
        deficit: 200,
        surgeMultiplier: 1.7,
        avgWaitTimeMin: 10,
        hailWillingnessPct: 48,
        avgFareEstimate: 75,
        chokepointDelayMin: 9,
      },
    ],
    events: [
      {
        id: 'ev-lon-1',
        venueName: 'The O2 Arena',
        eventName: 'Coldplay World Tour Final Night',
        type: 'concert',
        zoneId: 'lon-o2',
        totalAttendees: 20500,
        egressStartTime: '22:30',
        egressPeakTime: '22:50',
        status: 'egress_soon',
        projectedTaxiSharePct: 42,
        projectedTaxiDemand: 860,
        recommendedStagingPoint: 'Millennium Way North Taxi Rank & Blackwall Link',
      },
      {
        id: 'ev-lon-2',
        venueName: 'Dominion Theatre & Shaftesbury Ave',
        eventName: 'West End Curtains Call (Multiple Theatres)',
        type: 'concert',
        zoneId: 'lon-westend',
        totalAttendees: 14200,
        egressStartTime: '22:00',
        egressPeakTime: '22:20',
        status: 'ongoing',
        projectedTaxiSharePct: 35,
        projectedTaxiDemand: 480,
        recommendedStagingPoint: 'Charing Cross Road & Cambridge Circus feeder',
      },
    ],
    transitAlerts: [
      {
        line: 'Jubilee Line Tube',
        status: 'delayed',
        description: 'Track incident at North Greenwich; 30-minute passenger bottleneck leaving concertgoers seeking black cabs.',
        impactZoneId: 'lon-o2',
      },
      {
        line: 'Central Line',
        status: 'normal',
        description: 'Standard night-tube cadence.',
        impactZoneId: 'lon-westend',
      },
    ],
  },
  {
    id: 'sg',
    name: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    description: 'Tropical climate with sudden high-volume monsoon squalls causing instantaneous 3x cab booking spikes.',
    zones: [
      {
        id: 'sg-mbs',
        name: 'Marina Bay Sands & Bayfront',
        category: 'commercial',
        x: 52,
        y: 58,
        radius: 11,
        currentCrowd: 28500,
        peakCapacity: 35000,
        crowdTrend: 26,
        baselineDemand: 260,
        predictedRiders: 590,
        availableCabs: 180,
        deficit: 410,
        surgeMultiplier: 2.6,
        avgWaitTimeMin: 18,
        hailWillingnessPct: 38,
        avgFareEstimate: 26,
        chokepointDelayMin: 10,
      },
      {
        id: 'sg-changi',
        name: 'Changi Airport T1-T4 & Jewel',
        category: 'airport',
        x: 85,
        y: 42,
        radius: 13,
        currentCrowd: 22000,
        peakCapacity: 28000,
        crowdTrend: 16,
        baselineDemand: 380,
        predictedRiders: 620,
        availableCabs: 360,
        deficit: 260,
        surgeMultiplier: 1.9,
        avgWaitTimeMin: 12,
        hailWillingnessPct: 52,
        avgFareEstimate: 38,
        chokepointDelayMin: 7,
      },
      {
        id: 'sg-stadium',
        name: 'Singapore National Stadium & Kallang',
        category: 'sports_arena',
        x: 58,
        y: 40,
        radius: 12,
        currentCrowd: 46000,
        peakCapacity: 50000,
        crowdTrend: 72,
        baselineDemand: 180,
        predictedRiders: 980,
        availableCabs: 190,
        deficit: 790,
        surgeMultiplier: 3.4,
        avgWaitTimeMin: 32,
        hailWillingnessPct: 48,
        avgFareEstimate: 34,
        chokepointDelayMin: 22,
      },
      {
        id: 'sg-orchard',
        name: 'Orchard Road Shopping Corridor',
        category: 'shopping',
        x: 38,
        y: 45,
        radius: 10,
        currentCrowd: 31000,
        peakCapacity: 42000,
        crowdTrend: 30,
        baselineDemand: 240,
        predictedRiders: 520,
        availableCabs: 210,
        deficit: 310,
        surgeMultiplier: 2.2,
        avgWaitTimeMin: 15,
        hailWillingnessPct: 32,
        avgFareEstimate: 22,
        chokepointDelayMin: 9,
      },
      {
        id: 'sg-clarkequay',
        name: 'Clarke Quay & Riverside Nightlife',
        category: 'nightlife',
        x: 44,
        y: 54,
        radius: 8,
        currentCrowd: 14000,
        peakCapacity: 18000,
        crowdTrend: 45,
        baselineDemand: 160,
        predictedRiders: 410,
        availableCabs: 130,
        deficit: 280,
        surgeMultiplier: 2.4,
        avgWaitTimeMin: 17,
        hailWillingnessPct: 40,
        avgFareEstimate: 20,
        chokepointDelayMin: 6,
      },
    ],
    events: [
      {
        id: 'ev-sg-1',
        venueName: 'National Stadium',
        eventName: 'Taylor Swift Eras Tour Encore',
        type: 'concert',
        zoneId: 'sg-stadium',
        totalAttendees: 48000,
        egressStartTime: '22:15',
        egressPeakTime: '22:45',
        status: 'egress_soon',
        projectedTaxiSharePct: 46,
        projectedTaxiDemand: 1420,
        recommendedStagingPoint: 'Stadium Crescent & Tanjong Rhu staging loop',
      },
      {
        id: 'ev-sg-2',
        venueName: 'Sands Expo & Convention Centre',
        eventName: 'Asia FinTech Global Summit Day 2 Closing',
        type: 'conference',
        zoneId: 'sg-mbs',
        totalAttendees: 12500,
        egressStartTime: '18:00',
        egressPeakTime: '18:30',
        status: 'ongoing',
        projectedTaxiSharePct: 38,
        projectedTaxiDemand: 520,
        recommendedStagingPoint: 'Bayfront Ave Porte-Cochere Lower Level',
      },
    ],
    transitAlerts: [
      {
        line: 'Circle Line (Stadium MRT)',
        status: 'delayed',
        description: 'Severe platform crowding control measures enforcing 20-minute holding pens at turnstiles.',
        impactZoneId: 'sg-stadium',
      },
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    description: 'World-leading rail density, where taxi demand escalates sharply during rainstorms and after midnight last-train cutoff.',
    zones: [
      {
        id: 'tyo-shinjuku',
        name: 'Shinjuku Station South & Kabukicho',
        category: 'nightlife',
        x: 35,
        y: 42,
        radius: 12,
        currentCrowd: 52000,
        peakCapacity: 75000,
        crowdTrend: 24,
        baselineDemand: 380,
        predictedRiders: 820,
        availableCabs: 340,
        deficit: 480,
        surgeMultiplier: 2.3,
        avgWaitTimeMin: 18,
        hailWillingnessPct: 26,
        avgFareEstimate: 3800,
        chokepointDelayMin: 14,
      },
      {
        id: 'tyo-shibuya',
        name: 'Shibuya Scramble & Dogenzaka',
        category: 'shopping',
        x: 32,
        y: 56,
        radius: 11,
        currentCrowd: 44000,
        peakCapacity: 60000,
        crowdTrend: 35,
        baselineDemand: 310,
        predictedRiders: 690,
        availableCabs: 280,
        deficit: 410,
        surgeMultiplier: 2.4,
        avgWaitTimeMin: 16,
        hailWillingnessPct: 30,
        avgFareEstimate: 3200,
        chokepointDelayMin: 11,
      },
      {
        id: 'tyo-dome',
        name: 'Tokyo Dome & Korakuen',
        category: 'sports_arena',
        x: 52,
        y: 32,
        radius: 11,
        currentCrowd: 41000,
        peakCapacity: 45000,
        crowdTrend: 78,
        baselineDemand: 160,
        predictedRiders: 890,
        availableCabs: 170,
        deficit: 720,
        surgeMultiplier: 3.2,
        avgWaitTimeMin: 28,
        hailWillingnessPct: 42,
        avgFareEstimate: 4100,
        chokepointDelayMin: 20,
      },
      {
        id: 'tyo-ginza',
        name: 'Ginza & Marunouchi Central',
        category: 'commercial',
        x: 62,
        y: 46,
        radius: 10,
        currentCrowd: 29000,
        peakCapacity: 48000,
        crowdTrend: 10,
        baselineDemand: 290,
        predictedRiders: 460,
        availableCabs: 310,
        deficit: 150,
        surgeMultiplier: 1.5,
        avgWaitTimeMin: 8,
        hailWillingnessPct: 22,
        avgFareEstimate: 3500,
        chokepointDelayMin: 6,
      },
      {
        id: 'tyo-haneda',
        name: "Haneda Airport Terminal 3 Int'l",
        category: 'airport',
        x: 72,
        y: 78,
        radius: 12,
        currentCrowd: 18000,
        peakCapacity: 25000,
        crowdTrend: 14,
        baselineDemand: 320,
        predictedRiders: 510,
        availableCabs: 330,
        deficit: 180,
        surgeMultiplier: 1.6,
        avgWaitTimeMin: 9,
        hailWillingnessPct: 44,
        avgFareEstimate: 9800,
        chokepointDelayMin: 8,
      },
    ],
    events: [
      {
        id: 'ev-tyo-1',
        venueName: 'Tokyo Dome',
        eventName: 'Yomiuri Giants vs Hanshin Tigers (Game 7)',
        type: 'sports',
        zoneId: 'tyo-dome',
        totalAttendees: 43500,
        egressStartTime: '21:15',
        egressPeakTime: '21:40',
        status: 'egress_soon',
        projectedTaxiSharePct: 36,
        projectedTaxiDemand: 950,
        recommendedStagingPoint: 'Hakusan-dori East Shoulder & Suidobashi Bridge Ramp',
      },
    ],
    transitAlerts: [
      {
        line: 'JR Yamanote Line',
        status: 'delayed',
        description: 'Track inspection delay around Ikebukuro causing train bunching and platform queues.',
        impactZoneId: 'tyo-shinjuku',
      },
    ],
  },
];

// Generate dynamic 24-hour weather timeline based on scenario
export function generateHourlyForecast(
  baseScenario: 'rainy_evening' | 'summer_storm' | 'clear_day' | 'winter_chill' = 'rainy_evening'
): HourlyForecast[] {
  const hours: HourlyForecast[] = [];

  for (let i = 0; i < 24; i++) {
    const hourNum = i;
    const hourStr = `${hourNum.toString().padStart(2, '0')}:00`;

    let condition: WeatherConditionType = 'clear';
    let precipMm = 0;
    let rainProb = 10;
    let tempC = 20;
    let windKmh = 12;

    if (baseScenario === 'rainy_evening') {
      tempC = hourNum < 6 ? 16 : hourNum < 18 ? 22 : 17;
      if (hourNum >= 16 && hourNum <= 22) {
        condition = hourNum >= 18 && hourNum <= 20 ? 'heavy_rain' : 'light_rain';
        precipMm = hourNum === 19 ? 14.5 : hourNum === 18 || hourNum === 20 ? 8.2 : 3.4;
        rainProb = 95;
        windKmh = 28;
      } else if (hourNum > 22 || hourNum < 2) {
        condition = 'cloudy';
        precipMm = 0.5;
        rainProb = 40;
        windKmh = 16;
      } else {
        condition = 'partly_cloudy' as any;
        precipMm = 0;
        rainProb = 15;
        windKmh = 10;
      }
    } else if (baseScenario === 'summer_storm') {
      tempC = hourNum < 12 ? 26 : hourNum < 17 ? 32 : 24;
      if (hourNum >= 15 && hourNum <= 18) {
        condition = 'thunderstorm';
        precipMm = hourNum === 16 ? 24.0 : 16.5;
        rainProb = 98;
        windKmh = 42;
      } else {
        condition = hourNum > 19 ? 'cloudy' : 'clear';
        precipMm = 0;
        rainProb = 20;
        windKmh = 14;
      }
    } else if (baseScenario === 'winter_chill') {
      tempC = hourNum < 7 ? -2 : hourNum < 15 ? 4 : 0;
      if (hourNum >= 17) {
        condition = 'snow';
        precipMm = 4.2;
        rainProb = 85;
        windKmh = 22;
      } else {
        condition = 'gusty_wind';
        precipMm = 0.2;
        rainProb = 30;
        windKmh = 35;
      }
    } else {
      // clear_day
      tempC = hourNum < 6 ? 15 : hourNum < 15 ? 24 : 19;
      condition = 'clear';
      precipMm = 0;
      rainProb = 5;
      windKmh = 8;
    }

    // Mathematical formula for weather surge multiplier:
    // f(precip) = 1.0 + (precipMm * 0.08) + (windKmh > 25 ? 0.2 : 0) + (tempC < 4 ? 0.3 : 0)
    let mult = 1.0;
    if (precipMm > 0) {
      mult += Math.min(1.8, precipMm * 0.095);
    }
    if (condition === 'thunderstorm') mult += 0.5;
    if (tempC < 4 || tempC > 33) mult += 0.25;
    if (windKmh > 30) mult += 0.2;

    const weatherMult = Number(mult.toFixed(2));
    const baseCommuteCurve = hourNum >= 7 && hourNum <= 9 ? 1.6 : hourNum >= 17 && hourNum <= 22 ? 1.9 : hourNum >= 23 || hourNum <= 2 ? 1.4 : 0.9;
    const predictedCitywideRiders = Math.round(1800 * baseCommuteCurve * weatherMult);
    const fleetDeficitCitywide = Math.max(0, Math.round(predictedCitywideRiders - 2400));

    hours.push({
      hour: hourStr,
      hourNum,
      tempC,
      condition,
      precipitationMm: precipMm,
      rainProbability: rainProb,
      windSpeedKmh: windKmh,
      weatherDemandMultiplier: weatherMult,
      predictedCitywideRiders,
      fleetDeficitCitywide,
    });
  }

  return hours;
}

// Dynamic recalculation of a zone based on simulation params
export function computeZoneMetrics(
  zone: ZoneData,
  currentWeather: {
    condition: WeatherConditionType;
    precipitationMm: number;
    tempC: number;
    windSpeedKmh: number;
  },
  events: CrowdEvent[],
  transitDelayFactor: number, // 1.0 = normal, 1.4 = delay, 2.0 = suspended
  hourNum: number
): ZoneData {
  // 1. Time-of-day demand multiplier
  let timeMultiplier = 1.0;
  if (zone.category === 'commercial') {
    timeMultiplier = (hourNum >= 8 && hourNum <= 10) || (hourNum >= 17 && hourNum <= 19) ? 1.7 : 0.7;
  } else if (zone.category === 'nightlife') {
    timeMultiplier = hourNum >= 21 || hourNum <= 2 ? 2.2 : 0.4;
  } else if (zone.category === 'sports_arena') {
    timeMultiplier = hourNum >= 19 && hourNum <= 23 ? 2.5 : 0.5;
  } else if (zone.category === 'airport') {
    timeMultiplier = hourNum >= 6 && hourNum <= 22 ? 1.3 : 0.8;
  }

  // 2. Weather hail elasticity factor
  // People refuse to walk when rain > 3mm. Bicycle and e-scooters become unusable.
  let weatherHailFactor = 1.0;
  if (currentWeather.precipitationMm > 0) {
    weatherHailFactor = 1.0 + Math.min(2.2, currentWeather.precipitationMm * 0.12);
  }
  if (currentWeather.condition === 'thunderstorm') weatherHailFactor *= 1.4;
  if (currentWeather.tempC < 3 || currentWeather.tempC > 34) weatherHailFactor *= 1.25;
  if (currentWeather.windSpeedKmh > 28) weatherHailFactor *= 1.15;

  // 3. Event crowd egress calculation
  const activeEvents = events.filter((e) => e.zoneId === zone.id);
  let eventSurgeRiders = 0;
  activeEvents.forEach((ev) => {
    if (ev.status === 'egress_soon') {
      eventSurgeRiders += ev.projectedTaxiDemand * 0.85;
    } else if (ev.status === 'ongoing' || ev.status === 'dispersing') {
      eventSurgeRiders += ev.projectedTaxiDemand * 0.6;
    }
  });

  // 4. Transit friction
  const transitSurge = (transitDelayFactor - 1.0) * (zone.category === 'transit' ? 240 : 90);

  // 5. Total predicted riders
  const baseRate = zone.baselineDemand * timeMultiplier;
  const weatherAdjustedBase = baseRate * weatherHailFactor;
  const predictedRiders = Math.round(weatherAdjustedBase + eventSurgeRiders + transitSurge);

  // Available cabs: in heavy rain, cabs are hailed rapidly so available cabs drops
  const supplyDepletion = currentWeather.precipitationMm > 5 ? 0.75 : 0.95;
  const activeCabs = Math.max(25, Math.round(zone.availableCabs * supplyDepletion));
  const deficit = predictedRiders - activeCabs;

  // Surge multiplier calculation
  const ratio = predictedRiders / Math.max(1, activeCabs);
  let surge = 1.0;
  if (ratio > 1.2) {
    surge = 1.0 + (ratio - 1.2) * 0.65;
  }
  surge = Math.min(3.8, Math.max(1.0, Number(surge.toFixed(1))));

  // Willingness to hail:
  // Base 12-25%, up to 75% in heavy storms with broken transit
  let willingness = 15;
  if (currentWeather.precipitationMm > 0) {
    willingness += Math.min(45, currentWeather.precipitationMm * 3.5);
  }
  if (currentWeather.condition === 'thunderstorm') willingness += 18;
  if (transitDelayFactor > 1.2) willingness += 12;
  willingness = Math.min(85, Math.round(willingness));

  // Average wait time
  const waitMin = Math.round(Math.max(3, 4 + (deficit > 0 ? (deficit / 40) * 2.5 : 0)));

  return {
    ...zone,
    predictedRiders,
    availableCabs: activeCabs,
    deficit,
    surgeMultiplier: surge,
    avgWaitTimeMin: waitMin,
    hailWillingnessPct: willingness,
  };
}
