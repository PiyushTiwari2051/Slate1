import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => {
        let icon = <Info className="w-5 h-5 text-accent-blue" />;
        let borderClass = 'border-l-4 border-l-accent-blue';
        
        if (t.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-accent-green" />;
          borderClass = 'border-l-4 border-l-accent-green';
        } else if (t.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-accent-red" />;
          borderClass = 'border-l-4 border-l-accent-red';
        } else if (t.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-accent-amber" />;
          borderClass = 'border-l-4 border-l-accent-amber';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-r-lg bg-bg-secondary border border-border-subtle ${borderClass} shadow-card animate-fade-in-up transition-all`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-sm font-medium text-text-primary pr-2 leading-relaxed">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors focus:outline-none p-0.5 rounded-md hover:bg-bg-tertiary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
