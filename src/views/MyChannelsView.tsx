import React, { useState } from 'react';
import { Layout, Modal, Button, UploadMediaModal } from '@/components';
import { useChannels } from '@/state/ChannelContext';
import { useAuth } from '@/state/AuthContext';
import { Trash2, ChevronLeft, ChevronRight, X, Upload } from 'lucide-react';
import { BookCard } from '@/types';
import { generateId } from '@/utils/helpers';
import { compressBase64Image } from '@/utils/imageCompression';

export const MyChannelsView: React.FC = () => {
  const { channels, deleteChannel, removeCardFromChannel, addCardToChannel } = useChannels();
  const { user } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteCardConfirm, setDeleteCardConfirm] = useState<{ channelId: string; cardId: string } | null>(null);
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 只显示自己创建的 Channel (ownedByUser = true)
  const myChannels = channels.filter(ch => ch.userId === user?.id);
  const expandedChannel = expandedChannelId ? channels.find(ch => ch.id === expandedChannelId) : null;
  const currentCard = expandedChannel?.cards[currentCardIndex];

  const handleDeleteChannel = (channelId: string) => {
    deleteChannel(channelId);
    setDeleteConfirm(null);
    if (expandedChannelId === channelId) {
      setExpandedChannelId(null);
    }
  };

  const handleToggleChannel = (channelId: string) => {
    if (expandedChannelId === channelId) {
      setExpandedChannelId(null);
    } else {
      setExpandedChannelId(channelId);
      setCurrentCardIndex(0);
    }
  };

  const handleNextCard = () => {
    if (!expandedChannel || expandedChannel.cards.length === 0) return;
    setCurrentCardIndex((curr) => (curr + 1) % expandedChannel.cards.length);
  };

  const handlePrevCard = () => {
    if (!expandedChannel || expandedChannel.cards.length === 0) return;
    setCurrentCardIndex((curr) => (curr - 1 + expandedChannel.cards.length) % expandedChannel.cards.length);
  };

  const handleDeleteCard = (channelId: string, cardId: string) => {
    removeCardFromChannel(channelId, cardId);
    setDeleteCardConfirm(null);
    // 调整当前卡片索引
    if (expandedChannel && currentCardIndex >= expandedChannel.cards.length - 1) {
      setCurrentCardIndex(Math.max(0, expandedChannel.cards.length - 2));
    }
  };

  const handleUpload = async (file: File, caption: string) => {
    if (!user || !expandedChannelId) return;

    const channel = channels.find(ch => ch.id === expandedChannelId);
    if (!channel) return;

    console.log('Uploading file:', file.name, file.type);

    // 读取文件为 Base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      let mediaUrl = e.target?.result as string;

      // 如果是图片，压缩处理
      if (file.type.startsWith('image/')) {
        console.log('Compressing image...');
        try {
          mediaUrl = await compressBase64Image(mediaUrl, 800, 0.7);
          console.log('Image compressed successfully');
        } catch (error) {
          console.error('Image compression failed:', error);
        }
      }

      // 创建新卡片
      const newCard: BookCard = {
        id: generateId(),
        text: caption || 'Uploaded Media',
        cardType: 'Quote',
        bookTitle: channel.name,
        author: channel.author,
        imageUrl: mediaUrl,
        createdAt: new Date().toISOString(),
        userId: user.id,
        likesCount: 0,
      };

      // 添加到 channel
      addCardToChannel(expandedChannelId, newCard);
      
      // 跳转到新上传的卡片
      const newIndex = channel.cards.length;
      setCurrentCardIndex(newIndex);
      
      console.log('Card added successfully');
    };

    reader.readAsDataURL(file);
  };


  return (
    <Layout>
      {/* Header - Blue Theme */}
      <div className="h-16 border-b-4 border-black flex items-end justify-between p-4 bg-[#0000FF] shrink-0 sticky top-0 z-10">
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">MY CHANNELS</h2>
        <div className="border-2 border-black px-2 py-1 font-bold text-xs bg-white text-black shadow-brutal-sm">
          {myChannels.length} SETS
        </div>
      </div>

      <div className="p-4 pb-24 bg-[#f0f0f0] min-h-full">
        <div className="grid grid-cols-2 gap-4">
          {myChannels.map((channel, i) => {
            const isLarge = i % 3 === 0;
            const colors = ['bg-[#FF0000] text-white', 'bg-[#FFD700] text-black', 'bg-[#0000FF] text-white', 'bg-white text-black'];
            const bgColor = colors[i % colors.length];
            const isExpanded = expandedChannelId === channel.id;
            
            return (
              <div 
                key={channel.id}
                className={`relative group border-4 border-black shadow-brutal cursor-pointer transition-all ${
                  isExpanded ? 'ring-4 ring-[#FF0000] ring-offset-2' : 'hover:-translate-y-1'
                } ${isLarge ? 'col-span-2 aspect-[2/1]' : 'col-span-1 aspect-square'}`}
              >
                {/* Image Area */}
                <div 
                  className="absolute inset-0 bottom-10 bg-gray-200 overflow-hidden"
                  onClick={() => handleToggleChannel(channel.id)}
                >
                  {channel.cards[0]?.imageUrl ? (
                    <img 
                      src={channel.cards[0].imageUrl} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                      alt="" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="font-bold text-gray-400">EMPTY</span>
                    </div>
                  )}
                  {/* Overlay Lines */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all" />
                </div>

                {/* Label Strip */}
                <div className={`absolute bottom-0 left-0 right-0 h-10 border-t-4 border-black flex items-center justify-between px-2 ${bgColor}`}>
                   <span className="font-bold text-sm uppercase truncate flex-1">{channel.name}</span>
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(channel.id);
                    }}
                    className="ml-2 w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors border-2 border-transparent hover:border-white"
                   >
                    <Trash2 size={16} strokeWidth={3} />
                   </button>
                </div>
                
                {/* Decorative corner block */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-black" />
              </div>
            );
          })}
        </div>

        {/* Expanded Channel Detail */}
        {expandedChannel && (
          <div className="mt-6 border-4 border-black bg-white shadow-brutal overflow-hidden animate-in slide-in-from-top duration-300">
            {/* Header */}
            <div className="h-14 border-b-4 border-black flex items-center justify-between px-4 bg-[#FFD700]">
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase truncate">{expandedChannel.name}</h3>
                <p className="text-xs font-bold text-gray-600">
                  {expandedChannel.author ? `by ${expandedChannel.author}` : 'Author unknown'} · {expandedChannel.cards.length} cards
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-10 h-10 bg-[#0000FF] text-white flex items-center justify-center hover:bg-blue-700 transition-colors border-2 border-black"
                  title="Upload media"
                >
                  <Upload size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => setExpandedChannelId(null)}
                  className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Card Display */}
            {expandedChannel.cards.length > 0 ? (
              <div className="relative bg-white">
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevCard}
                  className="absolute left-2 top-8 z-10 w-12 h-12 bg-white border-4 border-black shadow-brutal flex items-center justify-center hover:bg-gray-100 active:shadow-none active:translate-x-1"
                >
                  <ChevronLeft size={24} strokeWidth={3} />
                </button>
                <button
                  onClick={handleNextCard}
                  className="absolute right-2 top-8 z-10 w-12 h-12 bg-white border-4 border-black shadow-brutal flex items-center justify-center hover:bg-gray-100 active:shadow-none active:-translate-x-1"
                >
                  <ChevronRight size={24} strokeWidth={3} />
                </button>

                {/* Card Image and Comments - Scrollable */}
                <div className="max-h-[70vh] overflow-y-auto card-comments-scroll p-6">
                  <div className="flex flex-col items-center">
                    {/* Card Image */}
                    <div className="mb-4 w-full flex items-center justify-center">
                      {currentCard?.imageUrl ? (
                        <img
                          src={currentCard.imageUrl}
                          alt={currentCard.text}
                          className="w-full max-h-[60vh] object-contain border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}

                      {/* Fallback text display */}
                      <div
                        className="text-center max-w-md"
                        style={{ display: currentCard?.imageUrl ? 'none' : 'block' }}
                      >
                        <p className="text-2xl font-black uppercase leading-tight mb-4">
                          {currentCard?.text}
                        </p>
                        {currentCard?.subtext && (
                          <p className="text-base font-bold text-gray-600">
                            {currentCard.subtext}
                          </p>
                        )}
                        <div className="mt-4 text-sm text-gray-400">(Image not available)</div>
                      </div>
                    </div>

                    {/* Persona 评论区域 */}
                    {currentCard?.comments && currentCard.comments.length > 0 && (
                      <div className="w-full max-w-2xl space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-black" />
                          <span className="font-bold text-xs uppercase text-gray-600">PERSONA COMMENTS ({currentCard.comments.length})</span>
                        </div>
                        {currentCard.comments.map((comment) => (
                          <div 
                            key={comment.id} 
                            className="border-4 border-black bg-white shadow-brutal p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-[#FFD700] border-2 border-black flex items-center justify-center text-lg">
                                {comment.personaEmoji}
                              </div>
                              <div className="font-black text-sm uppercase">{comment.personaName}</div>
                            </div>
                            <p className="font-bold text-base leading-relaxed border-l-4 border-black pl-3 whitespace-pre-wrap break-words">
                              {comment.commentary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Indicators and Delete Button */}
                <div className="flex items-center justify-center gap-4 pb-4 px-4 border-t-4 border-black bg-gray-50">
                  <div className="flex justify-center gap-2 flex-1 py-4">
                  {expandedChannel.cards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCardIndex(idx)}
                      className={`w-3 h-3 border-2 border-black transition-colors ${
                        idx === currentCardIndex ? 'bg-black' : 'bg-white hover:bg-gray-300'
                      }`}
                    />
                  ))}
                  </div>
                  {currentCard && (
                    <button
                      onClick={() => setDeleteCardConfirm({ channelId: expandedChannel.id, cardId: currentCard.id })}
                      className="w-10 h-10 bg-[#FF0000] text-white border-2 border-black flex items-center justify-center hover:bg-red-700 transition-colors"
                      title="Delete this card"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-2xl font-black uppercase text-gray-400 mb-2">EMPTY CHANNEL</p>
                  <p className="text-sm font-bold text-gray-500">No cards yet</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {myChannels.length === 0 && (
          <div className="text-center py-12 border-4 border-black border-dashed m-4 bg-white">
            <h3 className="text-2xl font-black uppercase mb-2">NO CHANNELS YET</h3>
            <p className="font-bold text-gray-600">Create your first book channel</p>
          </div>
        )}
      </div>

      {/* Delete Channel Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="DELETE CHANNEL"
        >
          <div className="space-y-6">
            <p className="text-lg font-bold">
              Are you sure you want to delete this channel? All cards will be permanently removed.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)} fullWidth>
                CANCEL
              </Button>
              <Button variant="accent" onClick={() => handleDeleteChannel(deleteConfirm)} fullWidth>
                DELETE
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Card Confirmation Modal */}
      {deleteCardConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteCardConfirm(null)}
          title="DELETE CARD"
        >
          <div className="space-y-6">
            <p className="text-lg font-bold">
              Are you sure you want to delete this card?
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setDeleteCardConfirm(null)} fullWidth>
                CANCEL
              </Button>
              <Button 
                variant="accent" 
                onClick={() => handleDeleteCard(deleteCardConfirm.channelId, deleteCardConfirm.cardId)} 
                fullWidth
              >
                DELETE
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Media Modal */}
      {expandedChannel && (
        <UploadMediaModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          channelName={expandedChannel.name}
        />
      )}
    </Layout>
  );
};
