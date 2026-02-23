import React from 'react';
import { Trophy, History, HelpCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-16 border-r border-trash-border bg-trash-surface items-center py-6 gap-6 sticky top-16 h-[calc(100vh-64px)]">
       <button className="p-3 rounded-xl hover:bg-trash-surfaceHighlight text-trash-green transition-colors group relative">
          <Trophy />
          <div className="absolute left-14 bg-black border border-trash-green text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Leaderboard
          </div>
       </button>
       
       <button className="p-3 rounded-xl hover:bg-trash-surfaceHighlight text-gray-400 hover:text-white transition-colors group relative">
          <History />
          <div className="absolute left-14 bg-black border border-gray-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            History
          </div>
       </button>
       
       <div className="mt-auto">
         <button className="p-3 rounded-xl hover:bg-trash-surfaceHighlight text-gray-400 hover:text-white transition-colors">
            <HelpCircle />
         </button>
       </div>
    </div>
  );
};