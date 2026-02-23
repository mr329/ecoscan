
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, Zap, ZapOff, Upload, Image as ImageIcon, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraScannerProps {
  onCapture: (base64: string) => void;
  isAnalyzing: boolean;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [showFocus, setShowFocus] = useState(false);

  const startCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
      setHasCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasCamera(false);
      setError("Camera not available. You can still upload a photo!");
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      setShowFocus(true);
      setTimeout(() => setShowFocus(false), 500);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

      {!hasCamera ? (
        <div className="flex flex-col items-center justify-center p-12 text-center max-w-md">
          <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-500 border border-white/5 shadow-2xl">
            <ImageIcon size={48} />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Ready to Scan</h3>
          <p className="text-slate-400 mb-10 leading-relaxed">Upload a photo of your rubbish to see which bin it belongs to.</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            <Upload size={24} />
            Choose Photo
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-90" />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 border border-white/10 rounded-[3.5rem] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-emerald-500 rounded-tl-[3rem]"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-emerald-500 rounded-tr-[3rem]"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-emerald-500 rounded-bl-[3rem]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-emerald-500 rounded-br-[3rem]"></div>
              
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,1)] z-10"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Focus Visual */}
          <AnimatePresence>
            {showFocus && (
              <motion.div 
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute z-20 text-emerald-400"
              >
                <Focus size={80} strokeWidth={1} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 px-6">
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl p-4 rounded-[3rem] border border-white/10 shadow-2xl">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 hover:bg-white/10 rounded-full text-white transition-colors"
                title="Upload"
              >
                <Upload size={28} />
              </button>

              <button
                onClick={captureFrame}
                disabled={isAnalyzing}
                className="relative group"
              >
                <div className={`w-24 h-24 rounded-full border-4 ${isAnalyzing ? 'border-slate-700' : 'border-white'} flex items-center justify-center transition-all active:scale-90 shadow-2xl`}>
                  <div className={`w-20 h-20 rounded-full ${isAnalyzing ? 'bg-slate-700' : 'bg-white'} flex items-center justify-center`}>
                    {isAnalyzing ? (
                      <RefreshCw className="animate-spin text-slate-900" size={40} />
                    ) : (
                      <Camera className="text-slate-900" size={40} />
                    )}
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                className="p-4 hover:bg-white/10 rounded-full text-white transition-colors"
                title="Switch Camera"
              >
                <RefreshCw size={28} />
              </button>
            </div>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
