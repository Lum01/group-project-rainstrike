/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculate route distance and live duration between origin and destination.
 * Upstream: GrabMaps routing API.
 */
export async function calculateRoute(start, end, mode = 'drive') {
  const cleanStart = (start || '').trim();
  const cleanEnd = (end || '').trim();
  const travelMode = (mode || 'drive').toLowerCase();

  const startCoords = cleanStart.split(',').map((s) => parseFloat(s.trim()));
  const endCoords = cleanEnd.split(',').map((s) => parseFloat(s.trim()));

  if (
    startCoords.length !== 2 ||
    endCoords.length !== 2 ||
    isNaN(startCoords[0]) ||
    isNaN(startCoords[1]) ||
    isNaN(endCoords[0]) ||
    isNaN(endCoords[1])
  ) {
    return {
      isError: true,
      message: 'Invalid start or end coordinates; format must be "lat,lng".',
    };
  }

  const apiKey = process.env.GRABMAPS_API_KEY;
  if (!apiKey) {
    return {
      isError: true,
      message: 'GrabMaps routing API failed because GRABMAPS_API_KEY is not configured.',
    };
  }

  const [startLat, startLng] = startCoords;
  const [endLat, endLng] = endCoords;

  // AWS Location Service GrabMaps routing endpoint (ap-southeast-1)
  const awsMode = travelMode === 'walk' ? 'Walking' : 'Car';
  const awsUrl = `https://routes.geo.ap-southeast-1.amazonaws.com/routes/v0/calculators/grab/calculate/route?key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(awsUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        DeparturePosition: [startLng, startLat],
        DestinationPosition: [endLng, endLat],
        TravelMode: awsMode,
        DepartNow: true,
        DistanceUnit: 'Kilometers',
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // If AWS endpoint rejected or failed, attempt direct partner endpoint
      const directUrl = `https://partner-api.grab.com/grabmaps/routing/v1/route?origin=${startLat},${startLng}&destination=${endLat},${endLng}&mode=${travelMode}`;
      const directController = new AbortController();
      const directTimeout = setTimeout(() => directController.abort(), 7000);
      const directRes = await fetch(directUrl, {
        signal: directController.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      });
      clearTimeout(directTimeout);

      if (!directRes.ok) {
        return {
          isError: true,
          message: `GrabMaps routing API failed with status ${res.status}.`,
        };
      }

      const directData = await directRes.json();
      const directSteps = directData.routes?.[0]?.legs?.[0]?.steps || [];
      return {
        isError: false,
        result: {
          source: 'GrabMaps Direct Routing API',
          fetched_at: new Date().toISOString(),
          start: `${startLat},${startLng}`,
          end: `${endLat},${endLng}`,
          mode: travelMode,
          summary: directData.routes?.[0]?.summary || {
            distance_km: directData.distance || 0,
            duration_minutes: directData.duration || 0,
          },
          items: directSteps.slice(0, 20),
        },
      };
    }

    const data = await res.json();
    const summary = data.Summary || {};
    const legs = Array.isArray(data.Legs) ? data.Legs : [];
    const steps = legs.flatMap((leg) => (Array.isArray(leg.Steps) ? leg.Steps : []));

    return {
      isError: false,
      result: {
        source: 'GrabMaps Routing Engine (Amazon Location Service)',
        fetched_at: new Date().toISOString(),
        start: `${startLat},${startLng}`,
        end: `${endLat},${endLng}`,
        mode: travelMode,
        summary: {
          distance_km: summary.Distance || 0,
          duration_minutes: Math.round((summary.DurationSeconds || 0) / 60),
          departure_time: summary.DepartureTime || new Date().toISOString(),
        },
        items: steps.slice(0, 20),
      },
    };
  } catch (err) {
    return {
      isError: true,
      message: `GrabMaps routing API request failed with status 503.`,
    };
  }
}
