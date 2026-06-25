# src/ 構成・設計メモ

## ディレクトリ構成

```
src/
├── App.jsx              # ルート。共有URL解析・インポートバナー制御・レイアウト
├── App.css              # 全コンポーネントのスタイル
├── index.css            # グローバルリセット・CSS変数（テーマカラー・ダークモード）
├── hooks/
│   └── useTodos.js      # 状態管理・localStorage読み書き・URL共有ロジック
└── components/
    ├── AddItemButton.jsx  # テキスト入力 + 先頭/末尾追加ボタン
    ├── TodoList.jsx       # リスト表示・件数・完了ソートトグル・エンプティステート
    ├── TodoItem.jsx       # 1件分（チェック / インライン編集 / 削除）
    ├── ShareButton.jsx    # URLをクリップボードにコピー
    ├── ImportBanner.jsx   # 共有URL受け取り時のインポート確認（追加 / 置き換え）
    ├── UndoToast.jsx      # 削除後の取り消しトースト（4秒で自動消去）
    ├── HelpModal.jsx      # 使い方モーダル
    └── TemplateSection.jsx # テンプレート一覧（空リスト時のみ表示）
```

## useTodos.js の主要な設計パターン

### seed パラメータ（空リスト時の即インポート）

共有URLを開いた時点でストレージが空の場合、バナーを表示せず直接インポートする。
`useEffect` 内 `setState` は lint 違反になるため、`useState` initializer で判断する。

```js
// App.jsx での初期化
const [{ seed, pendingImportInit }] = useState(() => {
  const shared = parseSharedHash()
  if (readStorage().length === 0) return { seed: shared, pendingImportInit: null }
  return { seed: null, pendingImportInit: shared }
})
```

### displayTodos（派生値パターン）

`todos` ステートは常に挿入順を保持し、並び替えは return 直前の派生値で行う。
これにより `sortDone` OFF 時に元の並び順が自動で復元される。

```js
const effectiveDone = t => pendingMoveIds.has(t.id) ? !t.done : t.done
const displayTodos = sortDone
  ? [...todos.filter(t => !effectiveDone(t)), ...todos.filter(t => effectiveDone(t))]
  : todos
return { todos: displayTodos, ... }
```

### pendingMoveIds（アニメーション遅延）

チェック操作時、取り消し線アニメーション（0.35s）が完走するまで項目を現在位置に留める。
`pendingMoveIds` に登録された ID は `effectiveDone` で done の反対として扱われる。

## URL共有仕様

```
#l=<LZString圧縮リスト>&t=<LZString圧縮タイトル>
```

- `l=`：必須。`[{ text, done }]` の JSON を lz-string で圧縮
- `t=`：省略可。デフォルトタイトルの場合は含めない
- `id`・`createdAt` はデバイス固有のため共有データに含めない
