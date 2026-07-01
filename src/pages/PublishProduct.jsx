import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomDropdown from '../components/ui/CustomDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import db from '../services/db';
import { CATEGORIES } from '../services/seedData';
import './PublishProduct.css';

export default function PublishProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const fileInputRef = useRef(null);

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'otros',
    price: '',
    stock: 1,
    imageUrl: ''
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    // If not seller, redirect
    if (user && user.role !== 'vendedor' && user.role !== 'admin') {
      showToast('Atención', 'Necesitas ser vendedor para publicar', 'warning');
      navigate('/perfil');
    }

    if (isEditing) {
      const product = db.getById('products', id);
      if (product && (product.sellerId === user.id || user.role === 'admin')) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
          imageUrl: product.images[0] || ''
        });
      } else {
        navigate('/catalogo');
      }
    }
  }, [id, user, isEditing, navigate, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Error', 'Por favor selecciona un archivo de imagen válido.', 'error');
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress heavily to save LocalStorage space (Quality: 0.6)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        
        setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl) {
      showToast('Error', 'Por favor completa todos los campos requeridos y sube una imagen', 'error');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: [formData.imageUrl],
      isActive: true,
    };

    let savedProduct;

    if (isEditing) {
      savedProduct = db.update('products', id, productData);
      showToast('Éxito', 'Producto actualizado correctamente', 'success');
    } else {
      savedProduct = db.create('products', {
        ...productData,
        sellerId: user.id,
        sellerName: user.name,
        views: 0,
        sales: 0,
        isFeatured: false
      });
      showToast('Éxito', 'Producto publicado correctamente', 'success');
    }

    navigate(`/producto/${savedProduct.id}`);
  };

  return (
    <>
      <Navbar />
      <main className="publish">
        <div className="publish__inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 className="publish__title">{isEditing ? 'Editar Producto' : 'Publicar Nuevo Producto'}</h1>
            <button 
              className={`publish__preview-toggle ${previewMode ? 'publish__preview-toggle--active' : ''}`}
              onClick={() => setPreviewMode(!previewMode)}
              type="button"
            >
              {previewMode ? 'Modo Edición' : '👁️ Vista Previa'}
            </button>
          </div>

          <div>
            {!previewMode ? (
              <div className="publish__form-card">
                <form className="publish__form" onSubmit={handleSubmit}>
                  <div className="publish__field">
                    <label className="publish__label">
                      Imagen del Producto <span className="publish__required">*</span>
                    </label>
                    <div className="publish__image-zone" onClick={triggerFileInput}>
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <span className="publish__image-zone-icon">📸</span>
                      <p className="publish__image-zone-text">
                        {isCompressing 
                          ? 'Comprimiendo imagen...' 
                          : <>Haz clic para subir una imagen <strong>desde tu PC</strong></>}
                      </p>
                      <small style={{display: 'block', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: '0.75rem'}}>
                        La imagen se comprimirá automáticamente para no saturar la base de datos local.
                      </small>
                    </div>
                    {formData.imageUrl && (
                      <div className="publish__image-previews">
                        <div className="publish__image-preview" style={{width: '120px', height: '120px'}}>
                          <img src={formData.imageUrl} alt="Vista previa" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="publish__field">
                    <label className="publish__label">
                      Nombre del Producto <span className="publish__required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="Ej. Torta de Chocolate" 
                      maxLength="100"
                      className="publish__input"
                      required
                    />
                  </div>

                  <div className="publish__field">
                    <label className="publish__label">
                      Descripción <span className="publish__required">*</span>
                    </label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange}
                      placeholder="Describe tu producto detalladamente..." 
                      rows="4"
                      maxLength="500"
                      className="publish__textarea"
                      required
                    />
                    <small className="publish__char-counter">{formData.description.length}/500</small>
                  </div>

                  <div className="publish__row">
                    <div className="publish__field">
                      <label className="publish__label">Categoría <span className="publish__required">*</span></label>
                      <CustomDropdown
                        value={formData.category}
                        options={CATEGORIES.map(cat => ({ value: cat.id, label: `${cat.icon} ${cat.name}` }))}
                        onChange={handleCategoryChange}
                        direction="up"
                      />
                    </div>

                    <div className="publish__field">
                      <label className="publish__label">Precio ($) <span className="publish__required">*</span></label>
                      <div className="publish__price-wrap">
                        <span className="publish__price-prefix">$</span>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleChange}
                          placeholder="0.00" 
                          step="0.01"
                          min="0.01"
                          className="publish__input publish__price-input"
                          style={{width: '100%'}}
                          required
                        />
                      </div>
                    </div>

                    <div className="publish__field">
                      <label className="publish__label">Stock <span className="publish__required">*</span></label>
                      <input 
                        type="number" 
                        name="stock" 
                        value={formData.stock} 
                        onChange={handleChange}
                        min="1"
                        className="publish__input"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="publish__submit-btn" style={{marginTop: 'var(--space-4)'}} disabled={isCompressing}>
                    {isEditing ? 'Guardar Cambios' : 'Publicar Producto'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="publish__subtitle">Así se verá tu producto en el catálogo:</h3>
                <div className="publish__preview-card">
                  <div style={{position: 'relative'}}>
                    <img src={formData.imageUrl || 'https://via.placeholder.com/300'} alt={formData.name || 'Sin nombre'} className="publish__preview-image" />
                  </div>
                  <div className="publish__preview-body">
                    <h3 className="publish__preview-name">{formData.name || 'Nombre del Producto'}</h3>
                    <p style={{fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)'}}>Por {user?.name}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span className="publish__preview-price">${parseFloat(formData.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
