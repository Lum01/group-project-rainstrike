/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { getOneMapLocation } from '../lib/onemapService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    const errorPayload = {
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed' },
      id: null,
    };
    if (typeof res.status === 'function') {
      return res.status(405).json(errorPayload);
    }
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(errorPayload));
  }

  // Ensure accept header is compatible with MCP Streamable HTTP specification
  if (
    req.headers &&
    (!req.headers['accept'] || !req.headers['accept'].includes('text/event-stream'))
  ) {
    req.headers['accept'] = req.headers['accept']
      ? `${req.headers['accept']}, text/event-stream`
      : 'application/json, text/event-stream';
  }

  // Support calling alias if request body references typo form
  if (
    req.body &&
    req.body.params &&
    req.body.params.name === 'rainstike_location_crowdlocation'
  ) {
    req.body.params.name = 'rainstrike_location_crowdlocation';
  }

  const server = new McpServer({
    name: 'rainstrike-server',
    version: '1.0.0',
  });

  server.registerTool(
    'rainstrike_location_crowdlocation',
    {
      description:
        'Returns the verified street address, geographic coordinates, and building name for a specified Singapore postal code. Data is read directly from the Singapore Land Authority (SLA) OneMap Geocoding API. Use this tool when looking up geographic coordinates, verifying building addresses, or identifying transit crowd locations by postal code. It does not provide real-time crowd passenger counts, interior building layout plans, or locations outside Singapore.',
      inputSchema: {
        postal_code: z
          .string()
          .describe(
            "Six-digit Singapore postal code (e.g., '650114', '048624', or '238801') to look up verified address, building name, and coordinates."
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ postal_code }) => {
      const resp = await getOneMapLocation(postal_code);
      if (resp.isError) {
        return {
          isError: true,
          content: [{ type: 'text', text: resp.message }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(resp.result) }],
      };
    }
  );

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', async () => {
    try {
      await transport.close();
    } catch (_) {}
    try {
      await server.close();
    } catch (_) {}
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
