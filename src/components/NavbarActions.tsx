
import { Link } from 'react-router-dom';
import CartButton from './CartButton';
import UserMenu from './UserMenu';
import { useState, useEffect } from 'react';

const NavbarActions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!userData);
  }, []);
  
  return (
    <div className="flex items-center gap-4">
      <CartButton />
      
      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <Link 
          to="/login" 
          className="px-4 py-2 bg-brown-700 text-white rounded-md hover:bg-brown-800 transition-colors whitespace-nowrap"
        >
          Войти
        </Link>
      )}
    </div>
  );
};

export default NavbarActions;
