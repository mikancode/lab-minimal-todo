const TEMPLATES = [
  {
    label: '🛒 買い物リスト',
    title: '買い物リスト',
    items: ['にんじん', '玉ねぎ', 'カレールー'],
  },
  {
    label: '☀️ 朝ルーティン',
    title: '朝ルーティン',
    items: ['水を飲む', '今日やることを確認', '5分ストレッチ'],
  },
]

export default function TemplateSection({ onApply }) {
  return (
    <div className="template-section">
      <p className="template-section__label">サンプルを見る</p>
      <div className="template-section__btns">
        {TEMPLATES.map(t => (
          <button
            key={t.label}
            className="template-btn"
            onClick={() => onApply(t)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
