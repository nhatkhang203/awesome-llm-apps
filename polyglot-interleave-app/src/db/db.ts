import * as SQLite from 'expo-sqlite';
import { SEED_CARDS } from '../content/cards';
import { grade, initialState, isMastered, type ReviewState } from '../srs/scheduler';
import type { Lang, Block } from '../interleave/planner';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
export function getDb() {
  if (!dbPromise) dbPromise = init();
  return dbPromise;
}

async function init() {
  const db = await SQLite.openDatabaseAsync('polyglot.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cards (id TEXT PRIMARY KEY, lang TEXT, deck TEXT, front TEXT, back TEXT, note TEXT);
    CREATE TABLE IF NOT EXISTS reviews (card_id TEXT PRIMARY KEY, stage INTEGER, due_at INTEGER);
    CREATE TABLE IF NOT EXISTS sessions (day TEXT, idx INTEGER, lang TEXT, skill TEXT, minutes INTEGER, done INTEGER, PRIMARY KEY(day, idx));
  `);
  const now = Date.now();
  for (const c of SEED_CARDS) {
    await db.runAsync('INSERT OR IGNORE INTO cards VALUES (?,?,?,?,?,?)', c.id, c.lang, c.deck, c.front, c.back, c.note ?? null);
    await db.runAsync('INSERT OR IGNORE INTO reviews VALUES (?,?,?)', c.id, 0, now);
  }
  return db;
}

export type DueCard = { id: string; lang: Lang; deck: string; front: string; back: string; note: string | null };

export async function dueCards(limit = 20): Promise<DueCard[]> {
  const db = await getDb();
  return db.getAllAsync<DueCard>(
    'SELECT c.* FROM cards c JOIN reviews r ON r.card_id=c.id WHERE r.due_at<=? ORDER BY r.due_at LIMIT ?', Date.now(), limit);
}

export async function gradeCard(id: string, correct: boolean) {
  const db = await getDb();
  const row = await db.getFirstAsync<{ stage: number; due_at: number }>('SELECT stage, due_at FROM reviews WHERE card_id=?', id);
  const cur: ReviewState = row ? { stage: row.stage, dueAt: row.due_at } : initialState(Date.now());
  const next = grade(cur, correct, Date.now());
  await db.runAsync('INSERT OR REPLACE INTO reviews VALUES (?,?,?)', id, next.stage, next.dueAt);
}

export async function masteredByLang(): Promise<Record<Lang, { mastered: number; total: number }>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ lang: Lang; stage: number }>('SELECT c.lang, r.stage FROM cards c JOIN reviews r ON r.card_id=c.id');
  const out = { zh: { mastered: 0, total: 0 }, fr: { mastered: 0, total: 0 }, en: { mastered: 0, total: 0 } };
  for (const r of rows) { out[r.lang].total++; if (isMastered({ stage: r.stage, dueAt: 0 })) out[r.lang].mastered++; }
  return out;
}

export async function ensureDay(day: string, blocks: Block[]) {
  const db = await getDb();
  for (let i = 0; i < blocks.length; i++)
    await db.runAsync('INSERT OR IGNORE INTO sessions VALUES (?,?,?,?,?,0)', day, i, blocks[i].lang, blocks[i].skill, blocks[i].minutes);
}
export async function setBlockDone(day: string, idx: number, done: boolean) {
  const db = await getDb();
  await db.runAsync('UPDATE sessions SET done=? WHERE day=? AND idx=?', done ? 1 : 0, day, idx);
}
export async function doneMap(day: string): Promise<Record<number, boolean>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ idx: number; done: number }>('SELECT idx, done FROM sessions WHERE day=?', day);
  return Object.fromEntries(rows.map(r => [r.idx, !!r.done]));
}
// Chuỗi ngày: số ngày liên tiếp (tính ngược từ hôm nay) có ít nhất 1 khối hoàn thành.
export async function streak(): Promise<number> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ day: string }>('SELECT DISTINCT day FROM sessions WHERE done=1 ORDER BY day DESC');
  const days = new Set(rows.map(r => r.day));
  let n = 0; const d = new Date();
  while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
