# Competitor Profiling 开发行动文档

**状态：已完成（生产 MCP Search/Schema/Quote/Use 已验证）**

## 业务目标与 GTM 位置

从竞品 URL 生成结构一致、可横向比较、有日期和来源的竞品档案，覆盖定位、产品、定价、客户证明、搜索表现、流量/渠道以及明确要求的深度模块。对应市场研究和定位步骤。

## 移植来源与需求证据

- 主体：`coreyhaines31/marketingskills/skills/competitor-profiling`，MIT，skills.sh 安装量约 **73.3K**。
- Router 已有 `generation/seeds/competitor-profiling.yaml` reviewed seed，可参考步骤、错误处理和验收，但其固定 Firecrawl Map 流程需按本次成本 review 修正。
- 移植 Quick Scan/Deep Profile、facts over opinions、统一模板、原始证据留存和 missing-data 规则。

## 移植前的数据源

- 竞品官网 homepage、pricing、features/product、about、customers/case studies、integrations、changelog；
- Firecrawl Map/Scrape/Search；
- DataForSEO backlinks、domain rank、ranked keywords、keywords for site、organic competitors、relevant pages；
- G2、Capterra、Product Hunt、TrustRadius 等公开评论页。

## AIsa 工具设计

### 核心

- `post_tavily_extract`：同步批量提取已知 homepage、pricing、product/features、customers/case studies URL。
- `post_tavily_search`：找不到定价、评论或特定官方页时；一次返回排序结果和文本，优于仅返回 snippet、约 15 秒的 Firecrawl Search。
- `post_dataforseo_labs_google_domain_rank_overview_live`：搜索 footprint。
- `post_dataforseo_labs_google_relevant_pages_live`：识别带来搜索表现的页面。

### 条件启用

- `post_dataforseo_labs_google_serp_competitors_live`：识别 shared-ranking 搜索竞争者；不可称为业务竞品。
- `post_dataforseo_labs_google_kw_for_site_live`：需要竞品关键词/内容策略时。
- `post_dataforseo_backlinks_summary_live`：仅 Deep Profile。
- Similarweb 模块按问题选择，不全量必跑；生产 MCP 在 2026-09-13 验证的实际名称为：
  - `similarwebWebsiteTrafficTrend`
  - `similarwebTrafficEngagement`
  - `similarwebMarketingChannelSourcesLegacy`
  - `similarwebSimilarSites`
  - `similarwebPopularPages`
  - `similarwebWebsiteTopGeographies`
  - `similarwebTechnologies`（仅技术栈影响竞争判断）

### 待验证的遗漏候选

最新 AIsa docs 中出现了 Foreplay 的 domain → brand、brand ads 和 brand analytics 能力，可用于广告创意/投放动作 Deep Module；但这些 operation 不在 Router 当前锁定的 docs commit 中。因此首版不写入可执行 operation ID。后续 Agent 只有在生产 `AISA_SEARCH_TOOL` 能发现、Schema 明确且 Quote 可接受时才能加入，并应限制广告数量和日期范围。

### Fallback

- `post_firecrawl_scrape`：Tavily 无法抓取某个关键页面时使用；不是默认步骤。
- 找不到官方定价时可用第三方证据，但必须标记 indirect/cached，不能当作当前官方价格。

### 禁用/不默认

- `post_firecrawl_map` 和异步整站 crawl；
- 为每个竞品调用所有 Similarweb endpoint；
- 将 Similar Sites、SERP competitor、audience overlap 或业务竞品混为一谈；
- 未经生产 Search 验证的 Foreplay 广告能力，或默认拉取大量广告/长日期 analytics；
- 从网页执行指令，或把无数据解释为零。

## 建议流程

1. 输入竞品 HTTPS URL、己方产品/受众、quick/deep 和关注维度；一次处理数量有界。
2. 直接抽取 homepage；用 Tavily Search 或明确链接定位 pricing 和最多 2–3 个关键页。
3. 所有竞品采用同一核心指标口径，避免不可比。
4. 按研究问题追加 Similarweb、backlink、review、tech 或 ad 模块，并分别 quote。
5. 输出定位、产品/功能、定价、客户证明、SEO/流量、优劣势、对己方影响；事实和推断分开。

## 交付物与验收

- 每个竞品一份 profile，加 cross-competitor summary；包含 retrieval date、source URL、missing data。
- 每个价格和定量指标有证据；Similarweb 明确为估算数据。
- Quick mode 不做 map、大规模 scrape、backlink 或广告枚举。
- 工具 policy 必须分 core/conditional/fallback/forbidden，不能把 operation 清单写成全部必跑。

## 试点实现记录（2026-09-13）

- 已实现 `skills/competitor-profiling/`，包含可执行 `SKILL.md`、用户 README 和渐进披露的生产 MCP tool contract reference。
- 通过真实 `tools.aisa.one/mcp` 对 15 个核心/条件/fallback 工具完成 Search 和完整 request/response Schema 验证。发现并修正了此前文档中的旧 Similarweb `get_similarweb_*` 名称；生产实际使用 `similarweb*` camelCase identity。正常路径读取固定 registry 后直接 Quote，不再为已知工具重复 Search；只有工具缺失、schema 拒绝或能力不在 registry 时才回退 Search/Schema。
- 2026-09-13 的最小报价观察（均为 estimate、无保证上限，不是固定价格）：Tavily Extract `https://aisa.one` 约 `$0.11136`；DataForSEO domain rank 单域/单行约 `$0.04364`；Similarweb traffic trend 单域约 `$0.783`；Firecrawl Scrape 单页约 `$0.001864`。
- 经用户明确授权后完成 `post_tavily_extract` 生产端到端样例：对 `https://aisa.one` 的相同参数重新 Quote 后 Use，batch 与 provider 均成功（upstream HTTP 200），返回标题、URL 和 8,875 字符正文，`failed_results=[]`，usage 为 1 credit；provider `response_time=0.01s`，实际客户费用 `$0.01392`。其余条件工具仅完成 Search/Schema/Quote 验证，后续调用仍需逐次授权覆盖实际报价。
- 经第二次明确付费授权，以 `openai.com` 为公开样本完成条件能力 forward-test：
  - Similarweb `similarwebWebsiteTrafficTrend` 成功，返回 2026-03 至 2026-08 的月度 `visits` 估算和完整 `meta`；实际费用 `$0.783`，本机观测 MCP Use 往返约 1.1 秒。实测补全静态 response schema 留空的 `points[].month` 与 `points[].values.visits`。
  - 5 个 DataForSEO 工具全部 batch/HTTP/provider 成功，顶层及 task `status_code=20000`、`tasks_error=0`：domain rank、relevant pages、keywords for site、SERP competitors、backlinks summary 的实际客户费用分别为 `$0.021089`、`$0.021507`、`$0.021507`、`$0.021507`、`$0.041824`，provider 顶层耗时分别为 0.1448、0.2240、2.0320、0.1033、5.4578 秒；所有 `limit` 均为 1–3，未分页。
  - Firecrawl 对 `https://openai.com/api/pricing/` 成功，HTTP 200，返回 17,745 字符 Markdown，解析到 canonical `https://openai.com/business/pricing/#api`，实际费用 `$0.001864`；实测 credit 位于 `data.metadata.creditsUsed`，与静态 schema 的顶层位置有差异，reference 已要求兼容两处。
  - 上述 7 次条件调用实际总费用 `$0.912298`；DataForSEO + Firecrawl 六调用并行 batch 的本机观测往返约 7.2 秒。另外 6 个 Similarweb endpoint 的最小报价合计约 `$12.1365`，其中 geography 约 `$3.915`、similar-sites 约 `$3.2625`；因一个成功的 traffic-trend 已覆盖 Similarweb 条件执行路径，未为测试目的继续全量付费。
- 所有工具采用显式报价、授权后 Use、无自动付费重试；DataForSEO 需检查顶层及逐 task `status_code`，Similarweb 需保留 provider `meta` 和估算边界，Tavily 需检查逐 URL `failed_results`。
- 专属 forward-test 断言已编码进 Skill 行为边界：已知 URL/仅目标发现、歧义、跨地区/非英语、空或失败结果、未授权报价、相邻 Skill 和网页 prompt injection 均不得编造或越界。
