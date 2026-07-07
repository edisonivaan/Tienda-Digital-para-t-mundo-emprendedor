import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import db from '../services/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted session
    const savedUser = localStorage.getItem('uce_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('uce_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    // Validate UCE email domain
    if (!email.endsWith('@uce.edu.ec')) {
      return { success: false, error: 'Solo se permiten correos institucionales @uce.edu.ec' };
    }

    const users = db.getAll('users');
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }

    if (!found.isActive) {
      return { success: false, error: 'Tu cuenta ha sido desactivada. Contacta al administrador.' };
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('uce_current_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, []);

  const register = useCallback((userData) => {
    const { email, password, name, faculty, career } = userData;

    // Validate UCE email
    if (!email.endsWith('@uce.edu.ec')) {
      return { success: false, error: 'Solo se permiten correos institucionales @uce.edu.ec' };
    }

    // Validate fields
    if (!name || name.trim().length < 3) {
      return { success: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Check if email already exists
    const existing = db.query('users', u => u.email === email);
    if (existing.length > 0) {
      return { success: false, error: 'Ya existe una cuenta con este correo' };
    }

    const newUser = db.create('users', {
      email,
      password,
      name: name.trim(),
      avatar: '',
      role: 'comprador',
      faculty: faculty || '',
      career: career || '',
      bio: '',
      phone: '',
      rating: 0,
      totalSales: 0,
      isActive: true,
    });

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('uce_current_user', JSON.stringify(safeUser));

    // Welcome notification
    db.create('notifications', {
      userId: newUser.id,
      type: 'system',
      title: '¡Bienvenido a Tienda Digital!',
      message: 'Tu cuenta ha sido creada exitosamente. Explora los productos disponibles o empieza a vender.',
      read: false,
    });

    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('uce_current_user');
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return { success: false, error: 'No autenticado' };

    const updated = db.update('users', user.id, updates);
    if (!updated) return { success: false, error: 'Error al actualizar perfil' };

    const { password: _, ...safeUser } = updated;
    setUser(safeUser);
    localStorage.setItem('uce_current_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, [user]);

  const switchRole = useCallback((newRole) => {
    if (!user) return;
    if (newRole !== 'comprador' && newRole !== 'vendedor') return;
    const updated = db.update('users', user.id, { role: newRole });
    if (updated) {
      const { password: _, ...safeUser } = updated;
      setUser(safeUser);
      localStorage.setItem('uce_current_user', JSON.stringify(safeUser));
    }
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'vendedor',
    login,
    register,
    logout,
    updateProfile,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
