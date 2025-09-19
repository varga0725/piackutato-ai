import React from 'react';

export const IdentificationIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M8 12h8" />
      <path d="M8 16h8" />
      <path d="M8 8h.01" />
      <path d="M12 8h.01" />
      <path d="M16 8h.01" />
    </svg>
  );
};