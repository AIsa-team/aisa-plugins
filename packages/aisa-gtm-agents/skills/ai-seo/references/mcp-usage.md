# AI SEO production MCP contracts

This registry records only capabilities that change AI SEO measurement decisions. Existing contracts were checked on 2026-09-14; ChatGPT/Gemini scraper request and response schemas were verified against production AIsa MCP on 2026-09-16. Execution status is per entry: Search/Schema and Quote do not prove Use success. Eligible recorded paths may start at Quote. Search and Schema again when an identity is absent, arguments are rejected, the response drifts, or scope is outside this registry. A blocked entry is not made executable by registry reuse.

Quote the exact tool and arguments for every intended call. Execute only when existing approval covers the identical source, prompts/queries, country/language scope, call count, price, and any missing guaranteed maximum. Do not automatically retry a paid Use. Validate AIsa `successful`, `error`, `request_id`, `upstream_status`, actual charge, and provider data before accepting a result.

## Rejected LLM Realtime candidate

### `post_oxylabs_ai_search`

- Role: unavailable for ChatGPT/Gemini/Perplexity in the current synchronous workflow; retain this record to prevent a repeated paid failure.
- Observed: on 2026-09-14, an authorized ChatGPT Realtime Use with `search: true`, `geo_location: "United States"`, and `parse: true` passed AIsa validation but returned upstream HTTP 422, `retryable: false`: Realtime integration was not supported for LLM sources and the provider required Push-Pull. The call returned no business result and charged $0.
- Stopping rule: do not retry this LLM-source call, change its arguments, or adopt Push-Pull in the current conversation workflow. Re-run production Search/Schema only when a synchronous ChatGPT/Gemini/Perplexity capability is needed. The Search/Schema contract below documents the observed drift; it is not a usable normal path for those sources.
- Request: `source` is required and is one of `chatgpt|gemini|perplexity|google_search|google_ai_mode`. Use `prompt` for ChatGPT, Gemini, and Perplexity; use `query` for Google sources. Set `parse: true`. `search: true` is a ChatGPT-only browse control. `render: "html"` is Google-only and should not be used by default. `geo_location` is a country name, not city-level targeting. The schema has no independent answer-language field, so express the intended language in the prompt/query and report that limitation.
- Response: `results[]` is one result per query. Source-specific parsed paths differ: Google Search uses `content.results.ai_overviews[]` with `answer_text` and `references[]{source,url}`; ChatGPT and Gemini expose `response_text` and `citations[]`; Perplexity exposes `top_sources[]`/`sources_results[]`; Google AI Mode uses `content.citations[]{text,urls[]}`. Treat an absent expected path, empty answer, or empty citations as unknown for that cell rather than success or zero visibility.
- Execution: Search/Schema described the endpoint as synchronous, but the LLM-source production Use contradicted that description. Do not extrapolate whether the Google source variants work; use the production-verified DataForSEO Google AI Mode core below instead.
- Evidence limits: the provider-observed source is not proof of a user's exact UI, account, model, personalization, city, or stable future output. One response supports only its recorded cell.

## Core ChatGPT observation

### `post_dataforseo_ai_chat_gpt_llm_scraper_live`

- Role: core synchronous ChatGPT consumer-answer sampling. Search, full request/response Schema and Quote verified on 2026-09-16; no production Use result, actual charge or latency recorded yet.
- Request: `{ "body": [{ "keyword": "What is AIsa.one?", "location_code": 2840, "language_code": "en", "force_web_search": true }] }`. Replace the example entity, market and question with user inputs. `keyword` is required (up to 2000 characters); provide location code/name and language code/name. `force_web_search` defaults to false; use true for a requested web-grounded sample and record that setting. It does not guarantee citations. Optional `tag` is a caller label.
- Response: inspect top-level status and `tasks_error`, then validate each task separately: a usable cell needs task `status_code == 20000` and a usable `result[]`. Nonzero `tasks_error` marks the batch partial, not every sibling failed. Preserve successful task results and each failed task's status/cost. Read `keyword`, `model`, locale, `datetime`, `markdown`, `sources[]`, `search_results[]`, `brand_entities[]`, `fan_out_queries[]`, and `items[]` when present. Sources are provider-reported cited/relied-on pages; search results may include unused pages. Do not count every search result or brand entity as a citation. Preserve actual inline citation evidence when available.
- Contract caveat: the exported response schema uses dotted descriptive keys and loose array item types. They describe nested runtime paths, not literal dotted response keys; inspect the actual envelope on first Use. Missing sources or brand entities do not invalidate an otherwise usable answer; report those fields as unavailable.
- Quote evidence: the example above plus `tag: "ai-seo-candidate-quote-2026-09-16"` was estimated at `$0.00696`, without a guaranteed maximum. This is dated quote evidence, not a price promise or a completed observation. Use requires a matching fresh quote and covering authorization.
- Limits: one provider-observed answer, not proof of a particular logged-in user's UI, personalization, stable ranking, or total platform visibility.

## Gemini observation — execution blocked

### `post_dataforseo_ai_gemini_llm_scraper_live`

- Role: intended core synchronous Gemini consumer-answer sampling; production Search and full request/response Schema verified on 2026-09-16. No Use performed. The documentation route ends in `live-advanced`, but the public tool name has no `advanced` suffix.
- Request: `{ "body": [{ "keyword": "What is AIsa.one?", "location_code": 2840, "language_code": "en" }] }`. `keyword` is required (up to 2000 characters); supply location code/name/coordinate and language code/name. Optional `tag` labels the call. This contract has no `force_web_search`, `web_search` or `model_name`; do not copy them from ChatGPT or LLM Responses.
- Response: inspect the same DataForSEO envelope and nested `tasks[].result[]`; declared fields include `keyword`, `model`, locale, `datetime`, `markdown`, `sources[]`, `item_types`, `items_count`, and `items[]` with `gemini_text`/`gemini_table`/`gemini_images`. Apply the dotted-schema caveat above. Do not assume ChatGPT-only `brand_entities`, `fan_out_queries` or `search_results` exist.
- Blocker: on 2026-09-16 the example plus `tag: "ai-seo-candidate-quote-2026-09-16"` returned `$1.21974` estimate, no guaranteed maximum, endpoint 1908, profile `dataforseo.response-usd.v1.endpoint-1908`, revision 4. This conflicts with much lower historical documentation figures; the cause is unconfirmed. Do not state that the price is a proven billing bug or the settled cost.
- Reopening condition: keep Use disabled until authoritative pricing evidence explains or resolves the discrepancy and a fresh exact-call Quote is consistent with that evidence. Then apply the user's covering authorization and validate the first result. A repeated Schema success, an old documented cost or a guessed cheaper payload does not clear the blocker. While blocked, analyze supplied Gemini exports and label live cells untested; do not substitute another engine silently.

## Page and citation evidence

### `post_tavily_extract`

- Role: core page extraction after URLs are known.
- Use when: inspecting a small set of brand or cited HTTPS pages; do not search for URLs already known.
- Request: `urls` is a string or array. Relevant options are `extract_depth: "basic"|"advanced"`, `format: "markdown"|"text"`, `query`, `chunks_per_source` 1–5, `timeout` 1–60, and boolean usage/image/favicon flags. Prefer basic Markdown and `include_usage: true` unless the decision needs deeper extraction.
- Response: `results[]` contains `url`, `title`, and `raw_content`; inspect `failed_results[]`, `response_time`, `request_id`, and `usage.credits`. A failed sibling URL remains missing evidence.
- Evidence limits: extraction shows retrievable page content; it does not prove an answer engine crawled, indexed, trusted, or will cite the page.

### `post_dataforseo_on_page_content_parsing_live`

- Role: conditional structured parsing for a single page when Tavily text cannot answer a concrete structure question.
- Request: `{ "body": [{ "url": "https://example.com/page", "markdown_view": true }] }`. `url` is required. JavaScript/browser rendering and resource-loading options can add cost; use them only for a declared rendering question and a fresh quote.
- Response: inspect top-level status and each task independently, then inspect successful tasks' `result[].items[]`, item `status_code`/`type`, `page_as_markdown`, and `page_content`. Preserve usable siblings when another task or item fails. HTTP or AIsa success alone does not prove the provider task succeeded.
- Evidence limits: parsed structure is page-level evidence, not a complete technical SEO audit or proof of AI-engine extractability.

### `post_tavily_search`

- Role: conditional discovery of a missing cited/official page or current public evidence.
- Request: `query` is required. Bound `max_results` to 1–20 and use relevant country/date/domain filters. `include_answer` is synthesis and should normally be false; request raw content only when it changes the decision.
- Response: cite `results[].url`, not a generated `answer`; inspect `results[]`, `response_time`, `request_id`, and `usage`. Empty results are unknown.

### `post_firecrawl_scrape`

- Role: fallback for one important HTTPS non-PDF page that Tavily could not extract.
- Request: `url` and `proxy: "basic"` are required; optional `formats`, when used, is exactly `["markdown"]`.
- Response: require `success == true`, usable `data.markdown`, and provider status metadata. Inspect credit usage at both the top level and provider metadata if present, and preserve requested and resolved URLs.
- Stopping condition: quote and authorize separately; never use it automatically for every failed URL.

## Core synchronous Google AI Mode observation

### `post_dataforseo_serp_google_ai_mode_live`

- Role: core synchronous live observation with explicit provider location/language fields; production Search, full Schema, Quote, and authorized Use verified on 2026-09-14.
- Request: `{ "body": [{ "keyword": "...", "location_code": 2840, "language_code": "en", "device": "desktop" }] }`. `keyword` is required; provide one of location code/name/coordinate and one of language code/name instead of relying on defaults. Verify locale codes when unknown. Use the parsed live tool; do not select its multi-megabyte HTML sibling by default.
- Response: require top-level and each task `status_code`/`status_message`; read `tasks[].result[]` fields including `keyword`, `location_code`, `language_code`, `datetime`, `check_url`, `item_types`, `items_count`, and `items`. The verified result returned `items[0].type: "ai_overview"`, aggregate `markdown`, `references[]`, and nested `items[]` whose elements carry text/Markdown and their own references. Use `item_types`, `items_count`, and actual items to detect an answer: the E2E returned `se_results_count: 0` alongside one valid AI overview, so that organic-result count is not an AI-answer absence signal. Empty/missing AI items remain an observation for that request, not proof of general absence.
- Execution evidence: one desktop/en-US query was quoted at `$0.00696` estimate without a guaranteed maximum. Authorized Use succeeded at AIsa batch and upstream HTTP 200; DataForSEO top-level and task `status_code` were `20000`, `tasks_error` was 0, and one result with one AI overview cited two unique URLs. Actual customer charge was `$0.00696`, provider cost `$0.004`, provider total time 8.9028 seconds, and observed MCP round trip 13.128 seconds. These dated values are evidence, not permanent pricing or latency constants.
- Evidence limits: this is Google AI Mode provider data, not ChatGPT/Gemini/Perplexity visibility and not traditional organic rank evidence.

## Optional aggregate dataset

The following DataForSEO LLM Mentions tools query its proprietary pre-collected response database. `live` means synchronous database retrieval, not fresh prompting of an engine. The available contracts cover `chat_gpt` (United States/English only) and `google` (Google AI Overview); they do not establish Gemini, Claude or Google AI Mode coverage. There is no verified basis to describe the database as customers' API request logs. Use `get_dataforseo_ai_llm_mentions_locales` with `{}` only when locale/platform support is unresolved, following Quote and authorization even for reference-data endpoints; do not infer zero price from a documentation label. Keep dataset metrics separate from scraper observations.

For the four single-target tools below, the outer shape is `{ "body": [{...}] }`; each item requires `target`, an array of up to 10 objects. Each target object contains either a bare `domain` (without scheme or `www`) or a `keyword`, with relevant `search_filter`, `search_scope`, `match_type`, and `include_subdomains`. Set explicit `platform`, location code/name, and language code/name. Do not use a bare target string or an array of strings.

- `post_dataforseo_ai_llm_mentions_aggregated_metrics_live`: headline totals and grouped mentions/AI-search-volume metrics for one target set. Treat null/deprecated `impressions` as unavailable. Use only when a dataset-level headline changes the decision.
- `post_dataforseo_ai_llm_mentions_search_live`: individual question/answer records with model, platform, dates, brand entities, `sources[]`, and `search_results[]`. Bound `limit`; after deep pagination use the returned `search_after_token` with otherwise identical arguments.
- `post_dataforseo_ai_llm_mentions_top_domains_live`: top cited domains for a target. Bound `internal_list_limit`; domains are opportunity evidence, not outreach permission.
- `post_dataforseo_ai_llm_mentions_top_pages_live`: top cited pages for a target. Bound `items_list_limit` and `internal_list_limit`; inspect exact returned URLs before page extraction.

`post_dataforseo_ai_llm_mentions_cross_metrics_live` compares two to ten labeled target sets within the same dataset, platform and locale. Each set requires `aggregation_key` and an inner `target` array with up to ten domain/keyword entities. For domain citations set `search_scope: ["sources"]`; for brand names in answer text use keyword entities with `search_scope: ["answer"]`. The default `any` is broader and must not be described as citation-only. `internal_list_limit` is 1–10 (default 5). Its body item requires `targets`, not the sibling endpoint's `target`:

```json
{
  "body": [{
    "targets": [
      {"aggregation_key": "brand-a", "target": [{"domain": "brand-a.example"}]},
      {"aggregation_key": "brand-b", "target": [{"domain": "brand-b.example"}]}
    ],
    "platform": "google",
    "location_code": 2840,
    "language_code": "en"
  }]
}
```

For every DataForSEO response inspect top-level status, `status_message` and `tasks_error`, then validate each task independently. Accept usable results only from tasks with `status_code == 20000`; preserve those siblings when others fail and mark the batch partial. A top-level failure without independently verifiable successful tasks supplies no usable evidence. Read `tasks[].result`, preserve each task's status and `cost`, and treat missing/empty result arrays as unknown. Keep grouping labels, target scopes, available first/last-response dates and dataset denominators. Do not sum overlapping target sets into a market-share denominator. A valid returned zero describes only the selected dataset scope. Null metrics remain unavailable.

Evidence: 2026-09-16 production Schema succeeded for aggregate and cross metrics. One aggregate request for `target: [{domain: "aisa.one", include_subdomains: true}]`, `platform: "chat_gpt"`, US/English, `internal_list_limit: 10`, and tag `ai-seo-candidate-quote-2026-09-16` quoted `$0.17574` estimate without a guaranteed maximum; it was not executed. Cross metrics has no Quote/Use result in this update. Prices must be freshly quoted, not inherited between endpoints.

Provider semantics: [LLM Mentions overview](https://docs.dataforseo.com/v3/ai_optimization/llm_mentions/overview/), [record dates and sources](https://docs.dataforseo.com/v3/ai_optimization-llm_mentions-search-live/), and [cross metrics](https://docs.dataforseo.com/v3/ai_optimization-llm_mentions-cross_aggregated_metrics-live/). These define the dataset; current AIsa production contracts determine callable names and payloads.

## Forbidden substitutions

Do not use general DataForSEO `llm_responses_live` tools as consumer AI SEO measurement. In particular, `post_dataforseo_ai_claude_llm_responses_live` is excluded: the user reported it unavailable on 2026-09-16; Schema exposure does not establish executable availability, and no independent Use failure was collected here. Do not probe Claude's model list as a workaround. Do not use raw HTML siblings by default, asynchronous submit/poll/result flows, whole-site crawl/map, repeated providers for the same cell, or direct provider/Router calls. A missing capability remains untested; never claim a platform was checked from a different engine or an adjacent metric.
