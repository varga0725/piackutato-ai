import React from 'react';

export const CalculatorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 10h8" />
      <path d="M8 14h4" />
      <path d="M8 18h4" />
      <path d="M14 14h4" />
      <path d="M14 18h4" />
    </svg>
  );
};