import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/grove/icon';
import { Button, Chip, Empty, Page, PageHeader, Reveal, SectionLabel, T, Tap, Title, ui } from '@/components/grove/ui';
import { AudioButton } from '@/components/grove/word-row';
import { formatSentence, matchSentenceOrder, sentenceById, sentenceRoles, sentences, shuffledChunks, type SentenceLesson } from '@/data/sentences';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function SentenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language } = useApp();
  const lesson = sentenceById.get(id);
  if (!lesson) return <Page><PageHeader title={t('sentenceTitle')}/><Empty message={language === 'zh' ? '没有找到这个练习' : 'Lesson not found'}/></Page>;
  // A route change resets the exercise, including its shuffled pool and feedback.
  return <Lesson key={lesson.id} lesson={lesson}/>;
}

function Lesson({ lesson }: { lesson: SentenceLesson }) {
  const { t, language, local, stop } = useApp();
  const label = (zh: string, en: string) => language === 'zh' ? zh : en;
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [orderIndex, setOrderIndex] = useState(0);
  const [selected, setSelected] = useState(lesson.chunks[0].id);
  const [pool, setPool] = useState(() => shuffledChunks(lesson));
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const order = lesson.orders[orderIndex];
  const sentence = formatSentence(lesson, order.ids, order.commaAfter);
  const part = lesson.chunks.find(chunk => chunk.id === selected)!;
  const role = sentenceRoles[part.role];
  const match = checked ? matchSentenceOrder(lesson, answer) : undefined;
  const next = sentences[sentences.indexOf(lesson) + 1];
  const reset = () => { setPool(shuffledChunks(lesson)); setAnswer([]); setChecked(false); setShowHint(false); };
  const changeMode = (value: typeof mode) => { stop(); setMode(value); };
  return <Page narrow>
    <PageHeader title={t('sentenceTitle')} right={<T style={ui.muted}>{sentences.indexOf(lesson) + 1} / {sentences.length}</T>}/>
    <Reveal><Title small>{local(lesson.title)}</Title><T style={[ui.muted, { marginTop: 9, marginBottom: 21 }]}>{local(lesson.summary)}</T>
      <View style={ui.chips}><Chip label={label('拆解学习', 'Explore')} selected={mode === 'explore'} onPress={() => changeMode('explore')}/><Chip label={label('语序练习', 'Arrange')} selected={mode === 'practice'} onPress={() => changeMode('practice')}/></View>
    </Reveal>
    {mode === 'explore' ? <Reveal key="explore" style={{ marginTop: 24 }}>
      <View style={[ui.card, { backgroundColor: '#F0EDF7', marginBottom: 27 }]}>
        <View style={[ui.row, { alignItems: 'flex-start' }]}><T style={{ flex: 1, fontFamily: serif, fontSize: 29, lineHeight: 40 }}>{sentence}</T><AudioButton text={sentence}/></View>
        <T style={{ marginTop: 12, color: c.purple, fontSize: 14 }}>{lesson.translation}</T>
        {lesson.orders.length > 1 && <View style={[ui.chips, { marginTop: 19 }]}>{lesson.orders.map((_, index) => <Chip key={index} label={index === 0 ? label('常见顺序', 'Common order') : label(`另一种顺序 ${index}`, `Alternative ${index}`)} selected={orderIndex === index} onPress={() => { stop(); setOrderIndex(index); }}/>)}</View>}
        <T style={{ marginTop: 13, color: c.muted, fontSize: 12 }}>{local(order.note)}</T>
      </View>
      <SectionLabel title={label('一句话，拆开看', 'A closer look')} subtitle={label('点按词块，看看它为什么放在这里。', 'Tap a phrase to see how it works.')}/>
      <View style={[ui.chips, { gap: 9 }]}>{order.ids.map(id => {
        const item = lesson.chunks.find(chunk => chunk.id === id)!;
        const info = sentenceRoles[item.role];
        return <Tap key={id} aria-pressed={selected === id} accessibilityState={{ selected: selected === id }} onPress={() => setSelected(id)} style={[s.chunk, { backgroundColor: c[info.color], borderColor: selected === id ? c.green : 'transparent' }]}><T style={{ fontSize: 19, fontFamily: serif }}>{item.text}</T><T style={{ fontSize: 10, color: c.muted }}>{local(info.label)}</T></Tap>;
      })}</View>
      <Reveal key={selected} style={[ui.card, { marginTop: 18, marginBottom: 23 }]}>
        <View style={[ui.row, { justifyContent: 'space-between' }]}><View style={{ flex: 1 }}><T style={{ fontFamily: serif, fontSize: 25, lineHeight: 34 }}>{part.text}</T><T style={[ui.muted, { marginTop: 4 }]}>{local(part.meaning)}</T></View><AudioButton small text={part.text}/></View>
        <View style={{ alignSelf: 'flex-start', backgroundColor: c[role.color], paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9, marginVertical: 15 }}><T style={{ fontSize: 12 }}>{local(role.label)} · {local(role.question)}</T></View>
        <T style={{ fontSize: 14, lineHeight: 25 }}>{local(part.explanation)}</T>
      </Reveal>
      <View style={{ backgroundColor: '#EDF3E6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 9 }}><View style={ui.row}><Icon name="spark" size={17}/><T style={{ fontSize: 13, fontWeight: '600' }}>{label('记住这个小规律', 'A pattern to remember')}</T></View><T style={{ fontSize: 13, color: c.muted, lineHeight: 23 }}>{local(lesson.tip)}</T></View>
      <View style={{ marginTop: 22 }}><Button onPress={() => changeMode('practice')} icon="arrow">{label('试着排一排', 'Try arranging the sentence')}</Button></View>
    </Reveal> : <Reveal key="practice" style={{ marginTop: 24 }}>
      <View style={[ui.card, { backgroundColor: '#F0EDF7' }]}><T style={{ fontWeight: '600', fontSize: 17 }}>{lesson.translation}</T><T style={{ marginTop: 9, color: c.muted, fontSize: 13 }}>{label('按顺序点选下方词块。点已选词块可以移回，不用输入标点。', 'Tap the phrases in order. Tap a chosen phrase to return it. Punctuation is added for you.')}</T></View>
      <T style={[ui.eyebrow, { marginTop: 25, marginBottom: 13 }]}>{label('你的句子', 'YOUR SENTENCE')} · {answer.length} / {lesson.chunks.length}</T>
      <View style={[s.answer, match && { borderColor: c.green, backgroundColor: '#F0F7EF' }]}>
        {!answer.length && <T style={{ color: c.muted, fontSize: 13, padding: 8 }}>{label('从“谁”或提问词开始想一想……', 'Think about the subject or question opening…')}</T>}
        {answer.map(id => <Tap key={id} accessibilityLabel={label(`移回 ${lesson.chunks.find(chunk => chunk.id === id)!.text}`, `Remove ${lesson.chunks.find(chunk => chunk.id === id)!.text}`)} onPress={() => { setAnswer(value => value.filter(item => item !== id)); setChecked(false); }} style={[s.piece, { backgroundColor: c.mint }]}><T style={s.pieceText}>{lesson.chunks.find(chunk => chunk.id === id)!.text}</T><Icon name="close" size={12}/></Tap>)}
      </View>
      <View style={[ui.chips, { marginVertical: 19, minHeight: 58 }]}>{pool.filter(id => !answer.includes(id)).map(id => <Tap key={id} onPress={() => { setAnswer(value => [...value, id]); setChecked(false); }} style={s.piece}><T style={s.pieceText}>{lesson.chunks.find(chunk => chunk.id === id)!.text}</T><Icon name="plus" size={13}/></Tap>)}</View>
      <View style={{ gap: 10 }}><Button disabled={answer.length !== lesson.chunks.length} onPress={() => setChecked(true)} icon="check">{label('检查语序', 'Check the order')}</Button><View style={{ flexDirection: 'row', gap: 12 }}><View style={{ flex: 1 }}><Button secondary onPress={() => setShowHint(value => !value)}>{label('看看提示', 'Show a hint')}</Button></View><View style={{ flex: 1 }}><Button secondary onPress={reset}>{label('重新排列', 'Start again')}</Button></View></View></View>
      {showHint && <Reveal style={[ui.card, { marginTop: 16 }]}><T style={{ fontSize: 13 }}>{lesson.orders[0].ids.map(id => local(sentenceRoles[lesson.chunks.find(chunk => chunk.id === id)!.role].label)).join(' → ')}</T></Reveal>}
      {checked && <Reveal style={[ui.card, { marginTop: 19, backgroundColor: match ? c.mint : c.peach }]}><View accessibilityLiveRegion="polite"><T style={{ fontWeight: '600', marginBottom: 9 }}>{match ? label('这样表达很自然！', 'That reads naturally!') : label('试试本课的目标顺序', 'Try one of this lesson’s patterns')}</T><T style={{ fontSize: 13, lineHeight: 24 }}>{match ? local(match.note) : label('当前排列没有匹配本课列出的示例。这并不代表所有其他排列都不合语法；可以看看提示，再回到拆解页比较。', 'This order does not match the examples in this lesson. Other orders can sometimes be grammatical. Use a hint or compare the patterns in Explore.')}</T></View>{match && <View style={[ui.row, { marginTop: 14 }]}><T style={{ flex: 1, fontFamily: serif, fontSize: 22, lineHeight: 31 }}>{formatSentence(lesson, answer, match.commaAfter)}</T><AudioButton small text={formatSentence(lesson, answer, match.commaAfter)}/></View>}</Reveal>}
    </Reveal>}
    {next && <Tap onPress={() => router.replace({ pathname: '/sentence/[id]', params: { id: next.id } })} style={{ paddingVertical: 23, marginTop: 10 }}><View style={[ui.row, { justifyContent: 'space-between' }]}><View style={{ flex: 1 }}><T style={ui.muted}>{label('下一个小练习', 'Up next')}</T><T style={{ fontWeight: '600', marginTop: 4 }}>{local(next.title)}</T></View><Icon name="arrow" size={18}/></View></Tap>}
  </Page>;
}

const s = StyleSheet.create({
  chunk: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, gap: 3, borderWidth: 1.5 },
  answer: { minHeight: 116, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C8D6BF', backgroundColor: '#FFFFFF90' },
  piece: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8DE' },
  pieceText: { fontFamily: serif, fontSize: 20, lineHeight: 25 },
});
