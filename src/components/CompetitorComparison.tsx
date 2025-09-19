import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { type Competitor, PointCategory, type PricingTier, type CompetitorPoint } from '../../types';
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
import { Theme } from '../../App';

const categoryDisplayNames: Record<PointCategory, string> = {
    [PointCategory.PRICE]: 'Ár',
    [PointCategory.QUALITY]: 'Minőség',
    [PointCategory.MARKETING]: 'Marketing',
    [PointCategory.CUSTOMER_SERVICE]: 'Ügyfélszolgálat',
    [PointCategory.INNOVATION]: 'Innováció',
    [PointCategory.BRAND_REPUTATION]: 'Márka Hírnév',
    [PointCategory.OTHER]: 'Egyéb',
};

const getCompetitorStatusForCategory = (competitor: Competitor, category: PointCategory): 'strong' | 'weak' | 'mixed' | 'neutral' => {
  const hasStrength = (competitor.strengths || []).some(s => s.category === category);
  const hasWeakness = (competitor.weaknesses || []).some(w => w.category === category);

  if (hasStrength && !hasWeakness) return 'strong';
  if (!hasStrength && hasWeakness) return 'weak';
  if (hasStrength && hasWeakness) return 'mixed';
  return 'neutral';
};

interface CompetitorComparisonProps {
  competitors: Competitor[];
  theme: Theme;
}

const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ec4899']; // blue, amber, emerald, pink

const DetailedSentimentDisplay: React.FC<{ competitor: Competitor }> = ({ competitor }) => {
  const { strengths, weaknesses } = competitor;
  const positiveCount = strengths.length;
  const negativeCount = weaknesses.length;
  const totalCount = positiveCount + negativeCount;
  const difference = positiveCount - negativeCount;

  let details: { text: string; icon: React.ReactNode; color: string; };

  if (totalCount === 0) {
    details = { text: 'Nincs adat', icon: <MinusCircleIcon className="w-5 h-5 mx-auto" />, color: 'text-muted-foreground' };
  } else if (positiveCount > 0 && negativeCount === 0) {
    details = { text: 'Kizárólag Pozitív', icon: <ThumbsUpIcon className="w-5 h-5 mx-auto" />, color: 'text-emerald-500' };
  } else if (negativeCount > 0 && positiveCount === 0) {
    details = { text: 'Kizárólag Negatív', icon: <ThumbsDownIcon className="w-5 h-5 mx-auto" />, color: 'text-red-500' };
  } else if (difference > 0) { // More positive
    const text = (difference / totalCount) > 0.3 ? 'Túlnyomóan Pozitív' : 'Inkább Pozitív';
    details = { text: text, icon: <ThumbsUpIcon className="w-5 h-5 mx-auto" />, color: 'text-emerald-500' };
  } else if (difference < 0) { // More negative
     const text = (Math.abs(difference) / totalCount) > 0.3 ? 'Túlnyomóan Negatív' : 'Inkább Negatív';
    details = { text: text, icon: <ThumbsDownIcon className="w-5 h-5 mx-auto" />, color: 'text-red-500' };
  } else { // difference === 0
    details = { text: 'Kiegyensúlyozott', icon: <MinusCircleIcon className="w-5 h-5 mx-auto" />, color: 'text-muted-foreground' };
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${details.color}`}>
        {details.icon}
        <span className="font-semibold text-xs text-center whitespace-nowrap">{details.text}</span>
        <span className="text-xs text-muted-foreground">{`(+${positiveCount} / -${negativeCount})`}</span>
    </div>
  );
};

const PricingComparisonBar: React.FC<{ tier: PricingTier }> = ({ tier }) => {
    const tierConfig = {
        AFFORDABLE: { label: 'Kedvező', color: 'bg-emerald-500', position: 'w-1/3 left-0' },
        MID_RANGE: { label: 'Közép', color: 'bg-sky-500', position: 'w-1/3 left-1/3' },
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

const CategoryIcon: React.FC<{ category: PointCategory, className?: string }> = ({ category, className }) => {
  const iconProps = { className: className || "w-5 h-5 mr-3 flex-shrink-0 text-muted-foreground" };
  switch (category) {
    case PointCategory.PRICE: return <PriceTagIcon {...iconProps} />;
    case PointCategory.QUALITY: return <SparklesIcon {...iconProps} />;
    case PointCategory.MARKETING: return <MegaphoneIcon {...iconProps} />;
    case PointCategory.CUSTOMER_SERVICE: return <ChatBubbleIcon {...iconProps} />;
    case PointCategory.INNOVATION: return <LightbulbIcon {...iconProps} />;
    case PointCategory.BRAND_REPUTATION: return <ShieldCheckIcon {...iconProps} />;
    case PointCategory.OTHER: default: return <InfoIcon {...iconProps} />;
  }
};

const PointListItem: React.FC<{ point: CompetitorPoint }> = ({ point }) => (
    <li className="py-3 flex items-start gap-3">
        <CategoryIcon category={point.category} className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
        <div>
            <p className="text-foreground leading-snug">{point.text}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{categoryDisplayNames[point.category]}</p>
        </div>
    </li>
);

const CompetitorDetailCard: React.FC<{ competitor: Competitor; isExpanded: boolean; onToggle: () => void; }> = ({ competitor, isExpanded, onToggle }) => {
  return (
    <div className={`bg-background border rounded-xl transition-all duration-300 hover:shadow-md ${competitor.isMainCompetitor ? 'border-amber-500/30' : 'border-border'}`}>
      <button 
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left p-4"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
            <h5 className="text-lg font-bold text-foreground">{competitor.name}</h5>
            {competitor.isMainCompetitor && (
                 <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    <StarIcon className="w-3 h-3" />
                    Fő
                </span>
            )}
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0">
             <div className="border-t border-border pt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="flex items-center text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                        <ThumbsUpIcon className="w-5 h-5 mr-2" />
                        Erősségek
                      </h6>
                      <ul className="list-none space-y-0 pl-0 divide-y divide-border text-sm">
                        {competitor.strengths.length > 0 ? (
                          competitor.strengths.map((s, i) => <PointListItem key={`s-${i}`} point={s} />)
                        ) : (
                          <li className="text-muted-foreground italic py-3">Nincs azonosított erősség.</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h6 className="flex items-center text-base font-semibold text-red-600 dark:text-red-400 mb-3">
                        <ThumbsDownIcon className="w-5 h-5 mr-2" />
                        Gyengeségek
                      </h6>
                      <ul className="list-none space-y-0 pl-0 divide-y divide-border text-sm">
                        {competitor.weaknesses.length > 0 ? (
                          competitor.weaknesses.map((w, i) => <PointListItem key={`w-${i}`} point={w} />)
                        ) : (
                          <li className="text-muted-foreground italic py-3">Nincs azonosított gyengeség.</li>
                        )}
                      </ul>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ competitors, theme }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const categories = Object.values(PointCategory);

  const handleToggle = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };
  
  const chartData = categories.map(category => {
    const dataPoint: { [key: string]: string | number } = { subject: categoryDisplayNames[category as PointCategory] };
    competitors.forEach(competitor => {
      const status = getCompetitorStatusForCategory(competitor, category as PointCategory);
      dataPoint[competitor.name] = status === 'strong' ? 3 : status === 'mixed' ? 2 : status === 'weak' ? 0 : 1;
    });
    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg">
          <p className="font-bold mb-2 text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => {
            const statusText = entry.value === 3 ? "Erős" : entry.value === 2 ? "Vegyes" : entry.value === 0 ? "Gyenge" : "Semleges";
            return (<p key={`item-${index}`} style={{ color: entry.color }}>{`${entry.name}: `}<span className="font-semibold">{statusText}</span></p>);
          })}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-12">
      <div className="h-96 w-full">
        <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border))" : "#e2e8f0"} />
                <PolarAngleAxis dataKey="subject" stroke={theme === 'dark' ? "hsl(var(--muted-foreground))" : "#64748b"} tick={{ fontSize: 13, fill: theme === 'dark' ? 'hsl(var(--foreground))' : '#475569' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'hsl(var(--muted)/0.3)' : 'hsl(var(--muted)/0.3)' }} />
                {competitors.map((c, i) => (
                    <Radar key={c.name} name={c.name} dataKey={c.name} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.4} />
                ))}
                <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}/>
            </RadarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-lg font-bold text-foreground mb-4">Árazás és Hangulat</h4>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            {competitors.map((c) => (
                <div key={c.name} className="grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-2">
                    <div className="md:col-span-3 flex items-center gap-2">
                        <span className="font-semibold text-foreground truncate" title={c.name}>{c.name}</span>
                        {c.isMainCompetitor && <span title="Fő versenytárs"><StarIcon className="w-4 h-4 text-amber-500 flex-shrink-0" /></span>}
                    </div>
                    <div className="md:col-span-6"><PricingComparisonBar tier={c.pricingSummary} /></div>
                    <div className="md:col-span-3"><DetailedSentimentDisplay competitor={c} /></div>
                </div>
            ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold text-foreground mb-4">Részletes Pontok</h4>
        <div className="space-y-4">
            {competitors.map((competitor, index) => (
                <CompetitorDetailCard 
                    key={index} 
                    competitor={competitor} 
                    isExpanded={index === expandedIndex}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};