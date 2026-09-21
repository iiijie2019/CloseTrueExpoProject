import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { BrandLogo } from '@/components/grove/brand-logo';
import { GroveIllustration, WordIllustration } from '@/components/grove/illustrations';
import { HighlightedSentence } from '@/components/grove/highlighted-word';
import { Icon, type IconName } from '@/components/grove/icon';
import { Page, Reveal, SectionLabel, Tap, T, Title, ui } from '@/components/grove/ui';
import { AudioButton, StatusBadge, WordRow, posAbbreviation } from '@/components/grove/word-row';
import { morphemes, wordById, words } from '@/data/lexicon';
import { sentences } from '@/data/sentences';
import type { WordTopic } from '@/data/word-topics';
import { nextFeaturedWord } from '@/domain/word-display';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function HomeScreen() {
  const { t, local, data, language, stop } = useApp();
  const wide = useWindowDimensions().width >= 680;
  const label = (zh: string, en: string) => language === 'zh' ? zh : en;
  const known = Object.values(data.records).filter(record => wordById.has(record.wordId) && record.status === 'known').length;
  const recent = data.recent.map(id => wordById.get(id)).filter(word => !!word).slice(0, 3);
  const [featured, setFeatured] = useState(() => wordById.get('empathy')!);
  const openFeatured = () => router.push({ pathname: '/word/[id]', params: { id: featured.id } });
  const topics: { id: WordTopic; title: string; icon: IconName; color: string }[] = [
    { id: 'everyday', title: label('身边物品', 'Everyday'), icon: 'home', color: c.mint },
    { id: 'food', title: label('饮食时光', 'Food'), icon: 'spark', color: c.peach },
    { id: 'travel', title: label('出门走走', 'Travel'), icon: 'globe', color: c.blue },
    { id: 'work', title: label('学习工作', 'Work'), icon: 'book', color: c.lavender },
  ];
  return <Page tabs>
    <View style={s.brandRow}><View style={[ui.row, { gap: 10, flex: 1, minWidth: 0 }]}><BrandLogo size={40}/><View style={{ flex: 1, minWidth: 0 }}><T style={{ fontFamily: serif, fontSize: 21, fontWeight: '600' }}>Word Grove</T><T style={{ fontSize: 10, color: c.muted, letterSpacing: 0.6 }}>{label('词间 · 按自己的节奏生长', 'GROW AT YOUR OWN PACE')}</T></View></View><Tap onPress={() => router.push('/words')} accessibilityLabel={t('searchPlaceholder')} style={s.search}><Icon name="search" size={20}/></Tap></View>
    <View style={[s.hero, wide && { paddingVertical: 18 }]}>
      <Reveal style={{ flex: 1, gap: 8 }}><T style={[ui.eyebrow, { color: c.green }]}>{t('learning')}</T><Title>{t('hello')}</Title><T style={{ color: c.muted, fontSize: 13, lineHeight: 22, maxWidth: 430 }}>{t('welcome')}</T></Reveal>
      {wide && <GroveIllustration size={190}/>}
    </View>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {(['known', 'unknown'] as const).map((status, index) => <Reveal key={status} delay={70 + index * 50} style={{ flex: 1 }}><Tap onPress={() => router.push({ pathname: '/words', params: { status } })} style={[s.stat, { backgroundColor: index === 0 ? '#E4EFE1' : '#F8EEDC' }]}>
        <View style={[ui.row, { justifyContent: 'space-between', gap: 6 }]}><T style={{ fontSize: 12, color: index === 0 ? c.green : '#8A6B45' }}>{t(index === 0 ? 'knownWords' : 'unknownWords')}</T><Icon name={index === 0 ? 'check' : 'book'} size={16} color={index === 0 ? c.green : '#A38559'}/></View>
        <View style={[ui.row, { justifyContent: 'space-between', marginTop: 8 }]}><T style={{ fontFamily: serif, fontSize: 36, lineHeight: 42, color: index === 0 ? c.green : '#86633F' }}>{(index === 0 ? known : words.length - known).toLocaleString()}</T><Icon name="arrow" size={16} color={index === 0 ? c.green : '#A38559'}/></View>
      </Tap></Reveal>)}
    </View>
    <View style={{ marginTop: 26 }}><SectionLabel title={label('今天，想怎样学？', 'Where shall we begin?')}/></View>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Reveal delay={140} style={{ flex: 1 }}><Tap onPress={() => router.push('/words')} style={[s.entry, { backgroundColor: '#FAEDDE' }]}>
        <View style={{ height: 54, overflow: 'hidden' }}><View style={{ transform: [{ scale: 0.68 }], transformOrigin: 'left top', width: 145 }}><WordIllustration/></View></View>
        <T style={s.entryTitle}>{t('exploreWords')}</T><T style={{ color: '#846B4F', fontSize: 12 }}>{t('wordCountShort', { count: words.length })}</T><View style={s.entryArrow}><Icon name="arrow" size={17} color="#98764D"/></View>
      </Tap></Reveal>
      <Reveal delay={190} style={{ flex: 1 }}><Tap onPress={() => router.push('/roots')} style={[s.entry, { backgroundColor: '#E3EDDF' }]}>
        <View style={{ height: 54, justifyContent: 'center' }}><Icon name="tree" size={32} color="#65825A"/></View>
        <T style={s.entryTitle}>{t('rootEntry')}</T><T style={{ color: '#5D7654', fontSize: 12 }}>{morphemes.length} {t('rootsUnit')}</T><View style={s.entryArrow}><Icon name="arrow" size={17}/></View>
      </Tap></Reveal>
    </View>
    <Reveal delay={230} style={{ marginTop: 12 }}><Tap onPress={() => router.push('/sentences')} style={[s.sentence, { backgroundColor: '#EEEBF5' }]}>
      <View style={s.sentenceIcon}><Icon name="book" size={23} color={c.purple}/></View><View style={{ flex: 1 }}><View style={[ui.row, { flexWrap: 'wrap', gap: 8 }]}><T style={{ fontWeight: '600', fontSize: 18 }}>{label('把单词连成句子', 'Words in company')}</T><T style={{ color: c.purple, fontSize: 11 }}>{label(`${sentences.length} 个案例`, `${sentences.length} lessons`)}</T></View><T style={{ color: c.purple, fontSize: 12, lineHeight: 21, marginTop: 4 }}>{label('点一点，拆解语序；排一排，学会表达。', 'Explore each phrase. Put the pieces together.')}</T></View><Icon name="arrow" size={17} color={c.purple}/>
    </Tap></Reveal>
    <View style={{ marginTop: 29 }}><SectionLabel title={label('从熟悉的生活开始', 'English around you')} subtitle={label('选一个场景，认识用得上的单词。', 'Useful words for the moments you know.')}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>{topics.map(topic => <Tap key={topic.id} onPress={() => router.push({ pathname: '/words', params: { topic: topic.id } })} style={[s.topic, { backgroundColor: topic.color }]}><Icon name={topic.icon} size={20}/><T style={{ fontSize: 12, marginTop: 9 }}>{topic.title}</T></Tap>)}</ScrollView>
    </View>
    <View style={{ marginTop: 27 }}><View style={[ui.row, { justifyContent: 'space-between', marginBottom: 12 }]}><T style={{ fontSize: 19, fontWeight: '600', flex: 1 }}>{t('handpicked')}</T><Tap onPress={() => { stop(); setFeatured(old => nextFeaturedWord(words, old.id)!); }} accessibilityLabel={t('refreshWord')} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="refresh" size={15}/><T style={{ fontSize: 12, color: c.green }}>{t('refreshWord')}</T></Tap></View>
      <Reveal key={featured.id} style={[ui.card, { backgroundColor: '#FFFEF9' }]}>
        <View style={[ui.row, { alignItems: 'flex-start' }]}><Tap onPress={openFeatured} style={{ flex: 1, minWidth: 0 }}><T style={{ fontFamily: serif, fontSize: featured.spelling.length > 13 ? 27 : 34, lineHeight: 43 }}>{featured.spelling}</T><T style={{ color: c.muted, fontSize: 12 }}>/ {featured.ipa} / · {featured.pos.map(pos => posAbbreviation[pos]).join(' / ')}</T></Tap><AudioButton text={featured.spelling}/></View>
        <View style={[ui.row, { marginTop: 12 }]}><T style={{ flex: 1, fontSize: 15 }}>{local(featured.meaning)}</T><StatusBadge word={featured}/></View>
        <View style={{ borderTopWidth: 1, borderColor: c.line, paddingTop: 16, marginTop: 13 }}><HighlightedSentence word={featured} style={{ fontFamily: serif, fontSize: 19, lineHeight: 29 }}/><T style={{ fontSize: 12, lineHeight: 21, color: c.muted, marginTop: 7 }}>{featured.example.zh}</T></View>
        <Tap onPress={openFeatured} style={{ flexDirection: 'row', gap: 9, alignItems: 'center', alignSelf: 'flex-start', marginTop: 14, minHeight: 36 }}><T style={{ fontSize: 12, color: c.green }}>{t('discover')}</T><Icon name="arrow" size={15}/></Tap>
      </Reveal>
    </View>
    {!!recent.length && <View style={{ marginTop: 27 }}><SectionLabel title={t('recent')}/><View style={ui.card}>{recent.map((word, i) => <WordRow key={word.id} word={word} last={i === recent.length - 1}/>)}</View></View>}
    <View style={{ alignItems: 'center', gap: 5, marginTop: 27 }}><Icon name="leaf" size={17} color={c.muted}/><T style={{ color: c.muted, fontSize: 11 }}>{t('startHint')}</T></View>
  </Page>;
}
const s = StyleSheet.create({
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 3 },
  search: { width: 42, height: 42, borderRadius: 16, backgroundColor: '#FFFFFFC9', borderWidth: 1, borderColor: '#E4EBDE', justifyContent: 'center', alignItems: 'center' },
  hero: { paddingTop: 27, paddingBottom: 23, flexDirection: 'row', alignItems: 'center' },
  stat: { paddingHorizontal: 17, paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: '#FFFFFFB0' },
  entry: { paddingHorizontal: 18, paddingTop: 13, paddingBottom: 20, minHeight: 150, borderRadius: 22, borderWidth: 1, borderColor: '#FFFFFFA0', overflow: 'hidden' },
  entryTitle: { fontSize: 18, fontWeight: '600', marginTop: 2, marginBottom: 5 },
  entryArrow: { position: 'absolute', bottom: 18, right: 17 },
  sentence: { borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#FFFFFFB0' },
  sentenceIcon: { width: 43, height: 48, borderRadius: 15, backgroundColor: '#E2DCED', justifyContent: 'center', alignItems: 'center' },
  topic: { minWidth: 93, paddingHorizontal: 16, paddingVertical: 15, borderRadius: 18 },
});
