// User types
export interface User {
  id: string;
  username: string;
  email?: string; // 邮箱改为可选
  createdAt: string;
  likedCardIds: string[]; // 用户点赞的卡片 ID 列表
}

export interface AuthData {
  user: User;
  token?: string;
}

// Card & Channel types
export type CardType = 'Quote' | 'Concept' | 'Insight';
export type MediaType = 'image' | 'video';

export interface CardComment {
  id: string;
  personaName: string;
  personaEmoji: string;
  commentary: string;
  userId: string; // 添加评论的用户
  createdAt: string;
}

export interface BookCard {
  id: string;
  text: string;
  subtext?: string; // 可选说明文本
  cardType: CardType; // Quote / Concept / Insight
  bookTitle: string;
  author?: string;
  imageUrl?: string;
  mediaType?: MediaType; // 媒体类型：图片或视频
  createdAt: string;
  userId: string;
  sourceCardId?: string; // 如果是 twist 卡，记录原卡 ID
  likesCount?: number; // 点赞数
  comments?: CardComment[]; // Persona 评论列表
}

export interface Channel {
  id: string;
  name: string; // bookTitle
  author?: string;
  description?: string;
  userId: string;
  cards: BookCard[];
  createdAt: string;
  updatedAt: string;
  ownedByUser: boolean; // 是否由当前用户创建
  dropToFeed: boolean; // 是否出现在 Explore feed
  parentChannelId?: string; // 如果是 twist 创建的，记录父 Channel
  isPreset?: boolean; // 是否是预置频道（预置频道不能被删除）
}

// API types
export interface TextGenerationOptions {
  prompt?: string;
  count: number;
}

export interface ImageGenerationOptions {
  prompt: string;
  style?: string;
}

// Serendipity types
export type PersonaType = 'Marx' | 'Thatcher' | 'Musk' | 'Nietzsche' | 'Beauvoir' | 'Freud';

export interface Persona {
  id: PersonaType;
  name: string;
  nameCn: string; // 中文名
  emoji: string;
  description: string;
}

export interface SerendipityItem {
  id: string;
  originalCard: BookCard;
  persona: Persona;
  commentary: string; // persona 的锐评文本
  createdAt: string;
}

export interface SerendipityRecommendation {
  id: string;
  originalCard: BookCard; // 用户 liked 的卡片
  recommendedCard: BookCard; // 推荐的卡片
  reason: string; // 推荐理由
  createdAt: string;
}

// Worldchat types
export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

// Storage types
export interface StorageData {
  users: User[];
  channels: Channel[];
  serendipityItems: SerendipityItem[];
  serendipityRecommendations: SerendipityRecommendation[];
  currentUserId: string | null;
}

// View types
export type ViewType = 'explore' | 'my-channels' | 'serendipity' | 'auth';
