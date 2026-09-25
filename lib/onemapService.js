/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Fetch verified address, coordinates, and building name for a Singapore postal code.
 * Upstream: Singapore Land Authority (SLA) OneMap Search API.
 * 
 * @param {string} postalCode - Six-digit Singapore postal code.
 * @returns {Promise<{ isError: boolean, result?: any, message?: string }>}
 */
export async function getOneMapLocation(postalCode) {
  const cleanPostal = (postalCode || '').toString().trim();
  if (!cleanPostal) {
    return {
      isError: true,
      message: 'OneMap API request failed because postal_code parameter is required with upstream status 400.',
    };
  }

  const endpoint = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
    cleanPostal
  )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

  const headers = {
    Accept: 'application/json',
  };

  if (process.env.ONEMAP_API_KEY) {
    headers['Authorization'] = process.env.ONEMAP_API_KEY;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        isError: true,
        message: `OneMap API request failed with upstream status ${res.status}.`,
      };
    }

    const data = await res.json();
    const rawResults = Array.isArray(data?.results) ? data.results : [];

    const items = rawResults.slice(0, 20).map((r) => {
      const name =
        r.BUILDING && r.BUILDING !== 'NIL'
          ? r.BUILDING
          : r.SEARCHVAL || r.ROAD_NAME || 'Unknown';
      const address = r.ADDRESS || r.SEARCHVAL || '';
      const coordinates = {
        latitude: parseFloat(r.LATITUDE) || 0,
        longitude: parseFloat(r.LONGITUDE) || 0,
        x: r.X,
        y: r.Y,
      };

      return {
        name,
        address,
        coordinates,
        postal_code: r.POSTAL && r.POSTAL !== 'NIL' ? r.POSTAL : cleanPostal,
        building: r.BUILDING && r.BUILDING !== 'NIL' ? r.BUILDING : undefined,
        road_name: r.ROAD_NAME && r.ROAD_NAME !== 'NIL' ? r.ROAD_NAME : undefined,
        block_no: r.BLK_NO && r.BLK_NO !== 'NIL' ? r.BLK_NO : undefined,
      };
    });

    const primary = items[0] || null;

    const result = {
      source: 'Singapore Land Authority (SLA) OneMap API',
      fetched_at: new Date().toISOString(),
      postal_code: cleanPostal,
      name: primary?.name || '',
      address: primary?.address || '',
      coordinates: primary?.coordinates || null,
      items: items.slice(0, 20),
    };

    return {
      isError: false,
      result,
    };
  } catch (err) {
    return {
      isError: true,
      message: 'OneMap API request failed with upstream status 503.',
    };
  }
}
