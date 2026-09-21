import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PagedList } from '@/components/grove/paged-list';
import { Icon } from '@/components/grove/icon';
import { Chip, Empty, PageHeader, Reveal, SearchBox, T, Tap, Title, ui } from '@/components/grove/ui';
import { formatSentence, sentenceRoles, sentenceTopics, sentences, type SentenceTopic } from '@/data/sentences';
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
  return <PagedList narrow items={lessons} resetKey={JSON.stringify([topic, query])} header={<>
    <PageHeader title={t('sentenceTitle')}/>
    <Reveal>
      <Title small>{label('拆开看懂，连起来表达', 'Little pieces. Real conversations.')}</Title>
      <T style={{ color: c.muted, fontSize: 13, marginTop: 8, marginBottom: 19 }}>{label('从日常小事出发，读懂语序，再动手试一试。', 'Explore everyday phrases, then try arranging them yourself.')}</T>
      <SearchBox value={query} onChange={setQuery} placeholder={label('搜索句子、中文意思或主题', 'Search sentences, meanings or topics')}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 16 }}>
        <Chip label={t('all')} selected={topic === 'all'} onPress={() => setTopic('all')}/>{(Object.keys(sentenceTopics) as SentenceTopic[]).map(key => <Chip key={key} label={local(sentenceTopics[key])} selected={topic === key} onPress={() => setTopic(key)}/>)}
      </ScrollView>
    </Reveal>
    <View style={[ui.row, { justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 14 }]}><T style={ui.muted}>{label(`${lessons.length} 个句子案例`, `${lessons.length} sentence lesson${lessons.length === 1 ? '' : 's'}`)}</T><T style={{ fontSize: 11, color: c.purple }}>{label('看拆解 · 听朗读 · 练语序', 'Explore · listen · arrange')}</T></View>
    </>} renderItem={({ item: lesson }) => <View style={{ marginBottom: 13 }}><Tap onPress={() => router.push({ pathname: '/sentence/[id]', params: { id: lesson.id } })} style={ui.card}>
      <View style={[ui.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <View style={[ui.row, { gap: 7 }]}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.purple }}/><T style={{ color: c.purple, fontSize: 11, fontWeight: '600' }}>{local(sentenceTopics[lesson.topic])}</T></View>
        <T style={{ fontSize: 11, color: c.muted }}>{String(sentences.indexOf(lesson) + 1).padStart(2, '0')}</T>
      </View>
      <T style={{ fontFamily: serif, fontSize: 24, lineHeight: 33 }}>{formatSentence(lesson)}</T>
      <T style={{ marginTop: 9, fontSize: 13, color: c.muted }}>{language === 'zh' ? lesson.translation : local(lesson.title)}</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginTop: 16 }}>
        {lesson.orders[0].ids.slice(0, 3).map((id, index) => {
          const role = sentenceRoles[lesson.chunks.find(chunk => chunk.id === id)!.role];
          return <View key={id} style={[ui.row, { gap: 5 }]}>{index > 0 && <T style={{ color: '#A3AD9D', fontSize: 11 }}>→</T>}<View style={{ backgroundColor: c[role.color], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}><T style={{ fontSize: 11, lineHeight: 19 }}>{local(role.label)}</T></View></View>;
        })}
        {lesson.chunks.length > 3 && <T style={{ fontSize: 11, color: c.muted }}> +{lesson.chunks.length - 3}</T>}
      </View>
      <View style={[ui.row, { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: c.line, justifyContent: 'space-between' }]}><T style={{ fontSize: 12, color: c.green, flex: 1 }}>{language === 'zh' ? local(lesson.title) : 'Explore this sentence'}</T><Icon name="arrow" size={16}/></View>
    </Tap></View>}
    empty={<Empty message={label('没有找到这类句子', 'No sentences found')} detail={label('试试其他关键词或主题。', 'Try another search or topic.')}/>}
  />;
}
