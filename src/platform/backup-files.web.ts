import * as DocumentPicker from 'expo-document-picker';

export async function pickBackup(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain'], base64: false });
  if (result.canceled) return null;
  const file = result.assets[0].file;
  if (!file || file.size > 20 * 1024 * 1024) throw new Error('invalid-backup');
  return await file.text();
}
export async function exportBackup(text: string): Promise<void> {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `word-grove-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
