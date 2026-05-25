import React from 'react';

export const Badge = ({ type, value, size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
    md: 'px-2.5 py-1 text-xs font-bold uppercase tracking-wider'
  };

  const getStyleClasses = () => {
    const val = String(value).toLowerCase();
    
    // Status style mapping
    if (type === 'status') {
      switch (val) {
        case 'pending':
          return 'bg-bg-tertiary text-text-secondary border border-border-subtle';
        case 'in-progress':
          return 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20';
        case 'completed':
          return 'bg-accent-green/10 text-accent-green border border-accent-green/20';
        default:
          return 'bg-bg-tertiary text-text-secondary border border-border-subtle';
      }
    }

    // Priority style mapping
    if (type === 'priority') {
      switch (val) {
        case 'low':
          return 'bg-accent-green/10 text-accent-green border border-accent-green/20';
        case 'medium':
          return 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20';
        case 'high':
          return 'bg-accent-red/10 text-accent-red border border-accent-red/20';
        default:
          return 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20';
      }
    }

    return 'bg-bg-tertiary text-text-secondary border border-border-subtle';
  };

  return (
    <span className={`inline-flex items-center rounded-full font-mono select-none ${sizeClasses[size]} ${getStyleClasses()} ${className}`}>
      {value}
    </span>
  );
};

export default Badge;
