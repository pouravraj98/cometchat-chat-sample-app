import { useClickOutside } from '../../hooks/useClickOutside'

const attachments = [
  { type: 'image', label: 'Photo', icon: '📷' },
  { type: 'video', label: 'Video', icon: '🎥' },
  { type: 'audio', label: 'Audio', icon: '🎵' },
  { type: 'file', label: 'File', icon: '📎' },
]

export default function AttachmentPicker({ onSelect, onClose }) {
  const ref = useClickOutside(onClose)

  return (
    <div ref={ref} className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
      {attachments.map((a) => (
        <button
          key={a.type}
          onClick={() => onSelect(a.type)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <span>{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  )
}
