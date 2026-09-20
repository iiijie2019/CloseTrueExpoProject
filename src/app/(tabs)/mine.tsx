import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Linking, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/grove/icon';
import { Button, Chip, Glass, Page, Reveal, SectionLabel, Tap, T, Title, ui } from '@/components/grove/ui';
import { morphemes, wordById, words } from '@/data/lexicon';
import { decodeBackup, encodeBackup, previewImport } from '@/domain/backup';
import { exportBackup, pickBackup } from '@/platform/backup-files';
import { useApp } from '@/state/app-context';
import { palette as c, serif } from '@/theme/palette';

export default function MineScreen() {
  const { t, data, setPreference, language, notify, importData, restore, hasRecovery } = useApp();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<ReturnType<typeof decodeBackup> | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const records = Object.values(data.records).filter(record => wordById.has(record.wordId));
  const unmatched = Object.keys(data.records).filter(id => !wordById.has(id)).length;
  const preview = pending ? previewImport(data, pending.data, new Set(wordById.keys())) : null;

  const exportFile = async () => {
    setBusy(true);
    try { await exportBackup(encodeBackup(data)); notify(t('exportSuccess')); }
    catch { notify(t('operationError')); }
    finally { setBusy(false); }
  };
  const importFile = async () => {
    setBusy(true);
    try { const raw = await pickBackup(); if (raw !== null) setPending(decodeBackup(raw)); }
    catch { notify(t('invalidBackup')); }
    finally { setBusy(false); }
  };
  const merge = async (preferImported: boolean) => {
    if (!pending) return;
    setBusy(true);
    try { await importData(pending.data, preferImported); setPending(null); notify(t('importDone')); }
    catch { notify(t('operationError')); }
    finally { setBusy(false); }
  };
  const restoreBackup = async () => {
    setBusy(true);
    try { await restore(); notify(t('restoreDone')); }
    catch { notify(t('operationError')); }
    finally { setBusy(false); }
  };
  return <Page tabs narrow>
    <Reveal><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, marginBottom: 26 }}><T style={{ fontFamily: serif, fontSize: 21 }}>Word Grove</T><View style={[ui.row, { gap: 6, backgroundColor: '#E9F1E3', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20 }]}><Icon name="shield" size={13}/><T style={{ fontSize: 10, color: c.green }}>{t('localBadge')}</T></View></View>
      <View style={{ alignSelf: 'flex-start', backgroundColor: '#E0EDDA', borderRadius: 24, width: 66, height: 66, justifyContent: 'center', alignItems: 'center', marginBottom: 21 }}><Icon name="leaf" size={33}/></View><Title small>{t('profileTitle')}</Title><T style={{ color: c.muted, fontSize: 13, lineHeight: 23, marginTop: 10 }}>{t('profileSub')}</T>
    </Reveal>
    <Reveal delay={80} style={[ui.card, { marginTop: 26, marginBottom: 31 }]}><T style={{ fontSize: 14, fontWeight: '600' }}>{t('yourCollection')}</T><T style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>{t('collectionSub', { count: records.length })}</T><View style={{ flexDirection: 'row', marginTop: 21 }}>{(['known', 'focus', 'unknown'] as const).map((status, index) => <Tap key={status} onPress={() => router.push({ pathname: '/words', params: { status, scope: 'marked' } })} style={{ flex: 1, alignItems: 'center', borderLeftWidth: index ? 1 : 0, borderLeftColor: c.line }}><T style={{ fontFamily: serif, fontSize: 33, lineHeight: 43, color: status === 'focus' ? c.orange : c.green }}>{records.filter(record => record.status === status).length}</T><T style={{ fontSize: 11, color: c.muted }}>{t(status)}</T></Tap>)}</View></Reveal>

    <Reveal delay={120}><SectionLabel title={t('preferences')}/><View style={ui.card}>
      <View style={ui.row}><Icon name="globe" size={18}/><T style={s.settingTitle}>{t('language')}</T></View><T style={[ui.muted, { fontSize: 11, marginVertical: 10 }]}>{t('languageHint')}</T>
      <View style={ui.chips}>{(['system', 'zh', 'en'] as const).map(value => <Chip key={value} label={t(value === 'zh' ? 'chinese' : value === 'en' ? 'english' : 'system')} selected={data.preferences.language === value} onPress={() => void setPreference('language', value)}/>)}</View>
      <View style={s.divider}/><View style={[ui.row, { marginBottom: 14 }]}><Icon name="sound" size={18}/><T style={s.settingTitle}>{t('accent')}</T></View><View style={ui.chips}>{(['en-US', 'en-GB'] as const).map(value => <Chip key={value} label={t(value === 'en-US' ? 'american' : 'british')} selected={data.preferences.accent === value} onPress={() => void setPreference('accent', value)}/>)}</View>
      <View style={s.divider}/><T style={[s.settingTitle, { marginBottom: 13 }]}>{t('speechRate')}</T><View style={ui.chips}><Chip label={t('normal')} selected={!data.preferences.slowSpeech} onPress={() => void setPreference('slowSpeech', false)}/><Chip label={t('slow')} selected={data.preferences.slowSpeech} onPress={() => void setPreference('slowSpeech', true)}/></View>
    </View></Reveal>

    <Reveal delay={180} style={{ marginTop: 31 }}><SectionLabel title={t('dataTitle')} subtitle={t('dataSub')}/><View style={[ui.card, { paddingVertical: 5 }]}>
      <SettingRow icon="download" title={t('export')} description={t('exportHint')} onPress={() => void exportFile()} disabled={busy}/>
      <View style={{ height: 1, backgroundColor: c.line }}/><SettingRow icon="upload" title={t('import')} description={t('importHint')} onPress={() => void importFile()} disabled={busy}/>
      {hasRecovery && <><View style={{ height: 1, backgroundColor: c.line }}/><SettingRow icon="undo" title={t('restore')} description={t('restoreHint')} onPress={() => void restoreBackup()} disabled={busy}/></>}
    </View>{busy && <ActivityIndicator color={c.green} style={{ marginTop: 12 }}/>}<T style={{ fontSize: 11, color: '#9BA590', lineHeight: 20, marginTop: 13, paddingHorizontal: 3 }}>{t('dataFoot')}</T>{unmatched > 0 && <T style={{ fontSize: 12, color: c.orange, marginTop: 10 }}>{t('unmatched', { count: unmatched })}</T>}</Reveal>

    <Reveal delay={220} style={{ marginTop: 30 }}><Tap accessibilityState={{ expanded: aboutOpen }} onPress={() => setAboutOpen(v => !v)} style={[ui.card, { backgroundColor: '#EDF3E6' }]}><View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}><Icon name="leaf" size={24}/><View style={{ flex: 1 }}><T style={{ fontSize: 16, fontWeight: '500' }}>{t('about')}</T><T style={{ fontSize: 10, color: '#8D9B7F', marginTop: 5 }}>{t('aboutSub', { words: words.length, roots: morphemes.length })}</T></View><Icon name={aboutOpen ? 'minus' : 'plus'} size={17}/></View></Tap>
      {aboutOpen && <Reveal style={{ padding: 19, gap: 13 }}><T style={{ fontSize: 12, color: c.muted, lineHeight: 23 }}>{t('contentNote')}</T><T style={{ fontSize: 11, color: c.muted, lineHeight: 21 }}>{t('aboutSource')}</T><Tap onPress={() => void Linking.openURL('https://morphemelexicon.com/#/r/patho').catch(() => notify(t('sourceUnavailable')))} style={ui.row}><T style={{ fontSize: 12, color: c.green }}>{t('referenceWebsite')}</T><Icon name="external" size={13}/></Tap></Reveal>}
    </Reveal><T style={{ fontFamily: serif, color: '#A6AD9A', fontSize: 12, textAlign: 'center', marginTop: 30 }}>Word Grove · 1.0</T>

    <Modal visible={!!pending} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={() => { if (!busy) setPending(null); }}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(36,55,37,0.28)', alignItems: 'center' }}>
        <Glass style={{ width: '100%', maxWidth: 640, maxHeight: '85%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' }}>
          <ScrollView contentContainerStyle={{ padding: 26, paddingBottom: 30 + insets.bottom }}>
            <View style={{ width: 36, height: 4, backgroundColor: '#CED9C6', alignSelf: 'center', borderRadius: 2, marginBottom: 25 }}/>
            <View style={[ui.row, { justifyContent: 'space-between', marginBottom: 17 }]}><T style={{ fontSize: 22, fontWeight: '600', flex: 1 }}>{t('importTitle')}</T><Tap disabled={busy} accessibilityLabel={t('close')} onPress={() => setPending(null)} style={{ padding: 10 }}><Icon name="close" size={18}/></Tap></View>
            {pending && <T style={ui.muted}>{t('backupDate', { date: new Date(pending.exportedAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US') })}</T>}
            {preview && <View style={{ padding: 17, borderRadius: 16, backgroundColor: c.mint, marginVertical: 20 }}><T style={{ color: c.green, fontSize: 13 }}>{t('importPreview', preview)}</T></View>}
            <T style={{ color: c.muted, fontSize: 13, lineHeight: 23, marginBottom: 23 }}>{t('importBody')}</T>
            <View style={{ gap: 11 }}><Button disabled={busy} onPress={() => void merge(false)}>{t('keepLocal')}</Button><Button disabled={busy} secondary onPress={() => void merge(true)}>{t('useImported')}</Button><Tap disabled={busy} onPress={() => setPending(null)} style={{ alignItems: 'center', padding: 12 }}><T style={{ color: c.muted }}>{t('cancel')}</T></Tap></View>
          </ScrollView>
        </Glass>
      </View>
    </Modal>
  </Page>;
}
function SettingRow({ icon, title, description, onPress, disabled }: { icon: IconName; title: string; description: string; onPress: () => void; disabled?: boolean }) {
  return <Tap disabled={disabled} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 }}><View style={{ width: 39, height: 39, backgroundColor: '#EFF4E8', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18}/></View><View style={{ flex: 1 }}><T style={{ fontSize: 14, fontWeight: '500' }}>{title}</T><T style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>{description}</T></View><Icon name="chevron" size={15} color="#A3AF98"/></Tap>;
}
const s = StyleSheet.create({ settingTitle: { fontSize: 14, fontWeight: '600' }, divider: { height: 1, backgroundColor: c.line, marginVertical: 22 } });
