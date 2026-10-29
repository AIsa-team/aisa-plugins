# Privacy policy / プライバシーポリシー

Politics Digest, version 0.1.0, by `aisa-team`. Last updated: 2026-10-29.

## English

This plugin retrieves public news evidence through AIsa at
`https://api.aisa.one`. Your AIsa API key is passed to AIsa for authorization.
Search queries (including optional focus keywords), source-domain filters,
recency settings, and result limits are sent to AIsa and its selected search
providers. If content extraction is enabled, up to three selected article URLs
are sent to AIsa for retrieval. Optional Brave fallback adds requests through
AIsa. Do not enter confidential or personal information in search keywords.

The tool returns source URLs, available article evidence, coverage information,
request metadata, and warnings to your Dify workspace. Dify and its operator may
store tool inputs and outputs in application logs according to their settings.
If your workflow forwards this evidence to an LLM, the configured model provider
receives the data passed by that workflow.

The plugin implements no persistent storage, analytics, telemetry, background
monitoring, or scheduled jobs. It does not request publisher login credentials,
subscription cookies, or Dify model/app/storage/endpoint permissions. It does not
bypass paywalls. AIsa, upstream providers, publishers, Dify, and any downstream
model provider each apply their own service terms and data-handling policies.
The plugin cannot control their retention periods.

Credential validation checks format locally without a network request. Preview
mode returns a request plan without sending the key or queries over the network.
Real retrieval, extraction, and fallback may incur API usage charges.

For plugin and privacy questions, contact [developer@aisa.one](mailto:developer@aisa.one).
You can also use the [repository issue tracker](https://github.com/AIsa-team/aisa-plugins/issues).
Never attach API keys, debug keys, or confidential query results to a public issue.

See the [AIsa privacy policy](https://aisa.one/legal/privacy-policy) and
[Dify privacy policy](https://dify.ai/legal/privacy-policy) for their data practices.

## 日本語

このプラグインは `https://api.aisa.one` のAIsa経由で公開ニュースの根拠を
取得します。AIsa APIキーは認証のためにAIsaへ送信します。検索語（任意の絞り込み
キーワードを含む）、対象ドメイン、期間、件数をAIsaと選択された検索サービスへ
送信します。本文の追加取得を有効にした場合は、選択した記事URLを最大3件、AIsaへ
送信します。Brave補完はAIsa経由の追加通信です。検索語に機密情報や個人情報を
含めないでください。

記事のURL、取得できた根拠、収集状況、リクエスト情報、注意事項をDifyへ返します。
Difyまたはその運用者は設定に応じて入力や結果をログに保存する場合があります。
後続のLLMへ結果を渡した場合は、そのワークフローで選択したモデル提供者にも
渡した内容が送信されます。

プラグイン自身は永続保存、アクセス解析、テレメトリー、バックグラウンド監視、
定期実行を行いません。新聞社の認証情報や購読者用Cookieを要求せず、有料記事の
閲覧制限を回避しません。Difyのモデル・アプリ・ストレージ・エンドポイント権限を
要求しません。AIsa、検索サービス、新聞社、Dify、後続モデルには、それぞれの
利用規約とデータ取扱方針が適用されます。それらの保存期間は制御できません。

認証設定時は通信せず、キーの書式のみを確認します。プレビューモードも通信を
行いません。実際の検索、追加取得、補完検索ではAPI利用料金が発生する場合が
あります。

プラグインやプライバシーのお問い合わせは [developer@aisa.one](mailto:developer@aisa.one)
へご連絡ください。リポジトリのissueも利用できます。APIキー、デバッグキー、機密の
検索結果を公開issueへ添付しないでください。

[AIsaのプライバシーポリシー](https://aisa.one/legal/privacy-policy)と
[Difyのプライバシーポリシー](https://dify.ai/legal/privacy-policy)も参照してください。
