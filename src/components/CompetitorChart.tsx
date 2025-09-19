// ... existing code ...

const PricingTierTag: React.FC<{ tier: PricingTier }> = ({ tier }) => {
    const tierConfig = {
        AFFORDABLE: { label: 'Kedvező', color: 'bg-emerald-500', position: 'w-1/3 left-0' },
        MID_RANGE极: { text: 'Közép', className: 'bg-sky-500/10 text-sky-300 border-sky-500/20', icon: <PriceTagIcon className="w-4 h-4" /> }, // Fixed to match enum value
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