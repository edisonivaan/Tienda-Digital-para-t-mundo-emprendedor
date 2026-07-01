import { useNotifications } from '../../contexts/NotificationContext';
import './NotificationPanel.css';

const TYPE_ICONS = {
  sale: '🛒',
  purchase: '📦',
  message: '💬',
  system: '⚙️',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Ahora mismo';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `hace ${weeks} sem`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months > 1 ? 'es' : ''}`;
}

export default function NotificationPanel({ onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  function handleItemClick(notif) {
    if (!notif.read) {
      markAsRead(notif.id);
    }
  }

  return (
    <div className="notif-panel">
      {/* Header */}
      <div className="notif-panel__header">
        <h3 className="notif-panel__title">Notificaciones</h3>
        {notifications.length > 0 && (
          <button className="notif-panel__mark-read" onClick={markAllAsRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* List or Empty */}
      {notifications.length === 0 ? (
        <div className="notif-panel__empty">
          <span className="notif-panel__empty-icon">🔕</span>
          <p className="notif-panel__empty-text">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="notif-panel__list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-panel__item${!notif.read ? ' notif-panel__item--unread' : ''}`}
              onClick={() => handleItemClick(notif)}
            >
              <div className={`notif-panel__icon notif-panel__icon--${notif.type || 'system'}`}>
                {TYPE_ICONS[notif.type] || '⚙️'}
              </div>
              <div className="notif-panel__content">
                <div className="notif-panel__item-title">{notif.title}</div>
                <div className="notif-panel__item-message">{notif.message}</div>
                <div className="notif-panel__item-time">{timeAgo(notif.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
