
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, LogOut, BookOpen, ArrowLeft } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { CartItem } from '@/context/CartContext';

interface UserData {
  name: string;
  email: string;
}

interface OrderData {
  id: string | number;
  date: string;
  items: CartItem[]; 
  total: number;
  status: string;
  userEmail: string;
  isBorrow?: boolean;
  returnDate?: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial tab based on URL parameter
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'orders' ? 'orders' : 'profile';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentTab = params.get('tab');
    
    if (currentTab !== activeTab && activeTab) {
      navigate(`/profile?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, location.search, navigate]);

  const loadUserData = () => {
    // Load user data
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUserData(parsedUser);
        
        // Get user email
        const userEmail = parsedUser.email;
        console.log("User email:", userEmail);
        
        let combinedOrders: OrderData[] = [];
        
        // First check user-specific orders in 'userOrders_[email]' format
        const userSpecificOrders = localStorage.getItem(`userOrders_${userEmail}`);
        if (userSpecificOrders) {
          try {
            const parsedUserOrders = JSON.parse(userSpecificOrders);
            console.log("Orders from 'userOrders_[email]':", parsedUserOrders);
            
            if (Array.isArray(parsedUserOrders) && parsedUserOrders.length > 0) {
              // Only include orders that actually belong to this user
              const userFilteredOrders = parsedUserOrders.filter(
                (order: OrderData) => order.userEmail === userEmail
              );
              combinedOrders = [...combinedOrders, ...userFilteredOrders];
              console.log("Added user-specific orders:", userFilteredOrders.length);
            }
          } catch (error) {
            console.error(`Error parsing userOrders_${userEmail}:`, error);
          }
        }
        
        // Then check general orders in 'orders'
        const ordersData = localStorage.getItem('orders');
        if (ordersData) {
          try {
            const allOrders = JSON.parse(ordersData);
            console.log("All orders from 'orders':", allOrders);
            
            // Filter by current user's email
            const userOrders = allOrders.filter(
              (order: OrderData) => order.userEmail === userEmail
            );
            
            // Add orders that aren't already in combinedOrders (check by id)
            const existingIds = new Set(combinedOrders.map(order => order.id));
            const newOrders = userOrders.filter(order => !existingIds.has(order.id));
            
            combinedOrders = [...combinedOrders, ...newOrders];
            console.log("Added filtered orders from 'orders':", newOrders.length);
          } catch (error) {
            console.error("Error parsing 'orders':", error);
          }
        }
        
        // Check for borrowed books in 'userBorrows_[email]'
        const userBorrows = localStorage.getItem(`userBorrows_${userEmail}`);
        if (userBorrows) {
          try {
            const parsedBorrows = JSON.parse(userBorrows);
            console.log("Borrows from 'userBorrows_[email]':", parsedBorrows);
            
            if (Array.isArray(parsedBorrows) && parsedBorrows.length > 0) {
              // Filter borrows to only include this user's
              const userFilteredBorrows = parsedBorrows.filter(
                (borrow: any) => !borrow.userEmail || borrow.userEmail === userEmail
              );
              
              // Format borrow records as order-like entries
              const formattedBorrows = userFilteredBorrows.map((borrow: any) => ({
                id: borrow.id,
                date: borrow.date,
                items: [{ ...borrow.book, quantity: 1 }],
                total: 0,
                status: borrow.status || "Взято в чтение",
                userEmail: userEmail,
                isBorrow: true,
                returnDate: borrow.returnDate || null
              }));
              
              // Add borrows that aren't already in combinedOrders
              const existingIds = new Set(combinedOrders.map(order => order.id));
              const newBorrows = formattedBorrows.filter(borrow => !existingIds.has(borrow.id));
              
              combinedOrders = [...combinedOrders, ...newBorrows];
              console.log("Added borrows to orders:", newBorrows.length);
            }
          } catch (error) {
            console.error(`Error parsing userBorrows_${userEmail}:`, error);
          }
        }
        
        // Sort by date (newest first)
        combinedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(combinedOrders);
        
        console.log("Final combined orders:", combinedOrders.length);
      } catch (error) {
        console.error("Error loading user profile:", error);
        navigate('/login');
      }
    } else {
      console.log("No user data found, redirecting to login");
      navigate('/login');
    }
  };
  
  useEffect(() => {
    loadUserData();
  }, [navigate]);
  
  // Update active tab when URL changes
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
  
  const handleReturnBook = (orderId: string | number) => {
    if (!userData) return;
    
    // Find the borrow/order in the list
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.isBorrow) return;
    
    // Get user email
    const userEmail = userData.email;
    
    // Update status in userBorrows
    const userBorrows = localStorage.getItem(`userBorrows_${userEmail}`);
    if (userBorrows) {
      const borrows = JSON.parse(userBorrows);
      const borrowIndex = borrows.findIndex((b: any) => b.id === orderId);
      
      if (borrowIndex !== -1) {
        borrows[borrowIndex].status = "Возвращено";
        localStorage.setItem(`userBorrows_${userEmail}`, JSON.stringify(borrows));
      }
    }
    
    // Update status in userOrders
    const userOrders = localStorage.getItem(`userOrders_${userEmail}`);
    if (userOrders) {
      const parsedOrders = JSON.parse(userOrders);
      const orderIndex = parsedOrders.findIndex((o: any) => o.id === orderId);
      
      if (orderIndex !== -1) {
        parsedOrders[orderIndex].status = "Возвращено";
        localStorage.setItem(`userOrders_${userEmail}`, JSON.stringify(parsedOrders));
      }
    }
    
    // Update book stock
    if (order.items && order.items.length > 0) {
      const bookId = order.items[0].id;
      const storedBooks = localStorage.getItem('books');
      
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        const bookIndex = books.findIndex((b: any) => b.id === bookId);
        
        if (bookIndex !== -1) {
          books[bookIndex].stock += 1;
          localStorage.setItem('books', JSON.stringify(books));
        }
      }
    }
    
    // Show notification
    toast({
      title: "Книга возвращена",
      description: "Спасибо! Книга успешно возвращена в библиотеку.",
    });
    
    // Update UI
    loadUserData();
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
              <CardTitle>История заказов и взятых книг</CardTitle>
              <CardDescription>Просмотр истории ваших заказов и книг, взятых для чтения.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-brown-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {order.isBorrow ? (
                              <BookOpen size={16} className="text-blue-600" />
                            ) : (
                              <Package size={16} className="text-brown-600" />
                            )}
                            <p className="font-medium">
                              {order.isBorrow ? "Взято в чтение" : "Заказ"} #{order.id}
                            </p>
                          </div>
                          <p className="text-sm text-brown-600">{new Date(order.date).toLocaleDateString()}</p>
                          {order.returnDate && (
                            <p className="text-sm text-brown-600">
                              Срок возврата: {new Date(order.returnDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' || order.status === 'Доставлен' || order.status === 'Возвращено' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' || order.status === 'В обработке' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'Взято в чтение' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'pending' ? 'В обработке' : 
                             order.status === 'completed' ? 'Доставлен' : 
                             order.status}
                          </span>
                          
                          {order.isBorrow && order.status === "Взято в чтение" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => handleReturnBook(order.id)}
                            >
                              <ArrowLeft size={14} />
                              Вернуть
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items && order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-brown-600 ml-2">({item.quantity} шт.)</span>
                            </div>
                            <span>{order.isBorrow ? "Бесплатно" : `${(item.price * item.quantity).toLocaleString()} ₽`}</span>
                          </div>
                        ))}
                      </div>
                      
                      {!order.isBorrow && (
                        <div className="mt-4 pt-4 border-t border-brown-200 flex justify-between">
                          <span className="font-medium">Итого:</span>
                          <span className="font-medium">{order.total.toLocaleString()} ₽</span>
                        </div>
                      )}
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
