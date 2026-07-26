import { useEffect, useState, type ReactNode } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-400 max-w-5xl mx-auto md:border-x md:border-zinc-900/60 md:shadow-2xl">
      {/* Status Bar */}
      <div className="h-11 bg-black/95 text-xs text-zinc-400 px-6 flex items-center justify-between font-medium select-none z-40 border-b border-zinc-900/40 shrink-0">
        <span className="font-semibold text-zinc-200 text-sm">{time || '11:09'}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5 text-zinc-300" />
          <Wifi className="w-3.5 h-3.5 text-zinc-300" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-zinc-400 mr-0.5">85%</span>
            <Battery className="w-4 h-4 text-orange-500 fill-orange-500/20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col bg-zinc-950">
        {children}
      </div>
    </div>
  );
}
