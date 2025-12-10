import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export const BookIcon: React.FC<IconProps> = ({ className = '', isActive: _isActive = false }) => {
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
        x="4"
        y="3"
        width="16"
        height="18"
        stroke="currentColor"
        strokeWidth="3"
      />
      <line
        x1="8"
        y1="8"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="8"
        y1="16"
        x2="13"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

