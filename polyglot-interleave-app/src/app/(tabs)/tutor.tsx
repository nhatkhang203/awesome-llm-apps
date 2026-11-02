import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { askTutor, type Msg } from '../../ai/tutorClient';
import type { Lang } from '../../interleave/planner';
import { C, LANG_NAME } from '../../theme';

export default function Tutor() {
  const [lang, setLang] = useState<Lang>('fr');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const send = async () => {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: 'user' as const, content: text.trim() }];
    setMsgs(next); setText(''); setBusy(true); setErr('');
    try { setMsgs([...next, { role: 'assistant', content: await askTutor(lang, next) }]); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Lỗi không xác định'); }
    finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
        {(['zh', 'fr', 'en'] as Lang[]).map(l => (
          <Pressable key={l} accessibilityRole="button" onPress={() => { setLang(l); setMsgs([]); }} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: lang === l ? C[l] : C.card, borderWidth: 1, borderColor: C.line }}>
            <Text style={{ color: lang === l ? '#fff' : C.ink }}>{LANG_NAME[l]}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        {!msgs.length && <Text style={{ color: C.sub }}>Hãy viết một câu bằng ngôn ngữ đang chọn. Gia sư sẽ trả lời, sửa lỗi và giải thích bằng tiếng Việt.</Text>}
        {msgs.map((m, i) => (
          <View key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', backgroundColor: m.role === 'user' ? C.accent : C.card, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.line }}>
            <Text style={{ color: m.role === 'user' ? '#fff' : C.ink }}>{m.content}</Text>
          </View>
        ))}
        {busy && <Text style={{ color: C.sub }}>Đang trả lời…</Text>}
        {!!err && <Text style={{ color: C.zh }}>{err}</Text>}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
        <TextInput value={text} onChangeText={setText} onSubmitEditing={send} placeholder="Nhập câu của bạn…" placeholderTextColor={C.sub} style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: C.line, color: C.ink }} />
        <Pressable accessibilityRole="button" onPress={send} style={{ backgroundColor: C.accent, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 }}><Text style={{ color: '#fff' }}>Gửi</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
