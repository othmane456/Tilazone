import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { products, CATEGORIES } from '../data/products'; // استيراد CATEGORIES
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

const translations = {
  ar: {
    welcome: 'مرحباً بكم في تيلازون',
    discover: 'اكتشف تشكيلتنا الواسعة من المنتجات المميزة',
    searchPlaceholder: 'ابحث عن منتج...',
    all: 'الكل',
    categories: 'الأقسام'
  },
  fr: {
    welcome: 'Bienvenue à Tilazone',
    discover: 'Découvrez notre large gamme de produits distinctifs',
    searchPlaceholder: 'Rechercher un produit...',
    all: 'Tout',
    categories: 'Catégories'
  }
};

export default function Home({ onAddToCart }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setLocalProducts(JSON.parse(savedProducts));
      } else {
        setLocalProducts(products);
      }
      setLoading(false);
    };

    const timer = setTimeout(loadProducts, 1500);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'products' && e.newValue) {
        setLocalProducts(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // استخدام الترجمة المناسبة للأقسام
  const categories = CATEGORIES[language];

  const filteredProducts = localProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
          alt="E-commerce"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {translations[language].welcome}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-gray-200"
            >
              {translations[language].discover}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory("")}
            className={`p-4 rounded-xl shadow-lg transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="block text-center font-semibold">
              {translations[language].all}
            </span>
          </motion.button>
          {categories.slice(1).map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-xl shadow-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="block text-center font-semibold">
                {category}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search and Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={translations[language].searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: product.id * 0.1 }}
              >
                <ProductCard 
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
}