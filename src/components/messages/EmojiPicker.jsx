import { useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒'],
  'Gestures': ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🦾'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Objects': ['⭐', '🌟', '✨', '⚡', '🔥', '💥', '🎉', '🎊', '🏆', '🥇', '🎯', '🚀', '💡', '🔔', '📌', '📎', '🔗', '🔑', '🛡️', '⚔️'],
  'Flags': ['🏁', '🚩', '🎌', '🏴', '🏳️', '✅', '❌', '❓', '❗', '⭕', '🔴', '🟡', '🟢', '🔵'],
}

export default function EmojiPicker({ onSelect, onClose }) {
  const ref = useClickOutside(onClose)
  const [category, setCategory] = useState('Smileys')
  const categories = Object.keys(EMOJI_CATEGORIES)

  return (
    <div ref={ref} className="bg-white border border-gray-200 rounded-xl shadow-xl w-72 overflow-hidden">
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="p-2 grid grid-cols-8 gap-0.5 max-h-48 overflow-y-auto scrollbar-thin">
        {EMOJI_CATEGORIES[category].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
