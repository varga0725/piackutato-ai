import React from 'react';
import type { BuyerPersona } from '../../types';
import { UserIcon } from './icons/UserIcon';

export const BuyerPersonaDisplay: React.FC<{ persona: BuyerPersona }> = ({ persona }) => {
    return (
        <div className="w-full bg-background border border-border p-6 rounded-xl text-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">{persona.name}</h3>
                    <p className="text-muted-foreground">{persona.age} éves, {persona.occupation}</p>
                </div>
            </div>
            
            <blockquote className="italic text-muted-foreground border-l-2 border-primary pl-3 py-1 my-4">
                "{persona.quote}"
            </blockquote>

            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Életrajz</h4>
                    <p className="text-muted-foreground leading-relaxed">{persona.bio}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Motivációk</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">{persona.motivations.map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Problémák</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">{persona.frustrations.map((f, i) => <li key={i}>{f}</li>)}</ul>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-foreground mb-2">Kommunikációs Csatornák</h4>
                    <div className="flex flex-wrap gap-2">
                        {persona.communicationChannels.map((c, i) => (
                            <span key={i} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{c}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};