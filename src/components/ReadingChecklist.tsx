import { readingOrder } from '../data/tandemReadingOrder'
import { ReadingSection } from './ReadingSection'

export type Filter = 'all' | 'remaining' | 'completed'
type Props = { completed: ReadonlySet<string>; filter: Filter; onFilterChange: (filter: Filter) => void; onToggle: (id: string) => void }

export function ReadingChecklist({ completed, filter, onFilterChange, onToggle }: Props) {
  const visible = readingOrder.filter((section) => filter === 'all' || (filter === 'completed') === completed.has(section.id))
  return <section className="checklist" aria-labelledby="reading-order-heading">
    <div className="list-heading"><div><p className="eyebrow">THE PATH AHEAD</p><h2 id="reading-order-heading">Reading order</h2></div><span className="list-total">50 sections</span></div>
    <div className="list-tools"><div className="legend" aria-label="Book legend"><span className="legend-eos">EOS <small>Empire of Storms</small></span><span className="legend-tod">TOD <small>Tower of Dawn</small></span></div><div className="filters" role="group" aria-label="Filter sections">{(['all', 'remaining', 'completed'] as const).map((option) => <button key={option} type="button" className={filter === option ? 'active' : ''} aria-pressed={filter === option} onClick={() => onFilterChange(option)}>{option[0].toUpperCase() + option.slice(1)}</button>)}</div></div>
    {visible.length ? <ol className="section-list">{visible.map((section) => <ReadingSection key={section.id} section={section} checked={completed.has(section.id)} onToggle={onToggle} />)}</ol> : <p className="empty-filter">No sections here yet.</p>}
  </section>
}
