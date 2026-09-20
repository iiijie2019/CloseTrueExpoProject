import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeBackup, encodeBackup, mergeData, parseStoredData, previewImport, validateData } from '../src/domain/backup';
import { emptyData, type UserData } from '../src/domain/models';
import { familyWords, morphemes, searchWords, wordById, words } from '../src/data/lexicon';
import { translate } from '../src/i18n/messages';

const sample = (status: 'known' | 'focus' | 'unknown'): UserData => ({
  ...emptyData(), records: { action: { wordId: 'action', spelling: 'action', status, updatedAt: '2026-09-20T00:00:00.000Z' } }, recent: ['action'],
});

test('portable backups round trip records and preferences without browsing history', () => {
  const data = sample('focus'); data.preferences.language = 'en';
  const decoded = decodeBackup(encodeBackup(data)).data;
  assert.deepEqual(decoded.records, data.records);
  assert.deepEqual(decoded.preferences, data.preferences);
  assert.deepEqual(decoded.recent, []);
});
test('merge conflicts require a deterministic choice and are idempotent', () => {
  const local = sample('known'), incoming = sample('focus');
  assert.equal(mergeData(local, incoming, false).records.action.status, 'known');
  const imported = mergeData(local, incoming, true);
  assert.equal(imported.records.action.status, 'focus');
  assert.deepEqual(mergeData(imported, incoming, true), imported);
  assert.equal(local.records.action.status, 'known');
});
test('unknown dictionary records survive migration, preview and another export', () => {
  const incoming = sample('focus');
  incoming.records.futureword = { wordId: 'futureword', spelling: 'futureword', status: 'known', updatedAt: '2026-09-20T00:00:00.000Z' };
  assert.deepEqual(previewImport(sample('known'), incoming, new Set(wordById.keys())), { added: 1, conflicts: 1, unmatched: 1 });
  const result = decodeBackup(encodeBackup(mergeData(emptyData(), incoming, false)));
  assert.equal(result.data.records.futureword.status, 'known');
});
test('corrupt and unsupported backups are rejected rather than partially restored', () => {
  for (const raw of ['{', '{}', JSON.stringify({ format: 'word-grove-backup', schemaVersion: 99, data: sample('focus') })]) assert.throws(() => decodeBackup(raw));
  assert.throws(() => validateData({ ...sample('known'), records: { action: { ...sample('known').records.action, status: 'mastered' } } }));
  assert.throws(() => validateData({ ...sample('known'), records: { action: { ...sample('known').records.action, wordId: 'active' } } }));
  assert.throws(() => validateData({ ...sample('known'), records: { action: { ...sample('known').records.action, updatedAt: 'not-a-date' } } }));
  assert.throws(() => validateData({ ...sample('known'), preferences: { language: 'es', accent: 'en-US', slowSpeech: false } }));
});
test('absent storage starts empty but damaged storage is not overwritten', () => {
  assert.deepEqual(parseStoredData(null), emptyData());
  assert.throws(() => parseStoredData('broken'));
  assert.throws(() => parseStoredData('{"version":2}'));
});
test('prototype-like keys cannot enter imported records', () => {
  const raw = '{"version":1,"records":{"__proto__":{"wordId":"__proto__","status":"known","spelling":"bad","updatedAt":"2026-09-20"}},"preferences":{"language":"en","accent":"en-US","slowSpeech":false},"recent":[]}';
  assert.throws(() => validateData(JSON.parse(raw)));
});
test('search recognizes case, Chinese meanings and stored inflected forms', () => {
  assert.ok(searchWords(' ACTION ').some(word => word.id === 'action'));
  assert.deepEqual(searchWords('activities').map(word => word.id), ['activity']);
  assert.ok(searchWords('同理心').some(word => word.id === 'empathy'));
  assert.deepEqual(searchWords('active', 'adverb').map(word => word.id), ['actively']);
  assert.ok(searchWords('action', 'verb').some(word => word.id === 'action'));
});
test('starter collection has stable unique keys, bilingual content and valid families', () => {
  assert.equal(new Set(words.map(word => word.id)).size, words.length);
  const rootIds = new Set(morphemes.map(root => root.id));
  for (const word of words) {
    assert.ok(word.ipa && word.pos.length && word.parts.length);
    assert.ok(word.meaning.zh && word.meaning.en && word.example.zh && word.example.en);
    for (const id of word.morphemes) assert.ok(rootIds.has(id));
  }
  for (const root of morphemes) assert.ok(familyWords(root.id).length);
  assert.ok(!familyWords('patho').some(word => word.id === 'path'));
});
test('status labels and parameterized messages support both UI languages', () => {
  assert.equal(translate('zh', 'known'), '已知');
  assert.equal(translate('en', 'known'), 'Known');
  assert.equal(translate('en', 'wordCountShort', { count: 12 }), '12 words');
  assert.equal(translate('en', 'wordCountShort', { count: 1 }), '1 word');
  assert.equal(translate('zh', 'wordCountShort', { count: 12 }), '12 个单词');
});
