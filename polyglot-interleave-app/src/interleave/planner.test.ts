import { planForDay } from './planner';
test('mỗi ngày học (T2–T7) có đủ 3 ngôn ngữ', () => {
  for (let d = 0; d < 6; d++) for (let w = 0; w < 3; w++)
    expect(new Set(planForDay(d, w).map(x => x.lang))).toEqual(new Set(['zh','fr','en']));
});
test('Chủ nhật nghỉ', () => expect(planForDay(6)).toEqual([]));
test('thứ tự đổi giữa các tuần', () => {
  expect(planForDay(0, 0).map(x => x.lang)).not.toEqual(planForDay(0, 1).map(x => x.lang));
});
