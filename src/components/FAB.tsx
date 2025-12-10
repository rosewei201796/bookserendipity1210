import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[68px] left-1/2 -translate-x-1/2 z-50 w-16 h-16 bg-[#FFD700] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center"
    >
      <Plus size={32} strokeWidth={3} color="black" />
    </button>
  );
};

