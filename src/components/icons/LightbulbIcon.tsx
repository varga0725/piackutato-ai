import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.5 4.5 0 0 0 16.5 6c0-2.5-2-4.5-4.5-4.5S7.5 3.5 7.5 6c0 1.54.59 3.06 1.91 4.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
};