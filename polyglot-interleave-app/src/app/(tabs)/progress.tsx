import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { masteredByLang, streak } from '../../db/db';
import { C, LANG_NAME } from '../../theme';
import type { Lang } from '../../interleave/planner';

export default function Progress() {
  const [s, setS] = useState(0);
  const [m, setM] = useState<Awaited<ReturnType<typeof masteredByLang>> | null>(null);
  useFocusEffect(useCallback(() => { streak().then(setS); masteredByLang().then(setM); }, []));
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: C.line }}>
        <Text style={{ color: C.sub }}>Chuỗi ngày học liên tiếp</Text>
        <Text style={{ color: C.accent, fontSize: 34, fontWeight: '700' }}>{s} ngày</Text>
      </View>
      {m && (['zh', 'fr', 'en'] as Lang[]).map(l => {
        const pct = m[l].total ? m[l].mastered / m[l].total : 0;
        return (
          <View key={l} style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.line }}>
            <Text style={{ color: C.ink, fontWeight: '600' }}>{LANG_NAME[l]}</Text>
            <Text style={{ color: C.sub, marginVertical: 4 }}>Đã thuộc {m[l].mastered}/{m[l].total} thẻ</Text>
            <View style={{ height: 8, backgroundColor: C.line, borderRadius: 4 }}><View style={{ width: `${pct * 100}%`, height: 8, backgroundColor: C[l], borderRadius: 4 }} /></View>
          </View>
        );
      })}
    </ScrollView>
  );
}
