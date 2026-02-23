
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Trash2, Timer as TimerIcon, Zap } from 'lucide-react';
import Header from './components/Header';
import CameraScanner from './components/CameraScanner';
import BinInfo from './components/BinInfo';
import InstallGuide from './components/InstallGuide';
import Onboarding from './components/Onboarding';
import AnalysisOverlay from './components/AnalysisOverlay';
import { analyzeWaste } from './services/geminiService';
import { WasteAnalysis } from './types';
import { BIN_RULES } from './constants';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ecoscan_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('ecoscan_onboarding', 'true');
    setShowOnboarding(false);
  };

  const startTimer = () => {
    const start = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 10);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setFinalTime(elapsedTime);
      setElapsedTime(0);
    }
  };

  const handleCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    startTimer();
    
    const steps = ["Identifying item...", "Checking material...", "Matching bin rules...", "Finalizing..."];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      setAnalysisStep(steps[stepIdx % steps.length]);
      stepIdx++;
    }, 1200);

    try {
      const analysis = await analyzeWaste(base64);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      clearInterval(stepInterval);
      stopTimer();
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <Header 
        onShowInfo={() => setShowGuide(true)} 
        onShowInstall={() => setShowInstall(true)}
      />
      
      <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 relative">
          <CameraScanner onCapture={handleCapture} isAnalyzing={isAnalyzing} />
          
          <AnimatePresence>
            {isAnalyzing && (
              <AnalysisOverlay step={analysisStep} elapsedTime={elapsedTime} />
            )}
          </AnimatePresence>
        </div>

        {/* Result Sheet */}
        <AnimatePresence>
          {(result || error) && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 md:relative md:inset-auto md:w-[480px] md:h-full z-50 bg-white text-slate-900 rounded-t-[3.5rem] md:rounded-none shadow-[0_-20px_60px_rgba(0,0,0,0.5)] overflow-y-auto safe-bottom"
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-slate-100 z-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black tracking-tight">Scan Result</h2>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                    <TimerIcon size={12} />
                    {(finalTime / 1000).toFixed(2)}s
                  </div>
                </div>
                <button 
                  onClick={() => { setResult(null); setError(null); }}
                  className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {error ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                      <AlertCircle size={48} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Something went wrong</h3>
                      <p className="text-slate-500 mt-2 leading-relaxed">{error}</p>
                    </div>
                    <button 
                      onClick={() => { setResult(null); setError(null); }}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-transform"
                    >
                      Try Again
                    </button>
                  </div>
                ) : result && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl ${BIN_RULES[result.binColor].bgColor} ${BIN_RULES[result.binColor].textColor}`}>
                        <Trash2 size={48} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-black text-slate-900 leading-tight">{result.itemName}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence * 100}%` }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{Math.round(result.confidence * 100)}% Match</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-8 rounded-[3rem] border-2 ${BIN_RULES[result.binColor].borderColor} ${BIN_RULES[result.binColor].bgColor} ${BIN_RULES[result.binColor].textColor} shadow-2xl relative overflow-hidden`}>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Recommended Bin</p>
                        <h4 className="text-5xl font-black mb-4 tracking-tighter">{BIN_RULES[result.binColor].label}</h4>
                        <p className="text-xl font-bold leading-snug opacity-90">{result.reason}</p>
                      </div>
                      <div className="absolute -right-8 -bottom-8 opacity-10">
                        <Trash2 size={160} strokeWidth={1} />
                      </div>
                    </div>

                    {/* Game Element: Speed Badge */}
                    {finalTime < 5000 && (
                      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-yellow-400 p-2 rounded-xl text-white">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="font-black text-yellow-800 text-sm uppercase tracking-tight">Super Sonic Scan!</p>
                          <p className="text-xs text-yellow-700 font-medium">You analyzed this item in record time.</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Disposal Checklist</h5>
                      <div className="grid gap-4">
                        {result.disposalTips.map((tip, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex gap-5 items-start bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all"
                          >
                            <div className="mt-1 text-emerald-500 bg-emerald-50 p-2 rounded-xl group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={20} />
                            </div>
                            <p className="text-slate-700 font-bold text-base leading-relaxed">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => { setResult(null); setError(null); }}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-slate-200 active:scale-95 transition-transform"
                    >
                      Scan Next Item
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {(showGuide || showInstall) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
              onClick={() => { setShowGuide(false); setShowInstall(false); }}
            >
              <motion.div
                initial={{ y: '100%', scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: '100%', scale: 0.95 }}
                className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{showGuide ? 'Sorting Guide' : 'Install EcoScan'}</h2>
                    <p className="text-slate-400 text-sm font-medium">{showGuide ? 'Official bin rules' : 'Add to your home screen'}</p>
                  </div>
                  <button onClick={() => { setShowGuide(false); setShowInstall(false); }} className="p-3 bg-slate-100 rounded-full text-slate-500">
                    <X size={24} />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {showGuide ? <BinInfo /> : <InstallGuide />}
                </div>
                <div className="p-8 bg-slate-50">
                  <button 
                    onClick={() => { setShowGuide(false); setShowInstall(false); }}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-emerald-200"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between safe-bottom">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            AI Engine Ready
          </p>
        </div>
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:block">
          Powered by Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
};

export default App;
