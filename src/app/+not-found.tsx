import { router } from 'expo-router';
import { Button, Empty, Page } from '@/components/grove/ui';
import { useApp } from '@/state/app-context';
export default function NotFound() {
  const { t } = useApp();
  return <Page><Empty message={t('notFound')} action={<Button onPress={() => router.replace('/')}>{t('goHome')}</Button>}/></Page>;
}
