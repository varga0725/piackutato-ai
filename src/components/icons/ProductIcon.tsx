import React from 'react';

export const ProductIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l10 6v12H2V8l10-6z" />
      <path d="M12 22V8" />
      <path d="M2 8l10 6 10-6" />
    </svg>
  );
};