import test from 'node:test'
import assert from 'node:assert/strict'
import { readingOrder } from '../src/data/tandemReadingOrder.ts'
import { makeBackup, parseProgress } from '../src/hooks/progressStorage.ts'
import { calculateReadingProgress } from '../src/data/readingProgress.ts'

test('guide contains 50 stable, unique sections in the verified order', () => {
  assert.equal(readingOrder.length, 50)
  assert.equal(new Set(readingOrder.map((entry) => entry.id)).size, 50)
  assert.deepEqual(readingOrder.map((entry) => entry.number), Array.from({ length: 50 }, (_, index) => index + 1))
  assert.equal(readingOrder[0].chapters, 'Nightfall through Chapter 5')
  assert.equal(readingOrder[30].chapters, 'Chapters 33–51')
  assert.equal(readingOrder[48].chapters, 'Chapters 68–75')
  assert.equal(readingOrder[49].chapters, 'Chapter 58 through Fireheart')
  assert.deepEqual(readingOrder.map((entry) => entry.book), Array.from({ length: 50 }, (_, index) => index % 2 ? 'TOD' : 'EOS'))
})

test('backup round trip keeps completed IDs', () => {
  const completed = new Set(['section-01', 'section-31', 'section-50'])
  assert.deepEqual(parseProgress(makeBackup(completed)), completed)
})

test('chapter-weighted progress keeps separate books and a true combined total', () => {
  const empty = calculateReadingProgress(new Set())
  assert.deepEqual([empty.eos.totalUnits, empty.tod.totalUnits, empty.overall.totalUnits], [76, 59, 135])
  assert.equal(empty.overall.percentage, 0)

  const oneTodChapter = calculateReadingProgress(new Set(['section-02']))
  assert.equal(oneTodChapter.eos.percentage, 0)
  assert.equal(oneTodChapter.tod.percentage, 1.7)
  assert.equal(oneTodChapter.overall.percentage, 0.7)

  const longEosSpan = calculateReadingProgress(new Set(['section-31']))
  assert.equal(longEosSpan.eos.completedUnits, 19)
  assert.equal(longEosSpan.eos.percentage, 25)
  assert.equal(longEosSpan.overall.percentage, 14.1)

  const all = calculateReadingProgress(new Set(readingOrder.map((section) => section.id)))
  assert.deepEqual([all.eos.percentage, all.tod.percentage, all.overall.percentage], [100, 100, 100])
})

test('invalid backups are rejected', () => {
  for (const invalid of [null, [], {}, { schemaVersion: 2, completedSectionIds: [] }, { schemaVersion: 1, completedSectionIds: ['missing'] }, { schemaVersion: 1, completedSectionIds: ['section-01', 'section-01'] }]) {
    assert.throws(() => parseProgress(invalid))
  }
})
