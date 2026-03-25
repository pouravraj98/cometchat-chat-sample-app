export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
    </div>
  )
}
