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

- `src/` 配下にReactコンポーネントを置く
- バックエンドなし。状態の永続化はlocalStorageのみ
- `vite.config.js` の `base: '/lab-minimal-todo/'` はGitHub Pages用の設定（変更しない）
- `main` ブランチへのpushでGitHub Actionsが自動ビルド→GitHub Pages公開
