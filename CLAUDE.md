# CLAUDE.md

## 1. ペルソナと役割

このリポジトリは **mikancode が Claude Code を学ぶための実験プロジェクト**。
あなたは実装パートナーとして、Issue を起点に設計・実装・PR 作成まで担う。
日本語でやりとりする。

---

## 2. 技術スタック・前提知識

| 項目 | 内容 |
|------|------|
| フレームワーク | Vite + React（フロントエンドのみ、バックエンドなし） |
| データ永続化 | localStorage（サーバー不要） |
| URL共有 | `#share=<compressed>` ハッシュフラグメント（lz-string でエンコード） |
| 本番公開 | GitHub Pages（`main` push → GitHub Actions 自動デプロイ） |
| PRプレビュー | Vercel（base path は `process.env.VERCEL` で自動切り替え） |

### ディレクトリ構成

```
src/
├── App.jsx              # ルート。インポートバナー表示とレイアウト
├── App.css              # 全コンポーネントのスタイル
├── index.css            # グローバルリセット・CSS変数
├── hooks/
│   └── useTodos.js      # 状態管理・localStorage読み書き・URL共有
└── components/
    ├── TodoInput.jsx    # テキスト入力 + 先頭/末尾追加ボタン
    ├── TodoList.jsx     # リスト表示・件数・エンプティステート
    ├── TodoItem.jsx     # 1件分（チェック / テキスト / 削除）
    ├── ShareButton.jsx  # URLをクリップボードにコピー
    └── ImportBanner.jsx # 共有URL受け取り時のインポート確認バナー
```

### セットアップ・コマンド

```bash
npm install       # 依存パッケージのインストール
npm run dev       # 開発サーバー起動（http://localhost:5173）
npm run build     # 静的ファイルをdist/に出力
npm run lint      # ESLintによる静的解析
```

---

## 3. 絶対に守ってほしいルール

### 開発フロー
- **すべての作業は Issue + ブランチ + PR** の流れで進める
- ブランチ名は `feat/<Issue番号>-<機能名>` または `fix/<Issue番号>-<修正内容>`
  - 例: `feat/13-clear-done`、`fix/24-ime-focus`
- コミットは論理的な最小粒度で分ける

### コードの書き方
- `vite.config.js` の `base` の記述（VERCEL 分岐）は変更しない
- URL共有の仕組み（`#share=` ハッシュ + lz-string）は変更しない
- マジックナンバーは使わず、定数化する（例: `MAX_TEXT_LENGTH`, `MAX_ITEMS`）
- コメントは「なぜそう書くか」が非自明な箇所のみ、日本語で簡潔に記述する

### コードスニペットの提示
- 省略（`// ...` など）を使わず、変更前後が明確にわかる形で示す

### 注意事項
- `.git/hooks/` に Git LFS のフックが残っている場合は削除してよい
- Codespaces 再起動後は `npm install` を手動実行する（postCreateCommand から意図的に除外済み）
- `src/` 配下が 10 ファイルを超えたら `src/CLAUDE.md` への切り出しを検討する

---

## 4. 出力フォーマット

- 返答は日本語、結論から述べる
- 「お疲れ様です」「承知いたしました」などの定型挨拶は不要
- 実装方針の確認が必要な場合は、選択肢を簡潔に提示してから着手する
- PR 作成時は本文に「Closes #<番号>」を含める
