# AIsa GTM

AIsa GTM is an agent plugin for market, customer, creator, website-growth and evidence-grounded marketing workflows powered by the AIsa MCP server. The current tree bundles Creator Marketing, Competitor Profiling, Customer Research, Prospecting, Content Strategy, SEO Audit, Cold Email and AI SEO.

## Install from GitHub in Claude

The shared marketplace is [AIsa-team/aisa-plugins](https://github.com/AIsa-team/aisa-plugins).
Add it as a GitHub marketplace in Claude's Plugins screen, then install **AIsa GTM**.
In Claude Code, run:

```bash
claude plugin marketplace add AIsa-team/aisa-plugins
claude plugin install aisa-gtm@aisa
```

For a one-session development load from the registry root, run:

```bash
claude --plugin-dir ./packages/aisa-gtm-agents
```

Connect the AIsa MCP server through the host's OAuth prompt when needed; no API
key is bundled. The plugin's native identity remains `aisa-gtm`.

For organization GitHub sync, connect the shared registry repository after
configuring the Claude GitHub App and organization plugin permissions. The root
marketplace points to `./packages/aisa-gtm-agents`. Keep this package's
`.claude-plugin/plugin.json` version current for each Claude release. Repository
sync and submission to Anthropic's public plugin directory are separate actions.

Validate the native package from the registry root:

```bash
claude plugin validate ./packages/aisa-gtm-agents --strict
```

## Included components

| Component | Purpose |
|---|---|
| AIsa MCP | Connects to `https://tools.aisa.one/mcp`; OAuth is handled by the MCP host |
| Creator Marketing | Reuses supplied proposals or runs bounded creator discovery, compares partnership models, prepares briefs and invitation drafts, and defines fully loaded pilot budgets and measurement |
| Competitor Profiling | Builds dated, source-backed competitor profiles and comparisons from official pages and explicitly scoped search, traffic, channel, technology, keyword or backlink evidence |
| Customer Research | Synthesizes supplied research and bounded public customer conversations into evidence ledgers, themes, JTBD, hypotheses and research gaps |
| Prospecting | Turns a B2B ICP or existing account list into a bounded, deduplicated and prioritized company/contact shortlist with evidence, confidence and explicit unknowns |
| Content Strategy | Turns business goals, customer evidence, keyword demand, existing content and competitor gaps into prioritized pillars, topic clusters and an editorial roadmap |
| SEO Audit | Audits a bounded sample of pages for traditional SEO issues and produces a prioritized repair plan with explicit evidence and unknowns |
| Cold Email | Drafts and reviews recipient-specific B2B cold emails and differentiated follow-up sequences without sending or enrolling contacts |
| AI SEO | Analyzes supplied AI answers and supports bounded sampling on production-verified synchronous engines, recording mentions and citations by query/market/language/date and recommending evidence-backed GEO/AEO improvements |

Creator Marketing uses a dated production registry for 3–5-person YouTube/TikTok discovery, known Instagram profile/post research, YouTube content search, public web search/extraction and selected business-email lookup. Its bounded YouTube discovery core passed an authorized production E2E. Supplied candidates and quotes take precedence over duplicate research, and pure planning can remain zero-tool. Content similarity never becomes audience overlap, follower quality or expected sales.

Competitor Profiling uses a production-verified registry of AIsa request and response contracts for its known tools, so routine calls do not repeat tool discovery. It separates business competitors from search competitors and provider-similar sites, and treats traffic/channel outputs as estimates rather than market share or revenue.

Prospecting uses a dated registry for staged Apollo company search, finalist-only enrichment and optional decision-maker research. It does not claim a multi-provider waterfall or verified deliverability, infer sensitive attributes, make high-impact individual decisions, send outreach, or change Apollo/CRM records.

Content Strategy starts with supplied customer, analytics, keyword and content materials, then buys only bounded evidence that can change a topic or priority decision. It separates searchable demand from shareable hypotheses, keeps locale and provider estimates explicit, and does not turn search volume into a promise of business outcomes.

Cold Email works from the recipient, company context, value proposition, proof and ask supplied by the user, so its normal path makes no external call. Optional public-company research is used only for a material evidence gap, quoted before execution and kept separate from prospect discovery and email delivery.

AI SEO uses DataForSEO's ChatGPT consumer-answer scraper as a core sampling path, with production Search/Schema/Quote verified and Use still untested as of 2026-09-16. Google AI Mode retains its successful production E2E. Gemini's scraper contract is verified but execution is blocked by an unresolved quote discrepancy. Claude live is excluded; the failed Oxylabs LLM Realtime path stays disabled. Supplied exports remain supported. Each result is a provider-observed sample; optional single-target and cross-target LLM Mentions metrics describe a separate pre-collected database, not platform-wide visibility or customer request logs.

## How research runs

The skill uses four AIsa MCP tools:

1. For a new or changed capability, `AISA_SEARCH_TOOL` selects it and `AISA_BATCH_GET_SCHEMA` retrieves the full contract.
2. For a routine capability in a dated, production-verified Skill registry, the Skill reuses that exact identity and contract without repeating discovery.
3. `AISA_BATCH_QUOTE` prices the exact request.
4. `AISA_BATCH_USE` executes an authorized request.

Paid execution requires the user's existing approval to cover the quoted scope and cost. The plugin does not contain credentials, direct HTTP helpers, persistent billing state or automatic paid retries.

## Example requests

> Find five YouTube creators covering camping gear for a US launch, explain their fit, and design a three-creator pilot. Show the research quote before paid execution.

> Compare these creator proposals and recommend a four-week UGC pilot within our campaign budget, including rights, revisions and team workload.

> Turn our occasional product gifting into a 90-day ambassador pilot with selection criteria, compensation options and measurement.

> Compare these competitor domains on positioning, pricing and customer proof, then add explicitly scoped search or traffic evidence and cite every material claim.

> Find 15 US B2B SaaS companies matching this ICP, explain each fit and data gap, and quote the smallest company-search sample before paid execution.

> Use these customer interviews, GSC export and existing-content inventory to build a prioritized 90-day content roadmap without purchasing overlapping research.

> Draft a cold email and three follow-ups for this VP of Operations using the company signal, value proposition and case-study proof I supplied. Map each personalized claim to its evidence and do not send anything.

> Test these three questions for our brand in Google AI Mode for the United States, record the answer and citations for each cell, and turn the observed gaps into a prioritized GEO/AEO plan.

## Research and development roadmap

The research behind the next GTM skills is kept in the project so future agents can implement it without reconstructing the tool review:

- [`docs/gtm-process.md`](docs/gtm-process.md) defines the GTM lifecycle and maps every current or proposed skill to it.
- [`docs/skill-actions/`](docs/skill-actions/README.md) contains one implementation handoff per skill, including its status, upstream sources, original data sources, AIsa tool policy, workflow and acceptance criteria. It also includes the `skill-creator`-based readiness review and shared implementation checklist.

These roadmap documents include both planning artifacts and implementation records. Creator Marketing, Customer Research, Prospecting and Content Strategy include dated, authorized production AIsa Quote/Use E2E records; SEO Audit includes a documented negative compatibility E2E and an explicit untested multi-page path. AI SEO records both a non-retryable `$0` Oxylabs ChatGPT rejection and a successful, authorized synchronous Google AI Mode E2E with quote, actual cost, response shape, and latency. Each future paid call still requires its own matching quote and covering authorization. Only components listed under Included components are currently bundled for use.

## Directory layout

Paths below are relative to `packages/aisa-gtm-agents/`. Marketplace catalogs live
at the shared registry root.

```text
.
├── .codex-plugin/plugin.json
├── .claude-plugin/plugin.json
├── .mcp.json
├── AGENTS.md
├── README.md
├── docs/
│   ├── gtm-process.md
│   └── skill-actions/
└── skills/
    ├── competitor-profiling/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── creator-marketing/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── customer-research/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── content-strategy/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── prospecting/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── seo-audit/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    ├── cold-email/
    │   ├── SKILL.md
    │   ├── README.md
    │   └── references/
    └── ai-seo/
        ├── SKILL.md
        ├── README.md
        └── references/
```

This plugin prepares research and reviewable campaign materials. Cold Email never sends, schedules or enrolls contacts; sending outreach, signing agreements, paying creators and publishing content remain separately authorized actions.
