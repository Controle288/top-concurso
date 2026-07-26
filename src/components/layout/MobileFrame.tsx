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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-0 md:p-6 font-sans selection:bg-orange-500/30 selection:text-orange-400">
      <div className="relative w-full max-w-md h-screen md:h-[860px] md:max-h-[90vh] bg-black md:rounded-[50px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] md:border-8 md:border-zinc-800 flex flex-col overflow-hidden transition-all duration-300">
        <div className="hidden md:absolute md:top-3 md:left-1/2 md:-translate-x-1/2 md:w-32 md:h-6 md:bg-black md:rounded-full md:z-50 md:flex md:items-center md:justify-center md:border md:border-zinc-900">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2 border border-zinc-800/50"></div>
          <div className="w-8 h-1 rounded-full bg-zinc-900"></div>
        </div>
        <div className="h-10 bg-black/95 text-xs text-zinc-400 px-6 flex items-center justify-between font-medium select-none z-40 border-b border-zinc-900/40 shrink-0">
          <span className="font-semibold text-zinc-200">{time || '11:09'}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-zinc-300" />
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-zinc-400 mr-0.5">85%</span>
              <Battery className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            </div>
          </div>
        </div>
        <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col bg-zinc-950">
          {children}
        </div>
        <div className="hidden md:block h-5 bg-black w-full flex items-center justify-center pb-1.5 z-40 shrink-0">
          <div className="w-28 h-1 bg-zinc-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
