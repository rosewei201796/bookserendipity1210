import React, { useState, useRef } from 'react';
import { BookCard } from '@/types';
import { Heart, RefreshCw, Play } from 'lucide-react';

interface CardProps {
  card: BookCard;
  onClick?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  onDelete, 
  showActions = false 
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div 
      className="flex flex-col relative border-4 border-black bg-gray-100 cursor-pointer group"
      onClick={onClick}
    >
      {/* Media Frame */}
      <div className="relative p-4 border-b-4 border-black bg-white flex items-center justify-center overflow-hidden">
        {card.imageUrl ? (
          card.mediaType === 'video' ? (
            <div className="relative w-full aspect-square">
              <video 
                ref={videoRef}
                src={card.imageUrl} 
                className="w-full h-full object-cover border-4 border-black shadow-brutal-lg"
                controls
                loop
                playsInline
                preload="auto"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onClick={(e) => e.stopPropagation()}
              />
              {/* 播放按钮覆层 */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <button
                    type="button"
                    className="w-16 h-16 bg-[#FFD700] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
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
                    <Play size={32} strokeWidth={3} fill="black" color="black" className="ml-1" />
                  </button>
                </div>
              )}
            </div>
          ) : (
          <img 
            src={card.imageUrl} 
            className="w-full aspect-square object-cover border-4 border-black shadow-brutal-lg grayscale group-hover:grayscale-0 transition-all" 
            alt={card.bookTitle}
          />
          )
        ) : (
          <div className="w-full aspect-square bg-mondrian-gray border-4 border-black shadow-brutal-lg flex items-center justify-center">
            <span className="font-black text-4xl text-gray-300">IMG</span>
          </div>
        )}
        
        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-mondrian-yellow border-2 border-black z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-12 bg-mondrian-red border-2 border-black z-10" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-4 bg-white">
        {/* Title Block */}
        <div className="col-span-3 border-r-4 border-black p-3 flex flex-col justify-center">
          <div className="inline-block bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase mb-1 w-max truncate max-w-full">
            {card.author || 'UNKNOWN'}
          </div>
          <p className="text-sm font-black uppercase leading-tight line-clamp-2">
            {card.bookTitle}
          </p>
        </div>
        
        {/* Action Column */}
        <div className="col-span-1 flex flex-col h-full">
          {showActions && onDelete ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="flex-1 bg-mondrian-red hover:bg-red-700 flex items-center justify-center transition-colors border-black"
            >
              <span className="text-white font-black text-xs">DEL</span>
            </button>
          ) : (
            <>
              <div className="flex-1 bg-mondrian-yellow border-b-4 border-black flex items-center justify-center">
                <Heart size={16} strokeWidth={3} color="black" />
              </div>
              <div className="flex-1 bg-mondrian-blue flex items-center justify-center">
                <RefreshCw size={16} strokeWidth={3} color="white" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
