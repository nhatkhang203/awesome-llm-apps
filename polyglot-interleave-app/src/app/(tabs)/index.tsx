import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { planForDay, mondayBasedWeekday } from '../../interleave/planner';
import { dayKey, doneMap, ensureDay, setBlockDone } from '../../db/db';
import { C, LANG_NAME, SKILL_NAME } from '../../theme';

const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
const weekNumber = Math.floor((Date.now() - startOfYear) / (7 * 86_400_000));

export default function Today() {
  const now = new Date();
  const day = dayKey(now);
  const blocks = planForDay(mondayBasedWeekday(now), weekNumber);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [active, setActive] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => { await ensureDay(day, blocks); setDone(await doneMap(day)); }, [day]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const start = (i: number) => {
    if (timer.current) clearInterval(timer.current);
    setActive(i); setLeft(blocks[i].minutes * 60);
    timer.current = setInterval(() => setLeft(s => {
      if (s <= 1) { if (timer.current) clearInterval(timer.current); return 0; }
      return s - 1;
    }), 1000);
  };
  const toggle = async (i: number) => { const v = !done[i]; await setBlockDone(day, i, v); setDone({ ...done, [i]: v }); };

  if (!blocks.length) return <View style={{ flex: 1, backgroundColor: C.bg, padding: 24 }}><Text style={{ color: C.ink, fontSize: 18 }}>Chủ nhật: nghỉ ngơi 🌿{'\n'}Có thể xem phim hoặc nghe nhạc bằng bất kỳ ngôn ngữ nào.</Text></View>;

  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ color: C.sub }}>3 khối xoay vòng ngôn ngữ và kỹ năng. Nghỉ 5 phút giữa các khối.</Text>
      {blocks.map((b, i) => (
        <View key={i} style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, borderLeftWidth: 5, borderLeftColor: C[b.lang], borderWidth: 1, borderColor: C.line }}>
          <Text style={{ color: C.ink, fontSize: 17, fontWeight: '600' }}>{LANG_NAME[b.lang]}</Text>
          <Text style={{ color: C.sub, marginTop: 2 }}>{SKILL_NAME[b.skill]} · {b.minutes} phút</Text>
          {active === i && <Text style={{ color: C.accent, fontSize: 28, marginVertical: 8 }}>{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</Text>}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Pressable accessibilityRole="button" onPress={() => start(i)} style={{ backgroundColor: C.accent, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}>
              <Text style={{ color: '#fff' }}>{active === i ? 'Bắt đầu lại' : 'Bắt đầu'}</Text>
            </Pressable>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!done[i] }} onPress={() => toggle(i)} style={{ borderWidth: 1, borderColor: C.line, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}>
              <Text style={{ color: C.ink }}>{done[i] ? '✓ Đã xong' : 'Đánh dấu xong'}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
