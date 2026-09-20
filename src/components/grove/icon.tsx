import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type IconName = 'leaf' | 'home' | 'user' | 'arrow' | 'back' | 'search' | 'close' | 'check' | 'star' | 'sound' | 'stop' | 'filter' | 'tree' | 'book' | 'globe' | 'download' | 'upload' | 'chevron' | 'plus' | 'minus' | 'shield' | 'spark' | 'external' | 'undo' | 'refresh' | 'settings';
const paths: Partial<Record<IconName, string>> = {
  refresh: 'M20 7V3M20 7H16M20 7A9 9 0 0 0 4 8M4 17V21M4 17H8M4 17A9 9 0 0 0 20 16',
  settings: 'M4 6H20M4 12H20M4 18H20M8 4V8M16 10V14M10 16V20',
  leaf: 'M5 20C5 11 12 5 20 4C20 12 17 19 9 18M5 20L15 10',
  home: 'M3 10L12 3L21 10V20H15V14H9V20H3Z',
  user: 'M4 21C4 15 20 15 20 21M16 7A4 4 0 1 1 8 7A4 4 0 1 1 16 7',
  arrow: 'M4 12H20M14 6L20 12L14 18', back: 'M20 12H4M10 6L4 12L10 18',
  search: 'M16 16L21 21M18 10A8 8 0 1 1 2 10A8 8 0 1 1 18 10',
  close: 'M6 6L18 18M18 6L6 18', check: 'M5 12L10 17L20 7',
  star: 'M12 3L14.8 8.7L21 9.6L16.5 14L17.6 20.2L12 17.3L6.4 20.2L7.5 14L3 9.6L9.2 8.7Z',
  sound: 'M3 9H7L12 5V19L7 15H3ZM16 8C19 10 19 14 16 16M19 5C24 9 24 15 19 19',
  filter: 'M4 6H20M4 12H20M4 18H20M8 4V8M16 10V14M10 16V20',
  tree: 'M12 3V10M5 15V11H19V15M12 11V20',
  book: 'M12 6C8 3 4 4 2 5V20C6 18 9 18 12 21C15 18 18 18 22 20V5C19 4 15 3 12 6V21',
  globe: 'M21 12A9 9 0 1 1 3 12A9 9 0 1 1 21 12M3 12H21M12 3C6 9 6 15 12 21C18 15 18 9 12 3',
  download: 'M12 3V15M7 10L12 15L17 10M4 16V21H20V16',
  upload: 'M12 16V3M7 8L12 3L17 8M4 16V21H20V16',
  chevron: 'M9 5L16 12L9 19', plus: 'M5 12H19M12 5V19', minus: 'M5 12H19',
  shield: 'M12 3L21 7V12C21 17 16 20 12 22C8 20 3 17 3 12V7ZM8 12L11 15L17 9',
  spark: 'M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z',
  external: 'M14 3H21V10M21 3L10 14M10 4H4V20H20V14',
  undo: 'M4 10H14C22 10 22 21 14 21M4 10L10 4M4 10L10 16',
};
export function Icon({ name, size = 22, color = '#35735A', filled = false }: { name: IconName; size?: number; color?: string; filled?: boolean }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={true}>
    {name === 'stop' ? <Rect x={6} y={6} width={12} height={12} rx={3} fill={color} /> : <Path d={paths[name]} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} />}
    {name === 'tree' && <><Circle cx={12} cy={3} r={2} fill={color}/><Circle cx={5} cy={17} r={2} fill={color}/><Circle cx={19} cy={17} r={2} fill={color}/><Circle cx={12} cy={21} r={2} fill={color}/></>}
  </Svg>;
}
