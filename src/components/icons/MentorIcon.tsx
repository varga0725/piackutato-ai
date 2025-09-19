import React from 'react';

export const MentorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 8c0-2.8-2.2-5-5-5S7 5.2 7 8" />
      <path d="M12 11v5" />
      <path d="M8 16h8" />
      <path d="M12 19v2" />
      <path d="M15 22H9" />
    </svg>
  );
};