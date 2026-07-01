import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomDropdown from '../components/ui/CustomDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import db from '../services/db';
import './Admin.css';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({ users: 0, products: 0, sales: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    
    // Load data
    const allUsers = db.getAll('users');
    const allProducts = db.getAll('products');
    const allOrders = db.getAll('orders');
    
    setUsers(allUsers);
    setProducts(allProducts);
    
    const completedOrders = allOrders.filter(o => o.status === 'completado' || o.status === 'pagado');
    const totalRev = completedOrders.reduce((sum, o) => sum + o.total, 0);
    
    setStats({
      users: allUsers.length,
      products: allProducts.length,
      sales: completedOrders.length,
      revenue: totalRev
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handleToggleUserStatus = (userId, currentStatus) => {
    db.update('users', userId, { isActive: !currentStatus });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
    showToast('Éxito', `Usuario ${!currentStatus ? 'activado' : 'desactivado'}`, 'success');
  };

  const handleToggleProductStatus = (productId, currentStatus) => {
    db.update('products', productId, { isActive: !currentStatus });
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: !currentStatus } : p));
    showToast('Éxito', `Producto ${!currentStatus ? 'activado' : 'desactivado'}`, 'success');
  };

  const handleChangeRole = (userId, newRole) => {
    db.update('users', userId, { role: newRole });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast('Éxito', `Rol actualizado a ${newRole}`, 'success');
  };

  return (
    <>
      <Navbar />
      <main className="page-content container admin-page">
        <h1 className="section-title text-left">Panel de Administración</h1>

        <div className="admin-layout">
          <aside className="admin-sidebar glass">
            <nav className="admin-nav">
              <button 
                className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >📊 Dashboard</button>
              <button 
                className={`admin-nav-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
                onClick={() => setActiveTab('usuarios')}
              >👥 Usuarios</button>
              <button 
                className={`admin-nav-btn ${activeTab === 'productos' ? 'active' : ''}`}
                onClick={() => setActiveTab('productos')}
              >📦 Productos</button>
              <button 
                className={`admin-nav-btn ${activeTab === 'reportes' ? 'active' : ''}`}
                onClick={() => setActiveTab('reportes')}
              >⚠️ Reportes</button>
            </nav>
          </aside>

          <div className="admin-content glass">
            {activeTab === 'dashboard' && (
              <div className="admin-tab dashboard-tab">
                <h2>Resumen General</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <h3>Total Usuarios</h3>
                    <p className="stat-value">{stats.users}</p>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <h3>Productos Publicados</h3>
                    <p className="stat-value">{stats.products}</p>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🛒</span>
                    <h3>Ventas Realizadas</h3>
                    <p className="stat-value">{stats.sales}</p>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <h3>Volumen de Ventas</h3>
                    <p className="stat-value">${stats.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div className="admin-tab">
                <h2>Gestión de Usuarios</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <CustomDropdown
                              value={u.role}
                              options={[
                                { value: 'comprador', label: 'Comprador' },
                                { value: 'vendedor', label: 'Vendedor' },
                                { value: 'admin', label: 'Admin' }
                              ]}
                              onChange={(val) => handleChangeRole(u.id, val)}
                              className={`role-badge ${u.role}`}
                              disabled={u.id === user.id} // prevent self demotion
                              direction="up"
                            />
                          </td>
                          <td>
                            <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                              {u.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                              disabled={u.id === user.id}
                            >
                              {u.isActive ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'productos' && (
              <div className="admin-tab">
                <h2>Gestión de Productos</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Vendedor</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product-cell">
                              <img src={p.images[0]} alt="" className="table-thumb" />
                              <span className="truncate">{p.name}</span>
                            </div>
                          </td>
                          <td>{p.sellerName}</td>
                          <td>${p.price.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`}>
                              {p.isActive ? 'Activo' : 'Oculto'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => handleToggleProductStatus(p.id, p.isActive)}
                            >
                              {p.isActive ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reportes' && (
              <div className="admin-tab text-center" style={{ padding: '3rem' }}>
                <span style={{ fontSize: '4rem' }}>🎉</span>
                <h2>No hay reportes pendientes</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>La comunidad se está comportando excelente.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
