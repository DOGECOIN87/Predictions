import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PriceChart } from './components/PriceChart';
import { RoundCard } from './components/RoundCard';
import { Sidebar } from './components/Sidebar';
import { getLatestPrice, getPriceHistory, addPricePoint } from './services/mockPrice';
import { Round, RoundStatus, Direction, PricePoint } from './types';
import { ROUND_DURATION_SECONDS } from './constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const INITIAL_ROUNDS: Round[] = [
  {
    id: 1001,
    status: RoundStatus.EXPIRED,
    startTime: Date.now() - ROUND_DURATION_SECONDS * 2000,
    lockTime: Date.now() - ROUND_DURATION_SECONDS * 1000,
    closeTime: Date.now(),
    lockPrice: 67650.00,
    closePrice: 67700.00,
    totalPool: 500,
    upPool: 300,
    downPool: 200,
    winner: Direction.UP
  },
  {
    id: 1002,
    status: RoundStatus.LIVE,
    startTime: Date.now() - ROUND_DURATION_SECONDS * 1000,
    lockTime: Date.now(),
    closeTime: Date.now() + ROUND_DURATION_SECONDS * 1000,
    lockPrice: 67728.02,
    closePrice: null,
    totalPool: 1250.50,
    upPool: 600,
    downPool: 650.50
  },
  {
    id: 1003,
    status: RoundStatus.OPEN,
    startTime: Date.now(),
    lockTime: Date.now() + ROUND_DURATION_SECONDS * 1000,
    closeTime: Date.now() + ROUND_DURATION_SECONDS * 2000,
    lockPrice: null,
    closePrice: null,
    totalPool: 150.00,
    upPool: 50,
    downPool: 100
  },
  {
    id: 1004,
    status: RoundStatus.NEXT,
    startTime: Date.now() + ROUND_DURATION_SECONDS * 1000,
    lockTime: Date.now() + ROUND_DURATION_SECONDS * 2000,
    closeTime: Date.now() + ROUND_DURATION_SECONDS * 3000,
    lockPrice: null,
    closePrice: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0
  },
  {
    id: 1005,
    status: RoundStatus.NEXT,
    startTime: Date.now() + ROUND_DURATION_SECONDS * 2000,
    lockTime: Date.now() + ROUND_DURATION_SECONDS * 3000,
    closeTime: Date.now() + ROUND_DURATION_SECONDS * 4000,
    lockPrice: null,
    closePrice: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0
  }
];

function App() {
  const [currentPrice, setCurrentPrice] = useState<number>(67728.02);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [rounds, setRounds] = useState<Round[]>(INITIAL_ROUNDS);
  const [scrollIndex, setScrollIndex] = useState(1); // Start showing the Live card
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Price History
  useEffect(() => {
    setPriceHistory(getPriceHistory());
  }, []);

  // Price Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = getLatestPrice();
      const newPoint = addPricePoint(newPrice);
      setCurrentPrice(newPrice);
      setPriceHistory(prev => [...prev.slice(1), newPoint]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game Loop (Simulate round transitions)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setRounds(prevRounds => {
        return prevRounds.map(round => {
          // Transition LIVE -> EXPIRED
          if (round.status === RoundStatus.LIVE && now >= round.closeTime) {
            const closeP = currentPrice; // Capture current price as close price
            return {
              ...round,
              status: RoundStatus.EXPIRED,
              closePrice: closeP,
              winner: closeP > (round.lockPrice || 0) ? Direction.UP : Direction.DOWN
            };
          }
          // Transition OPEN -> LIVE
          if (round.status === RoundStatus.OPEN && now >= round.lockTime) {
            return {
              ...round,
              status: RoundStatus.LIVE,
              lockPrice: currentPrice // Capture lock price
            };
          }
          // Transition NEXT -> OPEN
          if (round.status === RoundStatus.NEXT && now >= round.startTime) {
            return {
              ...round,
              status: RoundStatus.OPEN
            };
          }
          return round;
        });
      });
      
      // Cleanup old rounds and add new ones (Simplified for demo: Just checking last round)
      setRounds(current => {
        const lastRound = current[current.length - 1];
        if (now > lastRound.startTime - (ROUND_DURATION_SECONDS * 2000)) { // If we are close to needing a new round
            // In a real app we would shift old ones out and push new ones in
            // For this demo, let's keep the array static-ish or it gets complex
            return current; 
        }
        return current;
      })

    }, 1000);
    return () => clearInterval(interval);
  }, [currentPrice]);


  const handleScroll = (direction: 'left' | 'right') => {
    if (cardsContainerRef.current) {
        const scrollAmount = 340; // Card width + gap
        cardsContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  const handleBet = (direction: Direction, amount: number) => {
    console.log(`Bet placed: ${direction} ${amount}`);
    // Ideally update local state to reflect pool change immediately
    setRounds(prev => prev.map(r => {
        if(r.status === RoundStatus.OPEN) {
            return {
                ...r,
                totalPool: r.totalPool + amount,
                upPool: direction === Direction.UP ? r.upPool + amount : r.upPool,
                downPool: direction === Direction.DOWN ? r.downPool + amount : r.downPool
            }
        }
        return r;
    }))
  };

  return (
    <div className="min-h-screen bg-trash-black text-trash-text flex flex-col font-mono selection:bg-trash-green selection:text-black">
      <Header currentPrice={currentPrice} />
      
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          
          {/* Top Section: Cards Carousel */}
          <div className="relative h-[420px] bg-trash-black flex items-center border-b border-trash-border">
             {/* Navigation Buttons */}
             <button 
                onClick={() => handleScroll('left')}
                className="absolute left-4 z-20 bg-trash-surface border border-trash-border p-2 rounded-full hover:border-trash-green text-trash-green transition-colors"
             >
                <ArrowLeft />
             </button>
             <button 
                onClick={() => handleScroll('right')}
                className="absolute right-4 z-20 bg-trash-surface border border-trash-border p-2 rounded-full hover:border-trash-green text-trash-green transition-colors"
             >
                <ArrowRight />
             </button>

             {/* Cards Container */}
             <div 
                ref={cardsContainerRef}
                className="flex items-center gap-6 px-[50vw] overflow-x-auto no-scrollbar scroll-smooth snap-x snap-center h-full pt-6 pb-6"
                style={{ scrollPaddingLeft: '50vw' }} // Center the active item somewhat
             >
                {/* Spacer to push first item to center initially */}
                <div className="w-[calc(50vw-160px)] flex-shrink-0" />
                
                {rounds.map((round) => (
                  <div key={round.id} className="snap-center transform transition-transform duration-300">
                    <RoundCard 
                        round={round} 
                        currentPrice={currentPrice} 
                        onBet={handleBet}
                    />
                  </div>
                ))}

                 <div className="w-[calc(50vw-160px)] flex-shrink-0" />
             </div>
          </div>

          {/* Bottom Section: Chart */}
          <div className="flex-1 min-h-[400px] bg-trash-surface p-6">
             <div className="w-full h-full rounded-xl border border-trash-border overflow-hidden shadow-2xl">
                 <PriceChart data={priceHistory} currentPrice={currentPrice} />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;