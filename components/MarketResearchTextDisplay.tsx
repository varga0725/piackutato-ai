import React from 'react';
import { BullseyeIcon } from './icons/BullseyeIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

const parseAnalysisText = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  
  let listItems: { text: string; level: number }[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 pl-2">
          {listItems.map((item, index) => (
            <li 
              key={`li-${index}`} 
              className="text-slate-300"
              style={{ marginLeft: `${item.level * 20}px` }}
              dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>') }} 
            />
          ))}
        </ul>
      );
      listItems = [];
    }
  };


  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('### ')) {
      flushList();
      const title = trimmedLine.substring(4);
      let IconComponent = LightbulbIcon;
      let iconTitle = "Javaslatok";
      if (title.includes('Célpiac')) {
        IconComponent = BullseyeIcon;
        iconTitle = "Célpiac";
      }
      if (title.includes('Versenytárs')) {
        IconComponent = BarChartIcon;
        iconTitle = "Versenytársak";
      }
      if (title.includes('Trendek') || title.includes('Jövőkép')) {
        IconComponent = TrendingUpIcon;
        iconTitle = "Piaci Trendek és Jövőkép";
      }

      elements.push(
        <div key={`h3-wrapper-${index}`} className="flex items-center gap-3 mt-6 mb-4">
            <span title={iconTitle}>
              <IconComponent className="w-6 h-6 text-sky-400" />
            </span>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        </div>
      );
    } else if (trimmedLine.startsWith('- ')) {
      const indentation = line.search(/\S|$/);
      const level = Math.floor(indentation / 2); // 2 spaces per indent level
      listItems.push({ text: trimmedLine.substring(2), level: level });
    } else if (trimmedLine) {
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-slate-300 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>') }} />
      );
    }
  });

  flushList(); // Add any remaining list items
  return elements;
};

const BentoCard: React.FC<{children: React.ReactNode, className?: string, style?: React.CSSProperties}> = ({children, className, style}) => (
    <div className={`gradient-border bg-slate-800/70 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-xl ${className}`} style={style}>
        {children}
    </div>
);


interface MarketResearchTextDisplayProps {
  analysisText: string;
}

export const MarketResearchTextDisplay: React.FC<MarketResearchTextDisplayProps> = ({ analysisText }) => {
  return (
    <div className="w-full animate-fade-in">
      <BentoCard>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-6 pb-4 border-b border-slate-700">
            Szöveges Piackutatási Elemzés
        </h2>
        <div className="prose prose-invert max-w-none columns-1 md:columns-2 gap-x-8">
             {parseAnalysisText(analysisText)}
        </div>
      </BentoCard>
    </div>
  );
};