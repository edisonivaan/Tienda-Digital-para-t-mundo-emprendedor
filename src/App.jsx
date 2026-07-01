import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { lazy, Suspense } from 'react';
import Toast from './components/ui/Toast';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const PublishProduct = lazy(() => import('./pages/PublishProduct'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const Messages = lazy(() => import('./pages/Messages'));
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Orders = lazy(() => import('./pages/Orders'));

// Loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div className="page-spinner" />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Cargando...</p>
        <style>{`
          .page-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-border);
            border-top-color: var(--color-primary-light);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/perfil/:userId" element={<Profile />} />

          {/* Protected routes */}
          <Route path="/perfil" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/publicar" element={
            <ProtectedRoute><PublishProduct /></ProtectedRoute>
          } />
          <Route path="/editar-producto/:id" element={
            <ProtectedRoute><PublishProduct /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/pedido-exitoso" element={
            <ProtectedRoute><OrderSuccess /></ProtectedRoute>
          } />
          <Route path="/pedidos" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/mensajes" element={
            <ProtectedRoute><Messages /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              color: 'var(--color-text)',
              textAlign: 'center',
              padding: '2rem',
            }}>
              <span style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</span>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Página no encontrada</h1>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                La página que buscas no existe o fue movida.
              </p>
              <a href="/" style={{
                padding: '12px 24px',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '600',
              }}>Volver al Inicio</a>
            </div>
          } />
        </Routes>
      </Suspense>
      <Toast />
    </>
  );
}
