
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { CartItem } from '@/context/CartContext';

interface UserData {
  name: string;
  email: string;
  orders?: {
    id: number;
    date: string;
    items: CartItem[]; 
    total: number;
    status: string;
  }[];
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Определяем начальную вкладку на основе URL параметра
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'orders' ? 'orders' : 'profile';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        
        // Получаем или создаем историю заказов
        const ordersData = localStorage.getItem('orders');
        let orders = [];
        
        if (ordersData) {
          try {
            orders = JSON.parse(ordersData);
            console.log("Orders loaded:", orders);
          } catch (error) {
            console.error("Error parsing orders:", error);
          }
        }
        
        setUserData({
          ...parsedUser,
          orders: orders.filter((order: any) => order.userEmail === parsedUser.email)
        });
        
        console.log("User profile loaded:", parsedUser);
      } catch (error) {
        console.error("Error loading user profile:", error);
        navigate('/login');
      }
    } else {
      console.log("No user data found, redirecting to login");
      navigate('/login');
    }
  }, [navigate]);
  
  // Обновляем активную вкладку при изменении URL
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate('/login');
    window.location.reload();
  };
  
  if (!userData) {
    return (
      <div className="text-center py-12">
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-8 text-brown-800">Мой профиль</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="px-6">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="orders" className="px-6">
            <Package className="mr-2 h-4 w-4" />
            История заказов
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
              <CardDescription>Просмотр и управление информацией вашего аккаунта.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-brown-600">Имя</label>
                  <p className="text-brown-900 font-medium">{userData.name}</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-brown-600">Email</label>
                  <p className="text-brown-900 font-medium">{userData.email}</p>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти из аккаунта
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
              <CardDescription>Просмотр истории ваших заказов.</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.orders && userData.orders.length > 0 ? (
                <div className="space-y-6">
                  {userData.orders.map((order) => (
                    <div key={order.id} className="border border-brown-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium">Заказ #{order.id}</p>
                          <p className="text-sm text-brown-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Доставлен' ? 'bg-green-100 text-green-700' :
                          order.status === 'В обработке' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-brown-600 ml-2">({item.quantity} шт.)</span>
                            </div>
                            <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-brown-200 flex justify-between">
                        <span className="font-medium">Итого:</span>
                        <span className="font-medium">{order.total.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-brown-600">
                  <Package className="mx-auto h-12 w-12 text-brown-400 mb-4" />
                  <p>У вас пока нет заказов</p>
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
