import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { useAuth } from './AuthContext';

interface ChatContextValue {
  messages: ChatMessage[];
  sendMessage: (channelId: string, text: string) => void;
  getChannelMessages: (channelId: string) => ChatMessage[];
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 从 localStorage 加载消息
  useEffect(() => {
    const stored = localStorage.getItem('ai-book-chat-messages');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse chat messages:', error);
      }
    }
  }, []);

  // 保存消息到 localStorage
  useEffect(() => {
    localStorage.setItem('ai-book-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (channelId: string, text: string) => {
    if (!user || !text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      userId: user.id,
      username: user.username,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const getChannelMessages = (channelId: string): ChatMessage[] => {
    return messages
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, getChannelMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

