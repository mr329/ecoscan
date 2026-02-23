
import React from 'react';
import { Share, PlusSquare, MoreVertical, Download, Smartphone } from 'lucide-react';

const InstallGuide: React.FC = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Smartphone size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Use as a Phone App</h3>
        <p className="text-slate-500 text-sm mt-1">Install EcoScan on your home screen for the best experience.</p>
      </div>

      <div className="space-y-6">
        {isIOS ? (
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">For iPhone / iOS</p>
            <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">
                <Share size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">1. Tap the Share button</p>
                <p className="text-sm text-slate-500">Located at the bottom of Safari.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="bg-white p-2 rounded-lg shadow-sm text-slate-700">
                <PlusSquare size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">2. 'Add to Home Screen'</p>
                <p className="text-sm text-slate-500">Scroll down to find this option.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">For Android / Chrome</p>
            <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="bg-white p-2 rounded-lg shadow-sm text-slate-700">
                <MoreVertical size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">1. Tap the Menu icon</p>
                <p className="text-sm text-slate-500">The three dots in the top right corner.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="bg-white p-2 rounded-lg shadow-sm text-slate-700">
                <Download size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">2. Tap 'Install App'</p>
                <p className="text-sm text-slate-500">Or 'Add to Home Screen' in the menu.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          <strong>Note:</strong> This creates a shortcut on your phone that works just like a native app, giving you full-screen access and faster loading.
        </p>
      </div>
    </div>
  );
};

export default InstallGuide;
