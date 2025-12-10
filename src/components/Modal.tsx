import React from 'react';

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[90%] bg-white border-t-4 border-black animate-slide-in flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
        {/* Modal Header */}
        <div className="h-16 bg-mondrian-yellow border-b-4 border-black flex items-center justify-between px-6 shrink-0">
          <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-transparent hover:bg-gray-800"
          >
            <span className="text-2xl font-bold leading-none">&times;</span>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
