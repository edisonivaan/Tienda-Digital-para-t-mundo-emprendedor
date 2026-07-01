import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Privacy.css';

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="page-content container legal-page">
        <div className="legal-container glass">
          <h1 className="legal-title">Política de Privacidad</h1>
          <p className="legal-date">Última actualización: 25 de junio de 2026</p>

          <section className="legal-section">
            <h2>1. Información que Recopilamos</h2>
            <p>En UCE Marketplace recopilamos la siguiente información personal cuando utilizas nuestra plataforma:</p>
            <ul>
              <li>Correo electrónico institucional (@uce.edu.ec)</li>
              <li>Nombres y apellidos</li>
              <li>Facultad y Carrera a la que perteneces</li>
              <li>Datos de transacciones y compras dentro de la plataforma</li>
              <li>Mensajes enviados a través de nuestro sistema de chat interno</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. Uso de la Información</h2>
            <p>Utilizamos tu información personal exclusivamente para los siguientes propósitos:</p>
            <ul>
              <li>Autenticar tu identidad como estudiante de la Universidad Central del Ecuador.</li>
              <li>Facilitar el contacto entre compradores y vendedores.</li>
              <li>Procesar y mantener un registro de las transacciones (compras/ventas).</li>
              <li>Mejorar la experiencia de usuario y optimizar la plataforma.</li>
              <li>Enviar notificaciones importantes sobre tus pedidos o la plataforma.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Protección de Datos</h2>
            <p>Nos tomamos muy en serio la seguridad de tus datos. UCE Marketplace implementa medidas de seguridad técnicas y organizativas, incluyendo:</p>
            <ul>
              <li>Cifrado de datos en tránsito (SSL/HTTPS).</li>
              <li>Acceso restringido a bases de datos mediante reglas de seguridad estrictas.</li>
              <li>Cumplimiento con la Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Derechos del Usuario (Art. 17-23 LOPDP)</h2>
            <p>De acuerdo con la legislación ecuatoriana, tienes derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales.</li>
              <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta.</li>
              <li><strong>Eliminación:</strong> Solicitar el borrado de tus datos cuando ya no sean necesarios para los fines que fueron recogidos.</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para fines específicos.</li>
            </ul>
            <p>Para ejercer estos derechos, contáctanos a <a href="mailto:privacidad@ucemarketplace.edu.ec">privacidad@ucemarketplace.edu.ec</a>.</p>
          </section>

          <section className="legal-section">
            <h2>5. Cookies y Tecnologías</h2>
            <p>Utilizamos cookies y almacenamiento local (localStorage) únicamente para mantener tu sesión activa y guardar preferencias de la interfaz (como tu carrito de compras). No utilizamos cookies de rastreo de terceros para publicidad.</p>
          </section>

          <section className="legal-section">
            <h2>6. Compartición de Datos</h2>
            <p><strong>No vendemos ni alquilamos tus datos a terceros.</strong> Tu información (nombre, facultad, contacto) solo es compartida con otros usuarios de la plataforma estrictamente para concretar una transacción en la que estés involucrado.</p>
          </section>

          <section className="legal-section">
            <h2>7. Retención de Datos</h2>
            <p>Mantendremos tus datos personales mientras tu cuenta permanezca activa. Si decides eliminar tu cuenta, tus datos personales serán borrados, manteniendo únicamente información anónima para fines estadísticos.</p>
          </section>

          <section className="legal-section">
            <h2>8. Contacto</h2>
            <p>Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad o el manejo de tus datos, por favor contáctanos en:</p>
            <p className="contact-email">📧 privacidad@ucemarketplace.edu.ec</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
