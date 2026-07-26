import { useState, useRef, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [showRefresh, setShowRefresh] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY
      setShowRefresh(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showRefresh) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
      }
    }
    setPullDistance(0)
    setShowRefresh(false)
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(pullDistance > 10 || refreshing) && (
        <div
          className="flex items-center justify-center transition-all duration-200 overflow-hidden"
          style={{ height: refreshing ? 48 : pullDistance }}
        >
          <RefreshCw className={`w-5 h-5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs text-zinc-500 ml-2 font-medium">
            {refreshing ? 'Atualizando...' : 'Solte para atualizar'}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}
