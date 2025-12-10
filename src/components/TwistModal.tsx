import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Button, Input, Loading } from '@/components';
import { BookCard, CardType, Channel } from '@/types';
import { generateTwistCardTextsFromSource } from '@/services/textGeneration';

interface TwistModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCard: BookCard;
  currentChannel: Channel;
  myChannels: Channel[];
  isCurrentChannelOwnedByUser: boolean;
  onApply: (
    twistCard: BookCard,
    targetType: 'existing' | 'new',
    targetChannelId?: string
  ) => Promise<void>;
}

export const TwistModal: React.FC<TwistModalProps> = ({
  isOpen,
  onClose,
  originalCard,
  currentChannel,
  myChannels,
  isCurrentChannelOwnedByUser,
  onApply,
}) => {
  const [twistPrompt, setTwistPrompt] = useState('');
  const [previewCard, setPreviewCard] = useState<BookCard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetType, setTargetType] = useState<'existing' | 'new'>(
    isCurrentChannelOwnedByUser ? 'existing' : 'new'
  );
  const [targetChannelId, setTargetChannelId] = useState<string>(
    isCurrentChannelOwnedByUser ? currentChannel.id : ''
  );

  // 生成预览卡
  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const twistTexts = await generateTwistCardTextsFromSource(originalCard.text, {
        prompt: twistPrompt || `Generate a contrasting or opposing viewpoint to: "${originalCard.text}"`,
        count: 1,
      });

      const cardTypes: CardType[] = ['Quote', 'Concept', 'Insight'];
      const newCard: BookCard = {
        ...originalCard,
        id: `preview-${Date.now()}`,
        text: twistTexts[0],
        cardType: cardTypes[Math.floor(Math.random() * 3)],
        subtext: twistPrompt ? `Twist with: ${twistPrompt}` : 'Opposing perspective',
        sourceCardId: originalCard.id,
        createdAt: new Date().toISOString(),
        likesCount: 0,
      };

      setPreviewCard(newCard);
    } catch (error) {
      console.error('Failed to generate twist:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 初始生成
  useEffect(() => {
    if (isOpen && !previewCard) {
      generatePreview();
    }
  }, [isOpen]);

  const handleApply = async () => {
    if (!previewCard) return;
    
    setIsGenerating(true);
    try {
      await onApply(previewCard, targetType, targetChannelId);
      onClose();
    } catch (error) {
      console.error('Failed to apply twist:', error);
      alert('Failed to apply twist');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[90%] bg-white border-t-4 border-black animate-slide-in flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 bg-[#FF0000] border-b-4 border-black flex items-center justify-between px-6 shrink-0 text-white">
          <div className="flex items-center gap-3">
            <RefreshCw size={24} strokeWidth={3} />
            <h3 className="text-2xl font-black uppercase tracking-tight">TWIST</h3>
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

          {/* Twist Preview Card */}
          {isGenerating ? (
            <div className="flex flex-col items-center py-8">
              <Loading text="GENERATING TWIST..." />
            </div>
          ) : previewCard ? (
            <div className="border-4 border-black shadow-brutal-lg bg-white">
              <div className="p-4 bg-[#FFD700] border-b-4 border-black">
                <span className="font-black text-sm uppercase">TWIST PREVIEW</span>
              </div>
              <div className="p-4">
                <p className="text-xl font-black uppercase leading-tight mb-2">
                  {previewCard.text}
                </p>
                {previewCard.subtext && (
                  <p className="text-sm font-bold text-gray-600">{previewCard.subtext}</p>
                )}
              </div>
            </div>
          ) : null}

          {/* Custom Prompt */}
          <div>
            <Input
              label="CUSTOM TWIST PROMPT (OPTIONAL)"
              value={twistPrompt}
              onChange={(e) => setTwistPrompt(e.target.value)}
              placeholder='e.g., "From a feminist perspective" or "Using existentialism"'
              fullWidth
            />
            <div className="mt-2">
              <Button variant="secondary" onClick={generatePreview} disabled={isGenerating} fullWidth>
                <RefreshCw size={20} strokeWidth={3} className="mr-2" />
                REGENERATE PREVIEW
              </Button>
            </div>
          </div>

          {/* Target Selection */}
          <div className="space-y-4">
            <label className="text-lg font-bold uppercase bg-black text-white px-2 py-1 w-max block">
              TARGET DESTINATION
            </label>

            {/* Radio Options */}
            <div className="space-y-3">
              <button
                onClick={() => setTargetType('new')}
                className={`w-full p-4 border-4 border-black flex items-start gap-3 transition-all ${
                  targetType === 'new' ? 'bg-[#0000FF] text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 border-4 border-black flex items-center justify-center shrink-0 ${
                  targetType === 'new' ? 'bg-white' : 'bg-white'
                }`}>
                  {targetType === 'new' && <div className="w-3 h-3 bg-black" />}
                </div>
                <div className="text-left">
                  <div className="font-black uppercase text-sm">CREATE NEW CHANNEL</div>
                  <div className={`text-xs font-bold mt-1 ${targetType === 'new' ? 'text-white/80' : 'text-gray-600'}`}>
                    Start a new channel with this twist card + 5-7 more
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTargetType('existing')}
                className={`w-full p-4 border-4 border-black flex items-start gap-3 transition-all ${
                  targetType === 'existing' ? 'bg-[#0000FF] text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 border-4 border-black flex items-center justify-center shrink-0 ${
                  targetType === 'existing' ? 'bg-white' : 'bg-white'
                }`}>
                  {targetType === 'existing' && <div className="w-3 h-3 bg-black" />}
                </div>
                <div className="text-left">
                  <div className="font-black uppercase text-sm">ADD TO EXISTING CHANNEL</div>
                  <div className={`text-xs font-bold mt-1 ${targetType === 'existing' ? 'text-white/80' : 'text-gray-600'}`}>
                    Add 3 twist cards to one of your channels
                  </div>
                </div>
              </button>
            </div>

            {/* Channel Selector (if existing) */}
            {targetType === 'existing' && (
              <div className="mt-4">
                <select
                  value={targetChannelId}
                  onChange={(e) => setTargetChannelId(e.target.value)}
                  className="w-full h-12 border-4 border-black p-2 font-bold uppercase bg-white"
                >
                  <option value="">SELECT A CHANNEL...</option>
                  {myChannels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name} ({ch.cards.length} cards)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Apply Button */}
        <div className="p-6 border-t-4 border-black bg-gray-100 shrink-0">
          <Button
            variant="black"
            onClick={handleApply}
            disabled={isGenerating || !previewCard || (targetType === 'existing' && !targetChannelId)}
            fullWidth
            className="h-16 text-xl"
          >
            APPLY TWIST
          </Button>
        </div>
      </div>
    </div>
  );
};

