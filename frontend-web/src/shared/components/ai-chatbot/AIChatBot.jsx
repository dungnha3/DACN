import { useState, useRef, useEffect } from 'react';
import { aiApi } from './aiApi';

/**
 * AI ChatBot Component - Giống Notion AI
 * Floating button ở góc dưới bên phải, click để mở chat
 */
export default function AIChatBot({ projectId = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [aiStatus, setAiStatus] = useState({ available: false, message: '' });
  const [pendingActions, setPendingActions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick actions cho AI
  const quickActions = [
    { icon: '📊', label: 'Tóm tắt dự án', action: 'SUMMARIZE_PROJECT', isNew: false, needProject: true },
    { icon: '🏃', label: 'Tiến độ Sprint', action: 'SUMMARIZE_SPRINT', isNew: false, needProject: true },
    { icon: '💡', label: 'Gợi ý công việc', action: 'SUGGEST_TASKS', isNew: true, needProject: true },
    { icon: '📈', label: 'Phân tích tiến độ', action: 'ANALYZE_PROGRESS', isNew: false, needProject: true },
    { icon: '📝', label: 'Tạo báo cáo', action: 'GENERATE_REPORT', isNew: true, needProject: true },
  ];

  // Check AI status and fetch projects on mount
  useEffect(() => {
    checkAiStatus();
    fetchProjects();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const checkAiStatus = async () => {
    try {
      const response = await aiApi.getStatus();
      setAiStatus(response);
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiStatus({ available: false, message: 'Không thể kết nối đến AI service' });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await aiApi.getMyProjects();
      setProjects(response || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setShowProjectSelector(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputValue, actionType = 'CHAT') => {
    if (!message.trim() && actionType === 'CHAT') return;

    const userMessage = message.trim() || getActionLabel(actionType);
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use selected project or prop projectId
      const currentProjectId = selectedProject?.projectId || projectId;
      
      const response = await aiApi.chat({
        message: userMessage,
        conversationId,
        projectId: currentProjectId,
        actionType,
      });

      // Save conversation ID
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message,
        suggestedActions: response.suggestedActions,
        executableActions: response.executableActions
      }]);

      // Set pending actions if any
      if (response.executableActions && response.executableActions.length > 0) {
        setPendingActions(response.executableActions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Get error message from response
      let errorMessage = 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionConfig) => {
    const action = typeof actionConfig === 'string' ? actionConfig : actionConfig.action;
    const needProject = typeof actionConfig === 'object' ? actionConfig.needProject : true;
    
    // Check if project is needed but not selected
    if (needProject && !selectedProject && !projectId) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Vui lòng chọn một dự án trước khi sử dụng tính năng này.\n\nClick vào "@ Add context" bên dưới để chọn dự án.',
        isError: true
      }]);
      return;
    }
    
    const actionMessages = {
      SUMMARIZE_PROJECT: 'Hãy tóm tắt tình trạng dự án này',
      SUMMARIZE_SPRINT: 'Hãy tóm tắt tiến độ sprint hiện tại',
      SUGGEST_TASKS: `Hãy gợi ý các công việc cần làm để hoàn thành dự án "${selectedProject?.name || 'này'}". 
        Với mỗi công việc, hãy đề xuất:
        - Tên công việc
        - Thời gian ước tính (giờ)
        - Mức độ ưu tiên (LOW/MEDIUM/HIGH/CRITICAL)
        - Hạn chót (số ngày từ hôm nay)
        - Mô tả ngắn
        
        Liệt kê dưới dạng danh sách.`,
      ANALYZE_PROGRESS: 'Hãy phân tích tiến độ dự án',
      GENERATE_REPORT: 'Hãy tạo báo cáo status update',
    };
    handleSendMessage(actionMessages[action] || '', action);
  };

  const getActionLabel = (actionType) => {
    const labels = {
      SUMMARIZE_PROJECT: 'Tóm tắt dự án',
      SUMMARIZE_SPRINT: 'Tóm tắt sprint',
      SUGGEST_TASKS: 'Gợi ý công việc',
      ANALYZE_PROGRESS: 'Phân tích tiến độ',
      GENERATE_REPORT: 'Tạo báo cáo',
    };
    return labels[actionType] || actionType;
  };

  // Execute an AI action (create project, task, etc.)
  const handleExecuteAction = async (action) => {
    setIsLoading(true);
    try {
      const result = await aiApi.executeAction(action);
      
      // Add result message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.message,
        isActionResult: true,
        actionStatus: result.status
      }]);
      
      // Clear pending actions
      setPendingActions(prev => prev.filter(a => a !== action));
      
    } catch (error) {
      console.error('Error executing action:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Lỗi khi thực hiện: ${error.response?.data?.message || error.message}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get action type display name
  const getActionTypeName = (actionType) => {
    const names = {
      CREATE_PROJECT: 'Tạo dự án',
      CREATE_ISSUE: 'Tạo task',
      CREATE_SPRINT: 'Tạo sprint',
      CREATE_MULTIPLE_ISSUES: 'Tạo nhiều tasks',
      ASSIGN_ISSUE: 'Gán task',
      CHANGE_ISSUE_STATUS: 'Đổi trạng thái',
    };
    return names[actionType] || actionType;
  };

  // Approve all suggested tasks and create them
  const handleApproveAllTasks = async (actions) => {
    if (!actions || actions.length === 0) return;
    
    setIsLoading(true);
    try {
      const results = await aiApi.executeBatchActions(actions);
      
      // Count successes
      const successCount = results.filter(r => r.status === 'EXECUTED').length;
      const failCount = results.length - successCount;
      
      let resultMessage = `✅ Đã tạo thành công ${successCount} công việc`;
      if (failCount > 0) {
        resultMessage += `\n⚠️ ${failCount} công việc không thể tạo`;
      }
      
      // Show individual results
      results.forEach(r => {
        if (r.message) {
          resultMessage += `\n${r.message}`;
        }
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resultMessage,
        isActionResult: true
      }]);
      
      // Clear pending actions
      setPendingActions([]);
      
    } catch (error) {
      console.error('Error creating tasks:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Lỗi khi tạo công việc: ${error.response?.data?.message || error.message}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reject suggested tasks
  const handleRejectTasks = () => {
    setPendingActions([]);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '👍 Đã hủy. Bạn có thể yêu cầu AI gợi ý lại hoặc tiếp tục chat.',
      isActionResult: true
    }]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue('');
    setPendingActions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.floatingButton}
        title="AI Assistant"
      >
        <div style={styles.buttonIcon}>
          {isOpen ? '✕' : '🤖'}
        </div>
        {!isOpen && <div style={styles.notificationDot} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>🤖</span>
              <div style={styles.headerTitle}>
                <span style={styles.titleText}>AI Assistant</span>
                <button style={styles.newChatBtn} onClick={handleNewChat}>
                  New chat ▾
                </button>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button style={styles.iconBtn} title="Mở rộng">⬜</button>
              <button style={styles.iconBtn} onClick={() => setIsOpen(false)} title="Đóng">—</button>
            </div>
          </div>

          {/* Chat Content */}
          <div style={styles.chatContent}>
            {messages.length === 0 ? (
              // Welcome Screen
              <div style={styles.welcomeScreen}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>🤖</div>
                  <div style={styles.statusDot} />
                </div>
                <h3 style={styles.welcomeTitle}>Tôi có thể giúp gì cho bạn?</h3>
                
                {/* Selected Project Badge */}
                {selectedProject && (
                  <div style={styles.selectedProjectBadge}>
                    📊 {selectedProject.name}
                  </div>
                )}
                
                {/* Quick Actions */}
                <div style={styles.quickActions}>
                  {quickActions.map((actionConfig, idx) => (
                    <button
                      key={idx}
                      style={{
                        ...styles.quickActionBtn,
                        ...(actionConfig.needProject && !selectedProject && !projectId && styles.quickActionBtnDisabled)
                      }}
                      onClick={() => handleQuickAction(actionConfig)}
                      disabled={!aiStatus.available}
                    >
                      <span style={styles.actionIcon}>{actionConfig.icon}</span>
                      <span style={styles.actionLabel}>{actionConfig.label}</span>
                      {actionConfig.isNew && <span style={styles.newBadge}>New</span>}
                    </button>
                  ))}
                </div>

                {!aiStatus.available && (
                  <div style={styles.warningBanner}>
                    ⚠️ {aiStatus.message || 'AI service chưa được cấu hình'}
                  </div>
                )}
              </div>
            ) : (
              // Messages
              <div style={styles.messagesList}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div style={styles.assistantAvatar}>🤖</div>
                    )}
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
                        ...(msg.isError && styles.errorBubble),
                      }}
                    >
                      <div style={styles.messageContent}>
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i} style={{ margin: line ? '4px 0' : '8px 0' }}>{line}</p>
                        ))}
                      </div>
                      
                      {/* Action buttons for executable actions */}
                      {msg.executableActions && msg.executableActions.length > 0 && (
                        <div style={styles.actionButtons}>
                          {msg.executableActions.map((action, actionIdx) => (
                            <button
                              key={actionIdx}
                              style={styles.executeActionBtn}
                              onClick={() => handleExecuteAction(action)}
                              disabled={isLoading}
                            >
                              {getActionTypeName(action.actionType)}
                              {action.data?.name && `: ${action.data.name}`}
                              {action.data?.title && `: ${action.data.title}`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div style={styles.messageWrapper}>
                    <div style={styles.assistantAvatar}>🤖</div>
                    <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
                      <div style={styles.typingIndicator}>
                        <span style={styles.dot} />
                        <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                        <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Approve/Reject buttons for pending actions */}
          {pendingActions.length > 0 && (
            <div style={styles.pendingActionsBar}>
              <span style={styles.pendingActionsText}>
                📋 {pendingActions.length} công việc được gợi ý
              </span>
              <div style={styles.pendingActionsButtons}>
                <button
                  style={styles.rejectBtn}
                  onClick={handleRejectTasks}
                  disabled={isLoading}
                >
                  ✕ Từ chối
                </button>
                <button
                  style={styles.approveBtn}
                  onClick={() => handleApproveAllTasks(pendingActions)}
                  disabled={isLoading}
                >
                  ✓ Đồng ý tạo tất cả
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={styles.inputArea}>
            {/* Project selector dropdown */}
            {showProjectSelector && (
              <div style={styles.projectSelector}>
                <div style={styles.projectSelectorHeader}>
                  <span>📁 Chọn dự án</span>
                  <button 
                    style={styles.closeSelectorBtn}
                    onClick={() => setShowProjectSelector(false)}
                  >
                    ✕
                  </button>
                </div>
                <div style={styles.projectList}>
                  {projects.length === 0 ? (
                    <div style={styles.noProjects}>Không có dự án nào</div>
                  ) : (
                    projects.map((project) => (
                      <button
                        key={project.projectId}
                        style={{
                          ...styles.projectItem,
                          ...(selectedProject?.projectId === project.projectId && styles.projectItemSelected)
                        }}
                        onClick={() => handleSelectProject(project)}
                      >
                        <span style={styles.projectIcon}>📊</span>
                        <div style={styles.projectInfo}>
                          <span style={styles.projectName}>{project.name}</span>
                          <span style={styles.projectKey}>{project.keyProject}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div style={styles.inputContainer}>
              <button 
                type="button"
                className="context-btn"
                style={{
                  ...styles.contextBtn,
                  ...(selectedProject && styles.contextBtnSelected),
                  ...(showProjectSelector && { backgroundColor: '#e5e7eb' })
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Context button clicked');
                  setShowProjectSelector(!showProjectSelector);
                }}
              >
                {selectedProject ? (
                  <>
                    <span>📊</span> {selectedProject.name}
                    <span 
                      style={styles.clearProjectBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(null);
                      }}
                    >
                      ✕
                    </span>
                  </>
                ) : (
                  <>
                    <span>@</span> Add context
                  </>
                )}
              </button>
              <textarea
                ref={inputRef}
                style={styles.input}
                placeholder={selectedProject ? `Hỏi về dự án ${selectedProject.name}...` : "Hỏi bất cứ điều gì..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!aiStatus.available || isLoading}
                rows={1}
              />
            </div>
            <div style={styles.inputFooter}>
              <div style={styles.inputOptions}>
                <button style={styles.optionBtn}>📎</button>
                <button style={styles.optionBtn}>Auto</button>
                <button style={styles.optionBtn}>🌐 All sources</button>
              </div>
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: (!inputValue.trim() || !aiStatus.available || isLoading) ? 0.5 : 1,
                }}
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || !aiStatus.available || isLoading}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .context-btn:hover {
          background-color: #e5e7eb !important;
          border-color: #d1d5db !important;
        }
      `}</style>
    </>
  );
}

// Styles
const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 9999,
  },
  buttonIcon: {
    fontSize: '24px',
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    border: '2px solid white',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '400px',
    height: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9998,
    animation: 'slideUp 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    fontSize: '24px',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#1a1a1a',
  },
  newChatBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
  },
  headerActions: {
    display: 'flex',
    gap: '4px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    color: '#666',
    transition: 'background 0.2s',
  },
  chatContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  welcomeScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
  },
  statusDot: {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    border: '2px solid white',
  },
  welcomeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '24px',
  },
  quickActions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
  },
  actionIcon: {
    fontSize: '18px',
  },
  actionLabel: {
    flex: 1,
    fontSize: '14px',
    color: '#1a1a1a',
  },
  newBadge: {
    fontSize: '11px',
    color: '#3b82f6',
    fontWeight: '500',
  },
  warningBanner: {
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#92400e',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  assistantAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  assistantBubble: {
    backgroundColor: '#f5f5f5',
    color: '#1a1a1a',
    borderBottomLeftRadius: '4px',
  },
  errorBubble: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  },
  executeActionBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #3b82f6',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#9ca3af',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid #f0f0f0',
    position: 'relative',
  },
  inputContainer: {
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    padding: '8px 12px',
    transition: 'border-color 0.2s',
  },
  contextBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    background: '#f5f5f5',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
    marginBottom: '8px',
    zIndex: 10,
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    resize: 'none',
    minHeight: '24px',
    maxHeight: '120px',
    fontFamily: 'inherit',
  },
  inputFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  inputOptions: {
    display: 'flex',
    gap: '4px',
  },
  optionBtn: {
    padding: '4px 8px',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  sendBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  // Project selector styles
  projectSelector: {
    position: 'absolute',
    bottom: '100%',
    left: '16px',
    right: '16px',
    marginBottom: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    maxHeight: '300px',
    overflow: 'hidden',
    zIndex: 100,
  },
  projectSelectorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    fontWeight: '600',
    fontSize: '14px',
  },
  closeSelectorBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
    padding: '4px',
  },
  projectList: {
    maxHeight: '240px',
    overflowY: 'auto',
  },
  noProjects: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  },
  projectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
  },
  projectItemSelected: {
    backgroundColor: '#eff6ff',
  },
  projectIcon: {
    fontSize: '20px',
  },
  projectInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  projectName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  projectKey: {
    fontSize: '12px',
    color: '#666',
  },
  contextBtnSelected: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    borderColor: '#3b82f6',
  },
  clearProjectBtn: {
    marginLeft: '8px',
    padding: '2px 6px',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
  },
  selectedProjectBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  quickActionBtnDisabled: {
    opacity: 0.5,
  },
  // Pending actions bar styles
  pendingActionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    borderTop: '1px solid #fcd34d',
    gap: '12px',
  },
  pendingActionsText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#92400e',
  },
  pendingActionsButtons: {
    display: 'flex',
    gap: '8px',
  },
  rejectBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  approveBtn: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
