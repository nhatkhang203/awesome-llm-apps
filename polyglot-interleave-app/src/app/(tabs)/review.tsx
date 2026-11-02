import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { dueCards, gradeCard, type DueCard } from '../../db/db';
import { interleaveCards } from '../../srs/scheduler';
import { C, LANG_NAME } from '../../theme';

const VOICE = { zh: 'zh-CN', fr: 'fr-FR', en: 'en-US' } as const;

export default function Review() {
  const [queue, setQueue] = useState<DueCard[]>([]);
  const [show, setShow] = useState(false);
  useFocusEffect(useCallback(() => { dueCards(30).then(c => setQueue(interleaveCards(c))); setShow(false); }, []));

  const card = queue[0];
  const answer = async (ok: boolean) => { await gradeCard(card.id, ok); setQueue(q => q.slice(1)); setShow(false); };

  if (!card) return <View style={{ flex: 1, backgroundColor: C.bg, padding: 24 }}><Text style={{ color: C.ink, fontSize: 18 }}>Hết thẻ cần ôn hôm nay 🎉</Text></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 16, gap: 14 }}>
      <Text style={{ color: C.sub }}>Còn {queue.length} thẻ · các ngôn ngữ được trộn lẫn</Text>
      <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: C.line, borderTopWidth: 5, borderTopColor: C[card.lang], minHeight: 200, justifyContent: 'center' }}>
        <Text style={{ color: C.sub, marginBottom: 8 }}>{LANG_NAME[card.lang]} · {card.deck}</Text>
        <Text style={{ color: C.ink, fontSize: 26, fontWeight: '600' }}>{card.front}</Text>
        {show && <Text style={{ color: C.accent, fontSize: 20, marginTop: 14 }}>{card.back}</Text>}
        {show && card.note && <Text style={{ color: C.sub, marginTop: 8 }}>{card.note}</Text>}
      </View>
      <Pressable accessibilityRole="button" onPress={() => Speech.speak(card.front.replace(/\(.*\)/, ''), { language: VOICE[card.lang] })}><Text style={{ color: C.accent }}>🔊 Nghe phát âm</Text></Pressable>
      {!show ? (
        <Pressable accessibilityRole="button" onPress={() => setShow(true)} style={{ backgroundColor: C.accent, padding: 14, borderRadius: 12, alignItems: 'center' }}><Text style={{ color: '#fff' }}>Hiện đáp án</Text></Pressable>
      ) : (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable accessibilityRole="button" onPress={() => answer(false)} style={{ flex: 1, borderWidth: 1, borderColor: C.zh, padding: 14, borderRadius: 12, alignItems: 'center' }}><Text style={{ color: C.zh }}>Chưa nhớ</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => answer(true)} style={{ flex: 1, backgroundColor: C.accent, padding: 14, borderRadius: 12, alignItems: 'center' }}><Text style={{ color: '#fff' }}>Nhớ rồi</Text></Pressable>
        </View>
      )}
    </View>
  );
}
