import React from 'react';

export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 15-6-6-4 4-6-6" />
      <path d="M18 9v6h-6" />
    </svg>
  );
};