import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const { products, categories } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Use categories from store
  const categoryNames = ['All', ...categories.map(c => c.name)];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-gold-100">Shop</h2>
        <p className="text-gray-400 max-w-2xl mx-auto font-light">
          The premium destination for smartphones, high-performance PCs, and exclusive accessories.
          Quality guaranteed.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-12 flex-wrap gap-4">
        {categoryNames.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 text-sm uppercase tracking-widest border transition-all duration-300 ${
              activeCategory === cat 
                ? 'border-gold-500 text-gold-500 bg-gold-900/10' 
                : 'border-gray-800 text-gray-500 hover:border-gold-800 hover:text-gold-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-serif text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};