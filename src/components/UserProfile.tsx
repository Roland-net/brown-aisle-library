
import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { User, Package, ClipboardList, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Order {
  id: number;
  date: string;
  items: any[];
  totalPrice: number;
  status: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user orders
      const userOrders = localStorage.getItem('userOrders_' + parsedUser.email);
      if (userOrders) {
        setOrders(JSON.parse(userOrders));
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Загрузка...</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-brown-700 text-white text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-serif text-brown-800">{user.name}</h1>
            <p className="text-brown-600">{user.email}</p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-brown-700 hover:bg-brown-100 rounded-md transition-colors">
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package size={16} />
            <span>Мои заказы</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>Управление данными вашего профиля</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-brown-700">Имя</label>
                  <div className="mt-1 p-3 bg-cream-50 rounded-md">{user.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-brown-700">Email</label>
                  <div className="mt-1 p-3 bg-cream-50 rounded-md">{user.email}</div>
                </div>
                {user.email === 'roladn.ttt@mail.ru' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="text-amber-800 font-medium">Администратор</div>
                    <p className="text-amber-700 text-sm mt-1">
                      У вас есть доступ к панели администрирования
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
              <CardDescription>Просмотр всех ваших заказов</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList size={48} className="mx-auto text-brown-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">У вас пока нет заказов</h3>
                  <p className="text-brown-600">Ваши будущие заказы будут отображаться здесь</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-brown-200 rounded-lg overflow-hidden">
                      <div className="bg-brown-50 p-4 flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <div className="text-sm text-brown-600">Заказ #{order.id}</div>
                          <div className="font-medium">
                            {format(new Date(order.date), "d MMMM yyyy, HH:mm", { locale: ru })}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-brown-600">Статус</div>
                          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                            {order.status}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-brown-600">Сумма</div>
                          <div className="font-medium">{order.totalPrice.toLocaleString()} ₽</div>
                        </div>
                      </div>
                      
                      <div className="p-4 divide-y divide-brown-100">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 flex items-center">
                            <div className="w-12 h-16 bg-brown-50 rounded overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-brown-600">{item.author}</div>
                            </div>
                            <div className="text-brown-600 text-sm">
                              {item.quantity} шт. × {item.price.toLocaleString()} ₽
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 bg-brown-50 border-t border-brown-200">
                        <div className="text-sm font-medium mb-1">Адрес доставки:</div>
                        <div className="text-brown-700">
                          {order.shippingAddress.fullName}, {order.shippingAddress.phone}
                        </div>
                        <div className="text-brown-700">
                          {order.shippingAddress.city}, {order.shippingAddress.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
