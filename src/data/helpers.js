let counter = 1000

export function generateId() {
  return `msg_${Date.now()}_${counter++}`
}

export function formatTime(date) {
  if (!(date instanceof Date)) date = new Date(date)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatRelativeTime(date) {
  if (!(date instanceof Date)) date = new Date(date)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return formatDate(date)
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str, max = 40) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '...' : str
}
