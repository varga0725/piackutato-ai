import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { SWOTAnalysis, ImpactLevel } from '../types';
import type { Theme } from '../App';

interface SWOTVisualizerProps {
    swot: SWOTAnalysis;
    theme: Theme;
}

const quadrantNames = {
    strengths: 'Erősségek',
    weaknesses: 'Gyengeségek',
    opportunities: 'Lehetőségek',
    threats: 'Veszélyek',
};

const impactColors: Record<ImpactLevel, { light: string; dark: string }> = {
    HIGH: { light: '#ef4444', dark: '#f87171' }, // red-500, red-400
    MEDIUM: { light: '#f59e0b', dark: '#fbbf24' }, // amber-500, amber-400
    LOW: { light: '#3b82f6', dark: '#60a5fa' }, // blue-500, blue-400
};

export const SWOTVisualizer: React.FC<SWOTVisualizerProps> = ({ swot, theme }) => {
    
    const data = Object.keys(quadrantNames).map(key => {
        const quadrantKey = key as keyof SWOTAnalysis;
        const counts = {
            name: quadrantNames[quadrantKey],
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        };
        swot[quadrantKey].forEach(point => {
            counts[point.impact]++;
        });
        return counts;
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg">
                    <p className="font-bold mb-2 text-foreground">{label}</p>
                    {payload.slice().reverse().map((entry: any) => (
                         <p key={entry.name} style={{ color: entry.color }}>
                            {`${entry.name === 'HIGH' ? 'Nagy' : entry.name === 'MEDIUM' ? 'Közepes' : 'Alacsony'} hatás: `}
                            <span className="font-semibold">{entry.value} db</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    const legendFormatter = (value: string) => {
        if (value === 'HIGH') return 'Nagy';
        if (value === 'MEDIUM') return 'Közepes';
        if (value === 'LOW') return 'Alacsony';
        return value;
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "hsl(var(--border))" : "#e2e8f0"} />
                    <XAxis type="number" allowDecimals={false} stroke={theme === 'dark' ? "hsl(var(--muted-foreground))" : "#64748b"} />
                    <YAxis 
                        type="category" 
                        dataKey="name"
                        width={80}
                        tick={{ fill: theme === 'dark' ? 'hsl(var(--foreground))' : '#475569', fontSize: 13 }}
                        stroke={theme === 'dark' ? "hsl(var(--muted-foreground))" : "#64748b"}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'hsl(var(--muted)/0.3)' : 'hsl(var(--muted)/0.3)' }} />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="LOW" stackId="a" fill={impactColors.LOW[theme]} />
                    <Bar dataKey="MEDIUM" stackId="a" fill={impactColors.MEDIUM[theme]} />
                    <Bar dataKey="HIGH" stackId="a" fill={impactColors.HIGH[theme]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};