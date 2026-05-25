import React, { useRef, useEffect } from 'react';

export const OTPInput = ({ value = '', onChange, length = 6, disabled = false }) => {
  const inputsRef = useRef([]);

  // Split value into character array, filled with empty strings up to length
  const codeArray = value.split('').concat(Array(length).fill('')).slice(0, length);

  const focusInput = (index) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index].focus();
      inputsRef.current[index].select();
    }
  };

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (!val) return;

    // Strip non-digits and take only the last character entered
    const digit = val.replace(/\D/g, '').slice(-1);
    if (!digit) return;

    const newCode = [...codeArray];
    newCode[index] = digit;
    const newCodeString = newCode.join('');
    onChange(newCodeString);

    // Auto-focus next box
    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newCode = [...codeArray];
      if (codeArray[index]) {
        // Clear current value
        newCode[index] = '';
        onChange(newCode.join(''));
      } else if (index > 0) {
        // Clear previous value and move focus back
        newCode[index - 1] = '';
        onChange(newCode.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < length - 1) {
        focusInput(index + 1);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return; // digits only

    const digits = pastedData.slice(0, length).split('');
    const newCode = Array(length).fill('');
    for (let i = 0; i < Math.min(length, digits.length); i++) {
      newCode[i] = digits[i];
    }
    onChange(newCode.join(''));

    // Focus last filled digit or maximum box
    const focusIndex = Math.min(digits.length, length - 1);
    focusInput(focusIndex);
  };

  useEffect(() => {
    // Focus first slot on loading
    focusInput(0);
  }, []);

  return (
    <div className="flex gap-2 justify-center w-full" onPaste={handlePaste}>
      {codeArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 bg-bg-tertiary border border-border-subtle focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow/40 text-center text-xl font-bold font-mono text-text-primary rounded-md outline-none transition-all duration-150"
        />
      ))}
    </div>
  );
};

export default OTPInput;
