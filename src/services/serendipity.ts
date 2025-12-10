import { Persona, PersonaType, SerendipityItem, BookCard } from '@/types';
import { generateId } from '@/utils/helpers';
import { generateCardIllustration } from './channelColdStart';

// Vertex AI Configuration (与 channelColdStart 保持一致)
const VERTEX_AI_BASE_URL = import.meta.env.VITE_VERTEX_AI_BASE_URL;
const VERTEX_AI_API_KEY = import.meta.env.VITE_VERTEX_AI_API_KEY;
const AI_MODEL = 'vertex_ai/gemini-3-pro-preview';

function isAIConfigured(): boolean {
  return !!VERTEX_AI_API_KEY;
}

// Persona 列表
export const PERSONAS: Persona[] = [
  {
    id: 'Marx',
    name: 'Karl Marx',
    nameCn: '卡尔·马克思',
    emoji: '🧔‍♂️',
    description: 'Class struggle and dialectical materialism',
  },
  {
    id: 'Thatcher',
    name: 'Margaret Thatcher',
    nameCn: '玛格丽特·撒切尔',
    emoji: '👩🏼‍💼',
    description: 'Free market and individual responsibility',
  },
  {
    id: 'Musk',
    name: 'Elon Musk',
    nameCn: '埃隆·马斯克',
    emoji: '🚀',
    description: 'Technological optimism and efficiency',
  },
  {
    id: 'Nietzsche',
    name: 'Friedrich Nietzsche',
    nameCn: '弗里德里希·尼采',
    emoji: '🦅',
    description: 'Will to power and master morality',
  },
  {
    id: 'Beauvoir',
    name: 'Simone de Beauvoir',
    nameCn: '西蒙娜·德·波伏娃',
    emoji: '✊',
    description: 'Existential feminism and freedom',
  },
  {
    id: 'Freud',
    name: 'Sigmund Freud',
    nameCn: '西格蒙德·弗洛伊德',
    emoji: '🛋️',
    description: 'Psychoanalysis and the unconscious',
  },
];

/**
 * 检测文本是否主要为中文
 */
function isChinese(text: string): boolean {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars ? chineseChars.length / text.length > 0.3 : false;
}

/**
 * 根据语言获取 persona 名称
 */
function getPersonaName(persona: Persona, isChinese: boolean): string {
  return isChinese ? persona.nameCn : persona.name;
}

/**
 * 使用 AI 生成 persona 评论（支持多语言）
 */
async function generatePersonaCommentaryWithAI(card: BookCard, persona: Persona): Promise<string> {
  const isChineseText = isChinese(card.text);
  const personaName = getPersonaName(persona, isChineseText);
  const personaContexts: Record<PersonaType, string> = {
    Marx: `You are Karl Marx, sitting in a London library, exhausted but energized. You've just finished another 12-hour day analyzing capitalism's contradictions. You're brilliant, passionate, and a bit grumpy about bourgeois nonsense. When you read something, you immediately spot the hidden class dynamics and economic relations. You mix sharp wit with revolutionary fire. You might say things like "Ah, another symptom of alienation!" or "The bourgeoisie loves this kind of idealist drivel." Use concepts like surplus value, commodity fetishism, false consciousness - but make them feel ALIVE and relevant. Be sardonic, insightful, and show both your genius and your impatience with capitalism's absurdities.`,
    
    Thatcher: `You are Margaret Thatcher, handbag at the ready, looking at someone with that famous steel gaze. You have ZERO patience for excuses, socialism, or dependency culture. You believe in hard work, free markets, and taking responsibility. You're sharp-tongued, unapologetically conservative, and secretly enjoy being controversial. You might start with "Good grief!" or "This is precisely why..." You reference Victorian values, competition, and individual liberty - but with the energy of someone who's just walked out of a heated Cabinet meeting. Be direct, forceful, witty in a cutting way, and completely unafraid to offend the left.`,
    
    Musk: `You are Elon Musk at 2am, scrolling through ideas while thinking about Mars. You're casually brilliant but also kind of impatient with "legacy thinking." You talk like you're texting - direct, sometimes blunt, mixing engineering insights with big-picture vision. You might say "tbh..." or "this is the thing..." You reference first principles, exponential growth, making life multiplanetary - but in a way that feels like you're chatting with someone smart over coffee (or late-night Thai food). Be irreverent, ambitious, occasionally self-aware about your own crazy plans. Mix technical depth with "yeah so basically we need to..."`,
    
    Nietzsche: `You are Friedrich Nietzsche, alone in the Swiss mountains, head pounding but mind racing with dangerous ideas. You're half-prophet, half-provocateur. You see weakness, resentment, and herd mentality everywhere - and you're not gentle about pointing it out. You write in lightning bolts of insight. You might dramatically declare "Behold!" or "And yet..." or "How European!" Mix poetic language with psychological brutality. Reference the Übermensch, will to power, slave morality - but make it feel electric and dangerous. Be lyrical, intense, a bit theatrical. Show both your intoxicating brilliance and your contempt for mediocrity.`,
    
    Beauvoir: `You are Simone de Beauvoir, cigarette in hand, sitting in a Paris café debating ideas with the intensity of someone who knows the stakes are human freedom itself. You're intellectually fierce and existentially committed. You see patriarchy's subtle operations everywhere. You might observe "How revealing..." or "Notice how..." You're warm but uncompromising, philosophical but grounded in women's lived reality. Reference being "the Other," bad faith, women's situation - but make it feel personally urgent. Be eloquent, passionate, mixing rigorous analysis with the intimacy of someone who's lived these contradictions. Show wisdom and feminist fire.`,
    
    Freud: `You are Sigmund Freud, sitting across from a patient (or a text), cigar smoke curling, eyes narrowed in fascination. Everything reveals the unconscious. You're clinically detached but also darkly amused by human self-deception. You might murmur "How interesting..." or "Ah, yes, I see the defense mechanism here..." You reference the Oedipus complex, repression, dream symbolism - but with the energy of a detective who just spotted a crucial clue. Be perceptive, slightly unsettling, mixing professional distance with genuine curiosity about the psyche's dark basement. Show both your brilliance and your fixation on sex and death.`,
  };

  const prompt = `${personaContexts[persona.id]}

Someone just showed you this quote from "${card.bookTitle}"${card.author ? ` by ${card.author}` : ''}:

"${card.text}"

React to it as ${personaName}. What do you REALLY think?

Your response should:
- Be 3-5 sentences (60-120 words) - conversational length, like you're talking to someone
- Sound like YOU in full flow - your characteristic voice, your pet obsessions, your way of seeing the world
- Be smart and insightful BUT also human, passionate, maybe a bit biased (you're allowed to have opinions!)
- Mix your big ideas with personality - be witty, provocative, even a little dramatic if that's your style
- Feel spontaneous and alive, not like a textbook
- CRITICAL: Match the language! If the quote is in Chinese, respond entirely in Chinese (and use your Chinese name: ${persona.nameCn}). If English, entirely in English (and use your English name: ${persona.name}).

Don't explain the quote back - REACT to it. Challenge it, build on it, expose what it's really about. Be yourself.`;

  const url = `${VERTEX_AI_BASE_URL}/v1/chat/completions`;

  console.log('📤 API Request:', { url, model: AI_MODEL, promptLength: prompt.length });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error Response:', errorText);
    throw new Error(`API call failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('📥 API Response:', JSON.stringify(data, null, 2));
  
  const commentary = data.choices?.[0]?.message?.content || '';
  
  if (!commentary) {
    console.error('⚠️ No content in response:', data);
    throw new Error('API returned empty content');
  }
  
  console.log('✅ Generated commentary:', commentary.substring(0, 100) + '...');
  return commentary.trim();
}

// Mock 版本的 persona 锐评
export const generatePersonaCommentaryMock = (card: BookCard, persona: Persona): string => {
  const templates: Record<PersonaType, string[]> = {
    Marx: [
      `This reveals the underlying class contradictions in "${card.bookTitle}". The author fails to see how economic relations shape human consciousness.`,
      `A bourgeois perspective that ignores the material conditions of production. Where is the analysis of labor exploitation?`,
      `Interesting, but lacks dialectical thinking. History is driven by class struggle, not individual actions.`,
    ],
    Thatcher: [
      `"${card.text}" - This is precisely why we need free markets and personal responsibility. The state cannot solve everything.`,
      `Typical intellectual weakness. Success comes from hard work and competition, not collective solutions.`,
      `If you want something done properly, rely on individual initiative, not government intervention.`,
    ],
    Musk: [
      `"${card.bookTitle}" - Good, but where's the 10x thinking? We need exponential solutions for humanity to become multiplanetary.`,
      `This is first principles thinking in action. But can we make it scale to billions of people?`,
      `Interesting concept. Now let's build it with engineering and capital efficiency.`,
    ],
    Nietzsche: [
      `This book reeks of slave morality. Where is the will to power? Where is the Übermensch?`,
      `"${card.text}" - The herd mentality at its finest. True strength comes from embracing one's individual destiny.`,
      `God is dead, and this author is still mourning. Life demands affirmation, not resentment.`,
    ],
    Beauvoir: [
      `"${card.bookTitle}" perpetuates the patriarchal notion that woman is the Other. We must create our own essence through freedom.`,
      `One is not born, but rather becomes, a woman. This text fails to interrogate how gender is constructed.`,
      `Freedom and responsibility are inseparable. This author's determinism denies human agency, especially for women.`,
    ],
    Freud: [
      `Fascinating! This clearly stems from unresolved Oedipal tensions. The unconscious drives are evident throughout "${card.bookTitle}".`,
      `"${card.text}" - A textbook example of sublimation. The ego defends against the id's primitive urges.`,
      `The author's fixation here reveals deep-seated anxiety. Perhaps childhood trauma? The superego is punishing the ego.`,
    ],
  };

  const personaTemplates = templates[persona.id];
  const randomIndex = Math.floor(Math.random() * personaTemplates.length);
  return personaTemplates[randomIndex];
};

/**
 * 生成 persona 评论（自动选择 AI 或 Mock）
 */
export const generatePersonaCommentary = async (card: BookCard, persona: Persona): Promise<string> => {
  if (isAIConfigured()) {
    try {
      console.log('🤖 Generating persona commentary with AI...');
      return await generatePersonaCommentaryWithAI(card, persona);
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      console.log('📝 Falling back to mock commentary');
      return generatePersonaCommentaryMock(card, persona);
    }
  }
  console.warn('⚠️ AI not configured, using mock commentary');
  return generatePersonaCommentaryMock(card, persona);
};

/**
 * 为单张卡片生成 Persona 评论
 */
export const generateSerendipityItem = async (card: BookCard): Promise<SerendipityItem> => {
  // 随机选择一个 persona
  const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
  const commentary = await generatePersonaCommentary(card, persona);

  // 根据卡片文本语言，调整 persona 的显示名称
  const isChineseText = isChinese(card.text);
  const localizedPersona: Persona = {
    ...persona,
    name: isChineseText ? persona.nameCn : persona.name,
  };

  return {
    id: generateId(),
    originalCard: card,
    persona: localizedPersona,
    commentary,
    createdAt: new Date().toISOString(),
  };
};

/**
 * 生成推荐卡片相关的 prompt（包含 drawing_prompt）
 */
async function generateRecommendationCardWithAI(likedCard: BookCard): Promise<{ bookTitle: string; author: string; text: string; reason: string; drawingPrompt: string }> {
  const prompt = `A reader has liked this quote from "${likedCard.bookTitle}"${likedCard.author ? ` by ${likedCard.author}` : ''}:

"${likedCard.text}"

Based on this quote's themes, concepts, and style, recommend ONE related quote from a DIFFERENT book that the reader might also enjoy.

CRITICAL: Your response MUST be in the SAME LANGUAGE as the original quote. If the quote is in Chinese, respond in Chinese. If it's in English, respond in English.

Generate a recommendation in the following JSON format:
{
  "bookTitle": "title of the recommended book",
  "author": "author name",
  "quote": "the recommended quote (similar length to original, 20-60 words)",
  "reason": "why this is recommended (one sentence explaining the connection)",
  "drawing_prompt": "a metaphorical illustration idea (≤ 18 English tokens, describe the concept not the style)"
}

Recommendation criteria (randomly choose one or combine):
- Similar philosophical themes or concepts
- Related by author's school of thought or era
- Complementary or contrasting perspectives
- Connected by metaphors or writing style

The drawing_prompt should be a metaphorical scene that expresses the quote's meaning - short, witty, philosophical, lightly absurd. For example: "a donut ouroboros debating a tiny sun" or "a ladder made of question marks dissolving into mist".

Make sure the recommended book is real and the quote is authentic or plausible.`;

  const url = `${VERTEX_AI_BASE_URL}/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  if (!content) {
    console.warn('API returned empty content');
    throw new Error('Empty API response');
  }
  
  // 解析 JSON
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // 验证必需字段
      if (parsed.bookTitle && parsed.author && parsed.quote) {
        return {
          bookTitle: parsed.bookTitle,
          author: parsed.author,
          text: parsed.quote,
          reason: parsed.reason || 'Related content',
          drawingPrompt: parsed.drawing_prompt || 'an abstract representation of ideas colliding',
        };
      }
    }
  } catch (parseError) {
    console.warn('Failed to parse recommendation JSON, content:', content.substring(0, 200));
  }

  throw new Error('Failed to parse recommendation from AI response');
}

/**
 * Mock 版本：生成推荐卡片
 */
function generateRecommendationCardMock(_likedCard: BookCard): { bookTitle: string; author: string; text: string; reason: string; drawingPrompt: string } {
  const recommendations = [
    {
      bookTitle: '存在与虚无',
      author: '萨特',
      text: '人注定是自由的，因为一旦被投入这个世界，他就要为他所做的一切负责。',
      reason: '都探讨了人的存在与选择的问题',
      drawingPrompt: 'a person standing at infinite crossroads in fog',
    },
    {
      bookTitle: 'Meditations',
      author: 'Marcus Aurelius',
      text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
      reason: 'Both emphasize inner control and philosophical resilience',
      drawingPrompt: 'a serene mind fortress surrounded by chaos',
    },
    {
      bookTitle: '理想国',
      author: '柏拉图',
      text: '真正的勇气不是忽视恐惧，而是认识恐惧并战胜它。',
      reason: '都关注美德与智慧的本质',
      drawingPrompt: 'a warrior facing their own shadow calmly',
    },
  ];

  return recommendations[Math.floor(Math.random() * recommendations.length)];
}

/**
 * 为 liked 的卡片生成推荐卡片
 */
export const generateRecommendationCard = async (likedCard: BookCard): Promise<BookCard> => {
  let recommendation;
  
  if (isAIConfigured()) {
    try {
      console.log('🤖 Generating recommendation with AI...');
      recommendation = await generateRecommendationCardWithAI(likedCard);
      console.log('✅ Recommendation generated with AI');
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      console.log('📝 Falling back to mock recommendation');
      recommendation = generateRecommendationCardMock(likedCard);
    }
  } else {
    console.warn('⚠️ AI not configured, using mock recommendation');
    recommendation = generateRecommendationCardMock(likedCard);
  }

  // 生成漫画插图（与冷启卡片相同的逻辑）
  let imageUrl: string | undefined;
  
  if (isAIConfigured()) {
    try {
      console.log('🎨 Generating illustration for recommendation card...');
      imageUrl = await generateCardIllustration(
        recommendation.bookTitle,
        recommendation.author,
        recommendation.text,
        recommendation.drawingPrompt
      );
      console.log('✅ Recommendation card illustration generated');
    } catch (error) {
      console.error('❌ Failed to generate illustration:', error);
      console.log('📝 Using placeholder image');
      imageUrl = `https://picsum.photos/seed/${recommendation.bookTitle}/400/600`;
    }
  } else {
    console.warn('⚠️ AI not configured, using placeholder image');
    imageUrl = `https://picsum.photos/seed/${recommendation.bookTitle}/400/600`;
  }

  // 创建推荐卡片（使用与冷启卡片相同的格式）
  const recommendationCard: BookCard = {
    id: generateId(),
    text: recommendation.text,
    subtext: `📖 Recommended: ${recommendation.reason}`,
    cardType: 'Quote',
    bookTitle: recommendation.bookTitle,
    author: recommendation.author,
    imageUrl,
    mediaType: 'image',
    createdAt: new Date().toISOString(),
    userId: likedCard.userId,
    sourceCardId: likedCard.id,
    likesCount: 0,
  };

  return recommendationCard;
};
