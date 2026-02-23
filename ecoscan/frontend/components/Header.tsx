
import React from 'react';
import { Leaf, Info, Smartphone } from 'lucide-react';

interface HeaderProps {
  onShowInfo: () => void;
  onShowInstall: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowInfo, onShowInstall }) => {
  // Check if already running as standalone PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 safe-top">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-100 p-2 rounded-xl">
          <Leaf className="text-emerald-600" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none">EcoScan</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Smart Waste Sorter</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {!isStandalone && (
          <button 
            onClick={onShowInstall}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-emerald-600 flex items-center gap-1"
            title="Install App"
          >
            <Smartphone size={20} />
            <span className="text-xs font-bold hidden sm:inline">Install</span>
          </button>
        )}
        <button 
          onClick={onShowInfo}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          aria-label="Sorting Guide"
        >
          <Info size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
