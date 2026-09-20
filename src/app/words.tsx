import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { PagedList } from '@/components/grove/paged-list';
import { Button, Chip, Empty, PageHeader, Reveal, SearchBox, T, Title, ui } from '@/components/grove/ui';
import { WordRow } from '@/components/grove/word-row';
import { searchWords } from '@/data/lexicon';
import { matchesWordTopic, wordTopics, type WordTopic } from '@/data/word-topics';
import type { PartOfSpeech, WordStatus } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';

export default function WordsScreen() {
  const params = useLocalSearchParams<{ status?: string }>();
  const { t, data, local } = useApp();
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PartOfSpeech | 'all'>('all');
  const [topic, setTopic] = useState<WordTopic | 'all'>('all');
  const [filter, setFilter] = useState<WordStatus | 'all'>(() => ['known', 'unknown'].includes(params.status ?? '') ? params.status as WordStatus : 'all');
  const results = useMemo(() => searchWords(query, pos).filter(word => matchesWordTopic(word, topic) && (filter === 'all' || (data.records[word.id]?.status ?? 'unknown') === filter)), [query, pos, topic, filter, data.records]);
  const reset = () => { setQuery(''); setPos('all'); setTopic('all'); setFilter('all'); };
  return <PagedList items={results} resetKey={JSON.stringify([query, pos, topic, filter])}
    header={<>
      <PageHeader title={t('wordFilter')}/><Reveal><Title>{t('filters')}</Title><T style={{ color: c.muted, marginTop: 9, marginBottom: 23 }}>{t('wordFilterSub').replace('\n', ' ')}</T><SearchBox value={query} onChange={setQuery} placeholder={t('searchPlaceholder')}/></Reveal>
      <Reveal delay={90} style={[ui.card, { marginTop: 20, marginBottom: 24 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}><T style={ui.eyebrow}>{t('wordType')}</T><Chip label={t('reset')} onPress={reset}/></View>
        <View style={ui.chips}>{(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map(value => <Chip key={value} label={t(value)} selected={pos === value} onPress={() => setPos(value)}/>)}</View>
        <View style={{ height: 1, backgroundColor: c.line, marginVertical: 16 }}/><T style={[ui.eyebrow, { marginBottom: 12 }]}>{t('topics')}</T>
        <View style={ui.chips}><Chip label={t('all')} selected={topic === 'all'} onPress={() => setTopic('all')}/>{(Object.keys(wordTopics) as WordTopic[]).map(value => <Chip key={value} label={local(wordTopics[value])} selected={topic === value} onPress={() => setTopic(value)}/>)}</View>
        <View style={{ height: 1, backgroundColor: c.line, marginVertical: 16 }}/><T style={[ui.eyebrow, { marginBottom: 12 }]}>{t('learningStatus')}</T>
        <View style={ui.chips}>{(['all', 'known', 'unknown'] as const).map(value => <Chip key={value} label={t(value)} selected={filter === value} onPress={() => setFilter(value)} icon={value === 'known' ? 'check' : undefined}/>)}</View>
      </Reveal><T accessibilityLiveRegion="polite" style={{ color: c.muted, fontSize: 12, marginBottom: 8 }}>{t('matches', { count: results.length })}</T>
    </>}
    renderItem={({ item }) => <View style={{ backgroundColor: '#FFFFFF99', paddingHorizontal: 18 }}><WordRow word={item}/></View>}
    empty={<Empty message={t('noWords')} detail={t('noWordsSub')} action={<Button secondary onPress={reset}>{t('reset')}</Button>}/>}
  />;
}
