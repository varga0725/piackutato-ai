import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
import { FinancialPoint } from '../types';
import { Theme } from '../App';

interface FinancialChartProps {
    title: string;
    data: FinancialPoint[];
    barColor: string;
    theme: Theme;
}

const parseCost = (cost: string): number => {
    if (!cost) return 0;
    const num = parseInt(cost.replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
};

const formatCostForLabel = (cost: string): string => {
    const num = parseInt(cost.replace(/\D/g, ''), 10);
    if (isNaN(num)) return cost;
    const formatter = new Intl.NumberFormat('hu-HU', { notation: 'compact', compactDisplay: 'short' });
    const currency = cost.includes('HUF') ? ' Ft' : '';
    const perMonth = cost.includes('/hó') ? '/hó' : '';
    return `${formatter.format(num)}${currency}${perMonth}`;
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
    if (active && payload && payload.length) {
        const originalCost = payload[0].payload.cost;
        const formattedCost = new Intl.NumberFormat('hu-HU').format(payload[0].value);
        const currency = originalCost.includes('HUF') ? ' HUF' : '';
        const perMonth = originalCost.includes('/hó') ? '/hó' : '';

        return (
            <div className="bg-card/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg max-w-xs">
                <p className="text-foreground font-bold">{label}</p>
                <p className="text-primary">{`Összeg: ${formattedCost}${currency}${perMonth}`}</p>
            </div>
        );
    }
    return null;
};

const CustomizedLabel = (props: any) => {
    const { x, y, width, height, theme, payload } = props;
    const formattedValue = formatCostForLabel(payload.cost);
    const labelX = x + width + 8;
    const labelY = y + height / 2;

    return (
        <text x={labelX} y={labelY} fill={theme === 'dark' ? '#e2e8f0' : '#334155'} fontSize={13} fontWeight="500" textAnchor="start" dominantBaseline="middle">
            {formattedValue}
        </text>
    );
};


export const FinancialChart: React.FC<FinancialChartProps> = ({ title, data, barColor, theme }) => {
    if (!data || data.length === 0) {
        return (
            <div>
                 <h5 className="font-semibold text-muted-foreground text-sm">{title}</h5>
                 <p className="text-sm text-muted-foreground italic mt-2">Nincs adat.</p>
            </div>
        )
    }

    const chartData = data.map(point => ({ ...point, value: parseCost(point.cost) }));
    const barHeight = 24;
    const chartHeight = (chartData.length * (barHeight + 20)) + 30;
    const gradientId = `color-${title.replace(/\s+/g, '-').toLowerCase()}`;


    return (
        <div>
            <h5 className="font-semibold text-muted-foreground text-sm mb-3">{title}</h5>
            <div style={{ width: '100%', height: `${chartHeight}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={barColor} stopOpacity={0.9}/>
                                <stop offset="100%" stopColor={barColor} stopOpacity={0.5}/>
                            </linearGradient>
                        </defs>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="item"
                            stroke={theme === 'dark' ? 'hsl(var(--muted-foreground))' : '#64748b'}
                            fontSize={13}
                            width={120}
                            tickLine={false}
                            axisLine={false}
                            tick={{ textAnchor: 'start' }}
                            interval={0}
                            tickFormatter={(value) => value.length > 18 ? `${value.substring(0, 16)}...` : value}
                        />
                        <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ fill: theme === 'dark' ? 'hsl(var(--muted)/0.3)' : 'hsl(var(--muted)/0.3)' }}/>
                        <Bar 
                            dataKey="value" 
                            barSize={barHeight} 
                            radius={[4, 4, 4, 4]} 
                            fill={`url(#${gradientId})`}
                            isAnimationActive={true}
                            animationDuration={800}
                        >
                           <LabelList dataKey="cost" content={<CustomizedLabel theme={theme} />} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};