import { type ReactNode } from 'react'

interface MobileFrameProps {
  children: ReactNode
  sidebarOpen: boolean
}

export default function MobileFrame({ children, sidebarOpen }: MobileFrameProps) {
  return (
    <div className={`min-h-screen bg-zinc-950 flex flex-col transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'md:ml-56' : 'md:ml-16'
    }`}>
      <div className="text-zinc-100 flex flex-col font-sans antialiased w-full mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="pt-4" />
        <div id="app-viewport" className="flex-1 overflow-y-auto flex flex-col pb-28 md:pb-6 animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  )
}
