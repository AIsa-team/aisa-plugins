# Testing guide

## Offline checks

From the repository root, run:

```sh
python3 -m unittest discover -s packages/trending-topics/dify/tests -v
python3 scripts/check_registry.py
dify plugin package packages/trending-topics/dify -o /tmp/trending-topics-0.1.0.difypkg
```

Inspect the archive for only runtime sources, definitions, docs, and SVG assets. `.difyignore` excludes local credentials, `.env` files, virtual environments, caches, tests, Git state, and generated packages. Offline tests use fake clients and must not invoke AIsa or any other external API.

## Dify verification requiring an authorized test workspace

Use Python 3.12, create a local virtual environment, and install `requirements.txt`. Copy `.env.example` to `.env`, then enter the **actual** host:port and debugging key shown in your Dify workspace. Keep these values out of Git and packages. Run `python -m main` from this directory and restart after source edits.

1. Confirm the provider and one tool appear, with English and Japanese metadata.
2. Validate missing and multiline API keys are rejected locally without API requests.
3. Run `preview_only=true` without a provider key and confirm a plan with no API requests. Some Dify UI flows may require a saved provider credential before they allow invocation; the underlying preview function itself does not require one.
4. With explicit authorization for billable data requests, run a small check (`limit=1`, `enrich_top_n=0`). Confirm a ranking response, source attribution, and separate retrieval time.
5. If authorized, test one enriched topic, then confirm post time filtering, unknown timestamp labels, related-video labels, and structured variables passed into an LLM node. Do not claim successful live verification from offline tests.
6. Check timeout, invalid-key, exhausted-credit, and source-failure behavior using controlled stubs or mocks, rather than repeated paid calls.

Before Marketplace submission, test on Dify Community Edition and Dify Cloud or document any limitation, and run the official Marketplace package validator. Packaging, repository changes, Marketplace submission, and live API verification are separate steps; keep their validation results distinct.
