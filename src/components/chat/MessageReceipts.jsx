export default function MessageReceipts({ message }) {
  if (message.readAt) {
    return <span className="text-[10px] text-blue-500" title="Read">✓✓</span>
  }
  if (message.deliveredAt) {
    return <span className="text-[10px] text-gray-400" title="Delivered">✓✓</span>
  }
  return <span className="text-[10px] text-gray-400" title="Sent">✓</span>
}
