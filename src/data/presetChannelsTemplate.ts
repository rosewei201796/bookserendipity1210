/**
 * 预置频道模板
 * 复制此模板到 presetChannels.ts 并填入你的内容
 */

import { Channel, BookCard } from '@/types';
import { SYSTEM_USER_ID } from './presetChannels';

// 示例：如何定义一个预置频道
// @ts-ignore - 这是一个示例，实际使用时取消注释
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleChannel: Channel = {
  id: 'preset_example_1',
  name: '在此填写书名',
  author: '在此填写作者',
  description: '在此填写描述',
  userId: SYSTEM_USER_ID,
  cards: [
    // 图片卡片示例
    {
      id: 'preset_example_card_1',
      text: '卡片文字内容',
      subtext: '可选的说明文字',
      cardType: 'Quote',  // 'Quote' | 'Concept' | 'Insight'
      bookTitle: '在此填写书名（需与频道名称一致）',
      author: '作者',
      imageUrl: 'data:image/jpeg;base64,在此粘贴 Base64 图片数据',
      mediaType: 'image',
      createdAt: new Date().toISOString(),
      userId: SYSTEM_USER_ID,
      likesCount: 0,
    },
    // 视频卡片示例
    {
      id: 'preset_example_card_2',
      text: '视频卡片文字',
      cardType: 'Concept',
      bookTitle: '在此填写书名（需与频道名称一致）',
      imageUrl: 'data:video/mp4;base64,在此粘贴 Base64 视频数据',
      mediaType: 'video',
      createdAt: new Date().toISOString(),
      userId: SYSTEM_USER_ID,
      likesCount: 0,
    },
    // 使用外部 URL 的图片示例
    {
      id: 'preset_example_card_3',
      text: '使用外部图片 URL',
      cardType: 'Insight',
      bookTitle: '在此填写书名',
      imageUrl: 'https://example.com/image.jpg',
      mediaType: 'image',
      createdAt: new Date().toISOString(),
      userId: SYSTEM_USER_ID,
      likesCount: 0,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownedByUser: false,
  dropToFeed: true,
  isPreset: true,
};

// 辅助函数：快速创建卡片
export function createPresetCard(params: {
  id: string;
  text: string;
  bookTitle: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  cardType?: 'Quote' | 'Concept' | 'Insight';
  author?: string;
  subtext?: string;
}): BookCard {
  return {
    id: params.id,
    text: params.text,
    subtext: params.subtext,
    cardType: params.cardType || 'Quote',
    bookTitle: params.bookTitle,
    author: params.author,
    imageUrl: params.imageUrl,
    mediaType: params.mediaType || 'image',
    createdAt: new Date().toISOString(),
    userId: SYSTEM_USER_ID,
    likesCount: 0,
  };
}

// 辅助函数：快速创建频道
export function createPresetChannel(params: {
  id: string;
  name: string;
  cards: BookCard[];
  author?: string;
  description?: string;
}): Channel {
  return {
    id: params.id,
    name: params.name,
    author: params.author,
    description: params.description || `${params.name}${params.author ? ` by ${params.author}` : ''}`,
    userId: SYSTEM_USER_ID,
    cards: params.cards,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownedByUser: false,
    dropToFeed: true,
    isPreset: true,
  };
}

// 使用辅助函数的示例
// @ts-ignore - 这是一个示例，实际使用时取消注释
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const quickExampleChannel = createPresetChannel({
  id: 'preset_quick_example',
  name: '快速示例',
  author: '示例作者',
  cards: [
    createPresetCard({
      id: 'preset_quick_card_1',
      text: '这是一个快速创建的卡片',
      bookTitle: '快速示例',
      imageUrl: 'https://picsum.photos/400/600',
      cardType: 'Quote',
    }),
    createPresetCard({
      id: 'preset_quick_card_2',
      text: '这是一个视频卡片',
      bookTitle: '快速示例',
      imageUrl: 'data:video/mp4;base64,...',
      mediaType: 'video',
      cardType: 'Concept',
    }),
  ],
});

