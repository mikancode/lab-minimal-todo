# Minimal Todo

シンプルなTodoリスト。URLで共有できます。

**[→ アプリを開く](https://mikancode.github.io/lab-minimal-todo/)**

## 使い方

やることリストを作ってURLで共有するだけ。インストール不要、アカウント不要。

## 機能

**タスク管理**
- 追加（先頭 / 末尾）・完了トグル・インライン編集・削除（取り消し可）
- 完了済みを自動で末尾へ移動 / まとめてクリア

**リスト**
- タイトル編集・テンプレートから作成
- データはブラウザの localStorage に自動保存（サーバーなし）

**共有**
- リストを URL に変換してシェア（LINE などに貼り付け可）
- 受け取った URL を開くと「追加」または「置き換え」でインポート

**その他**
- ダークモード対応・1アイテム最大50文字・最大50件

---

## 開発者向け

### ディレクトリ構成

```
src/
├── App.jsx              # ルートコンポーネント
├── App.css              # 全コンポーネントのスタイル
├── index.css            # グローバルリセット・CSS変数
├── hooks/
│   └── useTodos.js      # 状態管理・localStorage・URL共有
└── components/
    ├── AddItemButton.jsx # テキスト入力 + 先頭/末尾追加
    ├── TodoList.jsx      # リスト表示・件数・エンプティステート
    ├── TodoItem.jsx      # 1件分（チェック / 編集 / 削除）
    ├── ShareButton.jsx   # URLをクリップボードにコピー
    ├── ImportBanner.jsx  # 共有URL受け取り時のインポート確認
    ├── UndoToast.jsx     # 削除取り消しトースト
    ├── HelpModal.jsx     # 使い方モーダル
    └── TemplateSection.jsx # テンプレート一覧
```

### セットアップ

```bash
npm install   # 依存パッケージのインストール
npm run dev   # 開発サーバー起動 → http://localhost:5173
npm run build # 本番ビルド（dist/ に出力）
npm run lint  # ESLint
```

### 技術スタック

- Vite + React（フロントエンドのみ、バックエンドなし）
- GitHub Pages で公開（main ブランチへの push で自動デプロイ）
- Vercel で PR プレビュー
