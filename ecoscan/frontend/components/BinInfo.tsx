
import React from 'react';
import { BIN_RULES } from '../constants';
import { BinColor } from '../types';
import { XCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const BinInfo: React.FC = () => {
  return (
    <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
      <div className="grid gap-6">
        {Object.values(BIN_RULES).filter(b => b.color !== BinColor.UNKNOWN).map((bin) => (
          <div 
            key={bin.color}
            className={`p-6 rounded-[2.5rem] border-2 ${bin.borderColor} ${bin.bgColor} ${bin.textColor} shadow-xl relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{bin.label}</h3>
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{bin.description}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
                  <Info size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Examples
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bin.examples.map((item, idx) => (
                      <span key={idx} className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Prohibited
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bin.prohibited.map((item, idx) => (
                      <span key={idx} className="text-xs font-bold bg-black/10 px-3 py-1.5 rounded-xl border border-black/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Info size={120} strokeWidth={1} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinInfo;
