# ドクターカー記録アプリ ディレクトリ整理メモ

このディレクトリは、2026-07-03 に以下の方針で整理しました。2026-07-10 に v3.7 を追加しています。

## 最新版_デプロイ正本

- `DrCar_record_app_v3.7.html`（新正本）
- `index.html`（GitHub Pages 公開用。v3.7 と同一内容）
- `manifest.json`
- `sw.js`（キャッシュ名 `doctorcar-pwa-v3.7.0`）
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `apple-touch-icon.png`
- `scripts/_test_metrics_counts_drcar.js`（メトリクス集計テスト）

今後の機能修正や正本確認は、まず `DrCar_record_app_v3.7.html` を基準にします。`index.html` は GitHub Pages へそのまま配置するための公開名コピーです。

## ロールバック用

- `DrCar_record_app_v3.6.html`（v3.6 正本。v3.7 以前の参照用に保持）

## それ以外_アーカイブ

旧版、試作版、PWA関連ファイル、QR、動画、過去ログを用途別に退避しています。

- `旧HTML版/`: v3.5以前、product版、初期版HTML
- `PWA関連/`: `DrCar_Generic_App`
- `QR_動画/`: QR画像、操作動画
- `過去ログ/`: 過去ログHTML

## ルートに残したもの

- `.git`
- `.gitignore`
- `README_整理.md`
