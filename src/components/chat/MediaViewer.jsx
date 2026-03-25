import { useEffect } from 'react'

export default function MediaViewer({ open, onClose, url, type, fileName }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {fileName && (
        <p className="absolute top-4 left-4 text-white/70 text-sm">{fileName}</p>
      )}
      <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh]">
        {type === 'image' && (
          <img src={url} alt={fileName} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        )}
        {type === 'video' && (
          <video src={url} controls className="max-w-full max-h-[90vh] rounded-lg" />
        )}
      </div>
    </div>
  )
}
