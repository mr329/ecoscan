
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Timer, Brain, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { RECYCLING_FACTS, RECYCLING_QUIZ } from '../constants';

interface AnalysisOverlayProps {
  step: string;
  elapsedTime: number;
}

const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ step, elapsedTime }) => {
  const [mode, setMode] = useState<'fact' | 'quiz'>('fact');
  const [factIndex, setFactIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'fact') {
        setFactIndex((prev) => (prev + 1) % RECYCLING_FACTS.length);
        // Occasionally switch to quiz
        if (Math.random() > 0.7) setMode('quiz');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleQuizAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === RECYCLING_QUIZ[quizIndex].answer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setQuizIndex((prev) => (prev + 1) % RECYCLING_QUIZ.length);
      setMode('fact');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header & Timer */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
            />
            <Sparkles className="absolute inset-0 m-auto text-emerald-400" size={32} />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">{step}</h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-emerald-400 font-mono text-lg">
              <Timer size={20} />
              <span>{(elapsedTime / 1000).toFixed(2)}s</span>
            </div>
          </div>
        </div>

        {/* Engagement Card */}
        <AnimatePresence mode="wait">
          {mode === 'fact' ? (
            <motion.div 
              key="fact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-yellow-400">
                <Lightbulb size={24} />
                <span className="text-xs font-black uppercase tracking-widest">Did you know?</span>
              </div>
              <p className="text-lg font-bold text-white leading-relaxed">
                {RECYCLING_FACTS[factIndex]}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Brain size={24} />
                <span className="text-xs font-black uppercase tracking-widest">Quick Quiz</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-6">
                {RECYCLING_QUIZ[quizIndex].question}
              </h3>
              <div className="grid gap-3">
                {RECYCLING_QUIZ[quizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full p-4 rounded-2xl text-left font-bold transition-all flex items-center justify-between ${
                      selectedOption === idx 
                        ? isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                    {selectedOption === idx && (
                      isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          Gemini AI is processing your image...
        </p>
      </div>
    </motion.div>
  );
};

export default AnalysisOverlay;
