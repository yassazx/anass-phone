import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, MessageCircle, Trash2 } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, totalCartPrice, placeOrder } = useStore();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!phoneNumber) {
      alert('Numéro WhatsApp non configuré. Veuillez contacter le support.');
      return;
    }

    // Build short French message
    let message = "*Nouvelle commande*\n\n";
    cart.forEach(item => {
      message += `${item.name} (x${item.quantity}): ${(item.price * item.quantity).toLocaleString()} DH\n`;
      if (item.colors.length > 0) {
        message += `Couleurs: ${item.colors.join(', ')}\n`;
      }
      if (item.storageOptions.length > 0) {
        message += `Stockage: ${item.storageOptions.join(', ')}\n`;
      }
    });
    message += `\n*Total: ${totalCartPrice.toLocaleString()} DH*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    placeOrder();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-onyx-950 border-l border-gold-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-900">
            <h2 className="text-xl font-serif text-gold-400">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>Your bag is empty.</p>
                <button onClick={onClose} className="mt-4 text-gold-500 hover:underline">Browse Products</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-900 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-gray-200 font-medium font-serif">{item.name}</h3>
                      <p className="text-gold-600 text-sm">{item.price.toLocaleString()} DHs</p>
                      <div className="flex gap-1 mt-1">
                          {item.tags.map(t => (
                              <span key={t} className="text-[10px] bg-gray-800 text-gray-400 px-1 rounded">{t}</span>
                          ))}
                      </div>
                      {item.colors.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.colors.map(color => (
                            <span key={color} className="text-[10px] bg-blue-900/40 text-blue-200 px-1 rounded">
                              {color}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.storageOptions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.storageOptions.map(option => (
                            <span key={option} className="text-[10px] bg-purple-900/40 text-purple-200 px-1 rounded">
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-onyx-900 border-t border-gold-900/50">
              <div className="flex justify-between items-center mb-6 text-xl">
                <span className="text-gray-400 font-serif">Total</span>
                <span className="text-gold-400 font-bold">{totalCartPrice.toLocaleString()} DHs</span>
              </div>
              
              <div className="space-y-3">
                <div className="text-center text-xs text-gray-500 mb-2">
                  Cash on Delivery • Free Shipping
                </div>
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)]"
                >
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};