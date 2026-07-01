import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import db from '../services/db';
import { CATEGORIES } from '../services/seedData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Profile.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile, switchRole } = useAuth();
  const { showToast } = useNotifications();
  
  const [profileUser, setProfileUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('products');

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);

  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      navigate('/login');
      return;
    }

    const u = db.getById('users', targetUserId);
    if (!u) {
      navigate('/');
      return;
    }
    
    setProfileUser(u);
    setEditForm({
      name: u.name || '',
      faculty: u.faculty || '',
      career: u.career || '',
      bio: u.bio || '',
      phone: u.phone || ''
    });

    // Load products
    const userProducts = db.query('products', p => p.sellerId === targetUserId && (isOwnProfile || p.isActive));
    setProducts(userProducts);

    // If own profile, load orders
    if (isOwnProfile) {
      const allOrders = db.getAll('orders');
      setPurchases(allOrders.filter(o => o.buyerId === targetUserId));
      
      // Load sales where this user is the seller of at least one item
      const mySales = allOrders.filter(o => o.items.some(item => item.sellerId === targetUserId));
      setSales(mySales);
    }
  }, [userId, currentUser, isOwnProfile, navigate]);

  // --- Statistics Calculations ---
  const statsData = useMemo(() => {
    if (!isOwnProfile || profileUser?.role !== 'vendedor') return null;

    let totalRevenue = 0;
    let completedSales = 0;
    let pendingSales = 0;
    const activeProducts = products.filter(p => p.isActive).length;
    
    // For revenue chart
    const revenueByDate = {};
    // For products pie chart
    const productSalesCount = {};

    sales.forEach(order => {
      // Only count items belonging to this seller
      const sellerItems = order.items.filter(i => i.sellerId === currentUser?.id);
      
      const orderRevenue = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (order.status === 'completado' || order.status === 'pagado') {
        totalRevenue += orderRevenue;
        completedSales++;

        // Revenue over time (group by day)
        const dateKey = new Date(order.createdAt).toLocaleDateString();
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + orderRevenue;
        
        // Product popularity
        sellerItems.forEach(item => {
          productSalesCount[item.name] = (productSalesCount[item.name] || 0) + item.quantity;
        });
      } else if (order.status === 'pendiente') {
        pendingSales++;
      }
    });

    // Format for charts
    const chartData = Object.keys(revenueByDate).map(date => ({
      date,
      ingresos: revenueByDate[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get top 5 selling products
    const pieData = Object.keys(productSalesCount)
      .map(name => ({ name, value: productSalesCount[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { totalRevenue, completedSales, pendingSales, activeProducts, chartData, pieData };
  }, [sales, products, isOwnProfile, profileUser, currentUser]);
  // ------------------------------

  if (!profileUser) return null;

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setProfileUser(prev => ({ ...prev, ...editForm }));
    setIsEditing(false);
    showToast('Éxito', 'Perfil actualizado correctamente', 'success');
  };

  const renderTabContent = () => {
    if (activeTab === 'products') {
      return (
        <div className="profile-products grid">
          {products.length === 0 ? (
            <p className="empty-text">No hay productos publicados.</p>
          ) : (
            products.map(p => (
              <div key={p.id} className="product-card glass mini">
                <Link to={`/producto/${p.id}`} className="product-image-container">
                  <img src={p.images[0]} alt={p.name} />
                  {!p.isActive && <span className="inactive-badge">Oculto</span>}
                </Link>
                <div className="product-info">
                  <h4>{p.name}</h4>
                  <p className="price">${p.price.toFixed(2)}</p>
                  {isOwnProfile && (
                    <Link to={`/editar-producto/${p.id}`} className="edit-link">Editar</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      );
    }
    
    if (activeTab === 'purchases' && isOwnProfile) {
      return (
        <div className="profile-orders list">
          {purchases.length === 0 ? (
            <p className="empty-text">No has realizado compras.</p>
          ) : (
            purchases.map(o => (
              <div key={o.id} className="order-card glass">
                <div className="order-header">
                  <span>Pedido #{o.id.substring(o.id.length - 6).toUpperCase()}</span>
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </div>
                <div className="order-details">
                  <p><strong>Total:</strong> ${o.total.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'sales' && isOwnProfile) {
      return (
        <div className="profile-orders list">
          {sales.length === 0 ? (
            <p className="empty-text">No has realizado ventas.</p>
          ) : (
            sales.map(o => (
              <div key={o.id} className="order-card glass">
                <div className="order-header">
                  <span>Venta #{o.id.substring(o.id.length - 6).toUpperCase()}</span>
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </div>
                <div className="order-details">
                  <p><strong>Comprador:</strong> {o.buyerName}</p>
                  <p><strong>Total Pedido:</strong> ${o.total.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                {o.status === 'pendiente' && (
                  <button 
                    className="btn btn-outline btn-sm mt-2"
                    onClick={() => {
                      db.update('orders', o.id, { status: 'pagado' });
                      setSales(prev => prev.map(order => order.id === o.id ? { ...order, status: 'pagado' } : order));
                    }}
                  >
                    Marcar como Pagado
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'statistics' && isOwnProfile && profileUser.role === 'vendedor') {
      if (!statsData) return null;
      
      return (
        <div className="profile-statistics">
          <div className="stats-cards-grid">
            <div className="stat-card glass">
              <span className="stat-icon">💰</span>
              <div className="stat-info">
                <h3>Ingresos Totales</h3>
                <p className="stat-value text-primary">${statsData.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <div className="stat-card glass">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <h3>Ventas Exitosas</h3>
                <p className="stat-value">{statsData.completedSales}</p>
              </div>
            </div>
            <div className="stat-card glass">
              <span className="stat-icon">⏳</span>
              <div className="stat-info">
                <h3>Solicitudes Pendientes</h3>
                <p className="stat-value text-warning">{statsData.pendingSales}</p>
              </div>
            </div>
            <div className="stat-card glass">
              <span className="stat-icon">📦</span>
              <div className="stat-info">
                <h3>Productos Activos</h3>
                <p className="stat-value">{statsData.activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container glass">
              <h3>Evolución de Ingresos</h3>
              {statsData.chartData.length > 0 ? (
                <div className="recharts-wrapper-custom">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={statsData.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--color-primary-light)' }}
                        formatter={(value) => [`$${value}`, 'Ingresos']}
                      />
                      <Line type="monotone" dataKey="ingresos" stroke="var(--color-primary-light)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">Aún no hay suficientes datos de ventas.</div>
              )}
            </div>

            <div className="chart-container glass">
              <h3>Productos Más Vendidos</h3>
              {statsData.pieData.length > 0 ? (
                <div className="recharts-wrapper-custom">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statsData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                        formatter={(value) => [`${value} uds.`, 'Cantidad']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {statsData.pieData.map((entry, index) => (
                      <div key={`legend-${index}`} className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="legend-label">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-chart">No hay productos vendidos aún.</div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-content container profile-page">
        
        {/* Profile Header */}
        <div className="profile-header glass">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} alt={profileUser.name} />
              ) : (
                <span>{profileUser.name.charAt(0)}</span>
              )}
            </div>
            {isOwnProfile && isEditing && (
              <div className="avatar-edit-overlay">
                <span>📷</span>
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nombre" />
                <input type="text" name="faculty" value={editForm.faculty} onChange={handleEditChange} placeholder="Facultad" />
                <input type="text" name="career" value={editForm.career} onChange={handleEditChange} placeholder="Carrera" />
                <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Teléfono" />
                <textarea name="bio" value={editForm.bio} onChange={handleEditChange} placeholder="Sobre ti..." rows="3"></textarea>
                <div className="edit-actions">
                  <button className="btn btn-primary" onClick={handleSaveProfile}>Guardar</button>
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-title-row">
                  <h1>{profileUser.name}</h1>
                  {profileUser.role === 'vendedor' && <span className="role-badge">Vendedor</span>}
                </div>
                <p className="profile-academic">{profileUser.faculty} • {profileUser.career}</p>
                <p className="profile-bio">{profileUser.bio || 'Sin biografía.'}</p>
                
                <div className="profile-stats">
                  <div className="stat">
                    <strong>{profileUser.rating ? profileUser.rating.toFixed(1) : '-'}</strong> ⭐ Calificación
                  </div>
                  <div className="stat">
                    <strong>{products.length}</strong> Productos
                  </div>
                  <div className="stat">
                    <strong>{profileUser.totalSales || sales.length}</strong> Ventas
                  </div>
                </div>

                <div className="profile-actions">
                  {isOwnProfile ? (
                    <>
                      <button className="btn btn-outline" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                      {profileUser.role === 'comprador' && (
                        <button className="btn btn-primary" onClick={() => switchRole('vendedor')}>Convertirme en Vendedor</button>
                      )}
                    </>
                  ) : (
                    <Link to={`/mensajes?to=${profileUser.id}`} className="btn btn-primary">💬 Enviar Mensaje</Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content glass">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              {isOwnProfile ? 'Mis Productos' : 'Productos Publicados'}
            </button>
            {isOwnProfile && (
              <button 
                className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
                onClick={() => setActiveTab('purchases')}
              >
                Historial de Compras
              </button>
            )}
            {isOwnProfile && profileUser.role === 'vendedor' && (
              <button 
                className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
                onClick={() => setActiveTab('sales')}
              >
                Historial de Ventas
              </button>
            )}
            {isOwnProfile && profileUser.role === 'vendedor' && (
              <button 
                className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistics')}
              >
                Estadísticas
              </button>
            )}
          </div>
          
          <div className="tab-pane">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
