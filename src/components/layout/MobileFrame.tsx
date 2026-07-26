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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-0 md:p-10 font-sans selection:bg-orange-500/30 selection:text-orange-400">
      <div className="relative w-full max-w-md h-screen md:h-[860px] md:max-h-[95vh] flex flex-col overflow-hidden transition-all duration-300">

        {/* Phone Frame (desktop only) */}
        <div className="hidden md:block absolute inset-0 rounded-[60px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-700 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-[10px] rounded-[50px] bg-black overflow-hidden shadow-inner">
            <div className="absolute inset-0 rounded-[50px] bg-zinc-950 overflow-hidden">
              {/* Screen content inside here */}
            </div>
          </div>
        </div>

        {/* Volume buttons */}
        <div className="hidden md:block absolute left-[-4px] top-[140px] w-[4px] h-[40px] bg-zinc-700 rounded-r-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"></div>
        <div className="hidden md:block absolute left-[-4px] top-[190px] w-[4px] h-[40px] bg-zinc-700 rounded-r-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"></div>
        <div className="hidden md:block absolute left-[-4px] top-[240px] w-[4px] h-[50px] bg-zinc-700 rounded-r-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Power button */}
        <div className="hidden md:block absolute right-[-4px] top-[170px] w-[4px] h-[55px] bg-zinc-700 rounded-l-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Dynamic Island / Notch */}
        <div className="hidden md:absolute md:top-[14px] md:left-1/2 md:-translate-x-1/2 md:w-[110px] md:h-[28px] md:bg-black md:rounded-full md:z-50 md:flex md:items-center md:justify-center md:border md:border-zinc-800 md:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800/50"></div>
            <div className="w-5 h-1.5 rounded-full bg-zinc-900"></div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-11 bg-black/95 text-xs text-zinc-400 px-6 md:px-8 flex items-center justify-between font-medium select-none z-40 border-b border-zinc-900/40 shrink-0 md:rounded-t-[50px] md:pt-4 md:pb-1 md:border-none">
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

        {/* App content */}
        <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col bg-zinc-950 md:rounded-b-[50px]">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-5 bg-black w-full flex items-center justify-center pb-1.5 z-40 shrink-0 md:rounded-b-[50px]">
          <div className="w-32 h-1 bg-zinc-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
