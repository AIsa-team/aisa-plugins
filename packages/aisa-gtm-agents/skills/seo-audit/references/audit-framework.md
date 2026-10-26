# Audit framework

Use this reference when selecting pages and turning evidence into findings. It is a decision aid, not a promise that every check is available from every provider.

## Sampling

- Start with 3–10 pages, not a full-site crawl. Prefer user URLs, then relevant pages returned by an authorized organic-search query.
- Record requested URLs, resolved/canonical URLs, retrieval date, market, language and why each page was included.
- If the user has a page inventory, GSC export or analytics export, use it as the sampling frame before buying page-discovery data.
- Keep a failed, blocked or empty page in the ledger as `unknown`; do not silently replace it with another page.

## Finding taxonomy

For each sampled page, inspect only what the returned evidence supports:

| Area | Evidence examples | Common limits |
|---|---|---|
| Crawlability/indexation | robots directives, canonical, HTTP/status metadata, noindex signals, internal links, sitemap references | A page extract cannot prove Google index status or complete internal linking. Confirm with GSC/index inspection when supplied by the user. |
| Technical | status/redirect chain, title/description presence, viewport, heading structure, structured data in returned HTML, resource or rendering warnings | Static extraction cannot prove JavaScript-injected markup, Core Web Vitals, mobile usability or server behavior unless the relevant module was run. |
| On-page | title/H1 alignment, topical terms/entities, headings, image alt text, canonical and language annotations when returned | Relevance is an interpretation, not a ranking guarantee; avoid keyword stuffing recommendations. |
| Content quality | intent fit, specificity, first-hand proof, freshness signals, author/entity clarity, duplication or thinness across the sampled pages | Do not infer expertise, trust or uniqueness from one excerpt; do not make legal/medical claims. |
| Authority (conditional) | backlink/referring-domain counts and quality fields from the named provider, brand/entity evidence from cited pages | Provider link counts are estimates; they do not prove link value, authority, endorsement or causality. |

Do not label a page as having no structured data solely because static extraction did not show it. Use `not observed in returned HTML` and state that rendering was not checked.

## Impact and confidence

For every issue:

- **Evidence**: exact page(s), provider/material, retrieval date, market/language, field or short excerpt, and whether it is user-supplied, observed, estimated or inferred.
- **Impact**: plausible search/user consequence and the decision it affects; do not promise a ranking change.
- **Fix**: concrete owner-facing next step, plus any needed validation or dependency.
- **Priority**: Critical only for a demonstrated blocker; High for a material issue affecting important pages; Quick win for low-effort supported changes; Long term for structural or authority work. Otherwise use a lower priority or an investigation item.
- **Effort**: low/medium/high estimate, explicitly provisional unless the user supplied engineering context.
- **Confidence**: high when directly observed and unambiguous; medium when interpretation or sample limitation matters; low when dependent on unverified assumptions.

Rank actions by expected impact relative to effort, but retain blockers above easy cosmetic changes. Do not treat provider no-data, an empty result or a failed request as a zero or as negative evidence.

## Conditional diagnosis

- For a decline, separate first-party GSC/GA4 facts from provider estimates and page evidence. Similarweb trend or channel movement can describe an estimated change, not explain its cause.
- For performance, report only requested/narrowed Lighthouse fields and keep the tested page list visible. Do not imply full-site Core Web Vitals coverage.
- For authority, keep the provider, backlink status type and date visible. Do not infer link quality from count alone.
- For a non-English or multi-region site, preserve the exact location/language parameters and compare only like-for-like data.

## Report skeleton

1. Executive summary and decision requested.
2. Methodology, date, market/language, tools and authorization/quote boundary.
3. Actual URL sample and per-page evidence ledger.
4. Findings by taxonomy, each with Evidence / Impact / Fix / Priority / Effort / Confidence.
5. Prioritized action plan and suggested owner/verification.
6. Conditional-module results, failed/empty scopes and unknowns.
7. First-party data still needed and next measurement plan.
