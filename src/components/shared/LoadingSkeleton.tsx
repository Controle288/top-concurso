interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text'
  lines?: number
  height?: string
  className?: string
}

export default function LoadingSkeleton({ variant = 'card', lines = 1, height, className = '' }: LoadingSkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: height || '14px', width: `${100 - i * 15}%` }} />
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: height || '64px' }} />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: lines || 6 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: height || '120px' }} />
      ))}
    </div>
  )
}
