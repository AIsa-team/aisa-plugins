# Customer Research 开发行动文档

**状态：已完成（Skill、生产 Search/Quote/Use E2E 与仓库门禁均已验证）**

## 业务目标与 GTM 位置

从访谈、问卷、工单、评论、社区和公开讨论中提炼客户的工作目标（JTBD）、痛点、触发事件、期望结果、替代方案、异议和真实用语，生成研究综合、VOC quote bank、Persona 或研究缺口。对应市场/客户研究和反馈迭代。

## 移植来源与需求证据

- `coreyhaines31/marketingskills/skills/customer-research`，MIT，skills.sh 安装量约 **92.9K**。
- 移植三种模式：分析已有材料、在线信号挖掘、设计一手访谈/问卷；以及 frequency × intensity、分群、原话和置信度框架。

## 移植前的数据源

- 用户提供的访谈/销售录音转写、问卷、support tickets、win/loss、churn notes、NPS；
- Reddit、G2/Capterra、Hacker News、Indie Hackers、Product Hunt、LinkedIn；
- App Store 评论、YouTube/TikTok/Instagram 评论；
- 行业分析和公开社区。

原 Skill 只描述渠道，不保证这些平台都有可调用 API。AIsa 首版应围绕实际可用的公开数据和用户材料，不虚构 G2/LinkedIn 抓取能力。

## AIsa 工具设计

### 核心

- 用户提供材料：优先直接分析，不购买外部数据。
- `get_reddit_subreddit_search`：已知目标社区时的默认搜索，约 2 秒。
- `get_reddit_search`：不知道社区时跨 Reddit 搜索，约 8–16 秒；有 `after` 分页，不自动翻页。
- `get_reddit_post_comments`：只展开少量高价值讨论。
- `post_tavily_search`：开放网络查论坛、评论、社区和公开讨论；返回排序结果及页面文本。
- `post_tavily_extract`：用户给出的评论页、访谈材料 URL 或已知讨论页，小批量同步提取；检查 `failed_results`。

### 条件启用

- `get_twitter_tweet_advanced_search`：目标群体确实活跃于 X 时；记录 query、sort、日期窗口。
- `get_youtube_search`：B2C/教育/视频型客户研究，发现视频和频道；若需要评论而 AIsa 无对应可靠工具，明确缺口。
- `get_instagram_post_comments`：已有具体 Instagram post 且该渠道与目标群体相关时。
- `post_dataforseo_content_search_live`：需要按关键词发现大量公开引用页面时，用 `limit` 控制。
- `post_dataforseo_content_summary_live`：仅用于宏观的网页引用、地区/类别/情绪分布，不代表客户样本。
- `post_dataforseo_content_phrase_trends_live`：仅分析公开内容中短语提及趋势，不等于需求量或客户意见。

### 不准确或禁用

- `post_dataforseo_content_sentiment_analysis_live` 不是逐条客户评论情绪分析；它聚合“引用关键词的网页”，且 summary 已含相同块，因此不默认使用。
- DataForSEO Google/Trustpilot review 是异步 submit/fetch，移出首版。
- 不批量抓 LinkedIn、付费墙或登录墙，不绕 CAPTCHA。
- 不从单条帖子生成 Persona；每个 segment 至少 5 个独立数据点，少于此数只输出 hypothesis。

### Fallback

- 已知 URL 的 Tavily Extract 失败时，按具体页面 Search/Quote Firecrawl Scrape；不自动重试付费调用。
- Reddit 无信号时，报告样本缺口并建议一手访谈问题，不将“没搜到”解释为“客户没有该问题”。

## 建议流程

1. 确认目标：定位、Persona、产品缺口、churn、文案语言或其他。
2. 判断模式：已有材料 / 在线信号 / 一手研究设计；先复用已有材料。
3. 明确 segment、时间窗、样本目标和输出形式。
4. 在线模式从 1–3 个最相关来源开始，先搜索帖子，再展开评论；不按平台凑数量。
5. 对每条证据记录 URL、日期、原话、上下文、可见的角色/公司信号；不推断敏感属性。
6. 聚类并按频率、强度、来源独立性和新近性评分；标记样本偏差和矛盾。

## 交付物与验收

- Top themes、代表原话、JTBD、trigger、desired outcome、alternative、implication；
- 可选 VOC bank、Persona、研究 gap 和下一轮访谈/问卷；
- High confidence 至少来自 3 个独立来源且非诱导提及；
- Reddit/支持工单等渠道偏差必须注明；
- 事实有来源，模型归类是分析而非供应商事实。

## 实现记录（2026-09-14）

- 已实现 `skills/customer-research/`：入口、用户 README，以及渐进披露的 `references/mcp-usage.md`。
- 生产 `AISA_SEARCH_TOOL` 已验证公开的 `get_reddit_search` 与 `post_tavily_search`，两者均返回完整 arguments schema；搜索结果同时暴露 `get_reddit_post_comments`、`get_reddit_subreddit_search`，但标记 `has_full_schema=false`，必须在运行时通过 `AISA_BATCH_GET_SCHEMA` 补全后才能调用。Search 还表明 `post_tavily_extract` 是已知能力，但本轮选定结果未再次返回，故入口要求未命中 registry 时重新 Search，禁止猜测参数。
- Search 输出显示 Reddit 搜索同步但约 8–16 秒；Tavily 搜索约 6 秒（均为观测，不是 SLA）。本轮 runtime overlay 未提供固定价格；每次 Use 仍须精确 Quote，不能以 Search 显示的零价替代授权。
- 对精确调用 `get_reddit_search({"query":"project management software switching pain","sort":"relevance","timeframe":"year","trim":true})` 完成生产 Quote：估算 `$0.003272`，`estimate_kind=estimate`、`may_exceed_estimate=true` 且没有保证上限；初次观测 Search/Quote 往返分别约 2.462 秒/0.426 秒。2026-09-14 用户明确授权同一工具、参数、单次范围与价格不确定性后，重新 Quote 得到相同估算并执行一次 Use，未重试或扩展。
- 生产 Use E2E：AIsa batch `success_count=1`、`error_count=0`；单项 `successful=true`、`upstream_status=200`、无 error；provider `success=true`，返回 `posts[7]`、`after` 分页游标及 `credits_charged=1`。实际 `customer_cost_micros_usd=3272`（`$0.003272`），本机端到端观测约 8.04 秒。结果中既有定价、移动体验、自托管功能限制等相关切换信号，也有“开发转项目管理职业”等词面命中噪声，验证了综合前必须按目标客户与购买情境逐条筛选，不能把所有返回项直接当客户证据或自动翻页。
- 已覆盖的行为边界：材料优先、少于 5 个独立数据点不生成确定 Persona、空/部分失败/阻断结果保持 unknown、聚合 sentiment 不当作逐条客户意见、相邻 Skill 路由、高影响场景与网页 prompt injection。生产 E2E 只验证 Reddit 核心搜索路径，不代表 Tavily、评论展开、空结果、限流或失败分支已分别产生付费实测；这些分支保持合同级检查与安全降级，不为补测试自动购买数据。
