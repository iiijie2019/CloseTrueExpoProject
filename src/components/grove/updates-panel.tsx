import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { prepareUpdate, restartWithSavedData } from '@/domain/update-flow';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';
import { Button, SectionLabel, T, ui } from './ui';

export function UpdatesPanel() {
  const { language, flushPendingWrites, stop } = useApp();
  const label = (zh: string, en: string) => language === 'zh' ? zh : en;
  const updates = Updates.useUpdates();
  const [phase, setPhase] = useState<'idle' | 'checking' | 'current' | 'ready' | 'restarting' | 'error'>('idle');
  const [restartError, setRestartError] = useState(false);
  const inFlight = useRef(false);
  const available = Platform.OS !== 'web' && !__DEV__ && Constants.executionEnvironment !== 'storeClient' && Updates.isEnabled;
  const pending = updates.isUpdatePending || phase === 'ready';
  const busy = phase === 'checking' || phase === 'restarting' || updates.isChecking || updates.isDownloading || updates.isRestarting || updates.isStartupProcedureRunning;
  const check = async () => {
    if (!available || inFlight.current || busy) return;
    inFlight.current = true; setRestartError(false); setPhase('checking');
    try { setPhase(await prepareUpdate(Updates)); }
    catch { setPhase('error'); }
    finally { inFlight.current = false; }
  };
  const restart = async () => {
    if (!available || !pending || inFlight.current || busy) return;
    inFlight.current = true; setRestartError(false); setPhase('restarting');
    try { stop(); await restartWithSavedData(flushPendingWrites, () => Updates.reloadAsync()); }
    catch { setRestartError(true); setPhase('error'); }
    finally { inFlight.current = false; }
  };
  const error = phase === 'error' || (!busy && (updates.checkError || updates.downloadError));
  const message = !available
    ? Platform.OS === 'web'
      ? label('网页版通过重新打开页面获取最新内容。', 'Reopen the web page to load its latest content.')
      : label('在线更新在安装版中可用，开发预览暂不支持。', 'Online updates are available in an installed release, outside development preview.')
    : restartError ? label('未能重新打开应用，请重试。学习记录保存失败时不会重启。', 'Could not restart. Please try again. Restart is cancelled if saving your records fails.')
    : phase === 'restarting' ? label('正在保存记录并重新打开……', 'Saving your records and restarting…')
    : busy ? updates.isDownloading ? label('正在下载新内容……', 'Downloading new content…') : label('正在检查更新……', 'Checking for updates…')
    : pending ? label('新内容已就绪。重新打开后生效，已保存的学习记录会保留。', 'New content is ready. Restart to apply it; your saved learning records will be kept.')
    : error ? label('暂时无法获取更新，请检查网络后重试。你可以继续离线学习。', 'Could not get the update. Check your connection and try again. You can keep learning offline.')
    : phase === 'current' ? label('当前已是可用的最新版本。', 'You have the latest version available for this app.')
    : label('启动时自动检查新内容。你也可以在这里手动检查。', 'The app checks for new content on launch. You can also check here.');
  return <View style={{ marginTop: 31 }}><SectionLabel title={label('应用更新', 'App updates')}/><View style={ui.card}>
    <View style={[ui.row, { marginBottom: 10 }]}><T style={{ fontSize: 15, fontWeight: '600', flex: 1 }}>Word Grove · {Constants.expoConfig?.version ?? '1.0.0'}</T>{available && busy && <ActivityIndicator color={c.green}/>}</View>
    <T accessibilityLiveRegion="polite" style={{ color: c.muted, fontSize: 13, lineHeight: 23 }}>{message}</T>
    {available && <View style={{ marginTop: 18 }}><Button disabled={busy} onPress={() => void (pending ? restart() : check())} icon={pending ? 'undo' : 'download'}>{pending ? label('重新打开并应用', 'Restart & apply') : label('检查更新', 'Check for updates')}</Button></View>}
  </View></View>;
}
