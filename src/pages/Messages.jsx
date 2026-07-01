import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { db } from '../services/db';
import Navbar from '../components/layout/Navbar';
import DOMPurify from 'dompurify';
import './Messages.css';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #14b8a6, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr}h`;
  if (diffDay === 1) return 'ayer';
  if (diffDay < 7) return `hace ${diffDay}d`;
  return date.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 86400000);

  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return date.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
}

function shouldShowDateSep(msgs, idx) {
  if (idx === 0) return true;
  const prev = new Date(msgs[idx - 1].timestamp).toDateString();
  const curr = new Date(msgs[idx].timestamp).toDateString();
  return prev !== curr;
}

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get('to');

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load conversations
  const loadConversations = useCallback(() => {
    if (!user) return;
    const allConvs = db.getAll('conversations');
    const myConvs = allConvs
      .filter(c => c.participants.includes(user.id))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Enrich with other user data
    const enriched = myConvs.map(conv => {
      const otherId = conv.participants.find(p => p !== user.id);
      const otherUser = db.getById('users', otherId);
      const lastMsg = conv.messages[conv.messages.length - 1];
      const unread = conv.messages.filter(m => m.senderId !== user.id && !m.read).length;
      return {
        ...conv,
        otherUser: otherUser || { id: otherId, name: 'Usuario eliminado' },
        lastMessage: lastMsg,
        unreadCount: unread,
      };
    });

    setConversations(enriched);
    return enriched;
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle ?to=userId parameter
  useEffect(() => {
    if (!toUserId || !user) return;

    const allConvs = db.getAll('conversations');
    let existingConv = allConvs.find(
      c => c.participants.includes(user.id) && c.participants.includes(toUserId)
    );

    if (!existingConv) {
      const targetUser = db.getById('users', toUserId);
      if (!targetUser || targetUser.id === user.id) return;

      existingConv = db.create('conversations', {
        participants: [user.id, toUserId],
        messages: [],
        updatedAt: new Date().toISOString(),
      });
    }

    const enriched = loadConversations();
    setActiveConvId(existingConv.id);
    setMobileShowChat(true);
  }, [toUserId, user, loadConversations]);

  // Scroll to bottom when active conversation changes or new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConvId, conversations]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!activeConvId || !user) return;
    const conv = db.getById('conversations', activeConvId);
    if (!conv) return;

    let changed = false;
    const updatedMessages = conv.messages.map(m => {
      if (m.senderId !== user.id && !m.read) {
        changed = true;
        return { ...m, read: true };
      }
      return m;
    });

    if (changed) {
      db.update('conversations', activeConvId, { messages: updatedMessages });
      loadConversations();
    }
  }, [activeConvId, user, loadConversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = () => {
    const sanitized = DOMPurify.sanitize(messageText.trim());
    if (!sanitized || !activeConv || !user) return;

    const conv = db.getById('conversations', activeConvId);
    if (!conv) return;

    const newMsg = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      senderId: user.id,
      text: sanitized,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...conv.messages, newMsg];
    db.update('conversations', activeConvId, {
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    });

    // Send notification to other user
    const otherId = conv.participants.find(p => p !== user.id);
    addNotification({
      userId: otherId,
      type: 'message',
      title: 'Nuevo mensaje',
      message: `${user.name}: ${sanitized.substring(0, 60)}${sanitized.length > 60 ? '...' : ''}`,
    });

    setMessageText('');
    loadConversations();

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e) => {
    setMessageText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleSelectConv = (convId) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  // Filter conversations
  const filteredConvs = conversations.filter(c =>
    c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="messages-page">
      <Navbar />
      <div className="messages-container">
        {/* LEFT PANEL - Conversation List */}
        <aside className={`msg-sidebar ${mobileShowChat ? 'msg-sidebar--hidden-mobile' : ''}`}>
          <div className="msg-sidebar-header">
            <h2 className="msg-sidebar-title">Mensajes</h2>
            <button className="msg-compose-btn" title="Nuevo mensaje">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          <div className="msg-search-wrapper">
            <svg className="msg-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="msg-search-input"
              placeholder="Buscar conversación..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="msg-conv-list">
            {filteredConvs.length === 0 ? (
              <div className="msg-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>No tienes conversaciones</p>
                <span>Tus mensajes aparecerán aquí</span>
              </div>
            ) : (
              filteredConvs.map(conv => (
                <button
                  key={conv.id}
                  className={`msg-conv-item ${activeConvId === conv.id ? 'msg-conv-item--active' : ''}`}
                  onClick={() => handleSelectConv(conv.id)}
                >
                  <div className="msg-conv-avatar" style={{ background: getAvatarColor(conv.otherUser.name) }}>
                    {getInitials(conv.otherUser.name)}
                  </div>
                  <div className="msg-conv-info">
                    <div className="msg-conv-top">
                      <span className="msg-conv-name">{conv.otherUser.name}</span>
                      <span className="msg-conv-time">{formatRelativeTime(conv.lastMessage?.timestamp)}</span>
                    </div>
                    <div className="msg-conv-bottom">
                      <p className="msg-conv-preview">
                        {conv.lastMessage?.senderId === user.id ? 'Tú: ' : ''}
                        {conv.lastMessage?.text?.substring(0, 45) || 'Sin mensajes'}
                        {(conv.lastMessage?.text?.length || 0) > 45 ? '...' : ''}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="msg-conv-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT PANEL - Chat View */}
        <main className={`msg-chat ${mobileShowChat ? 'msg-chat--visible-mobile' : ''}`}>
          {activeConv ? (
            <>
              <div className="msg-chat-header">
                <button className="msg-back-btn" onClick={handleBackToList}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <Link to={`/usuario/${activeConv.otherUser.id}`} className="msg-chat-user">
                  <div className="msg-chat-avatar" style={{ background: getAvatarColor(activeConv.otherUser.name) }}>
                    {getInitials(activeConv.otherUser.name)}
                  </div>
                  <div>
                    <p className="msg-chat-username">{activeConv.otherUser.name}</p>
                    <p className="msg-chat-faculty">{activeConv.otherUser.faculty || 'UCE'}</p>
                  </div>
                </Link>
              </div>

              <div className="msg-chat-messages">
                {activeConv.messages && activeConv.messages.length > 0 ? (
                  <>
                    {/* Reload from db to get latest messages */}
                    {(() => {
                      const freshConv = db.getById('conversations', activeConvId);
                      const msgs = freshConv?.messages || activeConv.messages;
                      return msgs.map((msg, idx) => (
                        <div key={msg.id}>
                          {shouldShowDateSep(msgs, idx) && (
                            <div className="msg-date-sep">
                              <span>{formatDateSeparator(msg.timestamp)}</span>
                            </div>
                          )}
                          <div className={`msg-bubble-wrap ${msg.senderId === user.id ? 'msg-bubble-wrap--own' : 'msg-bubble-wrap--other'}`}>
                            <div className={`msg-bubble ${msg.senderId === user.id ? 'msg-bubble--own' : 'msg-bubble--other'}`}>
                              <p className="msg-bubble-text">{msg.text}</p>
                              <span className="msg-bubble-time">
                                {formatMessageTime(msg.timestamp)}
                                {msg.senderId === user.id && (
                                  <svg className="msg-read-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={msg.read ? 'var(--color-primary-light)' : 'var(--color-text-muted)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="msg-chat-empty">
                    <div className="msg-chat-empty-avatar" style={{ background: getAvatarColor(activeConv.otherUser.name) }}>
                      {getInitials(activeConv.otherUser.name)}
                    </div>
                    <p>Inicia una conversación con <strong>{activeConv.otherUser.name}</strong></p>
                    <span>Envía un mensaje para comenzar</span>
                  </div>
                )}
              </div>

              <div className="msg-chat-input-area">
                <div className="msg-input-wrapper">
                  <textarea
                    ref={inputRef}
                    className="msg-input"
                    placeholder="Escribe un mensaje..."
                    value={messageText}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button
                    className={`msg-send-btn ${messageText.trim() ? 'msg-send-btn--active' : ''}`}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    title="Enviar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="msg-no-chat">
              <div className="msg-no-chat-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Tus Mensajes</h3>
              <p>Selecciona una conversación para ver los mensajes</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
