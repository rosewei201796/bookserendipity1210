import React from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'black' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ElementType;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  icon: Icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `relative flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-0 active:translate-y-1 active:shadow-none ${fullWidth ? 'w-full' : ''}`;
  
  const variants = {
    primary: 'bg-mondrian-yellow text-black border-2 border-black shadow-brutal hover:bg-yellow-300',
    secondary: 'bg-white text-black border-2 border-black shadow-brutal hover:bg-gray-50',
    accent: 'bg-mondrian-red text-white border-2 border-black shadow-brutal hover:bg-red-600',
    black: 'bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-gray-900',
    ghost: 'bg-transparent text-black border-2 border-transparent hover:border-black hover:bg-gray-100',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const paddingStyle = 'py-3 px-6';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${paddingStyle} ${className} ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader size={20} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={20} strokeWidth={2.5} className="mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};
