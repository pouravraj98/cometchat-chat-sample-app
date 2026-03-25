import { useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'

export default function Dropdown({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-30 mt-1 ${align === 'right' ? 'right-0' : 'left-0'} min-w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1`}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-px bg-gray-100 my-1" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.icon && <span className="w-4">{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
