import React from 'react';
import { Trash2, Wallet, Menu, Activity, Zap } from 'lucide-react';
import { Button } from './Button';
import { APP_NAME } from '../constants';

interface HeaderProps {
  currentPrice: number;
}

export const Header: React.FC<HeaderProps> = ({ currentPrice }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-trash-border bg-trash-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 h-16">
        
        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-trash-yellow group cursor-pointer">
            <div className="relative">
                <Trash2 className="w-8 h-8 group-hover:-rotate-12 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-trash-red rounded-full animate-pulse" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter">
              {APP_NAME}<span className="text-trash-yellow">.FUN</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 ml-8 text-sm font-bold tracking-wide">
            <a href="#" className="text-trash-yellow border-b-2 border-trash-yellow pb-4 mt-4">Predictions</a>
            <a href="#" className="text-trash-textDim hover:text-white transition-colors pb-4 mt-4 hover:border-b-2 hover:border-trash-border">Garbage Pools</a>
            <a href="#" className="text-trash-textDim hover:text-white transition-colors pb-4 mt-4 hover:border-b-2 hover:border-trash-border">Farms</a>
            <a href="#" className="text-trash-textDim hover:text-white transition-colors pb-4 mt-4 hover:border-b-2 hover:border-trash-border">Leaderboard</a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <div className="flex items-center gap-2 text-xs font-bold text-trash-textDim uppercase tracking-wider">
               <Activity size={12} className="text-trash-yellow"/> BTC/USD
            </div>
            <div className={`text-sm font-mono font-bold ${currentPrice >= 0 ? 'text-white' : 'text-trash-red'}`}>
              ${currentPrice.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center bg-trash-surface border border-trash-border rounded p-1 gap-1">
             <div className="flex items-center gap-1 px-3 py-1 bg-trash-surfaceHighlight border border-trash-border rounded text-xs font-bold text-trash-yellow cursor-pointer hover:bg-trash-border transition-colors">
                <Zap size={10} fill="currentColor" />
                Live
             </div>
             <div className="px-3 py-1 text-xs font-bold text-trash-textDim hover:text-white cursor-pointer transition-colors">Testnet</div>
          </div>

          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Wallet size={16} />
            Connect
          </Button>
          
          <button className="md:hidden text-white">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
};