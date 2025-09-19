import React from 'react';

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2 22 20-10L2 2l2 10L2 22z" />
      <path d="M22 12 2 12" />
    </svg>
  );
};