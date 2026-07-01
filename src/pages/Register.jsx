import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomDropdown from '../components/ui/CustomDropdown';
import DOMPurify from 'dompurify';
import './Register.css';

const FACULTIES = [
  'Ciencias Administrativas',
  'Ingeniería',
  'Artes',
  'Derecho',
  'Medicina',
  'Ciencias Químicas',
  'Filosofía',
  'Odontología',
  'Arquitectura',
  'Ciencias Agrícolas',
  'Otra',
];

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    faculty: '',
    career: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/catalogo', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!formData.email.trim().endsWith('@uce.edu.ec')) {
      newErrors.email = 'Solo se permiten correos @uce.edu.ec';
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Selecciona tu facultad';
    }

    if (!formData.career.trim()) {
      newErrors.career = 'Ingresa tu carrera';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setIsSubmitting(true);

    const sanitized = {
      name: DOMPurify.sanitize(formData.name.trim()),
      email: DOMPurify.sanitize(formData.email.trim().toLowerCase()),
      faculty: DOMPurify.sanitize(formData.faculty),
      career: DOMPurify.sanitize(formData.career.trim()),
      password: formData.password,
    };

    setTimeout(() => {
      const result = register(sanitized);
      if (result.success) {
        navigate('/catalogo');
      } else {
        setGlobalError(result.error);
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="register-page">
      <Navbar />

      <main className="register-main">
        {/* Decorative background */}
        <div className="register-bg-circle register-bg-circle-1" />
        <div className="register-bg-circle register-bg-circle-2" />
        <div className="register-bg-circle register-bg-circle-3" />

        <div className="register-card animate-fade-in-up">
          {/* Logo */}
          <div className="register-logo">
            <span className="register-logo-emoji">🎓</span>
            <span className="register-logo-text">UCE Market</span>
          </div>

          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a la comunidad universitaria</p>

          {/* Global error */}
          {globalError && (
            <div className="register-error animate-fade-in">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{globalError}</span>
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="register-field">
              <label htmlFor="reg-name" className="register-label">
                Nombre completo
              </label>
              <div className="register-input-wrap">
                <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="register-field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="register-field">
              <label htmlFor="reg-email" className="register-label">
                Correo institucional
              </label>
              <div className="register-input-wrap">
                <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@uce.edu.ec"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="register-field-error">{errors.email}</span>}
            </div>

            {/* Faculty + Career in a row */}
            <div className="register-row">
              <div className="register-field">
                <label htmlFor="reg-faculty" className="register-label">
                  Facultad
                </label>
                <div className="register-input-wrap">
                  <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 2 }}>
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 10 3 12 0v-5" />
                  </svg>
                  <CustomDropdown
                    value={formData.faculty}
                    options={[
                      { value: '', label: 'Selecciona...' },
                      ...FACULTIES.map(f => ({ value: f, label: f }))
                    ]}
                    onChange={(val) => handleChange({ target: { name: 'faculty', value: val } })}
                  />
                </div>
                {errors.faculty && <span className="register-field-error">{errors.faculty}</span>}
              </div>

              <div className="register-field">
                <label htmlFor="reg-career" className="register-label">
                  Carrera
                </label>
                <div className="register-input-wrap">
                  <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  <input
                    id="reg-career"
                    name="career"
                    type="text"
                    value={formData.career}
                    onChange={handleChange}
                    placeholder="Tu carrera"
                    autoComplete="off"
                  />
                </div>
                {errors.career && <span className="register-field-error">{errors.career}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="register-field">
              <label htmlFor="reg-password" className="register-label">
                Contraseña
              </label>
              <div className="register-input-wrap">
                <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="register-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="register-field-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="register-field">
              <label htmlFor="reg-confirm" className="register-label">
                Confirmar contraseña
              </label>
              <div className="register-input-wrap">
                <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="register-toggle-pw"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className="register-field-error">{errors.confirmPassword}</span>}
            </div>

            {/* Terms */}
            <div className="register-terms">
              <label className="register-checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.terms;
                        return copy;
                      });
                    }
                  }}
                  className="register-checkbox"
                />
                <span className="register-checkmark" />
                <span className="register-terms-text">
                  Acepto los{' '}
                  <Link to="/terminos" className="register-link" target="_blank">
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacidad" className="register-link" target="_blank">
                    Política de Privacidad
                  </Link>
                </span>
              </label>
              {errors.terms && <span className="register-field-error">{errors.terms}</span>}
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="register-spinner" />
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="register-footer-text">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="register-link">
              Inicia sesión
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
