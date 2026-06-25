# Minimal Todo

シンプルなTodoリスト。URLで共有できます。

**[→ アプリを開く](https://mikancode.github.io/lab-minimal-todo/)**

## 機能

- タスクの追加（先頭 / 末尾）・完了トグル・削除
- タスク名をタップしてインライン編集
- 削除後に「元に戻す」で取り消し可能
- 完了済みタスクを自動で末尾へ移動（トグルで切り替え）
- 完了済みタスクをまとめてクリア
- リスト名を編集可能
- テンプレートからリストを作成
- データはブラウザの localStorage に自動保存
- リストを URL に変換してシェア（LINE などに貼り付け可）
- 受け取った URL を開くと「追加」または「置き換え」でインポート
- ダークモード対応
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
