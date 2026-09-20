import { router } from 'expo-router';
import { View } from 'react-native';
import type { Word, WordStatus } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';
import { Icon } from './icon';
import { Chip, Tap, T, ui } from './ui';

export const posAbbreviation = { noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.' } as const;
export function StatusBadge({ status }: { status: WordStatus }) {
  const { t } = useApp();
  const color = status === 'focus' ? c.orange : status === 'known' ? c.green : c.muted;
  return <View style={{ backgroundColor: status === 'focus' ? c.peach : status === 'known' ? c.mint : '#F1F3EE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>{status !== 'unknown' && <Icon name={status === 'known' ? 'check' : 'star'} size={11} color={color}/>}<T style={{ color, fontSize: 10, lineHeight: 17 }}>{t(status)}</T></View>;
}
export function AudioButton({ text, small = false }: { text: string; small?: boolean }) {
  const { play, speaking, t } = useApp();
  const active = speaking === text;
  return <Tap accessibilityLabel={`${t(active ? 'stop' : 'listen')} ${text}`} onPress={() => void play(text)} style={{ width: small ? 42 : 48, height: small ? 42 : 48, borderRadius: 24, backgroundColor: active ? c.mintStrong : '#F0F5ED', alignItems: 'center', justifyContent: 'center' }}><Icon name={active ? 'stop' : 'sound'} size={small ? 18 : 21}/></Tap>;
}
export function WordRow({ word, last = false }: { word: Word; last?: boolean }) {
  const { local, status } = useApp();
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 17, borderBottomWidth: last ? 0 : 1, borderBottomColor: '#EEF1E9' }}>
    <Tap onPress={() => router.push({ pathname: '/word/[id]', params: { id: word.id } })} accessibilityLabel={`${word.spelling}, ${local(word.meaning)}`} style={{ flex: 1, gap: 6 }}>
      <View style={[ui.row, { gap: 8, flexWrap: 'wrap' }]}><T style={{ fontFamily: serif, fontSize: 22, lineHeight: 29 }}>{word.spelling}</T><StatusBadge status={status(word.id)}/></View>
      <T numberOfLines={1} style={{ fontSize: 13, color: c.muted }}><T style={{ fontSize: 12, color: '#A68A66' }}>{word.pos.map(pos => posAbbreviation[pos]).join(' / ')}  </T>{local(word.meaning)}</T>
    </Tap>
    <AudioButton text={word.spelling} small/>
    <Tap accessibilityLabel={word.spelling} onPress={() => router.push({ pathname: '/word/[id]', params: { id: word.id } })} style={{ paddingVertical: 12, paddingLeft: 4 }}><Icon name="chevron" size={15} color="#A6AFA1"/></Tap>
  </View>;
}
export function StatusControl({ word }: { word: Word }) {
  const { status, mark, t } = useApp();
  return <View style={[ui.chips, { gap: 10 }]}>{(['unknown', 'focus', 'known'] as const).map(value => <Chip key={value} label={t(value)} icon={value === 'known' ? 'check' : value === 'focus' ? 'star' : undefined} selected={status(word.id) === value} tint={value === 'focus' ? 'orange' : 'green'} onPress={() => void mark(word.id, value)}/>)}</View>;
}
