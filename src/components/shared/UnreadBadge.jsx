export default function UnreadBadge({ count }) {
  if (!count) return null
  return (
    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary-600 text-white text-xs font-semibold">
      {count > 99 ? '99+' : count}
    </span>
  )
}
