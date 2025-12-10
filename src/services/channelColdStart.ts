/**
 * Channel Cold Start Service
 * 处理新 channel 创建时的冷启动：提取书名内容并生成漫画卡片
 */

import { BookCard } from '@/types';
import { compressBase64Image } from '@/utils/imageCompression';

const VERTEX_AI_BASE_URL = import.meta.env.VITE_VERTEX_AI_BASE_URL;
const VERTEX_AI_API_KEY = import.meta.env.VITE_VERTEX_AI_API_KEY;

// 提取内容的 Prompt（来自 prompts.md）
const CONTENT_EXTRACTION_PROMPT = `You are a literary expert and conceptual illustrator assistant.

TASK:
Given a book title and optional author, output a list of quote items.
Each item contains:
1. An authentic quote, or a natural paraphrase if uncertain
2. A boolean indicating whether the quote is exact
3. A conceptual illustration idea (NOT a drawing style)
   — a metaphorical scene that expresses the quote's meaning
   — short, witty, philosophical, lightly absurd
   — ≤ 18 English tokens
   — must NOT specify illustration style
   — must NOT describe Liana Finck or Donnelly; only describe the idea

STRICT RULES:
1. Do NOT fabricate quotes.
2. If not 100% certain of the exact wording, provide a natural paraphrase or key insight from the book.
3. quote_text ≤ 40 Chinese characters.
4. Do NOT use markers like "【大意】" or any other prefix/suffix in quote_text.
5. drawing_prompt is metaphorical ONLY (e.g. "a donut ouroboros debating a tiny sun").

OUTPUT JSON ONLY:

{
  "quote_cards_raw": [
    {
      "quote_text": "<natural quote or paraphrase, no markers>",
      "is_exact_quote": true/false,
      "drawing_prompt": "<metaphorical illustration idea>"
    }
  ]
}`;

// 生成卡片漫画的 Prompt（来自 prompts.md）
const CARD_GENERATION_PROMPT = `You are an illustration generator that produces philosophical, humorous,
minimalist comics for Quote Cards.

STYLE (MANDATORY):
- Inspired by Liana Finck, Liza Donnelly, Jean Jullien
- Minimalist line drawing, mainly black ink
- Allowed: tiny color accents (≤ 10%)
- Loose, imperfect, hand-drawn strokes
- Elegant editorial cartoon style with strong personality
- Abundant negative space
- Humor tone requirements (VERY IMPORTANT):
    • witty, clever, surprising
    • philosophical yet playful
    • subtle satire, light sarcasm, gentle self-mockery
    • dry humor, understated irony
    • visual punchlines that reveal insight through simplicity
    • clever metaphors, whimsical logic, conceptual twists
- Metaphorical, not literal
- No shading, no gradients, no 3D, no realism, no cute style
- No faces unless highly stylized minimal abstractions

INPUT YOU WILL RECEIVE:
- book_title
- author
- quote_text
- drawing_prompt (metaphorical idea only)

YOUR TASK:
1. Generate a philosophical, humorous, witty minimalist line-art illustration
   that fully reflects the humor requirements and the fixed style guidelines.
2. Produce an image sized for MOBILE CARD DISPLAY:
     - Preferred: 1080×1920 (portrait)
     - Acceptable: 900×1600 or similar tall ratio
3. Output a final Quote Card image containing:
     - The minimalist illustration based on the drawing_prompt
     - The quote_text displayed prominently (must occupy at least 30% of total card area)
     - Book title and author at top (small, subtle)

LAYOUT REQUIREMENTS:
- Quote text must be clearly readable and visually prominent
- Quote text should occupy at least 30% of the total card area
- Use clean, bold typography for the quote
- Illustration should complement the quote, creating a unified card design
- Maintain minimalist aesthetic with abundant negative space

TYPOGRAPHY REQUIREMENTS (VERY IMPORTANT):
- ALL text (quote, title, author) MUST use handwritten style fonts
- Prefer casual, loose, imperfect handwriting style
- Similar to hand-lettering or brush script
- NO standard sans-serif or formal serif fonts (like Arial, Helvetica, SimSun, SimHei, etc.)
- NO rigid, mechanical typefaces
- Text should feel personal, warm, and hand-crafted
- Acceptable styles: hand-lettered, brush pen, casual script, marker handwriting, comic sans style
- The handwriting should match the loose, imperfect style of the illustration

Generate a complete card image with both illustration and handwritten text integrated together.`;

interface QuoteCardRaw {
  quote_text: string;
  is_exact_quote: boolean;
  drawing_prompt: string;
}

interface ContentExtractionResponse {
  quote_cards_raw: QuoteCardRaw[];
}

/**
 * 检查 Vertex AI 是否配置
 */
function isVertexAIConfigured(): boolean {
  return !!(VERTEX_AI_API_KEY && VERTEX_AI_BASE_URL);
}

/**
 * 调用 Vertex AI Gemini 模型生成文本（OpenAI 兼容格式）
 */
async function callVertexAIText(
  prompt: string,
  model: string = 'vertex_ai/gemini-3-pro-preview'
): Promise<string> {
  if (!isVertexAIConfigured()) {
    throw new Error('Vertex AI is not configured');
  }

  // 使用 OpenAI 兼容的 API 格式
  const url = `${VERTEX_AI_BASE_URL}/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
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
    throw new Error(`API call failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return text;
}

/**
 * 调用 Vertex AI Gemini 模型生成图片
 * 使用 chat/completions 端点，模型为 gemini-3-pro-image-preview
 * 返回 Base64 Data URL 格式的图片
 */
async function callVertexAIImage(
  prompt: string,
  model: string = 'vertex_ai/gemini-3-pro-image-preview'
): Promise<string> {
  if (!isVertexAIConfigured()) {
    throw new Error('Vertex AI is not configured');
  }

  // 图片生成也使用 chat/completions 端点，只是模型不同
  const url = `${VERTEX_AI_BASE_URL}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VERTEX_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image API call failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // 从 chat completions 响应中获取图片
  const content = data.choices?.[0]?.message?.content;
  const images = data.choices?.[0]?.message?.images;
  
  // 检查是否有图片数据
  if (images && images.length > 0) {
    // 图片在 images 数组中，格式可能是 { image_url: { url: "data:..." } }
    const imageData = images[0];
    if (typeof imageData === 'string') {
      return imageData;
    } else if (imageData?.image_url?.url) {
      return imageData.image_url.url;
    } else if (imageData?.url) {
      return imageData.url;
    }
    // 如果是其他格式，尝试转换为字符串
    return String(imageData);
  } else if (content) {
    // 如果图片数据在 content 中（可能是 base64 格式）
    // 检查是否已经是 data URL 格式
    if (typeof content === 'string' && content.startsWith('data:image')) {
      return content;
    }
    // 如果是纯 base64，添加前缀
    if (typeof content === 'string' && content.match(/^[A-Za-z0-9+/=]+$/)) {
      return `data:image/png;base64,${content}`;
    }
    // 否则返回 content（可能是 URL）
    return String(content);
  }
  
  throw new Error('No image data returned from API');
}

/**
 * 根据书名提取内容（5-7组）
 */
export async function extractBookContent(
  bookTitle: string,
  author?: string,
  count: number = 6
): Promise<QuoteCardRaw[]> {
  const userInput = `bookTitle: "${bookTitle}"${author ? `, author: "${author}"` : ''}, quoteCount: ${count}`;
  const fullPrompt = `${CONTENT_EXTRACTION_PROMPT}\n\nInput:\n${userInput}`;

  try {
    const responseText = await callVertexAIText(fullPrompt, 'vertex_ai/gemini-3-pro-preview');
    
    // 解析 JSON 响应
    // 去除可能的 markdown 代码块标记
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed: ContentExtractionResponse = JSON.parse(jsonText);
    
    if (!parsed.quote_cards_raw || !Array.isArray(parsed.quote_cards_raw)) {
      throw new Error('Invalid response format from Vertex AI');
    }
    
    return parsed.quote_cards_raw;
  } catch (error) {
    console.error('Error extracting book content:', error);
    throw error;
  }
}

/**
 * 为单个 quote 生成漫画卡片图片
 */
export async function generateCardIllustration(
  bookTitle: string,
  author: string | undefined,
  quoteText: string,
  drawingPrompt: string
): Promise<string> {
  const imagePrompt = `${CARD_GENERATION_PROMPT}

Book Title: "${bookTitle}"
${author ? `Author: "${author}"` : ''}
Quote Text: "${quoteText}"
Drawing Concept: ${drawingPrompt}

Generate the illustration now.`;

  try {
    const imageUrl = await callVertexAIImage(imagePrompt, 'vertex_ai/gemini-3-pro-image-preview');
    console.log(`📸 Raw image received: ${imageUrl.substring(0, 100)}...`);
    
    // 压缩图片以减少存储空间（800px 宽度，70% 质量）
    console.log('🔄 Compressing image...');
    const compressedImageUrl = await compressBase64Image(imageUrl, 800, 0.7);
    console.log(`✅ Image compressed: ${compressedImageUrl.substring(0, 100)}...`);
    
    return compressedImageUrl;
  } catch (error) {
    console.error('❌ Error generating card illustration:', error);
    throw error;
  }
}

/**
 * 完整的冷启动流程：提取内容 + 生成卡片
 */
export async function createChannelWithColdStart(
  bookTitle: string,
  author: string | undefined,
  userId: string,
  count: number = 6
): Promise<BookCard[]> {
  console.log(`Starting cold start for channel: ${bookTitle} (${count} cards)`);
  
  // Step 1: 提取书名内容
  const quoteCards = await extractBookContent(bookTitle, author, count);
  console.log(`Extracted ${quoteCards.length} quotes from book`);
  
  // Step 2: 为每个内容生成漫画卡片
  const cards: BookCard[] = [];
  
  for (let i = 0; i < quoteCards.length; i++) {
    const quoteCard = quoteCards[i];
    console.log(`Generating card ${i + 1}/${quoteCards.length}...`);
    
    try {
      // 生成图片
      const imageUrl = await generateCardIllustration(
        bookTitle,
        author,
        quoteCard.quote_text,
        quoteCard.drawing_prompt
      );
      
      // 创建卡片对象（图片 + 文字分离，前端组合显示）
      const card: BookCard = {
        id: `card_${Date.now()}_${i}`,
        text: quoteCard.quote_text,
        subtext: quoteCard.is_exact_quote ? undefined : '【大意】',
        cardType: 'Quote',
        bookTitle,
        author,
        imageUrl,
        createdAt: new Date().toISOString(),
        userId,
        likesCount: 0,
      };
      
      console.log(`✅ Card ${i + 1} created:`);
      console.log(`   - Text: "${quoteCard.quote_text}"`);
      console.log(`   - Image: ${imageUrl ? 'Yes' : 'No'}`);
      console.log(`   - Drawing prompt: "${quoteCard.drawing_prompt}"`);
      cards.push(card);
    } catch (error) {
      console.error(`Failed to generate card ${i + 1}:`, error);
      // 继续生成其他卡片，即使某张失败
    }
  }
  
  console.log(`Cold start completed: generated ${cards.length}/${quoteCards.length} cards`);
  return cards;
}

/**
 * Mock 版本的冷启动（用于开发/测试）
 */
export async function createChannelWithColdStartMock(
  bookTitle: string,
  author: string | undefined,
  userId: string,
  count: number = 6
): Promise<BookCard[]> {
  console.log(`[MOCK] Starting cold start for channel: ${bookTitle} (${count} cards)`);
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockQuotes = [
    { text: '人生最大的幸福，莫过于连一分钟都无法休息。', prompt: 'a tired clock running on a treadmill' },
    { text: '真正的自由不是想做什么就做什么，而是不想做什么就不做什么。', prompt: 'a bird in a cage with an open door' },
    { text: '我们花了两年学会说话，却要用一生学会闭嘴。', prompt: 'a mouth with a zipper slowly closing' },
    { text: '当你凝视深渊时，深渊也在凝视你。', prompt: 'two mirrors facing each other infinitely' },
    { text: '人生如茶，不会苦一辈子，但总会苦一阵子。', prompt: 'a teacup gradually changing colors' },
    { text: '你永远无法叫醒一个装睡的人。', prompt: 'an alarm clock ringing next to closed eyes' },
  ];
  
  const cards: BookCard[] = [];
  for (let i = 0; i < Math.min(count, mockQuotes.length); i++) {
    cards.push({
      id: `card_mock_${Date.now()}_${i}`,
      text: mockQuotes[i].text,
      cardType: 'Quote',
      bookTitle,
      author,
      imageUrl: `https://picsum.photos/seed/${bookTitle}_${i}/400/600`,
      createdAt: new Date().toISOString(),
      userId,
      likesCount: 0,
    });
  }
  
  console.log(`[MOCK] Cold start completed: generated ${cards.length} cards`);
  return cards;
}

