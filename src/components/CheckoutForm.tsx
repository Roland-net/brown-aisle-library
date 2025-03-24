
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { useOrders } from '@/context/OrderContext';

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  phone: z.string().min(10, { message: "Телефон должен содержать минимум 10 цифр" }),
  agreement: z.boolean().refine(val => val === true, {
    message: "Вы должны согласиться с условиями",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      agreement: false,
    },
  });

  // Load user data from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.email) {
          setLoggedInUserEmail(user.email);
          setLoggedInUserName(user.name || '');
          setIsLoggedIn(true);
          // Pre-fill form with user data if logged in
          form.setValue('name', user.name || '');
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [form]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы оформить заказ",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Check if all items in cart are available in stock
  const validateCartStock = () => {
    const invalidItems = cart.filter(item => item.quantity > item.stock);
    if (invalidItems.length > 0) {
      const itemNames = invalidItems.map(item => item.title).join(", ");
      toast({
        title: "Ошибка оформления заказа",
        description: `Недостаточно книг в наличии: ${itemNames}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  const onSubmit = (values: FormValues) => {
    if (cart.length === 0) {
      toast({
        title: "Ошибка",
        description: "Ваша корзина пуста",
        variant: "destructive",
      });
      return;
    }
    
    if (!isLoggedIn || !loggedInUserEmail) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для оформления заказа",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Validate stock quantities
    if (!validateCartStock()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Use the logged-in user's email and name for the order
    const userEmail = loggedInUserEmail;
    const userName = loggedInUserName || values.name;
    
    // Create order with the correct user information
    const newOrder = addOrder({
      items: cart,
      customer: {
        name: userName,
        phone: values.phone,
        email: userEmail
      },
      total: totalPrice,
      userEmail: userEmail
    });
    
    // Update book stock in localStorage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      try {
        const books = JSON.parse(storedBooks);
        const updatedBooks = books.map((book: any) => {
          const cartItem = cart.find(item => item.id === book.id);
          if (cartItem) {
            // Reduce the stock by the quantity ordered
            return { ...book, stock: Math.max(0, book.stock - cartItem.quantity) };
          }
          return book;
        });
        localStorage.setItem('books', JSON.stringify(updatedBooks));
      } catch (error) {
        console.error("Error updating book stock:", error);
      }
    }
    
    // Clear cart
    clearCart();
    
    // Show notification
    toast({
      title: "Заказ успешно оформлен",
      description: `Номер вашего заказа: ${newOrder.id}`,
    });
    
    // Redirect to profile page to see the order
    navigate('/profile?tab=orders', { replace: true });
    
    setIsSubmitting(false);
  };

  // Don't render the form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <p className="text-center text-red-500 mb-4">
          Пожалуйста, войдите в систему, чтобы оформить заказ
        </p>
        <Button onClick={() => navigate('/login')}>
          Войти
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-serif mb-4">Информация о покупателе</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (900) 123-45-67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <p className="text-sm text-brown-600 mb-2">
              Email: <span className="font-medium">{loggedInUserEmail}</span>
            </p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="agreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Я согласен с условиями обработки персональных данных
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !validateCartStock()}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Оформление заказа...
            </>
          ) : (
            "Оформить заказ"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
