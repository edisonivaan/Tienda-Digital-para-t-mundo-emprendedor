import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Terms.css';

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="page-content container legal-page">
        <div className="legal-container glass">
          <h1 className="legal-title">Términos y Condiciones de Uso</h1>
          <p className="legal-date">Última actualización: 25 de junio de 2026</p>

          <section className="legal-section">
            <h2>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar UCE Marketplace, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a la plataforma.</p>
          </section>

          <section className="legal-section">
            <h2>2. Elegibilidad</h2>
            <p>El uso de la plataforma está estrictamente limitado a estudiantes, docentes y personal de la Universidad Central del Ecuador. Para registrarte, es obligatorio el uso de un correo electrónico institucional válido que termine en <strong>@uce.edu.ec</strong>.</p>
          </section>

          <section className="legal-section">
            <h2>3. Registro y Cuenta</h2>
            <p>Al crear una cuenta, te comprometes a proporcionar información precisa, completa y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Se permite una sola cuenta por usuario.</p>
          </section>

          <section className="legal-section">
            <h2>4. Uso de la Plataforma</h2>
            <p>Los usuarios aceptan utilizar la plataforma solo con fines lícitos. Está terminantemente prohibido:</p>
            <ul>
              <li>Publicar productos ilegales, peligrosos, armas, drogas o contenido para adultos.</li>
              <li>Proporcionar información falsa sobre los productos o sobre tu identidad.</li>
              <li>Infringir derechos de autor, marcas registradas u otros derechos de propiedad intelectual.</li>
              <li>Utilizar la plataforma para distribuir spam, virus o código malicioso.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Publicaciones y Ventas</h2>
            <p>Como vendedor, eres el único responsable de los artículos que publicas y de garantizar que cumplan con la descripción proporcionada. Los precios deben ser justos y transparentes.</p>
          </section>

          <section className="legal-section">
            <h2>6. Pagos y Transacciones</h2>
            <p>Las transacciones se realizan directamente entre compradores y vendedores mediante métodos acordados (transferencia bancaria, Payphone, efectivo). <strong>UCE Marketplace no procesa los pagos internamente y no retiene comisiones.</strong> Por tanto, la plataforma no se hace responsable de disputas, reembolsos o estafas. Recomendamos realizar las entregas en lugares seguros dentro de la universidad.</p>
          </section>

          <section className="legal-section">
            <h2>7. Conducta del Usuario</h2>
            <p>Se espera un trato respetuoso entre los usuarios. Está prohibido el lenguaje ofensivo, discriminatorio o el acoso a través de nuestro sistema de mensajería. Nos reservamos el derecho de suspender cuentas que infrinjan esta norma.</p>
          </section>

          <section className="legal-section">
            <h2>8. Propiedad Intelectual</h2>
            <p>El contenido publicado por los usuarios sigue siendo de su propiedad. Sin embargo, al publicar contenido, otorgas a UCE Marketplace una licencia para utilizarlo, mostrarlo y distribuirlo dentro de la plataforma con fines de promoción u operación del servicio.</p>
          </section>

          <section className="legal-section">
            <h2>9. Limitación de Responsabilidad</h2>
            <p>UCE Marketplace actúa únicamente como un intermediario tecnológico. No garantizamos la calidad, seguridad o legalidad de los artículos publicados, ni la capacidad de los vendedores para vender o de los compradores para pagar.</p>
          </section>

          <section className="legal-section">
            <h2>10. Modificaciones a los Términos</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.</p>
          </section>

          <section className="legal-section">
            <h2>11. Ley Aplicable</h2>
            <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del Ecuador.</p>
          </section>

          <section className="legal-section">
            <h2>12. Contacto</h2>
            <p>Para reportar abusos, apelaciones o dudas legales, contáctanos en:</p>
            <p className="contact-email">⚖️ legal@ucemarketplace.edu.ec</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
