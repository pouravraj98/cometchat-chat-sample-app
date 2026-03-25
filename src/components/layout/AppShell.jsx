import { useState, useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import CenterPanel from '../chat/CenterPanel'
import RightPanel from '../details/RightPanel'
import { useConversationStore } from '../../store/conversationStore'

export default function AppShell() {
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const [rightPanel, setRightPanel] = useState(null) // null | 'profile' | 'groupInfo' | 'messageInfo'
  const [rightPanelData, setRightPanelData] = useState(null)
  const [mobileView, setMobileView] = useState('sidebar') // 'sidebar' | 'chat'

  // When a conversation is selected, switch to chat view on mobile
  useEffect(() => {
    if (activeConversationId) {
      setMobileView('chat')
    }
  }, [activeConversationId])

  function openRightPanel(type, data = null) {
    if (rightPanel === type && !data) {
      setRightPanel(null)
      setRightPanelData(null)
    } else {
      setRightPanel(type)
      setRightPanelData(data)
    }
  }

  function closeRightPanel() {
    setRightPanel(null)
    setRightPanelData(null)
  }

  function handleMobileBack() {
    setMobileView('sidebar')
  }

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar: hidden on mobile when viewing chat */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
        <LeftSidebar />
      </div>

      {/* Center area: hidden on mobile when viewing sidebar */}
      <div className={`${mobileView === 'sidebar' ? 'hidden' : 'flex'} md:flex flex-1 min-w-0`}>
        {activeConversationId ? (
          <CenterPanel onOpenRightPanel={openRightPanel} onMobileBack={handleMobileBack} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Welcome to CometChat</h2>
              <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right panel: full-screen overlay on mobile, sidebar on desktop */}
      {rightPanel && (
        <RightPanel
          type={rightPanel}
          data={rightPanelData}
          onClose={closeRightPanel}
        />
      )}
    </div>
  )
}
