import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import db from '../services/db';
import './Home.css';

const CATEGORIES = [
  { id: 'alimentos', name: 'Alimentos', icon: '🍽️' },
  { id: 'ropa', name: 'Ropa y Accesorios', icon: '👕' },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻' },
  { id: 'servicios', name: 'Servicios', icon: '🛠️' },
  { id: 'artesanias', name: 'Artesanías', icon: '🎨' },
  { id: 'otros', name: 'Otros', icon: '📦' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const products = db.query('products', p => p.isFeatured && p.isActive).slice(0, 4);
    setFeaturedProducts(products);
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-content home-page">
        {/* HERO SECTION */}
        <section className="hero-section container">
          <div className="hero-bg-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title animate-fade-in-up">Tienda Digital para tú mundo emprendedor</h1>
            <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              La plataforma de marketplace exclusiva para estudiantes de la tu mundo emprendedor
            </p>
            <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/catalogo" className="btn btn-primary btn-lg">Explorar Productos</Link>
              <Link to="/registro" className="btn btn-outline btn-lg">Comenzar a Vender</Link>
            </div>
            <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Vendedores</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Ventas</span>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="categories-section container">
          <h2 className="section-title">Explora por Categorías</h2>
          <div className="categories-grid stagger-children">
            {CATEGORIES.map(cat => (
              <Link to={`/catalogo?category=${cat.id}`} key={cat.id} className="category-card glass">
                <span className="category-icon">{cat.icon}</span>
                <h3 className="category-name">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="featured-section container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <Link to="/catalogo" className="view-all-link">Ver todos &rarr;</Link>
          </div>
          <div className="products-grid stagger-children">
            {featuredProducts.map(product => (
              <Link to={`/producto/${product.id}`} key={product.id} className="product-card glass">
                <div className="product-image-container">
                  <img src={product.images[0]} alt={product.name} className="product-image" />
                  <span className="product-category-badge">{CATEGORIES.find(c => c.id === product.category)?.name}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-seller">Por {product.sellerName}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="how-it-works-section container">
          <h2 className="section-title text-center">¿Cómo funciona?</h2>
          <div className="steps-grid stagger-children">
            <div className="step-card glass">
              <div className="step-icon">📝</div>
              <h3 className="step-title">1. Regístrate</h3>
              <p className="step-desc">Crea tu cuenta con tu correo institucional @uce.edu.ec</p>
            </div>
            <div className="step-card glass">
              <div className="step-icon">🔍</div>
              <h3 className="step-title">2. Explora o Publica</h3>
              <p className="step-desc">Busca productos o publica los tuyos para vender</p>
            </div>
            <div className="step-card glass">
              <div className="step-icon">🤝</div>
              <h3 className="step-title">3. Conecta y Compra</h3>
              <p className="step-desc">Contacta al vendedor, acuerda el pago y recibe tu producto</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section container">
          <div className="cta-card glass">
            <h2>¿Listo para emprender?</h2>
            <p>Únete a la comunidad de emprendedores universitarios y empieza a vender hoy mismo.</p>
            <Link to="/registro" className="btn btn-primary btn-lg">Crear Cuenta Gratis</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
