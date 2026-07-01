import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import db from '../services/db';
import { CATEGORIES } from '../services/seedData';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    const p = db.getById('products', id);
    if (!p) {
      setLoading(false);
      return;
    }

    // Increment views
    db.update('products', id, { views: (p.views || 0) + 1 });
    
    setProduct(p);
    setActiveImage(p.images[0]);
    
    const s = db.getById('users', p.sellerId);
    setSeller(s);
    
    const similar = db.query('products', x => x.category === p.category && x.id !== p.id && x.isActive).slice(0, 4);
    setSimilarProducts(similar);
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-content container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: '100%', height: '500px' }}></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="page-content container text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</span>
          <h2>Producto no encontrado</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/catalogo" className="btn btn-primary">Volver al Catálogo</Link>
        </main>
        <Footer />
      </>
    );
  }

  const categoryName = CATEGORIES.find(c => c.id === product.category)?.name || product.category;

  return (
    <>
      <Navbar />
      <main className="page-content container product-detail-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> &gt; 
          <Link to="/catalogo">Catálogo</Link> &gt; 
          <Link to={`/catalogo?category=${product.category}`}>{categoryName}</Link> &gt; 
          <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          {/* LEFT: Images */}
          <div className="product-gallery">
            <div className="main-image-container glass">
              <img src={activeImage} alt={product.name} className="main-image" />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="product-details glass">
            <span className="category-badge">{categoryName}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price-large">${product.price.toFixed(2)}</div>
            
            {seller && (
              <Link to={`/perfil/${seller.id}`} className="seller-card">
                <div className="seller-avatar">
                  {seller.avatar ? <img src={seller.avatar} alt={seller.name} /> : <span>{seller.name.charAt(0)}</span>}
                </div>
                <div className="seller-info">
                  <span className="seller-name">{seller.name}</span>
                  <span className="seller-rating">⭐ {seller.rating ? seller.rating.toFixed(1) : 'Nuevo'}</span>
                </div>
              </Link>
            )}

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="out-of-stock">✗ Agotado</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="purchase-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))} 
                    min="1" 
                    max={product.stock} 
                  />
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <button 
                  className="btn btn-primary btn-full-width add-to-cart-btn"
                  onClick={() => addItem(product, quantity)}
                >
                  Agregar al Carrito
                </button>
              </div>
            )}

            <button 
              className="btn btn-outline btn-full-width contact-btn"
              onClick={() => {
                if (!user) {
                  navigate('/login?redirect=/mensajes?to=' + product.sellerId);
                } else {
                  navigate('/mensajes?to=' + product.sellerId);
                }
              }}
            >
              💬 Contactar al Vendedor
            </button>
            
            {user && user.id === product.sellerId && (
              <Link to={`/editar-producto/${product.id}`} className="btn btn-outline btn-full-width edit-btn" style={{ marginTop: '1rem', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
                ✏️ Editar Producto
              </Link>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="similar-products">
            <h2 className="section-title text-left">Productos Similares</h2>
            <div className="products-grid">
              {similarProducts.map(p => (
                <Link to={`/producto/${p.id}`} key={p.id} className="product-card glass">
                  <div className="product-image-container">
                    <img src={p.images[0]} alt={p.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-price">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
