import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PricePoint } from '../types';
import { COLORS } from '../constants';

interface PriceChartProps {
  data: PricePoint[];
  currentPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, currentPrice }) => {
  const minPrice = Math.min(...data.map(d => d.price)) - 10;
  const maxPrice = Math.max(...data.map(d => d.price)) + 10;
  
  const isUp = data.length > 1 && data[data.length - 1].price >= data[data.length - 2].price;
  // Use new constants
  const color = isUp ? COLORS.yellow : COLORS.red;

  return (
    <div className="w-full h-full bg-trash-surface border border-trash-border relative overflow-hidden group">
      
      {/* Chart Overlay Header */}
      <div className="absolute top-6 left-6 z-10 flex flex-col pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isUp ? 'bg-trash-yellow shadow-[0_0_10px_#DEFF00]' : 'bg-trash-red shadow-[0_0_10px_#FF3B3B]'}`} />
            <span className="text-trash-textDim text-xs font-bold uppercase tracking-widest">BTC/USD Oracle</span>
        </div>
        <span className={`text-5xl font-mono font-bold tracking-tighter ${isUp ? 'text-trash-yellow' : 'text-trash-red'}`}>
          ${currentPrice.toFixed(2)}
        </span>
        <span className="text-xs text-trash-textDim mt-2 font-mono">Updated: {new Date().toLocaleTimeString()}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            hide 
            type="number" 
            domain={['dataMin', 'dataMax']} 
          />
          <YAxis 
            hide 
            domain={[minPrice, maxPrice]} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#050505', border: `1px solid ${color}`, borderRadius: '4px' }}
            itemStyle={{ color: color, fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#666', fontSize: '10px', marginBottom: '4px' }}
            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <ReferenceLine y={data[0]?.price} stroke="#262626" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};