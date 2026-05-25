import React from 'react';

export const Avatar = ({ name, initials, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl'
  };

  const getInitials = () => {
    if (initials) return initials;
    if (!name) return '?';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`inline-flex items-center justify-center font-display font-bold rounded-full bg-accent-amber text-bg-primary shadow-glow-amber select-none ${sizeClasses[size]} ${className}`}>
      {getInitials()}
    </div>
  );
};

export default Avatar;
