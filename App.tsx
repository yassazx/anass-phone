import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { BlogList } from './pages/BlogList';
import { BlogDetail } from './pages/BlogDetail';
import { CartSidebar } from './components/CartSidebar';
import { BackofficeGuard } from './pages/BackofficeGuard';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <StoreProvider>
      <Router>
      <div className="min-h-screen bg-onyx-950 text-gray-100 font-sans selection:bg-gold-500 selection:text-onyx-950">
          <Navbar toggleCart={() => setIsCartOpen(true)} />
        
        <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/backoffice" element={<BackofficeGuard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>

          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
      </Router>
    </StoreProvider>
  );
};

export default App;