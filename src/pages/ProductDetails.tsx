import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Play, Pause } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { STORE_INFO } from '../data/products';

interface ProductDetailsProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetails({ onAddToCart }: ProductDetailsProps) {
  const { id } = useParams();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const product = products.find(p => p.id === Number(id));
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const storeInfo = STORE_INFO[language];

  const allMedia = [
    ...(product?.images || []),
    ...(product?.videos || [])
  ];

  const isCurrentMediaVideo = (index: number) => {
    return product?.videos?.includes(allMedia[index]);
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-600">
            {language === 'ar' ? 'المنتج غير موجود' : 'Produit non trouvé'}
          </p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Retour à l\'accueil'}
          </Link>
        </div>
      </div>
    );
  }

  const handleMediaChange = (index: number) => {
    setCurrentMediaIndex(index);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  return (
    <div className={`min-h-screen pt-20 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96">
                <AnimatePresence mode="wait">
                  {isCurrentMediaVideo(currentMediaIndex) ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <video
                        ref={videoRef}
                        src={allMedia[currentMediaIndex]}
                        className="w-full h-full object-cover"
                        onEnded={() => setIsPlaying(false)}
                      />
                      <button
                        onClick={toggleVideo}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-16 w-16 text-white" />
                        ) : (
                          <Play className="h-16 w-16 text-white" />
                        )}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.img
                      key="image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full object-cover"
                      src={allMedia[currentMediaIndex]}
                      alt={product.name}
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={prevMedia}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="flex gap-2 p-4 overflow-x-auto">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => handleMediaChange(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      index === currentMediaIndex ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    {isCurrentMediaVideo(index) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={media}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className={`text-xl mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {product.description}
                </p>
                <div className={`mb-6 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ar' ? 'المواصفات' : 'Spécifications'}
                  </h2>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-0">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {key}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-indigo-600">
                    {product.price} {storeInfo.currency}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddToCart(product)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {language === 'ar' ? 'أضف إلى السلة' : 'Ajouter au panier'}
                  </motion.button>
                </div>
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h2 className="text-xl font-semibold mb-2">
                    {language === 'ar' ? 'تفاصيل المنتج' : 'Détails du produit'}
                  </h2>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {product.details}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}