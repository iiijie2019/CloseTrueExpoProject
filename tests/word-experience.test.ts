import assert from 'node:assert/strict';
import test from 'node:test';
import { morphemeById, wordById, words } from '../src/data/lexicon';
import { matchesWordTopic, wordTopics, type WordTopic } from '../src/data/word-topics';
import { morphemeSegments, nextFeaturedWord, sentenceSegments } from '../src/domain/word-display';
import { shouldHintLowVolume } from '../src/domain/volume-hint';

const highlighted = (parts: ReturnType<typeof sentenceSegments>) => parts.filter(part => part.highlighted).map(part => part.text);

test('example highlighting respects whole words, case, punctuation and inflections', () => {
  assert.deepEqual(highlighted(sentenceSegments('ACT: action, acts, acted, act.', wordById.get('act')!)), ['ACT', 'acts', 'acted', 'act']);
  for (const word of words) {
    const parts = sentenceSegments(word.example.en, word);
    assert.equal(parts.map(part => part.text).join(''), word.example.en);
    assert.ok(parts.some(part => part.highlighted), `${word.id}: example must contain the word or a recorded inflection`);
  }
});

test('morpheme highlighting uses the recorded family and correct affix position', () => {
  const less = morphemeById.get('less')!;
  assert.deepEqual(morphemeSegments(wordById.get('careless')!, [less]), [{ text: 'care', highlighted: false }, { text: 'less', highlighted: true }]);
  assert.deepEqual(highlighted(morphemeSegments(wordById.get('unhappy')!, [morphemeById.get('un')!])), ['un']);
  assert.deepEqual(highlighted(morphemeSegments(wordById.get('visible')!, [morphemeById.get('able')!])), ['ible']);
  assert.deepEqual(highlighted(morphemeSegments(wordById.get('book')!, [less])), []);
  assert.deepEqual(highlighted(morphemeSegments({ ...wordById.get('careless')!, spelling: 'lesscare' }, [less])), []);
  assert.deepEqual(highlighted(morphemeSegments(wordById.get('visibility')!, [morphemeById.get('able')!])), []);
});

test('featured refresh always changes words when another word exists', () => {
  for (const random of [0, 0.5, 0.999]) assert.notEqual(nextFeaturedWord(words, 'empathy', () => random)?.id, 'empathy');
  assert.equal(nextFeaturedWord([], 'empathy'), undefined);
  assert.equal(nextFeaturedWord([wordById.get('empathy')!], 'empathy')?.id, 'empathy');
});

test('topic filters contain real nouns and intersect with search and status independently', () => {
  for (const topic of Object.keys(wordTopics) as WordTopic[]) {
    const matches = words.filter(word => matchesWordTopic(word, topic));
    assert.ok(matches.length >= 8, topic);
    assert.ok(matches.every(word => word.pos.includes('noun')), topic);
  }
  assert.ok(matchesWordTopic(wordById.get('morning')!, 'time'));
  assert.ok(matchesWordTopic(wordById.get('pair')!, 'quantity'));
  assert.ok(matchesWordTopic(wordById.get('rice')!, 'food'));
  assert.ok(matchesWordTopic(wordById.get('dictionary')!, 'everyday'));
  assert.ok(!matchesWordTopic(wordById.get('apple')!, 'time'));
});

test('low-volume hints require a real reading and have a one-minute cooldown', () => {
  for (const value of [null, NaN, -1, 0.2, 0.5, 1]) assert.equal(shouldHintLowVolume(value, null, 1000), false);
  for (const value of [0, 0.1, 0.19]) assert.equal(shouldHintLowVolume(value, null, 1000), true);
  assert.equal(shouldHintLowVolume(0.1, 1000, 60999), false);
  assert.equal(shouldHintLowVolume(0.1, 1000, 61000), true);
});
