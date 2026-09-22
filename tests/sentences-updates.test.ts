import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { formatSentence, matchSentenceOrder, sentenceById, sentences, sentenceRoles, shuffledChunks } from '../src/data/sentences';
import { morphemes, searchWords, wordById, words } from '../src/data/lexicon';
import { decodeBackup, encodeBackup } from '../src/domain/backup';
import { emptyData } from '../src/domain/models';
import { prepareUpdate, restartWithSavedData } from '../src/domain/update-flow';

test('expanded collection keeps stable IDs, populated families and new inflection searches', () => {
  assert.ok(words.length >= 600);
  assert.equal(new Set(morphemes.map(root => root.id)).size, morphemes.length);
  for (const id of ['action', 'active', 'activity', 'empathy']) assert.equal(wordById.get(id)?.spelling, id);
  assert.ok(searchWords('photographed', 'verb').some(word => word.id === 'photograph'));
  assert.ok(searchWords('自动化').some(word => word.id === 'automation'));
  assert.ok(searchWords('', 'adverb').length >= 10);
  const old = { ...emptyData(), records: { action: { wordId: 'action', spelling: 'action', status: 'known' as const, updatedAt: '2026-09-20T01:00:00Z' } } };
  const envelope = JSON.parse(encodeBackup(old)); envelope.dictionaryVersion = 'starter-1';
  assert.equal(decodeBackup(JSON.stringify(envelope)).data.records.action.status, 'known');
});
test('every lesson order contains each phrase exactly once and has bilingual explanations', () => {
  assert.ok(sentences.length >= 30);
  assert.equal(new Set(sentences.map(lesson => lesson.id)).size, sentences.length);
  for (const lesson of sentences) {
    const ids = lesson.chunks.map(chunk => chunk.id).sort();
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(lesson.orders.length && lesson.title.en && lesson.title.zh && lesson.tip.en && lesson.tip.zh);
    for (const chunk of lesson.chunks) assert.ok(sentenceRoles[chunk.role] && chunk.meaning.zh && chunk.meaning.en && chunk.explanation.zh && chunk.explanation.en);
    for (const order of lesson.orders) {
      assert.deepEqual([...order.ids].sort(), ids);
      assert.ok(!order.commaAfter || ids.includes(order.commaAfter));
      assert.equal(matchSentenceOrder(lesson, order.ids), order);
    }
  }
});
test('polite requests and fronted conditions keep their own punctuation in lists and practice', () => {
  assert.equal(formatSentence(sentenceById.get('coffee-request')!), 'Could I have a cup of coffee, please?');
  assert.equal(formatSentence(sentenceById.get('repeat-slowly')!), 'Could you repeat that slowly, please?');
  const conditional = sentenceById.get('if-it-rains')!;
  assert.equal(formatSentence(conditional), 'If it rains, we will stay at home.');
  assert.equal(formatSentence(conditional, ['s', 'v', 'p', 'cond']), 'We will stay at home if it rains.');
  const reason = sentenceById.get('because-rain')!;
  assert.equal(formatSentence(reason, ['r', 's', 'v', 'p']), 'Because it was raining, we stayed at home.');
});
test('everyday irregular forms remain searchable and point to their base entries', () => {
  for (const [form, id] of [['brought', 'bring'], ['written', 'write'], ['chosen', 'choose'], ['drank', 'drink'], ['went', 'go']]) {
    assert.ok(searchWords(form, 'verb').some(word => word.id === id), `${form} should find ${id}`);
  }
  assert.ok(searchWords('行李', 'noun').some(word => word.id === 'luggage'));
  assert.equal(wordById.get('luggage')!.forms.length, 0);
  assert.equal(wordById.get('homework')!.forms.length, 0);
});
test('practice accepts fronted time, formats commas and rejects incomplete or repeated chunks', () => {
  const lesson = sentenceById.get('evening-reading')!;
  const alternative = matchSentenceOrder(lesson, ['t', 's', 'v', 'o'])!;
  assert.equal(formatSentence(lesson, alternative.ids, alternative.commaAfter), 'Every evening, I read books.');
  assert.equal(formatSentence(sentenceById.get('where-live')!), 'Where do you live?');
  assert.equal(matchSentenceOrder(lesson, ['s', 'v']), undefined);
  assert.equal(matchSentenceOrder(lesson, ['s', 'v', 'o', 'o']), undefined);
  assert.equal(matchSentenceOrder(lesson, ['v', 'o', 's', 't']), undefined);
});
test('shuffle keeps every phrase and never starts with an accepted answer', () => {
  for (const lesson of sentences) for (const value of [0, 0.25, 0.5, 0.99]) {
    const shuffled = shuffledChunks(lesson, () => value);
    assert.deepEqual([...shuffled].sort(), lesson.chunks.map(chunk => chunk.id).sort());
    assert.equal(matchSentenceOrder(lesson, shuffled), undefined);
  }
});
test('update flow skips downloads when current and prepares both new updates and rollbacks', async () => {
  let downloads = 0;
  const fetch = async () => { downloads++; return { isNew: true, isRollBackToEmbedded: false }; };
  assert.equal(await prepareUpdate({ checkForUpdateAsync: async () => ({ isAvailable: false, isRollBackToEmbedded: false }), fetchUpdateAsync: fetch }), 'current');
  assert.equal(downloads, 0);
  assert.equal(await prepareUpdate({ checkForUpdateAsync: async () => ({ isAvailable: true, isRollBackToEmbedded: false }), fetchUpdateAsync: fetch }), 'ready');
  assert.equal(downloads, 1);
  assert.equal(await prepareUpdate({ checkForUpdateAsync: async () => ({ isAvailable: false, isRollBackToEmbedded: true }), fetchUpdateAsync: async () => ({ isNew: false, isRollBackToEmbedded: true }) }), 'ready');
});
test('network/download failures remain retryable and unsuccessful fetches do not request restart', async () => {
  await assert.rejects(prepareUpdate({ checkForUpdateAsync: async () => { throw new Error('offline'); }, fetchUpdateAsync: async () => { throw new Error('should not run'); } }), /offline/);
  const available = async () => ({ isAvailable: true, isRollBackToEmbedded: false });
  await assert.rejects(prepareUpdate({ checkForUpdateAsync: available, fetchUpdateAsync: async () => { throw new Error('network interrupted'); } }), /network interrupted/);
  await assert.rejects(prepareUpdate({ checkForUpdateAsync: available, fetchUpdateAsync: async () => ({ isNew: false, isRollBackToEmbedded: false }) }), /not downloaded/);
});
test('restarting waits for saved learning records and cancels if saving fails', async () => {
  const events: string[] = [];
  let finishSaving!: () => void;
  const saving = new Promise<void>(resolve => { finishSaving = resolve; });
  const restart = restartWithSavedData(async () => { await saving; events.push('saved'); }, async () => { events.push('reloaded'); });
  assert.equal(events.length, 0);
  finishSaving(); await restart;
  assert.deepEqual(events, ['saved', 'reloaded']);
  await assert.rejects(restartWithSavedData(async () => { throw new Error('disk full'); }, async () => { events.push('unexpected reload'); }), /disk full/);
  assert.deepEqual(events, ['saved', 'reloaded']);
});
test('update endpoint and build channels match the linked EAS project', () => {
  const { expo } = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'));
  const eas = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'));
  assert.equal(expo.updates.url, `https://u.expo.dev/${expo.extra.eas.projectId}`);
  assert.equal(expo.runtimeVersion.policy, 'fingerprint');
  for (const profile of ['preview', 'production']) {
    assert.equal(eas.build[profile].channel, profile);
    assert.equal(eas.build[profile].environment, profile);
  }
});
