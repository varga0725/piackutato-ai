import React from 'react';

export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4a4 4 0 1 1 4 4H3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3a16 16 0 0 0 -12.8 10.2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3a16 16 0 0 1 -10.2 12.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 9a9 9 0 0 1 4.4 4.4" />
    </svg>
);