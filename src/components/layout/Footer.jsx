import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* About */}
          <div className="footer__col">
            <div className="footer__about-brand">
              <span className="footer__about-brand-icon">🎓</span>
              <span className="footer__about-brand-text">Tienda Digital</span>
            </div>
            <p className="footer__about-desc">
              La plataforma de marketplace exclusiva para tu mundo emprendedor. Compra, vende y emprende de forma segura.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" title="Facebook" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-1.1 0-2 .9-2 2v1h3l-1 3h-2v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" title="Instagram" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2c2.72 0 3.05.01 4.12.06 1.05.05 1.77.22 2.4.46.64.25 1.18.58 1.72 1.12.54.54.87 1.08 1.12 1.72.24.63.41 1.35.46 2.4.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.05-.22 1.77-.46 2.4-.25.64-.58 1.18-1.12 1.72-.54.54-1.08.87-1.72 1.12-.63.24-1.35.41-2.4.46-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.05-.05-1.77-.22-2.4-.46-.64-.25-1.18-.58-1.72-1.12-.54-.54-.87-1.08-1.12-1.72-.24-.63-.41-1.35-.46-2.4-.05-1.07-.06-1.4-.06-4.12s.01-3.05.06-4.12c.05-1.05.22-1.77.46-2.4.25-.64.58-1.18 1.12-1.72.54-.54 1.08-.87 1.72-1.12.63-.24 1.35-.41 2.4-.46 1.07-.05 1.4-.06 4.12-.06zm0 2.16c-2.67 0-3 .01-4.06.06-.97.04-1.5.21-1.85.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.35-.3.88-.34 1.85-.05 1.06-.06 1.39-.06 4.06s.01 3 .06 4.06c.04.97.21 1.5.34 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.13.88.3 1.85.34 1.06.05 1.39.06 4.06.06s3-.01 4.06-.06c.97-.04 1.5-.21 1.85-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.35.3-.88.34-1.85.05-1.06.06-1.39.06-4.06s-.01-3-.06-4.06c-.04-.97-.21-1.5-.34-1.85-.18-.47-.4-.8-.75-1.15-.35-.35-.68-.57-1.15-.75-.35-.13-.88-.3-1.85-.34-1.06-.05-1.39-.06-4.06-.06zm0 4.88a4.96 4.96 0 100 9.92 4.96 4.96 0 000-9.92zm0 7.76a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6zm5.28-7.9c0 .77-.63 1.4-1.4 1.4s-1.4-.63-1.4-1.4.63-1.4 1.4-1.4 1.4.63 1.4 1.4z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" title="Twitter / X" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.24 3h2.72l-5.94 6.78L22 19.3h-5.46l-4.28-5.59-4.89 5.59H4.65l6.35-7.25L4.17 3h5.6l3.85 5.09L18.24 3zm-1 14.65h1.51L8.7 4.54H7.07l10.17 13.11z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" title="TikTok" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7h-2c0 2.2-1.8 4-4 4V3H9v12.5a3.5 3.5 0 01-7 0 3.5 3.5 0 013.5-3.5c.34 0 .66.05.97.14V9.08c-.3-.05-.62-.08-.97-.08a6.5 6.5 0 106.5 6.5v-8c2.16 0 4-1.84 4-4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Enlaces Rápidos</h4>
            <div className="footer__links">
              <Link to="/" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Inicio
              </Link>
              <Link to="/catalogo" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Catálogo
              </Link>
              <Link to="/publicar" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Publicar Producto
              </Link>
              <Link to="/registro" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Crear Cuenta
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="footer__col">
            <h4 className="footer__col-title">Legal</h4>
            <div className="footer__links">
              <Link to="/privacidad" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Términos y Condiciones
              </Link>
              <Link to="/contacto" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Contacto
              </Link>
              <Link to="/ayuda" className="footer__link">
                <span className="footer__link-arrow">›</span>
                Centro de Ayuda
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 <span className="footer__copyright-highlight">Tienda Digital</span>. Todos los derechos reservados.
            <br />
            <span className="footer__copyright-highlight">Para tu mundo emprendedor</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
