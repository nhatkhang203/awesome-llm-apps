import type { Lang } from '../interleave/planner';
export type SeedCard = { id: string; lang: Lang; deck: 'basic' | 'landscape' | 'philosophy'; front: string; back: string; note?: string };

// Bộ mẫu để chạy app; mở rộng dần lên ~150 thẻ cơ bản mỗi ngôn ngữ.
export const SEED_CARDS: SeedCard[] = [
  // Trung – cơ bản
  { id: 'zh-b1', lang: 'zh', deck: 'basic', front: '你好 (nǐ hǎo)', back: 'xin chào' },
  { id: 'zh-b2', lang: 'zh', deck: 'basic', front: '谢谢 (xièxie)', back: 'cảm ơn' },
  { id: 'zh-b3', lang: 'zh', deck: 'basic', front: '水 (shuǐ)', back: 'nước' },
  { id: 'zh-b4', lang: 'zh', deck: 'basic', front: '山 (shān)', back: 'núi' },
  { id: 'zh-b5', lang: 'zh', deck: 'basic', front: '我是学生 (wǒ shì xuésheng)', back: 'tôi là sinh viên' },
  // Trung – cảnh quan / triết học
  { id: 'zh-l1', lang: 'zh', deck: 'landscape', front: '园林 (yuánlín)', back: 'vườn (cảnh quan) cổ điển Trung Hoa' },
  { id: 'zh-l2', lang: 'zh', deck: 'landscape', front: '借景 (jièjǐng)', back: '"mượn cảnh": đưa cảnh bên ngoài vào bố cục khu vườn' },
  { id: 'zh-l3', lang: 'zh', deck: 'landscape', front: '山水 (shānshuǐ)', back: 'núi và nước; phong cảnh' },
  { id: 'zh-p1', lang: 'zh', deck: 'philosophy', front: '道 (dào)', back: 'Đạo: con đường, nguyên lý của vạn vật (Đạo giáo)' },
  { id: 'zh-p2', lang: 'zh', deck: 'philosophy', front: '阴阳 (yīnyáng)', back: 'Âm Dương: hai mặt đối lập bổ sung nhau' },
  // Pháp – cơ bản
  { id: 'fr-b1', lang: 'fr', deck: 'basic', front: 'Bonjour', back: 'xin chào' },
  { id: 'fr-b2', lang: 'fr', deck: 'basic', front: 'Merci', back: 'cảm ơn' },
  { id: 'fr-b3', lang: 'fr', deck: 'basic', front: "l'eau (f.)", back: 'nước' },
  { id: 'fr-b4', lang: 'fr', deck: 'basic', front: 'Je suis étudiant(e)', back: 'tôi là sinh viên' },
  { id: 'fr-b5', lang: 'fr', deck: 'basic', front: 'actuellement', back: 'hiện nay', note: 'False friend: KHÔNG phải "actually" (thực ra = en fait)' },
  { id: 'fr-b6', lang: 'fr', deck: 'basic', front: 'la librairie', back: 'hiệu sách', note: 'False friend: thư viện = la bibliothèque (library)' },
  // Pháp – cảnh quan / triết học
  { id: 'fr-l1', lang: 'fr', deck: 'landscape', front: 'jardin à la française', back: 'vườn kiểu Pháp: đối xứng, hình học (Le Nôtre, Versailles)' },
  { id: 'fr-l2', lang: 'fr', deck: 'landscape', front: "l'aménagement paysager", back: 'quy hoạch/thiết kế cảnh quan' },
  { id: 'fr-l3', lang: 'fr', deck: 'landscape', front: 'le paysagiste', back: 'kiến trúc sư cảnh quan' },
  { id: 'fr-p1', lang: 'fr', deck: 'philosophy', front: 'Je pense, donc je suis', back: 'Tôi tư duy nên tôi tồn tại (Descartes, Cogito)' },
  { id: 'fr-p2', lang: 'fr', deck: 'philosophy', front: 'le contrat social', back: 'khế ước xã hội (Rousseau)' },
  // Anh – học thuật / cảnh quan / triết học
  { id: 'en-b1', lang: 'en', deck: 'basic', front: 'moreover', back: 'hơn nữa (từ nối học thuật)' },
  { id: 'en-b2', lang: 'en', deck: 'basic', front: 'whereas', back: 'trong khi (đối lập)' },
  { id: 'en-b3', lang: 'en', deck: 'basic', front: 'to elaborate on', back: 'trình bày chi tiết về' },
  { id: 'en-l1', lang: 'en', deck: 'landscape', front: 'vernacular landscape', back: 'cảnh quan bản địa, hình thành từ cách sống của cộng đồng' },
  { id: 'en-l2', lang: 'en', deck: 'landscape', front: 'site analysis', back: 'phân tích hiện trạng khu đất' },
  { id: 'en-l3', lang: 'en', deck: 'landscape', front: 'sense of place', back: 'bản sắc/tính chất riêng của một nơi chốn' },
  { id: 'en-p1', lang: 'en', deck: 'philosophy', front: 'dialectical materialism', back: 'chủ nghĩa duy vật biện chứng (Mác – Lênin)' },
  { id: 'en-p2', lang: 'en', deck: 'philosophy', front: 'phenomenology of place', back: 'hiện tượng học về nơi chốn (Norberg-Schulz, genius loci)' },
];
