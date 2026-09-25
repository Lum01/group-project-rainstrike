/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getWeatherForecast } from '../lib/weatherService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const range = req.query?.date_time_range || 'now';
  const data = await getWeatherForecast(String(range));

  if (data.isError) {
    return res.status(502).json(data);
  }

  return res.status(200).json(data.result);
}
