import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { STORE_INFO } from '../data/products';

export default function Footer() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const storeInfo = STORE_INFO[language];
  
  return (
    <footer className={`${
      theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-600'
    } py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'عن تيلازون' : 'À propos de Tilazone'}
            </h3>
            <p className="mb-4">
              {language === 'ar' 
                ? 'متجر إلكتروني رائد في مجال بيع المنتجات الإلكترونية والأزياء والإكسسوارات.'
                : 'Une boutique en ligne leader dans la vente de produits électroniques, de mode et d\'accessoires.'}
            </p>
            <div className="flex gap-4">
              <a href={storeInfo.social.facebook} className="hover:text-indigo-600 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href={storeInfo.social.twitter} className="hover:text-indigo-600 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href={storeInfo.social.instagram} className="hover:text-indigo-600 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Liens rapides'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">
                  {language === 'ar' ? 'الرئيسية' : 'Accueil'}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 transition-colors">
                  {language === 'ar' ? 'سلة التسوق' : 'Panier'}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Politique de confidentialité'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  {language === 'ar' ? 'شروط الاستخدام' : 'Conditions d\'utilisation'}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'الأقسام' : 'Catégories'}
            </h3>
            <ul className="space-y-2">
              {['هواتف', 'إلكترونيات', 'حواسيب', 'أزياء'].map((category) => (
                <li key={category}>
                  <a href="#" className="hover:text-indigo-600 transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'اتصل بنا' : 'Contactez-nous'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-indigo-600" />
                <span>{storeInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span>{storeInfo.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span>{storeInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p>© {new Date().getFullYear()} {storeInfo.name}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'}</p>
        </div>
      </div>
    </footer>
  );
}