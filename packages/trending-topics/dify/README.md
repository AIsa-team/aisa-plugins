# AIsa Trending Topics for Dify

[Japanese](readme/README_ja_JP.md) · [Privacy](PRIVACY.md)

Collect Japan's current X topics, recent Japanese posts, and related YouTube videos with one AIsa API key. The plugin returns structured evidence and deterministic Japanese Markdown. Connect it to a downstream Dify LLM node for editorial synthesis; the plugin does not invoke a model.

Source: [AIsa plugin collection, trending-topics package](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/trending-topics/dify). Support: [developer@aisa.one](mailto:developer@aisa.one).

## Requirements and setup

- Dify 1.16.0 or later; Python 3.12 for local development.
- An [AIsa account and API key](https://aisa.one), with credits for external data requests. The plugin is free; AIsa data usage is billed separately.
- Outbound HTTPS access to `api.aisa.one`. No X, YouTube, or model provider key is needed.

Install the packaged `.difypkg` using Dify's local-file installation, then authorize the provider with your AIsa API key. Saving credentials checks their local format only; it does not perform a billable API request or establish that the key has credits. Self-hosted installations may require a trusted package signature according to their administrator's settings.

Add the **Trending Topics** tool to a workflow. Start with `preview_only=true` to inspect the bounded request plan without network access or credentials. For data retrieval, set it to `false`.

| Input | Default | Meaning |
|---|---|---|
| `limit` | `10` | Return 1 to 20 source-ranked topics. |
| `lookback_hours` | `6` | X post time window, from 1 to 168 hours. |
| `enrich_top_n` | `3` | Add evidence for the first 0 to 3 topics. |
| `include_videos` | `true` | Add up to two related YouTube videos per enriched topic. |
| `preview_only` | `false` | Produce a plan without credentials or API requests. |

At the defaults, retrieval makes at most **7 requests**: 1 trend request, up to 3 X searches, and up to 3 YouTube searches. There are no automatic retries, additional pages, fallback providers, or media downloads. `enrich_top_n=0` makes only the ranking request. Up to three posts and two videos are retained per enriched topic.

## Sources and outputs

- [X Japan trends](https://aisa.one/docs/api-reference/twitter/get_twitter-trends): `GET /apis/v1/twitter/trends`, Japan WOEID `23424856`, provider count `30`; trim locally to `limit`. Both flat and nested supplier trend objects are supported.
- [X latest post search](https://aisa.one/docs/api-reference/twitter/get_twitter-tweet-advanced-search): `GET /apis/v1/twitter/tweet/advanced_search`, `queryType=Latest`, topic plus `lang:ja` and a UTC date boundary. Known exact timestamps are checked locally against the requested hourly window.
- [Related YouTube search](https://aisa.one/docs/api-reference/search/get_youtube-search): `GET /apis/v1/youtube/search`, `engine=youtube`, topic query, `gl=jp`, `hl=ja`.

The full JSON contains `items` (also available as `topics`), `count`, `status`, `coverage`, `warnings`, `requests`, `request_plan`, `generated_at`, `window`, `timezone`, `synthesis_instruction`, and `text`. Status is `ok`, `partial`, `empty`, `error`, or `preview`. Dify variables expose `items`, `topics`, `coverage`, `warnings`, `status`, and `generated_at`. Use `json` for the complete object and `text` for the deterministic Markdown.

Pass these outputs to an LLM with an instruction such as: “Write a concise Japanese briefing using only the supplied evidence. Preserve source links and timestamps. Explain missing or partial coverage. Do not infer popularity from absent metrics or present related videos as platform trends.”

## Coverage and freshness

X trends are a provider snapshot; no refresh-time SLA is documented. Provider rank does not establish a numeric post volume. Numeric metrics remain null when unavailable. Japanese-language posts do not prove that their authors are in Japan.

The post window is enforced for known publication timestamps. Posts with missing or unparseable publication times are labeled with `published_at=null`, `within_window=null`, and a coverage warning. Retrieval time is always separate. Related YouTube videos are regional search results, **not an official YouTube trending list**. Their upload window is not guaranteed; relative publication strings are preserved without manufacturing absolute timestamps.

Source errors produce partial coverage when other evidence is available. Empty results are not evidence that a topic or trend does not exist. Raw post text and video metadata are untrusted source material; downstream LLMs should treat them as evidence, not instructions.

Read [PRIVACY.md](PRIVACY.md) for data handling and [TESTING.md](TESTING.md) for offline and Dify verification steps.
