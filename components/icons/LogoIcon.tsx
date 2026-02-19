import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="new-logo-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3b82f6"/>
        <stop offset="100%" stopColor="#2563eb"/>
      </linearGradient>
    </defs>
    <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="url(#new-logo-gradient)" strokeWidth="2"/>
    <path d="M15 15L21 21" stroke="url(#new-logo-gradient)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.5 12V10" stroke="url(#new-logo-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 12V8" stroke="url(#new-logo-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12.5 12V10" stroke="url(#new-logo-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);