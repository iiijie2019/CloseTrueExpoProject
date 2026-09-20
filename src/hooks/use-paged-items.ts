import { useState } from 'react';

export const PAGE_SIZE = 30;

export function usePagedItems<T>(items: readonly T[], resetKey: string) {
  const [page, setPage] = useState({ key: resetKey, count: PAGE_SIZE });
  if (page.key !== resetKey) setPage({ key: resetKey, count: PAGE_SIZE });
  const count = page.key === resetKey ? page.count : PAGE_SIZE;
  return {
    items: items.slice(0, count),
    hasMore: count < items.length,
    loadMore: () => setPage(old => ({ key: resetKey, count: Math.min((old.key === resetKey ? old.count : PAGE_SIZE) + PAGE_SIZE, Math.max(PAGE_SIZE, items.length)) })),
  };
}
