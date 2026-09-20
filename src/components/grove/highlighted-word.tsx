import type { TextProps } from 'react-native';
import { morphemeById } from '@/data/lexicon';
import type { Word } from '@/domain/models';
import { morphemeSegments, sentenceSegments } from '@/domain/word-display';
import { T } from './ui';

export function HighlightedWord({ word, morphemeId, ...props }: TextProps & { word: Word; morphemeId?: string }) {
  const roots = (morphemeId ? [morphemeId] : word.morphemes).flatMap(id => {
    const root = morphemeById.get(id);
    return root ? [root] : [];
  });
  return <T {...props}>{morphemeSegments(word, roots).map((part, index) => <T key={index} style={[props.style, part.highlighted && { color: '#8762AD' }]}>{part.text}</T>)}</T>;
}

export function HighlightedSentence({ word, ...props }: TextProps & { word: Word }) {
  return <T {...props}>{sentenceSegments(word.example.en, word).map((part, index) => <T key={index} style={[props.style, part.highlighted && { color: '#347A60', backgroundColor: '#E2F0E4', fontWeight: '700' }]}>{part.text}</T>)}</T>;
}
