import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { PagedList } from '@/components/grove/paged-list';
import { Icon } from '@/components/grove/icon';
import { Chip, Empty, PageHeader, Reveal, SearchBox, T, Tap, Title, ui } from '@/components/grove/ui';
import { formatSentence, sentenceTopics, sentences, type SentenceTopic } from '@/data/sentences';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function SentencesScreen() {
  const { t, language, local } = useApp();
  const [topic, setTopic] = useState<SentenceTopic | 'all'>('all');
  const [query, setQuery] = useState('');
  const label = (zh: string, en: string) => language === 'zh' ? zh : en;
  const search = query.trim().toLowerCase();
  const lessons = sentences.filter(lesson => (topic === 'all' || lesson.topic === topic) &&
    [lesson.title.zh, lesson.title.en, lesson.translation, formatSentence(lesson), lesson.summary.zh, lesson.summary.en].some(text => text.toLowerCase().includes(search)));
  return <PagedList items={lessons} resetKey={JSON.stringify([topic, query])} header={<>
    <PageHeader title={t('sentenceTitle')}/>
    <Reveal><T style={ui.eyebrow}>WORDS IN COMPANY</T><View style={{ marginVertical: 13 }}><Title>{label('让单词连成一句话', 'Give words a little company.')}</Title></View>
      <T style={{ color: c.muted, marginBottom: 23 }}>{label('拆开看懂，连起来表达。学习每个词块的位置与作用，再动手排出自己的句子。', 'See what each phrase does and where it goes. Then put the pieces together yourself.')}</T>
      <SearchBox value={query} onChange={setQuery} placeholder={label('搜索句子、中文意思或主题', 'Search sentences, meanings or topics')}/>
      <View style={[ui.chips, { marginTop: 18 }]}><Chip label={t('all')} selected={topic === 'all'} onPress={() => setTopic('all')}/>{(Object.keys(sentenceTopics) as SentenceTopic[]).map(key => <Chip key={key} label={local(sentenceTopics[key])} selected={topic === key} onPress={() => setTopic(key)}/>)}</View>
    </Reveal>
    <T style={[ui.muted, { marginTop: 23, marginBottom: 13 }]}>{label(`${lessons.length} 个小练习 · 不赶进度，慢慢理解`, `${lessons.length} small lesson${lessons.length === 1 ? '' : 's'} · take your time`)}</T>
    </>} renderItem={({ item: lesson }) => <View style={{ marginBottom: 14 }}><Tap onPress={() => router.push({ pathname: '/sentence/[id]', params: { id: lesson.id } })} style={ui.card}>
      <View style={[ui.row, { justifyContent: 'space-between', marginBottom: 13 }]}><T style={{ color: c.purple, fontSize: 11, fontWeight: '600' }}>{local(sentenceTopics[lesson.topic])}</T><T style={{ fontSize: 10, color: c.muted }}>{String(sentences.indexOf(lesson) + 1).padStart(2, '0')}</T></View>
      <T style={{ fontFamily: serif, fontSize: 23, lineHeight: 32 }}>{formatSentence(lesson)}</T>
      <T style={{ marginTop: 9, fontWeight: '600', fontSize: 14 }}>{local(lesson.title)}</T><T style={[ui.muted, { marginTop: 5 }]}>{local(lesson.summary)}</T>
      <View style={[ui.row, { marginTop: 17, justifyContent: 'space-between' }]}><T style={{ fontSize: 11, color: c.purple }}>{label(`${lesson.chunks.length} 个词块 · 点按拆解与语序练习`, `${lesson.chunks.length} chunks · explore & arrange`)}</T><Icon name="arrow" size={17} color={c.purple}/></View>
    </Tap></View>}
    empty={<Empty message={label('没有找到这类句子', 'No sentences found')} detail={label('试试其他关键词或主题。', 'Try another search or topic.')}/>}
  />;
}
