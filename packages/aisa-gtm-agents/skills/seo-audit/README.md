# SEO Audit

SEO Audit produces a bounded, source-backed Quick Audit for a domain or selected pages. It prioritizes crawlability/indexation, technical SEO, on-page relevance and content quality, and can add performance, historical-ranking, traffic, or authority evidence when the user explicitly asks for it.

## What it delivers

- the actual 3–10 URL sample and retrieval scope;
- an evidence ledger with provider/material, date, market and language;
- findings with Evidence, Impact, Fix, Priority, effort estimate and confidence;
- a prioritized repair plan and verification steps;
- explicit unknowns, failed/empty scopes and first-party data still needed.

## Example requests

> Audit `https://example.com`, focusing on the pricing, product and docs pages. Use the US English market and give me the top fixes.

> Why might our organic traffic have declined since March? Separate what our GSC export proves from provider estimates, and do not assume the cause.

> Check these three pages for technical SEO and performance issues, but do not crawl the whole site.

## Scope and boundaries

The default workflow is synchronous sampling, not an asynchronous full-site crawl. It does not claim access to GSC, GA4, Bing Webmaster Tools or Core Web Vitals unless the user supplies an export or an explicitly authorized module returns evidence. A static page response cannot prove index status or JavaScript-injected markup. Provider no-data and failed calls remain unknown, not zero.

This skill prepares analysis and recommendations only. It does not edit or publish site content, change search/analytics accounts, build links or send outreach. Use `ai-seo` for AI-answer visibility, `content-strategy` for an editorial roadmap, `competitor-profiling` for competitor research, and `customer-research` for customer evidence.
