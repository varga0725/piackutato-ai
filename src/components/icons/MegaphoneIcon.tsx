import React from 'react';

export const MegaphoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18v12H3z" />
      <path d="M21 9v6" />
      <path d="M7 12h4" />
    </svg>
  );
};