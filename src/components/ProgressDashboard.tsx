import { calculateReadingProgress, type ProgressAmount } from '../data/readingProgress'
import { readingOrder } from '../data/tandemReadingOrder'

type Props = { completed: ReadonlySet<string> }

function displayPercentage(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`
}

function BookProgress({ abbreviation, title, progress }: { abbreviation: 'EOS' | 'TOD'; title: string; progress: ProgressAmount }) {
  return <div className={`book-progress ${abbreviation.toLowerCase()}`}>
    <div className="book-progress-copy"><span><strong>{abbreviation}</strong> {title}</span><strong>{displayPercentage(progress.percentage)}</strong></div>
    <div className="book-progress-track" role="progressbar" aria-label={`${title} progress`} aria-valuenow={progress.percentage} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${progress.completedUnits} of ${progress.totalUnits} reading units complete`}><span style={{ width: `${progress.percentage}%` }} /></div>
  </div>
}

export function ProgressDashboard({ completed }: Props) {
  const { eos, tod, overall } = calculateReadingProgress(completed)

  return <section className="progress-card" aria-label="Reading progress">
    <div className="progress-copy">
      <div><p className="eyebrow">YOUR JOURNEY</p><p className="progress-title">Both books</p><p className="progress-count"><strong>{completed.size}</strong><span> / {readingOrder.length} sections complete</span></p></div>
      <strong className="percentage">{displayPercentage(overall.percentage)}</strong>
    </div>
    <div className="progress-track" role="progressbar" aria-label="Both books progress" aria-valuenow={overall.percentage} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${overall.completedUnits} of ${overall.totalUnits} reading units complete`}><span style={{ width: `${overall.percentage}%` }} /></div>
    <div className="book-progress-list">
      <BookProgress abbreviation="EOS" title="Empire of Storms" progress={eos} />
      <BookProgress abbreviation="TOD" title="Tower of Dawn" progress={tod} />
    </div>
    <p className="progress-note">Weighted by chapters; Nightfall and Fireheart each count as one reading unit.</p>
  </section>
}
