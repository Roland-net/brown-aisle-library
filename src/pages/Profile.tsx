
import { motion } from 'framer-motion';
import UserProfile from '@/components/UserProfile';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в аккаунт для доступа к профилю",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate]);
  
  // Log out any existing user if requested
  const params = new URLSearchParams(window.location.search);
  if (params.get('logout') === 'true') {
    localStorage.removeItem('user');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate('/login');
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
