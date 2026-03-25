import { getInitials } from '../../data/helpers'

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export default function Avatar({ src, name, size = 'md', className = '' }) {
  return (
    <div
      className={`relative shrink-0 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center overflow-hidden ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || '?')}</span>
      )}
    </div>
  )
}
