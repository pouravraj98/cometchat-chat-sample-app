export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative ${
            active === tab.id
              ? 'text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
      ))}
    </div>
  )
}
