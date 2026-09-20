import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type PressableProps, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/state/app-context';
import { palette as c, serif, softShadow } from '@/theme/palette';
import { Icon, type IconName } from './icon';

export function T({ style, ...props }: TextProps) { return <Text {...props} style={[{ color: c.ink, fontSize: 15, lineHeight: 23 }, style]} />; }
export function Title({ children, small = false }: React.PropsWithChildren<{ small?: boolean }>) {
  const { language } = useApp();
  return <T accessibilityRole="header" style={{ fontSize: small ? 26 : language === 'zh' ? 34 : 43, lineHeight: small ? 36 : language === 'zh' ? 46 : 51, fontFamily: language === 'en' ? serif : undefined, fontWeight: language === 'zh' ? '600' : '400', letterSpacing: -0.7 }}>{children}</T>;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function Tap({ children, style, disabled, onPressIn, onPressOut, ...props }: Omit<PressableProps, 'style' | 'children'> & { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const reduced = useReducedMotion();
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <AnimatedPressable {...props} disabled={disabled} aria-disabled={disabled ?? undefined} aria-expanded={props['aria-expanded'] ?? props.accessibilityState?.expanded} aria-selected={props.accessibilityRole === 'tab' ? props.accessibilityState?.selected : undefined} accessibilityRole={props.accessibilityRole ?? 'button'} style={[style, motion, disabled && { opacity: 0.5 }]} onPressIn={e => { if (!reduced) scale.value = withSpring(0.975, { damping: 20, stiffness: 320 }); onPressIn?.(e); }} onPressOut={e => { scale.value = withSpring(1, { damping: 15, stiffness: 230 }); onPressOut?.(e); }}>{children}</AnimatedPressable>;
}
export function Reveal({ children, delay = 0, style }: React.PropsWithChildren<{ delay?: number; style?: StyleProp<ViewStyle> }>) {
  const reduced = useReducedMotion();
  return <Animated.View entering={reduced ? undefined : FadeInDown.duration(430).delay(delay)} exiting={reduced ? undefined : FadeOut.duration(160)} layout={reduced ? undefined : LinearTransition.duration(240)} style={style}>{children}</Animated.View>;
}
export function Glass({ children, style }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  if (Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable()) return <GlassView colorScheme="light" glassEffectStyle="regular" style={style}>{children}</GlassView>;
  if (Platform.OS === 'android') return <View style={[{ backgroundColor: 'rgba(252,254,249,0.96)' }, style]}>{children}</View>;
  return <BlurView tint="light" intensity={70} style={[{ backgroundColor: 'rgba(252,254,249,0.78)' }, style]}>{children}</BlurView>;
}
export function Page({ children, tabs = false, narrow = false, onEndReached }: React.PropsWithChildren<{ tabs?: boolean; narrow?: boolean; onEndReached?: () => void }>) {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: c.background }}>
    <LinearGradient colors={['#EDF4E9', '#F8FAF6', '#FBF9F4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.8 }} style={StyleSheet.absoluteFill}/>
    <ScrollView onScroll={onEndReached ? ({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => { if (contentOffset.y > 0 && layoutMeasurement.height + contentOffset.y >= contentSize.height - 240) onEndReached(); } : undefined} scrollEventThrottle={100} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: Math.max(insets.top, 18), paddingBottom: tabs ? 124 + insets.bottom : 36 + insets.bottom, flexGrow: 1 }}>
      <View style={{ width: '100%', maxWidth: narrow ? 780 : 1040, alignSelf: 'center', paddingHorizontal: 16 }}>{children}</View>
    </ScrollView>
  </View>;
}
export function PageHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const { t } = useApp();
  return <View style={s.header}>
    <Tap accessibilityLabel={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={s.iconButton}><Icon name="back"/></Tap>
    <T style={{ flex: 1, fontSize: 16, fontWeight: '600' }}>{title}</T>{right}
  </View>;
}
export function SectionLabel({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 }}><View style={{ flex: 1 }}><T accessibilityRole="header" style={{ fontSize: 20, lineHeight: 29, fontWeight: '600', letterSpacing: -0.3 }}>{title}</T>{subtitle && <T style={{ color: c.muted, fontSize: 13, marginTop: 3 }}>{subtitle}</T>}</View>{right}</View>;
}
export function Chip({ label, selected, onPress, icon, tint = 'green' }: { label: string; selected?: boolean; onPress: () => void; icon?: IconName; tint?: 'green' | 'orange' }) {
  const color = tint === 'orange' ? c.orange : c.green;
  return <Tap onPress={onPress} accessibilityState={{ selected: !!selected }} aria-pressed={!!selected} style={[s.chip, selected && { backgroundColor: tint === 'orange' ? c.peach : c.mint, borderColor: tint === 'orange' ? '#EDD6C0' : '#CEE0D0' }]}>{icon && <Icon name={icon} size={15} color={selected ? color : c.muted}/>}<T style={{ fontSize: 13, fontWeight: selected ? '600' : '400', color: selected ? color : c.muted }}>{label}</T></Tap>;
}
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (text: string) => void; placeholder: string }) {
  const { t } = useApp();
  return <View style={s.search}><Icon name="search" size={20} color={c.muted}/><TextInput accessibilityLabel={placeholder} placeholder={placeholder} placeholderTextColor="#98A196" value={value} onChangeText={onChange} autoCapitalize="none" autoCorrect={false} returnKeyType="search" style={{ flex: 1, minWidth: 0, color: c.ink, fontSize: 15, paddingVertical: 14, outlineWidth: 0 } as never}/>{!!value && <Tap accessibilityLabel={t('clearSearch')} onPress={() => onChange('')} style={{ padding: 9 }}><Icon name="close" size={18} color={c.muted}/></Tap>}</View>;
}
export function Empty({ message, detail, action }: { message: string; detail?: string; action?: React.ReactNode }) {
  return <Reveal style={{ paddingVertical: 50, alignItems: 'center', gap: 15 }}><View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: c.mint, alignItems: 'center', justifyContent: 'center' }}><Icon name="leaf" size={28}/></View><T style={{ fontSize: 20, fontWeight: '500', textAlign: 'center' }}>{message}</T>{detail && <T style={{ color: c.muted, textAlign: 'center', maxWidth: 330 }}>{detail}</T>}{action}</Reveal>;
}
export function Button({ children, onPress, secondary = false, disabled = false, icon }: React.PropsWithChildren<{ onPress: () => void; secondary?: boolean; disabled?: boolean; icon?: IconName }>) {
  return <Tap disabled={disabled} onPress={onPress} style={[s.button, { backgroundColor: secondary ? '#EDF2E9' : c.green }]}><T style={{ color: secondary ? c.green : '#fff', fontWeight: '600', textAlign: 'center' }}>{children}</T>{icon && <Icon name={icon} size={18} color={secondary ? c.green : '#fff'}/>}</Tap>;
}
export function AppGate({ children }: React.PropsWithChildren) {
  const { ready, loadError, reload, t } = useApp();
  if (loadError) return <Page><Empty message={t('loadError')} action={<Button onPress={reload}>{t('retry')}</Button>}/></Page>;
  if (!ready) return <View style={{ flex: 1, backgroundColor: c.background, justifyContent: 'center', alignItems: 'center', gap: 20 }}><ActivityIndicator color={c.green}/><T>{t('loading')}</T></View>;
  return children;
}
export function ToastHost() {
  const { toast, t } = useApp();
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return <Animated.View key={toast.id} entering={reduced ? undefined : FadeInDown.duration(200)} exiting={reduced ? undefined : FadeOut.duration(170)} style={{ position: 'absolute', bottom: 100 + insets.bottom, left: 20, right: 20, alignItems: 'center', pointerEvents: 'box-none' }}>
    <View accessibilityLiveRegion="polite" style={{ backgroundColor: '#294D3C', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 15, maxWidth: 600, flexDirection: 'row', alignItems: 'center', gap: 18, ...softShadow }}><T style={{ color: '#fff', flexShrink: 1, fontSize: 13 }}>{toast.text}</T>{toast.action && <Tap onPress={toast.action} style={{ padding: 5 }}><T style={{ color: '#DBEFC5', fontWeight: '700', fontSize: 13 }}>{t('undo')}</T></Tap>}</View>
  </Animated.View>;
}
export const ui = StyleSheet.create({
  card: { borderRadius: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.83)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.95)', ...softShadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: c.muted },
  muted: { color: c.muted, fontSize: 13 },
});
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 27, minHeight: 52 },
  iconButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF' },
  chip: { minHeight: 42, paddingHorizontal: 15, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, backgroundColor: '#F7F8F3', borderWidth: 1, borderColor: '#ECF0E7' },
  search: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 17, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E7ECE2', ...softShadow },
  button: { minHeight: 50, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
});
