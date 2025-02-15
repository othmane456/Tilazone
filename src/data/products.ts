// Initial products data
const initialProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 14999,
    description: "هاتف ذكي متطور مع كاميرا احترافية",
    images: [
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1678685888183-0bd8c0a0944c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1678685888159-849926755f1e?w=800&auto=format&fit=crop"
    ],
    videos: [
      "https://example.com/iphone-14-pro-video-4k.mp4"
    ],
    details: "شاشة 6.1 بوصة، معالج A16 Bionic، كاميرا 48 ميجابكسل، تخزين 256GB",
    category: "هواتف",
    specs: {
      screen: "6.1 بوصة Super Retina XDR",
      processor: "A16 Bionic",
      camera: "نظام كاميرا احترافي ثلاثي",
      battery: "حتى 29 ساعة تشغيل فيديو",
      storage: "256GB"
    },
    landingPageUrl: "https://example.com/iphone-14-pro" // رابط صفحة الهبوط
  },
  {
    id: 2,
    name: "سماعات Sony WH-1000XM4",
    price: 3499,
    description: "سماعات لاسلكية مع خاصية إلغاء الضوضاء",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618366712141-4e1fa4109a22?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618366712013-259d3e12cc9a?w=800&auto=format&fit=crop"
    ],
    details: "جودة صوت عالية، بطارية تدوم 30 ساعة، تقنية LDAC للصوت عالي الدقة",
    category: "إلكترونيات",
    specs: {
      battery: "30 ساعة",
      connectivity: "Bluetooth 5.0",
      features: "إلغاء الضوضاء النشط",
      weight: "254g"
    },
    landingPageUrl: "" // رابط صفحة الهبوط (فارغ في البداية)
  }
];

// Categories data
export const CATEGORIES = {
  ar: [
    "الكل",
    "هواتف",
    "إلكترونيات",
    "حواسيب",
    "ملابس رجالية",
    "ملابس نسائية",
    "أحذية",
    "حقائب",
    "ساعات",
    "اكسسوارات",
    "مجوهرات",
    "عطور",
    "رياضة",
    "ألعاب",
    "منزل وحديقة"
  ],
  fr: [
    "Tout",
    "Téléphones",
    "Électronique",
    "Ordinateurs",
    "Vêtements Hommes",
    "Vêtements Femmes",
    "Chaussures",
    "Sacs",
    "Montres",
    "Accessoires",
    "Bijoux",
    "Parfums",
    "Sport",
    "Jeux",
    "Maison & Jardin"
  ]
};

// Store information
export const STORE_INFO = {
  ar: {
    name: "تيلازون",
    email: "xothmane01@gmail.com",
    phone: "+212 625-602147",
    currency: "د.م",
    address: "الرباط، المغرب",
    social: {
      facebook: "https://facebook.com/tilazone",
      instagram: "https://instagram.com/tilazone",
      twitter: "https://twitter.com/tilazone"
    }
  },
  fr: {
    name: "Tilazone",
    email: "xothmane01@gmail.com",
    phone: "+212 625-602147",
    currency: "MAD",
    address: "Rabat, Maroc",
    social: {
      facebook: "https://facebook.com/tilazone",
      instagram: "https://instagram.com/tilazone",
      twitter: "https://twitter.com/tilazone"
    }
  }
};

// Load products from localStorage or use initial data
const loadProducts = () => {
  const savedProducts = localStorage.getItem('products');
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  // Initialize localStorage with default products
  localStorage.setItem('products', JSON.stringify(initialProducts));
  return initialProducts;
};

export const products = loadProducts();

export const saveProducts = (newProducts: typeof products) => {
  localStorage.setItem('products', JSON.stringify(newProducts));
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new CustomEvent('productsUpdated', {
    detail: { products: newProducts }
  }));
};