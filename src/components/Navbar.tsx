import React from 'react';
import { ShoppingCart, Sun, Moon, Languages } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // استيراد useNavigate
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORIES } from '../data/products';

export default function Navbar({ cartItemsCount }: { cartItemsCount: number }) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate(); // استخدام useNavigate للتنقل

  // الأقسام المترجمة
  const categories = CATEGORIES[language];

  // وظيفة لتوجيه المستخدم إلى قسم معين
  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    } shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          {/* الجزء الأيسر: الشعار */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/tilazone-logo.png" alt="Tilazone" className="h-16 w-auto" />
              <span className="text-2xl font-bold font-mono tracking-wider">TILAZONE</span>
            </Link>
          </div>

          {/* الجزء الأيمن: أزرار التحكم */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* زر تبديل اللغة */}
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Languages className="h-6 w-6" />
              <span className="sr-only">
                {language === 'ar' ? 'Switch to French' : 'التحويل إلى العربية'}
              </span>
            </button>

            {/* زر تبديل الوضع المظلم */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>

            {/* زر السلة */}
            <Link 
              to="/cart" 
              className={`relative p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}