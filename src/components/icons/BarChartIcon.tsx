import React from 'react';

export const BarChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M7 16v-5" />
      <path d="M11 16v-9" />
      <path d="极15 16v-12" />
    </svg>
  );
};