import React from 'react';
import { type Sentiment } from '../../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';

interface SentimentStatusIconProps {
  sentiment: Sentiment;
  showText?: boolean;
}

export const SentimentStatusIcon: React.FC<SentimentStatusIconProps> = ({ sentiment, showText = false }) => {
  const sentimentMap: Record<Sentiment, { text: string; icon: React.ReactNode; color: string; title: string }> = {
    POSITIVE: { text: 'Pozitív', icon: <ThumbsUpIcon className="w-6 h-6" />, color: 'text-teal-400', title: 'Általános hangulat: Pozitív' },
    NEGATIVE: { text: 'Negatív', icon: <ThumbsDownIcon className="w-6 h-6" />, color: 'text-red-400', title: 'Általános hangulat: Negatív' },
    NEUTRAL: { text: 'Semleges', icon: <MinusCircleIcon className="w-6 h-6" />, color: 'text-slate-400', title: 'Általános hangulat: Semleges' },
  };

  const details = sentimentMap[sentiment];
  if (!details) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${details.color}`} title={details.title}>
      {details.icon}
      {showText && <span className="hidden md:inline">{details.text}</span>}
    </div>
  );
};