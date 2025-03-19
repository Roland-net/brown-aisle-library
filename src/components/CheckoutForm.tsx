
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MapPin, Phone, CreditCard } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Имя должно содержать минимум 3 символа",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать минимум 5 символов",
  }),
  city: z.string().min(2, {
    message: "Укажите город",
  }),
  phone: z.string().min(10, {
    message: "Номер телефона должен содержать минимум 10 цифр",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
});

export type CheckoutFormData = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      phone: "",
      email: "",
    },
  });

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Get existing user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему перед оформлением заказа",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Parse user data and add order
    const parsedUser = JSON.parse(userData);
    
    // Create order object
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      totalPrice,
      status: "В обработке",
      shippingAddress: {
        fullName: data.fullName,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
      }
    };
    
    // Update user orders in localStorage
    const existingOrders = localStorage.getItem('userOrders_' + parsedUser.email);
    let orders = [];
    
    if (existingOrders) {
      orders = JSON.parse(existingOrders);
    }
    
    orders.push(order);
    localStorage.setItem('userOrders_' + parsedUser.email, JSON.stringify(orders));
    
    // Update stock count for each book
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      const books = JSON.parse(storedBooks);
      
      // Reduce stock count for each purchased book
      cart.forEach(item => {
        const bookIndex = books.findIndex((book: any) => book.id === item.id);
        if (bookIndex !== -1) {
          books[bookIndex].stock -= item.quantity;
        }
      });
      
      localStorage.setItem('books', JSON.stringify(books));
    }
    
    // Clear cart and show success message
    clearCart();
    
    toast({
      title: "Заказ оформлен",
      description: "Ваш заказ успешно оформлен и будет обработан в ближайшее время",
    });
    
    setIsSubmitting(false);
    navigate('/profile');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-serif mb-6">Оформление заказа</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов Иван Иванович" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@mail.ru" {...field} />
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
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>Телефон</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+7 (999) 123-45-67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город</FormLabel>
                  <FormControl>
                    <Input placeholder="Москва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>Адрес доставки</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Пушкина, д. 10, кв. 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-6 border-t border-brown-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Итого к оплате:</span>
              <span className="font-serif font-semibold text-xl">{totalPrice.toLocaleString()} ₽</span>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              {isSubmitting ? "Обработка..." : "Оформить заказ"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
