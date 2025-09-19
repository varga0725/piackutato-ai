import React from 'react';

export const SwotIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h18v18H3z" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M3 6h6" />
      <path d="M15 6h6" />
      <path d="M3 18h6" />
      <path d="M15 18h6" />
    </svg>
  );
};