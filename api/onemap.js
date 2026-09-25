/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getOneMapLocation } from '../lib/onemapService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const postalCode =
    req.query?.postal_code ||
    req.query?.postalCode ||
    req.query?.searchVal ||
    req.query?.postal;

  if (!postalCode) {
    return res.status(400).json({
      isError: true,
      message: 'OneMap API request failed because postal_code parameter is required with upstream status 400.',
    });
  }

  const data = await getOneMapLocation(String(postalCode));
  if (data.isError) {
    return res.status(502).json(data);
  }

  return res.status(200).json(data.result);
}
