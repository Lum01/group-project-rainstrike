/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransportHub } from '../types/dispatch';

export const INITIAL_TRANSPORT_HUBS: TransportHub[] = [
  {
    id: 'jurong_east',
    name: 'Jurong East Integrated Transport Hub & Interchange',
    shortName: 'Jurong East ITH',
    code: 'JE-ITH',
    region: 'West',
    coordinates: [1.3331, 103.7423],
    category: 'Integrated Interchange',
    description: 'Busiest regional transit terminal connecting East-West & North-South MRT lines with Jem, Westgate, and IMM shopping clusters.',
    humanTraffic: {
      hourlyInflow: 18450,
      hourlyOutflow: 16200,
      mrtTapOutPerMin: 285,
      busArrivalPerMin: 140,
      trend: 'peaking',
      disruptionAlert: {
        line: 'East-West Line (EWL)',
        message: 'Track fault near Clementi; 15-20 min train turnaround delay westbound.',
        delayMins: 18,
        severity: 'critical'
      }
    },
    taxiSupply: {
      availableTaxisInArea: 18,
      queueLengthCommuters: 96,
      averageWaitTimeMins: 24,
      unmetRequestsPerMin: 42,
      historicalAverageSupply: 55
    },
    weather: {
      condition: 'Heavy Thundery Showers',
      temperatureC: 25.8,
      rainfallRateMmHr: 44.5,
      stormOnsetProbability: 95,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'heavy_deluge'
    },
    events: [
      {
        name: 'Westgate Weekend Megasale & Evening Commute',
        venue: 'Jurong East Commercial Gateway',
        estimatedCrowd: 12000,
        egressTime: '17:30 - 19:30'
      }
    ],
    prediction: {
      taxiDemandIndex: 94,
      priority: 'critical',
      projectedDemandPerMin: 68,
      supplyDeficit: 50,
      surgeMultiplier: 2.1,
      weatherMultiplier: 1.85,
      disruptionMultiplier: 1.45,
      recommendedDriverReposition: 65,
      keyDriverReason: 'Severe rainstorm active (44.5 mm/hr) + EWL MRT delay causing massive passenger spillover into taxi stands.'
    },
    routing: {
      ingress: {
        corridorName: 'Jurong Town Hall Rd via AYE Exit 13',
        viaRoads: ['AYE (Ayer Rajah Expwy)', 'Jurong Town Hall Rd', 'Jurong Gateway Rd'],
        currentDurationMins: 16,
        historicalTypicalDurationMins: 12,
        bestTimeToEnter: '17:40 - 17:55',
        recommendedWindow: 'Immediate (enter before 18:00 AYE junction queue peaks)',
        erpGantries: [
          { name: 'AYE near Jurong Town Hall', rate: 2.0, activePeriod: '17:30 - 19:00' }
        ],
        bottlenecks: ['Jurong Gateway Rd taxi pickup bay entrance', 'Boon Lay Way junction'],
        routeCoordinates: [
          [1.3142, 103.7485],
          [1.3210, 103.7460],
          [1.3285, 103.7441],
          [1.3331, 103.7423]
        ],
        instructions: [
          'Approach via AYE Westbound, take Exit 13 toward Jurong Town Hall Rd.',
          'Keep right onto Jurong Gateway Rd bypass lane to avoid Jem loading bay gridlock.',
          'Direct drivers to Taxi Stand J02 (Westgate Basement 1) where queue exceeds 90 commuters.'
        ]
      },
      egress: {
        corridorName: 'Boon Lay Way -> PIE Ingress via Toh Guan Rd',
        viaRoads: ['Boon Lay Way', 'Toh Guan Rd', 'PIE (Pan Island Expwy)'],
        currentDurationMins: 14,
        historicalTypicalDurationMins: 11,
        bestTimeToExit: '18:10 - 18:30',
        recommendedWindow: 'Exit via Toh Guan Flyover before 18:45',
        clearanceAdvise: 'Avoid Jurong East Central westbound; heavy bus bunching.',
        routeCoordinates: [
          [1.3331, 103.7423],
          [1.3365, 103.7470],
          [1.3412, 103.7540],
          [1.3468, 103.7620]
        ],
        instructions: [
          'Depart passenger bay via Boon Lay Way eastbound.',
          'Turn left into Toh Guan Rd for rapid link into PIE Eastbound.',
          'Average clearance time 14 mins.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 10, predictedDurationMins: 11, congestionIndex: 3 },
        { timeSlot: '16:00', typicalDurationMins: 11, predictedDurationMins: 13, congestionIndex: 4 },
        { timeSlot: '17:00', typicalDurationMins: 14, predictedDurationMins: 20, congestionIndex: 7 },
        { timeSlot: '17:30', typicalDurationMins: 16, predictedDurationMins: 24, congestionIndex: 9 },
        { timeSlot: '18:00', typicalDurationMins: 19, predictedDurationMins: 28, congestionIndex: 10 },
        { timeSlot: '18:30', typicalDurationMins: 18, predictedDurationMins: 25, congestionIndex: 8 },
        { timeSlot: '19:00', typicalDurationMins: 15, predictedDurationMins: 19, congestionIndex: 6 },
        { timeSlot: '20:00', typicalDurationMins: 12, predictedDurationMins: 13, congestionIndex: 4 }
      ]
    }
  },
  {
    id: 'changi_airport',
    name: 'Singapore Changi Airport (Terminals 1-4 & Jewel)',
    shortName: 'Changi Airport Hub',
    code: 'SIN-CAG',
    region: 'East',
    coordinates: [1.3644, 103.9915],
    category: 'Airport',
    description: 'Global aviation gateway with 4 passenger terminals & Jewel. Peak long-haul evening arrival waves and international passenger luggage demand.',
    humanTraffic: {
      hourlyInflow: 14800,
      hourlyOutflow: 15600,
      mrtTapOutPerMin: 140,
      busArrivalPerMin: 65,
      flightArrivalsNextHour: 38,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 34,
      queueLengthCommuters: 112,
      averageWaitTimeMins: 19,
      unmetRequestsPerMin: 38,
      historicalAverageSupply: 70
    },
    weather: {
      condition: 'Passing Showers',
      temperatureC: 27.2,
      rainfallRateMmHr: 16.0,
      stormOnsetProbability: 70,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'moderate'
    },
    events: [
      {
        name: 'A380 & B777 Europe/Australia Evening Arrival Cluster',
        venue: 'Terminals 1, 3 and Jewel Pickup Bay',
        estimatedCrowd: 8500,
        egressTime: '17:45 - 20:30'
      }
    ],
    prediction: {
      taxiDemandIndex: 88,
      priority: 'critical',
      projectedDemandPerMin: 62,
      supplyDeficit: 35,
      surgeMultiplier: 1.85,
      weatherMultiplier: 1.4,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 50,
      keyDriverReason: '38 international flight arrivals in 60 mins + sudden squall pushing premium GrabCar / 6-seater demand.'
    },
    routing: {
      ingress: {
        corridorName: 'PIE Eastbound -> Airport Blvd via South Perimeter',
        viaRoads: ['PIE (Pan Island Expwy)', 'Airport Blvd', 'T1/T3 Arrival Crescent'],
        currentDurationMins: 18,
        historicalTypicalDurationMins: 14,
        bestTimeToEnter: '17:35 - 18:00',
        recommendedWindow: 'Enter before 18:15 before evening arrival queue snarls',
        erpGantries: [
          { name: 'ECP Airport Inbound', rate: 0.0, activePeriod: 'Free' }
        ],
        bottlenecks: ['T1 Arrival Driveway merge lane', 'Jewel basement taxi staging area'],
        routeCoordinates: [
          [1.3485, 103.9680],
          [1.3540, 103.9780],
          [1.3610, 103.9870],
          [1.3644, 103.9915]
        ],
        instructions: [
          'Route via PIE Eastbound; take Exit 1 onto Airport Boulevard.',
          'Use T3 Arrival Driveway as first priority; T1 has 8-min queue buildup.',
          'Instruct drivers to turn on Grab 6-seater & XL booking filters for oversized baggage.'
        ]
      },
      egress: {
        corridorName: 'Airport Blvd -> ECP Westbound toward City/CBD',
        viaRoads: ['Airport Blvd', 'ECP (East Coast Parkway)'],
        currentDurationMins: 20,
        historicalTypicalDurationMins: 18,
        bestTimeToExit: '18:15 - 18:45',
        recommendedWindow: 'Optimal exit window between flight waves',
        clearanceAdvise: 'ECP smooth at 82 km/h; avoid PIE Westbound if heading Central/West due to Kallang bottleneck.',
        routeCoordinates: [
          [1.3644, 103.9915],
          [1.3580, 103.9850],
          [1.3450, 103.9650],
          [1.3320, 103.9420]
        ],
        instructions: [
          'Exit terminal loop via ECP Westbound express ramp.',
          'Fast clearance into Marina Bay / Tanjong Pagar commercial corridor.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 13, predictedDurationMins: 14, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 14, predictedDurationMins: 15, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 15, predictedDurationMins: 19, congestionIndex: 6 },
        { timeSlot: '17:30', typicalDurationMins: 17, predictedDurationMins: 22, congestionIndex: 7 },
        { timeSlot: '18:00', typicalDurationMins: 18, predictedDurationMins: 24, congestionIndex: 8 },
        { timeSlot: '18:30', typicalDurationMins: 19, predictedDurationMins: 26, congestionIndex: 8 },
        { timeSlot: '19:00', typicalDurationMins: 17, predictedDurationMins: 21, congestionIndex: 6 },
        { timeSlot: '20:00', typicalDurationMins: 15, predictedDurationMins: 17, congestionIndex: 4 }
      ]
    }
  },
  {
    id: 'marina_bay_sands',
    name: 'Marina Bay Sands, Bayfront & Financial Hub',
    shortName: 'MBS & Bayfront Hub',
    code: 'MBS-CBD',
    region: 'Central',
    coordinates: [1.2834, 103.8607],
    category: 'CBD Hub',
    description: 'Premier integrated resort, Sands Expo & Convention Centre, and Shenton Way/Raffles Place financial district interchange.',
    humanTraffic: {
      hourlyInflow: 22100,
      hourlyOutflow: 19800,
      mrtTapOutPerMin: 310,
      busArrivalPerMin: 110,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 42,
      queueLengthCommuters: 78,
      averageWaitTimeMins: 16,
      unmetRequestsPerMin: 32,
      historicalAverageSupply: 65
    },
    weather: {
      condition: 'Cloudy',
      temperatureC: 28.5,
      rainfallRateMmHr: 4.2,
      stormOnsetProbability: 65,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'light'
    },
    events: [
      {
        name: 'Asia Tech & FinTech Summit Day 2 Egress',
        venue: 'Sands Expo & Convention Halls A-C',
        estimatedCrowd: 14500,
        egressTime: '17:30 - 19:00'
      }
    ],
    prediction: {
      taxiDemandIndex: 82,
      priority: 'high',
      projectedDemandPerMin: 54,
      supplyDeficit: 28,
      surgeMultiplier: 1.7,
      weatherMultiplier: 1.25,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 40,
      keyDriverReason: '14,500 conference delegates exiting Sands Expo simultaneously with CBD Friday office dispersal.'
    },
    routing: {
      ingress: {
        corridorName: 'MCE Exit 2 -> Central Blvd -> Bayfront Ave',
        viaRoads: ['MCE (Marina Coastal Expwy)', 'Central Blvd', 'Bayfront Ave'],
        currentDurationMins: 14,
        historicalTypicalDurationMins: 10,
        bestTimeToEnter: '17:30 - 17:45',
        recommendedWindow: 'Enter before 17:50 to beat Shenton Way gridlock',
        erpGantries: [
          { name: 'Marina Blvd Gantry', rate: 3.0, activePeriod: '17:30 - 19:30' }
        ],
        bottlenecks: ['Bayfront Ave Hotel Tower 1 driveway', 'Sands Expo Porte-cochere'],
        routeCoordinates: [
          [1.2720, 103.8540],
          [1.2780, 103.8580],
          [1.2820, 103.8600],
          [1.2834, 103.8607]
        ],
        instructions: [
          'From MCE, take Exit 2 onto Central Boulevard.',
          'Veer right into Bayfront Ave underpass to avoid Shenton Way taxi queue.',
          'Access Sands Expo Basement 1 pickup zone for rapid dispatch.'
        ]
      },
      egress: {
        corridorName: 'Sheares Ave -> Benjamin Sheares Bridge -> ECP/KPE',
        viaRoads: ['Sheares Ave', 'Benjamin Sheares Bridge', 'ECP/KPE'],
        currentDurationMins: 15,
        historicalTypicalDurationMins: 11,
        bestTimeToExit: '18:00 - 18:25',
        recommendedWindow: 'Exit before 18:30 when citybound lanes jam',
        clearanceAdvise: 'Benjamin Sheares Bridge flowing smoothly at 65 km/h.',
        routeCoordinates: [
          [1.2834, 103.8607],
          [1.2890, 103.8620],
          [1.2950, 103.8610],
          [1.3020, 103.8630]
        ],
        instructions: [
          'Exit Bayfront Ave via Sheares Link onto Benjamin Sheares Bridge.',
          'Provides instant divergence to ECP (East) or KPE (North-East).'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 10, predictedDurationMins: 12, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 13, predictedDurationMins: 18, congestionIndex: 6 },
        { timeSlot: '17:30', typicalDurationMins: 15, predictedDurationMins: 21, congestionIndex: 8 },
        { timeSlot: '18:00', typicalDurationMins: 18, predictedDurationMins: 25, congestionIndex: 9 },
        { timeSlot: '18:30', typicalDurationMins: 17, predictedDurationMins: 23, congestionIndex: 8 },
        { timeSlot: '19:00', typicalDurationMins: 14, predictedDurationMins: 17, congestionIndex: 5 },
        { timeSlot: '20:00', typicalDurationMins: 11, predictedDurationMins: 12, congestionIndex: 3 }
      ]
    }
  },
  {
    id: 'woodlands_ith',
    name: 'Woodlands Integrated Transport Hub & Checkpoint',
    shortName: 'Woodlands ITH',
    code: 'WL-ITH',
    region: 'North',
    coordinates: [1.4369, 103.7865],
    category: 'Integrated Interchange',
    description: 'Northern gateway with Thomson-East Coast Line & North-South Line interchange, plus massive cross-border Johor Bahru bus connection.',
    humanTraffic: {
      hourlyInflow: 24500,
      hourlyOutflow: 21000,
      mrtTapOutPerMin: 340,
      busArrivalPerMin: 180,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 22,
      queueLengthCommuters: 84,
      averageWaitTimeMins: 22,
      unmetRequestsPerMin: 35,
      historicalAverageSupply: 50
    },
    weather: {
      condition: 'Thundery Showers',
      temperatureC: 26.4,
      rainfallRateMmHr: 28.0,
      stormOnsetProbability: 88,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'moderate'
    },
    events: [
      {
        name: 'Friday Cross-Border Weekend Commuter Surge',
        venue: 'Woodlands Checkpoint & Causeway Interchange',
        estimatedCrowd: 35000,
        egressTime: '17:00 - 21:00'
      }
    ],
    prediction: {
      taxiDemandIndex: 86,
      priority: 'critical',
      projectedDemandPerMin: 58,
      supplyDeficit: 36,
      surgeMultiplier: 1.8,
      weatherMultiplier: 1.55,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 45,
      keyDriverReason: 'Massive cross-border commuter arrivals at Woodlands Causeway under heavy thunderstorms (28 mm/hr).'
    },
    routing: {
      ingress: {
        corridorName: 'BKE Exit 10A -> Woodlands Ave 3 -> Ave 2',
        viaRoads: ['BKE (Bukit Timah Expwy)', 'Woodlands Ave 3', 'Woodlands Ave 2'],
        currentDurationMins: 15,
        historicalTypicalDurationMins: 11,
        bestTimeToEnter: '17:45 - 18:05',
        recommendedWindow: 'Enter before BKE Exit 10A causes tailback onto expressway',
        erpGantries: [],
        bottlenecks: ['Woodlands Ave 3 Causeway junction', 'Causeway Point pickup slip road'],
        routeCoordinates: [
          [1.4180, 103.7740],
          [1.4260, 103.7790],
          [1.4320, 103.7830],
          [1.4369, 103.7865]
        ],
        instructions: [
          'From BKE Northbound, take Exit 10A onto Woodlands Ave 3.',
          'Bypass Causeway Point ground roundabout; enter via Woodlands Square underground ramp.',
          'Driver pickup rate is 3x faster at underground Berth B.'
        ]
      },
      egress: {
        corridorName: 'Woodlands Ave 2 -> SLE Eastbound toward Central/North-East',
        viaRoads: ['Woodlands Ave 2', 'SLE (Seletar Expwy)'],
        currentDurationMins: 13,
        historicalTypicalDurationMins: 10,
        bestTimeToExit: '18:15 - 18:35',
        recommendedWindow: 'Exit toward SLE; avoid BKE Southbound due to Dairy Farm bottleneck',
        clearanceAdvise: 'SLE Eastbound operating at speed limit 90 km/h.',
        routeCoordinates: [
          [1.4369, 103.7865],
          [1.4310, 103.7910],
          [1.4240, 103.7970],
          [1.4170, 103.8030]
        ],
        instructions: [
          'Take Woodlands Ave 2 southward directly into SLE slip road.',
          'Smooth arterial flow out of northern residential ring.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 11, predictedDurationMins: 12, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 13, predictedDurationMins: 18, congestionIndex: 6 },
        { timeSlot: '17:30', typicalDurationMins: 15, predictedDurationMins: 21, congestionIndex: 7 },
        { timeSlot: '18:00', typicalDurationMins: 17, predictedDurationMins: 24, congestionIndex: 8 },
        { timeSlot: '18:30', typicalDurationMins: 18, predictedDurationMins: 25, congestionIndex: 9 },
        { timeSlot: '19:00', typicalDurationMins: 15, predictedDurationMins: 20, congestionIndex: 6 },
        { timeSlot: '20:00', typicalDurationMins: 12, predictedDurationMins: 14, congestionIndex: 4 }
      ]
    }
  },
  {
    id: 'orchard_dhoby',
    name: 'Orchard Road Retail Belt & Dhoby Ghaut Interchange',
    shortName: 'Orchard & Dhoby Ghaut',
    code: 'ORC-DHB',
    region: 'Central',
    coordinates: [1.2993, 103.8458],
    category: 'Retail Gateway',
    description: 'Prime retail shopping spine with Dhoby Ghaut triple MRT interchange (NSL, NEL, CCL), Plaza Singapura, ION Orchard, and Somerset.',
    humanTraffic: {
      hourlyInflow: 26800,
      hourlyOutflow: 25400,
      mrtTapOutPerMin: 360,
      busArrivalPerMin: 150,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 38,
      queueLengthCommuters: 65,
      averageWaitTimeMins: 15,
      unmetRequestsPerMin: 28,
      historicalAverageSupply: 60
    },
    weather: {
      condition: 'Moderate Rain',
      temperatureC: 27.0,
      rainfallRateMmHr: 18.5,
      stormOnsetProbability: 80,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'moderate'
    },
    events: [
      {
        name: 'Great Singapore Weekend Retail Egress',
        venue: 'ION Orchard to Plaza Singapura corridor',
        estimatedCrowd: 40000,
        egressTime: '18:00 - 21:00'
      }
    ],
    prediction: {
      taxiDemandIndex: 79,
      priority: 'high',
      projectedDemandPerMin: 52,
      supplyDeficit: 22,
      surgeMultiplier: 1.65,
      weatherMultiplier: 1.45,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 35,
      keyDriverReason: 'Shoppers stranded by moderate rain seeking sheltered rides along Orchard corridor.'
    },
    routing: {
      ingress: {
        corridorName: 'CTE Exit 4 -> Orchard Rd via Cavenagh Rd',
        viaRoads: ['CTE (Central Expwy)', 'Cavenagh Rd', 'Orchard Rd'],
        currentDurationMins: 16,
        historicalTypicalDurationMins: 12,
        bestTimeToEnter: '17:35 - 17:55',
        recommendedWindow: 'Enter before 18:00 CTE tunnel speed drops below 30 km/h',
        erpGantries: [
          { name: 'CTE after Braddell', rate: 2.5, activePeriod: '17:30 - 19:30' },
          { name: 'Orchard Rd Gantry', rate: 2.0, activePeriod: '18:00 - 20:00' }
        ],
        bottlenecks: ['Plaza Singapura taxi bay queue', 'Somerset Road traffic lights'],
        routeCoordinates: [
          [1.3140, 103.8500],
          [1.3080, 103.8470],
          [1.3030, 103.8460],
          [1.2993, 103.8458]
        ],
        instructions: [
          'Exit CTE at Exit 4 toward Cairnhill Circle / Cavenagh Rd.',
          'Take Handy Road into Dhoby Ghaut MRT taxi bay to avoid Orchard Rd bus-lane restrictions.'
        ]
      },
      egress: {
        corridorName: 'Penang Rd -> Clemenceau Ave -> CTE/PIE',
        viaRoads: ['Penang Rd', 'Clemenceau Ave', 'CTE'],
        currentDurationMins: 17,
        historicalTypicalDurationMins: 13,
        bestTimeToExit: '18:10 - 18:35',
        recommendedWindow: 'Fastest egress via Penang Rd one-way flow',
        clearanceAdvise: 'Penang Rd avoids core Orchard congestion.',
        routeCoordinates: [
          [1.2993, 103.8458],
          [1.2970, 103.8430],
          [1.2940, 103.8410],
          [1.2900, 103.8400]
        ],
        instructions: [
          'Route passengers out via Penang Rd into Clemenceau Ave.',
          'Direct connectivity into CTE northbound or Clarke Quay.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 11, predictedDurationMins: 12, congestionIndex: 3 },
        { timeSlot: '16:00', typicalDurationMins: 12, predictedDurationMins: 14, congestionIndex: 4 },
        { timeSlot: '17:00', typicalDurationMins: 14, predictedDurationMins: 19, congestionIndex: 7 },
        { timeSlot: '17:30', typicalDurationMins: 16, predictedDurationMins: 23, congestionIndex: 8 },
        { timeSlot: '18:00', typicalDurationMins: 19, predictedDurationMins: 27, congestionIndex: 9 },
        { timeSlot: '18:30', typicalDurationMins: 18, predictedDurationMins: 26, congestionIndex: 9 },
        { timeSlot: '19:00', typicalDurationMins: 16, predictedDurationMins: 21, congestionIndex: 7 },
        { timeSlot: '20:00', typicalDurationMins: 13, predictedDurationMins: 15, congestionIndex: 4 }
      ]
    }
  },
  {
    id: 'tampines_hub',
    name: 'Tampines Integrated Transport Hub & Regional Centre',
    shortName: 'Tampines ITH',
    code: 'TAM-ITH',
    region: 'East',
    coordinates: [1.3533, 103.9452],
    category: 'Integrated Interchange',
    description: 'Major Eastern regional commercial hub with 3 shopping malls, Our Tampines Hub sports complex, and EWL/DTL interchange.',
    humanTraffic: {
      hourlyInflow: 19200,
      hourlyOutflow: 17800,
      mrtTapOutPerMin: 270,
      busArrivalPerMin: 135,
      trend: 'stable',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 31,
      queueLengthCommuters: 48,
      averageWaitTimeMins: 12,
      unmetRequestsPerMin: 18,
      historicalAverageSupply: 45
    },
    weather: {
      condition: 'Light Showers',
      temperatureC: 28.1,
      rainfallRateMmHr: 8.5,
      stormOnsetProbability: 60,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'light'
    },
    events: [],
    prediction: {
      taxiDemandIndex: 68,
      priority: 'moderate',
      projectedDemandPerMin: 38,
      supplyDeficit: 14,
      surgeMultiplier: 1.4,
      weatherMultiplier: 1.25,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 20,
      keyDriverReason: 'Steady evening commuter arrival wave with passing showers over Tampines Central.'
    },
    routing: {
      ingress: {
        corridorName: 'TPE Exit 3A -> Tampines Ave 7 -> Ave 4',
        viaRoads: ['TPE (Tampines Expwy)', 'Tampines Ave 7', 'Tampines Ave 4'],
        currentDurationMins: 12,
        historicalTypicalDurationMins: 10,
        bestTimeToEnter: '17:45 - 18:15',
        recommendedWindow: 'Stable ingress window',
        erpGantries: [],
        bottlenecks: ['Tampines Central 1 taxi bay loop'],
        routeCoordinates: [
          [1.3680, 103.9530],
          [1.3610, 103.9500],
          [1.3560, 103.9470],
          [1.3533, 103.9452]
        ],
        instructions: [
          'Exit TPE at Exit 3A into Tampines Ave 7.',
          'Turn into Tampines Ave 4 toward Tampines Mall drop-off point.'
        ]
      },
      egress: {
        corridorName: 'Tampines Ave 5 -> PIE Eastbound / Westbound',
        viaRoads: ['Tampines Ave 5', 'PIE'],
        currentDurationMins: 11,
        historicalTypicalDurationMins: 9,
        bestTimeToExit: '18:15 - 18:40',
        recommendedWindow: 'Rapid access to expressway',
        clearanceAdvise: 'PIE westbound moving smoothly.',
        routeCoordinates: [
          [1.3533, 103.9452],
          [1.3490, 103.9420],
          [1.3430, 103.9380]
        ],
        instructions: [
          'Exit via Tampines Ave 5 straight onto PIE flyover.',
          'Average clearance time 11 mins.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 11, predictedDurationMins: 13, congestionIndex: 5 },
        { timeSlot: '17:30', typicalDurationMins: 12, predictedDurationMins: 15, congestionIndex: 6 },
        { timeSlot: '18:00', typicalDurationMins: 13, predictedDurationMins: 17, congestionIndex: 7 },
        { timeSlot: '18:30', typicalDurationMins: 13, predictedDurationMins: 16, congestionIndex: 6 },
        { timeSlot: '19:00', typicalDurationMins: 11, predictedDurationMins: 13, congestionIndex: 4 },
        { timeSlot: '20:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 2 }
      ]
    }
  },
  {
    id: 'harbourfront_vivocity',
    name: 'HarbourFront Ferry Terminal & VivoCity',
    shortName: 'HarbourFront & VivoCity',
    code: 'HBF-VIV',
    region: 'South',
    coordinates: [1.2644, 103.8222],
    category: 'Ferry/Port',
    description: 'Southern gateway connecting Sentosa Monorail, Indonesia/Batam/Bintan international ferries, and Singapore Cruise Centre.',
    humanTraffic: {
      hourlyInflow: 16800,
      hourlyOutflow: 15100,
      mrtTapOutPerMin: 220,
      busArrivalPerMin: 90,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 25,
      queueLengthCommuters: 58,
      averageWaitTimeMins: 17,
      unmetRequestsPerMin: 24,
      historicalAverageSupply: 48
    },
    weather: {
      condition: 'Partly Cloudy (Day)',
      temperatureC: 29.2,
      rainfallRateMmHr: 0.0,
      stormOnsetProbability: 35,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'none'
    },
    events: [
      {
        name: 'Sentosa Weekend Gateway Egress',
        venue: 'VivoCity Level 1 & Basement 2 Taxi Stands',
        estimatedCrowd: 18000,
        egressTime: '18:30 - 21:30'
      }
    ],
    prediction: {
      taxiDemandIndex: 72,
      priority: 'high',
      projectedDemandPerMin: 41,
      supplyDeficit: 18,
      surgeMultiplier: 1.5,
      weatherMultiplier: 1.05,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 25,
      keyDriverReason: 'Sentosa monorail returning visitors + Batam ferry disembarkation wave.'
    },
    routing: {
      ingress: {
        corridorName: 'Telok Blangah Rd -> VivoCity Basement Driveway',
        viaRoads: ['Telok Blangah Rd', 'HarbourFront Walk'],
        currentDurationMins: 13,
        historicalTypicalDurationMins: 10,
        bestTimeToEnter: '18:00 - 18:25',
        recommendedWindow: 'Enter before Sentosa weekend crowd exodus hits peak at 18:45',
        erpGantries: [],
        bottlenecks: ['VivoCity car park queue spilling onto Telok Blangah Rd'],
        routeCoordinates: [
          [1.2720, 103.8110],
          [1.2680, 103.8160],
          [1.2644, 103.8222]
        ],
        instructions: [
          'Proceed on Telok Blangah Rd eastbound, keep in right lane for dedicated taxi ramp into HarbourFront Centre.',
          'Avoid ground-level VivoCity entrance which shares traffic with mall shoppers.'
        ]
      },
      egress: {
        corridorName: 'West Coast Hwy Elevated -> MCE / CBD',
        viaRoads: ['West Coast Hwy', 'MCE'],
        currentDurationMins: 12,
        historicalTypicalDurationMins: 9,
        bestTimeToExit: '18:30 - 19:00',
        recommendedWindow: 'Fast clearance via elevated West Coast Hwy',
        clearanceAdvise: 'MCE inbound free-flowing.',
        routeCoordinates: [
          [1.2644, 103.8222],
          [1.2670, 103.8290],
          [1.2710, 103.8370]
        ],
        instructions: [
          'Direct drivers onto West Coast Highway elevated viaduct.',
          'Provides bypass of Keppel Rd traffic lights.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 11, predictedDurationMins: 13, congestionIndex: 5 },
        { timeSlot: '17:30', typicalDurationMins: 12, predictedDurationMins: 15, congestionIndex: 6 },
        { timeSlot: '18:00', typicalDurationMins: 14, predictedDurationMins: 18, congestionIndex: 7 },
        { timeSlot: '18:30', typicalDurationMins: 15, predictedDurationMins: 20, congestionIndex: 8 },
        { timeSlot: '19:00', typicalDurationMins: 13, predictedDurationMins: 17, congestionIndex: 6 },
        { timeSlot: '20:00', typicalDurationMins: 10, predictedDurationMins: 12, congestionIndex: 3 }
      ]
    }
  },
  {
    id: 'serangoon_nex',
    name: 'Serangoon MRT Interchange & Nex Mega Mall',
    shortName: 'Serangoon Nex',
    code: 'SRG-NEX',
    region: 'North-East',
    coordinates: [1.3498, 103.8738],
    category: 'Integrated Interchange',
    description: 'Major North-East transfer node linking North East Line (NEL) and Circle Line (CCL) beneath Nex mega mall.',
    humanTraffic: {
      hourlyInflow: 17500,
      hourlyOutflow: 16100,
      mrtTapOutPerMin: 245,
      busArrivalPerMin: 115,
      trend: 'stable',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 24,
      queueLengthCommuters: 42,
      averageWaitTimeMins: 11,
      unmetRequestsPerMin: 15,
      historicalAverageSupply: 38
    },
    weather: {
      condition: 'Cloudy',
      temperatureC: 27.8,
      rainfallRateMmHr: 3.5,
      stormOnsetProbability: 55,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'light'
    },
    events: [],
    prediction: {
      taxiDemandIndex: 62,
      priority: 'moderate',
      projectedDemandPerMin: 34,
      supplyDeficit: 11,
      surgeMultiplier: 1.35,
      weatherMultiplier: 1.15,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 18,
      keyDriverReason: 'Commuter evening shopping transfer crowd at Serangoon Ave 2.'
    },
    routing: {
      ingress: {
        corridorName: 'CTE Exit 8B -> Upper Serangoon Rd',
        viaRoads: ['CTE', 'Upper Serangoon Rd', 'Serangoon Ave 2'],
        currentDurationMins: 13,
        historicalTypicalDurationMins: 10,
        bestTimeToEnter: '17:40 - 18:05',
        recommendedWindow: 'Enter before 18:15',
        erpGantries: [],
        bottlenecks: ['Nex taxi bay right turn from Serangoon Central'],
        routeCoordinates: [
          [1.3390, 103.8650],
          [1.3440, 103.8690],
          [1.3498, 103.8738]
        ],
        instructions: [
          'From CTE, take Upper Serangoon Rd.',
          'Enter Nex Basement taxi driveway via Serangoon Central.'
        ]
      },
      egress: {
        corridorName: 'Boundary Rd -> Lorong Chuan -> CTE',
        viaRoads: ['Boundary Rd', 'Lorong Chuan'],
        currentDurationMins: 12,
        historicalTypicalDurationMins: 9,
        bestTimeToExit: '18:15 - 18:40',
        recommendedWindow: 'Use Lorong Chuan bypass to avoid Serangoon viaduct congestion',
        clearanceAdvise: 'Lorong Chuan green wave in effect.',
        routeCoordinates: [
          [1.3498, 103.8738],
          [1.3520, 103.8680],
          [1.3540, 103.8620]
        ],
        instructions: [
          'Turn right onto Boundary Rd, follow into Lorong Chuan.',
          'Provides immediate jump onto CTE toward City or Ang Mo Kio.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 9, predictedDurationMins: 11, congestionIndex: 3 },
        { timeSlot: '17:00', typicalDurationMins: 11, predictedDurationMins: 14, congestionIndex: 5 },
        { timeSlot: '17:30', typicalDurationMins: 13, predictedDurationMins: 16, congestionIndex: 6 },
        { timeSlot: '18:00', typicalDurationMins: 15, predictedDurationMins: 19, congestionIndex: 7 },
        { timeSlot: '18:30', typicalDurationMins: 14, predictedDurationMins: 18, congestionIndex: 7 },
        { timeSlot: '19:00', typicalDurationMins: 12, predictedDurationMins: 14, congestionIndex: 5 },
        { timeSlot: '20:00', typicalDurationMins: 9, predictedDurationMins: 10, congestionIndex: 3 }
      ]
    }
  },
  {
    id: 'one_north',
    name: 'One-North Technology, Biopolis & Fusionopolis Hub',
    shortName: 'One-North Tech Hub',
    code: 'ONE-NTH',
    region: 'West',
    coordinates: [1.2995, 103.7874],
    category: 'Tech Hub',
    description: 'Singapore knowledge economy & R&D cluster with Grab HQ, Shopee, A*STAR, Biopolis, and Mediacorp.',
    humanTraffic: {
      hourlyInflow: 13400,
      hourlyOutflow: 16800,
      mrtTapOutPerMin: 180,
      busArrivalPerMin: 75,
      trend: 'rising',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 20,
      queueLengthCommuters: 39,
      averageWaitTimeMins: 10,
      unmetRequestsPerMin: 14,
      historicalAverageSupply: 32
    },
    weather: {
      condition: 'Heavy Rain',
      temperatureC: 26.2,
      rainfallRateMmHr: 32.0,
      stormOnsetProbability: 90,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'heavy_deluge'
    },
    events: [],
    prediction: {
      taxiDemandIndex: 75,
      priority: 'high',
      projectedDemandPerMin: 39,
      supplyDeficit: 19,
      surgeMultiplier: 1.6,
      weatherMultiplier: 1.7,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 25,
      keyDriverReason: 'Intense rainstorm over Buona Vista / One-North during 18:00 tech worker office release.'
    },
    routing: {
      ingress: {
        corridorName: 'AYE Exit 8 -> North Buona Vista Rd -> Fusionopolis Way',
        viaRoads: ['AYE', 'North Buona Vista Rd', 'Fusionopolis Way'],
        currentDurationMins: 14,
        historicalTypicalDurationMins: 10,
        bestTimeToEnter: '17:35 - 17:55',
        recommendedWindow: 'Enter before 18:00 North Buona Vista bottleneck',
        erpGantries: [],
        bottlenecks: ['Fusionopolis Way taxi pickup layby'],
        routeCoordinates: [
          [1.2900, 103.7820],
          [1.2950, 103.7850],
          [1.2995, 103.7874]
        ],
        instructions: [
          'Take AYE Exit 8 onto North Buona Vista Rd.',
          'Turn into Fusionopolis Way for sheltered office pickup bays.'
        ]
      },
      egress: {
        corridorName: 'Portsdown Rd -> AYE Eastbound toward CBD',
        viaRoads: ['Portsdown Rd', 'AYE'],
        currentDurationMins: 11,
        historicalTypicalDurationMins: 9,
        bestTimeToExit: '18:10 - 18:30',
        recommendedWindow: 'Clear route via heritage Portsdown road',
        clearanceAdvise: 'Portsdown Rd has zero traffic lights.',
        routeCoordinates: [
          [1.2995, 103.7874],
          [1.2960, 103.7910],
          [1.2910, 103.7950]
        ],
        instructions: [
          'Exit via Portsdown Rd bypass directly onto AYE Eastbound slip road.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 7, predictedDurationMins: 8, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 },
        { timeSlot: '17:00', typicalDurationMins: 10, predictedDurationMins: 13, congestionIndex: 5 },
        { timeSlot: '17:30', typicalDurationMins: 12, predictedDurationMins: 16, congestionIndex: 7 },
        { timeSlot: '18:00', typicalDurationMins: 14, predictedDurationMins: 20, congestionIndex: 8 },
        { timeSlot: '18:30', typicalDurationMins: 13, predictedDurationMins: 18, congestionIndex: 7 },
        { timeSlot: '19:00', typicalDurationMins: 10, predictedDurationMins: 12, congestionIndex: 4 },
        { timeSlot: '20:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 }
      ]
    }
  },
  {
    id: 'woodlands_train',
    name: 'Woodlands Train Checkpoint & Old Causeway Terminal',
    shortName: 'Woodlands Train CP',
    code: 'WTC-KTM',
    region: 'North',
    coordinates: [1.4441, 103.7695],
    category: 'Integrated Interchange',
    description: 'KTM Shuttle Tebrau train checkpoint connecting Johor Bahru Sentral and Singapore rail commuters.',
    humanTraffic: {
      hourlyInflow: 8500,
      hourlyOutflow: 7900,
      mrtTapOutPerMin: 110,
      busArrivalPerMin: 55,
      trend: 'stable',
      disruptionAlert: undefined
    },
    taxiSupply: {
      availableTaxisInArea: 14,
      queueLengthCommuters: 28,
      averageWaitTimeMins: 13,
      unmetRequestsPerMin: 9,
      historicalAverageSupply: 22
    },
    weather: {
      condition: 'Thundery Showers',
      temperatureC: 26.5,
      rainfallRateMmHr: 22.0,
      stormOnsetProbability: 85,
      nowcastWindow: 'Next 2 Hours',
      rainStatus: 'moderate'
    },
    events: [],
    prediction: {
      taxiDemandIndex: 58,
      priority: 'moderate',
      projectedDemandPerMin: 22,
      supplyDeficit: 8,
      surgeMultiplier: 1.3,
      weatherMultiplier: 1.4,
      disruptionMultiplier: 1.0,
      recommendedDriverReposition: 12,
      keyDriverReason: 'KTM shuttle train arrivals matching evening cross-border commuters with rain.'
    },
    routing: {
      ingress: {
        corridorName: 'Woodlands Centre Rd via BKE',
        viaRoads: ['BKE', 'Woodlands Centre Rd'],
        currentDurationMins: 12,
        historicalTypicalDurationMins: 9,
        bestTimeToEnter: '17:50 - 18:15',
        recommendedWindow: 'Follow taxi lane into checkpoint loop',
        erpGantries: [],
        bottlenecks: ['Woodlands Centre Rd checkpoint security checkpoint'],
        routeCoordinates: [
          [1.4320, 103.7720],
          [1.4380, 103.7705],
          [1.4441, 103.7695]
        ],
        instructions: [
          'Take BKE North, proceed into Woodlands Centre Rd.',
          'Keep left at security checkpoint for authorized taxi queue.'
        ]
      },
      egress: {
        corridorName: 'Woodlands Centre Rd -> BKE Southbound',
        viaRoads: ['Woodlands Centre Rd', 'BKE'],
        currentDurationMins: 10,
        historicalTypicalDurationMins: 8,
        bestTimeToExit: '18:15 - 18:40',
        recommendedWindow: 'Exit south toward city or SLE',
        clearanceAdvise: 'BKE Southbound moving freely.',
        routeCoordinates: [
          [1.4441, 103.7695],
          [1.4380, 103.7710],
          [1.4310, 103.7740]
        ],
        instructions: [
          'Depart checkpoint onto BKE Southbound slip entrance.'
        ]
      },
      historicalHourlyDurations: [
        { timeSlot: '15:00', typicalDurationMins: 7, predictedDurationMins: 8, congestionIndex: 2 },
        { timeSlot: '16:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 },
        { timeSlot: '17:00', typicalDurationMins: 10, predictedDurationMins: 12, congestionIndex: 4 },
        { timeSlot: '17:30', typicalDurationMins: 11, predictedDurationMins: 14, congestionIndex: 5 },
        { timeSlot: '18:00', typicalDurationMins: 12, predictedDurationMins: 16, congestionIndex: 6 },
        { timeSlot: '18:30', typicalDurationMins: 12, predictedDurationMins: 15, congestionIndex: 5 },
        { timeSlot: '19:00', typicalDurationMins: 10, predictedDurationMins: 12, congestionIndex: 4 },
        { timeSlot: '20:00', typicalDurationMins: 8, predictedDurationMins: 9, congestionIndex: 2 }
      ]
    }
  }
];

export const REGISTERED_MCP_TOOLS = [
  {
    name: 'rs_station_crowd',
    description: 'Returns passenger volume trends and forecasted crowdedness levels at 30-minute intervals for the specified Singapore MRT station. Data is retrieved directly from the Land Transport Authority (LTA) DataMall Station Crowd Density Forecast API. Use this tool when assessing rail commuter volume, station platform congestion, and pickup surge potential for taxi and PHV drivers. It does not provide real-time bus passenger loads or non-rail transit crowd statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        station_code: { type: 'string', description: "MRT station alphanumeric code (e.g. 'NS1', 'EW24', 'DT35', 'CC1', 'NE1', 'TE1') to query crowd density" }
      },
      required: ['station_code']
    }
  },
  {
    name: 'rs_traffic_incidents',
    description: 'Returns active road accidents, vehicle breakdowns, roadworks, and heavy congestion alerts across the Singapore expressway and arterial network. Data is read directly from the Singapore Land Transport Authority (LTA) DataMall Traffic Incidents API. Call this tool to identify live route obstructions, delays, and incident hotspots to guide driver detours. It does not cover planned future road closures or general traffic light operational statuses.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'rs_weather_forecast',
    description: 'Returns forecasted rainfall intensity, storm warnings, and wet-weather conditions by time range across Singapore sectors. Data is read from the Singapore National Environment Agency (NEA) weather service API. Call this tool when predicting passenger surge triggered by sudden downpours or adverse driving conditions. It does not provide historical multi-year climate observations or typhoon tracking outside Singapore.',
    inputSchema: {
      type: 'object',
      properties: {
        date_time_range: { type: 'string', description: "Target date-time string (ISO 8601 like '2026-09-25T14:00:00' or 'now') specifying the forecast window" }
      }
    }
  },
  {
    name: 'rs_route_calculate',
    description: 'Returns travel distance and live duration estimates between origin and destination coordinates for drive, walk, or transit modes. Upstream is the GrabMaps routing API with hyperlocal Southeast Asian street network intelligence. Use this tool when calculating point-to-point journey times, driver repositioning distances, or passenger drop-off ETAs. It does not provide real-time toll transaction charges or variable electronic road pricing (ERP) debits.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: "Origin starting coordinates in 'lat,lng' format (e.g., '1.3521,103.8198')" },
        end: { type: 'string', description: "Destination endpoint coordinates in 'lat,lng' format (e.g., '1.2966,103.8501')" },
        mode: { type: 'string', enum: ['drive', 'walk', 'transit'], description: "Transportation mode: 'drive', 'walk', or 'transit'" }
      },
      required: ['start', 'end']
    }
  },
  {
    name: 'lta_datamall_get_hub_passenger_traffic',
    description: 'Queries Singapore LTA Datamall MCP endpoint for real-time passenger volume tap-outs, MRT transfer flows, bus arrivals, and MRT train disruption status at key transit hubs.',
    inputSchema: {
      type: 'object',
      properties: {
        hub_id: { type: 'string', description: 'Transport Hub ID, e.g. "jurong_east", "changi_airport", "woodlands_ith"' },
        include_mrt_alerts: { type: 'boolean', description: 'Whether to fetch active MRT line disruptions and track fault notices' }
      },
      required: ['hub_id']
    }
  },
  {
    name: 'nea_weather_get_forecast',
    description: 'Queries National Environment Agency (NEA) MCP weather feed for 2-hour nowcast, precipitation radar intensity, and sudden squall/storm onset probability by Singapore planning sector.',
    inputSchema: {
      type: 'object',
      properties: {
        sector: { type: 'string', description: 'Singapore geographical sector or hub name, e.g. "Jurong", "Changi", "Central Water Catchment"' }
      },
      required: ['sector']
    }
  },
  {
    name: 'onemap_get_hub_ingress_egress',
    description: 'Queries SLA OneMap Singapore Routing & Traffic Matrix MCP engine for historical vs forward congestion, optimal ingress/egress road corridors, ERP gantries, and best time windows.',
    inputSchema: {
      type: 'object',
      properties: {
        hub_id: { type: 'string', description: 'Transport Hub identifier' },
        time_slot: { type: 'string', description: 'Target operational time slot, e.g. "17:30"' }
      },
      required: ['hub_id']
    }
  },
  {
    name: 'grab_predict_taxi_surge',
    description: 'Integrates LTA human inflow, NEA storm data, OneMap congestion, and scheduled events to compute Taxi Demand Index (TDI 0-100), net cab deficit, surge multiplier, and prioritized fleet repositioning advice.',
    inputSchema: {
      type: 'object',
      properties: {
        hub_id: { type: 'string', description: 'Target Hub ID or "all"' },
        weather_override: { type: 'string', description: 'Simulated weather condition, e.g. "Heavy Thundery Showers"' },
        mrt_disruption_override: { type: 'boolean', description: 'Simulate an active MRT track fault alert' }
      }
    }
  },
  {
    name: 'grab_get_prioritized_taxi_demand_list',
    description: 'Generates a prioritized ranking of all Singapore transport hubs ordered by Taxi Demand Index (TDI) and supply deficit urgency for Grab Fleet Operators.',
    inputSchema: {
      type: 'object',
      properties: {
        min_priority: { type: 'string', enum: ['critical', 'high', 'moderate', 'all'], description: 'Filter threshold for priority level' }
      }
    }
  },
  {
    name: 'onemap_get_open_map_layer',
    description: 'Retrieves Singapore Land Authority (SLA) open spatial tile schema and vector boundary layers for Singapore transit sectors with zero proprietary or third-party API key requirements.',
    inputSchema: {
      type: 'object',
      properties: {
        layer_type: { type: 'string', enum: ['night_basemap', 'transit_corridors', 'planning_boundaries'], description: 'Spatial layer type to fetch' }
      }
    }
  },
  {
    name: 'grab_dispatch_fleet_broadcast',
    description: 'Broadcasts a high-priority push advisory to Grab driver app fleet within 10-min radius with guaranteed surge multiplier, bonus incentive, and recommended OneMap ingress corridor.',
    inputSchema: {
      type: 'object',
      properties: {
        hub_id: { type: 'string', description: 'Target hub ID to reposition fleet to' },
        bonus_incentive_sgd: { type: 'number', description: 'Driver bonus incentive in SGD (e.g. 5.50)' },
        surge_multiplier: { type: 'number', description: 'Surge multiplier to lock in for drivers (e.g. 1.8)' }
      },
      required: ['hub_id', 'bonus_incentive_sgd']
    }
  }
];
