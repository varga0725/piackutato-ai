import React from 'react';
import type { MarketingStrategy } from '../../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { CalendarIcon } from './icons/CalendarIcon';

const StrategyCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}> = ({ icon, title, children, className }) => (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
            </div>
        </div>
        <div>{children}</div>
    </div>
);

export const MarketingStrategyDisplay: React.FC<{ strategy: MarketingStrategy }> = ({ strategy }) => {
    const { strategicOverview, suggestedChannels, coreMessaging, campaignIdeas, keyPerformanceIndicators, marketingCalendar } = strategy;

    return (
        <div className="space-y-6 animate-fade-in">
            <StrategyCard icon={<BriefcaseIcon className="w-5 h-5" />} title="Stratégiai Áttekintés">
                <p className="text-muted-foreground leading-relaxed">{strategicOverview}</p>
            </StrategyCard>
            
            <StrategyCard icon={<MegaphoneIcon className="w-5 h-5" />} title="Javasolt Marketing Csatornák">
                <div className="space-y-4">
                    {suggestedChannels.map((channel, index) => (
                        <div key={index} className="p-4 bg-background border border-border rounded-lg">
                            <h4 className="font-semibold text-foreground">{channel.name}</h4>
                            <p className="text-sm text-muted-foreground my-1">{channel.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {channel.platforms.map((platform, pIndex) => (
                                    <span key={pIndex} className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md">{platform}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </StrategyCard>
            
            <StrategyCard icon={<CalendarIcon className="w-5 h-5" />} title="Heti Marketing Naptár">
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase">
                            <tr className="border-b border-border">
                                <th scope="col" className="px-6 py-3 font-semibold">Nap</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Időpont</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Tevékenység</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Platform</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Megjegyzés</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {marketingCalendar.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">{item.day}</td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{item.time}</td>
                                    <td className="px-6 py-4 text-foreground">{item.activity}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.platform}</td>
                                    <td className="px-6 py-4 text-muted-foreground min-w-[250px]">{item.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </StrategyCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <StrategyCard icon={<ChatBubbleIcon className="w-5 h-5" />} title="Központi Üzenet">
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Fő üzenet</h4>
                            <p className="text-muted-foreground text-sm italic">"{coreMessaging.mainMessage}"</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Szlogenek</h4>
                            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                                {coreMessaging.taglines.map((tag, index) => <li key={index}>{tag}</li>)}
                            </ul>
                        </div>
                    </div>
                </StrategyCard>

                <StrategyCard icon={<LightbulbIcon className="w-5 h-5" />} title="Kampány Ötletek">
                     <div className="space-y-3">
                        {campaignIdeas.map((idea, index) => (
                            <div key={index}>
                                <h4 className="font-semibold text-foreground text-sm">{idea.name}</h4>
                                <p className="text-muted-foreground text-sm">{idea.description}</p>
                            </div>
                        ))}
                    </div>
                </StrategyCard>
            </div>
            
            <StrategyCard icon={<ChartBarIcon className="w-5 h-5" />} title="Kulcsfontosságú Teljesítménymutatók (KPI)">
                <ul className="list-none space-y-2">
                    {keyPerformanceIndicators.map((kpi, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                            <CheckIcon className="w-4 h-4 mr-3 flex-shrink-0 text-primary" />
                            {kpi}
                        </li>
                    ))}
                </ul>
            </StrategyCard>
        </div>
    );
};