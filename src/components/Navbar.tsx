import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  
  // Получаем информацию о пользователе из localStorage
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Проверяем, есть ли данные пользователя в localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Проверяем, является ли пользователь администратором
      setIsAdmin(parsedUser.email === 'roladn.ttt@mail.ru');
    }
  }, []);
  
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
  
  // Создаем массив навигационных ссылок без "Вход" (добавим условно позже)
  const navLinks = [
    { name: "О библиотеке", path: "/about" },
    { name: "Каталог", path: "/catalog" },
  ];
  
  // Добавляем ссылку администрирования, если пользователь - администратор
  if (isAdmin) {
    navLinks.push({ name: "Администрирование", path: "/admin" });
  }
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    // Удаляем данные пользователя из localStorage
    localStorage.removeItem('user');
    setUser(null);
    // Перенаправляем на главную страницу и перезагружаем страницу
    navigate('/');
    window.location.reload();
  };
  
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
            
            {/* Компонент пользователя (отображается, если пользователь вошел) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 text-cream-100 hover:text-cream-50 p-2">
                    <Avatar className="h-8 w-8 border border-cream-200/30">
                      <AvatarFallback className="bg-brown-700 text-cream-100">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate('/admin')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Администрирование</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/login') 
                    ? 'text-cream-100' 
                    : 'text-cream-200/80 hover:text-cream-100'
                }`}
              >
                Вход
                {isActive('/login') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cream-200 rounded-full" />
                )}
              </Link>
            )}
            
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
            
            {user ? (
              <>
                <div className="block px-3 py-4 text-base font-medium border-b border-brown-700 text-cream-100">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 border border-cream-200/30">
                      <AvatarFallback className="bg-brown-700 text-cream-100">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="w-full text-left block px-3 py-4 text-base font-medium border-b border-brown-700 text-cream-200/80"
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Профиль
                  </div>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className={`block px-3 py-4 text-base font-medium border-b border-brown-700 ${
                  isActive('/login') 
                    ? 'text-cream-100' 
                    : 'text-cream-200/80'
                }`}
              >
                Вход
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
