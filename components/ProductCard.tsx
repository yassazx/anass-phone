import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-onyx-900 border border-gold-800/20 hover:border-gold-500/50 transition-all duration-500 ease-out overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        
        {/* Sold Out Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <span className="text-gold-400 border border-gold-400 px-4 py-2 uppercase tracking-widest text-sm font-serif">Sold Out</span>
          </div>
        )}

        {/* Tags Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tags.map(tag => (
                <span key={tag} className="bg-black/80 backdrop-blur text-gold-400 text-[10px] uppercase font-bold px-2 py-1 rounded border border-gold-900/50">
                    {tag}
                </span>
            ))}
        </div>

        {/* Quick Add Overlay */}
        {product.stock > 0 && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-gold-600 hover:bg-gold-500 text-onyx-950 py-3 font-semibold uppercase tracking-wider text-xs transition-colors"
            >
              Add to Cart — {product.price.toLocaleString()} DHs
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif text-gray-100 group-hover:text-gold-400 transition-colors leading-tight">{product.name}</h3>
        </div>
        <p className="text-gold-500 font-bold mb-2">{product.price.toLocaleString()} DHs</p>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
        
        {(product.colors.length > 0 || product.storageOptions.length > 0) && (
          <div className="space-y-1 text-xs text-gray-400 mb-4">
            {product.colors.length > 0 && (
              <p>Couleurs: <span className="text-gray-200">{product.colors.join(', ')}</span></p>
            )}
            {product.storageOptions.length > 0 && (
              <p>Stockage: <span className="text-gray-200">{product.storageOptions.join(', ')}</span></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};