import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Channel, BookCard, CardComment } from '@/types';
import { 
  getUserChannels, 
  addChannel as addChannelToStorage,
  updateChannel as updateChannelInStorage,
  deleteChannel as deleteChannelFromStorage,
  getAllChannels,
} from '@/utils/storage';
import { useAuth } from './AuthContext';
import { generateId } from '@/utils/helpers';
import { 
  createChannelWithColdStart, 
  createChannelWithColdStartMock 
} from '@/services/channelColdStart';

interface ChannelContextType {
  channels: Channel[];
  allChannels: Channel[];
  refreshChannels: () => void;
  createChannel: (name: string, author?: string, dropToFeed?: boolean) => Promise<Channel>;
  createChannelWithCards: (bookTitle: string, author: string | undefined, dropToFeed: boolean) => Promise<Channel>;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  deleteChannel: (channelId: string) => void;
  addCardToChannel: (channelId: string, card: BookCard) => void;
  removeCardFromChannel: (channelId: string, cardId: string) => void;
  updateCardInChannel: (channelId: string, cardId: string, updates: Partial<BookCard>) => void;
  addCommentToCard: (channelId: string, cardId: string, comment: Omit<CardComment, 'id' | 'createdAt'>) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);

  const refreshChannels = () => {
    if (user) {
      setChannels(getUserChannels(user.id));
    } else {
      setChannels([]);
    }
    setAllChannels(getAllChannels());
  };

  useEffect(() => {
    refreshChannels();
  }, [user]);

  const createChannel = async (
    name: string, 
    author?: string, 
    dropToFeed: boolean = true
  ): Promise<Channel> => {
    if (!user) {
      throw new Error('User must be logged in to create channels');
    }

    const newChannel: Channel = {
      id: generateId(),
      name,
      author,
      description: author ? `${name} by ${author}` : name,
      userId: user.id,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownedByUser: true,
      dropToFeed,
    };

    addChannelToStorage(newChannel);
    refreshChannels();
    return newChannel;
  };

  /**
   * 创建 channel 并使用冷启动生成初始卡片（5-7张）
   */
  const createChannelWithCards = async (
    bookTitle: string,
    author: string | undefined,
    dropToFeed: boolean = true
  ): Promise<Channel> => {
    if (!user) {
      throw new Error('User must be logged in to create channels');
    }

    console.log(`Creating channel with cold start: ${bookTitle}`);

    // Step 1: 创建空 channel
    const newChannel: Channel = {
      id: generateId(),
      name: bookTitle,
      author,
      description: author ? `${bookTitle} by ${author}` : bookTitle,
      userId: user.id,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownedByUser: true,
      dropToFeed,
    };

    addChannelToStorage(newChannel);

    // Step 2: 执行冷启动生成卡片（5-7张）
    try {
      // 根据环境变量决定使用真实 API 还是 Mock
      const useMock = !import.meta.env.VITE_VERTEX_AI_API_KEY;
      const count = Math.floor(Math.random() * 3) + 5; // 随机 5-7 张

      let cards: BookCard[];
      if (useMock) {
        console.log('[MOCK MODE] Using mock cold start');
        cards = await createChannelWithColdStartMock(bookTitle, author, user.id, count);
      } else {
        console.log('[PROD MODE] Using Vertex AI cold start');
        cards = await createChannelWithColdStart(bookTitle, author, user.id, count);
      }

      // Step 3: 将生成的卡片添加到 channel
      newChannel.cards = cards;
      updateChannelInStorage(newChannel.id, { cards });
      
      console.log(`✅ Channel created with ${cards.length} cards`);
      console.log('📋 Card details:');
      cards.forEach((card, idx) => {
        console.log(`   Card ${idx + 1}: "${card.text}" | Image: ${card.imageUrl ? 'Yes ✓' : 'No ✗'}`);
      });
    } catch (error) {
      console.error('Cold start failed:', error);
      // 即使冷启动失败，channel 也已创建，只是没有卡片
      throw new Error(`Failed to generate cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    refreshChannels();
    return newChannel;
  };

  const updateChannel = (channelId: string, updates: Partial<Channel>): void => {
    updateChannelInStorage(channelId, updates);
    refreshChannels();
  };

  const deleteChannel = (channelId: string): void => {
    deleteChannelFromStorage(channelId);
    refreshChannels();
  };

  const addCardToChannel = (channelId: string, card: BookCard): void => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      const updatedCards = [...channel.cards, card];
      updateChannelInStorage(channelId, { cards: updatedCards });
      refreshChannels();
    }
  };

  const removeCardFromChannel = (channelId: string, cardId: string): void => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      const updatedCards = channel.cards.filter(c => c.id !== cardId);
      updateChannelInStorage(channelId, { cards: updatedCards });
      refreshChannels();
    }
  };

  const updateCardInChannel = (channelId: string, cardId: string, updates: Partial<BookCard>): void => {
    const allChannelsList = getAllChannels();
    const channel = allChannelsList.find(c => c.id === channelId);
    if (channel) {
      const updatedCards = channel.cards.map(c => 
        c.id === cardId ? { ...c, ...updates } : c
      );
      updateChannelInStorage(channelId, { cards: updatedCards });
      refreshChannels();
    }
  };

  const addCommentToCard = (
    channelId: string, 
    cardId: string, 
    comment: Omit<CardComment, 'id' | 'createdAt'>
  ): void => {
    const allChannelsList = getAllChannels();
    const channel = allChannelsList.find(c => c.id === channelId);
    if (channel) {
      const updatedCards = channel.cards.map(c => {
        if (c.id === cardId) {
          const newComment: CardComment = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...comment,
          };
          const existingComments = c.comments || [];
          return { 
            ...c, 
            comments: [...existingComments, newComment] 
          };
        }
        return c;
      });
      updateChannelInStorage(channelId, { cards: updatedCards });
      refreshChannels();
    }
  };

  const value: ChannelContextType = {
    channels,
    allChannels,
    refreshChannels,
    createChannel,
    createChannelWithCards,
    updateChannel,
    deleteChannel,
    addCardToChannel,
    removeCardFromChannel,
    updateCardInChannel,
    addCommentToCard,
  };

  return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
};

export const useChannels = (): ChannelContextType => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannels must be used within a ChannelProvider');
  }
  return context;
};

