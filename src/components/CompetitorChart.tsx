import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { type Competitor, PointCategory, type PricingTier, type CompetitorPoint } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { WarningIcon } from './icons/WarningIcon';
import { PriceTagIcon } from './icons/PriceTagIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { StarIcon } from './icons/StarIcon';
import { Theme } from '../App';

// ... existing code ...

const PricingTierTag: React.FC<{ tier: PricingTier }> = ({ tier }) => {
    const tierConfig = {
        AFFORDABLE: { label: 'Kedvező', color: 'bg-emerald-500', position: 'w-1/3 left-0' },
        MID_RANGE: { label: 'Közép', color: 'bg-sky-500', position: 'w-1/3 left-1/3' }, // Corrected to 'MID_RANGE'
        PREMIUM: { label: 'Prémium', color: 'bg-amber-500', position: 'w-1/3 left-2/3' },
        NOT_AVAILABLE: { label: 'N/A', color: 'bg-muted', position: '' },
    };

    if (tier === 'NOT_AVAILABLE') {
        return (
             <div className="flex items-center justify-center h-8 bg-muted/50 rounded-md text-muted-foreground text-sm font-semibold">
                Nincs adat
             </div>
        );
    }
    
    const { label, color, position } = tierConfig[tier];

    return (
        <div className="relative w-full h-8 bg-muted/20 rounded-md overflow-hidden">
            <div className={`absolute h-full transition-all duration-500 ease-out ${position} ${color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold tracking-wide">{label}</span>
            </div>
        </div>
    );
};

// ... rest of the file ...