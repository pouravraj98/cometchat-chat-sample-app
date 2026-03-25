const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
}

export default function PresenceBadge({ status, size = 'sm', className = '' }) {
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
  return (
    <span
      className={`absolute bottom-0 right-0 ${dotSize} rounded-full border-2 border-white ${statusColors[status] || statusColors.offline} ${className}`}
      title={status}
    />
  )
}
