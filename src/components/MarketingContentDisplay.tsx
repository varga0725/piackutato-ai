import React, { useState, useEffect } from 'react';
import { MarketingContent } from '../../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { Theme } from '../../App';
import { generateImageFromPrompt } from '../services/geminiService';
import { WarningIcon } from './icons/WarningIcon';
import { CameraIcon } from './icons/CameraIcon';

const ImageGenerator: React.FC<{ imagePrompt: string }> = ({ imagePrompt }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generate = async () => {
            if (!imagePrompt) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const url = await generateImageFromPrompt(imagePrompt);
                setImageUrl(url);
            } catch (e: any) {
                setError("Kép generálása sikertelen.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        generate();
    }, [imagePrompt]);

    if (isLoading) {
        return (
            <div className="w-full aspect-square bg-muted/50 rounded-lg flex flex-col items-center justify-center animate-pulse">
                 <CameraIcon className="w-8 h-8 text-muted-foreground" />
                 <p className="text-xs text-muted-foreground mt-2">Kép generálása...</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="w-full aspect-square bg-red-500/10 rounded-lg flex flex-col items-center justify-center p-2">
                 <WarningIcon className="w-8 h-8 text-red-500" />
                 <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
            </div>
        );
    }
    
    if (imageUrl) {
        return (
            <div className="w-full aspect-square rounded-lg overflow-hidden group relative">
                <img src={imageUrl} alt={imagePrompt} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="truncate" title={imagePrompt}>{imagePrompt}</p>
                </div>
            </div>
        );
    }

    return null;
};

interface MarketingContentDisplayProps {
    content: MarketingContent;
    theme: Theme;
}

type ActiveTab = 'social' | 'blog' | 'ads';

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-1/3 px-3 py-1.5 text-xs font-semibold transition-colors duration-200 rounded-md ${
            active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'
        }`}
    >
        {children}
    </button>
);

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
            className="absolute top-2 right-2 p-1.5 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            title="Szöveg másolása"
        >
            {copied ? (
                <CheckIcon className="w-4 h-4 text-emerald-500" />
            ) : (
                <CopyIcon className="w-4 h-4 text-muted-foreground" />
            )}
        </button>
    );
};

export const MarketingContentDisplay: React.FC<MarketingContentDisplayProps> = ({ content, theme }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('social');

    const renderSocial = () => (
        <div className="space-y-4">
            {[...content.socialMediaPosts]
                .sort((a, b) => a.platform.localeCompare(b.platform))
                .map((post, i) => (
                    <div key={i} className="bg-background border border-border p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="md:col-span-1">
                            <ImageGenerator imagePrompt={post.imagePrompt} />
                        </div>
                        <div className="md:col-span-2 relative">
                            <h4 className="font-bold text-primary mb-2">{post.platform}</h4>
                            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                            <p className="text-muted-foreground mt-2 text-xs">{post.hashtags.join(' ')}</p>
                            <CopyButton textToCopy={`${post.content}\n\n${post.hashtags.join(' ')}`} />
                        </div>
                    </div>
                ))}
        </div>
    );

    const renderBlog = () => (
        <div className="bg-background border border-border p-6 rounded-xl">
            <h4 className="font-bold text-primary mb-2 text-lg">{content.blogPostOutline.title}</h4>
            <div className="my-4">
                 <ImageGenerator imagePrompt={content.blogPostOutline.imagePrompt} />
            </div>
            <div className="relative">
                <p className="italic text-muted-foreground mb-3">{content.blogPostOutline.introduction}</p>
                <div className="space-y-3">
                    {content.blogPostOutline.sections.map((section, i) => (
                        <div key={i}>
                            <h5 className="font-semibold text-foreground">{section.title}</h5>
                            <ul className="list-disc list-inside text-muted-foreground pl-2">{section.points.map((point, j) => <li key={j}>{point}</li>)}</ul>
                        </div>
                    ))}
                </div>
                <CopyButton textToCopy={ `Cím: ${content.blogPostOutline.title}\n\nBevezető: ${content.blogPostOutline.introduction}\n\n` + content.blogPostOutline.sections.map(s => `${s.title}:\n- ${s.points.join('\n- ')}`).join('\n\n') } />
            </div>
        </div>
    );

     const renderAds = () => (
        <div className="space-y-4">
            {content.adCopies.map((ad, i) => (
                <div key={i} className="bg-background border border-border p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1">
                        <ImageGenerator imagePrompt={ad.imagePrompt} />
                    </div>
                    <div className="md:col-span-2 relative">
                        <h4 className="font-bold text-primary mb-2">{ad.platform}</h4>
                        <p><strong className="text-foreground">Főcím:</strong> {ad.headline}</p>
                        <p><strong className="text-foreground">Leírás:</strong> {ad.description}</p>
                        <CopyButton textToCopy={`Főcím: ${ad.headline}\nLeírás: ${ad.description}`} />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            <div className="bg-background border border-border p-1 rounded-lg flex space-x-1 mb-4">
                <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')}>Közösségi Média</TabButton>
                <TabButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')}>Blog</TabButton>
                <TabButton active={activeTab === 'ads'} onClick={() => setActiveTab('ads')}>Hirdetések</TabButton>
            </div>
            
            <div className="mt-4 text-sm">
                {activeTab === 'social' && renderSocial()}
                {activeTab === 'blog' && renderBlog()}
                {activeTab === 'ads' && renderAds()}
            </div>
        </div>
    );
};