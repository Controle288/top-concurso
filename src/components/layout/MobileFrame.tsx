import { useEffect, useState, type ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  sidebarOpen: boolean;
}

export default function MobileFrame({ children, sidebarOpen }: MobileFrameProps) {
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
    <div className={`min-h-screen bg-zinc-950 flex flex-col transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'md:ml-56' : 'md:ml-16'
    }`}>
      <div className="text-zinc-100 flex flex-col font-sans antialiased max-w-5xl w-full mx-auto relative">
        {/* Status bar */}
        <div className="h-10 flex items-center justify-center text-xs text-zinc-500 font-medium tracking-wide select-none shrink-0">
          {time || '--:--'}
        </div>
        {/* Content */}
        <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col px-4 pb-28 md:pb-6 animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}
