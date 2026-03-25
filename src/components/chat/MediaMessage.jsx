import { useState } from 'react'
import MediaViewer from './MediaViewer'

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function MediaMessage({ message, isOwn }) {
  const [viewerOpen, setViewerOpen] = useState(false)

  if (message.type === 'image') {
    return (
      <>
        <div className="cursor-pointer" onClick={() => setViewerOpen(true)}>
          <img
            src={message.url}
            alt={message.fileName || 'Image'}
            className="max-w-full max-h-64 object-cover"
            loading="lazy"
          />
        </div>
        <MediaViewer
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          url={message.url}
          type="image"
          fileName={message.fileName}
        />
      </>
    )
  }

  if (message.type === 'video') {
    return (
      <div className="p-1">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer" onClick={() => setViewerOpen(true)}>
          <div className="w-64 h-36 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="absolute bottom-2 left-2 text-xs text-white/80">{message.fileName}</span>
        </div>
        <MediaViewer
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          url={message.url}
          type="video"
          fileName={message.fileName}
        />
      </div>
    )
  }

  if (message.type === 'audio') {
    return (
      <div className="px-4 py-3 flex items-center gap-3">
        <button className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-primary-500 rounded-full w-1/3" />
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>0:00</span>
            <span className={`text-[10px] ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
              {message.duration ? `${Math.floor(message.duration / 60)}:${String(message.duration % 60).padStart(2, '0')}` : '0:00'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // File
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${isOwn ? 'bg-primary-500' : 'bg-gray-100'} flex items-center justify-center shrink-0`}>
        <svg className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>
          {message.fileName || 'File'}
        </p>
        <p className={`text-xs ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
          {formatFileSize(message.fileSize)}
        </p>
      </div>
    </div>
  )
}
