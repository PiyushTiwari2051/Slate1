import React from 'react';
import Spinner from './Spinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-amber disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';
  
  const variants = {
    primary: 'bg-accent-amber text-bg-primary hover:bg-opacity-95 shadow-glow-amber border border-transparent',
    secondary: 'bg-bg-tertiary text-text-primary hover:bg-opacity-80 border border-border-subtle',
    outline: 'bg-transparent text-text-primary border border-border-subtle hover:bg-bg-tertiary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-glass',
    danger: 'bg-accent-red text-text-primary hover:bg-opacity-95 shadow-md border border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <Spinner size="sm" color={variant === 'primary' ? 'amber' : 'white'} className="mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;
