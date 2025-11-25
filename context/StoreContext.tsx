import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Product, CartItem, Order, Category, Tag, ColorOption, StorageOption, Blog } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  tags: Tag[];
  colors: ColorOption[];
  storageOptions: StorageOption[];
  blogs: Blog[];
  cart: CartItem[];
  orders: Order[];
  
  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'sold'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateInventory: (productId: string, newStock: number) => Promise<void>;

  // Category CRUD
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Tag CRUD
  addTag: (name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // Color CRUD
  addColor: (name: string) => Promise<void>;
  deleteColor: (id: string) => Promise<void>;

  // Storage CRUD
  addStorageOption: (label: string) => Promise<void>;
  deleteStorageOption: (id: string) => Promise<void>;

  // Order Management
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Completed' | 'Cancelled') => Promise<void>;

  // Blog CRUD
  addBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBlog: (blog: Blog) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  publishBlog: (id: string, published: boolean) => Promise<void>;

  totalCartPrice: number;
  isSyncing: boolean;
  syncError: string | null;
  isSupabaseReady: boolean;
  refreshFromSupabase: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Apple' },
  { id: 'cat_2', name: 'Samsung' },
  { id: 'cat_3', name: 'Pcs' },
  { id: 'cat_4', name: 'Accesories' },
  { id: 'cat_5', name: 'Others' },
];

// Initial Tags
const INITIAL_TAGS: Tag[] = [
  { id: 'tag_1', name: 'New' },
  { id: 'tag_2', name: 'Used like new' },
  { id: 'tag_3', name: 'Esim only' },
];

const INITIAL_COLORS: ColorOption[] = [
  { id: 'color_1', name: 'Noir' },
  { id: 'color_2', name: 'Titanium' },
  { id: 'color_3', name: 'Platinum' }
];

const INITIAL_STORAGE_OPTIONS: StorageOption[] = [
  { id: 'storage_1', label: '128 GB' },
  { id: 'storage_2', label: '256 GB' },
  { id: 'storage_3', label: '512 GB' }
];

// Initial Dummy Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 5x Telephoto camera.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000',
    stock: 5,
    sold: 12,
    category: 'Apple',
    tags: ['New', 'Esim only'],
    colors: ['Titanium'],
    storageOptions: ['256 GB', '512 GB']
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'AI-powered, titanium frame, 200MP camera.',
    price: 13900,
    image: 'https://images.unsplash.com/photo-1706716940864-16279e8e5830?q=80&w=1000',
    stock: 8,
    sold: 45,
    category: 'Samsung',
    tags: ['New'],
    colors: ['Noir'],
    storageOptions: ['256 GB', '512 GB']
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    description: 'Strikingly thin and fast. 13.6-inch Liquid Retina display.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1662581872277-c814385d45e0?q=80&w=1000',
    stock: 2,
    sold: 1,
    category: 'Pcs',
    tags: ['Used like new'],
    colors: ['Platinum'],
    storageOptions: ['512 GB']
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    description: 'Active Noise Cancellation and Transparency mode.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1603351154351-5cf99bc5f16d?q=80&w=1000',
    stock: 20,
    sold: 150,
    category: 'Accesories',
    tags: ['New'],
    colors: ['Noir'],
    storageOptions: ['128 GB']
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    description: 'The ultimate iPad experience with M2 chip.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000',
    stock: 4,
    sold: 8,
    category: 'Apple',
    tags: ['Used like new'],
    colors: ['Titanium'],
    storageOptions: ['256 GB']
  },
  {
    id: '6',
    name: 'Gaming PC RTX 4080',
    description: 'Custom build, i9 13th Gen, 32GB RAM.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000',
    stock: 1,
    sold: 2,
    category: 'Pcs',
    tags: ['New'],
    colors: ['Noir', 'Platinum'],
    storageOptions: ['1 TB']
  }
];

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

const mapProductFromDb = (record: Record<string, any>): Product => ({
  id: record.id?.toString() ?? createId(),
  name: record.name ?? '',
  description: record.description ?? '',
  price: Number(record.price ?? 0),
  image: record.image ?? 'https://via.placeholder.com/400',
  stock: Number(record.stock ?? 0),
  sold: Number(record.sold ?? 0),
  category: record.category ?? '',
  tags: Array.isArray(record.tags) ? record.tags : [],
  colors: Array.isArray(record.colors) ? record.colors : [],
  storageOptions: Array.isArray(record.storage_options ?? record.storageOptions)
    ? (record.storage_options ?? record.storageOptions)
    : [],
});

const mapCategoryFromDb = (record: Record<string, any>): Category => ({
  id: record.id?.toString() ?? createId(),
  name: record.name ?? '',
});

const mapTagFromDb = (record: Record<string, any>): Tag => ({
  id: record.id?.toString() ?? createId(),
  name: record.name ?? '',
});

const mapColorFromDb = (record: Record<string, any>): ColorOption => ({
  id: record.id?.toString() ?? createId(),
  name: record.name ?? '',
});

const mapStorageFromDb = (record: Record<string, any>): StorageOption => ({
  id: record.id?.toString() ?? createId(),
  label: record.label ?? record.name ?? '',
});

const mapOrderFromDb = (record: Record<string, any>): Order => ({
  id: record.id?.toString() ?? createId(),
  customerName: record.customer_name ?? record.customerName ?? 'Guest Customer',
  items: Array.isArray(record.items) ? record.items : [],
  total: Number(record.total ?? 0),
  date: record.date ?? record.created_at ?? new Date().toISOString(),
  status: record.status ?? 'Pending',
});

const mapBlogFromDb = (record: Record<string, any>): Blog => ({
  id: record.id?.toString() ?? createId(),
  title: record.title ?? '',
  slug: record.slug ?? '',
  content: record.content ?? '',
  excerpt: record.excerpt ?? '',
  featuredImage: record.featured_image ?? record.featuredImage,
  author: record.author ?? 'Admin',
  publishedAt: record.published_at ?? record.publishedAt ?? '',
  createdAt: record.created_at ?? record.createdAt ?? new Date().toISOString(),
  updatedAt: record.updated_at ?? record.updatedAt ?? new Date().toISOString(),
  published: Boolean(record.published ?? false),
  seoTitle: record.seo_title ?? record.seoTitle,
  seoDescription: record.seo_description ?? record.seoDescription,
  tags: Array.isArray(record.tags) ? record.tags : [],
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(isSupabaseConfigured ? [] : INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(
    isSupabaseConfigured ? [] : INITIAL_CATEGORIES,
  );
  const [tags, setTags] = useState<Tag[]>(isSupabaseConfigured ? [] : INITIAL_TAGS);
  const [colors, setColors] = useState<ColorOption[]>(isSupabaseConfigured ? [] : INITIAL_COLORS);
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>(
    isSupabaseConfigured ? [] : INITIAL_STORAGE_OPTIONS,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(isSupabaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  const ensureFallbackData = useCallback(() => {
    setProducts(prev => (prev.length ? prev : INITIAL_PRODUCTS));
    setCategories(prev => (prev.length ? prev : INITIAL_CATEGORIES));
    setTags(prev => (prev.length ? prev : INITIAL_TAGS));
    setColors(prev => (prev.length ? prev : INITIAL_COLORS));
    setStorageOptions(prev => (prev.length ? prev : INITIAL_STORAGE_OPTIONS));
  }, []);

  const refreshFromSupabase = useCallback(async () => {
    if (!supabase) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const [productsRes, categoriesRes, tagsRes, colorsRes, storageRes, ordersRes, blogsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('tags').select('*').order('created_at', { ascending: true }),
        supabase.from('colors').select('*').order('created_at', { ascending: true }),
        supabase.from('storage_options').select('*').order('created_at', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (tagsRes.error) throw tagsRes.error;
      if (colorsRes.error) throw colorsRes.error;
      if (storageRes.error) throw storageRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (blogsRes.error) throw blogsRes.error;

      setProducts(productsRes.data?.map(mapProductFromDb) ?? []);
      setCategories(categoriesRes.data?.map(mapCategoryFromDb) ?? []);
      setTags(tagsRes.data?.map(mapTagFromDb) ?? []);
      setColors(colorsRes.data?.map(mapColorFromDb) ?? []);
      setStorageOptions(storageRes.data?.map(mapStorageFromDb) ?? []);
      setOrders(ordersRes.data?.map(mapOrderFromDb) ?? []);
      setBlogs(blogsRes.data?.map(mapBlogFromDb) ?? []);
    } catch (error) {
      console.error('Supabase sync failed', error);
      setSyncError(error instanceof Error ? error.message : 'Failed to sync with Supabase.');
      ensureFallbackData();
    } finally {
      setIsSyncing(false);
    }
  }, [ensureFallbackData]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      refreshFromSupabase();
    }
  }, [refreshFromSupabase]);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: createId(),
      customerName: 'Guest Customer',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date().toISOString(),
      status: 'Pending'
    };

    // Don't deduct stock yet - wait for admin confirmation
    setOrders(prev => [newOrder, ...prev]);

    if (supabase) {
      const { error, data } = await supabase
        .from('orders')
        .insert({
          customer_name: newOrder.customerName,
          items: newOrder.items,
          total: newOrder.total,
          date: newOrder.date,
          status: newOrder.status
        })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setOrders(prev => [mapOrderFromDb(data), ...prev.filter(o => o.id !== newOrder.id)]);
      }
    }

    clearCart();
  };

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'sold'>) => {
    const newProduct: Product = {
      ...productData,
      id: createId(),
      sold: 0
    };
    setProducts(prev => [newProduct, ...prev]);

    if (supabase) {
      const { error, data } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          image: newProduct.image,
          stock: newProduct.stock,
          sold: newProduct.sold,
          category: newProduct.category,
          tags: newProduct.tags,
          colors: newProduct.colors,
          storage_options: newProduct.storageOptions
        })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setProducts(prev => [mapProductFromDb(data), ...prev.filter(p => p.id !== newProduct.id)]);
      }
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    if (supabase) {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          image: updatedProduct.image,
          stock: updatedProduct.stock,
          sold: updatedProduct.sold,
          category: updatedProduct.category,
          tags: updatedProduct.tags,
          colors: updatedProduct.colors,
          storage_options: updatedProduct.storageOptions
        })
        .eq('id', updatedProduct.id);
      if (error) {
        setSyncError(error.message);
      }
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) setSyncError(error.message);
    }
  };

  const updateInventory = async (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

    if (supabase) {
      const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', productId);
      if (error) setSyncError(error.message);
    }
  };

  // Category CRUD
  const addCategory = async (name: string) => {
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const newCategory: Category = { id: createId(), name };
    setCategories(prev => [...prev, newCategory]);

    if (supabase) {
      const { error, data } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setCategories(prev => prev.map(cat => (cat.id === newCategory.id ? mapCategoryFromDb(data) : cat)));
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    if (supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  // Tag CRUD
  const addTag = async (name: string) => {
    if (tags.find(t => t.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const newTag: Tag = { id: createId(), name };
    setTags(prev => [...prev, newTag]);

    if (supabase) {
      const { error, data } = await supabase
        .from('tags')
        .insert({ name })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setTags(prev => prev.map(tag => (tag.id === newTag.id ? mapTagFromDb(data) : tag)));
      }
    }
  };

  const deleteTag = async (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));

    if (supabase) {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  // Color CRUD
  const addColor = async (name: string) => {
    if (colors.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const newColor: ColorOption = { id: createId(), name };
    setColors(prev => [...prev, newColor]);

    if (supabase) {
      const { error, data } = await supabase
        .from('colors')
        .insert({ name })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setColors(prev => prev.map(color => (color.id === newColor.id ? mapColorFromDb(data) : color)));
      }
    }
  };

  const deleteColor = async (id: string) => {
    setColors(prev => prev.filter(c => c.id !== id));

    if (supabase) {
      const { error } = await supabase.from('colors').delete().eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  // Storage CRUD
  const addStorageOption = async (label: string) => {
    if (storageOptions.find(s => s.label.toLowerCase() === label.toLowerCase())) {
      return;
    }

    const newOption: StorageOption = { id: createId(), label };
    setStorageOptions(prev => [...prev, newOption]);

    if (supabase) {
      const { error, data } = await supabase
        .from('storage_options')
        .insert({ label })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setStorageOptions(prev =>
          prev.map(option => (option.id === newOption.id ? mapStorageFromDb(data) : option)),
        );
      }
    }
  };

  const deleteStorageOption = async (id: string) => {
    setStorageOptions(prev => prev.filter(s => s.id !== id));

    if (supabase) {
      const { error } = await supabase.from('storage_options').delete().eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  // Order Management
  const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Completed' | 'Cancelled') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;

    // Update order status
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // Handle stock adjustments
    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
      // Deduct stock when order is confirmed
      const productUpdates = order.items.map(item => {
        const existingProduct = products.find(p => p.id === item.id);
        if (!existingProduct) return null;

        return {
          id: item.id,
          stock: Math.max(0, existingProduct.stock - item.quantity),
          sold: existingProduct.sold + item.quantity
        };
      }).filter(Boolean) as Array<{ id: string; stock: number; sold: number }>;

      setProducts(prev => prev.map(p => {
        const update = productUpdates.find(u => u.id === p.id);
        if (update) {
          return { ...p, stock: update.stock, sold: update.sold };
        }
        return p;
      }));

      // Update Supabase products
      if (supabase) {
        await Promise.all(
          productUpdates.map(update =>
            supabase
              .from('products')
              .update({ stock: update.stock, sold: update.sold })
              .eq('id', update.id)
          )
        );
      }
    } else if (newStatus === 'Cancelled' && oldStatus === 'Completed') {
      // Restore stock if cancelling a completed order
      const productUpdates = order.items.map(item => {
        const existingProduct = products.find(p => p.id === item.id);
        if (!existingProduct) return null;

        return {
          id: item.id,
          stock: existingProduct.stock + item.quantity,
          sold: Math.max(0, existingProduct.sold - item.quantity)
        };
      }).filter(Boolean) as Array<{ id: string; stock: number; sold: number }>;

      setProducts(prev => prev.map(p => {
        const update = productUpdates.find(u => u.id === p.id);
        if (update) {
          return { ...p, stock: update.stock, sold: update.sold };
        }
        return p;
      }));

      // Update Supabase products
      if (supabase) {
        await Promise.all(
          productUpdates.map(update =>
            supabase
              .from('products')
              .update({ stock: update.stock, sold: update.sold })
              .eq('id', update.id)
          )
        );
      }
    }

    // Update order in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) {
        setSyncError(error.message);
      }
    }
  };

  // Blog CRUD
  const addBlog = async (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newBlog: Blog = {
      ...blogData,
      id: createId(),
      slug,
      createdAt: now,
      updatedAt: now,
    };
    setBlogs(prev => [newBlog, ...prev]);

    if (supabase) {
      const { error, data } = await supabase
        .from('blogs')
        .insert({
          title: newBlog.title,
          slug: newBlog.slug,
          content: newBlog.content,
          excerpt: newBlog.excerpt,
          featured_image: newBlog.featuredImage,
          author: newBlog.author,
          published_at: newBlog.publishedAt || (newBlog.published ? now : null),
          published: newBlog.published,
          seo_title: newBlog.seoTitle,
          seo_description: newBlog.seoDescription,
          tags: newBlog.tags,
        })
        .select()
        .single();
      if (error) {
        setSyncError(error.message);
      } else if (data) {
        setBlogs(prev => [mapBlogFromDb(data), ...prev.filter(b => b.id !== newBlog.id)]);
      }
    }
  };

  const updateBlog = async (updatedBlog: Blog) => {
    const now = new Date().toISOString();
    const blogToUpdate = { ...updatedBlog, updatedAt: now };
    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? blogToUpdate : b));

    if (supabase) {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: blogToUpdate.title,
          slug: blogToUpdate.slug,
          content: blogToUpdate.content,
          excerpt: blogToUpdate.excerpt,
          featured_image: blogToUpdate.featuredImage,
          author: blogToUpdate.author,
          published_at: blogToUpdate.publishedAt || (blogToUpdate.published ? now : null),
          published: blogToUpdate.published,
          seo_title: blogToUpdate.seoTitle,
          seo_description: blogToUpdate.seoDescription,
          tags: blogToUpdate.tags,
          updated_at: now,
        })
        .eq('id', updatedBlog.id);
      if (error) {
        setSyncError(error.message);
      }
    }
  };

  const deleteBlog = async (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));

    if (supabase) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  const publishBlog = async (id: string, published: boolean) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const now = new Date().toISOString();
    const updatedBlog: Blog = {
      ...blog,
      published,
      publishedAt: published ? (blog.publishedAt || now) : blog.publishedAt,
      updatedAt: now,
    };

    setBlogs(prev => prev.map(b => b.id === id ? updatedBlog : b));

    if (supabase) {
      const { error } = await supabase
        .from('blogs')
        .update({
          published,
          published_at: published ? (blog.publishedAt || now) : null,
          updated_at: now,
        })
        .eq('id', id);
      if (error) setSyncError(error.message);
    }
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      tags,
      colors,
      storageOptions,
      blogs,
      cart,
      orders,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      updateInventory,
      addCategory,
      deleteCategory,
      addTag,
      deleteTag,
      addColor,
      deleteColor,
      addStorageOption,
      deleteStorageOption,
      updateOrderStatus,
      addBlog,
      updateBlog,
      deleteBlog,
      publishBlog,
      totalCartPrice,
      isSyncing,
      syncError,
      isSupabaseReady: Boolean(supabase),
      refreshFromSupabase
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};