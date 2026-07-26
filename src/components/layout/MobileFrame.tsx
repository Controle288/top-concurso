import { useEffect, useState, type ReactNode } from 'react'
import GlobalSearch from '@/components/shared/GlobalSearch'

interface MobileFrameProps {
  children: ReactNode
  sidebarOpen: boolean
}

export default function MobileFrame({ children, sidebarOpen }: MobileFrameProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen bg-zinc-950 flex flex-col transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'md:ml-56' : 'md:ml-16'
    }`}>
      <div className="text-zinc-100 flex flex-col font-sans antialiased w-full mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Status bar */}
        <div className="h-10 flex items-center justify-center text-xs text-zinc-500 font-medium tracking-wide select-none shrink-0">
          {time || '--:--'}
        </div>
        {/* Global Search */}
        <div className="mb-4 shrink-0">
          <GlobalSearch />
        </div>
        {/* Content */}
        <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col pb-28 md:pb-6 animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  )
}
