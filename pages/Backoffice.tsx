import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  Tag as TagIcon,
  Layers,
  CheckCircle,
  XCircle,
  Palette,
  HardDrive,
  FileText,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { BlogManagement } from '../components/BlogManagement';
import { Blog } from '../types';

type Tab = 'dashboard' | 'products' | 'categories' | 'tags' | 'colors' | 'storage' | 'blogs';

export const Backoffice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const {
    products,
    orders,
    categories,
    tags,
    colors,
    storageOptions,
    updateInventory,
    deleteProduct,
    addProduct,
    addCategory,
    deleteCategory,
    addTag,
    deleteTag,
    addColor,
    deleteColor,
    addStorageOption,
    deleteStorageOption,
    updateOrderStatus,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
    publishBlog
  } = useStore();

  // Stats
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalItemsSold = products.reduce((acc, p) => acc + p.sold, 0);
  const lowStockItems = products.filter(p => p.stock < 5).length;

  // Local state for forms
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newStorage, setNewStorage] = useState('');
  
  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    category: '',
    tags: [] as string[],
    colors: [] as string[],
    storageOptions: [] as string[]
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;
    
    addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        image: newProduct.image || 'https://via.placeholder.com/400',
        stock: Number(newProduct.stock) || 0,
        category: newProduct.category,
        tags: newProduct.tags,
        colors: newProduct.colors,
        storageOptions: newProduct.storageOptions
    });
    setIsProductModalOpen(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image: '',
      stock: '',
      category: '',
      tags: [],
      colors: [],
      storageOptions: []
    });
  };

  const toggleTagSelection = (tagName: string) => {
    setNewProduct(prev => {
        const isSelected = prev.tags.includes(tagName);
        if (isSelected) {
            return { ...prev, tags: prev.tags.filter(t => t !== tagName) };
        } else {
            return { ...prev, tags: [...prev.tags, tagName] };
        }
    });
  };

  const toggleColorSelection = (colorName: string) => {
    setNewProduct(prev => {
      const isSelected = prev.colors.includes(colorName);
      if (isSelected) {
        return { ...prev, colors: prev.colors.filter(c => c !== colorName) };
      }
      return { ...prev, colors: [...prev.colors, colorName] };
    });
  };

  const toggleStorageSelection = (storageLabel: string) => {
    setNewProduct(prev => {
      const isSelected = prev.storageOptions.includes(storageLabel);
      if (isSelected) {
        return { ...prev, storageOptions: prev.storageOptions.filter(s => s !== storageLabel) };
      }
      return { ...prev, storageOptions: [...prev.storageOptions, storageLabel] };
    });
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="w-64 bg-onyx-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-serif text-gold-400">Management</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <TrendingUp size={20} />
                <span>Dashboard</span>
            </button>
            <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <Package size={20} />
                <span>Products</span>
            </button>
            <button 
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'categories' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <Layers size={20} />
                <span>Categories</span>
            </button>
            <button 
                onClick={() => setActiveTab('tags')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'tags' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <TagIcon size={20} />
                <span>Tags</span>
            </button>
            <button 
                onClick={() => setActiveTab('colors')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'colors' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <Palette size={20} />
                <span>Colors</span>
            </button>
            <button 
                onClick={() => setActiveTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'storage' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <HardDrive size={20} />
                <span>Storage</span>
            </button>
            <button 
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'blogs' ? 'bg-gold-900/20 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
            >
                <FileText size={20} />
                <span>Blogs</span>
            </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-onyx-950 p-8">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
            <div className="space-y-8">
                <h2 className="text-3xl font-serif text-white">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-onyx-900 p-6 border border-gray-800 rounded-lg flex items-center">
                        <div className="p-3 bg-gold-900/20 rounded-full text-gold-500 mr-4">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wide">Revenue</p>
                            <p className="text-2xl font-bold text-white">{totalSales.toLocaleString()} DHs</p>
                        </div>
                    </div>
                    <div className="bg-onyx-900 p-6 border border-gray-800 rounded-lg flex items-center">
                        <div className="p-3 bg-blue-900/20 rounded-full text-blue-500 mr-4">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wide">Units Sold</p>
                            <p className="text-2xl font-bold text-white">{totalItemsSold}</p>
                        </div>
                    </div>
                    <div className="bg-onyx-900 p-6 border border-gray-800 rounded-lg flex items-center">
                        <div className="p-3 bg-red-900/20 rounded-full text-red-500 mr-4">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wide">Low Stock</p>
                            <p className="text-2xl font-bold text-white">{lowStockItems}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-onyx-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-lg text-white font-medium">Recent Orders</h3>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black text-gray-200 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-gold-500">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-xs">
                                                    {item.name} (x{item.quantity})
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{order.total.toLocaleString()} DHs</td>
                                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            order.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                                            order.status === 'Cancelled' ? 'bg-red-900/30 text-red-400' :
                                            'bg-yellow-900/30 text-yellow-400'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {order.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Completed')}
                                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                                                    title="Confirm order"
                                                >
                                                    <CheckCircle size={14} />
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                                                    title="Cancel order"
                                                >
                                                    <XCircle size={14} />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif text-white">Inventory</h2>
                    <button 
                        onClick={() => setIsProductModalOpen(true)}
                        className="bg-gold-600 hover:bg-gold-500 text-black px-4 py-2 rounded font-bold flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>
                
                <div className="bg-onyx-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Colors</th>
                                <th className="px-6 py-3">Storage</th>
                                <th className="px-6 py-3">Tags</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-800/50">
                                        <td className="px-6 py-4 flex items-center gap-3 text-white">
                                            <img src={product.image} className="w-8 h-8 rounded object-cover" alt="" />
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {product.colors.map(color => (
                                                <span key={color} className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {product.storageOptions.map(option => (
                                                <span key={option} className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                    {option}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.map(t => (
                                                    <span key={t} className="text-[10px] bg-gray-800 px-1 rounded border border-gray-700">{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.price.toLocaleString()} DHs</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateInventory(product.id, Math.max(0, product.stock - 1))} className="px-2 bg-gray-800 rounded">-</button>
                                                <span className="w-6 text-center">{product.stock}</span>
                                                <button onClick={() => updateInventory(product.id, product.stock + 1)} className="px-2 bg-gray-800 rounded">+</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => deleteProduct(product.id)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
            <div className="max-w-2xl">
                <h2 className="text-3xl font-serif text-white mb-8">Manage Categories</h2>
                
                <div className="flex gap-4 mb-8">
                    <input 
                        type="text" 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                        className="flex-1 bg-onyx-900 border border-gray-700 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                    />
                    <button 
                        onClick={() => { if(newCategory) { addCategory(newCategory); setNewCategory(''); }}}
                        className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded font-bold"
                    >
                        Add
                    </button>
                </div>

                <div className="space-y-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center bg-onyx-900 p-4 rounded border border-gray-800">
                            <span className="text-lg text-gray-200">{cat.name}</span>
                            <button onClick={() => deleteCategory(cat.id)} className="text-gray-500 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TAGS TAB */}
        {activeTab === 'tags' && (
            <div className="max-w-2xl">
                <h2 className="text-3xl font-serif text-white mb-8">Manage Tags</h2>
                
                <div className="flex gap-4 mb-8">
                    <input 
                        type="text" 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New Tag Name (e.g., 'Discount', 'Best Seller')"
                        className="flex-1 bg-onyx-900 border border-gray-700 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                    />
                    <button 
                        onClick={() => { if(newTag) { addTag(newTag); setNewTag(''); }}}
                        className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded font-bold"
                    >
                        Add
                    </button>
                </div>

                <div className="space-y-3">
                    {tags.map(tag => (
                        <div key={tag.id} className="flex justify-between items-center bg-onyx-900 p-4 rounded border border-gray-800">
                            <span className="text-lg text-gray-200 flex items-center gap-2">
                                <TagIcon size={16} className="text-gold-500" /> {tag.name}
                            </span>
                            <button onClick={() => deleteTag(tag.id)} className="text-gray-500 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* COLORS TAB */}
        {activeTab === 'colors' && (
            <div className="max-w-2xl">
                <h2 className="text-3xl font-serif text-white mb-8">Manage Colors</h2>
                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        value={newColor}
                        onChange={e => setNewColor(e.target.value)}
                        placeholder="New Color Name"
                        className="flex-1 bg-onyx-900 border border-gray-700 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                    />
                    <button
                        onClick={() => { if (newColor) { addColor(newColor); setNewColor(''); } }}
                        className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded font-bold"
                    >
                        Add
                    </button>
                </div>
                <div className="space-y-3">
                    {colors.map(color => (
                        <div key={color.id} className="flex justify-between items-center bg-onyx-900 p-4 rounded border border-gray-800">
                            <span className="text-lg text-gray-200">{color.name}</span>
                            <button onClick={() => deleteColor(color.id)} className="text-gray-500 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* STORAGE TAB */}
        {activeTab === 'storage' && (
            <div className="max-w-2xl">
                <h2 className="text-3xl font-serif text-white mb-8">Manage Storage Options</h2>
                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        value={newStorage}
                        onChange={e => setNewStorage(e.target.value)}
                        placeholder="New Storage Label (e.g., 128 GB)"
                        className="flex-1 bg-onyx-900 border border-gray-700 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                    />
                    <button
                        onClick={() => { if (newStorage) { addStorageOption(newStorage); setNewStorage(''); } }}
                        className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded font-bold"
                    >
                        Add
                    </button>
                </div>
                <div className="space-y-3">
                    {storageOptions.map(option => (
                        <div key={option.id} className="flex justify-between items-center bg-onyx-900 p-4 rounded border border-gray-800">
                            <span className="text-lg text-gray-200">{option.label}</span>
                            <button onClick={() => deleteStorageOption(option.id)} className="text-gray-500 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === 'blogs' && (
            <BlogManagement
                blogs={blogs}
                onAdd={addBlog}
                onUpdate={updateBlog}
                onDelete={deleteBlog}
                onPublish={publishBlog}
            />
        )}

      </div>

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
            <div className="bg-onyx-900 p-8 rounded-lg border border-gold-900 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-serif text-gold-400 mb-6">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                        <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price (DHs)</label>
                            <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Stock</label>
                            <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none">
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(t => (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() => toggleTagSelection(t.name)}
                                    className={`text-xs px-3 py-1 rounded border transition-colors ${newProduct.tags.includes(t.name) ? 'bg-gold-600 border-gold-600 text-black' : 'border-gray-700 text-gray-400'}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map(c => (
                                <button
                                    type="button"
                                    key={c.id}
                                    onClick={() => toggleColorSelection(c.name)}
                                    className={`text-xs px-3 py-1 rounded border transition-colors ${newProduct.colors.includes(c.name) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-700 text-gray-400'}`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Storage Options</label>
                        <div className="flex flex-wrap gap-2">
                            {storageOptions.map(option => (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => toggleStorageSelection(option.label)}
                                    className={`text-xs px-3 py-1 rounded border transition-colors ${newProduct.storageOptions.includes(option.label) ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-700 text-gray-400'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Product Image</label>
                        <ImageUpload
                            value={newProduct.image}
                            onChange={(url) => setNewProduct({...newProduct, image: url})}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gold-600 text-black font-bold rounded hover:bg-gold-500">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};