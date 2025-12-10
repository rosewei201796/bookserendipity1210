import React, { useState, useRef } from 'react';
import { Layout, FlipModal, Worldchat } from '@/components';
import { Heart, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, Play } from 'lucide-react';
import { useChannels } from '@/state/ChannelContext';
import { useAuth } from '@/state/AuthContext';
import { BookCard, CardType, SerendipityRecommendation } from '@/types';
import { generateImageForCard } from '@/services/imageGeneration';
import { generateId } from '@/utils/helpers';
import { generateRecommendationCard } from '@/services/serendipity';
import { addSerendipityRecommendation } from '@/utils/storage';

export const ExploreView: React.FC = () => {
  const { allChannels, channels, createChannel, addCardToChannel, updateChannel, updateCardInChannel, addCommentToCard } = useChannels();
  const { user, toggleLike } = useAuth();
  
  // 只显示 dropToFeed = true 的 Channel
  const feedChannels = allChannels.filter(ch => ch.dropToFeed);
  
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentChannel = feedChannels[currentChannelIndex];
  const currentCard = currentChannel?.cards[currentCardIndex];
  const isLiked = currentCard && user?.likedCardIds?.includes(currentCard.id);

  // 播放视频
  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    e.preventDefault(); // 阻止默认行为
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  // 切换 Channel 时重置 cardIndex（已在 handleNextChannel/handlePrevChannel 中处理）
  // 不再需要随机开始位置

  // 上下滑动：切换卡片（支持循环）
  const handleNextCard = () => {
    if (!currentChannel || currentChannel.cards.length === 0) return;
    setCurrentCardIndex((curr) => (curr + 1) % currentChannel.cards.length);
    setIsVideoPlaying(false); // 重置播放状态
  };

  const handlePrevCard = () => {
    if (!currentChannel || currentChannel.cards.length === 0) return;
    setCurrentCardIndex((curr) => (curr - 1 + currentChannel.cards.length) % currentChannel.cards.length);
    setIsVideoPlaying(false); // 重置播放状态
  };

  // 左右滑动：切换 Channel（支持循环）
  const handleNextChannel = () => {
    if (feedChannels.length > 0) {
      setCurrentChannelIndex((curr) => (curr + 1) % feedChannels.length);
      setCurrentCardIndex(0); // 重置到第一张卡片
      setIsVideoPlaying(false); // 重置播放状态
    }
  };

  const handlePrevChannel = () => {
    if (feedChannels.length > 0) {
      setCurrentChannelIndex((curr) => (curr - 1 + feedChannels.length) % feedChannels.length);
      setCurrentCardIndex(0); // 重置到第一张卡片
      setIsVideoPlaying(false); // 重置播放状态
    }
  };

  // Like 功能
  const handleLike = async () => {
    if (currentCard && currentChannel) {
      const isCurrentlyLiked = user?.likedCardIds?.includes(currentCard.id);
      toggleLike(currentCard.id);
      
      // 更新卡片的点赞数
      const currentLikesCount = currentCard.likesCount || 0;
      const newLikesCount = isCurrentlyLiked ? currentLikesCount - 1 : currentLikesCount + 1;
      updateCardInChannel(currentChannel.id, currentCard.id, { 
        likesCount: Math.max(0, newLikesCount) 
      });

      // 如果是点赞（不是取消点赞），生成推荐卡片
      if (!isCurrentlyLiked) {
        setIsGeneratingRecommendation(true);
        try {
          console.log('Generating recommendation for liked card...');
          const recommendedCard = await generateRecommendationCard(currentCard);
          const recommendation: SerendipityRecommendation = {
            id: generateId(),
            originalCard: currentCard,
            recommendedCard: recommendedCard,
            reason: recommendedCard.subtext || 'Related content',
            createdAt: new Date().toISOString(),
          };
          addSerendipityRecommendation(recommendation);
          console.log('Recommendation generated and saved');
        } catch (error) {
          console.error('Failed to generate recommendation:', error);
          // 静默失败，不影响点赞功能
        } finally {
          setIsGeneratingRecommendation(false);
        }
      }
    }
  };

  // Apply Flip
  const handleApplyFlip = async (
    personaCommentary: string,
    personaName: string,
    personaEmoji: string
  ) => {
    if (!user || !currentCard || !currentChannel) return;

    // 添加评论到当前卡片
    addCommentToCard(currentChannel.id, currentCard.id, {
      personaName,
      personaEmoji,
      commentary: personaCommentary,
      userId: user.id,
    });
  };

  // Badge 颜色
  const getBadgeColor = (type: CardType) => {
    switch (type) {
      case 'Quote': return 'bg-[#FF0000] text-white';
      case 'Concept': return 'bg-[#0000FF] text-white';
      case 'Insight': return 'bg-[#FFD700] text-black';
    }
  };

  if (feedChannels.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-white">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#FF0000] border-4 border-black"></div>
          <div className="absolute bottom-20 right-10 w-32 h-12 bg-[#0000FF] border-4 border-black"></div>
          
          <div className="relative z-10 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase mb-4">NO CHANNELS YET</h2>
            <p className="text-sm font-bold text-gray-600 mb-6">Create your first book channel to start exploring</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 一屏一卡：沉浸式体验 */}
      <div className="flex-1 flex flex-col relative bg-white overflow-hidden">
        
        {/* 上部信息区 */}
        <div className="h-auto min-h-[80px] border-b-4 border-black p-4 bg-white shrink-0 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase leading-tight">{currentCard?.bookTitle}</h2>
            {currentCard?.author && (
              <p className="text-sm font-bold text-gray-600 mt-1">{currentCard.author}</p>
            )}
          </div>
          {currentCard && (
            <div className={`px-3 py-1 border-2 border-black font-black text-xs uppercase ${getBadgeColor(currentCard.cardType)}`}>
              {currentCard.cardType}
            </div>
          )}
        </div>

        {/* 主内容区 - 显示完整卡片图像（AI 已将文字和插图整合） */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white pb-28">
          {/* 左右切换 Channel */}
          <button 
            onClick={handlePrevChannel}
            className="absolute left-0 top-0 bottom-28 w-16 z-10 flex items-center justify-center hover:bg-black/5 active:bg-black/10"
          >
            <ChevronLeft size={32} strokeWidth={3} className="text-gray-400" />
          </button>
          <button 
            onClick={handleNextChannel}
            className="absolute right-0 top-0 bottom-28 w-16 z-10 flex items-center justify-center hover:bg-black/5 active:bg-black/10"
          >
            <ChevronRight size={32} strokeWidth={3} className="text-gray-400" />
          </button>

          {/* 完整卡片图像或视频（包含文字和插图） */}
          <div className="flex-1 flex flex-col items-center justify-start p-6 pr-2 overflow-y-scroll card-comments-scroll relative">
            <div className="flex-shrink-0 mb-4 w-full flex items-center justify-center">
              {currentCard?.imageUrl ? (
                currentCard.mediaType === 'video' ? (
                  <div className="relative w-full">
                    <video 
                      ref={videoRef}
                      src={currentCard.imageUrl} 
                      className="w-full max-h-[65vh] object-contain border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-auto"
                      controls
                      loop
                      playsInline
                      preload="auto"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onClick={(e) => e.stopPropagation()}
                      onError={(e) => {
                        console.error('❌ Video failed to load:', currentCard.imageUrl?.substring(0, 100));
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    {/* 播放按钮覆层 */}
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
                        <button
                          type="button"
                          className="w-20 h-20 bg-[#FFD700] border-4 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                          onClick={handlePlayVideo}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handlePlayVideo(e as any);
                          }}
                        >
                          <Play size={40} strokeWidth={3} fill="black" color="black" className="ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                <img 
                  src={currentCard.imageUrl} 
                  alt={currentCard.text}
                  className="w-full max-h-[65vh] object-contain border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  onError={(e) => {
                    console.error('❌ Image failed to load:', currentCard.imageUrl?.substring(0, 100));
                    // 如果图片加载失败，显示文字作为后备
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                  onLoad={() => {
                    console.log('✅ Card image loaded successfully (includes text + illustration)');
                  }}
                />
                )
              ) : null}
              
              {/* 后备文字显示（仅当图片加载失败时显示） */}
              <div className="text-center max-w-md" style={{ display: currentCard?.imageUrl ? 'none' : 'block' }}>
                <p className="text-2xl font-black uppercase leading-tight mb-4">
                  {currentCard?.text}
                </p>
                {currentCard?.subtext && (
                  <p className="text-base font-bold text-gray-600">
                    {currentCard.subtext}
                  </p>
                )}
                <div className="mt-4 text-sm text-gray-400">
                  (Image not available)
                </div>
              </div>
            </div>

            {/* 滚动提示 - 更明显的版本 */}
            {currentCard?.comments && currentCard.comments.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-4 animate-bounce">
                <div className="bg-[#FFD700] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-black text-sm uppercase text-black tracking-wide">
                    👇 {currentCard.comments.length} Persona Comment{currentCard.comments.length > 1 ? 's' : ''} Below 👇
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronDown size={24} strokeWidth={4} className="text-black" />
                  <span className="font-bold text-xs uppercase text-gray-600 tracking-wide">Scroll Down</span>
                  <ChevronDown size={24} strokeWidth={4} className="text-black" />
                </div>
              </div>
            )}

            {/* Persona 评论区域 */}
            {currentCard?.comments && currentCard.comments.length > 0 && (
              <div className="w-full px-4 pb-32 bg-white">
                <div className="flex items-center gap-2 mb-3 pt-3">
                  <div className="w-2 h-2 bg-black" />
                  <span className="font-bold text-xs uppercase text-gray-600">PERSONA COMMENTS ({currentCard.comments.length})</span>
                  <div className="flex-1 border-b-2 border-black" />
                </div>
                <div className="space-y-3">
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
              </div>
            )}
          </div>

          {/* 卡片指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {currentChannel?.cards.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 border-2 border-black ${idx === currentCardIndex ? 'bg-black' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* 移动端滚动指示器 */}
        {currentCard?.comments && currentCard.comments.length > 0 && (
          <div className="mobile-scroll-indicator md:hidden" />
        )}

        {/* 操作按钮：右下角浮动，在所有内容之上 */}
        <div className="absolute bottom-20 right-4 z-[150] flex flex-col gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`w-14 h-14 border-4 border-black flex flex-col items-center justify-center transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
              isLiked ? 'bg-[#FF0000] text-white' : 'bg-[#FFD700] hover:bg-yellow-400 text-black'
            }`}
          >
            <Heart size={20} strokeWidth={2.5} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-black leading-none">{currentCard?.likesCount || 0}</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowFlipModal(true);
            }}
            className="w-14 h-14 bg-[#FF0000] hover:bg-red-600 border-4 border-black flex flex-col items-center justify-center transition-colors text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <RefreshCw size={20} strokeWidth={2.5} />
            <span className="text-[8px] font-black leading-none mt-0.5">FLIP</span>
          </button>
        </div>

        {/* 触摸/点击区域（移动端滑动 + 桌面端点击） */}
        <div 
          className="absolute top-[80px] bottom-[96px] left-16 right-16 z-20 cursor-pointer"
          onTouchStart={(e) => {
            const startX = e.touches[0].clientX;
            const startY = e.touches[0].clientY;
            let moved = false;
            
            const handleTouchMove = (e: TouchEvent) => {
              if (moved) return;
              
              const deltaX = e.touches[0].clientX - startX;
              const deltaY = e.touches[0].clientY - startY;
              
              // 判断是水平还是垂直滑动
              const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
              const threshold = 50; // 滑动阈值
              
              if (isHorizontal && Math.abs(deltaX) > threshold) {
                // 左右滑动：切换 Channel
                moved = true;
                if (deltaX > 0) {
                  handlePrevChannel(); // 向右滑动，看上一个 channel
                } else {
                  handleNextChannel(); // 向左滑动，看下一个 channel
                }
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              } else if (!isHorizontal && Math.abs(deltaY) > threshold) {
                // 上下滑动：切换卡片
                moved = true;
                if (deltaY > 0) {
                  handlePrevCard(); // 向下滑动，看上一张卡
                } else {
                  handleNextCard(); // 向上滑动，看下一张卡
                }
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              }
            };
            
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
          onClick={(e) => {
            // 桌面端点击：点击上半部分看上一张，下半部分看下一张
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const halfHeight = rect.height / 2;
            
            if (y < halfHeight) {
              handlePrevCard(); // 上半部分：上一张
            } else {
              handleNextCard(); // 下半部分：下一张
            }
          }}
        />

        {/* Worldchat - 仅在公共 Channel 时显示 */}
        {currentChannel?.dropToFeed && (
          <Worldchat 
            channelId={currentChannel.id} 
            channelName={currentChannel.name}
          />
        )}
      </div>

      {/* 生成推荐卡片加载提示 */}
      {isGeneratingRecommendation && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#FFD700] border-4 border-black px-6 py-3 shadow-brutal animate-pulse">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <span className="font-black text-sm uppercase">Generating Recommendation...</span>
            </div>
          </div>
        </div>
      )}

      {currentCard && currentChannel && (
        <FlipModal
          isOpen={showFlipModal}
          onClose={() => setShowFlipModal(false)}
          originalCard={currentCard}
          currentChannel={currentChannel}
          myChannels={channels}
          onApply={handleApplyFlip}
        />
      )}
    </Layout>
  );
};
