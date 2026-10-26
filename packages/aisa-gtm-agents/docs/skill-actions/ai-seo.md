# AI SEO 开发行动文档

**状态：已实现；ChatGPT Use 待验证，Gemini 报价阻断（Google AI Mode 保留成功 E2E）**

## 业务目标与 GTM 位置

测试品牌/产品在 ChatGPT、Gemini、Perplexity、Google AI Overview/AI Mode 等答案中的出现、描述和引用情况，分析品牌与竞品差距、引用来源和页面可抽取性，并提出 GEO/AEO 优化计划。对应 AI 搜索渠道、衡量和反馈迭代。

一次答案是带时间和地域的样本，不是稳定排名；Skill 不能将少量测试包装为市场份额。

## 移植来源与需求证据

- `coreyhaines31/marketingskills/skills/ai-seo`，MIT，skills.sh 安装量约 **123.8K**。
- 移植 visibility audit、citation pattern、extractability、Structure/Authority/Presence 三支柱、平台差异和内容优化框架。

## 移植前的数据源

原 Skill 建议人工测试 Google AI Overviews、ChatGPT、Perplexity、Claude、Gemini、Copilot；分析自有/竞品页面、robots.txt、schema、第三方引用、Wikipedia/Reddit/评测站/YouTube 等 presence；工具集成主要列 Semrush、Ahrefs、Google Search Console 和 GA4。

AIsa 无用户 GSC/GA4 通用连接，因此不能测真实 AI referral conversion；可以测答案、引用、公开页面和聚合 mention 数据。

## AIsa 工具设计

### 核心

- `post_dataforseo_ai_chat_gpt_llm_scraper_live`：ChatGPT 消费者答案采样核心。2026-09-16 Search、完整请求/响应 Schema、Quote 已验证；Use 待验证，不能宣称实测成功。
- `post_dataforseo_ai_gemini_llm_scraper_live`：Gemini 核心设计路径，执行暂禁。Search、完整请求/响应 Schema 已验证；单次报价 $1.21974 与历史文档数字差异未解释。需权威定价证据解释或解决差异、重新精确 Quote 后才恢复授权执行，Schema 成功或旧价不能清除阻断。
- `post_dataforseo_serp_google_ai_mode_live`：生产验证的同步核心。2026-09-14 经 Search/Schema/Quote/授权 Use 验证，使用 parsed live 版本并显式传 location/language；不使用约 2.4 MB 的 HTML 版本。
- `post_tavily_extract`：对已知自有页和引用页做小批同步提取；逐项检查 `failed_results[]`。`post_dataforseo_on_page_content_parsing_live` 仅在需要结构化单页字段时条件启用，不能扩张为整站 SEO 审计。

### 条件启用

- `post_dataforseo_ai_llm_mentions_aggregated_metrics_live`：需要 headline visibility aggregate 时；生产 Search 表明该 family 相对昂贵，必须逐次 Quote，不能默认调用。
- `post_dataforseo_ai_llm_mentions_search_live`：查看聚合指标背后的具体答案；限制 `limit`，深分页使用返回的 `search_after_token` 且保持其余参数不变。
- `post_dataforseo_ai_llm_mentions_top_domains_live` / `post_dataforseo_ai_llm_mentions_top_pages_live`：寻找主要引用来源和 content opportunity；并不授权 outreach。
- `post_dataforseo_ai_llm_mentions_cross_metrics_live`：品牌与竞品统一口径对比时使用。其参数是至少 2 组带 `aggregation_key` 的 `targets[]`，每组内部才是对象形式的 `target[]`；不能传字符串数组。
- `get_dataforseo_ai_llm_mentions_locales`：市场/语言/platform 支持不明确时查询 reference data，仍需 Quote，不能凭文档免费描述跳过。数据集 `chat_gpt` 限美国英语，`google` 指 Google AI Overview，不能外推到 Gemini、Claude 或 Google AI Mode。
- `post_tavily_search`：研究引用来源、第三方存在和当前官方平台规范。

### 不准确/重复/禁用

- `post_dataforseo_ai_chat_gpt_llm_responses_live` 及 Claude/Gemini/Perplexity `llm_responses_live` 是通用模型调用，官方文档明确不是 SEO measurement，移出核心。
- `post_oxylabs_ai_search` 的生产 Search/Schema 虽宣称 LLM source 为 Realtime，同日真实 ChatGPT Use 返回非重试性 HTTP 422 并要求异步 Push-Pull；当前对话工作流禁用该 LLM 路径，不能据此宣称 ChatGPT/Gemini/Perplexity 已支持或被测。
- `post_dataforseo_ai_claude_llm_responses_live`：2026-09-16 用户报告不可用，移出可执行候选；Schema 暴露不构成执行成功证据。本次未独立收集其 Use 失败，不编造错误码或根因。
- Oxylabs Google source 与 DataForSEO Google AI Mode 可能重叠，但前者未做生产 Use；当前只把已完成 Search/Schema/Quote/授权 Use 的 DataForSEO parsed live 路径列为生产验证的同步核心。
- 不做所有 query × 所有 engine 的笛卡尔积；不把单次未提及解释为长期不可见。

## 建议流程

1. 确认品牌实体/域名、竞品、目标市场/语言、业务目标、要测的平台。
2. 从 category、best-for-use-case、brand-vs-competitor、problem-solving、pricing 中选择能改变决策的问题；默认首个付费样本不超过 3 个问题 × 1 个可执行平台，尊重用户指定的平台和矩阵。
3. 对执行状态允许的同步 engine 说明调用数量、已知耗时和价格风险并 Quote；保存 query、engine、requested geo、answer language、timestamp、answer、citation 和各层状态。ChatGPT 第一次 Use 需逐层验证，Gemini 阻断时分析 supplied results 并标明缺失实时 cell。
4. 需要数据库级基线时单独 quote DataForSEO mentions：单目标 aggregate，2–10 组品牌/竞品 cross metrics。它们同步检索自有预采集数据库，不证明来自客户 API 请求日志，不能与实时样本合并成市场份额。已废弃/null 的 impressions 记为不可用。
5. 抽取被引用竞品页和自有候选页，比较结构、证据、freshness、authority 和第三方 presence。
6. 产出按影响、可控性和证据强度排序的优化计划。

## 交付物与验收

- Query × Engine 观测矩阵、品牌/竞品提及和引用 URL；
- 引用来源模式、自有页面 extractability、内容和第三方 presence 缺口；
- 明确样本、时间、地域、平台、波动性和无数据；
- 不传播上游 Skill 中未经复核的通用统计数字；需要引用时通过 AIsa 搜索当前来源；
- 不推荐伪造 Reddit/Wikipedia mention、关键词堆砌或为 AI 单独生产低质内容。

## 改造与验证记录（2026-09-16）

- Skill 版本更新为 0.0.2。按用户确认方案配置 ChatGPT 核心、Gemini 报价阻断、Google AI Mode 成功路径、可选聚合库；排除 Claude，保留 Oxylabs 失败记录。同步 Skill README、插件 README、流程表和行动文档状态。
- 本会话 ChatGPT/Gemini 完整请求和响应 Schema 验证通过；Gemini 另做生产 Search，准确公共名不带 advanced 后缀。响应 Schema 的 dotted keys 只是嵌套路径描述，首个 Use 仍需验证实际 envelope。
- 复用本会话 2026-09-16 Quote 证据：美国英语问题 What is AIsa.one?，ChatGPT force_web_search=true 报价 $0.00696；Gemini 同问题但无 force_web_search 报价 $1.21974，endpoint 1908/profile revision 4；单目标 aisa.one ChatGPT 聚合报价 $0.17574。均为 estimate、无保证上限，均未 Use。未将价格差异推断为已证实计费 bug。
- 本次改造未执行付费 E2E：此前仅有试用意图，尚未覆盖具体报价及无上限风险；Gemini 另有用户确认的执行阻断。Google AI Mode 沿用下列历史 E2E，ChatGPT Use 待验证、聚合扩展未实测，不能将实现完成写成全部接口执行成功。
- 独立离线 forward-test 覆盖 10 类行为：已授权 ChatGPT、小样本与 Gemini 阻断、三品牌 cross metrics、引用与检索结果区别、模糊实体/locale、部分失败、相邻 SEO 路由、注入/发布、未授权调用、Claude 不可用。首轮 9/10，发现零错误总条件与保留成功 sibling 冲突；修正逐 task 判断后失败场景复测通过。此为指令行为检查，不是生产成功证明。
- 静态验收：check_aisa_skill.py、quick_validate.py、validate_plugin.py 和补丁 whitespace 检查通过；系统 Python 缺 PyYAML，改用临时 venv 安装 PyYAML 后完成验证。未运行付费模型评测；现有 runner 的 skill+static 筛选无匹配 case，未将其算作通过，也未修改已有脏评测文件。

## 实现与验证记录（2026-09-14）

- 已创建 `skills/ai-seo/`，包含高辨识度路由、supplied-results / query-sample / citation-page / aggregate-extension 模式、默认小样本上限、逐层响应检查、证据语义、停止条件、相邻 Skill 边界、用户 README 和生产 MCP registry。
- 通过生产 `AISA_SEARCH_TOOL` 搜索完整业务目标，再对 Query/Engine、页面提取和 DataForSEO aggregate 分解验证；对 12 个决策相关工具读取完整 request/response Schema。生产验证的同步核心为 DataForSEO parsed Google AI Mode；同时确认 Tavily extraction/search、DataForSEO 单页解析、LLM Mentions aggregate/search/top domains/top pages/cross metrics/locales 和 Firecrawl 单页 fallback，并保留 Oxylabs 漂移记录防止重复失败。
- 生产 schema/behavior 差异已写入 registry：Oxylabs 不同 source 的静态 prompt/query 与 answer/citation contract 未能保证 LLM Realtime 可执行；DataForSEO `cross_metrics` 要求 `targets[]` 分组而非 sibling endpoints 的 `target[]`；所有 DataForSEO 结果均需检查顶层与逐 task status，Tavily Extract 需检查逐 URL `failed_results[]`。
- 最小 Oxylabs ChatGPT E2E 按精确参数 Quote 并经用户在线程内明确授权后 Use：英文问题 “In English, what is AIsa at aisa.one and what does it offer? Cite the sources you use.”，United States，browse，`parse: true`；Quote `$0.00174` estimate、无保证上限。AIsa batch `success_count=0`；上游 HTTP 422、`retryable=false`，明确指出 LLM source 不支持 Realtime、需 Push-Pull；无业务结果，实际客户费用 `$0`，本机观测往返约 2.386 秒。未重试、未换 provider、未扩 scope。
- 替代同步核心 `post_dataforseo_serp_google_ai_mode_live` 经用户在线程内授权后按 Quote 原参数 Use：1 次 desktop、keyword “what is AIsa at aisa.one and what does it offer”、United States (`location_code=2840`)、English (`language_code=en`)；Quote `$0.00696` estimate、无保证上限。AIsa batch 与 upstream HTTP 200 成功；DataForSEO 顶层及 task `status_code=20000`、`tasks_error=0`，返回 1 个 result、1 个 `ai_overview`，答案 Markdown 引用 2 个唯一 URL（AIsa 官网与 LinkedIn）。实际客户费用 `$0.00696`、provider cost `$0.004`，provider 总耗时 8.9028 秒，本机观测 MCP 往返 13.128 秒。
- E2E 补全了 response schema：AI overview 位于 `tasks[].result[].items[]`，其中有 aggregate `markdown` / `references[]` 和嵌套 answer elements；实测 `se_results_count=0` 与有效 `items_count=1`、`item_types=["ai_overview"]` 同时存在，因此不能用 organic result count 判断 AI answer 缺失。
- 行为测试覆盖典型小样本、模糊实体/locale、已有 answer/citation 材料零调用、10 questions × 2 engines 的范围提示、非英语与跨地区控制限制、未授权 Quote 后停止、空结果/timeout/部分失败保留可用 cell、相邻 `seo-audit` / `content-strategy` / `competitor-profiling` 路由、高影响 publish/outreach 请求和网页 prompt injection。真实非重试性 provider failure 已促使 Skill 收窄 live platform 声明；Google AI Mode 成功 E2E 验证核心同步路径，不证明其它 engine 或条件/fallback 分支已执行。
