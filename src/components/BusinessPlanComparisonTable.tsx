import React from 'react';
import type { BusinessPlan, FinancialPoint } from '../../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { CheckIcon } from './icons/CheckIcon';

interface BusinessPlanComparisonTableProps {
  plans: BusinessPlan[];
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


const ComparisonRow: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <tr className="border-b border-border">
        <th scope="row" className="px-4 py-4 font-semibold text-foreground bg-card sticky left-0 z-10">
            <div className="flex items-center gap-3"><span title={title}>{icon}</span><span>{title}</span></div>
        </th>
        {children}
    </tr>
);

const PlanContentCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <td className="px-4 py-4 align-top text-muted-foreground">{children}</td>
);

export const BusinessPlanComparisonTable: React.FC<BusinessPlanComparisonTableProps> = ({ plans }) => {
    if (!plans || plans.length === 0) return null;

    return (
        <div className="overflow-x-auto bg-card border border-border rounded-xl">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-muted-foreground uppercase">
                    <tr>
                        <th scope="col" className="px-4 py-3 bg-card sticky left-0 z-10">Jellemző</th>
                        {plans.map((plan, index) => (
                            <th key={index} scope="col" className="px-4 py-3 text-center min-w-[250px] font-bold text-foreground">{plan.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="">
                    <ComparisonRow icon={<BriefcaseIcon className="w-5 h-5 text-primary" />} title="Stratégiai Fókusz">
                        {plans.map((plan, index) => <PlanContentCell key={index}><p className="italic leading-relaxed">{plan.strategyFocus}</p></PlanContentCell>)}
                    </ComparisonRow>
                    
                    <ComparisonRow icon={<CalculatorIcon className="w-5 h-5 text-primary" />} title="Kezdeti Befektetés">
                        {plans.map((plan, index) => <PlanContentCell key={index}><span className="font-mono text-foreground font-semibold text-base">{parseAndSumCosts(plan.financialPlan.initialInvestment)}</span></PlanContentCell>)}
                    </ComparisonRow>

                    <ComparisonRow icon={<CalculatorIcon className="w-5 h-5 text-primary" />} title="Havi Költségek">
                         {plans.map((plan, index) => <PlanContentCell key={index}><span className="font-mono text-foreground font-semibold text-base">{parseAndSumCosts(plan.financialPlan.monthlyOperationalCosts)}</span></PlanContentCell>)}
                    </ComparisonRow>
                    
                    <ComparisonRow icon={<MegaphoneIcon className="w-5 h-5 text-primary" />} title="Marketing Stratégia">
                        {plans.map((plan, index) => (
                            <PlanContentCell key={index}>
                               <ul className="space-y-2">{plan.marketingStrategy.slice(0, 3).map((item, i) => <li key={i} className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>)}</ul>
                            </PlanContentCell>
                        ))}
                    </ComparisonRow>

                    <ComparisonRow icon={<BanknotesIcon className="w-5 h-5 text-primary" />} title="Finanszírozás">
                        {plans.map((plan, index) => <PlanContentCell key={index}><ul className="space-y-1 font-semibold text-foreground">{plan.fundingOptions.map((item, i) => <li key={i}>{item.type}</li>)}</ul></PlanContentCell>)}
                    </ComparisonRow>

                    <ComparisonRow icon={<ShieldExclamationIcon className="w-5 h-5 text-primary" />} title="Fő Kockázatok">
                        {plans.map((plan, index) => (
                           <PlanContentCell key={index}>
                               <ul className="space-y-2">{plan.riskAssessment.slice(0, 2).map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0 font-bold">!</span><span>{item}</span></li>)}</ul>
                            </PlanContentCell>
                        ))}
                    </ComparisonRow>
                </tbody>
            </table>
        </div>
    );
};