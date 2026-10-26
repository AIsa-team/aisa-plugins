# Skill 开发行动文档

本目录记录现有及计划 Skill 的研究结论和开发交接信息。它们不是可执行的 `SKILL.md`；后续 Agent 开发时应在 `skills/<skill-name>/` 中实现，并在完成后更新对应文档的状态。

这些文档已按本机 `skill-creator` 规范 review。结论和逐 Skill readiness 见 [`skill-readiness-review.md`](skill-readiness-review.md)。研究信息足以确定范围和工具，但实际开发还必须应用 [`implementation-checklist.md`](implementation-checklist.md)：它补充了 frontmatter、渐进披露、生产 Search 验证、行为测试、静态校验和“已完成”的统一定义。单独阅读某一行动文档时，也必须同时阅读该清单。

## 状态定义

- **未开始**：研究和工具映射已完成，尚未创建可执行 Skill。
- **进行中**：正在实现或验证 Skill。
- **已完成**：Skill 已实现并通过插件校验；若功能范围变化，仍需同步行动文档。

| Skill | 状态 | 行动文档 |
|---|---|---|
| Creator Marketing | 已完成 | [`creator-marketing.md`](creator-marketing.md) |
| Competitor Profiling | 已完成 | [`competitor-profiling.md`](competitor-profiling.md) |
| SEO Audit | 进行中 | [`seo-audit.md`](seo-audit.md) |
| Customer Research | 已完成 | [`customer-research.md`](customer-research.md) |
| Prospecting | 已完成 | [`prospecting.md`](prospecting.md) |
| AI SEO | 已实现；ChatGPT Use 待验证，Gemini 报价阻断 | [`ai-seo.md`](ai-seo.md) |
| Content Strategy | 已完成 | [`content-strategy.md`](content-strategy.md) |
| Cold Email | 已完成 | [`cold-email.md`](cold-email.md) |

总体流程见 [`../gtm-process.md`](../gtm-process.md)。完整性评审见 [`skill-readiness-review.md`](skill-readiness-review.md)，统一实施和验收要求见 [`implementation-checklist.md`](implementation-checklist.md)。
