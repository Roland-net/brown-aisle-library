import { useState, useEffect } from 'react';
import { useOrders, Order } from '@/context/OrderContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Inbox, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const OrdersTable = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  // Get the admin's email to ensure we can identify their orders
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.email) {
          setAdminEmail(parsedUser.email);
        }
      } catch (error) {
        console.error("Error parsing admin user data:", error);
      }
    }
  }, []);
  
  // Update orders state from localStorage directly
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Load all orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    let ordersFromStorage: Order[] = [];
    
    if (storedOrders) {
      try {
        ordersFromStorage = JSON.parse(storedOrders);
      } catch (error) {
        console.error("Error parsing orders:", error);
      }
    }
    
    // Admin sees all orders from the main orders list
    setAllOrders(ordersFromStorage);
    
  }, [orders, adminEmail]); // Dependency on orders for updating when changes occur
  
  const pendingOrders = allOrders.filter(order => order.status === 'pending');
  const completedOrders = allOrders.filter(order => order.status === 'completed');
  
  if (allOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <Inbox className="mx-auto h-12 w-12 text-brown-300" />
        <h3 className="mt-2 text-sm font-semibold">Нет заказов</h3>
        <p className="mt-1 text-sm text-gray-500">Заказы появятся здесь, как только покупатели оформят их.</p>
      </div>
    );
  }
  
  const handleStatusChange = (orderId: string, status: 'pending' | 'completed') => {
    updateOrderStatus(orderId, status);
    
    // Update local orders state
    setAllOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Статус заказа обновлен",
      description: status === 'completed' ? "Заказ отмечен как выполненный" : "Заказ возвращен в обработку",
    });
    
    setIsDetailsOpen(false);
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Заказы в обработке ({pendingOrders.length})</h3>
        {pendingOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID заказа</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Покупатель</TableHead>
                <TableHead>Количество товаров</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), 'dd MMM yyyy, HH:mm', { locale: ru })}
                  </TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>{order.total.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      В обработке
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewOrderDetails(order)}
                      >
                        Детали
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleStatusChange(order.id, 'completed')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Готово
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">Нет заказов в обработке</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Выполненные заказы ({completedOrders.length})</h3>
        {completedOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID заказа</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Покупатель</TableHead>
                <TableHead>Количество товаров</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), 'dd MMM yyyy, HH:mm', { locale: ru })}
                  </TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>{order.total.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Выполнен
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewOrderDetails(order)}
                    >
                      Детали
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">Нет выполненных заказов</p>
          </div>
        )}
      </div>
      
      {/* Диалог с деталями заказа */}
      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Детали заказа #{selectedOrder.id}</DialogTitle>
              <DialogDescription>
                {format(new Date(selectedOrder.date), 'dd MMMM yyyy, HH:mm', { locale: ru })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Покупатель</h4>
                  <p>{selectedOrder.customer.name}</p>
                  <p>{selectedOrder.customer.email}</p>
                  <p>{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Статус</h4>
                  <Badge variant={selectedOrder.status === 'completed' ? 'success' : 'secondary'}>
                    {selectedOrder.status === 'completed' ? 'Выполнен' : 'В обработке'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Товары</h4>
                <div className="bg-gray-50 rounded-md p-3 space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-14 bg-white rounded overflow-hidden mr-3">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.quantity} шт. × {item.price.toLocaleString()} ₽</p>
                        </div>
                      </div>
                      <p className="font-medium">{(item.quantity * item.price).toLocaleString()} ₽</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Итого:</span>
                <span className="text-lg font-semibold">{selectedOrder.total.toLocaleString()} ₽</span>
              </div>
            </div>
            
            <DialogFooter>
              {selectedOrder.status === 'pending' ? (
                <Button onClick={() => handleStatusChange(selectedOrder.id, 'completed')}>
                  <Check className="h-4 w-4 mr-1" /> Отметить как готовый
                </Button>
              ) : (
                <Button variant="outline" onClick={() => handleStatusChange(selectedOrder.id, 'pending')}>
                  Вернуть в обработку
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrdersTable;
