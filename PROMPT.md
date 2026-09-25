# RainStrike MCP Server Integration Prompt

## Repository
`https://github.com/Lum01/group-project-rainstrike.git` for a real-time weather tracking application with interactive maps.

## Role
You are a senior full-stack developer working in this existing Vite + React project. It already has `server.ts`, which the AI Studio preview runs, and an `api/` folder at the project root, which Vercel runs.

## Goal
Publish this app's existing data routes as an MCP server at `/api/mcp`, so that an agent this team did not write can discover the tools and call them.

## Requirements & Output

1. **Dependencies**:
   - Add `@modelcontextprotocol/sdk` at exactly version `1.30.1`, and `zod` if it is not installed.
   - Do not use `@modelcontextprotocol/server`, `@modelcontextprotocol/client` or `mcp-handler`: they speak a newer protocol that Gemini's SDK does not accept yet.

2. **Serverless Handler (`api/mcp.js`)**:
   - Create `api/mcp.js` at the project root, beside `package.json` and never inside `src/`.
   - Exports `default async function handler(req, res)`.
   - **On POST**:
     - Create `new McpServer({ name: "rainstrike-server", version: "1.0.0" })`.
     - Register the tool(s) below.
     - Create `new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })`.
     - `await server.connect(transport)`.
     - `await transport.handleRequest(req, res, req.body)`.
     - When `res` closes, close the transport and the server.
     - Build both fresh on every request; this server keeps no sessions.
   - **On any other HTTP method**:
     - Answer HTTP 405 with `{"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed"},"id":null}`.

3. **Express Dev Server Integration (`server.ts`)**:
   - In `server.ts`, after `express.json()`, register the same handler with:
     - `app.post("/api/mcp", handler)`
     - `app.get("/api/mcp", handler)`
   - Import directly from `api/mcp.js` rather than copying code.
   - The preview runs this form and Vercel runs the file; neither works in the other place, so both are required.

4. **Tool Registration (`server.registerTool`)**:
   - Register each tool calling the shared function its route already uses, imported directly, never by fetching this app's own URL.
   - **Tool**: `rainstrike_location_crowdlocation(postal_code)`:
     - Wraps `GET /api/onemap` and returns the address, coordinates, and name.
   - **Naming**:
     - Starts with `rainstike_` (or `rainstrike_`) and uses only lowercase letters, digits, and underscores.
   - **Description**:
     - Exactly two to four sentences:
       1. What comes back.
       2. Which upstream it is read from.
       3. When an agent should use it.
       4. One thing it does not cover.
   - **Input Validation**:
     - Zod schema with `.describe()` explaining exact accepted format, matching and validating route parameters.
   - **Annotations**:
     - `annotations: { readOnlyHint: true, openWorldHint: true }`.
   - **Return Structure**:
     - Returns `{ content: [{ type: "text", text: JSON.stringify(result) }] }`.
     - Result contains at most 20 items, `"source"` naming the upstream, and `"fetched_at"` as an ISO timestamp.
   - **Error Handling**:
     - If upstream fails, returns `{ isError: true, content: [{ type: "text", text: one sentence naming what failed and the upstream status }] }`.
     - Never returns sample, seed, or fallback data.

5. **Shared Code Structure**:
   - Shared code lives in `lib/` or in files under `api/` whose names start with an underscore (`_`).
   - Note: Vercel turns every other file in `api/` into a public route.

## Guardrails
- **Read-Only**: Only read-only tools allowed (no operations that write, send, delete, or spend).
- **Secrets Management**: Never put a key, token, or password in a tool result, description, or log. Keys remain strictly in `process.env`.
- **Stateless**: No database and no authentication/login requirements.
- **Preserve Existing Surfaces**: Maintain all existing application routes and UI screens unchanged.

## Context
- Deployed on Vercel from GitHub repository: `https://github.com/Lum01/group-project-rainstrike.git`.
- Configured environment variables: `GEMINI_API_KEY`, `URA_ACCESS_KEY`, `ONEMAP_API_KEY`.
- External caller specification: Agents consume `https://group-project-rainstrike.vercel.app/mcp` via the Gemini SDK's `mcpToTool`, adhering to MCP protocol `2025-11-25` over Streamable HTTP.
