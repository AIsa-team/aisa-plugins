# Customer research MCP contracts

This registry records the production tool identities and request/response contracts relevant to customer research. OAuth and execution controls are supplied by the MCP host and the Skill workflow; use only the exact contracts recorded here.

## Core tools

### `get_reddit_search`

- Role: core online-signal discovery when the target audience is plausibly represented on Reddit and no community is known.
- Verified: 2026-09-14 production AIsa MCP; complete arguments schema.
- Request:

```json
{
  "query": "<precise product, audience and research question>",
  "sort": "relevance",
  "timeframe": "year",
  "trim": true
}
```

`query` is required. `sort` is `relevance|new|top|comment_count`; `timeframe` is `all|day|week|month|year`; `after` is an optional pagination token; `trim` is boolean. Do not automatically paginate.
- Response: the provider returns posts plus an `after` token. Post fields include `title`, `author`, `selftext`, `subreddit`, `score`, `upvote_ratio`, `num_comments`, `created_utc`/`created_at_iso`, `url`/`permalink`, and subreddit metadata. Validate the AIsa batch item (`successful`, `error`, `request_id`, optional `upstream_status`) before reading provider data. An empty post list is valid no-signal evidence, not proof that the need is absent.
- Execution: synchronous; quote the exact call before Use and treat any returned estimate as non-binding unless a maximum is explicitly provided.
- Evidence limits: Reddit is self-selected, often problem-heavy, and not a prevalence or purchase-intent sample. Engagement is not customer status or representativeness.

### `post_tavily_search`

- Role: core discovery of public web discussions, reviews, forums and community pages when Reddit is not sufficient or the channel is specified.
- Verified: 2026-09-14 production AIsa MCP; complete arguments schema.
- Request: `query` is required. Relevant fields are `search_depth` (`advanced|basic|fast|ultra-fast`), `topic` (`general|news|finance`), `max_results` (0–20), `include_raw_content` (boolean or `markdown|text`), `include_answer` (false by default), optional `include_domains`, date filters and `country`.
- Response: `results[]` contains `url`, `title`, `content`, `score`, and optional `raw_content`; top-level fields may include `query`, `response_time`, `request_id`, `answer`, and `usage.credits`. Validate the AIsa item and any provider error. `answer` is synthesis, not a source; cite result URLs. Empty `results[]` is unknown/no-signal, never a conclusion.
- Execution: synchronous; quote the exact call before Use.
- Evidence limits: ranked web results and extracted text can support page-level claims, not representative customer prevalence. Search snippets/content may be stale or promotional.

### `post_tavily_extract`

- Role: core extraction of known public HTTPS discussion/review pages or user-provided public research URLs.
- Verified: 2026-09-13 production AIsa MCP registry; rediscover if the host does not expose this identity.
- Request:

```json
{
  "urls": ["https://example.com/public-discussion"],
  "extract_depth": "basic",
  "format": "markdown",
  "include_images": false,
  "include_usage": true
}
```

`urls` accepts a string or array. Optional `extract_depth` is `basic|advanced`, `format` is `markdown|text`, `chunks_per_source` is 1–5, `timeout` is 1–60 seconds, and image/favicon/usage flags are booleans.
- Response: inspect `results[]` (`url`, `title`, `raw_content`) and `failed_results[]`, plus `response_time`, `request_id` and `usage.credits` when present. Any URL in `failed_results` is missing evidence even if another URL succeeds. Validate batch success and provider status.
- Execution: synchronous; quote the exact call before Use.
- Evidence limits: extraction preserves page evidence but does not validate authorship, customer status, freshness or representativeness.

## Conditional tools and discovery rule

`get_reddit_subreddit_search` is conditional when the user names a relevant subreddit. A discovery result on 2026-09-14 returned it with `has_full_schema=false`; a later focused discovery did not return it, so re-search and then call `AISA_BATCH_GET_SCHEMA` before Quote/Use if it is exposed. It searches within one subreddit and returns posts with a cursor; it does not return comments. `get_reddit_post_comments` is conditional for expanding only a few selected post URLs. Focused Search returned it with `has_full_schema=true`; its exact arguments are `url` (required), optional `cursor`, and optional `trim`; rely on that current Search result and re-discover on drift. Do not infer response fields from the description.

Other social/comment channels are not assumed available. Discover the capability by business need, fetch Schema when incomplete, and reject tools that are asynchronous, unavailable, or do not provide usable evidence. Do not use `post_dataforseo_content_summary_live` or its sentiment blocks as row-level customer-review sentiment: it aggregates pages citing a keyword and cannot establish individual customer opinions. DataForSEO content search/trends, if separately discovered and authorized, are page-index signals only.
