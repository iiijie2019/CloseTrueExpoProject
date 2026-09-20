import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { AppGate, ToastHost } from '@/components/grove/ui';
import { AppProvider } from '@/state/app-context';
import { palette } from '@/theme/palette';

void SplashScreen.preventAutoHideAsync().catch(() => {});
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palette.background, primary: palette.green, text: palette.ink } };

export default function RootLayout() {
  const reduced = useReducedMotion();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);
  return <GestureHandlerRootView style={{ flex: 1 }}><ThemeProvider value={theme}><AppProvider>
    <StatusBar style="dark"/>
    <AppGate><Stack screenOptions={{ headerShown: false, animation: reduced ? 'none' : 'slide_from_right', contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Screen name="(tabs)"/><Stack.Screen name="words"/><Stack.Screen name="roots"/>
      <Stack.Screen name="root/[id]"/><Stack.Screen name="word/[id]"/>
      <Stack.Screen name="sentences"/><Stack.Screen name="sentence/[id]"/>
    </Stack></AppGate>
    <ToastHost/>
  </AppProvider></ThemeProvider></GestureHandlerRootView>;
}
