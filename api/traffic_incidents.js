/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getTrafficIncidents } from '../lib/ltaService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = await getTrafficIncidents();

  if (data.isError) {
    return res.status(502).json(data);
  }

  return res.status(200).json(data.result);
}
