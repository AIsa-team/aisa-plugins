# Economy Digest

Source: [Dify plugin source](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/economy-digest/dify).
Support: [developer@aisa.one](mailto:developer@aisa.one).

Retrieve source-backed evidence for Japanese economic news through AIsa, then use a Dify
LLM or Agent to write a Japanese digest with citations. This independently
installable plugin contains one provider and one tool, both named `economy-digest`.

[Japanese](readme/README_ja_JP.md) · [Privacy](PRIVACY.md)

## Requirements and setup

- Dify **1.16.0 or later** with tool plugin support.
- Python **3.12**, with the tested SDK dependency `dify-plugin==0.10.2`.
- An AIsa API key from [AIsa Console](https://console.aisa.one).

Install the packaged `.difypkg` in Dify Integrations, authorize the provider with
your AIsa API key, and add the `economy-digest` tool to a workflow or Agent. Credential
validation is local: it checks the key format without an API request and does not
verify account balance or remote authorization. Requests use the fixed AIsa API
endpoint `https://api.aisa.one`; publisher credentials and subscription cookies are
not accepted.

The tool searches **Nikkei only, across economic policy/indicators, markets, companies, and the global economy**. The default searches four complementary topic lanes so stock-market stories do not crowd out policy, companies, and world trade. Every lane restricts article URLs to Nikkei; unavailable Nikkei coverage is not silently replaced by another outlet.

## Inputs

| Parameter | Default | Behavior |
| --- | --- | --- |
| `section` | `all` | `all` (default), `macro`, `markets`, `companies`, `global`. |
| `keywords` | empty | Optional focus, at most 200 characters, appended to each Japanese query. |
| `lookback_hours` | `24` | Integer from 1 to 168; JSON timestamps are UTC ISO 8601; the report header displays JST (`Asia/Tokyo`). |
| `max_items` | `10` | Integer from 1 to 20; upper bound on returned deduplicated articles. |
| `extract_content` | `false` | Additional extraction for up to three selected public article URLs. |
| `fallback_provider` | `none` | `brave` optionally searches deficient lanes; `none` keeps fallback disabled. |
| `preview_only` | `false` | Return the request plan without network calls or API usage. |

Tavily news search is the primary retrieval route through AIsa. Enabling Brave
fallback or extraction can add billable API requests. Use `preview_only=true` to
inspect the plan first. The tool has bounded retrieval; it cannot guarantee every
article from a newspaper or immediate indexing of breaking news.

## Outputs and digest workflow

The tool returns JSON evidence plus a readable Japanese source overview, not a
model-generated narrative. Connect the following named outputs to downstream
nodes: `items`, `coverage`, `warnings`, `status`, and `generated_at`. The full JSON
also records the time window, request activity, and request plan.

`coverage` reports each selected lane with `matched`, `returned`, `undated`, and
error information. The overall status is `ok`, `partial`, `empty`, `error`, or
`preview`. An empty or inaccessible source is reported explicitly. A request
failure must not be described as an absence of news.

Suggested workflow: **tool → LLM → answer/output**. Pass `items`, `coverage`, and
`warnings` into the model prompt, together with this instruction:

> Write a concise Japanese news digest using only the supplied evidence. Cite the
> source URL for every item. Distinguish facts from opinion. Do not infer missing
> details from a headline or excerpt. State missing source coverage and unknown
> publication dates. Do not claim a paywalled article's full text was read.

The plugin does not invoke a model or request Dify model, app, endpoint, or storage
permissions. Model choice and any model charges belong to the downstream workflow.

## Source availability

Search snippets, public excerpts, and extracted content have different evidential
limits. Subscriber-only content, robots restrictions, timeouts, missing timestamps,
and indexing delays can produce partial results. Article URLs remain linked to
the publisher; extraction does not bypass a subscription or retrieve content with
publisher login credentials. Unknown publication dates are disclosed rather than
presented as verified fresh stories. Duplicate URLs are removed before output.

## Develop and check offline

From this `dify/` directory, create a package-local Python 3.12 environment and
install dependencies:

```bash
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

From the repository root, run the package's mocked tests and collection check:

```bash
python3 -m unittest discover -s packages/economy-digest/dify/tests -v
python3 scripts/check_registry.py
```

The tests use fixed clocks and fake clients. They do not need a real key or send
paid API requests. Keep `.env`, virtual environments, caches, and built archives
out of Git.

For remote Dify debugging, copy `.env.example` to `.env`, replace its placeholders
with the debug host and key from your workspace, and run `.venv/bin/python -m main` inside
this directory. A connected debug plugin can be invoked by other workspace users;
news retrieval then uses your configured AIsa credentials. Do not share the debug
key. End-to-end validation requires an authorized workspace and live API usage.

## Package

From the repository root:

```bash
dify plugin package ./packages/economy-digest/dify -o /tmp/economy-digest-0.1.0.difypkg
```

The native identity is `aisa-team/economy-digest` and the plugin version is `0.1.0`.
Packaging creates an installable archive; publishing, repository pushes, and
Marketplace submission are separate actions.
