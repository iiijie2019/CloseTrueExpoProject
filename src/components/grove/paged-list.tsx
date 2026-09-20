import { useEffect, useRef, type ReactElement } from 'react';
import { FlatList, View, type ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePagedItems } from '@/hooks/use-paged-items';
import { useApp } from '@/state/app-context';
import { palette as c } from '@/theme/palette';
import { Button, T } from './ui';

export function PageProgress({ shown, total, loadMore }: { shown: number; total: number; loadMore?: () => void }) {
  const { t } = useApp();
  if (!total) return null;
  return <View style={{ alignItems: 'center', gap: 10, paddingVertical: 20 }}>
    <T style={{ fontSize: 12, color: c.muted }}>{t('loadedCount', { shown, total })}{!loadMore ? ` · ${t('allLoaded')}` : ''}</T>
    {loadMore && <Button secondary onPress={loadMore}>{t('loadMore')}</Button>}
  </View>;
}

export function PagedList<T extends { id: string }>({ items, resetKey, header, renderItem, empty, columns = 1 }: {
  items: T[]; resetKey: string; header: ReactElement; renderItem: ListRenderItem<T>; empty?: ReactElement; columns?: number;
}) {
  const page = usePagedItems(items, resetKey);
  const list = useRef<FlatList<T>>(null);
  useEffect(() => { list.current?.scrollToOffset({ offset: 0, animated: false }); }, [resetKey]);
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: c.background }}><FlatList
    ref={list} key={columns} data={page.items} numColumns={columns} keyExtractor={item => item.id}
    keyboardShouldPersistTaps="handled" initialNumToRender={10} maxToRenderPerBatch={10} windowSize={7}
    onEndReached={page.hasMore ? page.loadMore : undefined} onEndReachedThreshold={0.3}
    contentContainerStyle={{ width: '100%', maxWidth: 1040, alignSelf: 'center', paddingHorizontal: 16, paddingTop: Math.max(insets.top, 18), paddingBottom: 35 + insets.bottom }}
    columnWrapperStyle={columns > 1 ? { gap: 14 } : undefined}
    ListHeaderComponent={header} renderItem={renderItem} ListEmptyComponent={empty}
    ListFooterComponent={<PageProgress shown={page.items.length} total={items.length} loadMore={page.hasMore ? page.loadMore : undefined}/>}
  /></View>;
}
