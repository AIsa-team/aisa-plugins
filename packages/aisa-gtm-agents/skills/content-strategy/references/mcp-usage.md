# Content strategy AIsa MCP contracts

These contracts were discovered with per-capability production `AISA_SEARCH_TOOL` calls and read with `AISA_BATCH_GET_SCHEMA` on 2026-09-14. They are a normal-path registry: a routine request may proceed to Quote with the exact identity and contract. Return to Search and Schema when a tool is absent, arguments are rejected, fields drift or the request is outside this registry.

For every call, quote the exact `tool` and `arguments`. Execute with `AISA_BATCH_USE` only when explicit authorization covers the same provider, scope, item count, quoted price and any risk that an estimate may be exceeded. Search, Schema, Quote, task creation and general permission to research are not paid-use authorization. Do not change arguments after Quote, automatically retry, broaden, paginate or switch providers.

After Use, require AIsa item `successful == true`, no item `error`, and a successful `upstream_status` when returned. For DataForSEO also require top-level and every `tasks[i].status_code` to indicate success, inspect `tasks_error`, read `tasks[i].result`, and record `tasks[i].cost` and `time`. HTTP 200 alone is not success. For Tavily inspect `results[]` and `failed_results[]`. Empty data is `unknown`, not zero.

## DataForSEO shared envelope

All five tools take `{ "body": [{...}] }`, are synchronous, and return DataForSEO's `status_code`, `status_message`, `tasks_error`, `cost`, `time` and `tasks[]` envelope. Keep calls bounded, use one location field and one language field, and leave `include_clickstream_data` false because it changes cost and is not required for the default strategy.

### `post_dataforseo_labs_google_keyword_ideas_live`

- Role: core semantic expansion when validated seeds need adjacent topics.
- Request item: `keywords` (max 200) and `location_code` or `location_name`; optional `language_code|language_name`, `limit` (max 1000), `closely_variants`, `ignore_synonyms`, `include_serp_info`, `include_clickstream_data`, filters/order and pagination. An `offset_token` request is an alternative contract; never paginate automatically.
- Default bounded shape: `{ "keywords": ["seed"], "location_code": 2840, "language_code": "en", "limit": 20, "include_serp_info": false, "include_clickstream_data": false }`.
- Result: `tasks[].result[]` contains `seed_keywords`, location/language, `total_count`, `items_count`, `offset_token` and `items[]`. Relevant item fields include `keyword`, `keyword_info.search_volume|monthly_searches|last_updated_time|competition|competition_level`, `keyword_properties.keyword_difficulty|detected_language|is_another_language`, and `search_intent_info.main_intent|foreign_intent`.
- Limits: volume/difficulty/intent are provider estimates/classifications; paid competition is not organic difficulty.

### `post_dataforseo_labs_google_keyword_overview_live`

- Role: core normalization for a bounded mixed shortlist whose candidates lack comparable current metrics.
- Request item requires `keywords` (max 700), location code/name and language code/name. Optional `include_serp_info`, `include_clickstream_data` and `tag`; there is no result `limit`, so bound the keyword input.
- Result: `tasks[].result[]` contains location/language and `items[]` with the same relevant keyword, metric, language-detection and intent fields listed for Keyword Ideas.
- Limits: do not duplicate metrics already returned by Keyword Ideas or confuse paid competition, modeled difficulty and business fit.

### `post_dataforseo_labs_google_kw_for_site_live`

- Role: conditional discovery from a known self or competitor domain.
- Request item: bare `target` plus location code/name; optional language, `include_subdomains`, `include_serp_info`, `include_clickstream_data`, `limit` (max 1000), filters/order and pagination.
- Result: `tasks[].result[]` contains target, location/language, counts, token and keyword items with search-volume, difficulty, detected-language and related metric fields.
- Limits: returned keywords describe provider-observed relevance/rank data, not a complete content inventory or measured site traffic.

### `post_dataforseo_labs_google_relevant_pages_live`

- Role: conditional discovery of existing pages with search visibility, to support reuse/consolidation decisions.
- Request item requires a bare `target`; optional location/language, `limit` (max 1000), `historical_serp_mode`, `item_types`, `include_clickstream_data`, filters/order and offset.
- Result: `tasks[].result[]` contains target, location/language, counts and page rows with `page_address` plus organic/paid metrics including counts and estimated traffic value.
- Limits: estimated traffic value is not analytics; this does not diagnose technical or on-page SEO.

### `post_dataforseo_labs_google_serp_competitors_live`

- Role: conditional shared-ranking domain discovery for a validated keyword set.
- Request item requires `keywords` (max 200), location code/name and language code/name; optional `limit` (max 1000), `include_subdomains`, `item_types`, filters/order and offset.
- Result: `tasks[].result[]` contains seeds, location/language, counts and `items[]` with `domain`, `rating`, `visibility`, `keywords_count`, `avg_position`, `median_position`, `etv` and keyword positions.
- Limits: these are search competitors and modeled visibility, not business competitors, market share or measured traffic.

## Tavily page evidence

### `post_tavily_extract`

- Role: conditional extraction when selected HTTPS page URLs are already known.
- Request: `urls` string or array; optional `extract_depth` (`basic|advanced`), `format` (`markdown|text`), `query`, `chunks_per_source` (1–5), `timeout` (1–60), and image/favicon/usage flags.
- Result: `results[]` with URL, title and raw content; also inspect `failed_results[]`, `response_time`, `request_id` and usage when requested.
- Limits: extraction preserves page claims; it does not establish truth, representativeness or freshness beyond the page/date evidence.

### `post_tavily_search`

- Role: conditional discovery of current public discussions or competitor content when exact URLs are unknown.
- Request requires `query`; relevant options are `search_depth`, `topic`, `max_results` (0–20), `include_raw_content`, `include_answer`, country/domain/date filters and usage flags.
- Result: `results[]` with URL, title, content, score and optional raw content; top-level fields can include query, answer, response time, request ID and usage.
- Limits: a generated answer is synthesis, not a source. Ranked results are not a representative audience sample.

## 2026-09-14 production validation

Search and complete Schema succeeded for all seven identities above.

### Keyword Ideas core E2E

- Tool and role: `post_dataforseo_labs_google_keyword_ideas_live` — core semantic expansion.
- Scope: one seed (`content strategy software`), US (`location_code: 2840`), English, `limit: 3`, with SERP/clickstream expansion disabled.
- Quote: estimated $0.22968; `estimate_kind: estimate`, `may_exceed_estimate: true`, with no guaranteed maximum.
- Authorization: the user explicitly authorized that exact scope and uncapped risk in the implementation issue after seeing the quote.
- Result: AIsa batch 1/1 and item succeeded with upstream HTTP 200. DataForSEO top-level/task status was `20000` (`Ok.`), `tasks_error` was 0, and one result contained 3 items: `digital marketing`, `marketing`, and `content marketing`. Each included US/English keyword metrics, detected language, difficulty and intent; no clickstream or SERP payload was requested.
- Actual: customer charge $0.021507; provider task cost $0.01236; provider total time 0.7182 seconds (task 0.6602 seconds).
- Assertion: the selected synchronous contract, nested response checks, item path and cost/latency reporting work in production. The broad high-volume ideas also demonstrate why audience and content-market-fit gates must precede prioritization.
- Limits: one seed, locale and core tool were executed. Empty/partial failures and conditional tools were forward-tested from their contracts but not purchased; this success is not evidence for those branches or future prices.
