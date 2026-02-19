import React from 'react';

export const ImpactLevelIcon: React.FC<React.SVGProps<SVGSVGElement> & { level: 'HIGH' | 'MEDIUM' | 'LOW' }> = ({ level, ...props }) => {
    return (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
            <rect width="4" height="6" x="1" y="10" rx="1" />
            <rect width="4" height="9" x="6" y="7" rx="1" opacity={level === 'MEDIUM' || level === 'HIGH' ? 1 : 0.3} />
            <rect width="4" height="12" x="11" y="4" rx="1" opacity={level === 'HIGH' ? 1 : 0.3} />
        </svg>
    );
};