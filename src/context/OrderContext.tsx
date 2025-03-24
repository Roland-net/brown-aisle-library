
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
  userEmail: string; // Field for user filtering
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

  // Load orders from localStorage on initialization
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    // Get the user from localStorage to ensure we're using the correct user email
    const userData = localStorage.getItem('user');
    let userEmail = orderData.userEmail; // Default to provided email
    
    // If user data exists in localStorage, use that email to ensure consistency
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.email) {
          userEmail = parsedUser.email;
          console.log("Using logged-in user email for order:", userEmail);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending',
      userEmail: userEmail // Ensure we use the correct email
    };

    // Update main orders list
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Save to user-specific orders
    if (userEmail) {
      const userOrdersKey = `userOrders_${userEmail}`;
      const existingUserOrders = localStorage.getItem(userOrdersKey);
      
      let userOrders = [];
      if (existingUserOrders) {
        try {
          userOrders = JSON.parse(existingUserOrders);
        } catch (error) {
          console.error("Error parsing user orders:", error);
          userOrders = [];
        }
      }
      
      userOrders.push(newOrder);
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
      
      // For debugging
      console.log(`Added order to ${userOrdersKey}:`, newOrder);
      console.log("Current user orders:", userOrders);
    } else {
      console.warn("Order created without userEmail, will not appear in user history");
    }
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'completed') => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Update main order list
          const updatedOrder = { ...order, status };
          
          // Also update in user-specific orders if email exists
          if (order.userEmail) {
            const userOrdersKey = `userOrders_${order.userEmail}`;
            const userOrders = localStorage.getItem(userOrdersKey);
            
            if (userOrders) {
              try {
                const parsedUserOrders = JSON.parse(userOrders);
                const updatedUserOrders = parsedUserOrders.map((userOrder: Order) => 
                  userOrder.id === orderId ? { ...userOrder, status } : userOrder
                );
                
                localStorage.setItem(userOrdersKey, JSON.stringify(updatedUserOrders));
              } catch (error) {
                console.error("Error updating user order status:", error);
              }
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
