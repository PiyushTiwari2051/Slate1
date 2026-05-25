import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, className = '', ...props }) => {
  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-lg bg-bg-secondary border border-border-subtle rounded-lg p-6 shadow-card animate-fade-in-up ${className}`}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
          {title && (
            <h3 className="text-lg font-bold text-text-primary">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none p-1 rounded-md hover:bg-bg-tertiary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
