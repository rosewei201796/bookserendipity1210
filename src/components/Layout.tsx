import React, { useState } from 'react';
import { BottomNav } from './BottomNav';
import { StatusBar } from './StatusBar';
import { FAB } from './FAB';
import { CreateChannelModal } from './CreateChannelModal';
import { useAuth } from '@/state/AuthContext';
import { useChannels } from '@/state/ChannelContext';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNav = true,
  className = '' 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { createChannelWithCards } = useChannels();

  // 创建新 Channel（使用冷启动，生成 5-7 张卡片）
  const handleCreateChannel = async (bookTitle: string, author: string, dropToFeed: boolean) => {
    if (!user) return;

    // 使用新的冷启动方法，会自动生成 5-7 张卡片
    await createChannelWithCards(bookTitle, author || undefined, dropToFeed);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white relative">
      <StatusBar />
      {/* Main content area - fills space between StatusBar and BottomNav */}
      <div className="flex-1 relative overflow-hidden flex flex-col pt-12">
        <main className={`flex-1 flex flex-col relative overflow-y-auto no-scrollbar ${className} ${showNav ? 'pb-0' : 'pb-4'}`}>
          {children}
        </main>
      </div>
      {showNav && <BottomNav />}
      
      {/* Global FAB - always visible */}
      <FAB onClick={() => setShowCreateModal(true)} />
      
      {/* Global Create Channel Modal */}
      <CreateChannelModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateChannel}
      />
    </div>
  );
};
