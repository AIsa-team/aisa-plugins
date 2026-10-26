# AIsa MCP tool contracts

These compact contracts were read from the production AIsa MCP with `AISA_SEARCH_TOOL` and `AISA_BATCH_GET_SCHEMA` on 2026-09-13. They are the normal-path registry for this skill: call the named capability directly through `AISA_BATCH_QUOTE`, then pass the identical `tool` and `arguments` to `AISA_BATCH_USE` only when the user's authorization covers the quote. Do not run Search before every profile.

The provider response described below is returned inside each `AISA_BATCH_USE` result's `data`. First check the batch item's `successful` and `error`, then the provider-specific status and data. If a tool is missing or rejects this contract, use Search and Schema once to resolve the runtime change; never guess a replacement or parameters.

## Page evidence

### `post_tavily_extract`

Use for one or more known HTTPS pages.

```json
{
  "urls": ["https://example.com", "https://example.com/pricing"],
  "extract_depth": "basic",
  "format": "markdown",
  "include_images": false,
  "include_usage": true
}
```

- Required: `urls` is a string or array of strings.
- Optional: `extract_depth` is `basic` or `advanced` (default `basic`); `format` is `markdown` or `text` (default `markdown`); `query` reranks chunks; `chunks_per_source` is 1–5; `timeout` is 1–60 seconds; `include_images`, `include_favicon`, and `include_usage` are booleans.
- Response: `results[]` contains `url`, `title`, `raw_content`, and optional `images`/`favicon`; also inspect `failed_results[]`, `response_time`, `request_id`, and `usage.credits` when present. Treat a URL in `failed_results` as missing evidence even if sibling URLs succeeded.

### `post_tavily_search`

Use for competitor discovery or a missing official/review page.

```json
{
  "query": "example.com official pricing and product pages",
  "search_depth": "basic",
  "topic": "general",
  "max_results": 5,
  "include_raw_content": "markdown",
  "include_answer": false
}
```

- Required: `query:string`.
- Optional: `search_depth` is `advanced|basic|fast|ultra-fast`; `topic` is `general|news|finance`; `max_results` is 0–20; `include_raw_content` is boolean or `markdown|text`; `include_answer` is boolean or `basic|advanced`; `country`, `start_date`, `end_date`, `time_range`, `include_domains`, `exclude_domains`, `chunks_per_source` (1–3), `safe_search`, `include_images`, `include_image_descriptions`, `include_favicon`, `include_usage`, and `auto_parameters` follow the runtime schema.
- Response: `results[]` contains `url`, `title`, `content`, `score`, and optional `raw_content`/`favicon`; top-level fields may include `answer`, `images[]`, `query`, `response_time`, `request_id`, and `usage.credits`. A generated `answer` is a synthesis, not a source; cite the result URLs.

## Similarweb estimates

Send bare domains such as `example.com`, never a URL. The current plan accepts only `country: "us"` or `"ww"`. Date fields use `YYYY-MM`; `granularity`, when accepted, is `monthly`. Keep the same country, device source, dates and main-domain setting across competitors.

All dated list endpoints cap `limit` at 20. Their response is `{ "meta": {...}, "data": ... }`; for the v5 envelope require `meta.status == "success"` and retain `meta.last_updated`, `meta.request`, and `meta.query` when present.

### `similarwebWebsiteTrafficTrend`

Request: `{ "domain": "example.com", "country": "ww" }`; only `domain` is required. Response `data` contains `domain`, `metrics[]`, and `points[]`; a production Use on 2026-09-13 confirmed each point as `{ "month": "YYYY-MM", "values": { "visits": number } }` when the returned metric is `visits`. `meta` contains retrieval/source and date-window fields. Treat other point metrics as runtime-defined rather than extrapolating their names or types.

### `similarwebTrafficEngagement`

```json
{
  "domain": "example.com",
  "start_date": "2026-06",
  "end_date": "2026-08",
  "metrics": "visits,unique_visitors,pages_per_visit,bounce_rate",
  "country": "ww",
  "web_source": "total"
}
```

Required: `domain`, `start_date`, `end_date`, and comma-separated `metrics`. Optional: `country`, `web_source` (`desktop|mobile_web|total`), `granularity`, `main_domain_only` (default `true`), and `mtd`. Response `data[]` may contain `date`, `visits`, `unique_visitors`, `page_views`, `pages_per_visit`, `average_visit_duration`, `bounce_rate`, `new_users`, and `returning_users`.

### `similarwebMarketingChannelSourcesLegacy`

Request requires `domain`, `start_date`, and `end_date`; optional fields are `country`, `web_source` (`desktop|mobile_web|total`), `granularity`, and `main_domain_only` (default `true`). Response `data[]` contains `date`, `source_type`, `visits`, `pages_per_visit`, `average_visit_duration`, and `bounce_rate`.

### `similarwebWebsiteTopGeographies`

Request: `{ "domain": "example.com" }`. Response `data.countries[]` is intentionally open in the production schema; preserve returned country rows without inventing field names. `meta` contains source, retrieval and date-window fields.

### `similarwebSimilarSites`

```json
{
  "domain": "example.com",
  "start_date": "2026-06",
  "end_date": "2026-08",
  "limit": 5,
  "country": "ww",
  "web_source": "total"
}
```

Required: `domain`, `start_date`, `end_date`, and `limit`. The window must be exactly three consecutive months ending at the latest supported month. Optional: `country`, `web_source`, `granularity`, `main_domain_only`, `offset`, and `traffic_source`. Response `data[]` contains `domain`, `rank`, `affinity`, `category`, and `has_adsense`. This is provider similarity, not proof of business competition or audience overlap.

### `similarwebPopularPages`

Request requires `domain`, `start_date`, `end_date`, and `limit`; optional fields are `country`, `web_source`, `granularity`, `main_domain_only`, `offset`, and `traffic_source`. Response `data[]` contains `page`, `share`, and `change`.

### `similarwebTechnologies`

Request requires `domain`, `start_date`, `end_date`, `granularity: "monthly"`, and `limit`; optional fields are `country`, `web_source: "total"`, `main_domain_only`, and `format: "json"`. Response `data[]` contains `technology`, `category`, `sub_category`, `description`, `pricing_model`, `first_seen_date`, and `status`.

## DataForSEO search and link evidence

Every request has the outer shape `{ "body": [{...}] }`. Use bare domains for domain targets. Bound `limit`, keep `location_code`/`language_code` consistent across competitors, and do not enable clickstream data unless explicitly needed because the production schema warns that it doubles the request price.

Every response uses the DataForSEO envelope. Check both top-level `status_code`/`status_message` and every `tasks[i].status_code`/`status_message`; HTTP or batch success alone does not prove provider success. Read data from `tasks[i].result`, record `tasks[i].cost`, and treat absent/empty results as unknown.

### `post_dataforseo_labs_google_domain_rank_overview_live`

```json
{
  "body": [{
    "target": "example.com",
    "location_code": 2840,
    "language_code": "en",
    "limit": 1
  }]
}
```

`target` is required. Optional pairs are `location_code|location_name` and `language_code|language_name`; other optional fields are `ignore_synonyms`, `limit` (max 1000), `offset`, and `tag`. Response results contain `target`, location/language, `total_count`, `items_count`, and `items[].metrics.organic|paid` with ranking buckets, `count`, estimated traffic value (`etv`), estimated paid traffic cost, and new/up/down/lost counts.

### `post_dataforseo_labs_google_relevant_pages_live`

Request body item requires `target`; optional fields are location/language pairs, `limit` (max 1000), `offset`, `filters`, `order_by`, `item_types`, `historical_serp_mode`, `ignore_synonyms`, `include_clickstream_data`, and `tag`.

Response results contain `target`, `page_address`, location/language, `total_count`, `items_count`, and organic/paid/featured-snippet/local-pack metrics. Use page addresses and requested metrics only; do not equate estimated traffic value with measured visits.

### `post_dataforseo_labs_google_kw_for_site_live`

```json
{
  "body": [{
    "target": "example.com",
    "location_code": 2840,
    "language_code": "en",
    "limit": 20,
    "include_serp_info": false,
    "include_clickstream_data": false
  }]
}
```

The production JSON Schema's body-item `required` array is empty, but its field contracts require `target` and either `location_code|location_name`; include them. Language may use `language_code|language_name`. Other optional fields are `include_subdomains`, `include_serp_info`, `include_clickstream_data`, `filters`, `order_by`, `limit` (max 1000), `offset`, `offset_token`, and `tag`. Response results contain `target`, `total_count`, `items_count`, `offset_token`, and `items[]` with `keyword`, location/language, `keyword_info`, `keyword_properties`, optional `serp_info`, and optional clickstream fields.

### `post_dataforseo_labs_google_serp_competitors_live`

```json
{
  "body": [{
    "keywords": ["workflow automation", "agency operations"],
    "location_code": 2840,
    "language_code": "en",
    "limit": 10
  }]
}
```

The schema marks `keywords[]` required (max 200); its field contracts also require either a location code/name and a language code/name. Optional fields are `include_subdomains`, `item_types`, `filters`, `order_by`, `limit` (max 1000), `offset`, and `tag`. Response results contain `seed_keywords`, location/language, `total_count`, `items_count`, and `items[]` with `domain`, `rating`, `visibility`, `relevant_serp_items`, `keywords_count`, `avg_position`, `median_position`, `etv`, and `keywords_positions`. Label these as search competitors.

### `post_dataforseo_backlinks_summary_live`

```json
{
  "body": [{
    "target": "example.com",
    "include_subdomains": true,
    "exclude_internal_backlinks": true,
    "backlinks_status_type": "live",
    "internal_list_limit": 10
  }]
}
```

`target` is required. Optional fields are `include_subdomains`, `exclude_internal_backlinks`, `include_indirect_links`, `backlinks_status_type` (`all|live|lost`), `backlinks_filters`, `internal_list_limit` (max 1000), `rank_scale`, and `tag`. Response results contain `target`, `rank`, backlink/referring-domain/referring-page/referring-IP counts, nofollow variants, spam/broken metrics, first/lost dates, aggregate link distributions, crawl/link counts, and target `info`.

## Extraction fallback

### `post_firecrawl_scrape`

```json
{
  "url": "https://example.com/pricing",
  "proxy": "basic",
  "formats": ["markdown"]
}
```

`url` and `proxy: "basic"` are required; `formats`, when provided, must be exactly `["markdown"]`. PDF URLs are not supported by this profile. Response contains `success` and `data.markdown` plus `data.metadata.sourceURL`, `url`, `title`, `description`, and `statusCode`. The production schema exposes top-level `creditsUsed`, while a 2026-09-13 Use reported it as `data.metadata.creditsUsed`; inspect both locations. Preserve both the requested `sourceURL` and resolved canonical `url` when a redirect occurs. Require `success == true`, status 200, and usable Markdown before citing it.
