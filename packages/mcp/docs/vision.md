# Vision

## The goal

Anyone should be able to ask a question about biodiversity data in the chat client or coding agent they
already use, and get an answer that is correct, cited and easy to follow up on gbif.org.

Users bring their own model (Claude, Gemini, a small local model). GBIF hosts no model and pays for none.
This server is the part that knows GBIF: its fields, its keys, its APIs and their quirks. The model
supplies the language; we supply the domain.

Chat is expected to become a common way in. gbif.org search and entity pages stay the place to go deeper, so
every answer links back to the site.

## What good looks like

A person asks "how many records of this species are there in Denmark, and where can I see them?" in a
client with no UI support, using a small local model. The answer has correct numbers, says where they come
from, names the dataset and licence, and ends with a working link. The same question in a client that
supports MCP Apps also shows a chart. Either way there is a link to a live page that collects the charts of
the conversation.

## How we get there

Each answer is built in layers, and every layer falls back to plain text:

1. A short text answer: counts, names, keys, dataset, publisher, licence.
2. Links to the matching search or entity page on gbif.org.
3. A link to a live **canvas** page with the charts and maps of this conversation.
4. The exact API call behind the numbers, so a coding agent can rerun it.
5. An MCP App widget, only when the client supports it.

The principles behind it (text first, few tools with flat parameters, one filter string, deterministic server,
GraphQL stays private, say what was inferred, say whether numbers are exact) are in
[design-note.md](design-note.md). That note is the reference; this page is the why.

## Where we are

Iteration one is deliberately small, to get the whole path working before making any part clever:

- Three tools: `match_taxon`, `search_occurrences`, `chart`.
- A strict `key=value` filter. The agent is expected to supply meaningful values.
- Data through GBIF's GraphQL API.
- A canvas page and an MCP App widget that draw the same charts with the same renderer.
- Runs locally with one command and deploys to Vercel.

## What comes next

In rough order, each step usable on its own (the full build order is in the design note):

1. **Generous filter parsing**: names, synonyms, pasted gbif.org URLs, relative dates, ambiguity with candidates,
   and a test corpus built from real queries. Whether a small decision model helps here is an open question to
   evaluate against that corpus, not an assumption. The design note's rule is a deterministic server; changing
   it would be a deliberate decision.
2. **More tools**: registry search, entity details, country statistics, documentation search.
3. **Richer charts**: more dimensions, series, maps, grouped extremes.
4. **Canvas that follows a conversation** (sessions, expiry, ownership), and MCP App widgets for maps.
5. **Downloads with a citable DOI**, behind OAuth.

## Out of scope

- Hosting or calling any language model from this server (for now).
- Letting an agent write GraphQL or supply URLs.
- Replacing gbif.org. We route people there.
