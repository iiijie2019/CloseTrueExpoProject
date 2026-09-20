import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseAsync('word-grove-user.db').then(async db => {
  await db.execAsync('PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS app_data (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);');
  return db;
});
export async function readStored(key: string): Promise<string | null> {
  const row = await (await database).getFirstAsync<{ value: string }>('SELECT value FROM app_data WHERE key = ?', key);
  return row?.value ?? null;
}
export async function writeStored(key: string, value: string): Promise<void> {
  await (await database).runAsync('INSERT INTO app_data (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, value);
}
