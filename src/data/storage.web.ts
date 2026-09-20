// Native uses SQLite. The web preview keeps the same repository contract,
// without depending on experimental SQLite WASM deployment requirements.
export async function readStored(key: string): Promise<string | null> {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(`word-grove:${key}`);
}
export async function writeStored(key: string, value: string): Promise<void> {
  window.localStorage.setItem(`word-grove:${key}`, value);
}
