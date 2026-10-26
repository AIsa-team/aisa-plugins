# AIsa MCP usage

This reference governs tool selection and execution for SEO Audit. OAuth is managed by the MCP host. Never add credentials or call Router/provider HTTP directly.

## Execution contract

Use the four AIsa entry points in this order for a new or changed capability:

```text
AISA_SEARCH_TOOL → AISA_BATCH_GET_SCHEMA (when needed) → AISA_BATCH_QUOTE → AISA_BATCH_USE
```

A dated registry may begin at Quote, but every paid call still needs a fresh exact quote and existing authorization covering the same provider, scope, arguments and price. Pass identical `tool` and `arguments` from Quote to Use. Do not retry paid Use automatically, split scope to evade approval, or substitute another provider. Validate the AIsa batch item before reading provider data.

## Production-verified core registry

### `post_dataforseo_on_page_content_parsing_live`

- Role: core page parsing for a known public URL without a prior crawl.
- Verified: 2026-09-14 against production AIsa MCP Search, Quote and Use.
- Request: `{ "body": [{ "url": "https://...", "accept_language": "en-US", "markdown_view": true }] }`. `url` is required; the language header and Markdown view are optional. JavaScript and browser rendering default to false and were not enabled in the verification.
- Runtime constraint: use exactly one `body` item per tool call. The published schema permits an array, but production DataForSEO accepted only the first of three items and returned provider status `40000` with `You can set only one task at a time.` for each later item. For multiple pages, Quote separate one-item calls together and execute only the authorized calls.
- Response: validate AIsa `results[]` first, then top-level provider `status_code`/`status_message` and `tasks_error`, then every `tasks[i].status_code`/`status_message`, `cost`, `time` and `result`. A successful page returned `tasks[i].result[0]` with `crawl_progress`, `crawl_status`, `items` and `items_count`.
- Evidence limits: static parsing does not prove Google indexation, full-site coverage, JavaScript-injected markup, mobile usability or Core Web Vitals.

### 2026-09-14 — authorized negative compatibility test (not the supported multi-page path)

- Scope attempted: one quoted aggregate call containing `https://openai.com/`, `https://openai.com/business/` and `https://openai.com/api/`, each with `accept_language: "en-US"` and `markdown_view: true`; no crawl, JavaScript or browser rendering.
- Quote and authorization: `$0.002610`, `estimate_kind=estimate`, may exceed estimate and no guaranteed maximum; the user explicitly authorized this exact one-time compatibility-test scope and risk. This authorization must not be reused for separate calls.
- Result: AIsa batch `success_count=1`, `error_count=0`; its one call was `successful=true` with upstream HTTP 200. Provider top level was `20000 / Ok.` but `tasks_error=2`: the homepage task succeeded (`20000 / Ok.`, one result), while the Business and API tasks each returned `40000 / You can set only one task at a time.` with no result. Those two pages remain unknown and were not retried.
- Actual: AIsa charged `262` micro-USD (`$0.000262`); the provider reported `$0.00015`. Observed Use latency was about 1.54 seconds end to end, with provider time `0.3836 sec.` and successful-task time `0.3218 sec.`
- Assertion: this negative test demonstrates that the aggregate three-item request is incompatible with the provider and that wrapper/provider success cannot replace per-task validation. It does **not** verify three independent one-item calls, their separate quotes, or authorization for them; no supported multi-page E2E is recorded.

### Supported multi-page path — not yet tested

For the three pages above, the supported path is three independent calls, each with exactly one `body` item. Each call must be quoted as part of the intended set and executed only under matching authorization. No quote, authorization or Use result for that three-call path is recorded in this repository.

### Candidates requiring runtime Search/Schema before Quote

- Core candidates: `post_tavily_extract`, `post_dataforseo_labs_google_domain_rank_overview_live`, `post_dataforseo_labs_google_relevant_pages_live`.
- Conditional candidates: `post_dataforseo_on_page_lighthouse_live_json`, `post_dataforseo_labs_google_historical_rank_live`, `get_dataforseo_labs_google_available_history`, `post_dataforseo_backlinks_summary_live`, `similarwebWebsiteTrafficTrend`, `similarwebMarketingChannelSourcesLegacy`, `similarwebTrafficEngagement`, `similarwebPopularPages`, `similarwebKeywords`, `similarwebWebsiteTopGeographies`, `post_tavily_map`.
- Fallback candidate: `post_firecrawl_scrape` with `proxy: "basic"` and Markdown output.

All candidates above are search intents/tool candidates, not permission to invent a runtime identity. Until an exact identity and schema is returned, use:

```text
AISA_SEARCH_TOOL → AISA_BATCH_GET_SCHEMA (when needed) → AISA_BATCH_QUOTE → AISA_BATCH_USE
```

If the host does not expose a candidate, mark that module unavailable and continue with user materials or other verified evidence.

## Candidate request shapes from the action handoff

Use only after production Search/Schema confirms the exact identity and schema. These examples are not a substitute for discovery. They document the intended minimum scope; only the parser call above is in the production-verified registry:

### Known-page extraction

```json
{
  "urls": ["https://example.com/", "https://example.com/pricing"],
  "extract_depth": "basic",
  "format": "markdown",
  "include_images": false,
  "include_usage": true
}
```

Inspect `results[]` and `failed_results[]`, `response_time`, request ID and usage credits. A failed URL is missing evidence even if another succeeds.

### DataForSEO page parsing

Use one `{ "body": [{...}] }` item per live-parser tool call. Validate top-level and per-task `status_code`/`status_message`, read only successful `tasks[i].result`, retain `tasks[i].cost`, and treat absent/empty result as `unknown`. For multiple pages, Quote separate one-item calls together and obtain authorization covering that exact set; never treat the negative aggregate test above as a reusable quote or retry a rejected item automatically.

### Domain overview and relevant pages

The proposed DataForSEO Labs calls use bare `target` domains, consistent `location_code`/`language_code`, and a bounded `limit` (normally 1 for domain overview and a small limit for relevant pages). Confirm the complete schema before quoting. Estimated traffic value and ranking buckets are not measured visits or conversions.

## Conditional and fallback response rules

- Lighthouse is only for explicit performance questions; narrow to 1–3 pages and requested categories/audits. A successful response proves only those pages/fields.
- Historical rank requires available-history discovery first; report dates, location and language.
- Similarweb must preserve provider metadata/date window and report no-data as unknown. Never automatically attribute an estimated channel change to a technical cause.
- Backlinks are provider estimates; count is not link quality or endorsement.
- For Firecrawl, require a successful response, HTTP 200 and usable Markdown; preserve requested and resolved URLs plus credits/latency where visible.
- For every candidate, check batch success, item-level errors, provider-native success/status, failures and empty results. HTTP 200 or Quote alone is not evidence.

## Safe degradation

If paid authorization is missing, show the exact quote and stop that module. If a tool is unavailable, schema-rejected, unauthorized, timed out, partially failed or empty, preserve available evidence and list the affected scope as `unknown`; do not retry or silently widen the sample. A useful report may be based on user-provided exports and successfully extracted pages, with explicit limitations.
