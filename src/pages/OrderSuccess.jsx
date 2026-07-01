import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './OrderSuccess.css';

export default function OrderSuccess() {
  return (
    <>
      <Navbar />
      <main className="page-content container success-page">
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className={`confetti confetti-${i % 5}`}></div>
          ))}
        </div>
        
        <div className="success-card glass">
          <div className="success-icon-container">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          
          <h1 className="success-title">¡Pedido Realizado con Éxito!</h1>
          <p className="success-subtitle">Tu pedido ha sido registrado correctamente y el vendedor ha sido notificado.</p>
          
          <div className="order-status-box">
            <p><strong>Estado:</strong> <span className="status-badge pending">Pendiente de verificación de pago</span></p>
            <p className="status-note">Una vez que el vendedor confirme la transferencia, tu pedido pasará a estado "Pagado".</p>
          </div>
          
          <div className="success-actions">
            <Link to="/perfil" className="btn btn-primary">Ver Mis Compras</Link>
            <Link to="/catalogo" className="btn btn-outline">Seguir Comprando</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
