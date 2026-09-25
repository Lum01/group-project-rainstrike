/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateRoute } from '../lib/routingService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, end, mode } = req.query || {};
  const data = await calculateRoute(
    String(start || ''),
    String(end || ''),
    String(mode || 'drive')
  );

  if (data.isError) {
    return res.status(502).json(data);
  }

  return res.status(200).json(data.result);
}
