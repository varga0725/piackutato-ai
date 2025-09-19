import React, { useState, useMemo, useEffect } from 'react';
import type { BusinessPlan, FundingOption } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { BusinessPlanComparisonTable } from './BusinessPlanComparisonTable';
import { FinancialChart } from './FinancialChart';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { Theme } from '../App';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const formatCurrency = (cost: string): string => {
    const num = parseInt(cost.replace(/\D/g, ''), 10);
    if (isNaN(num)) return cost;
    const formattedNum = new Intl.NumberFormat('hu-HU').format(num);
    const currency = cost.includes('HUF') ? ' HUF' : '';
    const perMonth = cost.includes('/hó') ? '/hó' : '';
    return `${formattedNum}${currency}${perMonth}`;
};

const ExpandableSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    controls?: React.ReactNode;
    defaultOpen?: boolean;
}> = ({ title, icon, children, controls, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted/50 rounded-md mr-3" title={title}>
                        {icon}
                    </div>
                    <h4 className="font-semibold text-foreground">{title}</h4>
                </div>
                <div className="flex items-center gap-2">
                    {controls && <div onClick={(e) => e.stopPropagation()}>{controls}</div>}
                    <ChevronDownIcon className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 pl-11">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


const FundingOptionCard: React.FC<{ option: FundingOption }> = ({ option }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-background p-4 rounded-md border border-border">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center text-left" aria-expanded={isExpanded}>
                <h5 className="font-semibold text-foreground">{option.type}</h5>
                {isExpanded ? <MinusIcon className="w-5 h-5 text-muted-foreground" /> : <PlusIcon className="w-5 h-5 text-muted-foreground" />}
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 pt-3 mt-3 border-t border-border' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <h6 className="flex items-center font-semibold text-foreground mb-2"><ThumbsUpIcon className="w-4 h-4 mr-2 flex-shrink-0 text-emerald-500" />Előnyök</h6>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">{option.advantages.map((adv, i) => <li key={`adv-${i}`}>{adv}</li>)}</ul>
                        </div>
                        <div>
                            <h6 className="flex items-center font-semibold text-foreground mb-2"><ThumbsDownIcon className="w-4 h-4 mr-2 flex-shrink-0 text-red-500" />Hátrányok</h6>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">{option.disadvantages.map((dis, i) => <li key={`dis-${i}`}>{dis}</li>)}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PlanCardProps {
    plan: BusinessPlan;
    theme: Theme;
    isSaved: boolean;
    onSave?: (plan: BusinessPlan) => void;
    onDelete?: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, theme, isSaved, onSave, onDelete }) => {
  const [financialView, setFinancialView] = useState<'list' | 'chart'>('list');

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="p-6 pb-2">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-primary pr-4">{plan.title}</h3>
                {onSave && (
                    <button 
                        onClick={() => onSave(plan)} 
                        disabled={isSaved}
                        title={isSaved ? "Terv mentve" : "Terv mentése"}
                        className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-md transition-colors duration-200 disabled:cursor-not-allowed bg-muted/50 hover:bg-muted text-foreground disabled:bg-emerald-500/10 disabled:text-emerald-500"
                    >
                        {isSaved ? <CheckIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                        <span>{isSaved ? 'Mentve' : 'Mentés'}</span>
                    </button>
                )}
                {onDelete && (
                     <button 
                        onClick={() => onDelete(plan.id)}
                        title="Terv törlése"
                        className="flex-shrink-0 p-2 rounded-full transition-colors duration-200 bg-muted/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                     >
                        <TrashIcon className="w-4 h-4" />
                     </button>
                )}
            </div>
            <p className="text-sm text-muted-foreground italic mt-1">{plan.strategyFocus}</p>
        </div>
      
        <div className="px-4">
            <ExpandableSection 
                title="Stratégia és Összefoglaló" 
                icon={<BriefcaseIcon className="w-5 h-5 text-primary" />}
                defaultOpen={true}
            >
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.executiveSummary}</p>
            </ExpandableSection>
            
            <ExpandableSection 
                title="Marketing Stratégia" 
                icon={<MegaphoneIcon className="w-5 h-5 text-primary" />}
            >
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">{plan.marketingStrategy.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </ExpandableSection>

            <ExpandableSection 
                title="Pénzügyi Terv" 
                icon={<CalculatorIcon className="w-5 h-5 text-primary" />}
                controls={
                    <div className="flex items-center bg-background border border-border rounded-md p-0.5">
                        <button onClick={() => setFinancialView('list')} title="Lista nézet" className={`p-1 rounded-sm ${financialView === 'list' ? 'bg-muted' : ''}`}><ListBulletIcon className="w-4 h-4" /></button>
                        <button onClick={() => setFinancialView('chart')} title="Grafikon nézet" className={`p-1 rounded-sm ${financialView === 'chart' ? 'bg-muted' : ''}`}><ChartBarIcon className="w-4 h-4" /></button>
                    </div>
                }
            >
                {financialView === 'list' ? (
                     <div className="text-sm space-y-1">
                        <h5 className="font-semibold text-muted-foreground">Kezdeti Befektetés</h5>
                        <ul className="list-none space-y-1 text-muted-foreground mt-2 pl-4 border-l-2 border-border">{plan.financialPlan.initialInvestment.map((fp, i) => <li key={i} className="flex justify-between items-center py-1"><span>{fp.item}</span> <span className="font-mono text-foreground font-semibold text-right">{formatCurrency(fp.cost)}</span></li>)}</ul>
                        <h5 className="font-semibold text-muted-foreground pt-2">Havi Működési Költségek</h5>
                        <ul className="list-none space-y-1 text-muted-foreground mt-2 pl-4 border-l-2 border-border">{plan.financialPlan.monthlyOperationalCosts.map((fp, i) => <li key={i} className="flex justify-between items-center py-1"><span>{fp.item}</span> <span className="font-mono text-foreground font-semibold text-right">{formatCurrency(fp.cost)}</span></li>)}</ul>
                        <h5 className="font-semibold text-muted-foreground pt-2">Bevételi Előrejelzés</h5>
                        <ul className="list-none space-y-1 text-muted-foreground mt-2 pl-4 border-l-2 border-border">{plan.financialPlan.revenueProjections.map((fp, i) => <li key={i} className="flex justify-between items-center py-1"><span>{fp.item}</span> <span className="font-mono text-foreground font-semibold text-right">{formatCurrency(fp.cost)}</span></li>)}</ul>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <FinancialChart theme={theme} title="Kezdeti Befektetés" data={plan.financialPlan.initialInvestment} barColor="#0ea5e9" />
                        <FinancialChart theme={theme} title="Havi Működési Költségek" data={plan.financialPlan.monthlyOperationalCosts} barColor="#f59e0b" />
                        <FinancialChart theme={theme} title="Bevételi Előrejelzés" data={plan.financialPlan.revenueProjections} barColor="#10b981" />
                    </div>
                )}
            </ExpandableSection>

            {plan.fundingOptions && plan.fundingOptions.length > 0 && (
                <ExpandableSection title="Finanszírozási Lehetőségek" icon={<BanknotesIcon className="w-5 h-5 text-primary" />}>
                    <div className="space-y-3 text-sm">{plan.fundingOptions.map((option, index) => <FundingOptionCard key={index} option={option} />)}</div>
                </ExpandableSection>
            )}

            <ExpandableSection title="Kockázatértékelés" icon={<ShieldExclamationIcon className="w-5 h-5 text-primary" />}>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">{plan.riskAssessment.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </ExpandableSection>
        </div>
    </div>
  );
};

export const BusinessPlanDisplay: React.FC<{ plans: BusinessPlan[]; productDescription: string; theme: Theme; }> = ({ plans, theme }) => {
  const [savedPlans, setSavedPlans] = useState<BusinessPlan[]>([]);

  useEffect(() => {
    try {
        const saved = localStorage.getItem('savedBusinessPlans');
        if (saved) {
            setSavedPlans(JSON.parse(saved));
        }
    } catch (error) {
        console.error("Nem sikerült betölteni a mentett üzleti terveket:", error);
        localStorage.removeItem('savedBusinessPlans');
    }
  }, []);

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

  const handleDeletePlan = (planIdToDelete: string) => {
    const updatedSavedPlans = savedPlans.filter(p => p.id !== planIdToDelete);
    setSavedPlans(updatedSavedPlans);
    try {
        localStorage.setItem('savedBusinessPlans', JSON.stringify(updatedSavedPlans));
    } catch (error) {
        console.error("Nem sikerült törölni az üzleti tervet:", error);
    }
  };

  const savedPlanIds = useMemo(() => new Set(savedPlans.map(p => p.id)), [savedPlans]);

  return (
    <div className="w-full space-y-8">
        {savedPlans.length > 0 && (
             <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-foreground mb-4">Mentett Tervek</h3>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {savedPlans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            theme={theme}
                            isSaved={true}
                            onDelete={handleDeletePlan}
                        />
                    ))}
                </div>
                <div className="border-t border-border my-8"></div>
            </div>
        )}

      <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Tervek Gyors Összehasonlítása</h3>
          <BusinessPlanComparisonTable plans={plans} />
      </div>

      <div className="border-t border-border my-8"></div>

      <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Részletes Tervjavaslatok</h3>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    theme={theme}
                    isSaved={savedPlanIds.has(plan.id)}
                    onSave={handleSavePlan}
                />
              ))}
          </div>
      </div>
    </div>
  );
};