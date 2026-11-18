# gbif-mcp

A remote [MCP](https://modelcontextprotocol.io) server that lets a chat client or coding agent ask GBIF
questions, and a live **canvas** page that collects the charts of a conversation.

Status: early prototype. Read [docs/vision.md](docs/vision.md) for the idea and [AGENTS.md](AGENTS.md) if you are
about to change something.

## Try it locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

The server listens on `http://localhost:3333/mcp`. In a second terminal:

```bash
npm run smoke
```

That connects a real MCP client, matches a species, counts and charts its records from live GBIF, and checks
that the canvas page and API serve the chart. It prints what the model would see.

Offline checks:

```bash
npm test
npm run typecheck
```

## Tools

| Tool | What it does |
| --- | --- |
| `match_taxon` | Species or group name to a GBIF `taxonKey`, with confidence and alternatives. |
| `search_occurrences` | Count for a filter, optionally with a breakdown and up to 20 sample records. |
| `chart` | Breaks down all matching records by year, month, country, basis of record, dataset, continent, licence or media type. Shown as a widget in clients that support MCP Apps, and added to the canvas. |

Filters are `key=value` pairs separated by spaces, for example `taxonKey=2435099 country=DK year=2010-2025`.
Fields: `taxonKey`, `country` (ISO 2-letter), `year`, `month`, `basisOfRecord`, `datasetKey`, `publishingOrg`,
`mediaType`, `hasCoordinate`, `hasGeospatialIssue`. Comma is OR, `year=2010-2025` and `year>=2010` are ranges.
Anything not understood is reported under `Not applied` and never silently dropped.

## Connect a client

Locally, clients that run on your machine can use `http://localhost:3333/mcp`. For Claude Code:

```bash
claude mcp add --transport http gbif http://localhost:3333/mcp
```

Chat clients on the web (claude.ai and others) need a public HTTPS address, so deploy it (below) and add the URL
as a custom connector in the client's settings. No authentication is needed; everything is public data.

## Deploy to Vercel

1. Import the repository in Vercel and set the **Root Directory** to `packages/mcp`. The settings in
   `vercel.json` do the rest (`npm run build`, output `public`, `/mcp` and `/canvas/:id` rewrites).
2. Add storage for the canvas: **Storage → Marketplace → Upstash Redis**, connected to the project. It sets
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or the `KV_REST_API_*` equivalents, which are also read).
   Without it the canvas is kept in memory, which does not survive between serverless invocations, so charts
   will not show up on the canvas page.
3. Deployment Protection: Vercel protects preview deployments by default and answers 401 to anything not
   signed in, including a chat client. Test against the production URL, or turn protection off for this
   project, or use a protection bypass token.
4. Check it:

   ```bash
   MCP_URL=https://<your-deployment>/mcp npm run smoke
   ```

   Then add `https://<your-deployment>/mcp` as a connector in your chat client and ask, for example:
   "Chart the records of Puma concolor per year", then open the Live view link it gives you.

Optional settings are in [.env.example](.env.example): `GBIF_GRAPHQL_URL` and `GBIF_API_URL` point at other
GBIF environments, `PUBLIC_BASE_URL` overrides the address used in Live view links.

## Known limits (iteration one)

- The transport keeps no session, so a call without `canvas` starts a new canvas. The tool descriptions tell the
  model to pass the id from the Live view link; most models will.
- Anyone who has a canvas id can add charts to it through the MCP endpoint, and anyone with the link can view it.
  The id is a random 128-bit value that expires after 24 hours, but treat it as unlisted, not private.
- The canvas page polls every 3 seconds instead of streaming.
- No authentication, rate limiting or caching yet.
