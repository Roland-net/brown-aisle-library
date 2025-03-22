
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  total: number;
  date: string;
  status: 'pending' | 'completed';
  userEmail: string; // Поле userEmail для фильтрации
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: 'pending' | 'completed') => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Загрузка заказов из localStorage при инициализации
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Сохранение заказов в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending'
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Проверим, существует ли уже список заказов для этого пользователя
    const userEmail = orderData.userEmail;
    const userOrdersKey = `userOrders_${userEmail}`;
    const existingUserOrders = localStorage.getItem(userOrdersKey);
    
    let userOrders = [];
    if (existingUserOrders) {
      userOrders = JSON.parse(existingUserOrders);
    }
    
    // Добавим новый заказ в список заказов пользователя
    userOrders.push(newOrder);
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'completed') => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Обновляем и основной список, и заказы пользователя
          const updatedOrder = { ...order, status };
          
          // Обновляем в userOrders_[email] если заказ содержит email пользователя
          if (order.userEmail) {
            const userOrdersKey = `userOrders_${order.userEmail}`;
            const userOrders = localStorage.getItem(userOrdersKey);
            
            if (userOrders) {
              const parsedUserOrders = JSON.parse(userOrders);
              const updatedUserOrders = parsedUserOrders.map((userOrder: Order) => 
                userOrder.id === orderId ? { ...userOrder, status } : userOrder
              );
              
              localStorage.setItem(userOrdersKey, JSON.stringify(updatedUserOrders));
            }
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
