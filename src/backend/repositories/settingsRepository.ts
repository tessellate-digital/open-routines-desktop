import { db } from '../database';
import type { SettingRow, SettingCreate } from '../types';
import { encryptIfSecret, decryptIfSecret } from '../services/secureStorage';

function decryptRow(row: SettingRow): SettingRow {
  return { ...row, value: decryptIfSecret(row.value, row.is_secret === 1) };
}

export const settingsRepository = {
  findByKey(key: string): SettingRow | undefined {
    const row = db.prepare('SELECT * FROM settings WHERE key = ?').get(key) as
      | SettingRow
      | undefined;
    return row ? decryptRow(row) : undefined;
  },

  findAll(): SettingRow[] {
    const rows = db
      .prepare("SELECT * FROM settings WHERE key NOT LIKE '\\_%' ESCAPE '\\' ORDER BY key")
      .all() as SettingRow[];
    return rows.map(decryptRow);
  },

  upsert(data: SettingCreate): SettingRow {
    const now = new Date().toISOString();
    const encryptedValue = encryptIfSecret(data.value, data.is_secret ?? false);
    db.prepare(
      `
      INSERT INTO settings (key, value, is_secret, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, is_secret = excluded.is_secret, updated_at = excluded.updated_at
    `
    ).run(data.key, encryptedValue, data.is_secret ? 1 : 0, now);
    return this.findByKey(data.key)!;
  },

  exists(key: string): boolean {
    return !!db.prepare('SELECT key FROM settings WHERE key = ?').get(key);
  },

  delete(key: string): void {
    db.prepare('DELETE FROM settings WHERE key = ?').run(key);
  },
};
