import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '@/state/ChatContext';
import { useAuth } from '@/state/AuthContext';

interface WorldchatProps {
  channelId: string;
  channelName: string;
}

export const Worldchat: React.FC<WorldchatProps> = ({ channelId, channelName }) => {
  const { user } = useAuth();
  const { getChannelMessages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = getChannelMessages(channelId);
  
  // 每秒更新当前时间，用于过滤消息
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // 只显示 5 秒内的消息
  const recentMessages = messages.filter(msg => {
    const messageTime = new Date(msg.createdAt).getTime();
    const timeDiff = currentTime - messageTime;
    return timeDiff < 5000; // 5 秒 = 5000 毫秒
  });

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current && recentMessages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [recentMessages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    sendMessage(channelId, inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* 消息显示区域（半透明） */}
      <div 
        className={`pointer-events-none transition-all duration-300 ${
          isExpanded ? 'h-64' : 'h-32'
        } overflow-hidden pr-20`}
      >
        <div className="h-full overflow-y-auto bg-gradient-to-t from-black/70 to-transparent px-4 py-2 flex flex-col justify-end">
          <div className="space-y-1">
            {recentMessages.slice(-8).map((msg) => {
              const messageTime = new Date(msg.createdAt).getTime();
              const age = currentTime - messageTime;
              const isFading = age > 4000; // 4 秒后开始淡出
              
              return (
                <div 
                  key={msg.id}
                  className={`text-white text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-opacity duration-1000 ${
                    isFading ? 'opacity-0' : 'opacity-100 animate-slide-in-bottom'
                  }`}
                >
                  <span className="text-[#FFD700]">{msg.username}: </span>
                  <span>{msg.text}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-black/90 border-t-4 border-black px-4 py-3 pr-20 flex gap-2 items-center pointer-events-auto">
        {/* Channel 信息 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-xs font-bold text-white bg-[#0000FF] px-2 py-1 border-2 border-white"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
        
        {/* 输入框 */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Chat about ${channelName}...`}
          className="flex-1 h-10 px-3 bg-white border-4 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          maxLength={100}
        />
        
        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="shrink-0 w-10 h-10 bg-[#FF0000] border-4 border-black flex items-center justify-center text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

