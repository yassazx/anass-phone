export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  sold: number;
  category: string;
  tags: string[];
  colors: string[];
  storageOptions: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string; // In a real app this would be user data
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ColorOption {
  id: string;
  name: string;
}

export interface StorageOption {
  id: string;
  label: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
}