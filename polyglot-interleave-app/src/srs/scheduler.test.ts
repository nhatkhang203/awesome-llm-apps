import { grade, initialState, INTERVALS, interleaveCards } from './scheduler';
const DAY = 86_400_000;
test('đúng liên tiếp đi 1→3→7→14 ngày', () => {
  let s = initialState(0); const got: number[] = [];
  for (let i = 0; i < 4; i++) { s = grade(s, true, 0); got.push(s.dueAt / DAY); }
  expect(got).toEqual([3, 7, 14, 14]);
  expect(INTERVALS[0]).toBe(1);
});
test('sai thì về 1 ngày', () => {
  const s = grade({ stage: 3, dueAt: 0 }, false, 0);
  expect(s).toEqual({ stage: 0, dueAt: DAY });
});
test('trộn thẻ giữ nguyên số lượng', () => {
  const cards = ['zh','zh','fr','fr','en','en'].map((lang, id) => ({ lang, id }));
  const out = interleaveCards(cards);
  expect(out).toHaveLength(6);
  expect(new Set(out.map(c => c.id)).size).toBe(6);
});
