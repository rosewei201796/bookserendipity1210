import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components';
import { BookCard, Channel, SerendipityItem } from '@/types';
import { generateSerendipityItem } from '@/services/serendipity';

interface FlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCard: BookCard;
  currentChannel?: Channel;
  onApply: (
    personaCommentary: string,
    personaName: string,
    personaEmoji: string
  ) => Promise<void>;
}

export const FlipModal: React.FC<FlipModalProps> = ({
  isOpen,
  onClose,
  originalCard,
  onApply,
}) => {
  const [serendipityItem, setSerendipityItem] = useState<SerendipityItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成 Persona 评论
  const generatePersonaComment = async () => {
    setIsGenerating(true);
    try {
      const item = await generateSerendipityItem(originalCard);
      setSerendipityItem(item);
    } catch (error) {
      console.error('Failed to generate persona comment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 初始生成
  useEffect(() => {
    if (isOpen && !serendipityItem) {
      generatePersonaComment();
    }
  }, [isOpen]);

  const handleApply = async () => {
    if (!serendipityItem) return;
    
    setIsGenerating(true);
    try {
      await onApply(
        serendipityItem.commentary,
        serendipityItem.persona.name,
        serendipityItem.persona.emoji
      );
      onClose();
    } catch (error) {
      console.error('Failed to apply flip:', error);
      alert('Failed to apply flip');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[90%] bg-white border-t-4 border-black animate-slide-in flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 bg-[#FF0000] border-b-4 border-black flex items-center justify-between px-6 shrink-0 text-white">
          <div className="flex items-center gap-3">
            <RefreshCw size={24} strokeWidth={3} />
            <h3 className="text-2xl font-black uppercase tracking-tight">FLIP - ADD COMMENT</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-transparent hover:bg-gray-800"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Original Card Info */}
          <div className="border-4 border-black p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-black" />
              <span className="font-bold text-xs uppercase text-gray-600">ORIGINAL CARD</span>
            </div>
            <h4 className="font-black text-lg uppercase mb-1">{originalCard.bookTitle}</h4>
            {originalCard.author && (
              <p className="text-sm font-bold text-gray-600 mb-2">{originalCard.author}</p>
            )}
            <p className="text-sm font-medium line-clamp-3">"{originalCard.text}"</p>
          </div>

          {/* Persona Commentary */}
          {isGenerating ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="font-black uppercase tracking-widest">GENERATING...</span>
            </div>
          ) : serendipityItem ? (
            <div className="border-4 border-black shadow-brutal-lg bg-white">
              <div className="p-4 bg-[#FFD700] border-b-4 border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-xl">
                    {serendipityItem.persona.emoji}
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase">{serendipityItem.persona.name}</div>
                    <div className="text-xs font-bold text-gray-700">{serendipityItem.persona.description}</div>
                  </div>
                </div>
                <button
                  onClick={generatePersonaComment}
                  disabled={isGenerating}
                  className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-gray-100 active:shadow-none transition-colors"
                  title="Regenerate commentary"
                >
                  <RefreshCw size={18} strokeWidth={2.5} />
                </button>
              </div>
              <div className="p-4">
                <div className="border-l-4 border-black pl-4">
                  <p className="font-bold text-base leading-relaxed">
                    {serendipityItem.commentary}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="h-20 border-t-4 border-black bg-gray-50 flex items-center justify-between px-6 shrink-0">
          <Button variant="secondary" onClick={onClose}>
            CANCEL
          </Button>
          <Button 
            variant="accent" 
            onClick={handleApply}
            disabled={!serendipityItem || isGenerating}
            loading={isGenerating}
          >
            ADD COMMENT
          </Button>
        </div>
      </div>
    </div>
  );
};

