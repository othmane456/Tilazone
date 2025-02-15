import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export default function ProductCard({ product, onAddToCart, isInCart = false }: ProductCardProps) {
  const [added, setAdded] = useState(isInCart);
  const { theme } = useTheme();

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleProductClick = () => {
    if (product.landingPageUrl) {
      window.location.href = product.landingPageUrl;
    } else {
      alert("هذا المنتج لا يحتوي على صفحة هبوط.");
    }
  };

  // Use the first image from the images array, fallback to the legacy image property
  const displayImage = product.images?.[0] || product.image;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
      onClick={handleProductClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className={`text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {product.name}
        </h3>
        <p className={`mb-4 line-clamp-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-600">{product.price} ر.س</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the product click
              handleAddToCart();
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              added
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {added ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
            {added ? 'تم الإضافة' : 'أضف إلى السلة'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}