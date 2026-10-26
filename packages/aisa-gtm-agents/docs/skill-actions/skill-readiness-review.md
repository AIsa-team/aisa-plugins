# Skill 描述文件完整性 Review

**Review 结论：通过，可作为后续 Agent 的开发输入；但它们是行动文档，不是可直接安装的 Skill。**

Review 使用当前环境提供的 `skill-creator` 规范：低成本精确路由、渐进披露、只保留改变决策的指令、按风险决定具体程度、production tool discovery、可观察行为测试和明确停止条件。

研究基线：

- `coreyhaines31/marketingskills` revision `5b2c0007766c6a1cf1d53fd8fc73e979e0821022`，MIT；
- `clay-run/agent-plugins` revision `7407d89af7839deafe258c09a85dca334876fe11`，未声明许可证，只参考 workflow；
- Router 锁定 AIsa docs revision `a1c7978475afc4af2285e3c19b32ab5c98a600e8`。

## 完整性标准

每个候选行动文档已具备：

- 业务结果和 GTM 位置；
- 上游 Skill/仓库和需求证据；
- 移植前依赖的数据源；
- AIsa core、conditional、fallback、forbidden tool policy；
- 工具语义、成本/延迟/同步性和能力缺口；
- 输入、建议工作流、输出和验收边界；
- 空数据、失败、重复购买、高影响行为和授权限制。

统一 [`implementation-checklist.md`](implementation-checklist.md) 又补充：

- frontmatter 和 naming；
- 建议文件结构和渐进披露；
- production Search/Schema/Quote/Use 验证；
- 通用行为测试、静态校验和“已完成”定义。

因此后续 Agent 不需要重新做本轮市场和 AIsa catalog 调研，但仍须验证生产 MCP，并把行动文档压缩成高信号的 `SKILL.md`，不能原样全部复制进去。

## 每个 Skill 的 readiness

| Skill | Readiness | 可独立开工 | 开发时最重要的未决项 |
|---|---|---:|---|
| `competitor-profiling` | 充分 | 是 | production Search 是否返回 Tavily/DataForSEO/Similarweb 核心能力；Quick/Deep 默认边界 |
| `seo-audit` | 充分 | 是 | 维持“同步抽样审计”命名和承诺；页面/市场默认样本数 |
| `customer-research` | 充分 | 是 | 针对不同 ICP 选择 1–3 个来源；不把聚合网页 sentiment 当客户评论 |
| `prospecting` | 充分但高风险 | 是 | 首版是否只支持 SaaS/B2B；Apollo 联系方式覆盖与无 deliverability verifier 的披露 |
| `ai-seo` | 充分但需小样本测试 | 是 | Oxylabs 具体 source schema、90 秒超时和默认 query × engine 上限 |
| `content-strategy` | 充分 | 是 | 评分权重是默认值而非普遍真理；DataForSEO 与 Similarweb 主口径去重 |
| `cold-email` | 充分 | 是 | 工具调用必须是条件性的；研究充分时应零调用；绝不发送 |
| `creator-marketing` | 已按统一 builder 重建并生产验证 | 不适用 | 保持 3–5 人有界发现、finalist-only 验证及研究/执行授权边界 |

“充分”不代表所有参数已经固化。根据 `skill-creator`，开放任务应保留合理判断空间；只有 schema、授权、数据语义、费用、安全边界和已知脆弱流程需要写死。

## 建议的路由描述

后续实现可从以下 frontmatter `description` 开始，再在 forward-test 后收窄。描述应简洁说明“做什么、何时触发、最容易混淆的相邻边界”，不要塞入工具清单。

### `competitor-profiling`

> Research one or more competitors from their websites and produce source-backed, comparable profiles covering positioning, pricing, product, customers, search performance and requested market dimensions. Use for competitor profiles, competitive intelligence and competitor deep dives; use sales-enablement for battle cards and content-strategy for editorial gap planning.

### `seo-audit`

> Audit a website or selected pages for technical, on-page, content, search-performance and authority issues, then produce a source-backed prioritized repair plan. Use for SEO health checks, ranking or traffic-loss diagnosis and page-performance audits; use ai-seo for visibility inside AI-generated answers.

### `customer-research`

> Analyze customer-provided research or mine public customer conversations to identify jobs, pains, triggers, desired outcomes, objections and verbatim language. Use for voice-of-customer research, personas, interview or survey synthesis and review/community mining; do not use for prospect-list building.

### `prospecting`

> Turn an ideal customer profile into a bounded, evidence-backed and prioritized B2B company or contact list. Use for account discovery, ICP-fit prospect lists, decision-maker research and buying-signal qualification; use customer-research to discover customer needs and cold-email to write outreach after the list exists.

### `ai-seo`

> Measure how a brand, domain or competitor appears and is cited in AI answer engines, inspect citation and content-extractability gaps, and recommend a GEO/AEO improvement plan. Use for ChatGPT, Gemini, Perplexity or Google AI visibility and citation audits; use seo-audit for traditional technical and organic-search diagnosis.

### `content-strategy`

> Build a prioritized content strategy from business goals, customer evidence, keyword demand, existing content and competitor gaps. Use for content pillars, topic clusters, editorial roadmaps and deciding what to publish; do not use merely to draft one piece of copy.

### `cold-email`

> Draft or review concise B2B cold-email and follow-up sequences grounded in supplied or researched recipient facts. Use for outbound email copy, subject lines, personalization and sequence review; it prepares drafts only and never sends email or enrolls contacts.

## 建议的渐进披露结构

| Skill | `SKILL.md` 保留 | 建议按需 reference |
|---|---|---|
| Competitor Profiling | intake、Quick/Deep 路由、证据规则、输出 | `research-modules.md`、`profile-template.md`、`mcp-usage.md` |
| SEO Audit | scope、抽样规则、优先顺序、输出 | `audit-framework.md`、`traffic-diagnosis.md`、`mcp-usage.md` |
| Customer Research | 三模式选择、证据/偏差规则、输出 | `online-sources.md`、`interviews-and-surveys.md`、`synthesis.md`、`mcp-usage.md` |
| Prospecting | branch/ICP、阶段化补全、评分和合规 | `b2b-prospecting.md`、`scoring-and-compliance.md`、`mcp-usage.md` |
| AI SEO | query sample、平台选择、观测边界、输出 | `platforms-and-citations.md`、`content-audit.md`、`mcp-usage.md` |
| Content Strategy | inputs、searchable/shareable、评分、输出 | `keyword-research.md`、`content-frameworks.md`、`mcp-usage.md` |
| Cold Email | strategy、写作、recipient review、停止条件 | `frameworks.md`、`personalization.md`、`follow-ups.md`、`mcp-usage.md` |

实际创建时只保留确实需要的 reference；该表不是要求创建空文件。大段上游教程不得无筛选复制，应保留改变 Agent 决策的内容。

## 专属 forward-test 场景

### Competitor Profiling

- “快速分析这两个竞品的定位和定价。”断言：不 Map 全站、不运行 Deep-only backlink/ads；同一模板比较；找不到价格时报告 unavailable。
- “深挖某竞品广告和渠道。”断言：先验证相关工具并单独 quote；搜索竞争者不冒充业务竞品。

### SEO Audit

- “为什么我的网站最近流量下降？”断言：区分 technical evidence 与 Similarweb 估算渠道变化；不声称因果。
- “审计这三个页面。”断言：不启动异步 crawl；列出实际 URL；Lighthouse 限定字段。

### Customer Research

- “从这些访谈和 Reddit 研究客户痛点。”断言：优先用户材料；保留原话和来源；少于 5 个独立样本不生成确定 Persona。
- “用 DataForSEO 判断 G2 评论情绪。”断言：拒绝把 content-analysis sentiment 当逐条评论分析，并解释可用替代。

### Prospecting

- “找 25 家符合此 ICP 的 SaaS 公司和销售负责人。”断言：先 company search，再只 enrich shortlist；人员 Search 与 contact enrichment 分开。
- Apollo 返回 `has_email=true`。断言：不能写“邮箱已验证可投递”，不默认 reveal 私人邮箱/电话。

### AI SEO

- “测试品牌在 ChatGPT 和 Perplexity 的 10 个问题。”断言：先提示 20 个同步长调用的范围/报价，可建议更小样本；记录 engine/time/geo。
- 单次答案未提及品牌。断言：只报告该样本未提及，不推断长期不可见。

### Content Strategy

- “给未来一季度选题。”断言：先获取业务/客户上下文；关键词批量 overview；不把 phrase mention trend 当 search volume。
- 已提供 GSC/客户研究。断言：优先复用，不重复购买近似数据。

### Cold Email

- 用户提供完整 recipient、signal、value、proof。断言：零工具调用也能完成。
- 用户要求“直接发出去”。断言：只返回草稿并说明未发送；不搜索或调用 AgentMail。
- 缺少 proof。断言：列入 Unresolved，不编造客户结果。

## Review 后仍不能提前决定的内容

以下内容必须由实现 Agent 在生产环境或 forward-test 中确定，不应在行动文档中猜测：

- `AISA_SEARCH_TOOL` 返回的公共 tool identity 与完整 schema；
- 实时报价和用户当前授权；
- provider 的实际空结果率、超时和 payload；
- 是否值得创建 `agents/openai.yaml` 或确定性 scripts；
- 哪些 reference 在成品中确实需要，而不是为了目录完整而创建。

这正是行动文档与可执行 Skill 的边界：前者保存研究和决策约束，后者由后续 Agent 基于真实 runtime 证据实现和验证。
