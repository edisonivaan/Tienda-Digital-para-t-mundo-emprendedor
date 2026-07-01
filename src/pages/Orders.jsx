import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomDropdown from '../components/ui/CustomDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import db from '../services/db';
import './Orders.css';

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('compras'); // 'compras' | 'ventas'
  const [orders, setOrders] = useState([]);
  
  const isSeller = user && (user.role === 'vendedor' || user.role === 'admin');

  const loadOrders = () => {
    const allOrders = db.getAll('orders');
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Compras: el usuario es el comprador
  const myPurchases = orders.filter(o => o.buyerId === user.id);
  const pendingPurchases = myPurchases.filter(o => o.status === 'pendiente');

  // Ventas: el usuario es el vendedor de al menos un ítem
  const mySales = orders.filter(o => o.items.some(item => item.sellerId === user.id));
  const pendingSales = mySales.filter(o => o.status === 'pendiente');

  const handleUpdateStatus = (orderId, newStatus) => {
    db.update('orders', orderId, { status: newStatus });
    showToast('Éxito', `Estado del pedido actualizado a ${newStatus}`, 'success');
    loadOrders();
  };

  const getStatusBadge = (status) => {
    if (status === 'pendiente') return <span className="order-badge pending">Pendiente</span>;
    if (status === 'completado') return <span className="order-badge completed">Completado</span>;
    if (status === 'cancelado') return <span className="order-badge cancelled">Cancelado</span>;
    return <span className="order-badge">{status}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha desconocida';
    return new Date(dateStr).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <main className="page-content container orders-page">
        <h1 className="section-title text-left">Pedidos Activos</h1>

        <div className="orders-layout">
          <aside className="orders-sidebar glass">
            <nav className="orders-nav">
              <button 
                className={`orders-nav-btn ${activeTab === 'compras' ? 'active' : ''}`}
                onClick={() => setActiveTab('compras')}
              >
                🛒 Mis Compras Pendientes
              </button>
              {isSeller && (
                <button 
                  className={`orders-nav-btn ${activeTab === 'ventas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ventas')}
                >
                  🏪 Solicitudes de Clientes
                </button>
              )}
            </nav>
          </aside>

          <div className="orders-content glass">
            {activeTab === 'compras' && (
              <div className="orders-tab">
                <h2 className="orders-tab-title">Tus Compras en Proceso</h2>
                
                {pendingPurchases.length === 0 ? (
                  <div className="orders-empty">
                    <span className="orders-empty-icon">📦</span>
                    <h3>No tienes pedidos pendientes</h3>
                    <p>Tus compras activas aparecerán aquí hasta que sean completadas.</p>
                    <Link to="/catalogo" className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>Ir al Catálogo</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {pendingPurchases.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <span className="order-id">Pedido #{order.id.slice(0,8).toUpperCase()}</span>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="order-body">
                          <div className="order-items">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                <span className="order-item-qty">{item.quantity}x</span>
                                <span className="order-item-name">{item.name}</span>
                                <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="order-summary">
                            <span>Total Pagado:</span>
                            <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ventas' && isSeller && (
              <div className="orders-tab">
                <h2 className="orders-tab-title">Solicitudes Pendientes de Clientes</h2>
                
                {pendingSales.length === 0 ? (
                  <div className="orders-empty">
                    <span className="orders-empty-icon">🔔</span>
                    <h3>Todo al día</h3>
                    <p>No tienes solicitudes pendientes de clientes en este momento.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {pendingSales.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <span className="order-id">Solicitud #{order.id.slice(0,8).toUpperCase()}</span>
                            <span className="order-date">{formatDate(order.createdAt)} - Cliente: {order.buyerName}</span>
                          </div>
                          <div className="order-status-update">
                            <CustomDropdown
                              value={order.status}
                              options={[
                                { value: 'pendiente', label: 'Pendiente' },
                                { value: 'completado', label: 'Marcar Completado' },
                                { value: 'cancelado', label: 'Rechazar / Cancelar' }
                              ]}
                              onChange={(val) => handleUpdateStatus(order.id, val)}
                              className="order-status-dropdown"
                            />
                          </div>
                        </div>
                        <div className="order-body">
                          <div className="order-items">
                            {order.items.filter(i => i.sellerId === user.id).map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                <span className="order-item-qty">{item.quantity}x</span>
                                <span className="order-item-name">{item.name}</span>
                                <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="order-summary">
                            <span>Monto a cobrar:</span>
                            <span className="order-total">
                              ${order.items.filter(i => i.sellerId === user.id).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
