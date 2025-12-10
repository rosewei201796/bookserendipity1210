import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal } from '@/components';
import { useChannels } from '@/state/ChannelContext';
import { useAuth } from '@/state/AuthContext';
import { Sparkles, LogOut, User as UserIcon, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SerendipityRecommendation } from '@/types';
import { getUserSerendipityRecommendations } from '@/utils/storage';

export const SerendipityView: React.FC = () => {
  const { allChannels } = useChannels();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SerendipityRecommendation[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 获取用户点赞的卡片
  const likedCards = allChannels
    .flatMap(ch => ch.cards)
    .filter(card => user?.likedCardIds.includes(card.id));

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // 加载推荐
  useEffect(() => {
    if (user) {
      const recs = getUserSerendipityRecommendations(user.id);
      setRecommendations(recs);
    }
  }, [user, likedCards.length]);

  return (
    <Layout>
      {/* Header - Red Theme with User Info */}
      <div className="h-16 border-b-4 border-black flex items-center justify-between px-4 bg-[#FF0000] shrink-0 text-white">
        <h2 className="text-4xl font-black uppercase tracking-tighter">SERENDIPITY</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-white text-black px-3 py-2 border-2 border-black hover:bg-gray-100 transition-colors"
          >
            <UserIcon size={16} strokeWidth={3} />
            <span className="text-xs font-black uppercase">{user?.username}</span>
            <LogOut size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-white">
        {likedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="border-4 border-black p-8 bg-gray-50 shadow-brutal">
              <Heart size={64} strokeWidth={2} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black uppercase mb-2">NO LIKED CARDS</h3>
              <p className="font-bold text-gray-600">Like some cards in Explore to get recommendations</p>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="border-4 border-black p-8 bg-gray-50 shadow-brutal">
              <Sparkles size={64} strokeWidth={2} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black uppercase mb-2">GENERATING...</h3>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recommendations Feed */}
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className="border-4 border-black shadow-brutal bg-white overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-[#FFD700] border-b-4 border-black flex items-center gap-2">
                  <Sparkles size={20} strokeWidth={3} />
                  <span className="font-black text-sm uppercase">RECOMMENDED FOR YOU</span>
                </div>

                {/* Content - 上下结构 */}
                <div className="flex flex-col">
                  {/* 上：Original Liked Card */}
                  <div className="p-6 border-b-4 border-black bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart size={16} strokeWidth={3} className="text-[#FF0000]" fill="#FF0000" />
                      <span className="font-bold text-xs uppercase text-gray-600">YOU LIKED</span>
                  </div>
                    
                  <h4 className="font-black text-lg uppercase leading-tight mb-1">
                      {rec.originalCard.bookTitle}
                  </h4>
                    {rec.originalCard.author && (
                      <p className="text-sm font-bold text-gray-600 mb-3">{rec.originalCard.author}</p>
                  )}
                    
                    <p className="text-sm font-medium text-gray-700 line-clamp-4">
                      "{rec.originalCard.text}"
                  </p>
                </div>

                  {/* 下：Recommended Card */}
                  <div className="p-6 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-[#0000FF]" />
                      <span className="font-bold text-xs uppercase text-gray-600">RECOMMENDATION</span>
                    </div>
                    
                    <h4 className="font-black text-lg uppercase leading-tight mb-1">
                      {rec.recommendedCard.bookTitle}
                    </h4>
                    {rec.recommendedCard.author && (
                      <p className="text-sm font-bold text-gray-600 mb-3">{rec.recommendedCard.author}</p>
                    )}
                    
                    {rec.recommendedCard.imageUrl && (
                      <img 
                        src={rec.recommendedCard.imageUrl}
                        alt={rec.recommendedCard.text}
                        className="w-full aspect-[3/4] object-cover border-2 border-black mb-3"
                      />
                    )}
                    
                    {/* Recommendation Reason */}
                    <div className="mt-4 p-3 bg-[#FFD700]/20 border-l-4 border-[#FFD700]">
                      <p className="text-xs font-bold uppercase text-gray-600 mb-1">Why recommended:</p>
                      <p className="text-sm font-medium text-gray-700">
                        {rec.reason.replace('📖 Recommended: ', '')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="LOGOUT"
      >
        <div className="space-y-6">
          <div className="border-4 border-black p-6 bg-gray-50">
            <p className="text-lg font-black uppercase mb-2">Are you sure?</p>
            <p className="text-sm font-bold text-gray-600">
              You will need to login again to access your channels and liked cards.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)} fullWidth>
              CANCEL
            </Button>
            <Button 
              variant="accent" 
              onClick={handleLogout} 
              fullWidth
              className="bg-[#FF0000] text-white border-4 border-black hover:bg-red-700"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
