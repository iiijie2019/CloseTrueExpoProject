import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GroveIllustration, WordIllustration } from '@/components/grove/illustrations';
import { Icon } from '@/components/grove/icon';
import { Page, Reveal, SectionLabel, Tap, T, Title, ui } from '@/components/grove/ui';
import { AudioButton, WordRow } from '@/components/grove/word-row';
import { morphemes, wordById, words } from '@/data/lexicon';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function HomeScreen() {
  const { t, local, data, language } = useApp();
  const wide = useWindowDimensions().width >= 680;
  const records = Object.values(data.records).filter(record => wordById.has(record.wordId));
  const known = records.filter(record => record.status === 'known').length;
  const focus = records.filter(record => record.status === 'focus').length;
  const recent = data.recent.map(id => wordById.get(id)).filter(word => !!word).slice(0, 3);
  const featured = wordById.get('empathy')!;
  return <Page tabs>
    <Reveal><View style={s.brandRow}><View style={ui.row}><View style={s.logo}><Icon name="leaf" color="#F9FFF2" size={23}/></View><View><T style={{ fontFamily: serif, fontSize: 21, fontWeight: '600', letterSpacing: -0.4 }}>Word Grove</T><T style={{ fontSize: 10, letterSpacing: 2.5, color: c.muted, lineHeight: 15 }}>{language === 'zh' ? '词 间 · 慢 慢 生 长' : 'GROW AT YOUR OWN PACE'}</T></View></View><View style={s.offline}><View style={s.dot}/><T style={{ fontSize: 10, color: c.green }}>{t('offline')}</T></View></View></Reveal>

    <View style={[s.hero, !wide && { paddingTop: 32, paddingBottom: 28 }]}>
      <Reveal delay={80} style={{ flex: 1, gap: 14 }}><T style={ui.eyebrow}>{t('learning')}</T><Title>{t('hello')}</Title><T style={{ color: c.muted, fontSize: 14, lineHeight: 24, maxWidth: 445 }}>{t('welcome')}</T></Reveal>
      {wide && <Reveal delay={180}><GroveIllustration size={255}/></Reveal>}
    </View>

    <View style={s.stats}>
      <Reveal delay={130} style={{ flex: 1 }}><Tap onPress={() => router.push({ pathname: '/words', params: { status: 'known' } })} style={[s.stat, { backgroundColor: '#E7F1E2' }]}><View style={s.statTop}><View style={[s.statIcon, { backgroundColor: '#D5E6CF' }]}><Icon name="check" size={19}/></View><Icon name="arrow" size={16} color="#83A078"/></View><T style={s.statNumber}>{known.toLocaleString()}</T><T style={{ fontSize: 12, color: '#698062' }}>{t('knownWords')}</T></Tap></Reveal>
      <Reveal delay={190} style={{ flex: 1 }}><Tap onPress={() => router.push({ pathname: '/words', params: { status: 'focus' } })} style={[s.stat, { backgroundColor: '#F8ECDD' }]}><View style={s.statTop}><View style={[s.statIcon, { backgroundColor: '#F0DFC7' }]}><Icon name="star" size={18} color={c.orange}/></View><Icon name="arrow" size={16} color="#BC9C75"/></View><T style={[s.statNumber, { color: '#896846' }]}>{focus.toLocaleString()}</T><T style={{ fontSize: 12, color: '#A08664' }}>{t('focusWords')}</T></Tap></Reveal>
    </View>

    <Reveal delay={220} style={{ marginTop: 34 }}><SectionLabel title={t('explore')} subtitle={t('exploreSub')}/></Reveal>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
      <Reveal delay={260} style={{ flex: 1 }}><Tap onPress={() => router.push('/words')} style={{ flex: 1 }}><LinearGradient colors={['#FBF2E7', '#F9ECDA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.exploreCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View style={{ flex: 1, gap: 9 }}><View style={[s.miniIcon, { backgroundColor: '#F0DEC5' }]}><Icon name="filter" size={18} color="#A37B50"/></View><T style={{ fontSize: 22, fontWeight: '600', letterSpacing: -0.5 }}>{t('wordFilter')}</T></View><WordIllustration/></View>
        <T style={{ color: '#9A8368', fontSize: 13, lineHeight: 23 }}>{t('wordFilterSub')}</T><View style={s.cardFooter}><T style={{ color: '#956A43', fontSize: 13, fontWeight: '600' }}>{t('exploreWords')}</T><View style={s.arrowCircle}><Icon name="arrow" size={18} color="#A67F54"/></View></View>
      </LinearGradient></Tap></Reveal>
      <Reveal delay={320} style={{ flex: 1 }}><Tap onPress={() => router.push('/roots')} style={{ flex: 1 }}><LinearGradient colors={['#E8F1E7', '#DFEBDD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.exploreCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 104 }}><View style={{ flex: 1, gap: 9 }}><View style={[s.miniIcon, { backgroundColor: '#D2E4CD' }]}><Icon name="tree" size={18}/></View><T style={{ fontSize: 22, fontWeight: '600', letterSpacing: -0.5 }}>{t('rootStudy')}</T></View><View style={{ width: 120, alignItems: 'center' }}><GroveIllustration size={140}/></View></View>
        <T style={{ color: '#758D71', fontSize: 13, lineHeight: 23 }}>{t('rootStudySub')}</T><View style={s.cardFooter}><T style={{ color: c.green, fontSize: 13, fontWeight: '600' }}>{t('exploreRoots')}</T><View style={s.arrowCircle}><Icon name="arrow" size={18}/></View></View>
      </LinearGradient></Tap></Reveal>
    </View>

    <Reveal delay={360} style={{ marginTop: 26 }}><View style={[ui.card, { backgroundColor: '#FFFDF8', padding: wide ? 28 : 23 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 }}><View style={ui.row}><Icon name="spark" size={15} color="#B49B6E"/><T style={[ui.eyebrow, { color: '#A99471', letterSpacing: 1.7 }]}>{t('handpicked')}</T></View><T style={{ fontSize: 10, color: '#B1AD9C', letterSpacing: 1 }}>01 / GROW TOGETHER</T></View>
      <View style={[ui.row, { alignItems: 'flex-start' }]}><Tap onPress={() => router.push('/word/empathy')} style={{ flex: 1 }}><T style={{ fontSize: 37, lineHeight: 46, fontFamily: serif, letterSpacing: -0.8 }}>{featured.spelling}</T><T style={{ color: '#A1A497', fontSize: 13, marginTop: 2 }}>/ {featured.ipa} /  ·  n.</T></Tap><AudioButton text={featured.spelling}/></View>
      <T style={{ fontSize: 15, marginTop: 15 }}>{local(featured.meaning)}</T><T style={{ fontSize: 13, color: c.muted, marginTop: 5 }}>{t('wordMoment')}</T>
      <View style={{ height: 1, backgroundColor: '#EFEDE3', marginVertical: 20 }}/><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><View style={ui.row}><T style={{ fontFamily: serif, fontStyle: 'italic', color: '#9A947D', fontSize: 16 }}>em + path + y</T></View><Tap onPress={() => router.push('/word/empathy')} style={ui.row}><T style={{ fontSize: 12, color: c.green }}>{t('discover')}</T><Icon name="arrow" size={16}/></Tap></View>
    </View></Reveal>
    {recent.length > 0 && <Reveal style={{ marginTop: 29 }}><SectionLabel title={t('recent')}/><View style={[ui.card, { paddingVertical: 1 }]}>{recent.map((word, index) => <WordRow key={word.id} word={word} last={index === recent.length - 1}/>)}</View></Reveal>}
    <View style={{ alignItems: 'center', marginTop: 34, gap: 6 }}><Icon name="leaf" color="#A6B59E" size={17}/><T style={{ fontSize: 11, color: '#9CA695' }}>{t('startHint')}</T><T style={{ fontSize: 10, color: '#ADB5A6', letterSpacing: 0.5 }}>{words.length} {t('wordsUnit')} · {morphemes.length} {t('rootsUnit')}</T></View>
  </Page>;
}
const s = StyleSheet.create({
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 10 },
  logo: { width: 43, height: 43, borderRadius: 15, backgroundColor: '#648768', alignItems: 'center', justifyContent: 'center' },
  offline: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingVertical: 7, paddingHorizontal: 10, backgroundColor: '#E8F0E3', borderRadius: 20 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#7C9B68' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 21, paddingBottom: 13 },
  stats: { flexDirection: 'row', gap: 14 },
  stat: { borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#FFFFFFA0' },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontFamily: serif, fontSize: 45, lineHeight: 55, color: '#416345', marginTop: 12 },
  exploreCard: { flex: 1, padding: 24, borderRadius: 25, borderWidth: 1, borderColor: '#FFFFFFB0', gap: 8, overflow: 'hidden' },
  miniIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  arrowCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF75', alignItems: 'center', justifyContent: 'center' },
});
