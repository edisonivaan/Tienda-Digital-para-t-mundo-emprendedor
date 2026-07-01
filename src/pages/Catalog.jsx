import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomDropdown from '../components/ui/CustomDropdown';
import db from '../services/db';
import { useCart } from '../contexts/CartContext';
import { CATEGORIES } from '../services/seedData';
import './Catalog.css';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const { addItem } = useCart();
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load products and active sellers
    const allProducts = db.query('products', p => p.isActive);
    setProducts(allProducts);
    
    // Extract unique sellers who have active products
    const uniqueSellers = Array.from(new Set(allProducts.map(p => p.sellerId)))
      .map(id => allProducts.find(p => p.sellerId === id))
      .map(p => ({ id: p.sellerId, name: p.sellerName }));
      
    setSellers(uniqueSellers);
  }, []);

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev => {
      const newCats = prev.includes(catId) 
        ? prev.filter(c => c !== catId)
        : [...prev, catId];
      
      // Update URL params
      if (newCats.length === 1) {
        searchParams.set('category', newCats[0]);
      } else {
        searchParams.delete('category');
      }
      setSearchParams(searchParams);
      return newCats;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedSeller('');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };



  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchMinPrice = minPrice === '' || p.price >= parseFloat(minPrice);
      const matchMaxPrice = maxPrice === '' || p.price <= parseFloat(maxPrice);
      const matchSeller = selectedSeller === '' || p.sellerId === selectedSeller;
      
      return matchSearch && matchCategory && matchMinPrice && matchMaxPrice && matchSeller;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'sales') return (b.sales || 0) - (a.sales || 0);
      // Default: recent
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchTerm, selectedCategories, minPrice, maxPrice, selectedSeller, sortBy]);

  const sortOptions = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'sales', label: 'Más vendidos' }
  ];

  return (
    <>
      <Navbar />
      <main className="page-content container catalog">
        <div className="catalog__layout">
          
          {/* Mobile Filter Toggle */}
          <button className="catalog__filter-toggle" onClick={() => setIsSidebarOpen(true)} style={{marginBottom: 'var(--space-4)'}}>
            <span>⚙️</span> Filtros
          </button>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div className="catalog__sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* SIDEBAR FILTERS */}
          <aside className={`catalog__sidebar ${isSidebarOpen ? 'catalog__sidebar--open' : ''}`}>
            <div className="catalog__sidebar-card">
              <button className="catalog__sidebar-close" onClick={() => setIsSidebarOpen(false)}>✕</button>
              <div className="catalog__header" style={{marginBottom: 0}}>
                <h2 style={{fontSize: '1.2rem', margin: 0}}>Filtros</h2>
                <button className="catalog__clear-btn" style={{padding: 'var(--space-2)', width: 'auto'}} onClick={clearFilters}>Limpiar</button>
              </div>
              
              <div className="catalog__filter-section">
                <h3>Categorías</h3>
                <div>
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="catalog__filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <span>{cat.icon} {cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="catalog__filter-section">
                <h3>Ordenar por</h3>
                <CustomDropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={(val) => setSortBy(val)}
                />
              </div>

              <div className="catalog__filter-section">
                <h3>Vendedor</h3>
                <CustomDropdown
                  value={selectedSeller}
                  options={[
                    { value: '', label: 'Todos los vendedores' },
                    ...sellers.map(s => ({ value: s.id, label: s.name }))
                  ]}
                  onChange={(val) => setSelectedSeller(val)}
                  placeholder="Todos los vendedores"
                />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="catalog__main">
            <div className="catalog__search-bar">
              <span className="catalog__search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
              
            <div className="catalog__header">
              <span className="catalog__result-count"><strong>{filteredProducts.length}</strong> resultados</span>
              
              <div className="catalog__header-actions">
                <div className="catalog__view-toggles">
                  <button 
                    className={`catalog__view-btn ${viewMode === 'grid' ? 'catalog__view-btn--active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Vista en cuadrícula"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </button>
                  <button 
                    className={`catalog__view-btn ${viewMode === 'list' ? 'catalog__view-btn--active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="Vista en lista"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="catalog__empty glass">
                <span className="catalog__empty-icon">🏜️</span>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar o limpiar tus filtros</p>
                <button className="catalog__clear-btn" onClick={clearFilters}>Limpiar Filtros</button>
              </div>
            ) : (
              <div className={`catalog__grid ${viewMode === 'list' ? 'catalog__grid--list' : ''} stagger-children`}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="catalog__card">
                    <Link to={`/producto/${product.id}`}>
                      <div className="catalog__card-image-wrap">
                        <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} className="catalog__card-image" />
                        <span className="catalog__card-category">
                          {CATEGORIES.find(c => c.id === product.category)?.name}
                        </span>
                      </div>
                    </Link>
                    <div className="catalog__card-body">
                      <Link to={`/producto/${product.id}`} className="catalog__card-name">{product.name}</Link>
                      <Link to={`/perfil/${product.sellerId}`} className="catalog__card-seller">
                        <div className="catalog__card-seller-avatar">
                          {product.sellerName?.charAt(0).toUpperCase()}
                        </div>
                        {product.sellerName}
                      </Link>
                      
                      {viewMode === 'list' && (
                        <p style={{color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-2) 0'}}>{product.description}</p>
                      )}
                      
                      <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span className="catalog__card-price">${product.price.toFixed(2)}</span>
                        <button 
                          className={`catalog__add-btn ${product.stock <= 0 ? 'disabled' : ''}`}
                          style={{width: 'auto', padding: 'var(--space-2) var(--space-4)'}}
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                          }}
                          disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? '🛒 Agregar' : 'Agotado'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
