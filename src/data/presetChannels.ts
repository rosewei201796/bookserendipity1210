/**
 * 预置频道数据
 * 这些频道会在应用初始化时自动加载，所有用户都能看到
 */

import { Channel } from '@/types';

/**
 * 系统用户ID - 用于标识预置内容的创建者
 */
export const SYSTEM_USER_ID = 'system';

/**
 * 预置频道列表
 * 这里会存放预定义的频道数据，包含图片和视频内容
 */
export const PRESET_CHANNELS: Channel[] = [
  // ==========================================
  // 频道 1：《健全的社会》by 弗洛姆
  // ==========================================
  {
    id: 'preset_healthy_society',
    name: '健全的社会',
    author: '弗洛姆',
    description: '健全的社会 by 弗洛姆',
    userId: SYSTEM_USER_ID,
    cards: [
      {
        id: 'preset_healthy_society_card_1',
        text: '我们以为自己是自由的,但我们只是在选择别人为我们设定的选项。',
        cardType: 'Quote',
        bookTitle: '健全的社会',
        author: '弗洛姆',
        imageUrl: '/preset-media/fromm-1.mp4',
        mediaType: 'video',
        createdAt: new Date().toISOString(),
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
      {
        id: 'preset_healthy_society_card_2',
        text: '个人的整个一生不是别的而是诞下自己的过程。的确，我们在死亡之时应达到最完全的生——虽然大多数人的悲惨命运是在诞下自己之前便死了。',
        cardType: 'Quote',
        bookTitle: '健全的社会',
        author: '弗洛姆',
        imageUrl: '/preset-media/fromm-2.mp4',
        mediaType: 'video',
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
  },
  
  // ==========================================
  // 频道 2：Self Growth by bookthing
  // ==========================================
  {
    id: 'preset_self_growth',
    name: 'Self Growth',
    author: 'bookthing',
    description: 'Self Growth by bookthing',
    userId: SYSTEM_USER_ID,
    cards: [
      {
        id: 'preset_self_growth_card_1',
        text: "My no isn't a personal attack on you. It's a yes to my own peace of mind.",
        cardType: 'Insight',
        bookTitle: 'Self Growth',
        author: 'bookthing',
        imageUrl: '/preset-media/bookthingboundary.mp4',
        mediaType: 'video',
        createdAt: new Date().toISOString(),
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
      {
        id: 'preset_self_growth_card_2',
        text: '"改变型伴侣"追求成长、洞见和进步；而"接纳型伴侣"，则守护着"当下"的堡垒，觉得一切都很好 轻松自在。这既是吸引，也会带来错配和问题',
        cardType: 'Quote',
        bookTitle: 'Self Growth',
        author: 'bookthing',
        imageUrl: '/preset-media/bookthingintimacypattern.mp4',
        mediaType: 'video',
        createdAt: new Date().toISOString(),
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
      {
        id: 'preset_self_growth_card_3',
        text: '有两样东西我们不应该去强求，真正的朋友和真正的爱。人们总会为真正在乎的人腾出时间，当有人说他们太忙时，只是优先级不够罢了',
        cardType: 'Insight',
        bookTitle: 'Self Growth',
        author: 'bookthing',
        imageUrl: '/preset-media/bookthingletthemgo.mp4',
        mediaType: 'video',
        createdAt: new Date().toISOString(),
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
      {
        id: 'preset_self_growth_card_4',
        text: '最终你会发现 ，只有你自己；没人会来救你，始终只有你，永远只有你',
        cardType: 'Insight',
        bookTitle: 'Self Growth',
        author: 'bookthing',
        imageUrl: '/preset-media/bookthingnoone.mp4',
        mediaType: 'video',
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
  },
  
  // ==========================================
  // 在这里添加更多预置频道...
  // ==========================================
];

