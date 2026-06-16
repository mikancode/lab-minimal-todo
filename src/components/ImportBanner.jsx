export default function ImportBanner({ count, onAccept, onDismiss }) {
  return (
    <div className="import-banner" role="alert">
      <p className="import-banner__text">
        {count}件のアイテムが共有されています。現在のリストと置き換えますか？
      </p>
      <div className="import-banner__actions">
        <button className="import-accept-btn" onClick={onAccept}>
          インポート
        </button>
        <button className="import-dismiss-btn" onClick={onDismiss}>
          キャンセル
        </button>
      </div>
    </div>
  )
}
