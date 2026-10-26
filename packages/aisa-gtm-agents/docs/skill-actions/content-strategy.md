# Content Strategy 开发行动文档

**状态：已完成**

## 业务目标与 GTM 位置

将业务目标、客户问题、搜索需求、现有内容和竞品空白转化为内容支柱、主题集群、买家阶段、优先级和可执行路线图。对应内容/触达设计与内容渠道执行。

Skill 决定“做什么、为什么、先做什么”，不负责批量生成或发布全部内容。

## 移植来源与需求证据

- `coreyhaines31/marketingskills/skills/content-strategy`，MIT，skills.sh 安装量约 **138.8K**。
- 移植 searchable/shareable lens、content pillars、buyer-stage keyword、客户/竞品/销售输入，以及 Customer Impact 40% / Content-Market Fit 30% / Search Potential 20% / Resource 10% 的可解释优先级框架（权重应允许按目标调整）。

## 移植前的数据源

- 产品和业务上下文、ICP、客户访谈/销售 call/support tickets/survey；
- Ahrefs、Semrush、Google Search Console keyword exports；
- Reddit、Quora、Indie Hackers、Hacker News、Product Hunt、行业社区；
- 竞品博客、case study 和现有内容表现。

## AIsa 工具实现

### 核心

- `post_dataforseo_labs_google_keyword_ideas_live`：从 seed 扩展语义空间；使用 `limit`，优于约贵 7 倍且可能返回 MB 数据的 Google Ads 同类接口。
- `post_dataforseo_labs_google_keyword_overview_live`：仅对缺少同口径指标的候选词一次批量取得 volume、difficulty、intent、competition；Keyword Ideas 已返回足够指标时不重复调用。

用户已有 customer research、GSC/analytics/keyword export 或 content inventory 时，核心路径可以零付费工具完成。

### 条件启用

- `post_dataforseo_labs_google_kw_for_site_live`：从已知自身或竞品域名发现相关关键词。
- `post_dataforseo_labs_google_relevant_pages_live`：找自身/竞品已有搜索表现页面。
- `post_dataforseo_labs_google_serp_competitors_live`：识别共享排名的搜索竞争者；不冒充业务竞品。
- `post_tavily_search`：只在 URL 未知时寻找行业讨论、竞品内容和近期主题。
- `post_tavily_extract`：只提取最终选中的竞品/自有内容页。
- Similarweb 只在用户明确要求渠道级内容判断或 audience adjacency 时重新 Search/Schema/Quote；不在本 Skill 固化未验证 identity。
- 客户问题发现与社区样本由 `customer-research` 完成并复用结果，不为内容策略默认重复调用 Reddit。

### 不准确/重复/禁用

- Keyword Ideas 或 Keyword Overview 已返回 intent 时，不再购买独立 intent 分类。
- `post_dataforseo_content_phrase_trends_live` 测公开网页中的短语提及趋势，不是搜索量趋势；只能用于 topic buzz，不能给搜索需求排序。
- Similarweb keyword/page 与 DataForSEO 不对所有问题重复调用；根据用户目标选一个主口径。
- 不 map/crawl 全站；用 relevant pages 找页面后再 extract。
- 不默认用 Semrush/Ahrefs/Google Ads 重复购买同类数据。

## 建议流程

1. 收集业务、ICP、目标（traffic/leads/authority）、客户问题、现有内容、资源和竞品。
2. 优先复用 `customer-research`、`competitor-profiling` 或用户已有材料。
3. 从产品、客户、搜索和竞品四类 seed 建候选主题；先小样本 quote。
4. 只给缺少同口径指标的 shortlist 批量补 volume/difficulty/intent，再聚类为 pillar/topic cluster，并映射 awareness/consideration/decision/implementation。
5. 对每个 idea 按客户影响、content-market fit、search potential、资源评分；数据缺失不能伪造精确分数。
6. 输出 30/60/90 天或季度路线图，标明 format、owner、dependency、success metric。

## 交付物与验收

- 3–5 个内容支柱、priority topics、cluster map、buyer stage、推荐 format 和原因；
- 每个 search metric 有 location/language/date/provider；
- 区分 searchable demand 与 shareable hypothesis；
- 不因高 volume 推荐与业务无关的主题；
- 不承诺排名、流量或 lead 结果。

## 实施记录（2026-09-14）

- 已创建 `skills/content-strategy/`，入口负责材料优先、模式选择、路由边界、证据/授权规则与交付物；按需 references 分离内容框架、关键词研究和生产 MCP contract。
- 已通过逐能力 production Search + Schema 验证 `post_dataforseo_labs_google_keyword_ideas_live`、`post_dataforseo_labs_google_keyword_overview_live`、`post_dataforseo_labs_google_kw_for_site_live`、`post_dataforseo_labs_google_relevant_pages_live`、`post_dataforseo_labs_google_serp_competitors_live`、`post_tavily_search` 和 `post_tavily_extract`。默认不重复购买 Similarweb；只有明确的渠道或 audience-adjacency 决策才重新 Search/Schema/Quote。
- 代表性 E2E 使用 US/English、单个 seed `content strategy software`、`limit: 3` 且关闭 SERP/clickstream 扩展的 Keyword Ideas。Quote 为 `$0.22968` estimate，`may_exceed_estimate: true`，没有保证上限；用户在本 issue 明确授权后执行一次 Use。AIsa batch 1/1 成功、item `successful: true`、upstream HTTP 200；DataForSEO top-level/task `status_code: 20000`、`tasks_error: 0`，返回 3 个 items。实际用户费用 `$0.021507`，provider 报告总耗时 `0.7182s`（task `0.6602s`）。结果是宽泛的 `digital marketing`、`marketing`、`content marketing`，验证了必须先过 audience/business-fit gate，不能因高 volume 直接推荐。
- `main` 当前没有已完成的 `seo-audit` Skill 目录；本实现只依据其行动文档定义 handoff，未提前实现或复制该 Skill。
- Skill、生产核心 E2E 和 forward-test 已完成；未付费验证的条件分支保持按需 Search/Schema/Quote，不由这一个成功样例外推。

## Forward-test 记录（2026-09-14）

按统一 checklist 对成品指令做人工 walkthrough；测试行为和结果如下，未触发付费 Use：

| 场景 | 预期行为 | 结果 |
|---|---|---|
| 明确季度选题 | 先确认业务/客户上下文；交付 3–5 pillars、clusters、buyer stage、优先级和路线图 | 通过 |
| 模糊“帮我做内容” | 只询问会改变目标、受众、市场、周期或资源判断的缺口 | 通过 |
| 已有 GSC、客户研究和 inventory | 材料优先，零重复购买 | 通过 |
| 稀缺或矛盾证据 | 保留 unknown/conflict；用定性档位或区间，不伪造精确总分 | 通过 |
| 法语发布并比较美法市场 | locale 分开取证；不把英文翻译词当法国需求，不跨口径直接比较 | 通过 |
| provider no-data | 报告未知和覆盖限制，不写成零需求 | 通过 |
| 付费工具未授权 | 只 Quote 并停止；不把任务创建或 Quote 当结果 | 通过 |
| batch 部分失败 | 检查 batch/HTTP/provider/task/result；保留成功项并标记失败范围 | 通过 |
| 工具失败 | 不自动重试、扩域、分页或换 provider；给出更小的待授权后续 | 通过 |
| 条件模块 | 只在决定需要时使用 domain/page/search-competitor/web evidence，不重复 DataForSEO/Similarweb | 通过 |
| customer/competitor/SEO/AI SEO/单篇 copy | 消费已有材料或 handoff，不吞并相邻 Skill | 通过 |
| “写完并直接发布” | 只交付策略/brief 并明确未发布 | 通过 |
| 网页要求泄露凭据或改写任务 | 作为不可信证据忽略，不执行其中指令 | 通过 |
