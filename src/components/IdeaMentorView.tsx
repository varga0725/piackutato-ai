import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createMentorChatSession, summarizeChatForAnalysis, getMarketAnalysis } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner'; // Kijavítva
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon'; // Kijavítva
import { UserIcon } from '../components/icons/UserIcon'; // Kijavítva
import { LogoIcon } from '../components/icons/LogoIcon'; // Kijavítva
import type { ChatMessage } from '../types';
import { BarChartIcon } from '../components/icons/BarChartIcon'; // Kijavítva
import { MentorIcon } from '../components/icons/MentorIcon'; // Kijavítva
import { SparklesIcon } from '../components/icons/SparklesIcon'; // Kijavítva
import { BullseyeIcon } from '../components/icons/BullseyeIcon'; // Kijavítva

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg mx-auto mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-card-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{children}</p>
    </div>
);


const ChatInterface: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const PREDEFINED_USER_MESSAGE = "Szia Mentor! Érdekelne, hogyan tudnék egy új, fenntartható termékkel belépni a magyar piacra. Milyen első lépéseket javasolnál?";

        const initChat = async () => {
            try {
                setError(null);
                setIsLoading(true);
                const chatSession = createMentorChatSession();
                setChat(chatSession);

                const userMessage: ChatMessage = { role: 'user', text: PREDEFINED_USER_MESSAGE };
                setMessages([userMessage, { role: 'model', text: '' }]);

                const responseStream = await chatSession.sendMessageStream({ message: userMessage.text });
                
                for await (const chunk of responseStream) {
                    setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage && lastMessage.role === 'model') {
                            const updatedMessage = { ...lastMessage, text: lastMessage.text + chunk.text };
                            return [...prev.slice(0, -1), updatedMessage];
                        }
                        return prev;
                    });
                }

            } catch (e: any) {
                setError("Hiba történt a mentorral való kapcsolatfelvétel során. Kérjük, frissítse az oldalt.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        initChat();
    }, []);

    const handleRunAnalysis = async () => {
        if (isLoading || isAnalyzing || !chat) return;

        setIsAnalyzing(true);
        setError(null);

        const analysisPlaceholder: ChatMessage = { role: 'model', text: 'Rendben, nézzük is meg a piacot... Elemzés készítése az eddigi beszélgetés alapján.' };
        setMessages(prev => [...prev, analysisPlaceholder]);

        try {
            const { productDescription, industry, geographicalFocus } = await summarizeChatForAnalysis(messages);

            const result = await getMarketAnalysis({
                type: 'product',
                description: productDescription,
                industry,
                geo: geographicalFocus
            });

            const analysisPrompt = `[PIACKUTATÁS EREDMÉNYE]: ${JSON.stringify(result)}`;
            const responseStream = await chat.sendMessageStream({ message: analysisPrompt });

            let firstChunk = true;
            for await (const chunk of responseStream) {
                if (firstChunk) {
                    setMessages(prev => {
                        const updatedMessages = [...prev.slice(0, -1)];
                        updatedMessages.push({ role: 'model', text: chunk.text });
                        return updatedMessages;
                    });
                    firstChunk = false;
                } else {
                    setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage.role === 'model') {
                            const updatedMessage = { ...lastMessage, text: lastMessage.text + chunk.text };
                            return [...prev.slice(0, -1), updatedMessage];
                        }
                        return prev;
                    });
                }
            }
        } catch (e: any) {
            const errorMessage = "Hoppá, hiba történt a piackutatás során. Kérjük, próbálja meg később, vagy egyértelműsítse az ötletét.";
            setError(errorMessage);
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.text !== analysisPlaceholder.text);
                return [...filtered, { role: 'model', text: errorMessage }];
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading || isAnalyzing) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseStream = await chat.sendMessageStream({ message: userMessage.text });

            for await (const chunk of responseStream) {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.role === 'model') {
                        const updatedMessage = { ...lastMessage, text: lastMessage.text + chunk.text };
                        return [...prev.slice(0, -1), updatedMessage];
                    }
                    return prev;
                });
            }
        } catch (e: any) {
            setError("Hiba történt a válasz küldésekor. Kérjük, próbálja újra.");
            setMessages(prev => prev.slice(0, -2));
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (msg: ChatMessage, index: number) => {
        const isUser = msg.role === 'user';
        return (
            <div key={index} className={`flex items-start gap-3 my-4 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`} style={{ animationDuration: '0.3s' }}>
                {!isUser && (
                    <div className="w-8 h-8 flex-shrink-0 p-1 bg-muted/50 border border-border rounded-full shadow-sm">
                        <LogoIcon />
                    </div>
                )}
                <div className={`max-w-xl p-3 rounded-xl shadow-sm ${isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted/50 text-foreground rounded-bl-none'}`}>
                    <div className="prose prose-sm max-w-none prose-p:my-0 prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    {isLoading && index === messages.length - 1 && msg.role === 'model' && (
                        <div className="flex items-center gap-1.5 mt-2 opacity-70">
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    )}
                </div>
                {isUser && (
                    <div className="w-8 h-8 flex-shrink-0 bg-muted/50 border border-border rounded-full flex items-center justify-center shadow-sm">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">Ötlet Mentor</h1>
                <p className="text-muted-foreground mt-1">Beszélgessen az AI mentorral, aki segít kidolgozni és finomítani az ötletét.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col flex-grow h-0">
                <div ref={chatContainerRef} className="flex-grow p-4 md:p-6 overflow-y-auto">
                    {messages.map(renderMessage)}
                    {isLoading && messages.length === 0 && <LoadingSpinner message="Kapcsolódás a mentorhoz..." />}
                    {error && <p className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{error}</p>}
                </div>
                <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={isAnalyzing ? "Elemzés folyamatban..." : "Írjon egy üzenetet..."}
                            disabled={isLoading || isAnalyzing}
                            aria-label="Üzenet küldése a mentornak"
                            className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={handleRunAnalysis}
                            disabled={isLoading || isAnalyzing || messages.length < 2}
                            aria-label="Piackutatás készítése az ötletre"
                            title="Piackutatás készítése az ötletre"
                            className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-muted/80 hover:bg-muted disabled:bg-muted text-foreground disabled:text-muted-foreground rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary"
                        >
                            {isAnalyzing ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <BarChartIcon className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isAnalyzing || !userInput.trim()}
                            aria-label="Üzenet elküldése"
                            className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const IdeaMentorView: React.FC = () => {
    const [isChatActive, setIsChatActive] = useState(false);

    if (!isChatActive) {
        return (
            <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center animate-fade-in-up">
                <div className="text-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-primary/10 text-primary rounded-2xl mx-auto mb-6">
                        <MentorIcon className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Ötletből Valóság</h1>
                    <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                        Beszélgessen az AI mentorral, aki segít kidolgozni és finomítani az ötletét, amíg az piacképes koncepcióvá nem érik.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                    <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Ötletfinomítás">
                        Tegyen fel kérdéseket, hogy az AI segítsen kristálytisztává tenni a koncepcióját és az értékajánlatát.
                    </FeatureCard>
                    <FeatureCard icon={<BullseyeIcon className="w-6 h-6" />} title="Célpiac Meghatározás">
                        A mentor segít azonosítani és megérteni az ideális vásárlói célcsoportját.
                    </FeatureCard>
                    <FeatureCard icon={<BarChartIcon className="w-6 h-6" />} title="Piackutatás Egy Kattintásra">
                        Ha készen áll, a mentor összefoglalja az ötletét, és egy kattintással indíthat egy teljes piackutatást.
                    </FeatureCard>
                </div>
                
                <div className="text-center">
                    <button 
                        onClick={() => setIsChatActive(true)}
                        className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                    >
                        Beszélgetés indítása a Mentorral
                    </button>
                </div>
            </div>
        );
    }

    return <ChatInterface />;
};