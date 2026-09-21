import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Icon } from '@/components/grove/icon';
import { PagedList } from '@/components/grove/paged-list';
import { Button, Chip, Empty, PageHeader, Reveal, SearchBox, T, Tap, Title, ui } from '@/components/grove/ui';
import { WordRow } from '@/components/grove/word-row';
import { searchWords, words } from '@/data/lexicon';
import { matchesWordTopic, wordTopics, type WordTopic } from '@/data/word-topics';
import type { PartOfSpeech, WordStatus } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';

export default function WordsScreen() {
  const params = useLocalSearchParams<{ status?: string; topic?: string }>();
  const { t, data, local, language } = useApp();
  const label = (zh: string, en: string) => language === 'zh' ? zh : en;
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PartOfSpeech | 'all'>('all');
  const [topic, setTopic] = useState<WordTopic | 'all'>(() => Object.hasOwn(wordTopics, params.topic ?? '') ? params.topic as WordTopic : 'all');
  const [filter, setFilter] = useState<WordStatus | 'all'>(() => ['known', 'unknown'].includes(params.status ?? '') ? params.status as WordStatus : 'all');
  const [expanded, setExpanded] = useState(false);
  const results = useMemo(() => searchWords(query, pos).filter(word => matchesWordTopic(word, topic) && (filter === 'all' || (data.records[word.id]?.status ?? 'unknown') === filter)), [query, pos, topic, filter, data.records]);
  const activeFilters = [pos !== 'all' ? t(pos) : '', topic !== 'all' ? local(wordTopics[topic]) : ''].filter(Boolean);
  const reset = () => { setQuery(''); setPos('all'); setTopic('all'); setFilter('all'); };
  return <PagedList narrow items={results} resetKey={JSON.stringify([query, pos, topic, filter])}
    header={<>
      <PageHeader title={t('wordFilter')}/>
      <Reveal>
        <Title small>{label('每一个词，都有新发现', 'A little discovery in every word.')}</Title>
        <T style={{ color: c.muted, fontSize: 13, marginTop: 7, marginBottom: 19 }}>{label(`${words.length} 个单词 · 从声音、例句和词形开始`, `${words.length} words · sounds, examples & word forms`)}</T>
        <SearchBox value={query} onChange={setQuery} placeholder={t('searchPlaceholder')}/>
        <View style={[ui.chips, { marginTop: 15 }]}>{(['all', 'known', 'unknown'] as const).map(value => <Chip key={value} label={t(value)} selected={filter === value} onPress={() => setFilter(value)} icon={value === 'known' ? 'check' : undefined}/>)}</View>
        <View style={[ui.row, { justifyContent: 'space-between', marginTop: 8 }]}>
          <Tap accessibilityState={{ expanded }} onPress={() => setExpanded(value => !value)} style={[ui.row, { gap: 7, minHeight: 46 }]}>
            <Icon name="filter" size={16}/><T style={{ color: c.green, fontSize: 13, fontWeight: '600' }}>{label('词性与主题', 'Types & topics')}{activeFilters.length ? ` · ${activeFilters.length}` : ''}</T>
            <View style={{ transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }}><Icon name="chevron" size={13}/></View>
          </Tap>
          {(!!query || filter !== 'all' || activeFilters.length > 0) && <Tap onPress={reset} style={{ minHeight: 44, paddingHorizontal: 9, justifyContent: 'center' }}><T style={{ fontSize: 12, color: c.muted }}>{t('reset')}</T></Tap>}
        </View>
      </Reveal>
      {expanded && <Reveal style={[ui.card, { marginTop: 3, marginBottom: 15 }]}>
        <T style={[ui.muted, { marginBottom: 10, fontWeight: '600' }]}>{t('wordType')}</T>
        <View style={ui.chips}>{(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map(value => <Chip key={value} label={t(value)} selected={pos === value} onPress={() => setPos(value)}/>)}</View>
        <View style={{ height: 1, backgroundColor: c.line, marginVertical: 16 }}/>
        <T style={[ui.muted, { marginBottom: 10, fontWeight: '600' }]}>{t('topics')}</T>
        <View style={ui.chips}><Chip label={t('all')} selected={topic === 'all'} onPress={() => setTopic('all')}/>{(Object.keys(wordTopics) as WordTopic[]).map(value => <Chip key={value} label={local(wordTopics[value])} selected={topic === value} onPress={() => setTopic(value)}/>)}</View>
      </Reveal>}
      {!expanded && activeFilters.length > 0 && <T style={{ color: c.green, fontSize: 12, marginBottom: 11 }}>{activeFilters.join(' · ')}</T>}
      <T accessibilityLiveRegion="polite" style={{ color: c.muted, fontSize: 12, marginTop: 6, marginBottom: 12 }}>{t('matches', { count: results.length })}</T>
    </>}
    renderItem={({ item }) => <View style={{ backgroundColor: '#FFFFFFDD', paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#E9EEE5', borderRadius: 18, marginBottom: 8 }}><WordRow word={item} last/></View>}
    empty={<Empty message={t('noWords')} detail={t('noWordsSub')} action={<Button secondary onPress={reset}>{t('reset')}</Button>}/>}
  />;
}
