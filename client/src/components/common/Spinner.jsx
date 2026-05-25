import React from 'react';

export const Spinner = ({ size = 'md', color = 'amber', fullscreen = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    amber: 'border-t-accent-amber border-r-transparent border-b-transparent border-l-transparent',
    white: 'border-t-text-primary border-r-transparent border-b-transparent border-l-transparent'
  };

  const spinnerMarkup = (
    <div
      className={`animate-spin rounded-full border-bg-tertiary ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      style={{ animationDuration: '0.6s' }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary bg-opacity-70 backdrop-blur-md">
        {spinnerMarkup}
      </div>
    );
  }

  return spinnerMarkup;
};

export default Spinner;
