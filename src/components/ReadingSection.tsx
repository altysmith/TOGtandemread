import { useState } from 'react'
import type { ReadingSection as Section } from '../data/tandemReadingOrder'

type Props = { section: Section; checked: boolean; onToggle: (id: string) => void }

export function ReadingSection({ section, checked, onToggle }: Props) {
  const [burn, setBurn] = useState(0)

  function handleChange() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setBurn(checked || reduceMotion ? 0 : (previous) => previous + 1)
    onToggle(section.id)
  }

  return <li id={section.id} className={`reading-section ${section.book.toLowerCase()} ${checked ? 'is-complete' : ''}`}>
    <label>
      <span className="section-number">{String(section.number).padStart(2, '0')}</span>
      <span className="section-main"><span className="book-tag">{section.book}</span><span className="chapter-text">{section.chapters}</span></span>
      <input type="checkbox" checked={checked} onChange={handleChange} aria-label={`Mark section ${section.number}, ${section.book} ${section.chapters}, as ${checked ? 'remaining' : 'complete'}`} />
      <span className="visual-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      {burn > 0 && <span key={burn} className="fire-burst" aria-hidden="true" onAnimationEnd={(event) => { if (event.target === event.currentTarget) setBurn(0) }}>
        <svg className="fire-flame" viewBox="0 0 48 64" fill="none" aria-hidden="true"><path d="M24 4c4 11 16 17 16 32 0 13-8 23-20 23C8 59 3 49 5 38c2-9 8-16 11-21 0 8 2 12 5 14 3-9 3-17 3-27Z" fill="#f18435"/><path d="M24 27c3 7 10 11 10 19 0 8-5 13-12 13-7 0-12-5-12-13 0-7 6-13 9-17 0 6 2 8 3 9 2-4 2-7 2-11Z" fill="#ffd67d"/></svg>
        <i className="ember ember-one"/><i className="ember ember-two"/><i className="ember ember-three"/>
      </span>}
    </label>
  </li>
}
