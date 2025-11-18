import { useState } from 'react'
import { styles } from './ChatPage.styles'
import { chatContacts, chatMessages } from './data/chat.constants'

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(chatContacts?.[0] || null)
  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implement message sending logic
      setMessageInput('')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trò chuyện</h1>
        <p style={styles.subtitle}>Nhắn tin với đồng nghiệp và nhóm dự án</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.chatContainer}>
          {/* Left Column - Chat List */}
          <div style={styles.chatSidebar}>
            <div style={styles.chatSidebarHeader}>
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    width: '18px',
                    height: '18px',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#7b809a" 
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm cuộc trò chuyện..." 
                  style={styles.chatSearchInput}
                />
              </div>
            </div>
            
            <div style={styles.chatContactList}>
              {chatContacts?.map((contact) => (
                <div 
                  key={contact.id}
                  style={{
                    ...styles.chatContactItem,
                    ...(selectedContact?.id === contact.id ? styles.chatContactItemActive : {})
                  }}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div style={styles.chatContactAvatar}>
                    <span style={styles.chatContactAvatarIcon}>{contact.avatar}</span>
                    {contact.online && <div style={styles.chatOnlineBadge} />}
                  </div>
                  <div style={styles.chatContactInfo}>
                    <div style={styles.chatContactHeader}>
                      <div style={styles.chatContactName}>{contact.name}</div>
                      <div style={styles.chatContactTime}>{contact.time}</div>
                    </div>
                    <div style={styles.chatContactMessage}>{contact.lastMessage}</div>
                  </div>
                  {contact.unread > 0 && (
                    <div style={styles.chatUnreadBadge}>{contact.unread}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Chat Window */}
          <div style={styles.chatWindow}>
            {/* Chat Header */}
            <div style={styles.chatWindowHeader}>
              <div style={styles.chatWindowHeaderLeft}>
                <div style={styles.chatWindowAvatar}>{selectedContact?.avatar || '?'}</div>
                <div>
                  <div style={styles.chatWindowName}>{selectedContact?.name || 'Chọn cuộc trò chuyện'}</div>
                  <div style={styles.chatWindowStatus}>
                    {selectedContact?.online ? '🟢 Đang hoạt động' : '⚫ Không hoạt động'}
                  </div>
                </div>
              </div>
              <div style={styles.chatWindowActions}>
                <button style={styles.chatActionButton} title="Tìm kiếm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
                <button style={styles.chatActionButton} title="Gọi điện">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.chatMessagesArea}>
              <div style={styles.chatDateDivider}>
                <span style={styles.chatDateText}>Hôm nay</span>
              </div>
              {chatMessages?.map((message) => (
                <div 
                  key={message.id}
                  style={{
                    ...styles.chatMessageRow,
                    ...(message.isOwn ? styles.chatMessageRowOwn : {})
                  }}
                >
                  {!message.isOwn && (
                    <div style={styles.chatMessageAvatar}>{selectedContact?.avatar || '?'}</div>
                  )}
                  <div style={styles.chatMessageGroup}>
                    <div style={{
                      ...styles.chatMessageBubble,
                      ...(message.isOwn ? styles.chatMessageBubbleOwn : {})
                    }}>
                      {message.content}
                    </div>
                    <div style={{
                      ...styles.chatMessageTime,
                      ...(message.isOwn ? styles.chatMessageTimeOwn : {})
                    }}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div style={styles.chatInputArea}>
              <div style={styles.chatInputToolbar}>
                <button style={styles.chatToolButton} title="Đính kèm file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <button style={styles.chatToolButton} title="Hình ảnh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </button>
                <button style={styles.chatToolButton} title="Emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
              </div>
              <div style={styles.chatInputWrapper}>
                <input 
                  type="text"
                  placeholder={`Nhắn tin tới ${selectedContact?.name || 'ai đó'}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  style={styles.chatMessageInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                />
                <button 
                  style={styles.chatSendButton}
                  onClick={handleSendMessage}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
