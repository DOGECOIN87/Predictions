import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Play, Clock, Trophy, Ban, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Round, RoundStatus, Direction } from '../types';
import { Button } from './Button';

interface RoundCardProps {
  round: Round;
  currentPrice: number;
  onBet?: (direction: Direction, amount: number) => void;
}

export const RoundCard: React.FC<RoundCardProps> = ({ round, currentPrice, onBet }) => {
  const [betAmount, setBetAmount] = useState<string>('0.1');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (targetTime: number) => {
    const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  
  // Calculations
  const totalPrize = round.totalPool;
  const upPayout = round.upPool > 0 ? (round.totalPool / round.upPool) * 0.95 : 1.5; 
  const downPayout = round.downPool > 0 ? (round.totalPool / round.downPool) * 0.95 : 1.5;
  const priceDiff = round.lockPrice ? currentPrice - round.lockPrice : 0;
  
  // Status Config
  const isLive = round.status === RoundStatus.LIVE;
  const isExpired = round.status === RoundStatus.EXPIRED;
  const isOpen = round.status === RoundStatus.OPEN;
  const isNext = round.status === RoundStatus.NEXT;

  // Determine Colors & Icons
  let headerColor = "bg-trash-surfaceHighlight";
  let statusColor = "text-trash-textDim";
  let statusIcon = <Clock size={14} />;
  let statusText = isNext ? `LATER • ${formatTime(round.startTime)}` : "LATER";
  let borderColor = "border-trash-border";
  let glowClass = "";

  if (isLive) {
    headerColor = "bg-trash-surfaceHighlight"; // Keep header subtle, make border pop
    statusColor = "text-trash-yellow";
    statusIcon = <Play size={14} fill="currentColor" />;
    statusText = `LIVE NOW • ${formatTime(round.closeTime)}`;
    borderColor = "border-trash-yellow";
    glowClass = "shadow-glow hover:shadow-glow-strong";
  } else if (isOpen) {
    statusColor = "text-white";
    statusIcon = <Play size={14} />;
    statusText = `OPEN • ${formatTime(round.lockTime)}`;
    borderColor = "border-trash-border hover:border-trash-yellow/50";
  } else if (isExpired) {
    statusColor = "text-trash-textDim";
    statusIcon = <Ban size={14} />;
    statusText = "ENDED";
    headerColor = "bg-trash-surface";
  }

  const handleBet = (direction: Direction) => {
    if (onBet && parseFloat(betAmount) > 0) {
      onBet(direction, parseFloat(betAmount));
    }
  };

  // Progress Bar Calculation
  const progressPercent = isLive 
    ? Math.max(0, Math.min(100, ((now - round.lockTime) / (round.closeTime - round.lockTime)) * 100))
    : isOpen 
        ? Math.max(0, Math.min(100, ((now - round.startTime) / (round.lockTime - round.startTime)) * 100))
        : 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isExpired ? 0.6 : 1,
        y: 0,
        scale: isLive ? [1, 1.02, 1] : 1,
        filter: isExpired ? 'grayscale(100%)' : 'grayscale(0%)'
      }}
      transition={{ 
        duration: 0.4,
        scale: { duration: 0.5, ease: "easeInOut" }
      }}
      className={`
      group flex-shrink-0 w-[340px] bg-trash-surface border ${borderColor} rounded-2xl flex flex-col overflow-hidden relative transition-all duration-300 transform
      ${glowClass}
      ${!isExpired ? 'hover:-translate-y-2 hover:border-trash-yellow' : 'hover:grayscale-0 hover:opacity-100'}
    `}>
      
      {/* Header Bar */}
      <div className={`px-4 py-3 flex justify-between items-center ${headerColor} border-b border-trash-border/50`}>
        <div className={`flex items-center gap-2 text-xs font-bold tracking-wider ${statusColor}`}>
          {isLive ? (
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {statusIcon}
            </motion.div>
          ) : (
            statusIcon
          )}
          {statusText}
        </div>
        <div className="text-xs font-mono font-bold text-trash-textDim">#{round.id}</div>
      </div>

      {/* Live Progress Indicator */}
      {(isLive || isOpen) && (
        <div className="w-full bg-trash-border h-1 relative overflow-hidden">
          <motion.div 
            className={`h-full absolute top-0 left-0 ${isLive ? 'bg-trash-yellow' : 'bg-trash-textDim'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 h-full relative">
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-4">
          
          {/* UP Block */}
          <div className={`relative p-3 rounded-lg border transition-all duration-300
            ${round.winner === Direction.UP ? 'bg-trash-yellow/20 border-trash-yellow' : 'bg-trash-surfaceHighlight border-transparent group-hover:border-trash-border'}
            ${isLive && priceDiff > 0 ? 'bg-trash-yellow/10 border-trash-yellow/50' : ''}
          `}>
             <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold uppercase ${round.winner === Direction.UP ? 'text-trash-yellow' : 'text-trash-textDim'}`}>Up</span>
                <span className="flex items-center gap-1 text-sm font-bold text-trash-yellow">
                    <ArrowUp size={14} />
                    {upPayout.toFixed(2)}x
                </span>
             </div>
             {/* If Ended and Won */}
             {round.winner === Direction.UP && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Trophy className="text-trash-yellow w-12 h-12 opacity-20 rotate-12" />
                </div>
             )}
          </div>

          {/* Central Price Display (Absolute centered in the gap) */}
          <div className="py-2 flex flex-col items-center justify-center relative">
             {isLive ? (
                <>
                  <div className={`text-2xl font-mono font-bold tracking-tight mb-1 ${priceDiff >= 0 ? 'text-trash-yellow' : 'text-trash-red'}`}>
                     ${(round.lockPrice! + priceDiff).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                     <span className="text-trash-textDim">Locked:</span>
                     <span className="text-white">${round.lockPrice?.toFixed(2)}</span>
                  </div>
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-bold ${priceDiff >= 0 ? 'bg-trash-yellow text-black' : 'bg-trash-red text-white'}`}>
                     {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(2)}
                  </div>
                </>
             ) : isOpen ? (
                <div className="flex flex-col items-center">
                    <span className="text-xs text-trash-textDim uppercase tracking-widest mb-1">Prize Pool</span>
                    <span className="text-2xl font-mono font-bold text-white">{totalPrize.toLocaleString()} <span className="text-trash-yellow text-base">TRASH</span></span>
                </div>
             ) : (
                <>
                   <div className="text-xl font-mono font-bold text-white">
                      ${round.closePrice?.toFixed(2)}
                   </div>
                   <div className="text-xs text-trash-textDim">Closed Price</div>
                </>
             )}
          </div>

          {/* DOWN Block */}
          <div className={`relative p-3 rounded-lg border transition-all duration-300
             ${round.winner === Direction.DOWN ? 'bg-trash-red/20 border-trash-red' : 'bg-trash-surfaceHighlight border-transparent group-hover:border-trash-border'}
             ${isLive && priceDiff < 0 ? 'bg-trash-red/10 border-trash-red/50' : ''}
          `}>
             <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold uppercase ${round.winner === Direction.DOWN ? 'text-trash-red' : 'text-trash-textDim'}`}>Down</span>
                <span className="flex items-center gap-1 text-sm font-bold text-trash-red">
                    <ArrowDown size={14} />
                    {downPayout.toFixed(2)}x
                </span>
             </div>
             {/* If Ended and Won */}
             {round.winner === Direction.DOWN && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Trophy className="text-trash-red w-12 h-12 opacity-20 rotate-12" />
                </div>
             )}
          </div>

        </div>

        {/* Action Footer */}
        <div className="mt-6">
           {isOpen ? (
             <div className="space-y-3">
               <div className="flex items-center bg-trash-black border border-trash-border rounded-lg px-3 py-2 focus-within:border-trash-yellow transition-colors">
                  <span className="text-trash-textDim text-sm font-bold">WAGER</span>
                  <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-transparent flex-1 text-right text-white font-mono font-bold outline-none"
                  />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="primary" onClick={() => handleBet(Direction.UP)} className="clip-diagonal">
                     Enter UP
                  </Button>
                  <Button variant="danger" onClick={() => handleBet(Direction.DOWN)} className="clip-diagonal">
                     Enter DOWN
                  </Button>
               </div>
             </div>
           ) : isNext ? (
              <div className="text-center text-trash-textDim text-sm font-bold py-2">
                 Opens shortly
              </div>
           ) : isLive ? (
              <div className="text-center py-2">
                 <span className="text-xs font-bold text-trash-textDim uppercase tracking-widest border border-trash-border px-3 py-1 rounded-full">
                    No more bets
                 </span>
              </div>
           ) : (
              <div className="text-center py-2">
                  <span className="text-xs font-bold text-trash-textDim flex items-center justify-center gap-2">
                     <CheckCircle2 size={14}/> Settled
                  </span>
              </div>
           )}
        </div>

      </div>
    </motion.div>
  );
};