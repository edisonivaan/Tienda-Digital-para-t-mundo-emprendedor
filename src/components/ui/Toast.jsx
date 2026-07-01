import { useNotifications } from '../../contexts/NotificationContext';
import './Toast.css';

const TYPE_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export default function Toast() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        return (
          <div key={toast.toastId} className={`toast toast--${type}`} role="alert">
            <div className="toast__icon">
              {TYPE_ICONS[type] || 'ℹ️'}
            </div>
            <div className="toast__content">
              {toast.title && <div className="toast__title">{toast.title}</div>}
              {toast.message && <div className="toast__message">{toast.message}</div>}
            </div>
            <button
              className="toast__close"
              onClick={() => dismissToast(toast.toastId)}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
            <div className="toast__progress" />
          </div>
        );
      })}
    </div>
  );
}
