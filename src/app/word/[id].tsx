import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Linking, View } from 'react-native';
import { Icon } from '@/components/grove/icon';
import { Button, Empty, Page, PageHeader, Reveal, SectionLabel, Tap, T, ui } from '@/components/grove/ui';
import { AudioButton, StatusControl, posAbbreviation } from '@/components/grove/word-row';
import { morphemeById, wordById } from '@/data/lexicon';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function WordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, local, visit, play, speaking, notify } = useApp();
  const word = wordById.get(id);
  useEffect(() => { if (word) visit(word.id); }, [word, visit]);
  if (!word) return <Page><PageHeader title={t('wordFilter')}/><Empty message={t('notFound')} action={<Button onPress={() => router.replace('/')}>{t('goHome')}</Button>}/></Page>;
  return <Page narrow><PageHeader title={t('discover')}/>
    <Reveal style={{ marginBottom: 27 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}><T selectable accessibilityRole="header" style={{ fontFamily: serif, fontSize: word.spelling.length > 11 ? 38 : 49, lineHeight: 61, letterSpacing: -1, flexShrink: 1 }}>{word.spelling}</T><AudioButton text={word.spelling}/></View>
      <T selectable style={{ fontSize: 17, color: '#8B9882', marginTop: 5 }}>/ {word.ipa} /</T><T style={{ fontSize: 10, color: '#A5AE9C', marginTop: 5 }}>{t('systemVoice')}</T>
      <View style={[ui.chips, { marginTop: 20 }]}>{word.pos.map(pos => <View key={pos} style={{ borderRadius: 8, backgroundColor: '#E8EEDC', paddingVertical: 5, paddingHorizontal: 10 }}><T style={{ color: '#788866', fontSize: 12 }}>{posAbbreviation[pos]} {t(pos)}</T></View>)}</View>
      <T selectable style={{ fontSize: 20, lineHeight: 32, marginTop: 15 }}>{local(word.meaning)}</T>
    </Reveal>
    <Reveal delay={70} style={[ui.card, { backgroundColor: '#EFF4E8', marginBottom: 29 }]}><T style={{ fontSize: 12, color: '#7C8D6C', marginBottom: 14 }}>{t('yourStatus')}</T><StatusControl word={word}/></Reveal>
    <Reveal delay={120}><SectionLabel title={t('buildingBlocks')}/><View style={ui.card}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>{word.parts.map((part, index) => <View key={`${part}-${index}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{index > 0 && <T style={{ color: '#ADAF9D', fontSize: 20 }}>+</T>}<View style={{ paddingHorizontal: 17, paddingVertical: 12, backgroundColor: index % 2 === 0 ? '#E7EFDC' : '#F6ECDD', borderRadius: 12 }}><T selectable style={{ fontFamily: serif, fontSize: 24, color: index % 2 === 0 ? '#69824F' : '#A08257' }}>{part}</T></View></View>)}</View>
      <T style={{ fontSize: 11, color: c.muted, marginTop: 16 }}>{t('learningHint')}</T>
    </View></Reveal>
    <Reveal delay={160} style={{ marginTop: 28 }}><SectionLabel title={t('example')} right={<Tap accessibilityLabel={t('exampleListen')} onPress={() => void play(word.example.en)} style={{ padding: 10, backgroundColor: c.mint, borderRadius: 22 }}><Icon name={speaking === word.example.en ? 'stop' : 'sound'} size={18}/></Tap>}/>
      <View style={[ui.card, { backgroundColor: '#FFFCF5' }]}><T style={{ fontFamily: serif, fontSize: 49, lineHeight: 35, color: '#D7C7A3' }}>“</T><T selectable style={{ fontFamily: serif, fontSize: 23, lineHeight: 35, marginTop: 4 }}>{word.example.en}</T><T selectable style={{ color: '#959984', fontSize: 14, lineHeight: 24, marginTop: 14 }}>{word.example.zh}</T></View>
    </Reveal>
    {word.usage && <Reveal style={{ marginTop: 28 }}><SectionLabel title={t('usage')}/><T selectable style={{ color: c.muted, lineHeight: 26 }}>{local(word.usage)}</T></Reveal>}
    {word.forms.length > 0 && <Reveal style={{ marginTop: 28 }}><SectionLabel title={t('forms')}/><View style={ui.chips}>{word.forms.map(form => <Tap key={form} accessibilityLabel={`${t('listen')} ${form}`} onPress={() => void play(form)} style={{ backgroundColor: '#EEF0E8', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 11 }}><T style={{ fontFamily: serif, fontSize: 17, color: '#768064' }}>{form}</T></Tap>)}</View></Reveal>}
    <Reveal style={{ marginTop: 30 }}><SectionLabel title={t('connections')}/>{word.morphemes.map(rootId => {
      const root = morphemeById.get(rootId)!;
      return <Tap key={rootId} onPress={() => router.push({ pathname: '/root/[id]', params: { id: rootId } })} style={[ui.card, { backgroundColor: c[root.color], flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 15 }]}><View style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFFFFF70', justifyContent: 'center', alignItems: 'center' }}><Icon name="tree"/></View><View style={{ flex: 1 }}><T style={{ fontFamily: serif, fontSize: 23 }}>{root.label}</T><T style={{ color: '#869279', fontSize: 12, marginTop: 4 }}>{local(root.meaning)}</T></View><Icon name="arrow" size={18}/></Tap>;
    })}</Reveal>
    <T style={{ color: '#A3AA99', fontSize: 11, lineHeight: 20, marginTop: 20 }}>{t('pronunciationNote')}</T>
    <Tap onPress={() => void Linking.openURL(`https://en.wiktionary.org/wiki/${encodeURIComponent(word.spelling)}`).catch(() => notify(t('sourceUnavailable')))} style={{ flexDirection: 'row', gap: 7, alignItems: 'center', paddingVertical: 20 }}><T style={{ fontSize: 12, color: '#799069' }}>{t('source')}</T><Icon name="external" size={13} color="#799069"/></Tap>
  </Page>;
}
