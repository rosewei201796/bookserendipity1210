import { StorageData, User, Channel, SerendipityItem, SerendipityRecommendation } from '@/types';
import { PRESET_CHANNELS } from '@/data/presetChannels';

const STORAGE_KEY = 'ai-book-channels-data';
const MAX_CHANNELS_TO_KEEP = 5; // 只保留最近的 5 个 channels（图片较大）

// Default storage structure
const defaultStorage: StorageData = {
  users: [],
  channels: [],
  serendipityItems: [],
  serendipityRecommendations: [],
  currentUserId: null,
};

/**
 * Clean up old channels to free up storage space
 * 注意：预置频道不会被清理
 */
export const cleanupOldChannels = (data: StorageData): StorageData => {
  // 分离预置频道和用户频道
  const presetChannels = data.channels.filter(c => c.isPreset);
  const userChannels = data.channels.filter(c => !c.isPreset);
  
  if (userChannels.length <= MAX_CHANNELS_TO_KEEP) {
    return data;
  }
  
  // Sort user channels by creation date (newest first) and keep only the most recent ones
  const sortedUserChannels = [...userChannels].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const userChannelsToKeep = sortedUserChannels.slice(0, MAX_CHANNELS_TO_KEEP);
  
  console.log(`Cleaned up ${userChannels.length - userChannelsToKeep.length} old user channels`);
  
  return {
    ...data,
    channels: [...presetChannels, ...userChannelsToKeep],
  };
};

/**
 * Get all data from localStorage
 */
export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return { ...defaultStorage };
};

/**
 * Save all data to localStorage
 */
export const setStorageData = (data: StorageData): void => {
  try {
    // First, try to cleanup old channels to free up space
    const cleanedData = cleanupOldChannels(data);
    
    const dataStr = JSON.stringify(cleanedData);
    
    // Check data size (localStorage limit is usually ~5-10MB)
    const sizeInMB = new Blob([dataStr]).size / (1024 * 1024);
    console.log(`💾 Storage size: ${sizeInMB.toFixed(2)} MB (${cleanedData.channels.length} channels)`);
    
    // Log image count
    const totalImages = cleanedData.channels.reduce((sum, ch) => 
      sum + ch.cards.filter(card => card.imageUrl).length, 0
    );
    console.log(`🖼️ Total images in storage: ${totalImages}`);
    
    localStorage.setItem(STORAGE_KEY, dataStr);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    
    // If quota exceeded, try to save without images
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded. Saving data without images...');
      try {
        // Remove imageUrl from all cards to reduce size
        const dataWithoutImages = {
          ...data,
          channels: data.channels.map(channel => ({
            ...channel,
            cards: channel.cards.map(card => ({
              ...card,
              imageUrl: undefined, // Remove base64 images
            })),
          })),
        };
        
        // Also cleanup old channels
        const cleanedDataWithoutImages = cleanupOldChannels(dataWithoutImages);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedDataWithoutImages));
        alert('提示：由于存储空间限制，图片将不会被保存。刷新页面后图片可能会消失。');
      } catch (retryError) {
        console.error('Failed to save even without images:', retryError);
        alert('存储空间不足，无法保存数据。请清理浏览器缓存或删除一些旧的 Channels。');
      }
    } else {
      throw error;
    }
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const data = getStorageData();
  if (!data.currentUserId) return null;
  return data.users.find((u: User) => u.id === data.currentUserId) || null;
};

/**
 * Set current user
 */
export const setCurrentUser = (userId: string | null): void => {
  const data = getStorageData();
  data.currentUserId = userId;
  setStorageData(data);
};

/**
 * Add a user
 */
export const addUser = (user: User): void => {
  const data = getStorageData();
  data.users.push(user);
  setStorageData(data);
};

/**
 * Get user by email
 */
export const getUserByEmail = (email: string): User | undefined => {
  const data = getStorageData();
  return data.users.find(u => u.email === email);
};

/**
 * Get user by username
 */
export const getUserByUsername = (username: string): User | undefined => {
  const data = getStorageData();
  return data.users.find(u => u.username === username);
};

/**
 * Get channels for current user
 */
export const getUserChannels = (userId: string): Channel[] => {
  const data = getStorageData();
  return data.channels.filter((c: Channel) => c.userId === userId);
};

/**
 * Add a channel
 */
export const addChannel = (channel: Channel): void => {
  const data = getStorageData();
  data.channels.push(channel);
  setStorageData(data);
};

/**
 * Update a channel
 */
export const updateChannel = (channelId: string, updates: Partial<Channel>): void => {
  const data = getStorageData();
  const index = data.channels.findIndex(c => c.id === channelId);
  if (index !== -1) {
    data.channels[index] = {
      ...data.channels[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorageData(data);
  }
};

/**
 * Delete a channel
 * 注意：预置频道不能被删除
 */
export const deleteChannel = (channelId: string): void => {
  const data = getStorageData();
  const channelToDelete = data.channels.find(c => c.id === channelId);
  
  // 阻止删除预置频道
  if (channelToDelete?.isPreset) {
    console.warn('Cannot delete preset channel');
    return;
  }
  
  data.channels = data.channels.filter((c: Channel) => c.id !== channelId);
  setStorageData(data);
};

/**
 * 初始化预置频道
 * 如果预置频道还未加载到 storage 中，则加载它们
 */
export const initializePresetChannels = (): void => {
  const data = getStorageData();
  
  // 检查预置频道是否已存在
  const existingPresetIds = new Set(
    data.channels.filter(c => c.isPreset).map(c => c.id)
  );
  
  // 添加新的预置频道
  let added = 0;
  for (const presetChannel of PRESET_CHANNELS) {
    if (!existingPresetIds.has(presetChannel.id)) {
      data.channels.push(presetChannel);
      added++;
    }
  }
  
  if (added > 0) {
    console.log(`📦 Initialized ${added} preset channels`);
    setStorageData(data);
  }
};

/**
 * Get all channels (for explore view)
 * 自动包含预置频道
 */
export const getAllChannels = (): Channel[] => {
  // 确保预置频道已初始化
  initializePresetChannels();
  
  const data = getStorageData();
  return data.channels;
};

/**
 * Clear all data (for testing/reset)
 */
export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Remove images from all cards to free up storage space
 */
export const removeAllImages = (): void => {
  const data = getStorageData();
  const dataWithoutImages = {
    ...data,
    channels: data.channels.map(channel => ({
      ...channel,
      cards: channel.cards.map(card => ({
        ...card,
        imageUrl: undefined,
      })),
    })),
  };
  setStorageData(dataWithoutImages);
  console.log('All images removed from storage');
};

/**
 * Get storage size in MB
 */
export const getStorageSize = (): number => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;
    return new Blob([data]).size / (1024 * 1024);
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

/**
 * Get all serendipity items for a user
 */
export const getUserSerendipityItems = (userId: string): SerendipityItem[] => {
  const data = getStorageData();
  if (!data.serendipityItems) return [];
  // Filter by cards that the user has liked
  const user = data.users.find(u => u.id === userId);
  if (!user) return [];
  return data.serendipityItems.filter(item => 
    user.likedCardIds.includes(item.originalCard.id)
  );
};

/**
 * Add a serendipity item
 */
export const addSerendipityItem = (item: SerendipityItem): void => {
  const data = getStorageData();
  if (!data.serendipityItems) {
    data.serendipityItems = [];
  }
  // Check if item already exists for this card
  const existingIndex = data.serendipityItems.findIndex(
    s => s.originalCard.id === item.originalCard.id
  );
  if (existingIndex !== -1) {
    // Replace existing item
    data.serendipityItems[existingIndex] = item;
  } else {
    // Add new item
    data.serendipityItems.push(item);
  }
  setStorageData(data);
};

/**
 * Update a serendipity item
 */
export const updateSerendipityItem = (itemId: string, updates: Partial<SerendipityItem>): void => {
  const data = getStorageData();
  if (!data.serendipityItems) return;
  const index = data.serendipityItems.findIndex(item => item.id === itemId);
  if (index !== -1) {
    data.serendipityItems[index] = {
      ...data.serendipityItems[index],
      ...updates,
    };
    setStorageData(data);
  }
};

/**
 * Delete a serendipity item
 */
export const deleteSerendipityItem = (itemId: string): void => {
  const data = getStorageData();
  if (!data.serendipityItems) return;
  data.serendipityItems = data.serendipityItems.filter(item => item.id !== itemId);
  setStorageData(data);
};

/**
 * Get all serendipity recommendations for a user
 */
export const getUserSerendipityRecommendations = (userId: string): SerendipityRecommendation[] => {
  const data = getStorageData();
  if (!data.serendipityRecommendations) return [];
  const user = data.users.find(u => u.id === userId);
  if (!user) return [];
  return data.serendipityRecommendations.filter(item => 
    user.likedCardIds.includes(item.originalCard.id)
  );
};

/**
 * Add a serendipity recommendation
 */
export const addSerendipityRecommendation = (item: SerendipityRecommendation): void => {
  const data = getStorageData();
  if (!data.serendipityRecommendations) {
    data.serendipityRecommendations = [];
  }
  // Check if recommendation already exists for this card
  const existingIndex = data.serendipityRecommendations.findIndex(
    r => r.originalCard.id === item.originalCard.id
  );
  if (existingIndex !== -1) {
    // Replace existing recommendation
    data.serendipityRecommendations[existingIndex] = item;
  } else {
    // Add new recommendation
    data.serendipityRecommendations.push(item);
  }
  setStorageData(data);
};

/**
 * Delete a serendipity recommendation
 */
export const deleteSerendipityRecommendation = (itemId: string): void => {
  const data = getStorageData();
  if (!data.serendipityRecommendations) return;
  data.serendipityRecommendations = data.serendipityRecommendations.filter(item => item.id !== itemId);
  setStorageData(data);
};

