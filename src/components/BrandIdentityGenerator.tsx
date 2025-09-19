import React, { useState, useEffect } from 'react';
import type { BrandIdentity } from '../../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LinkIcon } from './icons/LinkIcon';
import { EyeIcon } from './icons/EyeIcon';

const ColorSwatch: React.FC<{ hex: string; name: string }> = ({ hex, name }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="text-center">
            <div
                className="w-full aspect-square rounded-full border-2 border-border cursor-pointer transition-transform hover:scale-105 shadow-md"
                style={{ backgroundColor: hex }}
                onClick={handleCopy}
                title={`Másolás: ${hex}`}
            >
                {copied && (
                    <div className="flex items-center justify-center h-full">
                        <CheckIcon className="w-6 h-6 text-white" style={{ mixBlendMode: 'difference' }} />
                    </div>
                )}
            </div>
            <p className="text-sm font-semibold text-foreground mt-2">{name}</p>
            <p className="text-xs text-muted-foreground font-mono">{hex}</p>
        </div>
    );
};

const useDynamicFontLoader = (fontUrl: string | undefined) => {
    useEffect(() => {
        if (!fontUrl) return;

        try {
            const url = new URL(fontUrl);
            const fontName = url.searchParams.get('family');
            if (!fontName || document.head.querySelector(`link[href="${fontUrl}"]`)) {
                return;
            }
    
            const link = document.createElement('link');
            link.href = fontUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
    
            return () => {
                document.head.removeChild(link);
            };
        } catch (error) {
            console.error("Invalid font URL provided:", fontUrl, error);
        }
    }, [fontUrl]);
};

export const BrandIdentityGenerator: React.FC<{ identity: BrandIdentity }> = ({ identity }) => {
    const { colorPalette, fontPairing, moodBoardDescription } = identity;

    useDynamicFontLoader(fontPairing.headlineFont.url);
    useDynamicFontLoader(fontPairing.bodyFont.url);

    const headlineStyle: React.CSSProperties = {
        fontFamily: `'${fontPairing.headlineFont.name}', sans-serif`,
    };
    const bodyStyle: React.CSSProperties = {
        fontFamily: `'${fontPairing.bodyFont.name}', sans-serif`,
    };

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-foreground mb-3 text-lg">Javasolt Színpaletta</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-background border border-border rounded-lg">
                    {colorPalette.map((color) => (
                        <ColorSwatch key={color.hex} hex={color.hex} name={color.name} />
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-bold text-foreground mb-3 text-lg">Betűtípus Párosítás</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background border border-border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold text-muted-foreground">Címsor</h5>
                            <a href={fontPairing.headlineFont.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                Google Fonts <LinkIcon className="w-3 h-3" />
                            </a>
                        </div>
                        <p className="text-2xl" style={headlineStyle}>{fontPairing.headlineFont.name}</p>
                        <p className="text-sm mt-4" style={headlineStyle}>A piackutatás az üzleti siker kulcsa</p>
                    </div>
                    <div className="p-4 bg-background border border-border rounded-lg">
                         <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold text-muted-foreground">Szövegtörzs</h5>
                            <a href={fontPairing.bodyFont.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                Google Fonts <LinkIcon className="w-3 h-3" />
                            </a>
                        </div>
                        <p className="text-2xl" style={bodyStyle}>{fontPairing.bodyFont.name}</p>
                        <p className="text-sm mt-4" style={bodyStyle}>A célközönség megértése, a versenytársak elemzése és a piaci trendek követése elengedhetetlen a megalapozott döntésekhez.</p>
                    </div>
                </div>
            </div>

            <div>
                 <h4 className="font-bold text-foreground mb-3 text-lg flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-primary" />
                    Vizuális Hangulat (Mood Board)
                </h4>
                 <div className="p-4 bg-background border-l-4 border-primary rounded-r-lg">
                    <p className="italic text-muted-foreground leading-relaxed">{moodBoardDescription}</p>
                 </div>
            </div>
        </div>
    );
};