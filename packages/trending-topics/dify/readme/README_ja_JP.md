# AIsa トレンドトピック

日本の X トレンド、最近の日本語投稿、関連する YouTube 動画を取得する Dify ツールです。Dify 1.16.0 以降と AIsa API キーが必要です。プラグイン自体は無料ですが、外部データの取得には AIsa API クレジットを使用します。

プロバイダーを認証後、ワークフローに **トレンドトピック** を追加してください。`preview_only=true` では通信せず、実行プランのみを確認できます。通常は最大 7 回のリクエストで、トレンド一覧と上位 3 件のトピックについて投稿・関連動画を取得します。自動再試行や追加ページ取得は行いません。

出力は出典付きの JSON と定型 Markdown です。後続の LLM ノードで日本語のニュースブリーフィングを作成できます。出典や日時を保持し、欠損値や部分的な取得結果を明記してください。関連動画は YouTube のトレンド順位ではありません。公開日時が不明な場合は null のまま返し、取得日時で置き換えません。

設定・データの制約については [English README](../README.md)、データの扱いについては [PRIVACY.md](../PRIVACY.md) を参照してください。

[プラグインのソース](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/trending-topics/dify) · お問い合わせ: [developer@aisa.one](mailto:developer@aisa.one)
