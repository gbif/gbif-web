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

1. In Vercel: **Add New → Project**, import `gbif/gbif-web` (the GBIF GitHub organisation must allow the Vercel app),
   and use these settings. This package is deployed on its own; nothing else in the repository is built.

   | Setting | Value |
   | --- | --- |
   | Project name | anything, e.g. `gbif-mcp` |
   | Framework Preset | **Other** |
   | Root Directory | **`packages/mcp`** |
   | Build Command | `npm run build` (set in `vercel.json`; leave the override off) |
   | Output Directory | `public` (set in `vercel.json`) |
   | Install Command | default (`npm install`; its `postinstall` generates the widget) |
   | Node.js Version | 22.x (pinned in `package.json`) |
   | Environment variables | none needed; the GBIF endpoints default to production |

   `/mcp` and `/canvas/:id` are rewrites in `vercel.json`; the two functions are the committed `api/mcp.ts` and
   `api/canvas.ts`. The branch to deploy is `feature/mcp-scaffold` until it is merged (see step 3).
2. Add storage for the canvas: **Storage → Marketplace → Upstash Redis**, connected to the project. It sets
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or the `KV_REST_API_*` equivalents, which are also read).
   Without it the canvas is kept in memory, which does not survive between serverless invocations, so charts
   will not show up on the canvas page.
3. Make the deployment reachable. A branch other than the Production Branch gets a *preview* deployment, and
   Vercel's Deployment Protection answers 401 to anything not signed in to Vercel, including a chat client.
   Pick one:
   - **Settings → Environments → Production → Branch Tracking**: set the production branch to
     `feature/mcp-scaffold` (change it back to `main` after merging). Production deployments are public unless
     protection is set to "All Deployments".
   - or **Settings → Deployment Protection**: turn off Vercel Authentication for this project (it only holds
     public GBIF data).
   - or keep protection and create a Protection Bypass for Automation token (clients cannot send it in the URL
     today, so this suits scripts such as `npm run smoke`, not chat connectors).
4. Check it:

   ```bash
   MCP_URL=https://<your-deployment>/mcp npm run smoke
   ```

   Then add `https://<your-deployment>/mcp` as a connector in your chat client and ask, for example:
   "Chart the records of Puma concolor per year", then open the Live view link it gives you.

The data comes from GBIF's production endpoints (`https://graphql.gbif.org/graphql` and `https://api.gbif.org`),
the same ones gbif.org uses. If they ever rate limit or block a deployed server, the tools say so ("GBIF answered
429 ... rate limited or blocked"). Optional settings are in [.env.example](.env.example): `GBIF_GRAPHQL_URL` and
`GBIF_API_URL` point at another GBIF environment, `PUBLIC_BASE_URL` overrides the address used in Live view links.

## Known limits (iteration one)

- The transport keeps no session, so a call without `canvas` starts a new canvas. The tool descriptions tell the
  model to pass the id from the Live view link; most models will.
- Anyone who has a canvas id can add charts to it through the MCP endpoint, and anyone with the link can view it.
  The id is a random 128-bit value that expires after 24 hours, but treat it as unlisted, not private.
- The canvas page polls every 3 seconds instead of streaming.
- No authentication, rate limiting or caching yet.
