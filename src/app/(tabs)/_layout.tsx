import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Glass, Tap, T } from '@/components/grove/ui';
import { Icon } from '@/components/grove/icon';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';

export default function TabLayout() {
  const { t } = useApp();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false }} tabBar={({ state, navigation }) => <View style={{ pointerEvents: 'box-none', position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 16), alignItems: 'center' }}>
    <Glass style={{ flexDirection: 'row', width: '100%', maxWidth: 420, padding: 7, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: '#FFFFFF', boxShadow: '0px 10px 36px rgba(40,70,48,0.11)' }}>
      {state.routes.map((route, index) => {
        const active = state.index === index;
        return <Tap key={route.key} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!active && !event.defaultPrevented) navigation.navigate(route.name);
        }} style={{ flex: 1, flexDirection: 'row', gap: 9, minHeight: 52, borderRadius: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: active ? '#DEECDA' : 'transparent' }}>
          <Icon name={index === 0 ? 'home' : 'user'} size={20} color={active ? c.green : '#8C9789'}/>
          <T style={{ fontSize: 13, color: active ? c.green : '#8C9789', fontWeight: active ? '600' : '400' }}>{t(index === 0 ? 'home' : 'mine')}</T>
        </Tap>;
      })}
    </Glass>
  </View>}>
    <Tabs.Screen name="index" options={{ title: t('home') }}/>
    <Tabs.Screen name="mine" options={{ title: t('mine') }}/>
  </Tabs>;
}
