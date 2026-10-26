# AIsa GTM plugin working agreement

This directory, `packages/aisa-gtm-agents/`, is the complete `aisa-gtm` plugin within the AIsa plugin registry. Treat references to the repository root in this package's maintainer documentation as this package directory unless the text explicitly discusses the shared registry. Keep `.codex-plugin/plugin.json` name aligned with the plugin identity. Communicate in concise Chinese unless the user requests otherwise.

## Structure

- `.codex-plugin/plugin.json`: plugin identity, presentation metadata and component paths.
- `.claude-plugin/plugin.json`: Claude plugin identity and version; bump this version for each release intended to trigger organization auto-sync.
- `../../.claude-plugin/marketplace.json` and `../../.agents/plugins/marketplace.json`: shared registry catalogs; the `aisa-gtm` source is `./packages/aisa-gtm-agents` relative to the registry root. Do not add package-local catalogs.
- `.mcp.json`: the AIsa Streamable HTTP MCP server at `https://tools.aisa.one/mcp`.
- `skills/creator-marketing/`, `skills/competitor-profiling/`, `skills/customer-research/` and `skills/prospecting/`: the bundled business skills in the current plugin.
- `assets/`: optional plugin images. Do not reference an asset in the manifest until the file exists.

## MCP and authentication

The MCP host owns OAuth authentication. Never add API keys, bearer tokens, credential commands or environment-variable requirements to the plugin or skill. Do not add curl, Python Router helpers or direct calls to Router/vendor HTTP endpoints.

Use only the four MCP tools exposed by AIsa: `AISA_SEARCH_TOOL`, `AISA_BATCH_GET_SCHEMA`, `AISA_BATCH_QUOTE` and `AISA_BATCH_USE`. Search for capabilities not already covered by a dated, production-verified Skill registry, and fetch a full schema when needed. A routine call covered by such a registry may start at Quote; if the tool is missing or its arguments are rejected, refresh it with Search and Schema instead of guessing. Quote exact calls, and execute only when existing user authorization covers the quoted scope and price. Never invent arguments, retry paid Use automatically or change providers to avoid approval.

## Skill behavior

Work for the user's active brand or agency client. Do not assume Soku, `context/BRAND.md`, Nox or a fixed workspace. Similarweb is not part of the current creator-marketing workflow unless a later feature has a direct website decision and is explicitly designed and tested.

Separate public evidence from hypotheses and unknowns. Similarity is not audience overlap, fraud quality, purchase intent or ROI. Research and drafting do not authorize sending outreach, signing agreements, publishing content, transferring money or changing ad accounts.

Keep the skill metadata at `author: aisa.one` with a quoted semantic version. Do not add upstream personal attribution, `source-version` or license files unless the user explicitly changes this policy. Update the plugin README and skill README when capabilities or execution behavior change.

## Validation

After changes, validate JSON syntax, local Markdown links and forbidden credential/direct-HTTP references. From this package directory, run the bundled convention checker for every changed business Skill:

```bash
python3 .agents/skills/aisa-skill-builder/scripts/check_aisa_skill.py skills/<skill-name>
```

Run `claude plugin validate . --strict` from this package directory and `claude plugin validate skills --strict` for the bundled skills when Claude Code is installed. Optional system validators are environment-specific; use their installed paths when available and report unavailable tools. Do not use a maintainer-specific absolute path or claim an unavailable validator passed.

Do not commit, publish, install or upload the plugin unless the user explicitly requests it.
