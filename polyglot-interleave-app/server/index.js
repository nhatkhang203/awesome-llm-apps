// Proxy gia sư AI: giữ ANTHROPIC_API_KEY ở server, app chỉ gọi POST /tutor.
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // đọc ANTHROPIC_API_KEY từ biến môi trường
const MODEL = process.env.TUTOR_MODEL ?? 'claude-sonnet-5-5';
const NAMES = { zh: 'tiếng Trung (kèm pinyin)', fr: 'tiếng Pháp', en: 'tiếng Anh' };

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.post('/tutor', async (req, res) => {
  const { lang, messages } = req.body ?? {};
  if (!NAMES[lang] || !Array.isArray(messages) || !messages.length || messages.length > 40)
    return res.status(400).json({ error: 'invalid request' });
  const clean = messages.filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  try {
    const r = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: `Bạn là gia sư ${NAMES[lang]} cho một sinh viên Việt Nam ngành kiến trúc cảnh quan, trình độ A1–A2. ` +
        `Trả lời ngắn bằng ${NAMES[lang]} đơn giản để tiếp tục hội thoại, sau đó: (1) sửa lỗi trong câu của học viên, ` +
        `(2) giải thích lỗi bằng tiếng Việt, (3) gợi ý 1–2 từ mới đáng thêm vào thẻ. Ưu tiên chủ đề cảnh quan, vườn, nơi chốn.`,
      messages: clean,
    });
    res.json({ reply: r.content.filter(b => b.type === 'text').map(b => b.text).join('\n') });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: 'upstream error' });
  }
});

app.listen(process.env.PORT ?? 8787, () => console.log('tutor proxy on', process.env.PORT ?? 8787));
