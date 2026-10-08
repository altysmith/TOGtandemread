import { readingOrder } from '../data/tandemReadingOrder.ts'

export const STORAGE_KEY = 'tog-tandem-progress-v1'
export const SCHEMA_VERSION = 1
const validIds = new Set(readingOrder.map((section) => section.id))

export type ProgressBackup = { schemaVersion: 1; completedSectionIds: string[] }

export function parseProgress(value: unknown): Set<string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid progress file.')
  const record = value as Record<string, unknown>
  if (record.schemaVersion !== SCHEMA_VERSION || !Array.isArray(record.completedSectionIds)) {
    throw new Error('Unsupported or invalid progress file.')
  }
  if (!record.completedSectionIds.every((id) => typeof id === 'string' && validIds.has(id))) {
    throw new Error('The file contains unknown section IDs.')
  }
  if (new Set(record.completedSectionIds).size !== record.completedSectionIds.length) {
    throw new Error('The file contains duplicate section IDs.')
  }
  return new Set(record.completedSectionIds as string[])
}

export function makeBackup(completed: ReadonlySet<string>): ProgressBackup {
  return { schemaVersion: SCHEMA_VERSION, completedSectionIds: readingOrder.filter((section) => completed.has(section.id)).map((section) => section.id) }
}

export function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? new Set() : parseProgress(JSON.parse(raw))
  } catch {
    return new Set()
  }
}
