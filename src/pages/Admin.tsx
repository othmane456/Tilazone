import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';
import { Product, ProductImage } from '../types';
import { products, saveProducts, CATEGORIES } from '../data/products';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    images: [],
    videos: [],
    landingPageUrl: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { language } = useLanguage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const mediaPromises = files.map(file => {
      return new Promise<ProductImage>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const isVideo = file.type.startsWith('video/');
          resolve({
            url: reader.result as string,
            type: isVideo ? 'video' : 'image'
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(mediaPromises).then(media => {
      const images = media.filter(m => m.type === 'image').map(m => m.url);
      const videos = media.filter(m => m.type === 'video').map(m => m.url);
      
      setNewProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...images],
        videos: [...(prev.videos || []), ...videos]
      }));
    });
  };

  const removeMedia = (index: number, type: 'image' | 'video') => {
    setNewProduct(prev => ({
      ...prev,
      [type === 'image' ? 'images' : 'videos']: prev[type === 'image' ? 'images' : 'videos']?.filter((_, i) => i !== index)
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.landingPageUrl) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    const product: Product = {
      id: Math.max(...localProducts.map(p => p.id), 0) + 1,
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || "",
      images: newProduct.images || [],
      videos: newProduct.videos || [],
      image: newProduct.images?.[0], // For backward compatibility
      details: newProduct.details || "",
      category: newProduct.category,
      specs: newProduct.specs || {},
      landingPageUrl: newProduct.landingPageUrl || "" // رابط صفحة الهبوط
    };
    
    const updatedProducts = [...localProducts, product];
    setLocalProducts(updatedProducts);
    saveProducts(updatedProducts);
    setNewProduct({ images: [], videos: [], landingPageUrl: "" });
    setShowAddForm(false);
  };

  const handleUpdateProduct = (product: Product) => {
    const updatedProducts = localProducts.map(p => p.id === product.id ? product : p);
    setLocalProducts(updatedProducts);
    saveProducts(updatedProducts);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const updatedProducts = localProducts.filter(p => p.id !== id);
      setLocalProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
  };

  const filteredProducts = selectedCategory
    ? localProducts.filter(p => p.category === selectedCategory)
    : localProducts;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-md mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-md p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h1 className={`text-2xl font-bold mb-6 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? 'تسجيل دخول المدير' : 'Connexion administrateur'}
            </h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className={`block mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {language === 'ar' ? 'اسم المستخدم' : 'Nom d\'utilisateur'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="mb-6">
                <label className={`block mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {language === 'ar' ? 'دخول' : 'Connexion'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-md p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {language === 'ar' ? 'إضافة منتج جديد' : 'Ajouter un produit'}
            </button>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                !selectedCategory
                  ? "bg-indigo-600 text-white"
                  : theme === 'dark'
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {language === 'ar' ? 'كل المنتجات' : 'Tous les produits'}
            </button>
            {CATEGORIES[language].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : theme === 'dark'
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 border rounded-lg ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'اسم المنتج' : 'Nom du produit'}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'السعر' : 'Prix'}
                  </label>
                  <input
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'رابط صفحة الهبوط' : 'Landing Page URL'}
                  </label>
                  <input
                    type="text"
                    value={newProduct.landingPageUrl || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, landingPageUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                    placeholder={language === 'ar' ? 'أدخل رابط صفحة الهبوط' : 'Enter Landing Page URL'}
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'صور وفيديوهات المنتج' : 'Product Images & Videos'}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-600 hover:border-indigo-500'
                          : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      <Upload className={`h-8 w-8 mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {language === 'ar' 
                          ? 'اضغط لاختيار صور أو فيديو' 
                          : 'Click to choose images or videos'}
                      </p>
                    </div>
                    {((newProduct.images && newProduct.images.length > 0) || 
                      (newProduct.videos && newProduct.videos.length > 0)) && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {newProduct.images?.map((url, index) => (
                          <div key={`image-${index}`} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeMedia(index, 'image')}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {newProduct.videos?.map((url, index) => (
                          <div key={`video-${index}`} className="relative">
                            <video
                              src={url}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeMedia(index, 'video')}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'القسم' : 'Catégorie'}
                  </label>
                  <select
                    value={newProduct.category || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {language === 'ar' ? 'اختر القسم' : 'Choisir une catégorie'}
                    </option>
                    {CATEGORIES[language].slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={newProduct.description || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'ar' ? 'التفاصيل' : 'Détails'}
                  </label>
                  <textarea
                    value={newProduct.details || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'border-gray-300'
                    }`}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } hover:text-gray-800`}
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  onClick={handleAddProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'ar' ? 'إضافة المنتج' : 'Ajouter le produit'}
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border rounded-lg p-4 flex items-center gap-4 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                {editingProduct?.id === product.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className={`px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'border-gray-300'
                      }`}
                      placeholder={language === 'ar' ? 'اسم المنتج' : 'Nom du produit'}
                    />
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className={`px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'border-gray-300'
                      }`}
                      placeholder={language === 'ar' ? 'السعر' : 'Prix'}
                    />
                    <input
                      type="text"
                      value={editingProduct.landingPageUrl || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, landingPageUrl: e.target.value })}
                      className={`px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'border-gray-300'
                      }`}
                      placeholder={language === 'ar' ? 'رابط صفحة الهبوط' : 'Landing Page URL'}
                    />
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className={`px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {CATEGORIES[language].slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="col-span-2 flex gap-2">
                      <button
                        onClick={() => handleUpdateProduct(editingProduct)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Save className="h-4 w-4" />
                        {language === 'ar' ? 'حفظ' : 'Enregistrer'}
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className={`flex items-center gap-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        } hover:text-gray-800`}
                      >
                        <X className="h-4 w-4" />
                        {language === 'ar' ? 'إلغاء' : 'Annuler'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {product.name}
                      </h3>
                      <p className="text-indigo-600">{product.price} د.م</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {product.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}