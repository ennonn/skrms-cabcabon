import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface TreemapChartProps {
    data: Array<{ name: string; value: number }>;
    title: string;
    description: string;
    height?: number;
}

export function TreemapChart({ data, title, description, height = 400 }: TreemapChartProps) {
    return (
        <div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div style={{ width: '100%', height: `${height}px` }}>
                <ResponsiveContainer>
                    <Treemap
                        data={data}
                        dataKey="value"
                        aspectRatio={4/3}
                        stroke="#fff"
                        fill="#4F46E5"
                    >
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 shadow rounded border">
                                            <p className="font-medium">{data.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(data.value)}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
    );
} 