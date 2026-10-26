# Competitor Profiling

Competitor Profiling creates dated, source-backed profiles that help a team understand how comparable products are positioned and where they differ. It works from known competitor URLs or can discover a bounded candidate set when the user provides only a target.

## Deliverables

- comparable profiles covering positioning, product/features, packaging and pricing;
- customer proof and selected public review evidence;
- optional, explicitly scoped search footprint, traffic/channel, technology, backlink or keyword findings;
- a cross-competitor comparison with implications, hypotheses and verification questions;
- clear missing-data and source notes rather than guessed facts.

## Example requests

> Compare these three competitors for our US launch. Cover positioning, features, pricing and customer proof, and cite every claim.

> We sell workflow software to small agencies. Discover a few likely competitors, then give me a quick comparison focused on packaging and search presence.

> Build a deep profile of these two companies, including their search-driving pages and estimated traffic channels. Keep search competitors separate from business competitors.

## Research and boundaries

Research uses a dated registry of tool identities and request/response contracts verified from the production AIsa MCP, so routine calls do not repeat tool discovery. If a contract changes, the skill refreshes it through MCP Search and Schema rather than guessing. OAuth is handled by the host; the skill never asks for credentials or calls third-party APIs directly. Quick profiles use a bounded sample of official pages. Deep or optional modules are only added when they answer a stated decision and have separate scope and authorization.

Search visibility, provider traffic estimates, reviews and case studies are not proof of market share, audience overlap, product quality or revenue. A blocked page, empty result or unavailable metric is `unknown`. This skill produces research and recommendations only: it does not send outreach, modify CRM or advertising accounts, publish content, sign agreements or make high-impact decisions.
