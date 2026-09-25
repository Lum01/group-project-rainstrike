/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Maps MRT station code prefixes to LTA DataMall TrainLine codes.
 */
function getTrainLineFromStationCode(stationCode) {
  const code = (stationCode || '').trim().toUpperCase();
  if (code.startsWith('NS')) return 'NSL';
  if (code.startsWith('EW')) return 'EWL';
  if (code.startsWith('DT')) return 'DTL';
  if (code.startsWith('CC')) return 'CCL';
  if (code.startsWith('NE')) return 'NEL';
  if (code.startsWith('TE')) return 'TEL';
  if (code.startsWith('CG')) return 'CGL';
  if (code.startsWith('CE')) return 'CEL';
  if (code.startsWith('BP')) return 'BPL';
  if (code.startsWith('SW') || code.startsWith('SE')) return 'SLRT';
  if (code.startsWith('PW') || code.startsWith('PE')) return 'PLRT';
  return 'EWL';
}

/**
 * Fetch passenger volume trends and crowd density forecast for a specified MRT station.
 * Upstream: LTA DataMall PCDForecast API.
 */
export async function getStationCrowd(stationCode) {
  const cleanCode = (stationCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return {
      isError: true,
      message: 'Station code parameter is required for station crowd forecast.',
    };
  }

  const apiKey = process.env.LTA_DATAMALL_API_KEY;
  if (!apiKey) {
    return {
      isError: true,
      message: 'LTA DataMall station crowd API failed because LTA_DATAMALL_API_KEY is not configured.',
    };
  }

  const trainLine = getTrainLineFromStationCode(cleanCode);
  const endpoint = `https://datamall2.mytransport.sg/ltaodataservice/PCDForecast?TrainLine=${trainLine}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        AccountKey: apiKey,
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        isError: true,
        message: `LTA DataMall station crowd forecast API failed with status ${res.status}.`,
      };
    }

    const data = await res.json();
    const records = Array.isArray(data.value)
      ? data.value.filter(
          (item) => item.Station && item.Station.toUpperCase() === cleanCode
        )
      : [];

    const itemsToReturn = records.length > 0 ? records : (Array.isArray(data.value) ? data.value : []);

    return {
      isError: false,
      result: {
        source: 'Singapore LTA DataMall Station Crowd Density Forecast API',
        fetched_at: new Date().toISOString(),
        station_code: cleanCode,
        train_line: trainLine,
        total_forecast_records: itemsToReturn.length,
        items: itemsToReturn.slice(0, 20),
      },
    };
  } catch (err) {
    return {
      isError: true,
      message: `LTA DataMall station crowd forecast API request failed with status 503.`,
    };
  }
}

/**
 * Fetch active road accidents, breakdowns, roadworks, and heavy congestion alerts.
 * Upstream: LTA DataMall Traffic Incidents API.
 */
export async function getTrafficIncidents() {
  const apiKey = process.env.LTA_DATAMALL_API_KEY;
  if (!apiKey) {
    return {
      isError: true,
      message: 'LTA DataMall traffic incidents API failed because LTA_DATAMALL_API_KEY is not configured.',
    };
  }

  const endpoint = 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        AccountKey: apiKey,
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        isError: true,
        message: `LTA DataMall traffic incidents API failed with status ${res.status}.`,
      };
    }

    const data = await res.json();
    const incidents = Array.isArray(data.value) ? data.value : [];

    return {
      isError: false,
      result: {
        source: 'Singapore LTA DataMall Traffic Incidents API',
        fetched_at: new Date().toISOString(),
        total_incidents: incidents.length,
        items: incidents.slice(0, 20),
      },
    };
  } catch (err) {
    return {
      isError: true,
      message: `LTA DataMall traffic incidents API request failed with status 503.`,
    };
  }
}
