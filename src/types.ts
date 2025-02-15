export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string; // For backward compatibility
  images: string[];
  videos?: string[];
  details: string;
  category: string;
  specs: {
    [key: string]: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ProductImage {
  url: string;
  type: 'image' | 'video';
}

export interface StoreInfo {
  name: string;
  email: string;
  phone: string;
  currency: string;
  address: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}