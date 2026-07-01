import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, total } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <main className="cart">
        <div className="cart__inner">
          <h1 className="cart__title">Mi Carrito de Compras <span>({items.length} items)</span></h1>

          {items.length === 0 ? (
            <div className="cart__empty glass">
              <span className="cart__empty-icon">🛒</span>
              <h2>Tu carrito está vacío</h2>
              <p>Parece que aún no has añadido productos. Descubre las creaciones de nuestra comunidad.</p>
              <Link to="/catalogo" className="cart__empty-link">
                Explorar Productos
              </Link>
            </div>
          ) : (
            <div className="cart__layout">
              <div className="cart__items">
                {items.map(item => (
                  <div key={item.productId} className="cart__item">
                    <div className="cart__item-image">
                      <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                    </div>
                    <div className="cart__item-info">
                      <Link to={`/producto/${item.productId}`} className="cart__item-name">{item.name}</Link>
                      <p className="cart__item-seller">Vendido por: {item.sellerName}</p>
                      <p className="cart__item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart__item-qty">
                      <button 
                        className="cart__qty-btn" 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >-</button>
                      <input 
                        type="number" 
                        className="cart__qty-input" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.maxStock}
                      />
                      <button 
                        className="cart__qty-btn" 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >+</button>
                    </div>
                    <div className="cart__item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button className="cart__item-remove" onClick={() => removeItem(item.productId)} title="Eliminar">
                      ✕
                    </button>
                  </div>
                ))}
                
                <div>
                  <button className="cart__clear-btn" onClick={clearCart}>Vaciar Carrito</button>
                  <Link to="/catalogo" className="cart__continue-link">Seguir Comprando &rarr;</Link>
                </div>
              </div>

              <div className="cart__summary">
                <h2>Resumen de la Orden</h2>
                <div className="cart__summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart__summary-row">
                  <span>Envío</span>
                  <span>Acordar con vendedor</span>
                </div>
                <div className="cart__summary-divider"></div>
                <div className="cart__summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                {isAuthenticated ? (
                  <Link to="/checkout" className="cart__checkout-btn">
                    Proceder al Pago
                  </Link>
                ) : (
                  <Link to="/login?redirect=/checkout" className="cart__checkout-btn" style={{background: 'var(--color-bg-glass)', border: '1px solid var(--color-primary)'}}>
                    Inicia sesión para comprar
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
