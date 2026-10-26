---
name: aisa-skill-builder
description: Create or update business skills in the AIsa plugin with production MCP contracts, priced execution controls, behavioral tests, and repository acceptance gates. Use for implementing or maintaining `aisa-gtm` skills; do not use it to perform the GTM research those skills provide.
metadata:
  author: aisa.one
  version: "0.1.0"
---

# AIsa Skill Builder

Build maintainable business skills under `skills/`. Apply the system `skill-creator` guidance together with this repository-specific workflow. This skill governs authoring and validation; it does not authorize running a business workflow, purchasing data, publishing the plugin, or creating unrelated skills.

## Load the project contract

Work from the repository root. Before editing:

1. Inspect the worktree and preserve existing changes.
2. Read `AGENTS.md` completely.
3. Read the target's `docs/skill-actions/<skill-name>.md`, `docs/skill-actions/implementation-checklist.md`, and the current target Skill when it exists.
4. Read neighboring Skill descriptions when routing boundaries are part of the change.

Treat the action document as planning input, not installable instructions. Production MCP definitions and observed behavior override planned operation names or payload assumptions. Do not create a missing action document or expand the target's business scope unless the request covers that work.

## Define the behavior before the files

Establish a compact implementation contract:

- the business outcome and decision the deliverable supports;
- positive trigger language and the most likely neighboring intents;
- minimum inputs, safe defaults, and questions that materially change execution;
- core, conditional, fallback, and forbidden capabilities;
- evidence semantics, unknown handling, and high-impact action boundaries;
- the observable output and source requirements.

Prefer supplied material over new paid research. Keep business-competitor, search-competitor, provider-similarity, estimate, inference, and observed fact meanings distinct when relevant. Do not turn one provider result or one prior failure into a universal domain rule.

## Verify AIsa capabilities

Read [`references/mcp-validation.md`](references/mcp-validation.md) when adding a tool, changing a tool contract, or running production validation.

- For a new or changed capability, use production `AISA_SEARCH_TOOL`, then `AISA_BATCH_GET_SCHEMA` when Search does not return the full contract.
- For a normal path whose dated identity and request/response contract are already recorded in the target Skill, reuse that registry and proceed to Quote. Rediscover only on absence, schema rejection, drift, or new scope.
- Record only tools that change this Skill's decisions. Put compact, verified request and response contracts in an on-demand target reference; keep selection rules in `SKILL.md`.
- Never infer production availability from Router/OpenAPI, invent an operation or field, call Router/provider HTTP directly, or add credentials to the repository.

If the production MCP is unavailable, document the unverified gap and safe degradation. Do not manufacture a schema from stale plans.

## Implement with progressive disclosure

For a new business Skill, create only the resources the workflow needs:

```text
skills/<skill-name>/
├── SKILL.md
├── README.md
└── references/       # only when conditional detail justifies it
```

Keep `SKILL.md` focused on routing, mode selection, essential workflow, decision-changing tool selection, evidence rules, stopping conditions, and the deliverable. Move verified schemas, substantial domain frameworks, or mode-specific details into linked references. Do not copy the action document, full MCP catalog, generic tutorials, or speculative edge cases into the entrypoint.

Follow the repository frontmatter and README conventions. Add `agents/openai.yaml`, scripts, or assets to a business Skill only when the requested feature needs them; do not create placeholders for structural symmetry. Keep this builder outside `skills/` and out of the plugin manifest.

## Validate observable behavior

Validate the smallest representative production path that proves the core workflow. For every paid execution:

1. Quote the exact schema-valid tool identity and arguments.
2. Confirm existing authorization covers that same scope and quoted price.
3. Use exactly the quoted call; do not retry, broaden, or substitute providers automatically.
4. Check the MCP batch result, provider envelope, item-level failures, and empty-data semantics.
5. Record the verification date, scope, latency and actual charge when visible, without presenting them as permanent constants.

Test conditional or fallback capabilities only when they affect acceptance and authorization covers them. A successful core call does not prove every branch. A quote is not a result, and HTTP success is not necessarily provider success.

Run the common and target-specific forward tests in the implementation checklist. Test decisions and outcomes rather than exact prose: typical routing, ambiguity, sufficient user data, unapproved paid work, empty/partial failure, neighboring intent, high-impact requests, and prompt injection. Use an independent subagent only when the current instructions explicitly authorize delegation and the added confidence justifies it.

## Run repository gates

From the repository root, run:

```bash
python3 .agents/skills/aisa-skill-builder/scripts/check_aisa_skill.py skills/<skill-name>
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" skills/<skill-name>
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" .
git diff --check
```

Also validate JSON, local Markdown links, and any new script behavior. If a referenced validator is unavailable, report that exact gap rather than claiming it passed. Do not weaken a validator merely to accept the current output.

## Synchronize and deliver

Update the target action document from planned assumptions to observed implementation. Synchronize `skill-actions/README.md`, `gtm-process.md`, and the plugin README only where status or user-visible behavior changed. Keep dated test evidence concise and exclude credentials or raw sensitive payloads.

Before delivery, compare the diff with the original scope and report:

- created or changed Skill behavior and routing;
- production tool contracts and E2E branches actually verified;
- quote versus actual cost and latency when visible;
- forward tests and static gates run;
- unavailable, untested, or unresolved paths;
- commit and PR information only when repository delivery was requested.

Stop instead of improvising when a core capability is absent, authorization does not cover a paid call, an async flow cannot complete in the current runtime, or the requested change would cross a safety or product boundary.
