import { useState } from 'react';
import { BrandLogo } from '@/components/grove/brand-logo';
import { nextFeaturedWord } from '@/domain/word-display';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GroveIllustration, WordIllustration } from '@/components/grove/illustrations';
import { Icon } from '@/components/grove/icon';
import { Page, Reveal, SectionLabel, Tap, T, Title, ui } from '@/components/grove/ui';
import { AudioButton, StatusBadge, WordRow, posAbbreviation } from '@/components/grove/word-row';
import { morphemes, wordById, words } from '@/data/lexicon';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function HomeScreen() {
  const { t, local, data, language, stop } = useApp();
  const wide = useWindowDimensions().width >= 680;
  const records = Object.values(data.records).filter(record => wordById.has(record.wordId));
  const known = records.filter(record => record.status === 'known').length;
  const unknown = words.length - known;
  const recent = data.recent.map(id => wordById.get(id)).filter(word => !!word).slice(0, 3);
  const [featured, setFeatured] = useState(() => wordById.get('empathy')!);
  const refreshFeatured = () => { stop(); setFeatured(old => nextFeaturedWord(words, old.id)!); };
  return <Page tabs>
    <Reveal><View style={s.brandRow}><View style={ui.row}><BrandLogo size={43}/><View><T style={{ fontFamily: serif, fontSize: 21, fontWeight: '600', letterSpacing: -0.4 }}>Word Grove</T><T style={{ fontSize: 10, letterSpacing: 2.5, color: c.muted, lineHeight: 15 }}>{language === 'zh' ? '词 间 · 慢 慢 生 长' : 'GROW AT YOUR OWN PACE'}</T></View></View><View style={s.offline}><View style={s.dot}/><T style={{ fontSize: 10, color: c.green }}>{t('offline')}</T></View></View></Reveal>

    <View style={[s.hero, !wide && { paddingTop: 32, paddingBottom: 28 }]}>
      <Reveal delay={80} style={{ flex: 1, gap: 14 }}><T style={ui.eyebrow}>{t('learning')}</T><Title>{t('hello')}</Title><T style={{ color: c.muted, fontSize: 14, lineHeight: 24, maxWidth: 445 }}>{t('welcome')}</T></Reveal>
      {wide && <Reveal delay={180}><GroveIllustration size={255}/></Reveal>}
    </View>

    <View style={s.stats}>
      <Reveal delay={130} style={{ flex: 1 }}><Tap onPress={() => router.push({ pathname: '/words', params: { status: 'known' } })} style={[s.stat, { backgroundColor: '#E7F1E2' }]}><View style={s.statTop}><View style={[s.statIcon, { backgroundColor: '#D5E6CF' }]}><Icon name="check" size={19}/></View><Icon name="arrow" size={16} color="#83A078"/></View><T style={s.statNumber}>{known.toLocaleString()}</T><T style={{ fontSize: 12, color: '#698062' }}>{t('knownWords')}</T></Tap></Reveal>
      <Reveal delay={190} style={{ flex: 1 }}><Tap onPress={() => router.push({ pathname: '/words', params: { status: 'unknown' } })} style={[s.stat, { backgroundColor: '#F8ECDD' }]}><View style={s.statTop}><View style={[s.statIcon, { backgroundColor: '#F0DFC7' }]}><Icon name="book" size={18} color={c.orange}/></View><Icon name="arrow" size={16} color="#BC9C75"/></View><T style={[s.statNumber, { color: '#896846' }]}>{unknown.toLocaleString()}</T><T style={{ fontSize: 12, color: '#A08664' }}>{t('unknownWords')}</T></Tap></Reveal>
    </View>

    <Reveal delay={220} style={{ marginTop: 34 }}><SectionLabel title={t('explore')} subtitle={t('exploreSub')}/></Reveal>
    {!wide ? <View style={{ flexDirection: 'row', gap: 12 }}>
      <Reveal delay={250} style={{ flex: 1 }}><Tap onPress={() => router.push('/words')} style={[s.smallEntry, { backgroundColor: '#F9EDDE' }]}><View style={{ height: 84, marginLeft: -9 }}><WordIllustration/></View><T style={{ fontSize: 18, fontWeight: '600', lineHeight: 27 }}>{t('exploreWords')}</T><T style={{ fontSize: 11, color: '#927957', marginTop: 6 }}>{t('wordType')} · {t('learningStatus')}</T><View style={{ alignItems: 'flex-end', marginTop: 12 }}><Icon name="arrow" size={18} color="#A38257"/></View></Tap></Reveal>
      <Reveal delay={310} style={{ flex: 1 }}><Tap onPress={() => router.push('/roots')} style={[s.smallEntry, { backgroundColor: '#E4EFDF' }]}><View style={{ height: 84, marginTop: 0 }}><GroveIllustration size={115}/></View><T style={{ fontSize: 18, fontWeight: '600', lineHeight: 27 }}>{t('rootEntry')}</T><T style={{ fontSize: 11, color: '#758969', marginTop: 6 }}>{morphemes.length} {t('rootsUnit')}</T><View style={{ alignItems: 'flex-end', marginTop: 12 }}><Icon name="arrow" size={18}/></View></Tap></Reveal>
    </View> : <View style={{ flexDirection: 'row', gap: 16 }}>
      <Reveal delay={260} style={{ flex: 1 }}><Tap onPress={() => router.push('/words')} style={{ flex: 1 }}><LinearGradient colors={['#FBF2E7', '#F9ECDA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.exploreCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View style={{ flex: 1, gap: 9 }}><View style={[s.miniIcon, { backgroundColor: '#F0DEC5' }]}><Icon name="filter" size={18} color="#A37B50"/></View><T style={{ fontSize: 22, fontWeight: '600', letterSpacing: -0.5 }}>{t('wordFilter')}</T></View><WordIllustration/></View>
        <T style={{ color: '#9A8368', fontSize: 13, lineHeight: 23 }}>{t('wordFilterSub')}</T><View style={s.cardFooter}><T style={{ color: '#956A43', fontSize: 13, fontWeight: '600' }}>{t('exploreWords')}</T><View style={s.arrowCircle}><Icon name="arrow" size={18} color="#A67F54"/></View></View>
      </LinearGradient></Tap></Reveal>
      <Reveal delay={320} style={{ flex: 1 }}><Tap onPress={() => router.push('/roots')} style={{ flex: 1 }}><LinearGradient colors={['#E8F1E7', '#DFEBDD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.exploreCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 104 }}><View style={{ flex: 1, gap: 9 }}><View style={[s.miniIcon, { backgroundColor: '#D2E4CD' }]}><Icon name="tree" size={18}/></View><T style={{ fontSize: 22, fontWeight: '600', letterSpacing: -0.5 }}>{t('rootStudy')}</T></View><View style={{ width: 120, alignItems: 'center' }}><GroveIllustration size={140}/></View></View>
        <T style={{ color: '#758D71', fontSize: 13, lineHeight: 23 }}>{t('rootStudySub')}</T><View style={s.cardFooter}><T style={{ color: c.green, fontSize: 13, fontWeight: '600' }}>{t('exploreRoots')}</T><View style={s.arrowCircle}><Icon name="arrow" size={18}/></View></View>
      </LinearGradient></Tap></Reveal>
    </View>}

    <Reveal delay={350} style={{ marginTop: 16 }}><Tap onPress={() => router.push('/sentences')} style={[ui.card, { backgroundColor: '#EEEDF6', borderColor: '#FFFFFFA0', flexDirection: 'row', gap: 17, alignItems: 'center', paddingHorizontal: 22, paddingVertical: 11 }]}><View style={{ width: 45, height: 51, borderRadius: 15, backgroundColor: '#E0DBED', alignItems: 'center', justifyContent: 'center' }}><Icon name="book" color="#8A7B9F" size={23}/></View><View style={{ flex: 1 }}><T style={{ fontSize: wide ? 20 : 17, lineHeight: 27, fontWeight: '600', color: '#62576F' }}>{t('sentenceTitle')}</T><T style={{ fontSize: 12, lineHeight: 21, color: '#968AA1', marginTop: 5 }}>{t('sentenceSubtitle')}</T></View><Icon name="arrow" color="#91829F" size={18}/></Tap></Reveal>

    <Reveal delay={360} style={{ marginTop: 26 }}><View style={[ui.card, { backgroundColor: '#FFFDF8', paddingHorizontal: wide ? 28 : 24, paddingVertical: wide ? 14 : 12 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 }}><View style={ui.row}><Icon name="spark" size={15} color="#B49B6E"/><T style={[ui.eyebrow, { color: '#A99471', letterSpacing: 1.7 }]}>{t('handpicked')}</T></View><Tap onPress={refreshFeatured} accessibilityLabel={t('refreshWord')} style={[ui.row, { gap: 5, minHeight: 40, paddingHorizontal: 8 }]}><Icon name="refresh" size={15}/><T style={{ color: c.green, fontSize: 12 }}>{t('refreshWord')}</T></Tap></View>
      <View style={[ui.row, { alignItems: 'flex-start' }]}><Tap onPress={() => router.push({ pathname: '/word/[id]', params: { id: featured.id } })} style={{ flex: 1 }}><T style={{ fontSize: featured.spelling.length > 12 ? 28 : 37, lineHeight: 46, fontFamily: serif, letterSpacing: -0.8 }}>{featured.spelling}</T><T style={{ color: '#A1A497', fontSize: 13, marginTop: 2 }}>/ {featured.ipa} /  ·  {featured.pos.map(pos => posAbbreviation[pos]).join(' / ')}</T></Tap><AudioButton text={featured.spelling}/></View>
      <View style={[ui.row, { justifyContent: 'space-between', marginTop: 12 }]}><T style={{ fontSize: 15, flex: 1 }}>{local(featured.meaning)}</T><StatusBadge word={featured}/></View><T style={{ fontSize: 13, color: c.muted, marginTop: 5 }}>{local(featured.example)}</T>
      <View style={{ height: 1, backgroundColor: '#EFEDE3', marginVertical: 20 }}/><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><View style={[ui.row, { flex: 1 }]}><T style={{ fontFamily: serif, fontStyle: 'italic', color: '#9A947D', fontSize: 16 }}>{featured.parts.join(' + ')}</T></View><Tap onPress={() => router.push({ pathname: '/word/[id]', params: { id: featured.id } })} style={ui.row}><T style={{ fontSize: 12, color: c.green }}>{t('discover')}</T><Icon name="arrow" size={16}/></Tap></View>
    </View></Reveal>
    {recent.length > 0 && <Reveal style={{ marginTop: 29 }}><SectionLabel title={t('recent')}/><View style={ui.card}>{recent.map((word, index) => <WordRow key={word.id} word={word} last={index === recent.length - 1}/>)}</View></Reveal>}
    <View style={{ alignItems: 'center', marginTop: 34, gap: 6 }}><Icon name="leaf" color="#A6B59E" size={17}/><T style={{ fontSize: 11, color: '#9CA695' }}>{t('startHint')}</T><T style={{ fontSize: 10, color: '#ADB5A6', letterSpacing: 0.5 }}>{words.length} {t('wordsUnit')} · {morphemes.length} {t('rootsUnit')}</T></View>
  </Page>;
}
const s = StyleSheet.create({
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 10 },
  offline: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingVertical: 7, paddingHorizontal: 10, backgroundColor: '#E8F0E3', borderRadius: 20 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#7C9B68' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 21, paddingBottom: 13 },
  stats: { flexDirection: 'row', gap: 14 },
  stat: { borderRadius: 22, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#FFFFFFA0' },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontFamily: serif, fontSize: 45, lineHeight: 55, color: '#416345', marginTop: 12 },
  exploreCard: { flex: 1, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, borderWidth: 1, borderColor: '#FFFFFFB0', gap: 8, overflow: 'hidden' },
  miniIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  smallEntry: { borderRadius: 23, paddingHorizontal: 18, paddingVertical: 9, flex: 1, minHeight: 212, borderWidth: 1, borderColor: '#FFFFFFB0', overflow: 'hidden' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  arrowCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF75', alignItems: 'center', justifyContent: 'center' },
});
