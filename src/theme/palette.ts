import { Platform } from 'react-native';

export const palette = {
  background: '#F8FAF6', ink: '#263E35', muted: '#78867D', green: '#35735A',
  mint: '#E2F1E7', mintStrong: '#C7E4D1', peach: '#FAE9D8', orange: '#B97B4E',
  lavender: '#EEE9F6', purple: '#8A739E', blue: '#E4EFF5', blueInk: '#61839A',
  line: '#E5EAE2', white: '#FFFFFF',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' });
export const softShadow = { boxShadow: '0px 8px 30px rgba(43, 74, 53, 0.045)' } as const;
