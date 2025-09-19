import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3v16C7 21 12 21 12 21s5 0 5-2V3" />
      <path d="M12 7v10" />
    </svg>
  );
};