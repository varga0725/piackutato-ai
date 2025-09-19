import React, { useState } from 'react';
import type { SavedAnalysis } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MarketingStrategyDisplay } from './MarketingStrategyDisplay';
import { Theme } from '../App';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface AnalysisHistoryViewProps {
  analyses: SavedAnalysis[];
  onView: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}

const AnalysisHistoryCard: React.FC<{
  analysis: SavedAnalysis;
  onView: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}> = ({ analysis, onView, onDelete, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl transition-shadow hover:shadow-md">
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate" title={analysis.projectName}>{analysis.projectName}</h3>
          <p className="text-sm text-muted-foreground">
            Mentve: {new Date(analysis.savedAt).toLocaleString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onView(analysis)}
            title="Megtekintés és szerkesztés"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(analysis.id)}
            title="Törlés"
            className="p-2 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Bezárás" : "Részletek"}
            aria-expanded={isExpanded}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-border p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-2 flex items-center gap-2 text-sm uppercase tracking-wider"><BriefcaseIcon className="w-4 h-4" />Elemzés Összefoglaló</h4>
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap">{analysis.result.analysisText.split('###')[0].trim()}</p>
              </div>
            </div>
            {analysis.marketingStrategy && (
              <div>
                <h4 className="font-semibold text-muted-foreground mb-2 flex items-center gap-2 text-sm uppercase tracking-wider"><MegaphoneIcon className="w-4 h-4" />Mentett Marketing Stratégia</h4>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <MarketingStrategyDisplay strategy={analysis.marketingStrategy} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({ analyses, onView, onDelete, theme }) => {
  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-card border border-border text-center p-8 animate-fade-in-up">
        <div className="w-16 h-16 p-2 mb-6 bg-background rounded-2xl border border-border flex items-center justify-center">
            <BookmarkIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-card-foreground">Nincsenek mentett projektek</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
            Miután elvégez egy piackutatást, a "Projekt Mentése" gombbal elmentheti a munkáját, amely itt fog megjelenni.
        </p>
    </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up space-y-4">
      <div className="text-left mb-6">
          <h1 className="text-3xl font-bold text-foreground">Mentett Projektek</h1>
          <p className="text-muted-foreground mt-1">
              Itt találja a korábban elmentett piackutatási elemzéseit és a hozzájuk tartozó stratégiákat.
          </p>
      </div>
      {analyses.map(analysis => (
        <AnalysisHistoryCard 
          key={analysis.id} 
          analysis={analysis}
          onView={onView}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};