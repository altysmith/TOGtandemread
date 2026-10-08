import test from 'node:test'
import assert from 'node:assert/strict'
import { readingOrder } from '../src/data/tandemReadingOrder.ts'
import { makeBackup, parseProgress } from '../src/hooks/progressStorage.ts'

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

test('invalid backups are rejected', () => {
  for (const invalid of [null, [], {}, { schemaVersion: 2, completedSectionIds: [] }, { schemaVersion: 1, completedSectionIds: ['missing'] }, { schemaVersion: 1, completedSectionIds: ['section-01', 'section-01'] }]) {
    assert.throws(() => parseProgress(invalid))
  }
})
