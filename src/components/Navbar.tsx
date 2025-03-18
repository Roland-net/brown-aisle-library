
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const navLinks = [
    { name: "О библиотеке", path: "/about" },
    { name: "Каталог", path: "/catalog" },
    { name: "Вход", path: "/login" },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brown-800/95 backdrop-blur-md shadow-md' : 'bg-brown-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center">
              <span className="text-cream-50 font-serif text-2xl font-medium tracking-wide transition-transform group-hover:scale-105 duration-300">
                VOLTRIX
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(link.path) 
                    ? 'text-cream-100' 
                    : 'text-cream-200/80 hover:text-cream-100'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cream-200 rounded-full" />
                )}
              </Link>
            ))}
            
            <Link to="/cart" className="relative text-cream-100 p-2">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-400 text-brown-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile navigation toggle */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="relative text-cream-100 p-2">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-400 text-brown-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cream-100 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="md:hidden bg-brown-800 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-4 text-base font-medium border-b border-brown-700 ${
                  isActive(link.path) 
                    ? 'text-cream-100' 
                    : 'text-cream-200/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
