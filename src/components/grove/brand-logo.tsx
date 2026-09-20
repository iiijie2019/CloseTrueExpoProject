import { Image } from 'expo-image';

export function BrandLogo({ size = 44 }: { size?: number }) {
  return <Image source={require('../../../assets/images/icon.png')} accessibilityLabel="Word Grove · 词间" style={{ width: size, height: size, borderRadius: size * 0.26 }} contentFit="contain"/>;
}
