import React from 'react';

export const BanknotesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h.01M18 12h.01" />
      <path d="M6 16h.01M18 16h.01" />
    </svg>
  );
};