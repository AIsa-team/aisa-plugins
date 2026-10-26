# AIsa MCP validation

Read this reference only while selecting, recording, quoting, or testing AIsa production tools for a business Skill.

## Discovery and contract capture

For a new or changed capability:

1. Search by business capability, provider, synchronous requirement, and necessary output. A guessed operation name alone is not sufficient.
2. Fetch the full schema when Search reports an incomplete schema or leaves request/response fields ambiguous.
3. Reject candidates that are unavailable in production, require an unsupported async lifecycle, or do not supply evidence needed by the Skill.
4. Classify each accepted capability as `core`, `conditional`, or `fallback`. Record forbidden substitutes separately only when they prevent a likely unsafe choice.

Capture a compact entry in a target-specific reference:

```markdown
## `<public tool identity>`

- Role: core | conditional | fallback
- Use when: <decision rule>
- Verified: YYYY-MM-DD against production AIsa MCP
- Request: required fields, relevant optional fields, types and material constraints
- Response: batch envelope, provider success indicator, result path and empty/partial-failure fields
- Execution: sync/async, quote unit and known timeout behavior
- Evidence limits: what the data can and cannot support
```

Include a minimal JSON example only when it prevents a realistic calling error. Do not paste an entire catalog response, duplicate generic AIsa policy, or freeze a quoted price as the tool contract.

## Registry reuse and drift

A dated target registry permits the normal path to skip Search/Schema. It does not bypass Quote, authorization, or response validation.

Return to Search/Schema when:

- the public tool is not exposed;
- the recorded request is rejected by schema validation;
- returned fields no longer match the recorded contract;
- the user requests a capability outside the registry;
- a material ambiguity would otherwise require guessing.

Update the target reference and implementation record after confirmed drift. Preserve the prior observation only when it explains compatibility or an unresolved migration; otherwise keep one current source of truth.

## Quote and authorization

Quote the final tool identity and exact arguments. Authorization must cover that same provider, scope, item count, and quoted price. General permission to research is not permission to incur a new charge.

When authorization is missing, provide the tool, scope, estimate, any absent maximum guarantee, and the decision the call would support; then stop. After authorization, do not change arguments between Quote and Use. Re-quote if any argument or item count changes.

Never automatically retry a paid Use, split calls to evade approval, or change providers to avoid the quoted decision.

## Result validation

Validate all available layers:

- AIsa batch-level success or failure;
- per-call or per-item failure arrays;
- upstream HTTP status where present;
- provider-native status/error fields;
- expected result path and empty-result semantics;
- usage, charge, latency, redirects, retrieval date, market and language where relevant.

Treat partial data as partial. Preserve usable evidence and name the failed scope. Treat missing data as `unknown`, not zero. Do not claim success merely because transport or HTTP status is successful.

## E2E evidence record

Record enough to reproduce the decision without storing secrets or an unnecessarily large payload:

```markdown
### YYYY-MM-DD — <scenario>

- Tool and role: `<identity>` — core | conditional | fallback
- Scope: <domain/query/items, market/language and meaningful arguments>
- Quote: <estimate and whether a guaranteed maximum was available>
- Authorization: <what user approval covered>
- Result: <batch/provider status, result count and key returned shape>
- Actual: <charge, usage and latency when visible>
- Assertion: <behavior this validates>
- Limits: <untested branches, estimates or unresolved semantics>
```

Use summaries or redacted shapes when payloads contain personal, licensed, or sensitive data.
