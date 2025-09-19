import React, { useState } from 'react';
import { generateMarketingStrategy } from '../services/geminiService';
import type { MarketingStrategy } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { MarketingStrategyDisplay } from './MarketingStrategyDisplay';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <input
            id={id}
            {...props}
            className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground"
        />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <textarea
            id={id}
            {...props}
            className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground resize-none"
        />
    </div>
);

export const MarketingStrategyView: React.FC = () => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [goal, setGoal] = useState('Márkaismertség növelése');
    const [budget, setBudget] = useState('Alacsony (< 100.000 HUF/hó)');
    const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product.trim() || !audience.trim()) {
            setError('A termék/szolgáltatás és a célközönség megadása kötelező.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStrategy(null);

        try {
            const result = await generateMarketingStrategy(product, audience, goal, budget);
            setStrategy(result);
        } catch (e: any) {
            setError(e.message || 'Hiba történt a stratégia készítése közben.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const isFormIncomplete = !product.trim() || !audience.trim();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-fade-in-up">
            <div className="lg:col-span-4 xl:col-span-3 h-full">
                <div className="sticky top-8 bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                           <MegaphoneIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-card-foreground">Stratégia Tervező</h2>
                            <p className="text-sm text-muted-foreground">Adja meg a részleteket</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextareaField
                            id="product"
                            rows={4}
                            label="Termék vagy szolgáltatás"
                            placeholder="Pl.: 'Kézműves vegán szappanok'"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <TextareaField
                            id="audience"
                            rows={4}
                            label="Célközönség"
                            placeholder="Pl.: 'Környezettudatos fiatal felnőttek'"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                         <div>
                            <label htmlFor="goal" className="block text-sm font-medium text-muted-foreground mb-2">Fő marketing cél</label>
                            <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} disabled={isLoading} className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary">
                                <option>Márkaismertség növelése</option>
                                <option>Eladások növelése</option>
                                <option>Új ügyfelek szerzése</option>
                                <option>Közösségépítés</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-muted-foreground mb-2">Költségkeret</label>
                            <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} disabled={isLoading} className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary">
                                <option>Alacsony (&lt; 100.000 HUF/hó)</option>
                                <option>Közepes (100.000 - 500.000 HUF/hó)</option>
                                <option>Magas (&gt; 500.000 HUF/hó)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isFormIncomplete}
                            className="mt-4 w-full flex items-center justify-center font-semibold bg-primary text-primary-foreground py-2.5 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Generálás...' : 'Stratégia Készítése'}
                        </button>
                    </form>
                </div>
            </div>
             <div className="lg:col-span-8 xl:col-span-9 h-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full rounded-2xl bg-card border border-border"><LoadingSpinner message="Marketing stratégia kidolgozása..." /></div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full rounded-2xl bg-card border border-border">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-center" role="alert">
                            <p className="font-semibold">Hiba történt</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                ) : strategy ? (
                    <MarketingStrategyDisplay strategy={strategy} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-card border border-border text-center p-8">
                        <div className="w-16 h-16 p-2 mb-6 bg-background rounded-2xl border border-border flex items-center justify-center">
                            <MegaphoneIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-card-foreground">AI-Vezérelt Marketing Stratégia</h2>
                        <p className="mt-2 text-muted-foreground max-w-md">
                           Töltse ki a bal oldali űrlapot, és az AI egy személyre szabott, átfogó marketing stratégiát készít Önnek.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};