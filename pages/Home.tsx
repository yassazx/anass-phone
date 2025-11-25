import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, DollarSign, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[90vh] pt-20 bg-gradient-to-b from-onyx-950 via-onyx-900/50 to-onyx-950 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,165,54,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>

        {/* Animated Gold Accents with Movement */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Logo with Circle */}
          <div className="mb-16 flex justify-center">
            <div className="relative">
              {/* Outer Glow Circle - Multiple Layers */}
              <div className="absolute inset-0 rounded-full bg-gold-500/30 blur-3xl animate-pulse"></div>
              <div className="absolute inset-[-20px] rounded-full bg-gold-500/15 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Rotating Ring */}
              <div className="absolute inset-[-10px] rounded-full border-2 border-gold-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
              
              {/* Main Circle */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-gold-500/60 bg-gradient-to-br from-gold-900/30 via-gold-800/15 to-transparent flex items-center justify-center backdrop-blur-md shadow-[0_0_60px_rgba(212,165,54,0.4)] hover:shadow-[0_0_80px_rgba(212,165,54,0.6)] transition-all duration-500">
                {/* Inner Circle Glow - Animated */}
                <div className="absolute inset-6 rounded-full border border-gold-500/40 animate-pulse"></div>
                <div className="absolute inset-8 rounded-full border border-gold-500/20"></div>
                
                {/* Logo with Hover Effect */}
                <img 
                  src="/logo_ap.png" 
                  alt="Anass Phone Logo" 
                  className="relative z-10 h-32 w-32 sm:h-40 sm:w-40 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100 mb-8 tracking-tight animate-gradient drop-shadow-[0_0_30px_rgba(212,165,54,0.5)]">
            Anass Phone
          </h1>
          
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-100 mb-20 font-light max-w-4xl mx-auto leading-relaxed">
            Premium Tech, <span className="text-gold-400 font-semibold relative inline-block">
              <span className="absolute inset-0 bg-gold-400/20 blur-xl"></span>
              <span className="relative">Unmatched Quality</span>
            </span>, Best Prices
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            {/* 1 Month Guarantee */}
            <div className="group bg-gradient-to-br from-onyx-900/90 to-onyx-950/90 backdrop-blur-md border border-gold-900/40 rounded-2xl p-8 hover:border-gold-500/70 hover:shadow-[0_0_30px_rgba(212,165,54,0.2)] transition-all duration-500 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-gold-900/30 to-gold-800/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-gold-400" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-display font-semibold text-gold-300 mb-3">1 Month Guarantee</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Full warranty coverage on all products. Your satisfaction is our priority.
              </p>
            </div>

            {/* Quality */}
            <div className="group bg-gradient-to-br from-onyx-900/90 to-onyx-950/90 backdrop-blur-md border border-gold-900/40 rounded-2xl p-8 hover:border-gold-500/70 hover:shadow-[0_0_30px_rgba(212,165,54,0.2)] transition-all duration-500 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-gold-900/30 to-gold-800/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-gold-400" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-display font-semibold text-gold-300 mb-3">Premium Quality</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Only the finest smartphones, PCs, and accessories. Quality you can trust.
              </p>
            </div>

            {/* Best Price */}
            <div className="group bg-gradient-to-br from-onyx-900/90 to-onyx-950/90 backdrop-blur-md border border-gold-900/40 rounded-2xl p-8 hover:border-gold-500/70 hover:shadow-[0_0_30px_rgba(212,165,54,0.2)] transition-all duration-500 hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-gold-900/30 to-gold-800/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="text-gold-400" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-display font-semibold text-gold-300 mb-3">Best Prices</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Competitive pricing in the market. Premium products at unbeatable prices.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold px-10 py-5 rounded-xl text-lg uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(212,165,54,0.4)] hover:shadow-[0_0_40px_rgba(212,165,54,0.6)] hover:scale-105"
          >
            Explore Our Products
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Additional Section */}
      <div className="bg-gradient-to-b from-onyx-950 via-onyx-900 to-onyx-950 py-20 border-t border-gold-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400 mb-4">
            Why Choose Anass Phone?
          </h2>
          <p className="text-gray-400 mb-12 text-lg">Experience the difference</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-onyx-900/50 backdrop-blur-sm border border-gold-900/20 rounded-xl p-6 hover:border-gold-500/40 transition-all duration-300">
              <h3 className="text-gold-400 font-display font-semibold text-xl mb-2">Wide Selection</h3>
              <p className="text-gray-300 text-sm">Apple, Samsung, PCs, and more</p>
            </div>
            <div className="bg-onyx-900/50 backdrop-blur-sm border border-gold-900/20 rounded-xl p-6 hover:border-gold-500/40 transition-all duration-300">
              <h3 className="text-gold-400 font-display font-semibold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-300 text-sm">Quick and reliable shipping</p>
            </div>
            <div className="bg-onyx-900/50 backdrop-blur-sm border border-gold-900/20 rounded-xl p-6 hover:border-gold-500/40 transition-all duration-300">
              <h3 className="text-gold-400 font-display font-semibold text-xl mb-2">Expert Support</h3>
              <p className="text-gray-300 text-sm">Dedicated customer service</p>
            </div>
            <div className="bg-onyx-900/50 backdrop-blur-sm border border-gold-900/20 rounded-xl p-6 hover:border-gold-500/40 transition-all duration-300">
              <h3 className="text-gold-400 font-display font-semibold text-xl mb-2">Secure Payment</h3>
              <p className="text-gray-300 text-sm">Safe and easy checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

