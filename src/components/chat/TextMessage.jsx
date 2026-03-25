export default function TextMessage({ text, isOwn }) {
  // Simple URL detection
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return (
    <p className="text-sm whitespace-pre-wrap break-words">
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${isOwn ? 'text-white/90' : 'text-primary-600'}`}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}
