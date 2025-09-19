import React, { useState } from 'react';
import type { BusinessPlan, FinancialPoint } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { Theme } from '../App';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

interface BusinessPlanDisplayProps {
  plans: BusinessPlan[];
  productDescription: string;
  theme: Theme;
}

const parseAndSumCosts = (points: FinancialPoint[]): string => {
    if (!points || points.length === 0) return '-';
    const total = points.reduce((sum, point) => {
        const num = parseInt(point.cost.replace(/\D/g, ''), 10);
        return sum + (isNaN(num) ? 0 : num);
    }, 0);
    if (total === 0 && points.some(p => p.cost && p.cost.trim() !== '')) return points.map(p => p.cost).join(', ');
    if (total === 0) return '-';
    const isPerMonth = points.some(p => p.cost.includes('/hó'));
    return `${new Intl.NumberFormat('hu-HU').format(total)} HUF${isPerMonth ? '/hó' : ''}`;
};

export const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({ plans, productDescription, theme }) => {
  const [savedPlans, setSavedPlans] = useState<BusinessPlan[]>([]);

  const handleSavePlan = (planToSave: BusinessPlan) => {
    const isAlreadySaved = savedPlans.some(p => p.id === planToSave.id);
    if (isAlreadySaved) return;

    const updatedSavedPlans = [...savedPlans, planToSave];
    setSavedPlans(updatedSavedPlans);
    try {
        localStorage.setItem('savedBusinessPlans', JSON.stringify(updatedSavedPlans));
    } catch (error) {
        console.error("Nem sikerült menteni az üzleti tervet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground">Üzleti Terv Javaslatok</h3>
      {plans.map((plan, index) => (
        <div key={plan.id} className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-lg font-bold text-primary mb-4">{plan.title}</h4>
          <p className="text-muted-foreground mb-4 italic">{plan.strategyFocus}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-foreground mb-2">Marketing Stratégia</h5>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {plan.marketingStrategy.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-2">Kockázatok</h5>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {plan.riskAssessment.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => handleSavePlan(plan)}
            className="mt-4 flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90"
          >
            <BookmarkIcon className="w-4 h-4" />
            Terv Mentése
          </button>
        </div>
      ))}
    </div>
  );
};