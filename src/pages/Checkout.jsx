import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import db from '../services/db';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification, showToast } = useNotifications();
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState('');

  // If empty cart, redirect (handled in render usually, but good to have)
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="page-content container text-center">
          <h2>No hay items en tu carrito</h2>
          <Link to="/catalogo" className="btn btn-primary mt-4">Volver al Catálogo</Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleConfirmOrder = () => {
    if (!confirmed) return;

    // Group items by seller to create separate orders or just one combined order
    // For simplicity, we'll create one order record but notify all sellers involved
    const order = db.create('orders', {
      buyerId: user.id,
      buyerName: user.name,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sellerId: item.sellerId
      })),
      total,
      status: 'pendiente',
      paymentMethod: 'transferencia',
      paymentReference: reference
    });

    // Notify sellers
    const uniqueSellers = Array.from(new Set(items.map(item => item.sellerId)));
    uniqueSellers.forEach(sellerId => {
      addNotification({
        userId: sellerId,
        type: 'sale',
        title: '¡Nueva Venta!',
        message: `${user.name} ha comprado productos tuyos. Revisa tus pedidos.`
      });
    });

    clearCart();
    showToast('¡Éxito!', 'Pedido realizado correctamente', 'success');
    navigate('/pedido-exitoso');
  };

  return (
    <>
      <Navbar />
      <main className="page-content container checkout-page">
        <h1 className="section-title text-left">Finalizar Compra</h1>

        <div className="checkout-layout">
          <div className="checkout-steps">
            <div className="checkout-step glass">
              <h2 className="step-number">1. Resumen de Artículos</h2>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.productId} className="checkout-item-row">
                    <img src={item.image} alt={item.name} className="checkout-item-img" />
                    <div className="checkout-item-info">
                      <h4>{item.name}</h4>
                      <p>Cant: {item.quantity}</p>
                    </div>
                    <div className="checkout-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkout-step glass">
              <h2 className="step-number">2. Método de Pago</h2>
              
              <div className="payment-methods">
                <label className="payment-method-card selected">
                  <input type="radio" name="payment" value="transferencia" defaultChecked />
                  <div className="payment-method-info">
                    <h3>🏦 Transferencia Bancaria</h3>
                    <div className="bank-details">
                      <p><strong>Banco:</strong> Pichincha</p>
                      <p><strong>Cuenta de Ahorros:</strong> 2205XXXXXX</p>
                      <p><strong>CI:</strong> 17XXXXXXXX</p>
                      <p><strong>Nombre:</strong> UCE Marketplace</p>
                    </div>
                    <div className="payment-reference">
                      <label>Referencia / Comprobante (Opcional)</label>
                      <input 
                        type="text" 
                        placeholder="N° de comprobante" 
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                      />
                    </div>
                  </div>
                </label>

                <label className="payment-method-card disabled">
                  <input type="radio" name="payment" value="payphone" disabled />
                  <div className="payment-method-info">
                    <h3>📱 Payphone</h3>
                    <p className="coming-soon">Próximamente</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="checkout-step glass">
              <h2 className="step-number">3. Confirmación</h2>
              <label className="confirmation-checkbox">
                <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                />
                <span>Confirmo que he realizado la transferencia o depósito correspondiente al total de mi compra.</span>
              </label>
            </div>
          </div>

          <div className="checkout-summary glass">
            <h3>Resumen de la Orden</h3>
            <div className="summary-row">
              <span>Artículos ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total a Pagar</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-full-width" 
              disabled={!confirmed}
              onClick={handleConfirmOrder}
            >
              Confirmar Pedido
            </button>
            <p className="security-note">🔒 Transacción segura. Tus datos están protegidos.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
