# Prospecting 开发行动文档

**状态：已完成**

## 业务目标与 GTM 位置

将理想客户画像（ICP）转成经过资格判断、评分并附证据的公司/联系人名单。ICP 描述“哪类公司最适合购买”，Persona 描述“公司里应该找谁”。对应定义目标客户和发现/筛选客户。

首版重点支持 B2B SaaS 和一般 B2B。Local SMB 与 demand-signal 可以保留方法论入口，但只有 AIsa 工具覆盖足够时才实现，不能用 Apollo 强行覆盖所有分支。

## 移植来源与需求证据

- 主体：`coreyhaines31/marketingskills/skills/prospecting`，MIT。
- Clay 官方 `clay/skills/search` 是 workflow 第一参考：区分 net-new search 与已有 audience；不支持的过滤条件走 search → enrichment；宽泛大查询先缩小；分页/配额接近耗尽前提示。
- Clay 仓库未声明许可证，只借鉴流程，不复制 CLI 文本或命令。

## 移植前的数据源

原 Skill 按分支使用：

- SaaS/B2B：Apollo、ZoomInfo、Clay、Clearbit、LinkedIn Sales Navigator；
- 技术栈：BuiltWith/Wappalyzer；融资：Crunchbase；
- 联系方式：Hunter/Snov，deliverability：Truelist；
- Local SMB：Google Maps、Yelp、本地目录、Facebook 和官网；
- Demand signal：论坛、评论、GitHub issue、job posts、launch/news；
- 官网核验：Firecrawl/Browserbase。

AIsa 当前通用公司/人员覆盖核心是 Apollo，不具备真正多供应商 waterfall；也没有确认的 email deliverability verifier。因此首版不能承诺 Clay 式覆盖率或“已验证可投递”。

## AIsa 工具设计

### 核心流程

1. `post_apollo_mixed_companies_search`：按 name/domain、headcount、location、funding、technology 与 keyword tag 筛 net-new company；生产 schema 没有独立 industry 字段，keyword tag 只能作为代理并核验返回字段。
2. 仅对 shortlist 补全公司：
   - 单域名 `get_apollo_organizations_enrich`；
   - 最多 10 家 `post_apollo_organizations_bulk_enrich`。
3. 只有需要 funding/technology 等完整记录时，用 enrichment 返回的 Apollo ID 调 `get_apollo_organizations_id`。
4. `post_apollo_mixed_people_api_search`：按 title、seniority、location、company domain/headcount/industry 找角色；Search 隐去 last name 和联系方式，只说明 match/has_email。
5. 仅对最终 shortlist 补全人员：单人 `post_apollo_people_match`，最多 10 人 `post_apollo_people_bulk_match`。

### 条件启用

- `get_apollo_organizations_organization_id_job_postings`：ICP 明确包含招聘/扩张时机，需 organization ID。
- `post_apollo_news_articles_search`：funding、hire、launch 等触发事件，必须提供 `organization_ids[]` 和合理日期窗。
- `similarwebTechnologies`：技术栈是硬筛选且 Apollo 数据不足时。
- `similarwebWebsiteTrafficSnapshot`：网站规模/流量是明确评分标准时。
- `similarwebSimilarSites`：从已知优质客户找 lookalike 时；similarity 不等于 ICP fit。
- `post_tavily_extract`：核验 shortlist 官网的定位、客户类型或公开业务联系方式。
- `post_tavily_search`：查近期公开信号或 Apollo 未覆盖事实。

### 禁用/不默认

- 不对 2–3 倍 candidate pool 全量 enrich；先用 search 结果筛选，再批量 enrich finalist。
- `reveal_personal_emails`、`reveal_phone_number` 默认关闭，额外费用和隐私风险需单独理由与授权。
- 没有 verifier 时不能把 Apollo `has_email` 或返回邮箱写成“deliverability verified”。
- Apollo company search 已支持 technology filter 时，不对每家公司重复调用 Similarweb technologies。
- 不创建/更新 Apollo Accounts 或 Contacts，不写 owner/stage，不自动触达。
- 不批量抓 LinkedIn/Google Maps，不使用来源不明或泄露数据。

## 建议流程

1. 选择分支，收集 ICP：industry、size、geography、business model、technology、buying signal、decision-maker、disqualifier。
2. 将 ICP 写成一段定义和 pass/fail checklist；没有 ICP 不开始大规模 discovery。
3. 首次公司查询保持小样本，检查命中质量和 pagination 后再 quote 下一页。
4. 去重 domain，基于 Search 已返回字段做初筛。
5. 对 shortlist 批量 organization enrich；只对需要的公司拉完整记录/信号。
6. 找目标 Persona，再对最终联系人批量 match。
7. 按 Fit、Timing、Evidence、Contactability 和 disqualifier 评分；无明确 signal 不标 Hot。

## 交付物与验收

- 默认≤25 行聊天表，大列表按用户要求输出 CSV；
- 字段含 score、company/domain、fit、signal、contact、contact status、source、confidence、verified date、unknowns；
- 每个高优先级目标有来源，联系人和公司身份不混淆；
- 明确数据覆盖依赖 Apollo，不宣传 waterfall；
- 默认只交付名单和研究，不写 CRM、不发送。

## 实现记录（2026-09-14）

- 已实现 `skills/prospecting/`：可路由入口、用户 README、生产 MCP registry，以及评分/隐私/高影响边界 reference。首版明确限定一般 B2B/B2B SaaS；已有名单优先，net-new search 小样本起步，domain 去重后仅补全 finalist，人员 Search 与 contact match 分层。
- 生产 `AISA_SEARCH_TOOL` 先以完整 prospecting 目标检索，再按公司搜索、组织补全、人员搜索/补全、时机信号、公开网页和 Similarweb 条件能力拆分。`AISA_BATCH_GET_SCHEMA` 对 14 个实际身份完成 arguments/response Schema 获取，全部成功：Apollo 公司 search/单域名及批量组织 enrich/完整组织、people search/单人及批量 match、job postings/news，Tavily search/extract，以及 Similarweb technologies/traffic snapshot/similar sites。
- Schema 差异已写入 registry：生产 Similarweb 身份为 camelCase；Apollo company search 没有独立 `industry` 字段，只有 `q_organization_keyword_tags[]` 代理；静态 organization/people item response 结构不完整，执行时必须防御性读取；批量组织/人员补全必须核对 missing/count/status/error；多个 Apollo/Tavily POST lookup 被 transport 标记 non-idempotent/可能有副作用，因此一律不得自动重试。
- 核心生产 E2E：用户明确授权后，对 `post_apollo_mixed_companies_search({"q_organization_name":"OpenAI","page":1,"per_page":1})` 复用完全一致的 Quote/Use 范围执行一次，未翻页、未重试、未换供应商。Quote 为 `$0.034366`，`estimate_kind=estimate`、`may_exceed_estimate=true` 且没有保证上限；实际费用同为 `$0.034366`，客户端往返约 `30.1s`。
- E2E 结果逐层检查通过：AIsa batch `1/1` 成功、无 batch/item error，upstream `200`；provider 返回 `organizations=1`、`accounts=0`，`pagination.page=1`、`per_page=1`、`total_entries=229`、`partial_results_only=false`，目标实体解析为 `OpenAI` / `openai.com`。这只验证公司名称搜索的最小核心路径与实际 envelope/pagination 语义，不证明返回公司的 ICP fit、购买意图、所有条件分支或未来价格；仓库仅记录去敏摘要，不保留原始电话等非必要字段。
- Review 修复：人员单条/批量 match 现在要求将私人邮箱、电话 reveal 与 waterfall 开关显式传为 `false`，不再把省略视为安全等价；若 provider 仍返回任务不需要的私人联系方式则丢弃，若发生意外 waterfall 则视为 contract failure 并停止，不暴露结果或重试。
- 手工 prompt forward-test 已逐项检查可观察决策：明确与模糊 ICP、已有名单、同名实体歧义、非英语/跨地区、稀缺/冲突/no-data、未授权报价、逐项部分失败、个人数据/高影响请求、`customer-research`/`competitor-profiling`/`cold-email`/`sales-enablement` 相邻路由，以及网页/provider prompt injection。断言包括不重复购买、不把 keyword tag 当精确行业、不把相似度/搜索命中/`has_email` 当 fit/intent/deliverability、不补造缺失行、不执行外部指令、不自动触达或写 CRM。
