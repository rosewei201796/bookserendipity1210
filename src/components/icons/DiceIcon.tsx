import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export const DiceIcon: React.FC<IconProps> = ({ className = '', isActive: _isActive = false }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="14" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="10.5" y="10.5" width="3" height="3" fill="currentColor"/>
      <rect x="7" y="14" width="3" height="3" fill="currentColor"/>
      <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
    </svg>
  );
};

