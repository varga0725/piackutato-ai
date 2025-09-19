import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PointCategory, type Competitor, type CompetitorPoint, type Sentiment, PricingTier } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { PriceTagIcon } from './icons/PriceTagIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { InfoIcon } from './icons/InfoIcon';
import { WarningIcon } from './icons/WarningIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';

interface CompetitorChartProps {
  competitor: Competitor;
}

const CategoryIcon: React.FC<{ category: PointCategory, className?: string }> = ({ category, className }) => {
  const iconProps = { className: className || "w-5 h-5 mr-3 flex-shrink-0 text-slate-400" };
  switch (category) {
    case 'PRICE':
      return <PriceTagIcon {...iconProps} />;
    case 'QUALITY':
      return <SparklesIcon {...iconProps} />;
    case 'MARKETING':
      return <MegaphoneIcon {...iconProps} />;
    case 'CUSTOMER_SERVICE':
      return <ChatBubbleIcon {...iconProps} />;
    case 'INNOVATION':
      return <LightbulbIcon {...iconProps} />;
    case 'BRAND_REPUTATION':
      return <ShieldCheckIcon {...iconProps} />;
    case 'OTHER':
    default:
      return <InfoIcon {...iconProps} />;
  }
};

const categoryDisplayNames: Record<PointCategory, string> = {
    [PointCategory.PRICE]: 'Ár',
    [PointCategory.QUALITY]: 'Minőség',
    [PointCategory.MARKETING]: 'Marketing',
    [PointCategory.CUSTOMER_SERVICE]: 'Ügyfélszolgálat',
    [PointCategory.INNOVATION]: 'Innováció',
    [PointCategory.BRAND_REPUTATION]: 'Márka Hírnév',
    [PointCategory.OTHER]: 'Egyéb',
};

const PointListItem: React.FC<{ point: CompetitorPoint }> = ({ point }) => (
    <li className="py-3 flex items-start gap-3">
        <CategoryIcon category={point.category} className="w-5 h-5 mt-0.5 flex-shrink-0 text-sky-400" />
        <div>
            <p className="font-medium text-slate-200 leading-snug">{point.text}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">{categoryDisplayNames[point.category]}</p>
        </div>
    </li>
);

const SentimentIconDisplay: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    switch (sentiment) {
        case 'POSITIVE':
            return (
                <span className="cursor-help" title="Általános hangulat: Pozitív">
                    <ThumbsUpIcon className="w-5 h-5 text-teal-400" />
                </span>
            );
        case 'NEGATIVE':
            return (
                <span className="cursor-help" title="Általános hangulat: Negatív">
                    <ThumbsDownIcon className="w-5 h-5 text-red-400" />
                </span>
            );
        case 'NEUTRAL':
            return (
                <span className="cursor-help" title="Általános hangulat: Semleges">
                    <MinusCircleIcon className="w-5 h-5 text-slate-400" />
                </span>
            );
        default:
            return null;
    }
};

const PricingTierTag: React.FC<{ tier: PricingTier }> = ({ tier }) => {
    if (tier === 'NOT_AVAILABLE') {
        return null;
    }

    const tierDetails: Record<Exclude<PricingTier, 'NOT_AVAILABLE'>, { text: string; className: string; icon: React.ReactNode }> = {
        AFFORDABLE: { text: 'Kedvező', className: 'bg-teal-500/10 text-teal-300 border-teal-500/20', icon: <PriceTagIcon className="w-4 h-4" /> },
        MID_RANGE: { text: 'Közép', className: 'bg-sky-500/10 text-sky-300 border-sky-500/20', icon: <PriceTagIcon className="w-4 h-4" /> },
        PREMIUM: { text: 'Prémium', className: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: <PriceTagIcon className="w-4 h-4" /> },
    };
    
    const { text, className, icon } = tierDetails[tier];

    return (
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${className}`} title={`Árazás: ${text}`}>
            {icon}
            {text}
        </span>
    );
};


export const CompetitorChart: React.FC<CompetitorChartProps> = ({ competitor }) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  
  const strengthsCount = competitor.strengths.length;
  const weaknessesCount = competitor.weaknesses.length;

  // A competitor is considered vulnerable if they have at least 2 more weaknesses than strengths.
  const isVulnerable = weaknessesCount > strengthsCount && (weaknessesCount - strengthsCount >= 2);

  const data = [
    { name: 'Erősségek', count: strengthsCount, color: '#2dd4bf' }, // teal-400
    { name: 'Gyengeségek', count: weaknessesCount, color: '#f87171' }, // red-400
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-600 rounded-lg shadow-lg">
          <p className="label text-slate-200 font-bold">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-4">
        <h4 className="text-xl font-bold text-sky-400">{competitor.name}</h4>
        <div className="flex items-center gap-3">
          <PricingTierTag tier={competitor.pricingSummary} />
          <SentimentIconDisplay sentiment={competitor.sentiment} />
          {isVulnerable && (
            <span className="cursor-help" title="Ennél a versenytársnál jelentősen több a gyengeség, mint az erősség.">
              <WarningIcon className="w-5 h-5 text-amber-400" />
            </span>
          )}
        </div>
      </div>
      
      <div className="h-48 w-full mb-4" onMouseLeave={() => setHoveredBar(null)}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={14} />
            <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }} />
            <Bar dataKey="count" onMouseEnter={(data) => setHoveredBar(data.name)}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className={`p-3 rounded-lg transition-all duration-300 ${hoveredBar === 'Erősségek' ? 'bg-slate-800/70' : ''}`}>
          <h5 className="flex items-center text-lg font-semibold text-teal-400 mb-3">
            <span title="Erősségek"><ThumbsUpIcon className="w-5 h-5 mr-2" /></span>
            Erősségek
          </h5>
          <ul className="list-none space-y-0 pl-0 divide-y divide-slate-800">
            {competitor.strengths
                .slice()
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((strength, index) => (
              <PointListItem key={`strength-${index}`} point={strength} />
            ))}
          </ul>
        </div>
        <div className={`p-3 rounded-lg transition-all duration-300 ${hoveredBar === 'Gyengeségek' ? 'bg-slate-800/70' : ''}`}>
          <h5 className="flex items-center text-lg font-semibold text-red-400 mb-3">
            <span title="Gyengeségek"><ThumbsDownIcon className="w-5 h-5 mr-2" /></span>
            Gyengeségek
            </h5>
          <ul className="list-none space-y-0 pl-0 divide-y divide-slate-800">
            {competitor.weaknesses
                .slice()
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((weakness, index) => (
              <PointListItem key={`weakness-${index}`} point={weakness} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};