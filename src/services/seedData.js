// UCE Marketplace — Demo Data Seeder

import db from './db';

const DEMO_USERS = [
  {
    id: 'user-admin-001',
    email: 'admin@uce.edu.ec',
    password: 'admin123',
    name: 'Administrador UCE',
    avatar: '',
    role: 'admin',
    faculty: 'Administración',
    career: 'Sistemas',
    bio: 'Administrador de la plataforma UCE Marketplace.',
    phone: '0991234567',
    rating: 5.0,
    totalSales: 0,
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-seller-001',
    email: 'maria.lopez@uce.edu.ec',
    password: 'demo123',
    name: 'María López',
    avatar: '',
    role: 'vendedor',
    faculty: 'Ciencias Administrativas',
    career: 'Administración de Empresas',
    bio: 'Emprendedora apasionada por la repostería artesanal. Dulces hechos con amor 🍰',
    phone: '0987654321',
    rating: 4.8,
    totalSales: 47,
    isActive: true,
    createdAt: '2026-02-01T08:30:00Z',
  },
  {
    id: 'user-seller-002',
    email: 'carlos.morales@uce.edu.ec',
    password: 'demo123',
    name: 'Carlos Morales',
    avatar: '',
    role: 'vendedor',
    faculty: 'Ingeniería',
    career: 'Ingeniería en Sistemas',
    bio: 'Servicio técnico de computadoras y desarrollo de software a medida 💻',
    phone: '0976543210',
    rating: 4.6,
    totalSales: 32,
    isActive: true,
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'user-seller-003',
    email: 'ana.herrera@uce.edu.ec',
    password: 'demo123',
    name: 'Ana Herrera',
    avatar: '',
    role: 'vendedor',
    faculty: 'Artes',
    career: 'Diseño Gráfico',
    bio: 'Artesanías y diseño personalizado. Cada pieza es única ✨',
    phone: '0965432109',
    rating: 4.9,
    totalSales: 65,
    isActive: true,
    createdAt: '2026-03-05T09:15:00Z',
  },
  {
    id: 'user-buyer-001',
    email: 'pedro.sanchez@uce.edu.ec',
    password: 'demo123',
    name: 'Pedro Sánchez',
    avatar: '',
    role: 'comprador',
    faculty: 'Derecho',
    career: 'Jurisprudencia',
    bio: 'Estudiante de derecho, amante de la buena comida.',
    phone: '0954321098',
    rating: 0,
    totalSales: 0,
    isActive: true,
    createdAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'user-buyer-002',
    email: 'lucia.rivera@uce.edu.ec',
    password: 'demo123',
    name: 'Lucía Rivera',
    avatar: '',
    role: 'comprador',
    faculty: 'Medicina',
    career: 'Medicina General',
    bio: 'Futura doctora buscando las mejores ofertas 🩺',
    phone: '0943210987',
    rating: 0,
    totalSales: 0,
    isActive: true,
    createdAt: '2026-04-01T16:30:00Z',
  },
];

const DEMO_PRODUCTS = [
  {
    id: 'prod-001',
    sellerId: 'user-seller-001',
    sellerName: 'María López',
    name: 'Brownies Artesanales x6',
    description: 'Deliciosos brownies de chocolate belga hechos con ingredientes premium. Cada caja incluye 6 porciones generosas. Perfectos para compartir entre clases o como regalo especial. Sin conservantes artificiales.',
    price: 5.50,
    category: 'alimentos',
    images: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600&h=400&fit=crop',
    ],
    stock: 20,
    isActive: true,
    isFeatured: true,
    views: 234,
    sales: 18,
    createdAt: '2026-05-01T09:00:00Z',
  },
  {
    id: 'prod-002',
    sellerId: 'user-seller-001',
    sellerName: 'María López',
    name: 'Galletas Decoradas Personalizadas',
    description: 'Galletas de mantequilla decoradas con royal icing. Ideales para cumpleaños, graduaciones o cualquier evento especial. Pedidos con mínimo 3 días de anticipación. Diseños personalizados a tu gusto.',
    price: 8.00,
    category: 'alimentos',
    images: [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop',
    ],
    stock: 15,
    isActive: true,
    isFeatured: false,
    views: 189,
    sales: 12,
    createdAt: '2026-05-05T10:30:00Z',
  },
  {
    id: 'prod-003',
    sellerId: 'user-seller-001',
    sellerName: 'María López',
    name: 'Torta de Chocolate para 15 personas',
    description: 'Torta húmeda de chocolate con relleno de ganache y decoración personalizada. Perfecta para celebraciones universitarias. Incluye mensaje personalizado y velas.',
    price: 25.00,
    category: 'alimentos',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
    ],
    stock: 5,
    isActive: true,
    isFeatured: true,
    views: 156,
    sales: 8,
    createdAt: '2026-05-08T14:00:00Z',
  },
  {
    id: 'prod-004',
    sellerId: 'user-seller-002',
    sellerName: 'Carlos Morales',
    name: 'Mantenimiento de Laptop',
    description: 'Servicio completo de mantenimiento para tu laptop: limpieza interna, cambio de pasta térmica, optimización de software y diagnóstico general. Incluye informe detallado del estado de tu equipo.',
    price: 15.00,
    category: 'servicios',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    ],
    stock: 99,
    isActive: true,
    isFeatured: true,
    views: 312,
    sales: 25,
    createdAt: '2026-04-20T08:00:00Z',
  },
  {
    id: 'prod-005',
    sellerId: 'user-seller-002',
    sellerName: 'Carlos Morales',
    name: 'Desarrollo de Página Web Básica',
    description: 'Diseño y desarrollo de página web responsive con hasta 5 secciones. Incluye hosting por 1 año, dominio, certificado SSL y diseño personalizado. Entrega en 7 días hábiles.',
    price: 120.00,
    category: 'servicios',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    ],
    stock: 99,
    isActive: true,
    isFeatured: false,
    views: 278,
    sales: 7,
    createdAt: '2026-04-25T11:00:00Z',
  },
  {
    id: 'prod-006',
    sellerId: 'user-seller-002',
    sellerName: 'Carlos Morales',
    name: 'Teclado Mecánico RGB (Usado)',
    description: 'Teclado mecánico Redragon Kumara con switches red, retroiluminación RGB, en excelente estado. Ideal para programadores y gamers. Incluye cable USB-C y keycap puller.',
    price: 35.00,
    category: 'tecnologia',
    images: [
      '/products/teclado_mecanico_1782865175809.png',
    ],
    stock: 1,
    isActive: true,
    isFeatured: true,
    views: 445,
    sales: 0,
    createdAt: '2026-05-10T16:00:00Z',
  },
  {
    id: 'prod-007',
    sellerId: 'user-seller-003',
    sellerName: 'Ana Herrera',
    name: 'Aretes Artesanales en Resina',
    description: 'Aretes hechos a mano con resina epoxi y flores naturales preservadas. Cada par es único e irrepetible. Hipoalergénicos con base de acero quirúrgico. Empaque ecológico incluido.',
    price: 7.50,
    category: 'artesanias',
    images: [
      '/products/aretes_resina_1782865183434.png',
    ],
    stock: 30,
    isActive: true,
    isFeatured: true,
    views: 567,
    sales: 42,
    createdAt: '2026-04-15T09:30:00Z',
  },
  {
    id: 'prod-008',
    sellerId: 'user-seller-003',
    sellerName: 'Ana Herrera',
    name: 'Retrato Digital Personalizado',
    description: 'Ilustración digital personalizada a partir de tu foto. Estilo semi-realista con fondo a elección. Entrega en formato digital (PNG alta resolución) e impreso en papel fotográfico A4.',
    price: 18.00,
    category: 'servicios',
    images: [
      '/products/retrato_digital_1782865563279.png',
    ],
    stock: 99,
    isActive: true,
    isFeatured: false,
    views: 398,
    sales: 23,
    createdAt: '2026-05-02T13:00:00Z',
  },
  {
    id: 'prod-009',
    sellerId: 'user-seller-003',
    sellerName: 'Ana Herrera',
    name: 'Tote Bag Pintado a Mano',
    description: 'Bolsa de tela 100% algodón orgánico con diseño pintado a mano con pintura textil resistente al lavado. Diseños únicos inspirados en la cultura ecuatoriana. Medidas: 38x42cm.',
    price: 12.00,
    category: 'ropa',
    images: [
      '/products/tote_bag_1782865166230.png',
    ],
    stock: 10,
    isActive: true,
    isFeatured: true,
    views: 321,
    sales: 15,
    createdAt: '2026-05-12T10:00:00Z',
  },
  {
    id: 'prod-010',
    sellerId: 'user-seller-003',
    sellerName: 'Ana Herrera',
    name: 'Stickers Personalizados x10',
    description: 'Pack de 10 stickers vinílicos resistentes al agua, impresos en alta calidad. Perfectos para laptops, cuadernos y termos. Diseños originales o personalizados a tu gusto.',
    price: 3.50,
    category: 'artesanias',
    images: [
      '/products/stickers_1782865191107.png',
    ],
    stock: 50,
    isActive: true,
    isFeatured: false,
    views: 612,
    sales: 38,
    createdAt: '2026-05-15T15:30:00Z',
  },
  {
    id: 'prod-011',
    sellerId: 'user-seller-002',
    sellerName: 'Carlos Morales',
    name: 'Audífonos Bluetooth (Seminuevos)',
    description: 'Audífonos inalámbricos Sony WH-1000XM4 en excelente estado. Cancelación de ruido activa, 30 horas de batería. Incluye estuche original, cable auxiliar y cargador USB-C.',
    price: 85.00,
    category: 'tecnologia',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    ],
    stock: 1,
    isActive: true,
    isFeatured: true,
    views: 489,
    sales: 0,
    createdAt: '2026-05-18T12:00:00Z',
  },
  {
    id: 'prod-012',
    sellerId: 'user-seller-001',
    sellerName: 'María López',
    name: 'Empanadas de Verde x5',
    description: 'Empanadas de verde rellenas de queso, carne o pollo. Hechas frescas el mismo día del pedido. Perfectas para tu break entre clases. Incluye ají casero de cortesía.',
    price: 3.00,
    category: 'alimentos',
    images: [
      '/products/empanadas_verde_1782865555706.png',
    ],
    stock: 30,
    isActive: true,
    isFeatured: false,
    views: 178,
    sales: 35,
    createdAt: '2026-05-20T07:00:00Z',
  },
];

const DEMO_MESSAGES = [
  {
    id: 'conv-001',
    participants: ['user-buyer-001', 'user-seller-001'],
    messages: [
      {
        id: 'msg-001',
        senderId: 'user-buyer-001',
        text: '¡Hola María! Me interesan los brownies. ¿Haces entregas en la Facultad de Derecho?',
        timestamp: '2026-06-20T10:00:00Z',
        read: true,
      },
      {
        id: 'msg-002',
        senderId: 'user-seller-001',
        text: '¡Hola Pedro! Sí, hago entregas en todas las facultades de 8am a 5pm. ¿Para cuándo los necesitas?',
        timestamp: '2026-06-20T10:05:00Z',
        read: true,
      },
      {
        id: 'msg-003',
        senderId: 'user-buyer-001',
        text: 'Perfecto, los quiero para mañana a las 10am. ¿Puedo pagar por transferencia?',
        timestamp: '2026-06-20T10:08:00Z',
        read: true,
      },
      {
        id: 'msg-004',
        senderId: 'user-seller-001',
        text: '¡Claro! Puedes hacer la transferencia y me envías el comprobante. Te los llevo mañana a las 10am en punto 😊',
        timestamp: '2026-06-20T10:12:00Z',
        read: false,
      },
    ],
    updatedAt: '2026-06-20T10:12:00Z',
  },
  {
    id: 'conv-002',
    participants: ['user-buyer-002', 'user-seller-003'],
    messages: [
      {
        id: 'msg-005',
        senderId: 'user-buyer-002',
        text: '¡Hola Ana! Me encantan tus aretes de resina. ¿Tienes en tonos azules?',
        timestamp: '2026-06-22T14:00:00Z',
        read: true,
      },
      {
        id: 'msg-006',
        senderId: 'user-seller-003',
        text: '¡Hola Lucía! Sí, tengo varias opciones en azul. Te mando fotos por aquí en un momento 💙',
        timestamp: '2026-06-22T14:15:00Z',
        read: false,
      },
    ],
    updatedAt: '2026-06-22T14:15:00Z',
  },
];

const DEMO_ORDERS = [
  {
    id: 'order-001',
    buyerId: 'user-buyer-001',
    buyerName: 'Pedro Sánchez',
    sellerId: 'user-seller-001',
    sellerName: 'María López',
    items: [
      { productId: 'prod-001', name: 'Brownies Artesanales x6', price: 5.50, quantity: 2 },
      { productId: 'prod-012', name: 'Empanadas de Verde x5', price: 3.00, quantity: 1 },
    ],
    total: 14.00,
    status: 'completado',
    paymentMethod: 'transferencia',
    createdAt: '2026-06-18T09:30:00Z',
  },
  {
    id: 'order-002',
    buyerId: 'user-buyer-002',
    buyerName: 'Lucía Rivera',
    sellerId: 'user-seller-003',
    sellerName: 'Ana Herrera',
    items: [
      { productId: 'prod-007', name: 'Aretes Artesanales en Resina', price: 7.50, quantity: 2 },
      { productId: 'prod-010', name: 'Stickers Personalizados x10', price: 3.50, quantity: 3 },
    ],
    total: 25.50,
    status: 'enviado',
    paymentMethod: 'transferencia',
    createdAt: '2026-06-22T15:00:00Z',
  },
  {
    id: 'order-003',
    buyerId: 'user-buyer-001',
    buyerName: 'Pedro Sánchez',
    sellerId: 'user-seller-002',
    sellerName: 'Carlos Morales',
    items: [
      { productId: 'prod-004', name: 'Mantenimiento de Laptop', price: 15.00, quantity: 1 },
    ],
    total: 15.00,
    status: 'pagado',
    paymentMethod: 'transferencia',
    createdAt: '2026-06-24T10:00:00Z',
  },
];

const DEMO_NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'user-seller-001',
    type: 'sale',
    title: 'Nueva venta realizada',
    message: 'Pedro Sánchez ha comprado Brownies Artesanales x6 (x2)',
    read: false,
    createdAt: '2026-06-24T10:30:00Z',
  },
  {
    id: 'notif-002',
    userId: 'user-buyer-001',
    type: 'purchase',
    title: 'Pedido confirmado',
    message: 'Tu pedido de Mantenimiento de Laptop ha sido confirmado',
    read: false,
    createdAt: '2026-06-24T10:05:00Z',
  },
  {
    id: 'notif-003',
    userId: 'user-seller-003',
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Lucía Rivera te ha enviado un mensaje',
    read: false,
    createdAt: '2026-06-22T14:00:00Z',
  },
];

const CATEGORIES = [
  { id: 'alimentos', name: 'Alimentos', icon: '🍽️', count: 0 },
  { id: 'ropa', name: 'Ropa y Accesorios', icon: '👕', count: 0 },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻', count: 0 },
  { id: 'servicios', name: 'Servicios', icon: '🛠️', count: 0 },
  { id: 'artesanias', name: 'Artesanías', icon: '🎨', count: 0 },
  { id: 'otros', name: 'Otros', icon: '📦', count: 0 },
];

export function seedDatabase() {
  // Only seed if not already seeded
  if (localStorage.getItem('uce_marketplace_seeded_v4')) return false;

  // Clear existing duplicate data before re-seeding
  db.clearAll();

  // Seed users
  DEMO_USERS.forEach(user => db.create('users', user));

  // Seed products
  DEMO_PRODUCTS.forEach(product => db.create('products', product));

  // Seed conversations
  DEMO_MESSAGES.forEach(conv => db.create('conversations', conv));

  // Seed orders
  DEMO_ORDERS.forEach(order => db.create('orders', order));

  // Seed notifications
  DEMO_NOTIFICATIONS.forEach(notif => db.create('notifications', notif));

  // Seed categories
  CATEGORIES.forEach(cat => {
    const count = DEMO_PRODUCTS.filter(p => p.category === cat.id).length;
    db.create('categories', { ...cat, count });
  });

  localStorage.setItem('uce_marketplace_seeded_v4', 'true');
  return true;
}

export function resetDatabase() {
  db.clearAll();
  localStorage.removeItem('uce_marketplace_seeded');
  seedDatabase();
}

export { CATEGORIES };
export default seedDatabase;
