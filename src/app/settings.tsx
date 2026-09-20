import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/grove/icon';
import { UpdatesPanel } from '@/components/grove/updates-panel';
import { Button, Chip, Glass, Page, Reveal, SectionLabel, Tap, T, PageHeader, ui } from '@/components/grove/ui';
import { wordById } from '@/data/lexicon';
import { decodeBackup, encodeBackup, previewImport } from '@/domain/backup';
import { exportBackup, pickBackup } from '@/platform/backup-files';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';

export default function SettingsScreen() {
  const { t, data, setPreference, language, notify, importData, restore, hasRecovery } = useApp();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<ReturnType<typeof decodeBackup> | null>(null);
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
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
  return <Page narrow>
    <PageHeader title={t('settings')}/>
    <Reveal delay={120}><SectionLabel title={t('preferences')}/><View style={ui.card}>
      <View style={ui.row}><Icon name="globe" size={18}/><T style={s.settingTitle}>{t('language')}</T></View><T style={[ui.muted, { fontSize: 11, marginVertical: 10 }]}>{t('languageHint')}</T>
      <View style={ui.chips}>{(['system', 'zh', 'en'] as const).map(value => <Chip key={value} label={t(value === 'zh' ? 'chinese' : value === 'en' ? 'english' : 'system')} selected={data.preferences.language === value} onPress={() => void setPreference('language', value)}/>)}</View>
      <View style={s.divider}/><View style={[ui.row, { marginBottom: 14 }]}><Icon name="sound" size={18}/><T style={s.settingTitle}>{t('accent')}</T></View><View style={ui.chips}>{(['en-US', 'en-GB'] as const).map(value => <Chip key={value} label={t(value === 'en-US' ? 'american' : 'british')} selected={data.preferences.accent === value} onPress={() => void setPreference('accent', value)}/>)}</View>
      <View style={s.divider}/><T style={[s.settingTitle, { marginBottom: 13 }]}>{t('speechRate')}</T><View style={ui.chips}><Chip label={t('normal')} selected={!data.preferences.slowSpeech} onPress={() => void setPreference('slowSpeech', false)}/><Chip label={t('slow')} selected={data.preferences.slowSpeech} onPress={() => void setPreference('slowSpeech', true)}/></View>
    </View></Reveal>

    <UpdatesPanel/>
    <Reveal delay={180} style={{ marginTop: 31 }}><SectionLabel title={t('dataTitle')} subtitle={t('dataSub')}/><View style={ui.card}>
      <SettingRow icon="download" title={t('export')} description={t('exportHint')} onPress={() => void exportFile()} disabled={busy}/>
      <View style={{ height: 1, backgroundColor: c.line }}/><SettingRow icon="upload" title={t('import')} description={t('importHint')} onPress={() => void importFile()} disabled={busy}/>
      {hasRecovery && <><View style={{ height: 1, backgroundColor: c.line }}/><SettingRow icon="undo" title={t('restore')} description={t('restoreHint')} onPress={() => void restoreBackup()} disabled={busy}/></>}
    </View>{busy && <ActivityIndicator color={c.green} style={{ marginTop: 12 }}/>}<T style={{ fontSize: 11, color: '#9BA590', lineHeight: 20, marginTop: 13, paddingHorizontal: 3 }}>{t('dataFoot')}</T>{unmatched > 0 && <T style={{ fontSize: 12, color: c.orange, marginTop: 10 }}>{t('unmatched', { count: unmatched })}</T>}</Reveal>

    <Modal visible={!!pending} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={() => { if (!busy) setPending(null); }}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(36,55,37,0.28)', alignItems: 'center' }}>
        <Glass style={{ width: '100%', maxWidth: 640, maxHeight: '85%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 26, paddingTop: 13, paddingBottom: 20 + insets.bottom }}>
            <View style={{ width: 36, height: 4, backgroundColor: '#CED9C6', alignSelf: 'center', borderRadius: 2, marginBottom: 25 }}/>
            <View style={[ui.row, { justifyContent: 'space-between', marginBottom: 17 }]}><T style={{ fontSize: 22, fontWeight: '600', flex: 1 }}>{t('importTitle')}</T><Tap disabled={busy} accessibilityLabel={t('close')} onPress={() => setPending(null)} style={{ padding: 10 }}><Icon name="close" size={18}/></Tap></View>
            {pending && <T style={ui.muted}>{t('backupDate', { date: new Date(pending.exportedAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US') })}</T>}
            {preview && <View style={{ paddingHorizontal: 18, paddingVertical: 9, borderRadius: 16, backgroundColor: c.mint, marginVertical: 20 }}><T style={{ color: c.green, fontSize: 13 }}>{t('importPreview', preview)}</T></View>}
            <T style={{ color: c.muted, fontSize: 13, lineHeight: 23, marginBottom: 23 }}>{t('importBody')}</T>
            <View style={{ gap: 11 }}><Button disabled={busy} onPress={() => void merge(false)}>{t('keepLocal')}</Button><Button disabled={busy} secondary onPress={() => void merge(true)}>{t('useImported')}</Button><Tap disabled={busy} onPress={() => setPending(null)} style={{ alignItems: 'center', padding: 12 }}><T style={{ color: c.muted }}>{t('cancel')}</T></Tap></View>
          </ScrollView>
        </Glass>
      </View>
    </Modal>
  </Page>;
}
function SettingRow({ icon, title, description, onPress, disabled }: { icon: IconName; title: string; description: string; onPress: () => void; disabled?: boolean }) {
  return <Tap disabled={disabled} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}><View style={{ width: 39, height: 39, backgroundColor: '#EFF4E8', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18}/></View><View style={{ flex: 1 }}><T style={{ fontSize: 14, fontWeight: '500' }}>{title}</T><T style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>{description}</T></View><Icon name="chevron" size={15} color="#A3AF98"/></Tap>;
}
const s = StyleSheet.create({ settingTitle: { fontSize: 14, fontWeight: '600' }, divider: { height: 1, backgroundColor: c.line, marginVertical: 22 } });
