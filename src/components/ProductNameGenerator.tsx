import React, { useState } from 'react';
import { ProductNameSuggestions, ProductNameCategory } from '../../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

const categoryDisplayNames: Record<ProductNameCategory, string> = {
    [ProductNameCategory.DESCRIPTIVE]: 'Leíró jellegű',
    [ProductNameCategory.EVOCATIVE]: 'Hangulatos',
    [ProductNameCategory.MODERN]: 'Modern',
    [ProductNameCategory.PLAYFUL]: 'Játékos',
    [ProductNameCategory.PREMIUM]: 'Prémium',
};

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            title="Név másolása"
        >
            {copied ? (
                <CheckIcon className="w-4 h-4 text-emerald-500" />
            ) : (
                <CopyIcon className="w-4 h-4 text-muted-foreground" />
            )}
        </button>
    );
};


export const ProductNameGenerator: React.FC<{ suggestions: ProductNameSuggestions }> = ({ suggestions }) => {
    const validCategories = Object.values(ProductNameCategory);
    const categories = (Object.keys(suggestions) as ProductNameCategory[]).filter(key => validCategories.includes(key));

    return (
        <div className="space-y-6">
            {categories.map((category) => {
                const names = suggestions[category];
                if (!names || names.length === 0) return null;

                return (
                    <div key={category}>
                        <h4 className="font-bold text-foreground mb-3 text-lg">{categoryDisplayNames[category]}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {names.map((suggestion, index) => (
                                <div key={index} className="bg-background p-4 rounded-lg border border-border flex justify-between items-start gap-4">
                                    <div>
                                        <p className="font-semibold text-primary">{suggestion.name}</p>
                                        <p className="text-sm text-muted-foreground italic mt-1">{suggestion.reasoning}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <CopyButton textToCopy={suggestion.name} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};