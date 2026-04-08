export function SkeletonCard() {
  return (
    <div className="card-base p-5" style={{ background: 'var(--color-surface)' }}>
      <div className="skeleton w-10 h-10 rounded-xl mb-3" />
      <div className="skeleton h-5 rounded-lg mb-2 w-3/4" />
      <div className="skeleton h-3.5 rounded mb-1 w-full" />
      <div className="skeleton h-3.5 rounded w-2/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${60 + Math.random() * 35}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
