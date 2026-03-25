# CometChat Chat UI Sample App

A standalone sample app demonstrating all CometChat JavaScript SDK chat features with a clean, interactive UI. Built with mock data — no backend or SDK integration required.

**[Live Demo](https://pouravraj98.github.io/cometchat-chat-sample-app/)**

## Features

### Auth
- Login/logout with mock user selection grid (10 users)

### Conversations
- Conversation list with last message preview, timestamps, and unread badges
- Search/filter conversations
- Pin and delete conversations (right-click context menu)

### Messages
- **Text messages** with URL detection
- **Media messages** — image (with fullscreen viewer), video, audio player, file attachments
- **Custom messages** — code snippets with syntax highlighting
- **Interactive messages** — polls with live voting
- **Action/system messages** — centered status updates
- **Message receipts** — sent (✓), delivered (✓✓), read (✓✓ blue)
- **Edit & delete** — edit own messages, delete for me or everyone
- **Reply (quoted)** — reply with quoted message preview
- **Threaded replies** — side panel thread view with reply count
- **Reactions** — quick reaction picker + emoji reactions with counts
- **Mentions** — @user highlighting with autocomplete in composer
- **Forward** — forward messages to multiple conversations
- **Copy** — copy message text to clipboard
- **Search** — search within conversation messages
- **Smart replies** — context-aware quick reply suggestions
- **Typing indicator** — animated dots with simulated typing
- **Message info** — per-message delivery details and reaction breakdown
- **Emoji picker** — categorized emoji grid (Smileys, Gestures, Hearts, Objects, Flags)
- **Attachment picker** — send photo, video, audio, or file

### Users
- User list with search and presence indicators (online/away/offline)
- User profile panel with bio, role, last active
- Block/unblock users

### Groups
- Group list with search, type icons (public/private/password)
- **Create group** — public, private, or password-protected
- **Join group** — with password validation for protected groups
- **Group info panel** — description, member count, creation date
- **Member management** — add members, remove, ban, change scope (owner/admin/member)
- **Transfer ownership** — transfer group ownership to another member
- **Update/delete group** — edit name and description, delete group
- **Leave group**

### Shared
- Shared media panel — grid view of images and files in a conversation
- Modal system, toast notifications, confirm dialogs
- Empty states and loading indicators

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Zustand** for state management (5 stores)
- **React Router v7** (HashRouter for GitHub Pages)

## Project Structure

```
src/
├── routes/          # LoginPage, ChatPage
├── store/           # authStore, conversationStore, messageStore, userStore, groupStore
├── data/            # Mock users, conversations, messages, groups, helpers
├── components/
│   ├── layout/      # AppShell, LeftSidebar
│   ├── sidebar/     # ConversationList, UserList, GroupList
│   ├── chat/        # MessageList, MessageBubble, MessageComposer, ThreadView, etc.
│   ├── details/     # UserProfilePanel, GroupInfoPanel, MessageInfoPanel, SharedMediaPanel
│   ├── groups/      # Create/Join/Update group modals, AddMembers, TransferOwnership
│   ├── messages/    # MessageActions, Edit/Delete/Forward modals, EmojiPicker, ReactionPicker
│   └── shared/      # Avatar, Modal, Toast, SearchInput, Tabs, Dropdown, etc.
└── hooks/           # useDebounce, useClickOutside
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and select a user to log in.

## Layout

Three-panel layout on desktop, single-panel with navigation on mobile:

```
┌─────────────────────────────────────────────────────────────┐
│ Left Sidebar (320px) │ Center Panel (flex)  │ Right (340px) │
│                      │                      │ (collapsible) │
│ User + Logout        │ ChatHeader           │ UserProfile   │
│ Chats│Users│Groups   │ MessageList          │ GroupInfo      │
│ Search               │ TypingIndicator      │ MessageInfo    │
│ Conversation /       │ SmartReplies         │ GroupMembers   │
│ User / Group List    │ MessageComposer      │ SharedMedia    │
└─────────────────────────────────────────────────────────────┘
```

## Mobile Responsive

- **< 768px**: Sidebar and chat toggle — only one visible at a time
- Back button in chat header to return to conversation list
- Thread view and right panel render as full-screen overlays
- Login page adapts grid columns to screen size

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via GitHub Actions.
