import type { Localized, Word } from '@/domain/models';
import { scenarioGroups } from './lexicon-scenarios';
import { foundationGroups } from './lexicon-foundation';

export const wordTopics = {
  time: { zh: '时间类名词', en: 'Time nouns' },
  quantity: { zh: '数量类名词', en: 'Quantity nouns' },
  food: { zh: '食物相关名词', en: 'Food nouns' },
  everyday: { zh: '日常常见物品', en: 'Everyday objects' },
  people: { zh: '人物与关系', en: 'People & relationships' },
  nature: { zh: '自然与天气', en: 'Nature & weather' },
  travel: { zh: '交通与旅行', en: 'Travel & transport' },
  work: { zh: '学习与工作', en: 'Study & work' },
  home: { zh: '家居与房间', en: 'Home & rooms' },
  body: { zh: '身体与健康', en: 'Body & health' },
} satisfies Record<string, Localized>;
export type WordTopic = keyof typeof wordTopics;

const related: Record<WordTopic, readonly string[]> = {
  time: ['time', 'day', 'week', 'month', 'year', 'hour', 'minute', 'morning'],
  quantity: ['number', 'amount', 'quantity', 'pair', 'dozen', 'half', 'total', 'percent'],
  food: ['apple', 'bread', 'rice', 'milk', 'egg', 'cheese', 'soup', 'potato'],
  everyday: ['book', 'cup', 'key', 'bag', 'chair', 'table', 'pen', 'bottle', 'telephone', 'microphone', 'dictionary', 'projector', 'telescope', 'television', 'microscope', 'microchip', 'equipment', 'photo'],
  people: ['family', 'friend', 'teacher', 'student', 'parent', 'child', 'neighbor', 'sister', 'visitor', 'audience', 'spectator', 'biologist', 'photographer', 'geologist'],
  nature: ['sun', 'moon', 'rain', 'wind', 'tree', 'river', 'flower', 'snow', 'microorganism'],
  travel: [],
  work: [],
  home: [],
  body: [],
};
const topicIds = Object.fromEntries((Object.keys(wordTopics) as WordTopic[]).map(topic => [topic, new Set([
  ...related[topic], ...(topic in scenarioGroups ? scenarioGroups[topic as keyof typeof scenarioGroups].map(word => word.id) : []),
  ...(topic in foundationGroups ? foundationGroups[topic as keyof typeof foundationGroups].map(word => word.id) : []),
])])) as Record<WordTopic, Set<string>>;
export const matchesWordTopic = (word: Word, topic: WordTopic | 'all') => topic === 'all' || topicIds[topic].has(word.id);
