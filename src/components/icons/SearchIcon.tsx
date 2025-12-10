import React from 'react';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export const SearchIcon: React.FC<IconProps> = ({ className = '', isActive: _isActive = false }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M15.5 15.5L20 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
    </svg>
  );
};

