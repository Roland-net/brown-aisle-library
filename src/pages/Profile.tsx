
import { motion } from 'framer-motion';
import UserProfile from '@/components/UserProfile';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в аккаунт для доступа к профилю",
          variant: "destructive",
        });
        setIsLoggedIn(false);
        navigate('/login');
        return;
      }
      
      setIsLoggedIn(true);
      setIsLoading(false);
      
      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      if (params.get('logout') === 'true') {
        localStorage.removeItem('user');
        
        // Dispatch custom event
        window.dispatchEvent(new Event('userLoginStateChanged'));
        
        toast({
          title: "Выход выполнен",
          description: "Вы успешно вышли из системы",
        });
        navigate('/login');
      }
    };
    
    // Check immediately
    checkLoginStatus();
    
    // Listen for login state changes
    window.addEventListener('userLoginStateChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('userLoginStateChanged', checkLoginStatus);
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-brown-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserProfile />
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
