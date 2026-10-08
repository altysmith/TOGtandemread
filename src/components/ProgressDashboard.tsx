type Props = { completedCount: number; total: number }

export function ProgressDashboard({ completedCount, total }: Props) {
  const percentage = Math.round((completedCount / total) * 100)
  return <section className="progress-card" aria-label="Reading progress">
    <div className="progress-copy"><div><p className="eyebrow">YOUR JOURNEY</p><p className="progress-count"><strong>{completedCount}</strong><span> / {total} sections complete</span></p></div><strong className="percentage">{percentage}%</strong></div>
    <div className="progress-track" role="progressbar" aria-label="Sections complete" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={total}><span style={{ width: `${percentage}%` }} /></div>
  </section>
}
