// ─────────────────────────────────────────────────────────
//  LittleLane Store — Seed Data (TND currency)
// ─────────────────────────────────────────────────────────

export const CATEGORIES = ['Moms', 'Kids', 'Toys', 'Apparel', 'Accessories'];

export const PRODUCTS = [
  { id: 'p1',  emoji: '🍼', images: [
    'https://images.unsplash.com/photo-1595174194121-4f2ea5615e91?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1544145945-812e98797f1f?auto=format&fit=crop&w=800'
  ], name: 'Premium Diaper Bag',        category: 'Moms',        price: 320,   discount: 0,  stock: 15,  rating: 4.9, sales: 142, description: 'Vegan leather, waterproof interior, insulated bottle pockets, stroller straps.', sizes: ['One Size'], active: true },
  
  { id: 'p2',  emoji: '🧸', images: [
    'https://images.unsplash.com/photo-1641563817292-d2085b953e78?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1581442111815-53900cb3335b?auto=format&fit=crop&w=800'
  ], name: 'Wooden Stacking Ring Toy',  category: 'Toys',        price: 45,    discount: 10, stock: 40,  rating: 4.8, sales: 298, description: 'Non-toxic, organic wood, pastel colors to develop fine motor skills.', sizes: ['One Size'], active: true },
  
  { id: 'p3',  emoji: '👶', images: [
    'https://images.unsplash.com/photo-1627662236973-4fbd0639d6ec?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1596409607148-36c533261291?auto=format&fit=crop&w=800'
  ], name: 'Organic Cotton Onesie',     category: 'Apparel',     price: 35,    discount: 0,  stock: 80,  rating: 5.0, sales: 431, description: '100% GOTS certified organic cotton, snap closures, breathable.', sizes: ['0-3M', '3-6M', '6-9M'], active: true },
  
  { id: 'p4',  emoji: '🤱', images: [
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800'
  ], name: 'Cashmere Nursing Wrap',     category: 'Moms',        price: 180,   discount: 5,  stock: 12,  rating: 4.8, sales: 67,  description: 'Ultra-soft cashmere blend, versatile as a scarf or private nursing cover.', sizes: ['One Size'], active: true },
  
  { id: 'p5',  emoji: '🚼', images: [
    'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1594843936357-e6f77839ec91?auto=format&fit=crop&w=800'
  ], name: 'Minimalist Stroller',       category: 'Kids',        price: 950,   discount: 0,  stock: 8,   rating: 4.6, sales: 203, description: 'Lightweight aluminum frame, one-hand fold, leatherette handles.', sizes: ['One Size'], active: true },
  
  { id: 'p6',  emoji: '🎀', images: [
    'https://images.unsplash.com/photo-1621217482329-873ddca59b16?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1622336491763-71829e377651?auto=format&fit=crop&w=800'
  ], name: 'Baby Bow Headbands (Set of 3)',category: 'Accessories', price: 25,    discount: 0, stock: 55,  rating: 4.5, sales: 155, description: 'Soft nylon bands with blush, mint, and cream linen bows.', sizes: ['One Size'], active: true },
  
  { id: 'p7',  emoji: '🧥', images: [
    'https://images.unsplash.com/photo-1502035618526-6b2f1f5bca1b?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1621343360404-b97c4852c020?auto=format&fit=crop&w=800'
  ], name: 'Toddler Denim Jacket',      category: 'Apparel',     price: 65,    discount: 0,  stock: 18,  rating: 4.7, sales: 88,  description: 'Soft-washed denim, custom embroidered name option.', sizes: ['12M','18M','2T','3T'], active: true },
  
  { id: 'p8',  emoji: 'backpack', images: [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1621430030553-63a3d5e23610?auto=format&fit=crop&w=800'
  ], name: 'Kids Mini Backpack',        category: 'Accessories', price: 55,    discount: 20, stock: 31,  rating: 4.4, sales: 175, description: 'Perfect size for daycare, waterproof, chest strap included.', sizes: ['One Size'], active: true },
  
  { id: 'p9',  emoji: '🧩', images: [
    'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1623190807659-3fb8655e09be?auto=format&fit=crop&w=800'
  ], name: 'Montessori Puzzle Board',   category: 'Toys',        price: 30,    discount: 0,  stock: 60,  rating: 4.8, sales: 120, description: 'Alphabet and numbers wooden board, eco-friendly paint.', sizes: ['One Size'], active: true },
  
  { id: 'p10', emoji: '🧣', images: [
    'https://images.unsplash.com/photo-1601053046200-247547079998?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1621370007800-ec148e82a604?auto=format&fit=crop&w=800'
  ], name: 'Cozy Knit Blanket',         category: 'Moms',        price: 85,    discount: 0,  stock: 25,  rating: 4.5, sales: 310, description: 'Chunky knit throw, perfect for nursery or living room. 100% Cotton.', sizes: ['One Size'], active: true },
  
  { id: 'p11', emoji: '👟', images: [
    'https://images.unsplash.com/photo-1607898620582-9407252a9c53?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&w=800'
  ], name: 'Pre-walker Leather Moccasins',category: 'Kids',      price: 40,    discount: 0,  stock: 35,  rating: 4.9, sales: 242, description: 'Soft sole, elastic ankle, genuine leather for healthy foot development.', sizes: ['XS', 'S', 'M'], active: true },
  
  { id: 'p12', emoji: '🍼', images: [
    'https://images.unsplash.com/photo-1555212627-d1b114e5a921?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1560506840-ec148e82a604?auto=format&fit=crop&w=800'
  ], name: 'Glass Anti-Colic Bottle Set',category: 'Accessories', price: 45,    discount: 8,  stock: 19,  rating: 4.6, sales: 144, description: 'Thermal shock resistant glass, silicone nipple for natural latch.', sizes: ['One Size'], active: true },
];

export const USERS = [
  { id: 'u1', name: 'Admin User',      email: 'admin@store.com',   password: 'admin123',  role: 'admin',    orders: 0,  spent: 0,     joined: '2024-01-15', status: 'active' },
  { id: 'u2', name: 'Sophia Khelifi',  email: 'sophia@store.com',  password: 'admin123',  role: 'admin',    orders: 2,  spent: 1300,  joined: '2024-02-08', status: 'active' },
  { id: 'u3', name: 'Youssef Trabelsi',email: 'user@store.com',    password: 'user123',   role: 'customer', orders: 5,  spent: 450, joined: '2024-03-12', status: 'active' },
  { id: 'u4', name: 'Lina Mansour',    email: 'lina@store.com',    password: 'user123',   role: 'customer', orders: 3,  spent: 6400,  joined: '2024-04-01', status: 'active' },
  { id: 'u5', name: 'Omar Ben Ali',    email: 'omar@store.com',    password: 'user123',   role: 'customer', orders: 7,  spent: 800, joined: '2024-04-20', status: 'active' },
  { id: 'u6', name: 'Fatma Riahi',     email: 'fatma@store.com',   password: 'user123',   role: 'customer', orders: 1,  spent: 1950,  joined: '2024-05-05', status: 'active' },
  { id: 'u7', name: 'Nour Hajji',      email: 'nour@store.com',    password: 'user123',   role: 'customer', orders: 4,  spent: 800,  joined: '2024-06-14', status: 'suspended' },
  { id: 'u8', name: 'Mariem Zaara',    email: 'mariem@store.com',  password: 'user123',   role: 'customer', orders: 2,  spent: 300,  joined: '2024-07-22', status: 'active' },
];

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
export const ORDERS = [
  { id: 'ORD-001', userId: 'u3', customer: 'Youssef Trabelsi', email: 'user@store.com',    address: '12 Rue de Paris, Tunis 1000',       items: [{ productId: 'p1', name: 'Premium Diaper Bag', qty: 1, price: 320 }, { productId: 'p10', name: 'Cozy Knit Blanket', qty: 1, price: 85 }],  total: 405,  status: 'Delivered',  date: '2025-01-05', notes: '' },
  { id: 'ORD-002', userId: 'u4', customer: 'Lina Mansour',     email: 'lina@store.com',    address: '45 Avenue Habib Bourguiba, Sfax',   items: [{ productId: 'p3', name: 'Organic Cotton Onesie', qty: 2, price: 35 }],                                                                           total: 70,  status: 'Delivered',  date: '2025-01-18', notes: '' },
  { id: 'ORD-003', userId: 'u5', customer: 'Omar Ben Ali',     email: 'omar@store.com',    address: '7 Rue Ibn Khaldoun, Sousse 4000',   items: [{ productId: 'p7', name: 'Toddler Denim Jacket', qty: 1, price: 65 }, { productId: 'p9', name: 'Montessori Puzzle Board', qty: 1, price: 30 }],        total: 95,  status: 'Delivered',  date: '2025-02-03', notes: '' },
  { id: 'ORD-004', userId: 'u3', customer: 'Youssef Trabelsi', email: 'user@store.com',    address: '12 Rue de Paris, Tunis 1000',       items: [{ productId: 'p11', name: 'Pre-walker Leather Moccasins', qty: 1, price: 40 }],                                                                                  total: 40,  status: 'Delivered',  date: '2025-02-20', notes: '' },
  { id: 'ORD-005', userId: 'u6', customer: 'Fatma Riahi',      email: 'fatma@store.com',   address: '88 Rue Pasteur, Bizerte',           items: [{ productId: 'p5', name: 'Minimalist Stroller', qty: 1, price: 950 }],                                                                            total: 950,  status: 'Shipped',    date: '2025-03-08', notes: '' },
  { id: 'ORD-006', userId: 'u5', customer: 'Omar Ben Ali',     email: 'omar@store.com',    address: '7 Rue Ibn Khaldoun, Sousse 4000',   items: [{ productId: 'p4', name: 'Cashmere Nursing Wrap', qty: 1, price: 180 }, { productId: 'p12', name: 'Glass Anti-Colic Bottle Set', qty: 1, price: 45 }],         total: 225,  status: 'Delivered',  date: '2025-03-15', notes: 'Gift wrap requested' },
  { id: 'ORD-007', userId: 'u8', customer: 'Mariem Zaara',     email: 'mariem@store.com',  address: '3 Cité les Pins, Nabeul',           items: [{ productId: 'p8', name: 'Kids Mini Backpack', qty: 2, price: 55 }],                                                                                  total: 110,  status: 'Delivered',  date: '2025-03-29', notes: '' },
  { id: 'ORD-008', userId: 'u2', customer: 'Sophia Khelifi',   email: 'sophia@store.com',  address: '1 Rue de la Liberté, La Marsa',     items: [{ productId: 'p3', name: 'Organic Cotton Onesie', qty: 1, price: 35 }],                                                                           total: 35,  status: 'Delivered',  date: '2025-04-10', notes: 'VIP client' },
  { id: 'ORD-009', userId: 'u5', customer: 'Omar Ben Ali',     email: 'omar@store.com',    address: '7 Rue Ibn Khaldoun, Sousse 4000',   items: [{ productId: 'p2', name: 'Wooden Stacking Ring Toy', qty: 1, price: 45 }],                                                                                   total: 45,  status: 'Delivered',  date: '2025-04-22', notes: '' },
  { id: 'ORD-010', userId: 'u4', customer: 'Lina Mansour',     email: 'lina@store.com',    address: '45 Avenue Habib Bourguiba, Sfax',   items: [{ productId: 'p6', name: 'Baby Bow Headbands (Set of 3)', qty: 1, price: 25 }],                                                                                total: 25,  status: 'Processing', date: '2025-05-05', notes: '' },
  { id: 'ORD-011', userId: 'u3', customer: 'Youssef Trabelsi', email: 'user@store.com',    address: '12 Rue de Paris, Tunis 1000',       items: [{ productId: 'p9', name: 'Montessori Puzzle Board', qty: 1, price: 30 }, { productId: 'p10', name: 'Cozy Knit Blanket', qty: 2, price: 85 }],     total: 200,  status: 'Processing', date: '2025-05-18', notes: '' },
  { id: 'ORD-012', userId: 'u7', customer: 'Nour Hajji',       email: 'nour@store.com',    address: '22 Rue du Commerce, Monastir',      items: [{ productId: 'p7', name: 'Toddler Denim Jacket', qty: 1, price: 65 }],                                                                                  total: 65,  status: 'Cancelled',  date: '2025-06-01', notes: 'Customer cancelled' },
  { id: 'ORD-013', userId: 'u5', customer: 'Omar Ben Ali',     email: 'omar@store.com',    address: '7 Rue Ibn Khaldoun, Sousse 4000',   items: [{ productId: 'p11', name: 'Pre-walker Leather Moccasins', qty: 1, price: 40 }, { productId: 'p4', name: 'Cashmere Nursing Wrap', qty: 1, price: 180 }],         total: 220,  status: 'Shipped',    date: '2025-06-14', notes: 'Handle with care' },
  { id: 'ORD-014', userId: 'u8', customer: 'Mariem Zaara',     email: 'mariem@store.com',  address: '3 Cité les Pins, Nabeul',           items: [{ productId: 'p5', name: 'Minimalist Stroller', qty: 1, price: 950 }],                                                                            total: 950,  status: 'Pending',    date: '2025-07-03', notes: '' },
  { id: 'ORD-015', userId: 'u2', customer: 'Sophia Khelifi',   email: 'sophia@store.com',  address: '1 Rue de la Liberté, La Marsa',     items: [{ productId: 'p1', name: 'Premium Diaper Bag', qty: 1, price: 320 }, { productId: 'p12', name: 'Glass Anti-Colic Bottle Set', qty: 2, price: 45 }],         total: 410,  status: 'Pending',    date: '2025-07-20', notes: '' },
  { id: 'ORD-016', userId: 'u3', customer: 'Youssef Trabelsi', email: 'user@store.com',    address: '12 Rue de Paris, Tunis 1000',       items: [{ productId: 'p8', name: 'Kids Mini Backpack', qty: 1, price: 55 }],                                                                                  total: 55,   status: 'Delivered',  date: '2025-08-08', notes: '' },
  { id: 'ORD-017', userId: 'u6', customer: 'Fatma Riahi',      email: 'fatma@store.com',   address: '88 Rue Pasteur, Bizerte',           items: [{ productId: 'p6', name: 'Baby Bow Headbands (Set of 3)', qty: 1, price: 25 }],                                                                                total: 25,  status: 'Pending',    date: '2025-08-25', notes: '' },
  { id: 'ORD-018', userId: 'u4', customer: 'Lina Mansour',     email: 'lina@store.com',    address: '45 Avenue Habib Bourguiba, Sfax',   items: [{ productId: 'p3', name: 'Organic Cotton Onesie', qty: 1, price: 35 }],                                                                           total: 35,  status: 'Processing', date: '2025-09-10', notes: 'Engraving requested' },
  { id: 'ORD-019', userId: 'u5', customer: 'Omar Ben Ali',     email: 'omar@store.com',    address: '7 Rue Ibn Khaldoun, Sousse 4000',   items: [{ productId: 'p7', name: 'Toddler Denim Jacket', qty: 1, price: 65 }, { productId: 'p8', name: 'Kids Mini Backpack', qty: 2, price: 55 }],            total: 175,  status: 'Shipped',    date: '2025-09-28', notes: '' },
  { id: 'ORD-020', userId: 'u3', customer: 'Youssef Trabelsi', email: 'user@store.com',    address: '12 Rue de Paris, Tunis 1000',       items: [{ productId: 'p2', name: 'Wooden Stacking Ring Toy', qty: 1, price: 45 }, { productId: 'p9', name: 'Montessori Puzzle Board', qty: 1, price: 30 }],           total: 75,  status: 'Pending',    date: '2025-10-05', notes: '' },
];

export const REVENUE_DATA = [
  { month: 'Jan', revenue: 4800, orders: 8 },
  { month: 'Feb', revenue: 5200, orders: 11 },
  { month: 'Mar', revenue: 4900, orders: 10 },
  { month: 'Apr', revenue: 6300, orders: 14 },
  { month: 'May', revenue: 5800, orders: 12 },
  { month: 'Jun', revenue: 7100, orders: 16 },
  { month: 'Jul', revenue: 5500, orders: 13 },
  { month: 'Aug', revenue: 4800, orders: 9 },
  { month: 'Sep', revenue: 7900, orders: 18 },
  { month: 'Oct', revenue: 9200, orders: 21 },
  { month: 'Nov', revenue: 10800, orders: 25 },
  { month: 'Dec', revenue: 13400, orders: 31 },
];

export const PROMO_CODES = [
  { id: 'promo1', code: 'MOM10',    type: 'percent', value: 10, maxUses: 100, uses: 47, expiry: '2025-12-31', active: true },
  { id: 'promo2', code: 'BABY20',   type: 'percent', value: 20, maxUses: 50,  uses: 23, expiry: '2025-08-31', active: true },
  { id: 'promo3', code: 'NEWUSER',  type: 'percent', value: 15, maxUses: 200, uses: 112, expiry: '2025-06-30', active: false },
];

export const FEATURED_COLLECTIONS = [
  { id: 'fc1', emoji: '🤰', title: 'Maternity Essentials', subtitle: 'For you', color: '#e8a5b0', count: 3 },
  { id: 'fc2', emoji: '🍼', title: 'Newborn Must-Haves', subtitle: 'First days', color: '#a1d2ce', count: 2 },
  { id: 'fc3', emoji: '🧸', title: 'Montessori Play', subtitle: 'Learn & Grow', color: '#f6c4cd', count: 3 },
  { id: 'fc4', emoji: '👶', title: 'Tiny Trends', subtitle: 'Stylish wear', color: '#84c0b8', count: 2 },
  { id: 'fc5', emoji: '🎀', title: 'Soft Accessories', subtitle: 'The little things', color: '#d28b98', count: 2 },
];

export const TRAFFIC_SOURCES = [
  { label: 'Organic', value: 38, color: '#e8a5b0' },
  { label: 'Direct',  value: 24, color: '#a1d2ce' },
  { label: 'Social',  value: 20, color: '#f6c4cd' },
  { label: 'Email',   value: 12, color: '#84c0b8' },
  { label: 'Paid',    value: 6,  color: '#d28b98' },
];

export const STORE_SETTINGS = {
  storeName: 'LittleLane',
  currency: 'TND',
  timezone: 'Africa/Tunis',
  darkTheme: true,
  notifications: {
    newOrder: true,
    lowStock: true,
    newUser: false,
  },
};
