import { router } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Icon } from '@/components/grove/icon';
import { Chip, Empty, Page, PageHeader, Reveal, SearchBox, Tap, T, Title, ui } from '@/components/grove/ui';
import { familyWords, morphemes } from '@/data/lexicon';
import type { MorphemeKind } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function RootsScreen() {
  const { t, local } = useApp();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<MorphemeKind | 'all'>('all');
  const wide = useWindowDimensions().width >= 680;
  const filtered = morphemes.filter(root => (kind === 'all' || root.kind === kind) && `${root.label} ${root.meaning.zh} ${root.meaning.en}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <Page><PageHeader title={t('rootStudy')}/><Reveal><Title>{t('rootTitle')}</Title><T style={{ color: c.muted, marginTop: 10, marginBottom: 24 }}>{t('rootSubtitle')}</T><SearchBox value={query} onChange={setQuery} placeholder={t('rootSearch')}/></Reveal>
    <Reveal delay={80} style={[ui.chips, { marginVertical: 22 }]}>{(['all', 'root', 'prefix', 'suffix'] as const).map(value => <Chip key={value} label={t(value === 'all' ? 'allRoots' : value)} selected={kind === value} onPress={() => setKind(value)}/>)}</Reveal>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>{filtered.map((root, index) => <Reveal key={root.id} delay={Math.min(index * 40, 240)} style={{ width: wide ? '48.8%' : '100%', flexGrow: wide ? 1 : 0 }}><Tap onPress={() => router.push({ pathname: '/root/[id]', params: { id: root.id } })} style={[ui.card, { backgroundColor: c[root.color], padding: 23, minHeight: 170 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><T style={{ fontSize: 31, lineHeight: 40, fontFamily: serif, letterSpacing: -0.5 }}>{root.label}</T><View style={{ backgroundColor: '#FFFFFF77', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 3 }}><T style={{ fontSize: 10, color: '#78816E' }}>{t(root.kind)}</T></View></View>
      <T style={{ fontSize: 14, marginTop: 7, color: '#71806A' }}>{local(root.meaning)}</T><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}><T style={{ fontSize: 11, color: '#8B9885' }}>{t('wordCountShort', { count: familyWords(root.id).length })}</T><Icon name="arrow" size={18} color="#7D9675"/></View>
    </Tap></Reveal>)}</View>
    {!filtered.length && <Empty message={t('noWords')} detail={t('noWordsSub')}/>}
  </Page>;
}
