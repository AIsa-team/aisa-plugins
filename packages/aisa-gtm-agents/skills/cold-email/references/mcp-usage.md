# Cold-email AIsa MCP contracts

Read this reference only when a missing recipient or company fact would materially change a draft. Supplied and previously authorized evidence comes first; the normal drafting path makes no tool call.

Use only the configured AIsa MCP. OAuth belongs to the host; never call Router or a provider HTTP endpoint directly. For a new or changed capability, use `AISA_SEARCH_TOOL`, then `AISA_BATCH_GET_SCHEMA` when Search does not return the full contract. For the dated registry below, a routine call may start at `AISA_BATCH_QUOTE`; return to Search/Schema if the identity is unavailable, validation rejects the arguments or the requested capability is outside the registry.

Quote the exact tool and arguments. State provider, evidence question, company/person, date window, item count, estimated charge, estimate kind and whether a maximum exists. `AISA_BATCH_USE` is allowed only when the user's explicit authorization covers that identical scope, price uncertainty and provider. Creating the task, asking for research or supplying a general budget is not authorization for the quoted call. Re-quote changed arguments. Never retry a paid call, broaden it, switch providers or add a second page automatically.

## Conditional registry

All contracts below were discovered from the production AIsa MCP on 2026-09-14. They are conditional evidence tools, not a default research bundle.

### `post_tavily_extract`

- Use for one to three known public HTTPS pages such as an official announcement or case study.
- Request: `urls` is required as a string or array. Relevant options are `extract_depth` (`basic|advanced`), `format` (`markdown|text`), `include_usage`, `query`, `chunks_per_source` (1–5) and `timeout` (1–60 seconds).
- Response: inspect `results[]` (`url`, `title`, `raw_content`, optional images/favicon), `failed_results[]`, `response_time`, `request_id` and optional `usage.credits`. A successful item with a failed URL is partial evidence.

### `post_tavily_search`

- Use for a recent public business signal only when no known page can answer the question. Include entity, domain, geography and date window where known; keep `max_results` small.
- Request: `query` is required. Relevant options include `search_depth`, `topic`, `max_results` (0–20), `include_raw_content`, `include_answer`, domain filters, country and date filters.
- Response: `results[]` carries `url`, `title`, `content`, `score` and optional `raw_content`; optional top-level fields include `answer`, `response_time`, `request_id` and usage. The generated `answer` is not a source. Empty results are unknown.

### `get_apollo_organizations_enrich`

- Use when a known bare domain needs basic organization identity or an Apollo organization ID. Do not use it to discover a prospect list.
- Request: required `domain` without scheme, `www.` or path.
- Response: nullable `organization` object. Relevant observed fields include `id`, `name`, `website_url`, public social URLs, `founded_year`, exchange/ticker fields and languages. Missing fields are unknown.

### `get_apollo_organizations_id`

- Use only after an authorized organization lookup returned an Apollo `id`, and only when deeper funding, technology or department context changes the draft.
- Request: required Apollo organization `id`; never substitute a domain.
- Response: nullable `organization` with the enrichment fields plus funding, technology, department-headcount and related-organization data. Provider presence does not prove a fact is current; keep its retrieval date.

### `post_apollo_people_match`

- Use for one already identified business person when current title/employment context is essential. It is enrichment, not people discovery.
- Request: require a non-contact person-level identifier: an Apollo person `id`, the person's `linkedin_url`, or `name` / `first_name` + `last_name` together with `domain` or `organization_name`. A domain or organization alone identifies only a company and is insufficient. Never provide `email` or `hashed_email`, even when the user supplied one; ask for a non-contact identifier or leave identity facts unknown. Omit private-email, phone and waterfall arguments and never set them true in this Skill.
- Identity check: accept a returned person only when the strongest supplied identifier agrees—exact Apollo person ID, canonical LinkedIn URL, or normalized name **and** organization/domain. Reject the match if any supplied person or organization identifier conflicts. If the response omits enough identity fields to verify the same person, treat title/employment as unknown rather than using a possible employee match.
- Response filtering: discard `waterfall` completely. Before evidence synthesis, create a field-level allowlist containing only verified business identity and employment context: name, title, headline, LinkedIn URL, organization name/domain and employment employer/title/date fields. Drop all email, phone, personal-address, unrelated-profile and other contact fields; never expose or cite the raw provider payload. The production contract marks this POST non-idempotent with possible side effects, so it is never retried automatically.

### `post_apollo_news_articles_search`

- Use for a directly relevant funding, hire or launch trigger after an authorized lookup returned organization IDs.
- Request: required `organization_ids[]`; bound with `categories[]`, `published_at[min]`, `published_at[max]`, `page` and `per_page`. Do not paginate automatically.
- Response: inspect `news_articles[]` and `pagination`. The production contract marks the POST non-idempotent with possible side effects; never retry it automatically. A result still needs source/date verification.

### `get_apollo_organizations_organization_id_job_postings`

- Use when a specific hiring signal connects directly to the offered value and an Apollo organization ID is already available.
- Request: required `organization_id`, optional bounded `page` and `per_page`; no automatic next page.
- Response: `organization_job_postings[]`. Inspect actual row fields and source URLs at execution time because the published response schema does not fully type each row. No returned postings means Apollo has no rows for the request, not that the company is not hiring.

### `similarwebTechnologies`

- Fallback only when a specific technology is material to the value proposition and Apollo/official evidence is insufficient. The higher quoted cost makes decorative use unacceptable.
- Request: required bare `domain`, same-month `start_date` and `end_date` (`YYYY-MM`), `granularity: "monthly"`, and bounded `limit`; relevant options are `country` (`us|ww`), `main_domain_only`, `web_source: "total"` and `format: "json"`.
- Response: validate `meta.status`, then inspect `data[]` fields such as `technology`, `category`, `sub_category`, `description`, `first_seen_date`, `status` and `pricing_model`. Provider detection is evidence of a reported technology, not proof of current implementation details or purchase intent.

## Result checks and safe degradation

Check every available layer: MCP transport/session state, AIsa batch counts, each item's `successful`, `error`, `request_id` and `upstream_status`, provider status/error, expected result object/array, item-level failures, empty data, usage, actual charge and observed latency. Record retrieval date, relevant market/language and sample scope. HTTP success alone is not business success. Preserve usable partial evidence, name the failed scope and treat missing information as unknown.

On no data, partial failure, schema drift, transport failure or missing authorization, do not substitute another provider or buy a retry. Draft from supported material, mark the affected phrase unresolved or replace it with a non-personalized value statement.

Email delivery, mailbox state, contact/sequence creation, sequence enrollment, CRM mutation and private-contact reveal capabilities are forbidden here. Research approval never authorizes any of those actions.
