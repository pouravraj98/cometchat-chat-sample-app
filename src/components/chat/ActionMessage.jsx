export default function ActionMessage({ message }) {
  return (
    <div className="flex items-center justify-center py-2">
      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
        {message.text}
      </span>
    </div>
  )
}
