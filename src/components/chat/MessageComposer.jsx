import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'
import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'
import AttachmentPicker from './AttachmentPicker'
import EmojiPicker from '../messages/EmojiPicker'

export default function MessageComposer({ conversationId, replyTo, onClearReply }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const sendMessage = useMessageStore((s) => s.sendMessage)
  const updateLastMessage = useConversationStore((s) => s.updateLastMessage)
  const users = useUserStore((s) => s.users)
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showAttachment, setShowAttachment] = useState(false)
  const [mentionQuery, setMentionQuery] = useState(null)
  const [mentionResults, setMentionResults] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const inputRef = useRef(null)
  const recordingInterval = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [conversationId])

  // Cleanup recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current)
    }
  }, [])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return

    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(trimmed)) !== null) {
      const user = users.find((u) => u.name.toLowerCase().includes(match[1].toLowerCase()))
      if (user) mentions.push(user.uid)
    }

    const msg = {
      sender: currentUser.uid,
      type: 'text',
      text: trimmed,
      mentions,
      ...(replyTo ? { quotedMessage: { id: replyTo.id, text: replyTo.text } } : {}),
    }

    const sent = sendMessage(conversationId, msg)
    updateLastMessage(conversationId, { ...sent, sentAt: new Date(sent.sentAt) })
    setText('')
    onClearReply?.()
    setMentionQuery(null)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleTextChange(e) {
    const val = e.target.value
    setText(val)

    const cursorPos = e.target.selectionStart
    const textBeforeCursor = val.slice(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    if (mentionMatch) {
      const q = mentionMatch[1].toLowerCase()
      setMentionQuery(q)
      setMentionResults(
        users
          .filter((u) => u.uid !== currentUser.uid && u.name.toLowerCase().includes(q))
          .slice(0, 5)
      )
    } else {
      setMentionQuery(null)
      setMentionResults([])
    }
  }

  function insertMention(user) {
    const cursorPos = inputRef.current.selectionStart
    const textBeforeCursor = text.slice(0, cursorPos)
    const textAfterCursor = text.slice(cursorPos)
    const beforeMention = textBeforeCursor.replace(/@\w*$/, '')
    setText(`${beforeMention}@${user.name} ${textAfterCursor}`)
    setMentionQuery(null)
    setMentionResults([])
    inputRef.current.focus()
  }

  function handleAttachment(type) {
    const typeMap = {
      image: { type: 'image', url: 'https://picsum.photos/seed/upload/600/400', fileName: 'photo.jpg' },
      video: { type: 'video', url: '#', fileName: 'video.mp4' },
      audio: { type: 'audio', url: '#', fileName: 'recording.mp3', duration: 30 },
      file: { type: 'file', url: '#', fileName: 'document.pdf', fileSize: 1500000 },
    }
    const attachment = typeMap[type]
    if (!attachment) return

    const msg = {
      sender: currentUser.uid,
      text: '',
      ...attachment,
    }
    const sent = sendMessage(conversationId, msg)
    updateLastMessage(conversationId, { ...sent, sentAt: new Date(sent.sentAt) })
    setShowAttachment(false)
  }

  function handleEmojiSelect(emoji) {
    setText((prev) => prev + emoji)
    setShowEmoji(false)
    inputRef.current.focus()
  }

  function startRecording() {
    setIsRecording(true)
    setRecordingTime(0)
    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1)
    }, 1000)
  }

  function cancelRecording() {
    setIsRecording(false)
    setRecordingTime(0)
    if (recordingInterval.current) clearInterval(recordingInterval.current)
  }

  function sendRecording() {
    if (recordingInterval.current) clearInterval(recordingInterval.current)
    const duration = recordingTime
    setIsRecording(false)
    setRecordingTime(0)

    const msg = {
      sender: currentUser.uid,
      type: 'audio',
      text: '',
      url: '#',
      fileName: `voice_note_${Date.now()}.mp3`,
      duration,
    }
    const sent = sendMessage(conversationId, msg)
    updateLastMessage(conversationId, { ...sent, sentAt: new Date(sent.sentAt) })
  }

  function formatRecordingTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const hasText = text.trim().length > 0

  // Recording UI
  if (isRecording) {
    return (
      <div className="border-t border-gray-200 bg-white shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Cancel */}
          <button
            onClick={cancelRecording}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors shrink-0"
            title="Cancel recording"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Recording indicator */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shrink-0" />
            <span className="text-sm font-medium text-red-600">Recording</span>
            <div className="flex-1 flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="w-0.5 bg-red-400 rounded-full"
                  style={{
                    height: `${8 + Math.sin((recordingTime * 3 + i) * 0.8) * 8 + Math.random() * 6}px`,
                    opacity: 0.5 + Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-mono text-red-600 tabular-nums shrink-0">
              {formatRecordingTime(recordingTime)}
            </span>
          </div>

          {/* Send recording */}
          <button
            onClick={sendRecording}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
            title="Send voice note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 bg-white shrink-0">
      {/* Reply preview */}
      {replyTo && (
        <div className="px-4 pt-2 flex items-center gap-2">
          <div className="flex-1 px-3 py-1.5 bg-gray-100 rounded-lg border-l-2 border-primary-500 text-xs text-gray-600 truncate">
            Replying to: {replyTo.text || 'Media message'}
          </div>
          <button onClick={onClearReply} className="text-gray-400 hover:text-gray-600 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="px-3 py-2.5 flex items-center gap-1.5 relative">
        {/* Mention autocomplete */}
        {mentionQuery !== null && mentionResults.length > 0 && (
          <div className="absolute bottom-full left-4 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-56 z-10">
            {mentionResults.map((user) => (
              <button
                key={user.uid}
                onClick={() => insertMention(user)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                {user.name}
              </button>
            ))}
          </div>
        )}

        {/* Attachment */}
        <div className="relative shrink-0">
          <button
            onClick={() => { setShowAttachment(!showAttachment); setShowEmoji(false) }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          {showAttachment && <AttachmentPicker onSelect={handleAttachment} onClose={() => setShowAttachment(false)} />}
        </div>

        {/* Text input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none px-4 py-2 text-sm leading-6 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 max-h-32"
            style={{ height: '40px' }}
          />
        </div>

        {/* Emoji */}
        <div className="relative shrink-0">
          <button
            onClick={() => { setShowEmoji(!showEmoji); setShowAttachment(false) }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showEmoji && (
            <div className="absolute bottom-full right-0 mb-2 z-10">
              <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
            </div>
          )}
        </div>

        {/* Send or Mic */}
        {hasText ? (
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
            title="Record voice note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
