# ドクターカー記録アプリ ワークスペース

このフォルダは、GitHub Pagesで公開しているドクターカー記録アプリのローカルクローンです。

## 正本

公開・開発の正本は、GitHubリポジトリ `consommeandcola-ctrl/Doctorcar-support` の `main` ブランチにある `index.html` です。

- リポジトリ: `https://github.com/consommeandcola-ctrl/Doctorcar-support`
- 公開URL: `https://consommeandcola-ctrl.github.io/Doctorcar-support/`
- GitHub Pages公開元: `main` ブランチのルート `/`

ローカルで機能を追加するときは、最初に `origin/main` を取得し、その先端から `codex/` ブランチを作成します。過去の作業ブランチや版付きHTMLを正本として編集しません。

## 公開ファイル

- `index.html`: 現行アプリ本体・開発正本
- `manifest.json`: PWA設定
- `sw.js`: オフラインキャッシュ。アプリ版更新時はキャッシュ名も同じ版へ更新
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `apple-touch-icon.png`

## 検査

- `scripts/_test_metrics_counts_drcar.js`: メトリクス件数計算
- `scripts/_test_metrics_v2_drcar.js`: 現行メトリクス構造・信頼性・臨床時刻
- `scripts/_test_patient_none_chips_drcar.js`: 既往歴・常用薬「なし」機能と最新版保持

公開前に構文検査、上記テスト、実ブラウザでの入力・保存・出力・再読み込みを確認します。

## 過去版・参照用

- `DrCar_record_app_v3.7.html`: v3.7時点の参照・ロールバック用。現行正本ではありません。
- `DrCar_record_app_v3.6.html`: v3.6時点の参照・ロールバック用。
- `それ以外_アーカイブ/`: 旧版、試作版、PWA関連、QR・動画、過去ログ。

## GAS

利用メトリクスGASの正本はApps Scriptエディタ側です。リポジトリ内の古い参照コピーをGASへ直接デプロイしません。クライアントのスキーマとGAS側の受付仕様を確認してから更新します。

## 安全な更新手順

1. `origin/main` の最新状態を取得する。
2. ローカル `main` をfast-forwardで同期する。
3. 最新 `main` から新しい `codex/` ブランチを作る。
4. 必要な機能だけを局所的に変更する。
5. `index.html` と `sw.js` の版・キャッシュ名を揃える。
6. 構文・自動テスト・実ブラウザを確認する。
7. コミット後、必要に応じてpush・PR・Pages公開確認を行う。
