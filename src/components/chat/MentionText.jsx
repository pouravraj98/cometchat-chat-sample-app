import { useUserStore } from '../../store/userStore'

export default function MentionText({ text, mentions }) {
  const users = useUserStore((s) => s.users)

  // Replace @Name patterns with highlighted spans
  let result = text
  const parts = []
  let lastIndex = 0

  // Find mentions in text (pattern: @FirstName LastName)
  const regex = /@([A-Za-z][\w\s]*?)(?=\s|$|[.,!?])/g
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), mention: false })
    }
    parts.push({ text: match[0], mention: true })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), mention: false })
  }

  if (parts.length === 0) {
    return <p className="text-sm whitespace-pre-wrap">{text}</p>
  }

  return (
    <p className="text-sm whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.mention ? (
          <span key={i} className="font-semibold text-primary-300 bg-primary-500/20 px-0.5 rounded">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  )
}
