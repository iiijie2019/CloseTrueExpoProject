import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import type { Word } from '@/domain/models';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';
import { HighlightedWord } from './highlighted-word';
import { Icon } from './icon';
import { Tap, T, ui } from './ui';

export const posAbbreviation = { noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.' } as const;
export function StatusBadge({ word }: { word: Word }) {
  const { t, status, mark } = useApp();
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const known = status(word.id) === 'known';
  const next = known ? 'unknown' : 'known';
  return <Tap disabled={busy} accessibilityLabel={t('selectStatus', { word: word.spelling, status: t(next) })} aria-pressed={known}
    onPress={async event => {
      event.stopPropagation();
      if (pending.current) return;
      pending.current = true; setBusy(true);
      try { await mark(word.id, next); } finally { pending.current = false; setBusy(false); }
    }} style={{ minHeight: 36, justifyContent: 'center', alignSelf: 'flex-start', paddingVertical: 4 }}>
    <View style={{ backgroundColor: known ? c.mint : '#EDF0E8', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {known && <Icon name="check" size={12}/>}<T style={{ color: known ? c.green : '#737F6F', fontSize: 11, lineHeight: 18 }}>{t(known ? 'known' : 'unknown')}</T>
    </View>
  </Tap>;
}
export function AudioButton({ text, small = false }: { text: string; small?: boolean }) {
  const { play, speaking, t } = useApp();
  const active = speaking === text;
  return <Tap accessibilityLabel={`${t(active ? 'stop' : 'listen')} ${text}`} onPress={() => void play(text)} style={{ width: small ? 42 : 48, height: small ? 42 : 48, borderRadius: 24, backgroundColor: active ? c.mintStrong : '#F0F5ED', alignItems: 'center', justifyContent: 'center' }}><Icon name={active ? 'stop' : 'sound'} size={small ? 18 : 21}/></Tap>;
}
export function WordRow({ word, last = false, morphemeId }: { word: Word; last?: boolean; morphemeId?: string }) {
  const { local } = useApp();
  const open = () => router.push({ pathname: '/word/[id]', params: { id: word.id } });
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: last ? 0 : 1, borderBottomColor: '#EEF1E9' }}>
    <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
      <View style={[ui.row, { gap: 8, flexWrap: 'wrap' }]}>
        <Tap onPress={open} accessibilityLabel={word.spelling}><HighlightedWord word={word} morphemeId={morphemeId} style={{ fontFamily: serif, fontSize: 22, lineHeight: 29 }}/></Tap>
        <StatusBadge word={word}/>
      </View>
      <Tap onPress={open}><T numberOfLines={1} style={{ fontSize: 13, color: c.muted }}><T style={{ fontSize: 12, color: '#A68A66' }}>{word.pos.map(pos => posAbbreviation[pos]).join(' / ')}  </T>{local(word.meaning)}</T></Tap>
    </View>
    <AudioButton text={word.spelling} small/>
    <Tap accessibilityLabel={word.spelling} onPress={open} style={{ paddingVertical: 12, paddingLeft: 4 }}><Icon name="chevron" size={15} color="#A6AFA1"/></Tap>
  </View>;
}
