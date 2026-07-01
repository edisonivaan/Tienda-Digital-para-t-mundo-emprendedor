import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import db from '../services/db';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Load notifications for current user
  useEffect(() => {
    if (user) {
      const userNotifs = db.query('notifications', n => n.userId === user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(userNotifs);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification) => {
    const newNotif = db.create('notifications', {
      ...notification,
      read: false,
    });
    setNotifications(prev => [newNotif, ...prev]);

    // Also show as toast
    const toastId = Date.now().toString();
    setToasts(prev => [...prev, { ...newNotif, toastId }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== toastId));
    }, 5000);

    return newNotif;
  }, []);

  const markAsRead = useCallback((notifId) => {
    db.update('notifications', notifId, { read: true });
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    notifications.forEach(n => {
      if (!n.read) db.update('notifications', n.id, { read: true });
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [notifications]);

  const deleteNotification = useCallback((notifId) => {
    db.delete('notifications', notifId);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  }, []);

  const showToast = useCallback((title, message, type = 'info') => {
    const toastId = Date.now().toString();
    const toast = { toastId, title, message, type, createdAt: new Date().toISOString() };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== toastId));
    }, 5000);
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  }, []);

  const value = {
    notifications,
    unreadCount,
    toasts,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showToast,
    dismissToast,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}

export default NotificationContext;
