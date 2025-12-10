import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthStyle} ${className}`}>
      {label && (
        <label className="inline-block bg-black text-white px-2 py-1 text-xs font-bold uppercase mb-2 w-max">
          {label}
        </label>
      )}
      <input
        className={`${widthStyle} h-12 border-4 border-black p-3 text-lg font-bold uppercase focus:outline-none focus:ring-4 focus:ring-mondrian-blue shadow-brutal-lg`}
        {...props}
      />
      {error && (
        <div className="mt-2 bg-mondrian-red text-white px-2 py-1 text-xs font-bold inline-block">
          {error}
        </div>
      )}
    </div>
  );
};
