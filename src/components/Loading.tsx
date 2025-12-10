import React from 'react';

export const Loading: React.FC<{ text?: string }> = ({ text = 'LOADING' }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    <span className="font-black uppercase tracking-widest">{text}</span>
  </div>
);
