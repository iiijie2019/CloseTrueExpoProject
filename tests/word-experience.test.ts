import assert from 'node:assert/strict';
import test from 'node:test';
import { morphemeById, searchWords, wordById, words } from '../src/data/lexicon';
import { foundationWords } from '../src/data/lexicon-foundation';
import { dailyLifeWords } from '../src/data/lexicon-daily-life';
import { practicalWords } from '../src/data/lexicon-practical';
import { matchesWordTopic, wordTopics, type WordTopic } from '../src/data/word-topics';
import { morphemeSegments, nextFeaturedWord, sentenceSegments } from '../src/domain/word-display';
import { shouldHintLowVolume } from '../src/domain/volume-hint';

const highlighted = (parts: ReturnType<typeof sentenceSegments>) => parts.filter(part => part.highlighted).map(part => part.text);

test('practical additions have distinct examples and searchable irregular and regional forms', () => {
  const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const examples = new Set(words.filter(word => !practicalWords.includes(word)).map(word => normalized(word.example.en)));
  for (const word of practicalWords) {
    const example = normalized(word.example.en);
    assert.ok(!examples.has(example), `${word.id}: use a distinct example`);
    examples.add(example);
    assert.equal(new Set(word.forms).size, word.forms.length, `${word.id}: avoid duplicated forms`);
    assert.ok(!word.forms.includes(word.spelling), `${word.id}: the base word is already searchable`);
  }
  for (const [form, id] of [['fed', 'feed'], ['thrown', 'throw'], ['frozen', 'freeze'], ['dug', 'dig'], ['hidden', 'hide'], ['sought', 'seek'], ['shaken', 'shake'], ['swung', 'swing'], ['fought', 'fight'], ['blown', 'blow'], ['smelt', 'smell'], ['realised', 'realize'], ['recognised', 'recognize']]) {
    assert.ok(searchWords(form, 'verb').some(word => word.id === id), `${form} should find ${id}`);
  }
  assert.ok(searchWords('shier', 'adjective').some(word => word.id === 'shy'));
  assert.ok(searchWords('mangos', 'noun').some(word => word.id === 'mango'));
});

test('practical topics intersect with Chinese and inflected queries and preserve uncountable nouns', () => {
  for (const [query, topic, id] of [['yoghurt', 'food', 'yogurt'], ['cupboards', 'home', 'cupboard'], ['ferries', 'travel', 'ferry'], ['侄女', 'people', 'niece'], ['receipts', 'work', 'receipt'], ['闪电', 'nature', 'lightning']] as const) {
    assert.ok(searchWords(query, 'noun').some(word => word.id === id && matchesWordTopic(word, topic)), `${query} should find ${id} in ${topic}`);
  }
  for (const id of ['furniture', 'garlic', 'flour', 'cash', 'weather', 'thunder', 'lightning', 'sand']) assert.deepEqual(wordById.get(id)!.forms, []);
  assert.ok(!matchesWordTopic(wordById.get('receipt')!, 'food'));
  assert.ok(searchWords('合同', 'noun').some(word => word.id === 'contract'));
  assert.ok(!searchWords('合同', 'verb').some(word => word.id === 'contract'));
});

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

test('foundation vocabulary adds distinct examples and keeps irregular forms searchable by part of speech', () => {
  const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const oldExamples = new Set(words.filter(word => !foundationWords.includes(word)).map(word => normalized(word.example.en)));
  const additions = new Set<string>();
  for (const word of foundationWords) {
    const example = normalized(word.example.en);
    assert.ok(!oldExamples.has(example) && !additions.has(example), `${word.id}: provide a distinct example`);
    additions.add(example);
    assert.equal(wordById.get(word.id), word);
    assert.equal(new Set(word.forms).size, word.forms.length, `${word.id}: no duplicated forms`);
  }
  for (const [form, id] of [['was', 'be'], ['done', 'do'], ['given', 'give'], ['taken', 'take'], ['begun', 'begin'], ['ran', 'run'], ['swum', 'swim'], ['fallen', 'fall']]) {
    assert.ok(searchWords(form, 'verb').some(word => word.id === id), `${form} should find ${id}`);
  }
  for (const [form, id] of [['teeth', 'tooth'], ['feet', 'foot'], ['women', 'woman'], ['shelves', 'shelf'], ['people', 'person']]) {
    assert.ok(searchWords(form, 'noun').some(word => word.id === id), `${form} should find ${id}`);
  }
  assert.ok(searchWords('better', 'adjective').some(word => word.id === 'good'));
  assert.ok(searchWords('worst', 'adjective').some(word => word.id === 'bad'));
});

test('new noun topics include Chinese and inflected searches while uncountable entries avoid invented plurals', () => {
  assert.ok(searchWords('shelves', 'noun').filter(word => matchesWordTopic(word, 'home')).some(word => word.id === 'shelf'));
  assert.ok(searchWords('牙齿', 'noun').filter(word => matchesWordTopic(word, 'body')).some(word => word.id === 'tooth'));
  assert.ok(matchesWordTopic(wordById.get('banana')!, 'food'));
  assert.ok(matchesWordTopic(wordById.get('passenger')!, 'travel'));
  assert.ok(matchesWordTopic(wordById.get('engineer')!, 'people'));
  assert.ok(matchesWordTopic(wordById.get('grammar')!, 'work'));
  assert.ok(!matchesWordTopic(wordById.get('tooth')!, 'home'));
  for (const id of ['traffic', 'parking', 'health', 'knowledge', 'meat', 'beef', 'pork']) assert.deepEqual(wordById.get(id)!.forms, []);
});

test('daily-life additions keep examples distinct and distinguish shared forms by part of speech', () => {
  const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const examples = new Set(words.filter(word => !dailyLifeWords.includes(word)).map(word => normalized(word.example.en)));
  for (const word of dailyLifeWords) {
    const example = normalized(word.example.en);
    assert.ok(!examples.has(example), `${word.id}: use a distinct example`);
    examples.add(example);
    assert.equal(new Set(word.forms).size, word.forms.length, `${word.id}: avoid duplicated forms`);
  }
  assert.ok(searchWords('leaves', 'noun').some(word => word.id === 'leaf'));
  assert.ok(searchWords('leaves', 'verb').some(word => word.id === 'leave'));
  assert.ok(!searchWords('leaves', 'verb').some(word => word.id === 'leaf'));
  assert.ok(searchWords('better', 'adverb').some(word => word.id === 'well'));
  assert.ok(searchWords('better', 'adjective').some(word => word.id === 'good'));
  for (const [form, id] of [['worn', 'wear'], ['taught', 'teach'], ['caught', 'catch'], ['sold', 'sell'], ['lent', 'lend'], ['meant', 'mean'], ['broke', 'break'], ['drawn', 'draw']]) {
    assert.ok(searchWords(form, 'verb').some(word => word.id === id), `${form} should find ${id}`);
  }
});

test('daily-life topics support variants and plural-only nouns without fabricated forms', () => {
  for (const [query, topic, id] of [['scarves', 'clothing', 'scarf'], ['mice', 'digital', 'mouse'], ['theatre', 'leisure', 'theater'], ['centre', 'places', 'center'], ['café', 'places', 'cafe'], ['动物', 'nature', 'animal']] as const) {
    assert.ok(searchWords(query, 'noun').some(word => word.id === id && matchesWordTopic(word, topic)), `${query} should find ${id} in ${topic}`);
  }
  assert.ok(searchWords('travelled', 'verb').some(word => word.id === 'travel'));
  for (const id of ['clothes', 'jeans', 'trousers', 'shorts', 'sheep', 'software', 'data', 'music', 'chess']) assert.deepEqual(wordById.get(id)!.forms, []);
  assert.ok(!matchesWordTopic(wordById.get('mouse')!, 'clothing'));
});
