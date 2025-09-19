import React, { useState, useMemo } from 'react';
import type { MarketEntryProcess } from '../../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';

interface MarketEntryProcessDisplayProps {
  process: MarketEntryProcess;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-muted/50 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
    </div>
);

export const MarketEntryProcessDisplay: React.FC<MarketEntryProcessDisplayProps> = ({ process }) => {
  const [completionState, setCompletionState] = useState<Record<number, boolean[]>>(() => {
    const initialState: Record<number, boolean[]> = {};
    process.phases.forEach((phase, phaseIndex) => {
      initialState[phaseIndex] = Array(phase.keyActions.length).fill(false);
    });
    return initialState;
  });

  const handleToggleTask = (phaseIndex: number, taskIndex: number) => {
    setCompletionState(prevState => {
      const newPhaseState = [...(prevState[phaseIndex] || [])];
      newPhaseState[taskIndex] = !newPhaseState[taskIndex];
      return { ...prevState, [phaseIndex]: newPhaseState };
    });
  };

  const { phaseProgresses, overallProgress } = useMemo(() => {
    let totalTasks = 0, completedTasks = 0;
    const progresses = process.phases.map((phase, phaseIndex) => {
      const tasksInPhase = completionState[phaseIndex] || [];
      const completedInPhase = tasksInPhase.filter(Boolean).length;
      totalTasks += tasksInPhase.length;
      completedTasks += completedInPhase;
      return tasksInPhase.length > 0 ? (completedInPhase / tasksInPhase.length) * 100 : 0;
    });
    const overall = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return { phaseProgresses: progresses, overallProgress: overall };
  }, [process.phases, completionState]);

  return (
    <div className="w-full space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-foreground">Teljes Folyamat Haladása</h3>
            <span className="font-mono text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar progress={overallProgress} />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <InfoIcon className="w-5 h-5 text-primary flex-shrink-0" />
            <h3 className="text-lg font-bold text-foreground">Stratégiai Összefoglaló</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">{process.strategicOverview}</p>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {process.phases.map((phase, index) => {
          const progress = phaseProgresses[index];
          const isCompleted = progress === 100;
          return (
            <div key={index} className="relative pl-12 pb-12">
              {! (index === process.phases.length - 1) && <div className="absolute left-[22px] top-5 h-full w-0.5 bg-border" aria-hidden="true"></div>}
              
              <div className="absolute left-0 top-0 flex items-center justify-center w-11 h-11 bg-background rounded-full border-2 border-border">
                 {isCompleted ? (
                    <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-full text-white shadow-md shadow-emerald-500/20"><CheckIcon className="w-5 h-5" /></div>
                 ) : (
                     <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-full text-primary-foreground font-bold text-lg">{index + 1}</div>
                 )}
              </div>
        
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary mb-1">{phase.phaseTitle}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{phase.description}</p>
                
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2"><h4 className="font-semibold text-foreground text-sm">Kulcsfontosságú Lépések:</h4><span className="text-sm font-mono text-muted-foreground">{Math.round(progress)}%</span></div>
                    <ProgressBar progress={progress} />
                </div>
                
                <ul className="space-y-3">
                  {phase.keyActions.map((action, actionIndex) => {
                    const isChecked = completionState[index]?.[actionIndex] ?? false;
                    return (
                        <li key={actionIndex}>
                            <label className="flex items-start cursor-pointer group text-sm">
                                 <input type="checkbox" checked={isChecked} onChange={() => handleToggleTask(index, actionIndex)} className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0 accent-primary bg-background border-border rounded cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary"/>
                                <span className={`text-foreground transition-colors ${isChecked ? 'line-through text-muted-foreground' : ''}`}>{action}</span>
                            </label>
                        </li>
                    )
                  })}
                </ul>
                
                {phase.considerations && phase.considerations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-foreground mt-6 mb-3 flex items-center text-sm"><WarningIcon className="w-4 h-4 mr-2 flex-shrink-0 text-amber-500" />Megfontolandók:</h4>
                    <ul className="space-y-3 text-sm">
                      {phase.considerations.map((consideration, conIndex) => (
                        <li key={conIndex} className="flex items-start bg-amber-500/10 p-3 rounded-md border border-amber-500/20">
                          <span className="text-amber-500 font-bold mr-3 mt-0.5 flex-shrink-0">!</span>
                          <span className="text-amber-700 dark:text-amber-300">{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};