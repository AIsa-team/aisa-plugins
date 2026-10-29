# Politics Digest（日本の政治ニュース）

AIsa経由でニュースの根拠を収集し、DifyのLLMまたはAgentで出典付きの日本語
ダイジェストを作成するための、独立したプラグインです。プロバイダーとツールの
公開名は、どちらも `politics-digest` です。

[English](../README.md) · [プライバシー](../PRIVACY.md)

## 導入

Dify **1.16.0以降**、Python **3.12**、`dify-plugin==0.10.2` を使用します。
[AIsa Console](https://console.aisa.one)でAPIキーを取得し、DifyのIntegrationsで
`.difypkg` をインストールしてプロバイダーを認証してください。認証設定時はキーの
書式のみをローカルで確認します。通信は行わず、残高やリモートでの有効性は確認しません。

対象は **読売・朝日・日経・毎日・産経** です。既定では新聞社ごとに検索し、5紙それぞれの取得状況を返します。同じ出来事への複数紙のリンクは、各紙の主張が一致していることを意味しません。1紙を選択して対象を絞り込むこともできます。
通信先は `https://api.aisa.one` に固定しています。新聞社のログイン情報や
購読者用Cookieは受け取りません。

## パラメーター

| 名前 | 既定値 | 内容 |
| --- | --- | --- |
| `source` | `all` | `all`（既定）、`yomiuri`、`asahi`、`nikkei`、`mainichi`、`sankei`。 |
| `keywords` | 空 | 各検索へ追加するキーワード。200文字以内。 |
| `lookback_hours` | `24` | 過去1〜168時間。一覧冒頭は日本時間（`Asia/Tokyo`）、JSON日時はUTCのISO 8601形式。 |
| `max_items` | `10` | 重複を除いた記事の上限。1〜20の整数。 |
| `extract_content` | `false` | 選択した公開記事URLを最大3件、追加取得。 |
| `fallback_provider` | `none` | `brave` で不足する検索を追加補完。既定は無効。 |
| `preview_only` | `false` | 通信やAPI利用を行わず、リクエスト計画のみを表示。 |

通常はAIsa経由のTavilyニュース検索を使用します。Brave補完や本文の追加取得を
有効にすると、課金対象のAPIリクエストが増える場合があります。まず
`preview_only=true` で計画を確認できます。すべての記事の収集や、速報の即時反映は
保証できません。

## 出力と要約

出力はJSON形式の根拠と、出典を並べた日本語の一覧です。プラグイン内でモデルによる
文章生成は行いません。`items`、`coverage`、`warnings`、`status`、`generated_at` を
後続ノードへ渡せます。JSON全体には対象期間やリクエスト情報も含まれます。

`coverage` は検索ごとの取得状況、件数、日時不明の記事数、エラーを示します。
`status` は `ok`、`partial`、`empty`、`error`、`preview` のいずれかです。
取得失敗を「ニュースがない」と解釈しないでください。

推奨構成は **ツール → LLM → 回答・出力** です。後続モデルに根拠とともに、次のように
指示してください。

> 提供された根拠だけを使い、日本語のニュースダイジェストを書いてください。
> 各項目に出典URLを付け、事実と意見を区別してください。見出しや抜粋から未知の内容を
> 推測しないでください。取得できなかった媒体や公開日時の不明点を明示してください。
> 有料記事の全文を読んだと表現しないでください。

モデルの選択や費用は後続のDifyワークフローで管理します。このプラグインはDifyの
モデル・アプリ・エンドポイント・永続ストレージの権限を要求しません。

## 取得できない場合

有料記事、robots制限、タイムアウト、公開日時の欠落、検索インデックスの遅延によって
結果が一部のみになる場合があります。検索の抜粋と本文では根拠の範囲が異なります。
購読制限を回避せず、記事へのリンクを返します。日時不明の記事を新着記事として
断定しません。重複したURLは除外します。

## 開発・確認・パッケージ化

このパッケージ専用のPython 3.12仮想環境を作り、`dify/requirements.txt` の依存を
インストールしてください。リポジトリのルートで実行するオフライン確認は次のとおりです。

```bash
python3 -m unittest discover -s packages/politics-digest/dify/tests -v
python3 scripts/check_registry.py
```

テストは固定日時と偽クライアントを使い、実キーや課金API通信は不要です。`.env`、
仮想環境、キャッシュ、生成したアーカイブをGitに含めないでください。

Difyでの接続確認には `.env.example` を `.env` にコピーし、ワークスペースのデバッグ先と
キーを設定して、`dify/` 内で `.venv/bin/python -m main` を実行します。接続中は他のワークスペース
利用者もツールを実行できます。実際のニュース取得はAIsaのAPI利用になります。
デバッグキーを共有しないでください。

リポジトリのルートでパッケージ化できます。

```bash
dify plugin package ./packages/politics-digest/dify -o /tmp/politics-digest-0.1.0.difypkg
```

公開IDは `aisa-team/politics-digest`、バージョンは `0.1.0` です。パッケージ化と、
Gitへのpush・Marketplaceへの公開は別の操作です。

[プラグインのソース](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/politics-digest/dify) · お問い合わせ: [developer@aisa.one](mailto:developer@aisa.one)
