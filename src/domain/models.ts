export type Language = 'zh' | 'en';
export type Localized = Record<Language, string>;
export type WordStatus = 'unknown' | 'focus' | 'known';
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';
export type MorphemeKind = 'root' | 'prefix' | 'suffix';

export interface Morpheme {
  id: string;
  label: string;
  kind: MorphemeKind;
  meaning: Localized;
  origin: Localized;
  description: Localized;
  color: 'mint' | 'peach' | 'lavender' | 'blue';
}
export interface Word {
  id: string;
  spelling: string;
  morphemes: string[];
  pos: PartOfSpeech[];
  meaning: Localized;
  ipa: string;
  parts: string[];
  example: Localized;
  forms: string[];
  usage?: Localized;
}
export interface LearningRecord {
  wordId: string;
  spelling: string;
  status: WordStatus;
  updatedAt: string;
}
export interface Preferences {
  language: Language | 'system';
  accent: 'en-US' | 'en-GB';
  slowSpeech: boolean;
}
export interface UserData {
  version: 1;
  records: Record<string, LearningRecord>;
  preferences: Preferences;
  recent: string[];
}
export const emptyData = (): UserData => ({
  version: 1,
  records: {},
  preferences: { language: 'system', accent: 'en-US', slowSpeech: false },
  recent: [],
});
