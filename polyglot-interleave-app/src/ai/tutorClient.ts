import type { Lang } from '../interleave/planner';
export type Msg = { role: 'user' | 'assistant'; content: string };
// Đặt EXPO_PUBLIC_TUTOR_URL trỏ tới server/ (không để API key trong app).
const URL = process.env.EXPO_PUBLIC_TUTOR_URL ?? 'http://localhost:8787/tutor';

export async function askTutor(lang: Lang, messages: Msg[]): Promise<string> {
  const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang, messages }) });
  if (!res.ok) throw new Error(`Gia sư không phản hồi (${res.status})`);
  return (await res.json()).reply as string;
}
