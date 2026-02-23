import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-mono font-bold uppercase transition-all duration-200 flex items-center justify-center border relative overflow-hidden group";
  
  const variants = {
    primary: "bg-trash-yellow text-trash-black border-trash-yellow hover:bg-white hover:border-white hover:text-black",
    secondary: "bg-trash-surfaceHighlight text-white border-trash-border hover:border-trash-yellow hover:text-trash-yellow",
    danger: "bg-trash-red/10 text-trash-red border-trash-red hover:bg-trash-red hover:text-white",
    ghost: "bg-transparent text-trash-text hover:text-white hover:bg-trash-surfaceHighlight border-transparent",
    outline: "bg-transparent text-trash-yellow border-trash-yellow hover:bg-trash-yellow hover:text-black"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm tracking-wide",
    lg: "px-6 py-4 text-base"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};