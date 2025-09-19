import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.813 9.813a2.5 2.5 0 1 0 0-3.536 2.5 2.5 0 0 0 0 3.536Z" />
      <path d="M14.187 14.187a2.5 2.5 0 1 0 0-3.536 2.5 2.5 0 0 0 0 3.536Z" />
      <path d="M9.813 14.187a2.5 2.5 0 1 0 0-3.536 2.5 2.5 0 0 0 0 3.536Z" />
      <path d="M14.187 9.813a2.5 2.5 0 1 0 0-3.536 2.5 2.5 0 0 0 0 3.536Z" />
    </svg>
  );
};