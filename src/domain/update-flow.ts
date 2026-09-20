// Keep update decisions independent of React and native module loading.
interface UpdateService {
  checkForUpdateAsync(): Promise<{ isAvailable: boolean; isRollBackToEmbedded: boolean }>;
  fetchUpdateAsync(): Promise<{ isNew: boolean; isRollBackToEmbedded: boolean }>;
}
export async function prepareUpdate(service: UpdateService): Promise<'ready' | 'current'> {
  const check = await service.checkForUpdateAsync();
  if (!check.isAvailable && !check.isRollBackToEmbedded) return 'current';
  const fetched = await service.fetchUpdateAsync();
  if (fetched.isNew || fetched.isRollBackToEmbedded) return 'ready';
  throw new Error('Update was not downloaded');
}
export async function restartWithSavedData(flush: () => Promise<void>, reload: () => Promise<void>) {
  // A failed write must leave the running app open so the user can recover.
  await flush();
  await reload();
}
