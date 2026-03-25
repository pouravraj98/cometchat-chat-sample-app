import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { USERS } from '../data/users'
import Avatar from '../components/shared/Avatar'

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  function handleLogin(user) {
    login(user)
    navigate('/chat')
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-6">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CometChat</h1>
        <p className="text-gray-500">Select a user to login</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl w-full">
        {USERS.map((user) => (
          <button
            key={user.uid}
            onClick={() => handleLogin(user)}
            className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-300 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700 text-center leading-tight">
              {user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
