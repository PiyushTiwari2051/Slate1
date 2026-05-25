import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrength = ({ password }) => {
  const getCriteria = (pwd) => {
    return [
      { label: 'At least 8 characters', met: pwd.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(pwd) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(pwd) },
      { label: 'Contains number', met: /[0-9]/.test(pwd) },
      { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(pwd) }
    ];
  };

  const criteria = getCriteria(password || '');
  const metCount = criteria.filter((c) => c.met).length;

  const getStrengthLabelAndColor = (count) => {
    if (!password) return { label: '', color: 'bg-transparent', text: 'text-text-muted', width: 'w-0' };
    if (count <= 2) return { label: 'Weak', color: 'bg-accent-red', text: 'text-accent-red', width: 'w-1/4' };
    if (count === 3) return { label: 'Fair', color: 'bg-accent-amber/70', text: 'text-accent-amber/70', width: 'w-2/4' };
    if (count === 4) return { label: 'Good', color: 'bg-accent-amber', text: 'text-accent-amber', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-accent-green', text: 'text-accent-green', width: 'w-full' };
  };

  const strength = getStrengthLabelAndColor(metCount);

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2 mt-2 w-full animate-fade-in-up select-none">
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-muted font-medium font-mono uppercase tracking-wider">Strength:</span>
        <span className={`font-bold uppercase tracking-wider ${strength.text}`}>{strength.label}</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
      </div>
      
      {/* Criteria Check list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1 text-[11px]">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {c.met ? (
              <Check className="w-3.5 h-3.5 text-accent-green flex-shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            )}
            <span className={c.met ? 'text-text-primary' : 'text-text-muted'}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
