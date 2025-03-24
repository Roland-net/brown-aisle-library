
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
  email: z.string().email({ message: "Введите корректный email" }),
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
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Load user data from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.email) {
          setLoggedInUserEmail(user.email);
          setLoggedInUserName(user.name || '');
          // Pre-fill form with user data if logged in
          form.setValue('name', user.name || '');
          form.setValue('email', user.email || '');
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      agreement: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    if (cart.length === 0) {
      toast({
        title: "Ошибка",
        description: "Ваша корзина пуста",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Use the logged-in user's email and name for the order
    // This ensures admin orders are associated with the admin account
    const userEmail = loggedInUserEmail || values.email;
    const userName = loggedInUserName || values.name;
    
    if (!userEmail) {
      toast({
        title: "Ошибка",
        description: "Email не указан",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create order with the correct user information
    const newOrder = addOrder({
      items: cart,
      customer: {
        name: userName,
        phone: values.phone,
        email: userEmail
      },
      total: totalPrice,
      userEmail: userEmail // Add userEmail to the order for filtering
    });
    
    console.log("New order created with user email:", userEmail);
    
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
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@mail.ru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          disabled={isSubmitting}
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
