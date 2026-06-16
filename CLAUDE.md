# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Claudeの学習を兼ねたミニマルなTodoアプリ。**Vite + React**（フロントエンドのみ）で構築し、**GitHub Pages** で公開する。データはlocalStorageに保存。

## セットアップ・コマンド

```bash
npm install       # 依存パッケージのインストール
npm run dev       # 開発サーバー起動（http://localhost:5173）
npm run build     # GitHub Pages向け静的ファイルをdist/に出力
npm run preview   # ビルド結果をローカルでプレビュー
npm run lint      # ESLintによる静的解析
```

## アーキテクチャ

- バックエンドなし。状態の永続化はlocalStorageのみ
- `vite.config.js` の `base: '/lab-minimal-todo/'` はGitHub Pages用の設定（変更しない）
- `main` ブランチへのpushでGitHub Actionsが自動ビルド→GitHub Pages公開

### ディレクトリ構成

```
src/
├── App.jsx              # ルート。インポートバナー表示とレイアウト
├── App.css              # 全コンポーネントのスタイル
├── index.css            # グローバルリセット・CSS変数
├── hooks/
│   └── useTodos.js      # 状態管理・localStorage読み書き・URL共有
└── components/
    ├── TodoInput.jsx    # テキスト入力 + 追加ボタン
    ├── TodoList.jsx     # リスト表示・件数・エンプティステート
    ├── TodoItem.jsx     # 1件分（チェック / テキスト / 削除）
    ├── ShareButton.jsx  # URLをクリップボードにコピー
    └── ImportBanner.jsx # 共有URL受け取り時のインポート確認バナー
```

### URL共有の仕組み

`#share=<Base64>` 形式のハッシュフラグメントでリストを共有する。
ハッシュはサーバーに送られないのでGitHub Pagesと相性が良い。
エンコード: `btoa(encodeURIComponent(JSON.stringify(data)))`

## 開発フロー

- **すべての作業は Issue + ブランチ + PR**（初期設定も含む）
- ブランチ名: `feat/<機能名>`、`fix/<修正内容>` など
- コミットは論理的な最小粒度で分ける

## 注意事項

- `.git/hooks/` に Git LFS のフック（`pre-push`, `post-checkout`, `post-merge`）が残っている場合、push/checkout 時にエラーが出る。不要なので削除してよい
- Codespaces 再起動後は `npm install` を手動で実行する（postCreateCommand から意図的に除外済み）

## 現在の状態（最終更新: 2026-06-16）

- 初期セットアップ完了（Issue #1 / PR #2 でマージ済み）
- Todoアプリ初期実装中（Issue #3 / ブランチ `feat/todo-initial-impl`）
  - 追加・完了トグル・削除・localStorage永続化・URL共有を実装済み
  - フィルター機能は未実装（後から追加予定）
