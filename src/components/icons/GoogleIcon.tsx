import React from 'react';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.8 12.2c0-2.2-.8-4.2-2.2-5.8-1.4-1.6-3.2-2.8-5.4-3.2-2.2-.4-4.4-.1-6.3.9-1.9 1-3.4 2.6-4.3 4.5-.9 1.9-1.2 4-1 6.1.2 2.1 1.1 4.1 2.5 5.7 1.4 1.6 3.2 2.8 5.4 3.2 2.2.4 4.4.1 6.3-.9 1.9-1 3.4-2.6 4.3-4.5.9-1.9 1.2-4 1-6.1z" />
      <path d="M12 8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
    </svg>
  );
};