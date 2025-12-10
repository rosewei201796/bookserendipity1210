import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Dice5 } from 'lucide-react';

// 按需求：Explore | My Channels | Serendipity
const navItems = [
  { id: 'explore', label: 'EXPLORE', icon: Home, path: '/explore' },
  { id: 'channels', label: 'MY CHANNELS', icon: User, path: '/channels' },
  { id: 'serendipity', label: 'SERENDIPITY', icon: Dice5, path: '/serendipity' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-20 bg-white border-t-4 border-black flex shrink-0 z-40 pb-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const IconComponent = item.icon;
        
        // Active: Black background, white text
        // Inactive: White background, black text
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-none border-r-4 border-black last:border-r-0
              ${isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}
            `}
          >
            <IconComponent size={28} strokeWidth={isActive ? 3 : 2} className="mb-[-2px]" />
            <span className="text-[9px] font-black tracking-wider uppercase">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
