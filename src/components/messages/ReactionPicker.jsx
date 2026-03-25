import { useClickOutside } from '../../hooks/useClickOutside'

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉']

export default function ReactionPicker({ onSelect, onClose }) {
  const ref = useClickOutside(onClose)

  return (
    <div ref={ref} className="bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 flex gap-0.5">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-7 h-7 flex items-center justify-center text-base hover:bg-gray-100 rounded-full transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
