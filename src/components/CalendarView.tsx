import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { MarketingStrategy, CalendarEntry } from '../../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { BlogIcon } from './icons/BlogIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface CalendarViewProps {
    marketingStrategy: MarketingStrategy | null;
}

const dayMap = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];

const getDayName = (date: Date): typeof dayMap[number] => {
    return dayMap[date.getDay()];
};

const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
};

const getEventsForDate = (date: Date, calendar: CalendarEntry[]): CalendarEntry[] => {
    const dayName = getDayName(date);
    const isWd = isWeekday(date);

    const events = calendar.filter(entry => {
        if (entry.day === 'Naponta') return true;
        if (entry.day === 'Hétköznap' && isWd) return true;
        if (entry.day === 'Hétvégén' && !isWd) return true;
        if (entry.day === dayName) return true;
        return false;
    });

    return events.sort((a, b) => a.time.localeCompare(b.time));
};

const PlatformIcon: React.FC<{ platform: string, className?: string }> = ({ platform, className = "w-4 h-4" }) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('facebook')) return <FacebookIcon className={className} />;
    if (lowerPlatform.includes('instagram')) return <InstagramIcon className={className} />;
    if (lowerPlatform.includes('google')) return <GoogleIcon className={className} />;
    if (lowerPlatform.includes('blog')) return <BlogIcon className={className} />;
    return <MegaphoneIcon className={className} />;
};

const platformStyles: Record<string, { bg: string, text: string, border: string, bar: string }> = {
    facebook: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30', bar: 'bg-blue-500' },
    instagram: { bg: 'bg-pink-500/20', text: 'text-pink-500', border: 'border-pink-500/30', bar: 'bg-pink-500' },
    google: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30', bar: 'bg-amber-500' },
    blog: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/30', bar: 'bg-emerald-500' },
    default: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', bar: 'bg-muted-foreground' },
};

const getPlatformStyles = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('facebook')) return platformStyles.facebook;
    if (lowerPlatform.includes('instagram')) return platformStyles.instagram;
    if (lowerPlatform.includes('google')) return platformStyles.google;
    if (lowerPlatform.includes('blog')) return platformStyles.blog;
    return platformStyles.default;
};

const EventTooltip: React.FC<{ content: CalendarEntry, position: { x: number, y: number } }> = ({ content, position }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        opacity: 0,
        transform: 'scale(0.95)',
        transition: 'opacity 200ms ease-out, transform 200ms ease-out',
    });
    
    const platformStyle = getPlatformStyles(content.platform);

    useEffect(() => {
        if (tooltipRef.current) {
            const { innerWidth, innerHeight } = window;
            const { clientWidth, clientHeight } = tooltipRef.current;
            
            let top = position.y + 20;
            let left = position.x + 20;

            if (left + clientWidth > innerWidth - 16) {
                left = position.x - clientWidth - 20;
            }
            if (top + clientHeight > innerHeight - 16) {
                top = position.y - clientHeight - 20;
            }
            
            setStyle({
                ...style,
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
                transform: 'scale(1)',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position.x, position.y]);


    return (
        <div 
            ref={tooltipRef} 
            style={style}
            className="z-50 w-64 max-w-sm rounded-lg bg-card border border-border shadow-2xl"
            role="tooltip"
        >
            <div className={`h-1.5 w-full rounded-t-lg ${platformStyle.bar}`}></div>
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <PlatformIcon platform={content.platform} className={`w-5 h-5 ${platformStyle.text}`} />
                    <div>
                        <p className="font-bold text-foreground">{content.platform}</p>
                        <p className="text-xs text-muted-foreground font-mono">{content.time}</p>
                    </div>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{content.activity}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{content.notes}</p>
            </div>
        </div>
    );
};


export const CalendarView: React.FC<CalendarViewProps> = ({ marketingStrategy }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        content: CalendarEntry | null;
        x: number;
        y: number;
    }>({ visible: false, content: null, x: 0, y: 0 });

    const handleEventMouseEnter = (e: React.MouseEvent, entry: CalendarEntry) => {
        setTooltip({ visible: true, content: entry, x: e.clientX, y: e.clientY });
    };
    
    const handleEventMouseMove = (e: React.MouseEvent) => {
        if (tooltip.visible) {
            setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
        }
    };

    const handleEventMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const grid = [];
        const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday is 0

        // Add padding for days before the start of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            grid.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            grid.push(new Date(year, month, day));
        }

        return grid;
    }, [currentDate]);
    
    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    if (!marketingStrategy) {
        return (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-card border border-border text-center p-8 animate-fade-in-up">
                <div className="w-16 h-16 p-2 mb-6 bg-background rounded-2xl border border-border flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">Marketing Naptár</h2>
                <p className="mt-2 text-muted-foreground max-w-md">
                    Először generáljon egy marketing stratégiát a "Marketing Stratégia" vagy a "Piackutatás" oldalon. A naptár ezután automatikusan feltöltődik a javasolt teendőkkel.
                </p>
            </div>
        );
    }
    
    const calendarEvents = marketingStrategy.marketingCalendar;

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <header className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h1 className="text-2xl font-bold text-foreground">
                    {currentDate.toLocaleString('hu-HU', { month: 'long', year: 'numeric' })}
                </h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 rounded-md hover:bg-muted transition-colors">
                        <ChevronDownIcon className="w-5 h-5 transform rotate-90" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="text-sm font-semibold px-4 py-2 rounded-md hover:bg-muted transition-colors">Ma</button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 rounded-md hover:bg-muted transition-colors">
                        <ChevronDownIcon className="w-5 h-5 transform -rotate-90" />
                    </button>
                </div>
            </header>
            <div className="grid grid-cols-7 text-center font-semibold text-muted-foreground text-sm py-2">
                {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-2">
                {calendarGrid.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`} className="bg-background rounded-lg" />;
                    
                    const events = getEventsForDate(date, calendarEvents);
                    const isToday = isSameDay(date, today);

                    return (
                        <div key={date.toISOString()} className="bg-card border border-border rounded-lg p-2 flex flex-col overflow-hidden">
                            <time dateTime={date.toISOString()} className={`flex items-center justify-center text-sm font-semibold w-6 h-6 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                {date.getDate()}
                            </time>
                            <div className="mt-2 space-y-1 overflow-y-auto text-xs pr-1 -mr-2">
                                {events.map((event, eventIndex) => {
                                    const platformStyle = getPlatformStyles(event.platform);
                                    return (
                                        <div 
                                            key={eventIndex} 
                                            onMouseEnter={(e) => handleEventMouseEnter(e, event)}
                                            onMouseMove={handleEventMouseMove}
                                            onMouseLeave={handleEventMouseLeave}
                                            className={`p-1.5 rounded-md flex items-start gap-1.5 border cursor-pointer ${platformStyle.bg} ${platformStyle.text} ${platformStyle.border}`}
                                        >
                                            <div className="flex-shrink-0 mt-px"><PlatformIcon platform={event.platform} /></div>
                                            <div className="min-w-0">
                                                <p className="font-semibold truncate">{event.activity}</p>
                                                <p className="opacity-80">{event.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {tooltip.visible && tooltip.content && <EventTooltip content={tooltip.content} position={{ x: tooltip.x, y: tooltip.y }} />}
        </div>
    );
};