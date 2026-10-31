import { readingOrder, type Book } from './tandemReadingOrder.ts'

export type ProgressAmount = {
  completedUnits: number
  totalUnits: number
  percentage: number
}

function amount(completedUnits: number, totalUnits: number): ProgressAmount {
  return { completedUnits, totalUnits, percentage: Math.round((completedUnits / totalUnits) * 1000) / 10 }
}

export function calculateReadingProgress(completedIds: ReadonlySet<string>) {
  const counts: Record<Book, { completed: number; total: number }> = {
    EOS: { completed: 0, total: 0 },
    TOD: { completed: 0, total: 0 },
  }

  for (const section of readingOrder) {
    counts[section.book].total += section.chapterUnits
    if (completedIds.has(section.id)) counts[section.book].completed += section.chapterUnits
  }

  const eos = amount(counts.EOS.completed, counts.EOS.total)
  const tod = amount(counts.TOD.completed, counts.TOD.total)
  const overall = amount(eos.completedUnits + tod.completedUnits, eos.totalUnits + tod.totalUnits)
  return { eos, tod, overall }
}
