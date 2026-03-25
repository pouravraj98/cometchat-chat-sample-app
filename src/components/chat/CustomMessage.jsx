export default function CustomMessage({ message, isOwn }) {
  if (message.customType === 'code_snippet') {
    return (
      <div className="p-3">
        <pre className={`text-xs font-mono p-3 rounded-lg overflow-x-auto ${isOwn ? 'bg-primary-700 text-white/90' : 'bg-gray-900 text-green-400'}`}>
          <code>{message.text}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      <p className="text-xs font-medium text-gray-400 mb-1">Custom Message</p>
      <p className="text-sm">{message.text || JSON.stringify(message.data || {})}</p>
    </div>
  )
}
