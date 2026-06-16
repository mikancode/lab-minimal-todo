# Minimal Todo

シンプルなTodoリスト。URLで共有できます。

**[→ アプリを開く](https://mikancode.github.io/lab-minimal-todo/)**

## 機能

- タスクの追加（先頭 / 末尾）・完了トグル・削除
- データはブラウザのlocalStorageに自動保存
- リストをURLに変換してシェア（LINEなどに貼り付け可）
- 受け取ったURLを開くとインポート確認バナーを表示
- 1アイテム最大50文字・最大50件

## ローカル開発

```bash
npm install   # 依存パッケージのインストール
npm run dev   # 開発サーバー起動 → http://localhost:5173
npm run build # 本番ビルド（dist/ に出力）
npm run lint  # ESLint
```

## 技術スタック

- Vite + React（フロントエンドのみ、バックエンドなし）
- GitHub Pages で公開（main ブランチへの push で自動デプロイ）
- Vercel で PR プレビュー
