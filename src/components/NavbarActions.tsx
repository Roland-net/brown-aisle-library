
import { Link } from 'react-router-dom';
import CartNavButton from './CartNavButton';
import UserMenu from './UserMenu';
import { useState, useEffect } from 'react';

const NavbarActions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    const checkUserLogin = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.email) {
            setIsLoggedIn(true);
            setUser(parsedUser);
            console.log("User is logged in:", parsedUser.email);
          } else {
            console.log("Invalid user data format");
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('user'); // Clear invalid data
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          console.log("User is not logged in");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user'); // Clear invalid data
      }
    };

    // Run immediately on component mount
    checkUserLogin();
    
    // Listen for localStorage changes in other tabs
    window.addEventListener('storage', checkUserLogin);
    
    // Listen for custom event for login state changes
    window.addEventListener('userLoginStateChanged', checkUserLogin);
    
    return () => {
      window.removeEventListener('storage', checkUserLogin);
      window.removeEventListener('userLoginStateChanged', checkUserLogin);
    };
  }, []);
  
  return (
    <div className="flex items-center gap-4">
      <CartNavButton />
      
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
