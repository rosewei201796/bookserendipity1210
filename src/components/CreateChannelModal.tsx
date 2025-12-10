import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input, Loading } from '@/components';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookTitle: string, author: string, dropToFeed: boolean) => Promise<void>;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [dropToFeed, setDropToFeed] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!bookTitle.trim()) return;
    
    setIsGenerating(true);
    try {
      await onSubmit(bookTitle, author, dropToFeed);
      // Reset form
      setBookTitle('');
      setAuthor('');
      setDropToFeed(true);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to create channel');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[85%] bg-white border-t-4 border-black animate-slide-in flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 bg-[#FFD700] border-b-4 border-black flex items-center justify-between px-6 shrink-0">
          <h3 className="text-2xl font-black uppercase tracking-tight">Worlds in Quotes</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-transparent hover:bg-gray-800"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loading text="MAGIC IS HAPPENING" />
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                label="BOOK TITLE *"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="ENTER BOOK TITLE..."
                fullWidth
              />
              
              <Input
                label="AUTHOR (OPTIONAL)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="ENTER AUTHOR NAME..."
                fullWidth
              />

              {/* Drop to Feed Toggle */}
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase bg-black text-white px-2 py-1 w-max">Drop to Feed</label>
                <div className="flex items-center gap-4 p-4 border-4 border-black bg-gray-50">
                  <button
                    onClick={() => setDropToFeed(!dropToFeed)}
                    className={`w-16 h-8 border-4 border-black relative transition-all ${dropToFeed ? 'bg-[#0000FF]' : 'bg-white'}`}
                  >
                    <div className={`absolute top-0 w-6 h-6 bg-black border-2 border-white transition-all ${dropToFeed ? 'right-0' : 'left-0'}`} />
                  </button>
                  <div>
                    <p className="font-bold text-sm uppercase">
                      {dropToFeed ? 'ON - Public in Explore' : 'OFF - Private Only'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {dropToFeed 
                        ? 'This channel will appear in the Explore feed for everyone' 
                        : 'Only visible in your My Channels section'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!bookTitle.trim()}
                  className="w-full h-16 text-xl font-black uppercase bg-black text-white border-4 border-black shadow-brutal transition-all hover:bg-gradient-to-r hover:from-[#FF0000] hover:via-[#FFD700] hover:to-[#0000FF] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  CREATE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

