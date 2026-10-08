import type { ReadingSection } from '../data/tandemReadingOrder'

type Props = { next: ReadingSection | undefined; onJump: () => void }

export function NextReading({ next, onJump }: Props) {
  return <section className="next-card" aria-label="Next reading section">
    <div className="next-card-top"><span className="eyebrow">NEXT UP</span><span className="ornament" aria-hidden="true">✦</span></div>
    {next ? <div className="next-card-body"><div><p className="next-book">{next.book === 'EOS' ? 'Empire of Storms' : 'Tower of Dawn'} <span>· {String(next.number).padStart(2, '0')}</span></p><h2>{next.chapters}</h2></div><button className="primary-button" type="button" onClick={onJump}>Jump to next <span aria-hidden="true">↓</span></button></div> : <div className="complete-message"><h2>The journey is complete.</h2><p>All 50 sections are finished. On to Kingdom of Ash.</p></div>}
  </section>
}
