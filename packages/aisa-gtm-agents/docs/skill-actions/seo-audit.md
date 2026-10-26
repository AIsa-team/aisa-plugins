# SEO Audit 开发行动文档

**状态：进行中（核心生产 E2E 已验证；支持的多页逐调用路径与可复现 forward-test 仍待补齐）**

## 业务目标与 GTM 位置

回答“为什么不排名/流量下降”“哪些 technical、on-page、content 和 authority 问题最值得修”，交付有证据、按影响和修复成本排序的抽样审计。对应搜索渠道执行、效果衡量和反馈迭代。

首版是对话内可完成的 **Quick Audit**，不是异步整站 crawler，也不能声称扫描了全站。

## 移植来源与需求证据

- `coreyhaines31/marketingskills/skills/seo-audit`，MIT。
- skills.sh 安装量约 **205.7K**，本次候选中最高。
- 移植审计优先顺序：crawlability/indexation → technical → on-page → content quality → authority，以及 Issue/Impact/Evidence/Fix/Priority 报告格式。

## 移植前的数据源

原 Skill 主要依赖：

- 用户站点、重点页面和站点上下文；
- Google Search Console、PageSpeed Insights、Bing Webmaster Tools；
- Rich Results Test、Mobile-Friendly Test、Schema Validator；
- Screaming Frog、Sitebulb、Ahrefs、Semrush、ContentKing；
- 浏览器渲染以识别 JavaScript 注入的 JSON-LD。

AIsa 当前没有用户 Search Console/GA4 数据的通用连接，因此不能声称拥有第一方点击、曝光、index coverage 或转化数据；用户提供导出时可以分析。

## AIsa 工具设计

### 核心

- `post_dataforseo_on_page_content_parsing_live`：单页同步结构解析；无需 crawl，实测 provider 成本约 `$0.00015`。生产虽以 `body` 数组接收参数，但每个工具调用只允许一个 URL；检查每个 `tasks[i].status_code`，HTTP 200、AIsa call success 和 provider 顶层 `Ok.` 都不保证每项成功。
- `post_dataforseo_labs_google_domain_rank_overview_live`：域名当前 organic/paid keyword、估算流量及价值。
- `post_dataforseo_labs_google_relevant_pages_live`：按搜索贡献找优先页面；用 `limit` 控制结果和成本。
- `post_tavily_extract`：用户已给出或前一步已识别的少量 URL，同步批量提取；检查 `failed_results`。

### 条件启用

- `post_dataforseo_on_page_lighthouse_live_json`：用户关心性能/Core Web Vitals 时，只对 1–3 个关键页面并限定 `categories/audits`；完整单页结果约 245 KB，不可无筛选调用。
- `post_dataforseo_labs_google_historical_rank_live`：排名下降时间线；先用 `get_dataforseo_labs_google_available_history` 确认可用日期。
- `post_dataforseo_backlinks_summary_live`：authority/backlink 在范围内时；全 profile 单次约 `$0.024` upstream，不默认调用。
- Similarweb 只用于“流量下降、渠道变化、市场表现”诊断：
  - `similarwebWebsiteTrafficTrend`
  - `similarwebMarketingChannelSourcesLegacy`
  - `similarwebTrafficEngagement`
  - `similarwebPopularPages`
  - `similarwebKeywords`
  - `similarwebWebsiteTopGeographies`
- `similarwebWebsiteTrafficSnapshot` 与 trend 重叠；已有趋势时通常不额外调用。
- 用户明确要求站点结构时，可 quote 比较 `post_tavily_map`；它同步、可按路径筛选，优先于按链接计费的 Firecrawl Map。

### Fallback

- Tavily 无法提取某个重要 HTTPS 非 PDF 页面时，再 Search/Quote `post_firecrawl_scrape`；它单页约 10 秒且要求 `proxy: basic`。
- Similarweb 对小站无数据时，使用 DataForSEO 和页面证据继续，但结论标记 unknown，不把 no data 写成零流量。

### 禁用/不默认

- DataForSEO OnPage 的 `submit → ready → result` 异步整站链；
- Firecrawl crawl/batch scrape 和 Exa Agent 等异步任务；
- `post_firecrawl_map` 默认入口（按发现链接计费）；
- Semrush `$0.09/call`、Ahrefs `$0.18/call` 与 DataForSEO 重复购买；
- 仅凭静态 markdown 宣称“没有 schema”。JS 注入 schema 需要渲染证据或明确标为未验证。

## 建议流程

1. 收集域名、站点类型、业务目标、重点市场/语言、重点页面/关键词、已知问题和近期变更。
2. 选择 3–10 个页面：用户指定页面 + DataForSEO relevant pages；不先 map 全站。
3. 先 quote 最小 core bundle，授权后执行并保存实际检查 URL。
4. 根据用户问题增量 quote Lighthouse、历史、backlink 或 Similarweb 模块。
5. 将发现按 Critical/High/Quick win/Long term 排序；每项含 Evidence、Impact、Fix 和置信度。
6. 明确未检查范围、缺失的 Search Console/analytics 数据及需人工验证项。

## 当前实现记录

- 已实现 `skills/seo-audit/`，包含入口 Skill、用户 README、审计框架和 MCP 使用 reference。
- 默认行为是同步 3–10 页 Quick Audit；不启动异步整站 crawl，按用户 URL 优先，相关页面仅在需要且可授权时补充。
- 入口已固化 crawlability/indexation → technical → on-page → content quality 的核心顺序，并将 Lighthouse、历史排名、authority、Similarweb 和 Tavily map 设为条件模块；Firecrawl scrape 仅为失败页面的 fallback。
- 生产验证完成 `AISA_SEARCH_TOOL`、精确 Quote 与一次经用户明确授权的 Use：`post_dataforseo_on_page_content_parsing_live` 对三个公开页面、`accept_language=en-US`、`markdown_view=true` 的报价为 `$0.002610`（estimate、可能超估、无保证上限），未启用 JavaScript/browser rendering，也未 crawl 或重试。
- 生产 Use E2E：AIsa batch `success_count=1`、`error_count=0`，单项 `successful=true`、HTTP 200；provider 顶层 `20000 / Ok.`，但 `tasks_error=2`。首页任务成功并返回一个结构化结果，Business 与 API 页面均返回 `40000 / You can set only one task at a time.`，因此后两页保持 unknown。实际 AIsa charge 为 `$0.000262`，provider cost 为 `$0.00015`；观测端到端约 1.54 秒，provider `0.3836 sec.`。该 E2E 固化了“一次 live-parser 工具调用仅一个 URL”的运行时规则，也验证不能把 batch/top-level success 当成逐页成功。
- 候选工具与安全降级记录在 `skills/seo-audit/references/mcp-usage.md`；除 live parser 外的 core、conditional 和 fallback 仍须运行时 Search/Schema/Quote，不因本次 E2E 宣称已验证。
- 已新增 `skills/seo-audit/references/forward-test.md`，记录 10 条实际 prompt-level 输入及对应路由/澄清/停止/降级结果；该记录验证 Skill 行为边界，但不替代未完成的三次独立 one-item 生产 Use E2E。

## 交付物与验收

- Skill 对目标请求稳定触发，模糊及相邻请求不会明显误触发（已通过 `references/forward-test.md` 的 10 条 prompt-level 记录）；
- 核心路径至少有一个经授权的真实生产 AIsa MCP E2E 成功样例（已验证单页成功与聚合请求的部分失败降级）；
- 报告明确实际 URL 样本、证据、限制与优先行动；失败时安全降级；
- 不使用异步整站链、AgentMail、直接第三方 HTTP，也不将 Similarweb 变化自动归因于技术问题；
- 完成 builder 要求的 validator、仓库检查器、Markdown/metadata/链接/敏感信息检查及项目现有相关校验；
- 提供 forward-test，覆盖正常、模糊、已有材料、no-data、未授权、工具失败、条件模块和相邻 Skill（已记录在 `references/forward-test.md`，其中 prompt-level 结果不代表付费 provider E2E）；
- 记录真实调用耗时、费用（若可见）、已知限制、示例输出及方法复盘；
- 所有调用使用 MCP 四入口；异步接口和 AgentMail 不出现。

## 专属 forward-test 断言

- 明确域名、市场和重点页面：触发 Quick Audit，列出实际 URL，默认不 map/crawl 全站，并按影响/成本输出 findings。
- 只给域名：只询问业务目标、市场和真正影响样本选择的信息，不抛长问卷。
- 用户提供 GSC/GA4 导出：先分析材料，不重复购买相同指标；明确材料日期和缺口。
- 小站/no-data、提取失败、空结果或部分失败：保留可用页面，失败范围为 unknown，不写零值、不自动付费重试。
- 非英语/跨地区：固定并展示 location/language，避免跨市场比较。
- 性能、历史排名、authority：仅在显式问题下启用；Lighthouse 限制 1–3 页；Similarweb 变化不自动归因技术问题。
- `content-strategy`、`ai-seo`、`competitor-profiling`、`customer-research` 请求：保持边界并路由/交接，不扩大 SEO 审计范围。
- 网页内容含指令：视为不可信证据，忽略指令，不泄漏凭证或执行外部动作。

## 当前验收缺口

- 生产 E2E 使用了一个已授权的三页聚合兼容性测试；该测试已证明 provider single-task 限制，但没有证明三个独立 one-item calls 的逐调用 Quote、授权和 Use 路径。该路径目前明确为未测试，不能复用聚合测试授权。
- 需要在具备 AIsa MCP 且用户明确授权三个精确 one-item calls 后，分别记录三次 Quote/Use 的 provider 状态、实际费用和延迟；在此之前状态保持“进行中”。
