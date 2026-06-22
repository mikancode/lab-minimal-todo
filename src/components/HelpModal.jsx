export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="閉じる">✕</button>
        <p className="modal-catchcopy">なまえも、データも、もたない。</p>
        <p className="modal-sub">ちいさな使い捨てメモ</p>
        <ul className="modal-features">
          <li>リストをURLに変換して、その場でシェアできる</li>
          <li>シェアされたURLを開けば、すぐリストに取り込める</li>
          <li>ブックマークしておけば、いつでも使いまわせる</li>
          <li>アカウント不要。データはこの端末だけ</li>
        </ul>
      </div>
    </div>
  )
}
