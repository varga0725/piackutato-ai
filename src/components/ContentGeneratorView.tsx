import React, { useState, useCallback } from 'react';
import type { AnalysisResult, MarketingContent, BuyerPersona } from '../../types';
import { generateMarketingContent, generateBuyerPersona } from '../services/geminiService';
import { MarketingContentDisplay } from './MarketingContentDisplay';
import { BuyerPersonaDisplay } from './BuyerPersonaDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { Theme } from '../../App';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ContentGeneratorViewProps {
    analysisResult: AnalysisResult | null;
    userInput: string;
    theme: Theme;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        {children}
    </div>
);

export const ContentGeneratorView: React.FC<ContentGeneratorViewProps> = ({ analysisResult, userInput, theme }) => {
    const [marketingContent, setMarketingContent] = useState<MarketingContent | null>(null);
    const [buyerPersona, setBuyerPersona] = useState<BuyerPersona | null>(null);

    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleGeneration = useCallback(async <T,>(
        key: string,
        generator: () => Promise<T>,
        setter: (data: T) => void
    ) => {
        setIsLoading(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));
        try {
            const data = await generator();
            setter(data);
        } catch (e: any) {
            setErrors(prev => ({ ...prev, [key]: e.message || `Hiba történt a(z) ${key} generálása során.` }));
        } finally {
            setIsLoading(prev => ({ ...prev, [key]: false }));
        }
    }, []);

    const handleGenerateMarketingContent = () => {
        if (!analysisResult) return;
        handleGeneration('marketing', () => generateMarketingContent(analysisResult, userInput), setMarketingContent);
    };

    const handleGenerateBuyerPersona = () => {
        if (!analysisResult) return;
        handleGeneration('persona', () => generateBuyerPersona(analysisResult, userInput), setBuyerPersona);
    };

    if (!analysisResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-card border border-border text-center p-8 animate-fade-in-up">
                <div className="w-16 h-16 p-2 mb-6 bg-background rounded-2xl border border-border flex items-center justify-center">
                    <DocumentTextIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">Tartalomgenerátor</h2>
                <p className="mt-2 text-muted-foreground max-w-md">
                    Először végezzen el egy piackutatási elemzést a "Piackutatás" fülön. Az eredmények alapján az AI itt képes lesz marketing tartalmakat generálni.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-foreground">AI Tartalomgenerátor</h1>
                <p className="text-muted-foreground mt-1">
                    Generáljon marketing anyagokat a következő elemzés alapján: <span className="font-semibold text-primary">"{userInput}"</span>
                </p>
            </div>

            <Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg"><ClipboardDocumentListIcon className="w-5 h-5 text-primary" />Marketing Tartalom</h3>
                        <div className="bg-background border border-border rounded-lg p-4 flex-grow flex flex-col">
                            {isLoading.marketing ? <LoadingSpinner message="Generálás..." /> :
                            marketingContent ? <div className="animate-fade-in-up"><MarketingContentDisplay content={marketingContent} theme={theme} /></div> :
                            <div className="text-center my-auto">
                                <p className="text-sm text-muted-foreground mb-3">Generáljon közösségi média posztokat, blog vázlatot és hirdetési szövegeket, egyedi kép promptokkal.</p>
                                {errors.marketing && <p className="text-red-500 text-xs mb-2">{errors.marketing}</p>}
                                <button onClick={handleGenerateMarketingContent} className="w-full text-sm font-semibold bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">Tartalomcsomag Generálása</button>
                            </div>}
                        </div>
                    </div>
                    <div className="flex flex-col">
                         <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg"><IdentificationIcon className="w-5 h-5 text-primary" />Vásárlói Perszóna</h3>
                        <div className="bg-background border border-border rounded-lg p-4 flex-grow flex flex-col">
                            {isLoading.persona ? <LoadingSpinner message="Generálás..." /> :
                            buyerPersona ? <div className="animate-fade-in-up"><BuyerPersonaDisplay persona={buyerPersona} /></div> :
                            <div className="text-center my-auto">
                                <p className="text-sm text-muted-foreground mb-3">Hozzon létre egy részletes profilt az ideális vásárlójáról, hogy jobban megértse a célközönségét.</p>
                                {errors.persona && <p className="text-red-500 text-xs mb-2">{errors.persona}</p>}
                                <button onClick={handleGenerateBuyerPersona} className="w-full text-sm font-semibold bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">Perszóna Generálása</button>
                            </div>}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};