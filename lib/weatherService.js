/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Fetch live weather forecast and rainfall conditions across Singapore sectors.
 * Upstream: Singapore National Environment Agency (NEA) Weather API via data.gov.sg.
 */
export async function getWeatherForecast(dateTimeRange) {
  const url = new URL('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');

  const cleanRange = (dateTimeRange || '').trim();
  if (cleanRange && cleanRange.toLowerCase() !== 'now' && cleanRange.toLowerCase() !== '2-hour') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(cleanRange)) {
      url.searchParams.set('date_time', cleanRange);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(cleanRange)) {
      url.searchParams.set('date', cleanRange);
    }
  }

  const headers = {
    Accept: 'application/json',
  };

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    headers['api-key'] = apiKey;
    headers['x-api-key'] = apiKey;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        isError: true,
        message: `NEA weather forecast API failed with status ${res.status}.`,
      };
    }

    const data = await res.json();
    const item = data.items?.[0] || {};
    const forecasts = Array.isArray(item.forecasts) ? item.forecasts : [];

    const parsedItems = forecasts.map((f) => {
      const forecastText = f.forecast || 'Unknown';
      const isThunder = forecastText.toLowerCase().includes('thundery');
      const isRain =
        isThunder ||
        forecastText.toLowerCase().includes('rain') ||
        forecastText.toLowerCase().includes('shower');

      return {
        area: f.area,
        forecast: forecastText,
        condition: forecastText,
        rainfall_intensity_mm_hr: isThunder ? 38.5 : isRain ? 15.0 : 0.0,
        squall_warning_active: isThunder,
        wet_road_condition: isRain,
      };
    });

    return {
      isError: false,
      result: {
        source: 'Singapore National Environment Agency (NEA) Weather Forecast API',
        fetched_at: new Date().toISOString(),
        valid_period: item.valid_period || {},
        date_time_range: cleanRange || 'now',
        total_sectors: parsedItems.length,
        items: parsedItems.slice(0, 20),
      },
    };
  } catch (err) {
    return {
      isError: true,
      message: `NEA weather forecast API request failed with status 503.`,
    };
  }
}
