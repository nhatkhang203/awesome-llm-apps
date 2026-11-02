// Lặp lại ngắt quãng: 1 -> 3 -> 7 -> 14 ngày. Sai thì quay về 1 ngày.
export const INTERVALS = [1, 3, 7, 14] as const;
const DAY = 86_400_000;

export type ReviewState = { stage: number; dueAt: number };

export function initialState(now: number): ReviewState {
  return { stage: 0, dueAt: now };
}

export function grade(state: ReviewState, correct: boolean, now: number): ReviewState {
  if (!correct) return { stage: 0, dueAt: now + INTERVALS[0] * DAY };
  const stage = Math.min(state.stage + 1, INTERVALS.length - 1);
  return { stage, dueAt: now + INTERVALS[stage] * DAY };
}

export const isMastered = (s: ReviewState) => s.stage >= INTERVALS.length - 1;
export const isDue = (s: ReviewState, now: number) => s.dueAt <= now;

// Trộn thẻ giữa các ngôn ngữ (Fisher-Yates), tránh 2 thẻ cùng ngôn ngữ liền nhau khi có thể.
export function interleaveCards<T extends { lang: string }>(cards: T[], rnd: () => number = Math.random): T[] {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  for (let i = 1; i < a.length; i++) {
    if (a[i].lang === a[i - 1].lang) {
      const k = a.findIndex((c, idx) => idx > i && c.lang !== a[i - 1].lang);
      if (k > -1) [a[i], a[k]] = [a[k], a[i]];
    }
  }
  return a;
}
