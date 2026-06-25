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
| URL共有 | `#l=<list>&t=<title>` ハッシュフラグメント（lz-string でエンコード） |
| 本番公開 | GitHub Pages（`main` push → GitHub Actions 自動デプロイ） |
| PRプレビュー | Vercel（base path は `process.env.VERCEL` で自動切り替え） |

src/ の構成・設計パターンは `src/CLAUDE.md` を参照。

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
- URL共有の仕組み（`#l=` / `#t=` ハッシュ + lz-string）は変更しない
- マジックナンバーは使わず、定数化する（例: `MAX_TEXT_LENGTH`, `MAX_ITEMS`）
- コメントは「なぜそう書くか」が非自明な箇所のみ、日本語で簡潔に記述する

### コードスニペットの提示
- 省略（`// ...` など）を使わず、変更前後が明確にわかる形で示す

### OGP画像の管理
- `scripts/generate-ogp.mjs` を変更したら、必ずローカルで `node scripts/generate-ogp.mjs` を実行し、生成された `public/ogp.png` をセットでコミットする
  - GitHub Pages 用は GitHub Actions がビルド時に自動生成する（`fonts-noto-cjk` インストール済み）
  - Vercel 用はコミット済みの `public/ogp.png` をそのまま配信するため、ローカル再生成が必要

### 注意事項
- `.git/hooks/` に Git LFS のフックが残っている場合は削除してよい
- Codespaces 再起動後は `npm install` を手動実行する（postCreateCommand から意図的に除外済み）

---

## 4. 出力フォーマット

- 返答は日本語、結論から述べる
- 「お疲れ様です」「承知いたしました」などの定型挨拶は不要
- 実装方針の確認が必要な場合は、選択肢を簡潔に提示してから着手する
- PR 作成時は本文に「Closes #<番号>」を含める
