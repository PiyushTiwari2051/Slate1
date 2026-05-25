import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  placeholder,
  icon: Icon,
  error,
  helperText,
  type = 'text',
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className} ${error ? 'animate-shake' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-text-muted select-none pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-bg-tertiary border text-text-primary text-sm rounded-md transition-all duration-200 placeholder:text-text-muted outline-none
            ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3
            ${error 
              ? 'border-accent-red focus:border-accent-red focus:ring-1 focus:ring-accent-red' 
              : 'border-border-subtle focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow shadow-sm'
            }
            disabled:opacity-50 disabled:pointer-events-none`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-accent-red animate-fade-in-up font-medium mt-0.5">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-text-muted font-medium mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
