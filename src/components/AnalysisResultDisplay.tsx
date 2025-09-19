import React, { useMemo, useState, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, BarChart, Bar } from 'recharts';
import { generateSimpleBusinessPlan, generateMarketingStrategyFromAnalysis, generateBusinessPlans, generateBrandIdentity, generateProductNames } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { MarketingStrategyDisplay } from './MarketingStrategyDisplay';
import { CompetitorComparison } from './CompetitorComparison';
import { InteractiveSWOTAnalysis } from './InteractiveSWOTAnalysis';
import { MarketResearchTextDisplay } from './MarketResearchTextDisplay';
import { InteractiveTrendChart } from './InteractiveTrendChart';
import { BusinessPlanDisplay } from './BusinessPlanDisplay';
import { BrandIdentityGenerator } from './BrandIdentityGenerator';
import { ProductNameGenerator } from './ProductNameGenerator';

// FIX: Import 'PointCategory' as a value, as it is an enum used at runtime, not just a type.
import { PointCategory } from '../../types';
import type { AnalysisResult, BuyerPersona, Sentiment, AnalysisType, Competitor, RegionData, MarketTrend, BusinessPlan, MarketingStrategy, BusinessPlanTemplate, BrandIdentity, ProductNameSuggestions } from '../../types';
import { Theme } from '../../App';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { PriceTagIcon } from './icons/PriceTagIcon';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { SwotIcon } from './icons/SwotIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';


// --- Reusable Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-card border border-border rounded-xl p-6 h-full flex flex-col ${className}`}>
        {children}
    </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg text-sm">
                <p className="font-bold mb-1 text-foreground">{label}</p>
                <p className="text-primary">{`Érdeklődés: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// --- Dashboard Cards ---

const MarketOverviewCard: React.FC<{ overview: AnalysisResult['marketOverview'], trendData: MarketTrend['dataPoints'] | undefined }> = ({ overview, trendData }) => {
    return (
        <Card className="xl:col-span-2">
            <h3 className="text-base font-semibold text-muted-foreground mb-4">Piaci Áttekintés</h3>
            <div className="flex-grow flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{overview.marketSize || 'N/A'}</p>
                        <p className="text-sm font-semibold text-muted-foreground">Piacméret</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-foreground">{overview.growthRate || 'N/A'}</p>
                        <p className="text-sm font-semibold text-muted-foreground">Növekedés</p>
                    </div>
                </div>
                <div className="h-24 -mx-4 -mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#overviewGradient)" />
                            <RechartsTooltip content={<CustomTooltip />} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

const TrendsCard: React.FC<{ trend: MarketTrend | undefined, theme: Theme }> = ({ trend, theme }) => (
    <Card className="xl:col-span-2">
        <h3 className="text-base font-semibold text-muted-foreground mb-2">Trendek</h3>
        <p className="text-lg font-bold text-foreground mb-4">{trend?.name || 'Fő piaci trend'}</p>
        <div className="flex-grow h-48">
            {trend && (
                <InteractiveTrendChart trend={trend} theme={theme} />
            )}
        </div>
    </Card>
);

const PersonaCard: React.FC<{ persona: BuyerPersona }> = ({ persona }) => (
    <Card className="xl:col-span-1">
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-base font-bold text-foreground">{persona.name}</h3>
                <p className="text-sm text-muted-foreground">{persona.age} éves, {persona.occupation}</p>
            </div>
        </div>
        <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3 my-2">
            "{persona.quote}"
        </blockquote>
    </Card>
);

const RegionsCard: React.FC<{ regions: RegionData[] }> = ({ regions }) => (
    <Card className="xl:col-span-2">
        <h3 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2"><ChartBarIcon className="w-5 h-5"/>Régiók</h3>
        <div className="flex-grow h-48 -mx-2">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-card/80 backdrop-blur-sm p-2 border border-border rounded-lg shadow-lg text-xs">
                                        <p className="font-bold text-foreground">{`${label}: ${payload[0].value}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="intensity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
);

const KeywordsCard: React.FC<{ keywords: string[] }> = ({ keywords }) => (
    <Card className="xl:col-span-1">
        <h3 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2"><PriceTagIcon className="w-5 h-5"/>Kulcsszavak</h3>
        <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => <span key={i} className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-md">{kw}</span>)}
        </div>
    </Card>
);

const ContentSuggestionsCard: React.FC<{ suggestions: string[] }> = ({ suggestions }) => (
     <Card className="xl:col-span-1">
        <h3 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2"><LightbulbIcon className="w-5 h-5"/>Tartalom Javaslatok</h3>
        <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => <span key={i} className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-md">{s}</span>)}
        </div>
    </Card>
);

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
        }`}
    >
        {icon}
        {label}
    </button>
);


// --- Main Display Component ---

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  userInput: string;
  analysisType: AnalysisType;
  theme: Theme;
  onSave: () => void;
  isSaved: boolean;
  marketingStrategy: MarketingStrategy | null;
  setMarketingStrategy: (strategy: MarketingStrategy | null) => void;
  businessPlans: BusinessPlan[] | null;
  setBusinessPlans: (plans: BusinessPlan[] | null) => void;
  brandIdentity: BrandIdentity | null;
  setBrandIdentity: (identity: BrandIdentity | null) => void;
  productNames: ProductNameSuggestions | null;
  setProductNames: (names: ProductNameSuggestions | null) => void;
}

type ActiveTab = 'dashboard' | 'competitors' | 'swot' | 'text';

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, userInput, analysisType, theme, onSave, isSaved, marketingStrategy, setMarketingStrategy, businessPlans, setBusinessPlans, brandIdentity, setBrandIdentity, productNames, setProductNames }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [isGeneratingPlans, setIsGeneratingPlans] = useState(false);
    const [planGenerationError, setPlanGenerationError] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<BusinessPlanTemplate>('LEAN_STARTUP');
    
    const [isGeneratingIdentity, setIsGeneratingIdentity] = useState(false);
    const [identityGenerationError, setIdentityGenerationError] = useState<string | null>(null);

    const [isGeneratingNames, setIsGeneratingNames] = useState(false);
    const [nameGenerationError, setNameGenerationError] = useState<string | null>(null);

    const handleGeneratePlans = async () => {
        setIsGeneratingPlans(true);
        setPlanGenerationError(null);
        setBusinessPlans(null);
        try {
            const plans = await generateBusinessPlans(userInput, analysisType, result, selectedTemplate);
            setBusinessPlans(plans);
        } catch (e: any) {
            setPlanGenerationError(e.message || 'Hiba történt a tervek generálása során.');
        } finally {
            setIsGeneratingPlans(false);
        }
    };
    
    const handleGenerateIdentity = async () => {
        setIsGeneratingIdentity(true);
        setIdentityGenerationError(null);
        setBrandIdentity(null);
        try {
            const identity = await generateBrandIdentity(result, userInput);
            setBrandIdentity(identity);
        } catch (e: any) {
            setIdentityGenerationError(e.message || 'Hiba történt az arculat generálása során.');
        } finally {
            setIsGeneratingIdentity(false);
        }
    };
    
    const handleGenerateNames = async () => {
        setIsGeneratingNames(true);
        setNameGenerationError(null);
        setProductNames(null);
        try {
            const names = await generateProductNames(result, userInput);
            setProductNames(names);
        } catch (e: any) {
            setNameGenerationError(e.message || 'Hiba történt a nevek generálása során.');
        } finally {
            setIsGeneratingNames(false);
        }
    };
    

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MarketOverviewCard overview={result.marketOverview} trendData={result.trends?.[0]?.dataPoints} />
                        <TrendsCard trend={result.trends?.[0]} theme={theme} />
                        {result.personas?.[0] && <PersonaCard persona={result.personas[0]} />}
                        {result.personas?.[1] && <PersonaCard persona={result.personas[1]} />}
                        <RegionsCard regions={result.regions} />
                        <KeywordsCard keywords={result.keywords} />
                        <ContentSuggestionsCard suggestions={result.contentSuggestions} />
                    </div>
                );
            case 'competitors':
                return <CompetitorComparison competitors={result.competitors} theme={theme} />;
            case 'swot':
                return <InteractiveSWOTAnalysis initialSwot={result.swotAnalysis} theme={theme} competitors={result.competitors} />;
            case 'text':
                return <MarketResearchTextDisplay analysisText={result.analysisText} />;
            default:
                return null;
        }
    };

  return (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground truncate pr-4" title={userInput}>
                Elemzés: <span className="text-primary">{userInput}</span>
            </h2>
            <button
                onClick={onSave}
                disabled={isSaved}
                className="flex flex-shrink-0 items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed bg-muted/50 hover:bg-muted text-foreground disabled:bg-emerald-500/10 disabled:text-emerald-500"
            >
                {isSaved ? <CheckIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                <span>{isSaved ? 'Projekt Mentve' : 'Projekt Mentése'}</span>
            </button>
        </div>
        
        <div className="bg-card border border-border p-1 rounded-lg flex flex-wrap items-center gap-1">
            <TabButton icon={<ChartBarIcon className="w-4 h-4" />} label="Irányítópult" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <TabButton icon={<ScaleIcon className="w-4 h-4" />} label="Versenytársak" isActive={activeTab === 'competitors'} onClick={() => setActiveTab('competitors')} />
            <TabButton icon={<SwotIcon className="w-4 h-4" />} label="SWOT" isActive={activeTab === 'swot'} onClick={() => setActiveTab('swot')} />
            <TabButton icon={<DocumentTextIcon className="w-4 h-4" />} label="Szöveges Elemzés" isActive={activeTab === 'text'} onClick={() => setActiveTab('text')} />
        </div>

        <div className="mt-6">
            {renderContent()}
        </div>

        <div className="border-t border-border pt-6 mt-6 space-y-6">
             <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                        <BriefcaseIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-card-foreground">Következő Lépés: Üzleti Terv</h3>
                        <p className="text-sm text-muted-foreground">Generáljon testreszabott üzleti terveket az elemzés alapján.</p>
                    </div>
                </div>

                {!businessPlans && (
                    <div className="bg-background border border-border rounded-lg p-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground">Válasszon sablont:</label>
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                {[
                                    { id: 'LEAN_STARTUP', name: 'Lean Startup', desc: 'Gyors piacra lépés, MVP fókusz.' },
                                    { id: 'GROWTH', name: 'Növekedés-orientált', desc: 'Piacrész szerzés, skálázás.' },
                                    { id: 'PREMIUM', name: 'Prémium / Minőség', desc: 'Márkaépítés, magas minőség.' },
                                ].map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id as BusinessPlanTemplate)}
                                        disabled={isGeneratingPlans}
                                        className={`w-full text-left p-3 border rounded-md transition-colors ${selectedTemplate === template.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50 border-border'}`}
                                    >
                                        <p className={`font-semibold ${selectedTemplate === template.id ? 'text-primary' : 'text-foreground'}`}>{template.name}</p>
                                        <p className="text-xs text-muted-foreground">{template.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleGeneratePlans}
                            disabled={isGeneratingPlans}
                            className="w-full font-semibold bg-primary text-primary-foreground py-2.5 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                            {isGeneratingPlans ? 'Generálás...' : '3 Tervjavaslat Generálása'}
                        </button>
                    </div>
                )}

                {isGeneratingPlans && <LoadingSpinner message="Üzleti tervek kidolgozása..." />}

                {planGenerationError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-center" role="alert">
                        <p className="font-semibold">Hiba történt</p>
                        <p className="text-sm mt-1">{planGenerationError}</p>
                    </div>
                )}

                {businessPlans && (
                    <div className="animate-fade-in">
                        <BusinessPlanDisplay plans={businessPlans} productDescription={userInput} theme={theme} />
                    </div>
                )}
            </div>
            
             <div className="bg-card border border-border rounded-xl p-6">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                        <PaintBrushIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-card-foreground">Vizuális Arculat Tervező</h3>
                        <p className="text-sm text-muted-foreground">Generáljon színpalettát, betűtípusokat és stílusjavaslatot.</p>
                    </div>
                </div>

                 {!brandIdentity && (
                    <div className="bg-background border border-border rounded-lg p-4">
                        <button
                            onClick={handleGenerateIdentity}
                            disabled={isGeneratingIdentity}
                            className="w-full font-semibold bg-primary text-primary-foreground py-2.5 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                            {isGeneratingIdentity ? 'Generálás...' : 'Arculat Generálása'}
                        </button>
                    </div>
                 )}

                {isGeneratingIdentity && <LoadingSpinner message="Vizuális arculat megalkotása..." />}
                 
                {identityGenerationError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-center" role="alert">
                        <p className="font-semibold">Hiba történt</p>
                        <p className="text-sm mt-1">{identityGenerationError}</p>
                    </div>
                )}

                {brandIdentity && (
                    <div className="animate-fade-in">
                       <BrandIdentityGenerator identity={brandIdentity} />
                    </div>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                        <PriceTagIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-card-foreground">Terméknév Generátor</h3>
                        <p className="text-sm text-muted-foreground">Generáljon kreatív névjavaslatokat a márkájához.</p>
                    </div>
                </div>

                {!productNames && (
                    <div className="bg-background border border-border rounded-lg p-4">
                        <button
                            onClick={handleGenerateNames}
                            disabled={isGeneratingNames}
                            className="w-full font-semibold bg-primary text-primary-foreground py-2.5 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                            {isGeneratingNames ? 'Generálás...' : 'Névjavaslatok Kérése'}
                        </button>
                    </div>
                )}

                {isGeneratingNames && <LoadingSpinner message="Kreatív nevek keresése..." />}
                
                {nameGenerationError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-center" role="alert">
                        <p className="font-semibold">Hiba történt</p>
                        <p className="text-sm mt-1">{nameGenerationError}</p>
                    </div>
                )}

                {productNames && (
                    <div className="animate-fade-in">
                       <ProductNameGenerator suggestions={productNames} />
                    </div>
                )}
            </div>
        </div>

    </div>
  );
};