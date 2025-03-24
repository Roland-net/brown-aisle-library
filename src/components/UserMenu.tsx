
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { User, Package, Settings, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserMenu = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User loaded in UserMenu:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из аккаунта"
    });
    navigate('/');
    window.location.reload();
  };
  
  if (!user) return null;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-brown-100/50 transition-colors outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-brown-700 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium md:block hidden">{user.name}</span>
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-56 p-2" align="end">
        <div className="py-2 px-3">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-brown-600 truncate">{user.email}</div>
        </div>
        
        <div className="my-1 h-px bg-brown-200" />
        
        <div className="py-1">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-brown-100 transition-colors"
          >
            <User size={16} />
            <span>Мой профиль</span>
          </Link>
          
          <Link 
            to="/profile?tab=orders" 
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-brown-100 transition-colors"
          >
            <Package size={16} />
            <span>Мои заказы</span>
          </Link>
          
          {user.email === 'roladn.ttt@mail.ru' && (
            <Link 
              to="/admin" 
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-brown-100 transition-colors"
            >
              <Settings size={16} />
              <span>Администрирование</span>
            </Link>
          )}
        </div>
        
        <div className="my-1 h-px bg-brown-200" />
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-brown-100 transition-colors text-red-600"
        >
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
