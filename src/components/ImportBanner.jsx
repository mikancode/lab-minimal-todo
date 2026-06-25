export default function ImportBanner({ count, onAppend, onReplace, onDismiss }) {
  return (
    <div className="import-banner" role="alert">
      <p className="import-banner__text">
        {count}件のアイテムが共有されています。
      </p>
      <div className="import-banner__actions">
        <button className="import-accept-btn" onClick={onAppend}>
          追加する
        </button>
        <button className="import-accept-btn import-accept-btn--replace" onClick={onReplace}>
          置き換える
        </button>
        <button className="import-dismiss-btn" onClick={onDismiss}>
          キャンセル
        </button>
      </div>
    </div>
  )
}
