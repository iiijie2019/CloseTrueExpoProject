import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { BrandLogo } from '@/components/grove/brand-logo';
import { Icon } from '@/components/grove/icon';
import { Page, Reveal, Tap, T, Title, ui } from '@/components/grove/ui';
import { WordRow } from '@/components/grove/word-row';
import { morphemes, wordById, words } from '@/data/lexicon';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function MineScreen() {
  const { t, data, notify } = useApp();
  const [aboutOpen, setAboutOpen] = useState(false);
  const recent = data.recent.flatMap(id => { const word = wordById.get(id); return word ? [word] : []; }).slice(0, 5);
  return <Page tabs narrow>
    <Reveal><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, marginBottom: 26 }}><T style={{ fontFamily: serif, fontSize: 21 }}>Word Grove</T><View style={[ui.row, { gap: 6, backgroundColor: '#E9F1E3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }]}><Icon name="shield" size={13}/><T style={{ fontSize: 10, color: c.green }}>{t('localBadge')}</T></View></View>
      <View style={{ marginBottom: 20 }}><BrandLogo size={70}/></View><Title small>{t('profileTitle')}</Title><T style={{ color: c.muted, fontSize: 13, lineHeight: 23, marginTop: 10 }}>{t('profileSub')}</T>
    </Reveal>
    <Reveal delay={80} style={{ marginTop: 28 }}><Tap onPress={() => router.push('/settings')} style={[ui.card, ui.row]}><View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: c.mint, alignItems: 'center', justifyContent: 'center' }}><Icon name="settings"/></View><View style={{ flex: 1 }}><T style={{ fontSize: 16, fontWeight: '600' }}>{t('settings')}</T><T style={{ color: c.muted, fontSize: 12, marginTop: 3 }}>{t('settingsHint')}</T></View><Icon name="chevron" size={17}/></Tap></Reveal>
    {recent.length > 0 && <Reveal delay={120} style={{ marginTop: 28 }}><T style={{ fontSize: 18, fontWeight: '600', marginBottom: 13 }}>{t('recent')}</T><View style={ui.card}>{recent.map((word, index) => <WordRow key={word.id} word={word} last={index === recent.length - 1}/>)}</View></Reveal>}
    <Reveal delay={160} style={{ marginTop: 28 }}><Tap accessibilityState={{ expanded: aboutOpen }} onPress={() => setAboutOpen(value => !value)} style={[ui.card, { backgroundColor: '#EDF3E6' }]}><View style={[ui.row, { gap: 14 }]}><BrandLogo size={38}/><View style={{ flex: 1 }}><T style={{ fontSize: 16, fontWeight: '500' }}>{t('about')}</T><T style={{ fontSize: 10, color: '#8D9B7F', marginTop: 5 }}>{t('aboutSub', { words: words.length, roots: morphemes.length })}</T></View><Icon name={aboutOpen ? 'minus' : 'plus'} size={17}/></View></Tap>
      {aboutOpen && <Reveal style={{ paddingHorizontal: 20, paddingVertical: 10, gap: 13 }}><T style={{ fontSize: 12, color: c.muted, lineHeight: 23 }}>{t('contentNote')}</T><T style={{ fontSize: 11, color: c.muted, lineHeight: 21 }}>{t('aboutSource')}</T><Tap onPress={() => void Linking.openURL('https://morphemelexicon.com/').catch(() => notify(t('sourceUnavailable')))} style={[ui.row, { minHeight: 40 }]}><T style={{ fontSize: 12, color: c.green }}>{t('referenceWebsite')}</T><Icon name="external" size={13}/></Tap></Reveal>}
    </Reveal><T style={{ fontFamily: serif, color: '#A6AD9A', fontSize: 12, textAlign: 'center', marginTop: 30 }}>Word Grove · 1.0</T>
  </Page>;
}
