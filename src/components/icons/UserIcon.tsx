import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export const UserIcon: React.FC<IconProps> = ({ className = '', isActive: _isActive = false }) => {
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
        x="8"
        y="4"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M5 20V16H19V20"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
};

