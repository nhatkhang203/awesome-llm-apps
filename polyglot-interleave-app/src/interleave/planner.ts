export type Lang = 'zh' | 'fr' | 'en';
export type Skill = 'vocab' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'applied';
export type Block = { lang: Lang; skill: Skill; minutes: number };

// Bảng T2–T6 theo kế hoạch đã thống nhất (0 = Thứ 2).
const WEEK: Block[][] = [
  [b('zh', 'vocab'), b('en', 'reading'), b('fr', 'listening')],
  [b('fr', 'grammar'), b('zh', 'listening'), b('en', 'vocab')],
  [b('en', 'listening'), b('fr', 'vocab'), b('zh', 'grammar')],
  [b('zh', 'speaking'), b('en', 'writing'), b('fr', 'reading')],
  [b('fr', 'speaking'), b('zh', 'reading'), b('en', 'grammar')],
  [b('zh', 'applied'), b('fr', 'applied'), b('en', 'applied')], // Thứ 7: dùng thật
];

function b(lang: Lang, skill: Skill, minutes = 28): Block { return { lang, skill, minutes }; }

// weekdayIndex: 0 = Thứ 2 ... 6 = Chủ nhật (nghỉ). Trả [] cho Chủ nhật.
export function planForDay(weekdayIndex: number, weekNumber = 0): Block[] {
  if (weekdayIndex < 0 || weekdayIndex > 6) throw new RangeError('weekdayIndex 0..6');
  if (weekdayIndex === 6) return [];
  const blocks = WEEK[weekdayIndex];
  // Xoay thứ tự khối theo tuần để thứ tự không lặp cố định.
  const shift = weekNumber % blocks.length;
  return [...blocks.slice(shift), ...blocks.slice(0, shift)];
}

export function mondayBasedWeekday(d: Date): number {
  return (d.getDay() + 6) % 7;
}
