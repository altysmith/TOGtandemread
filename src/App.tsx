import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { NextReading } from './components/NextReading'
import { ProgressDashboard } from './components/ProgressDashboard'
import { ReadingChecklist } from './components/ReadingChecklist'
import type { Filter } from './components/ReadingChecklist'
import { readingOrder } from './data/tandemReadingOrder'
import { useReadingProgress } from './hooks/useReadingProgress'
import { makeBackup, parseProgress } from './hooks/progressStorage'

export default function App() {
  const { completed, setCompleted, toggle, storageError } = useReadingProgress()
  const [filter, setFilter] = useState<Filter>('all')
  const [message, setMessage] = useState('')
  const importInput = useRef<HTMLInputElement>(null)
  const next = readingOrder.find((section) => !completed.has(section.id))

  function jumpToNext() {
    if (!next) return
    setFilter('all')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(next.id)
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
      target?.querySelector('input')?.focus({ preventScroll: true })
    }))
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(makeBackup(completed), null, 2) + '\n'], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'tog-tandem-progress.json'
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Progress backup downloaded.')
  }

  async function importProgress(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      if (file.size > 100_000) throw new Error('This backup file is too large.')
      const imported = parseProgress(JSON.parse(await file.text()))
      if (!window.confirm(`Replace your current progress with this backup (${imported.size} of 50 sections complete)?`)) return
      setCompleted(imported)
      setMessage(`Imported progress for ${imported.size} ${imported.size === 1 ? 'section' : 'sections'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not read this backup file.')
    }
  }

  function resetProgress() {
    if (!window.confirm('Reset all 50 sections to unread? Export a backup first if you want to keep this progress.')) return
    setCompleted(new Set())
    setMessage('Progress reset.')
  }

  return <div className="app-shell">
    <header className="site-header"><div className="crest" aria-hidden="true">✦</div><div><p className="series-label">SARAH J. MAAS · READING COMPANION</p><h1>Throne of Glass <span>— Tandem Reading Tracker</span></h1></div></header>
    <main>
      <div className="dashboard"><ProgressDashboard completed={completed} /><NextReading next={next} onJump={jumpToNext} /></div>
      <ReadingChecklist completed={completed} filter={filter} onFilterChange={setFilter} onToggle={toggle} />
      <section className="manage" aria-labelledby="manage-heading"><div><p className="eyebrow">KEEP YOUR PLACE</p><h2 id="manage-heading">Progress backup</h2><p>Your progress stays in this browser on this device. Export a backup before switching devices or clearing browser data.</p></div><div className="manage-actions"><button type="button" onClick={exportProgress}>Export progress</button><button type="button" onClick={() => importInput.current?.click()}>Import progress</button><button type="button" className="reset-button" onClick={resetProgress}>Reset progress</button><input ref={importInput} className="visually-hidden" tabIndex={-1} type="file" accept="application/json,.json" onChange={importProgress} aria-label="Select progress backup" /></div><p className="feedback" role="status">{storageError ? 'Progress could not be saved in this browser. Export a backup to keep it.' : message}</p></section>
    </main>
    <footer><span>Made for the journey between two books.</span><a href="https://www.tlbranson.com/throne-of-glass-tandem-read/" target="_blank" rel="noreferrer">Reading order: T.L. Branson ↗</a></footer>
  </div>
}
