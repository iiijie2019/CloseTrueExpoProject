import { useLocales } from 'expo-localization';
import { usePathname } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { readStored, writeStored } from '@/data/storage';
import { wordById } from '@/data/lexicon';
import { mergeData, parseStoredData } from '@/domain/backup';
import { emptyData, type Language, type Localized, type Preferences, type UserData, type WordStatus } from '@/domain/models';
import { translate, type MessageKey } from '@/i18n/messages';

type Toast = { text: string; action?: () => void; id: number } | null;
type Context = {
  data: UserData; ready: boolean; loadError: boolean; language: Language; speaking: string | null; toast: Toast;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
  local: (value: Localized) => string;
  status: (id: string) => WordStatus;
  mark: (id: string, status: WordStatus) => Promise<void>;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => Promise<void>;
  visit: (id: string) => void;
  play: (text: string) => Promise<void>; stop: () => void;
  notify: (text: string, action?: () => void) => void;
  importData: (incoming: UserData, preferImported: boolean) => Promise<void>;
  restore: () => Promise<void>; hasRecovery: boolean; reload: () => void;
};
const AppContext = createContext<Context | null>(null);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<UserData>(emptyData);
  const current = useRef(data);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasRecovery, setHasRecovery] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const speechId = useRef(0);
  const locales = useLocales();
  const pathname = usePathname();
  const language: Language = data.preferences.language === 'system' ? (locales[0]?.languageCode === 'zh' ? 'zh' : 'en') : data.preferences.language;
  const t = useCallback((key: MessageKey, values?: Record<string, string | number>) => translate(language, key, values), [language]);
  const notify = useCallback((text: string, action?: () => void) => setToast({ text, action, id: Date.now() }), []);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    Promise.all([readStored('user'), readStored('recovery')]).then(([raw, recovery]) => {
      const loaded = parseStoredData(raw);
      if (!cancelled) { current.current = loaded; setData(loaded); setHasRecovery(!!recovery); setReady(true); }
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [attempt]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.action ? 5500 : 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const commit = useCallback((update: (previous: UserData) => UserData | Promise<UserData>) => {
    const task = queue.current.catch(() => {}).then(async () => {
      const next = await update(current.current);
      await writeStored('user', JSON.stringify(next));
      current.current = next;
      setData(next);
    });
    queue.current = task;
    return task;
  }, []);

  const mark = useCallback(async (id: string, status: WordStatus) => {
    const word = wordById.get(id);
    if (!word || !ready) return;
    let previous = current.current.records[id];
    const updatedAt = new Date().toISOString();
    try {
      await commit(old => {
        previous = old.records[id];
        return { ...old, records: { ...old.records, [id]: { wordId: id, spelling: word.spelling, status, updatedAt } } };
      });
      notify(t(status === 'known' ? 'savedKnown' : status === 'focus' ? 'savedFocus' : 'savedUnknown'), () => {
        setToast(null);
        void commit(old => {
          // An old undo must not erase a more recent edit to the same word.
          if (old.records[id]?.updatedAt !== updatedAt) return old;
          const records = { ...old.records };
          if (previous) records[id] = previous; else delete records[id];
          return { ...old, records };
        }).catch(() => notify(t('saveError')));
      });
    } catch { notify(t('saveError')); }
  }, [commit, notify, ready, t]);

  const setPreference = useCallback(async <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    try { await commit(old => ({ ...old, preferences: { ...old.preferences, [key]: value } })); }
    catch { notify(t('saveError')); }
  }, [commit, notify, t]);
  const visit = useCallback((id: string) => {
    if (!wordById.has(id)) return;
    void commit(old => ({ ...old, recent: [id, ...old.recent.filter(item => item !== id)].slice(0, 20) })).catch(() => {});
  }, [commit]);

  const stop = useCallback(() => {
    speechId.current++;
    setSpeaking(null);
    void Speech.stop().catch(() => {});
  }, []);
  useEffect(() => { stop(); }, [pathname, stop]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state !== 'active') stop(); });
    return () => { listener.remove(); stop(); };
  }, [stop]);
  const play = useCallback(async (text: string) => {
    if (speaking === text) { stop(); return; }
    const request = ++speechId.current;
    setSpeaking(text);
    try {
      await Speech.stop();
      const voices = await Speech.getAvailableVoicesAsync();
      if (request !== speechId.current) return;
      const normalize = (s: string) => s.replace('_', '-').toLowerCase();
      const voice = voices.find(v => normalize(v.language) === normalize(current.current.preferences.accent)) ?? voices.find(v => v.language.startsWith('en'));
      if (voices.length && !voice) throw new Error('no-english-voice');
      if (voice && normalize(voice.language) !== normalize(current.current.preferences.accent)) notify(t('voiceFallback'));
      const done = () => { if (speechId.current === request) setSpeaking(null); };
      Speech.speak(text, {
        language: voice?.language ?? current.current.preferences.accent, voice: voice?.identifier,
        rate: current.current.preferences.slowSpeech ? 0.7 : 0.9,
        onDone: done, onStopped: done,
        onError: () => { if (speechId.current === request) { done(); notify(t('speechError')); } },
      });
    } catch { if (request === speechId.current) { setSpeaking(null); notify(t('speechError')); } }
  }, [notify, speaking, stop, t]);

  const importData = useCallback(async (incoming: UserData, preferImported: boolean) => {
    await commit(async old => {
      await writeStored('recovery', JSON.stringify(old));
      setHasRecovery(true);
      return mergeData(old, incoming, preferImported);
    });
  }, [commit]);
  const restore = useCallback(async () => {
    await commit(async () => {
      const raw = await readStored('recovery');
      if (!raw) throw new Error('no-recovery');
      return parseStoredData(raw);
    });
  }, [commit]);

  return <AppContext.Provider value={{ data, ready, loadError, language, speaking, toast, t,
    local: value => value[language], status: id => data.records[id]?.status ?? 'unknown',
    mark, setPreference, visit, play, stop, notify, importData, restore, hasRecovery, reload: () => setAttempt(a => a + 1),
  }}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('AppProvider is required');
  return value;
}
