import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  toggleCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleCart }) => {
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-onyx-950/90 backdrop-blur-md border-b border-gold-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/logo_ap.png" 
              alt="Anass Phone Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-2xl font-serif text-gold-100 tracking-wide uppercase">Anass Phone</h1>
              <p className="text-[10px] text-gold-500 tracking-[0.3em] uppercase">Premium Tech</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-gold-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-gold-200"
            >
              Shop
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-gold-200"
            >
              Blog
            </Link>
            {/* Cart Icon */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-gold-400 hover:text-white transition-all duration-300 group"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-onyx-950 transform translate-x-1/4 -translate-y-1/4 bg-gold-500 rounded-full">
                  {cartCount}
                </span>
              )}
              <div className="absolute inset-0 rounded-full border border-gold-500 opacity-0 scale-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};