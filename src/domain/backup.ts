import { emptyData, type LearningRecord, type UserData } from './models';

export const BACKUP_FORMAT = 'word-grove-backup';
const MAX_BYTES = 20 * 1024 * 1024;
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

export function validateData(value: unknown): UserData {
  if (!object(value) || value.version !== 1 || !object(value.records) || !object(value.preferences) || !Array.isArray(value.recent)) throw new Error('invalid-backup');
  const preferences = value.preferences;
  if (!['system', 'zh', 'en'].includes(String(preferences.language)) || !['en-US', 'en-GB'].includes(String(preferences.accent)) || typeof preferences.slowSpeech !== 'boolean') throw new Error('invalid-backup');
  const records: Record<string, LearningRecord> = {};
  const entries = Object.entries(value.records);
  if (entries.length > 100000) throw new Error('invalid-backup');
  for (const [key, record] of entries) {
    if (!/^[a-z][a-z0-9'-]{0,99}$/.test(key) || !object(record) || record.wordId !== key ||
      typeof record.spelling !== 'string' || !record.spelling.length || record.spelling.length > 100 ||
      !['unknown', 'focus', 'known'].includes(String(record.status)) ||
      typeof record.updatedAt !== 'string' || !Number.isFinite(Date.parse(record.updatedAt))) throw new Error('invalid-backup');
    records[key] = { wordId: key, spelling: record.spelling, status: record.status === 'known' ? 'known' : 'unknown', updatedAt: record.updatedAt };
  }
  if (value.recent.length > 100 || value.recent.some(id => typeof id !== 'string' || !/^[a-z][a-z0-9'-]{0,99}$/.test(id))) throw new Error('invalid-backup');
  return { version: 1, records, preferences: {
    language: preferences.language as UserData['preferences']['language'],
    accent: preferences.accent as UserData['preferences']['accent'], slowSpeech: preferences.slowSpeech,
  }, recent: [...new Set(value.recent as string[])] };
}

export function encodeBackup(data: UserData) {
  return JSON.stringify({ format: BACKUP_FORMAT, schemaVersion: 1, dictionaryVersion: 'grove-2', exportedAt: new Date().toISOString(), data: { ...data, recent: [] } }, null, 2);
}

export function decodeBackup(text: string): { data: UserData; exportedAt: string } {
  if (text.length > MAX_BYTES) throw new Error('invalid-backup');
  // Count UTF-8 bytes without depending on a browser-only TextEncoder global.
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const point = text.codePointAt(i)!;
    bytes += point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
    if (point > 0xffff) i++;
    if (bytes > MAX_BYTES) throw new Error('invalid-backup');
  }
  const value: unknown = JSON.parse(text);
  if (!object(value) || value.format !== BACKUP_FORMAT || value.schemaVersion !== 1 || typeof value.exportedAt !== 'string' || !Number.isFinite(Date.parse(value.exportedAt))) throw new Error('invalid-backup');
  return { data: validateData(value.data), exportedAt: value.exportedAt };
}

export function previewImport(current: UserData, imported: UserData, wordIds: Set<string>) {
  let added = 0, conflicts = 0, unmatched = 0;
  for (const [id, record] of Object.entries(imported.records)) {
    if (!current.records[id]) added++;
    else if (current.records[id].status !== record.status) conflicts++;
    if (!wordIds.has(id)) unmatched++;
  }
  return { added, conflicts, unmatched };
}

export function mergeData(current: UserData, imported: UserData, preferImported: boolean): UserData {
  return {
    ...current,
    records: preferImported ? { ...current.records, ...imported.records } : { ...imported.records, ...current.records },
    // The explicit backup-wins choice also restores its portable preferences.
    preferences: preferImported ? imported.preferences : current.preferences,
  };
}

export function parseStoredData(raw: string | null): UserData {
  return raw === null ? emptyData() : validateData(JSON.parse(raw));
}
