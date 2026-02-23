
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const steps = [
    {
      icon: <Camera className="text-emerald-500" size={32} />,
      title: "Point & Capture",
      description: "Aim your camera at any piece of rubbish or upload a photo."
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "AI Analysis",
      description: "Our AI instantly identifies the material and checks local rules."
    },
    {
      icon: <CheckCircle className="text-blue-500" size={32} />,
      title: "Sort Correctly",
      description: "Get clear instructions on which bin to use and disposal tips."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-emerald-500/10 rounded-3xl mb-2">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Welcome to EcoScan</h1>
          <p className="text-slate-400 text-lg">Let's make recycling effortless together.</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex gap-6 items-start"
            >
              <div className="p-3 bg-slate-900 rounded-2xl border border-white/5">
                {step.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all"
        >
          Start Scanning
          <ArrowRight size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Onboarding;
