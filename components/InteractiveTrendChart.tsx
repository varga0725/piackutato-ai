import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { MarketTrend } from '../types';
import type { Theme } from '../App';

interface InteractiveTrendChartProps {
    trend: MarketTrend;
    theme: Theme;
}

const CustomTooltipContent: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg text-sm">
                <p className="font-bold mb-1 text-foreground">{`Hónap: ${label}`}</p>
                <p className="text-primary">{`Piaci érdeklődés: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


export const InteractiveTrendChart: React.FC<InteractiveTrendChartProps> = ({ trend, theme }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend.dataPoints} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis 
                    dataKey="month" 
                    stroke={theme === 'dark' ? "hsl(var(--muted-foreground))" : "#64748b"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke={theme === 'dark' ? "hsl(var(--muted-foreground))" : "#64748b"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    content={<CustomTooltipContent />} 
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
        </ResponsiveContainer>
    );
};