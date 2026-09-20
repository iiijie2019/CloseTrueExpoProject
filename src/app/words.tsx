import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Chip, Empty, PageHeader, Reveal, SearchBox, T, Title, ui } from '@/components/grove/ui';
import { WordRow } from '@/components/grove/word-row';
import { searchWords } from '@/data/lexicon';
import type { PartOfSpeech, WordStatus } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';

export default function WordsScreen() {
  const params = useLocalSearchParams<{ status?: string; scope?: string }>();
  const { t, data } = useApp();
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PartOfSpeech | 'all'>('all');
  const [filter, setFilter] = useState<WordStatus | 'all'>(() => ['known', 'unknown', 'focus'].includes(params.status ?? '') ? params.status as WordStatus : 'all');
  const insets = useSafeAreaInsets();
  const personal = params.scope === 'marked';
  const results = useMemo(() => searchWords(query, pos).filter(word => (!personal || !!data.records[word.id]) && (filter === 'all' || (data.records[word.id]?.status ?? 'unknown') === filter)), [query, pos, filter, data.records, personal]);
  const reset = () => { setQuery(''); setPos('all'); setFilter('all'); };
  return <View style={{ flex: 1, backgroundColor: c.background }}><FlatList data={results} keyExtractor={word => word.id} keyboardShouldPersistTaps="handled" contentContainerStyle={{ width: '100%', maxWidth: 880, alignSelf: 'center', paddingHorizontal: 24, paddingTop: Math.max(insets.top, 18), paddingBottom: 35 + insets.bottom }}
    ListHeaderComponent={<>
      <PageHeader title={t(personal ? 'yourCollection' : 'wordFilter')}/><Reveal><Title>{t('filters')}</Title><T style={{ color: c.muted, marginTop: 9, marginBottom: 23 }}>{t('wordFilterSub').replace('\n', ' ')}</T><SearchBox value={query} onChange={setQuery} placeholder={t('searchPlaceholder')}/></Reveal>
      <Reveal delay={90} style={[ui.card, { marginTop: 20, marginBottom: 24 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}><T style={ui.eyebrow}>{t('wordType')}</T><Chip label={t('reset')} onPress={reset}/></View>
        <View style={ui.chips}>{(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map(value => <Chip key={value} label={t(value)} selected={pos === value} onPress={() => setPos(value)}/>)}</View>
        <View style={{ height: 1, backgroundColor: c.line, marginVertical: 20 }}/><T style={[ui.eyebrow, { marginBottom: 13 }]}>{t('learningStatus')}</T>
        <View style={ui.chips}>{(['all', 'known', 'unknown', 'focus'] as const).map(value => <Chip key={value} label={t(value)} selected={filter === value} onPress={() => setFilter(value)} icon={value === 'known' ? 'check' : value === 'focus' ? 'star' : undefined} tint={value === 'focus' ? 'orange' : 'green'}/>)}</View>
      </Reveal><T accessibilityLiveRegion="polite" style={{ color: c.muted, fontSize: 12, marginBottom: 8 }}>{t('matches', { count: results.length })}</T>
    </>}
    renderItem={({ item }) => <View style={{ backgroundColor: '#FFFFFF99', paddingHorizontal: 18 }}><WordRow word={item}/></View>}
    ListEmptyComponent={<Empty message={t('noWords')} detail={t('noWordsSub')} action={<Button secondary onPress={reset}>{t('reset')}</Button>}/>}
  /></View>;
}
