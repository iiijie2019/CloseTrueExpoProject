import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HighlightedWord } from '@/components/grove/highlighted-word';
import { PageProgress } from '@/components/grove/paged-list';
import { usePagedItems } from '@/hooks/use-paged-items';
import { Icon } from '@/components/grove/icon';
import { Button, Chip, Empty, Page, PageHeader, Reveal, SectionLabel, Tap, T, ui } from '@/components/grove/ui';
import { StatusBadge, WordRow, posAbbreviation } from '@/components/grove/word-row';
import { familyWords, morphemeById } from '@/data/lexicon';
import type { PartOfSpeech, WordStatus } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function RootScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, local, status } = useApp();
  const [mode, setMode] = useState<'tree' | 'list'>('tree');
  const [filter, setFilter] = useState<WordStatus | 'all'>('all');
  const [closed, setClosed] = useState<PartOfSpeech[]>([]);
  const root = morphemeById.get(id);
  const allWords = familyWords(id);
  const visible = allWords.filter(word => filter === 'all' || status(word.id) === filter);
  const page = usePagedItems(visible, `${id}:${filter}:${mode}`);
  if (!root) return <Page><PageHeader title={t('rootStudy')}/><Empty message={t('notFoundRoot')} action={<Button onPress={() => router.replace('/')}>{t('goHome')}</Button>}/></Page>;
  const known = allWords.filter(word => status(word.id) === 'known').length;
  const branches = (['noun', 'verb', 'adjective', 'adverb'] as const).filter(pos => page.items.some(word => word.pos.includes(pos)));
  const toggle = (pos: PartOfSpeech) => setClosed(old => old.includes(pos) ? old.filter(p => p !== pos) : [...old, pos]);
  return <Page narrow onEndReached={page.hasMore ? page.loadMore : undefined}><PageHeader title={t(root.kind)}/>
    <Reveal style={[ui.card, { backgroundColor: c[root.color], paddingHorizontal: 28, paddingVertical: 14 }]}>
      <View style={ui.row}><Icon name="tree" size={17}/><T style={[ui.eyebrow, { color: '#75896A' }]}>{t(root.kind)}</T></View>
      <T style={{ fontFamily: serif, fontSize: 55, lineHeight: 69, letterSpacing: -1, marginTop: 14 }}>{root.label}</T><T style={{ fontSize: 20, lineHeight: 30, color: '#657A59' }}>{local(root.meaning)}</T>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 26, alignItems: 'center' }}><T style={{ fontSize: 12, color: '#7F9074' }}>{t('familyCount', { count: allWords.length })}</T><View style={ui.row}><Icon name="check" size={14}/><T style={{ color: c.green, fontSize: 12 }}>{known} / {allWords.length}</T></View></View>
      <View style={{ height: 4, borderRadius: 4, backgroundColor: '#FFFFFF80', marginTop: 10 }}><View style={{ height: 4, width: `${known / allWords.length * 100}%`, backgroundColor: '#78956D', borderRadius: 4 }}/></View>
    </Reveal>
    <Reveal delay={70} style={{ marginVertical: 25 }}><T style={[ui.eyebrow, { marginBottom: 7 }]}>{t('origin')}</T><T style={{ fontSize: 14, fontWeight: '600', marginBottom: 6 }}>{local(root.origin)}</T><T style={{ color: c.muted, fontSize: 13, lineHeight: 23 }}>{local(root.description)}</T></Reveal>
    <SectionLabel title={t('familyTree')} right={<View style={ui.row}><Chip label={t('tree')} icon="tree" selected={mode === 'tree'} onPress={() => setMode('tree')}/><Chip label={t('list')} icon="book" selected={mode === 'list'} onPress={() => setMode('list')}/></View>}/>
    <View style={[ui.chips, { marginBottom: 20 }]}>{(['all', 'known', 'unknown'] as const).map(value => <Chip key={value} label={t(value)} selected={filter === value} onPress={() => setFilter(value)}/>)}</View>
    {visible.length === 0 ? <Empty message={t('noWords')} detail={t('noWordsSub')}/> : mode === 'list' ? <Reveal key="list" style={ui.card}>{page.items.map((word, i) => <WordRow word={word} morphemeId={root.id} key={word.id} last={i === page.items.length - 1}/>)}</Reveal> : <Reveal key="tree">
      <T style={[ui.muted, { marginBottom: 20 }]}>{t('treeHint')}</T>
      <View style={s.treeRoot}><Icon name="leaf" size={19} color="#FFF"/><T style={{ fontFamily: serif, color: '#FFF', fontSize: 24 }}>{root.label}</T></View>
      <View style={{ marginLeft: 24 }}>{branches.map(pos => {
        const open = !closed.includes(pos);
        const members = page.items.filter(word => word.pos.includes(pos));
        return <View key={pos} style={s.branch}>
          <View style={s.branchLine}/>
          <Tap accessibilityState={{ expanded: open }} onPress={() => toggle(pos)} style={s.branchHeading}><View style={ui.row}><View style={s.posBadge}><T style={{ color: c.green, fontFamily: serif, fontSize: 17 }}>{posAbbreviation[pos]}</T></View><T style={{ fontWeight: '600', fontSize: 14 }}>{t(pos)}</T><T style={{ fontSize: 11, color: c.muted }}>{members.length}</T></View><Icon name={open ? 'minus' : 'plus'} size={17}/></Tap>
          {open && <Reveal style={{ marginLeft: 18, paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#DDE5D5', marginTop: 3 }}>{members.map(word => <View key={word.id} style={s.leaf}>
            <View style={{ position: 'absolute', left: -17, top: 33, width: 16, borderTopWidth: 1, borderColor: '#DDE5D5' }}/>
            <View style={{ flex: 1, gap: 5 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><Tap onPress={() => router.push({ pathname: '/word/[id]', params: { id: word.id } })}><HighlightedWord word={word} morphemeId={root.id} style={{ fontFamily: serif, fontSize: 23, lineHeight: 30 }}/></Tap><StatusBadge word={word}/></View><Tap onPress={() => router.push({ pathname: '/word/[id]', params: { id: word.id } })}><T style={{ color: c.muted, fontSize: 12 }} numberOfLines={2}>{local(word.meaning)}</T></Tap></View><Tap accessibilityLabel={word.spelling} onPress={() => router.push({ pathname: '/word/[id]', params: { id: word.id } })} style={{ paddingVertical: 12 }}><Icon name="chevron" size={15} color="#9AAB8F"/></Tap>
          </View>)}</Reveal>}
        </View>;
      })}</View><T style={{ color: '#98A18E', fontSize: 11, lineHeight: 19, marginTop: 22, textAlign: 'center' }}>{t('familyNote')}</T>
    </Reveal>}
    <PageProgress shown={page.items.length} total={visible.length} loadMore={page.hasMore ? page.loadMore : undefined}/>
  </Page>;
}
const s = StyleSheet.create({
  treeRoot: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'flex-start', backgroundColor: '#658461', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 17 },
  branch: { borderLeftWidth: 2, borderLeftColor: '#D3DECB', paddingLeft: 22, paddingTop: 21 },
  branchLine: { position: 'absolute', top: 47, left: 0, width: 22, borderTopWidth: 2, borderTopColor: '#D3DECB' },
  branchHeading: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: '#EDF3E8', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 8 },
  posBadge: { width: 36, height: 31, borderRadius: 9, backgroundColor: '#DFEAD7', alignItems: 'center', justifyContent: 'center' },
  leaf: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECF0E5', paddingHorizontal: 16, paddingVertical: 8, marginTop: 11 },
});
