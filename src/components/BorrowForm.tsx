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
import { CartItem } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  phone: z.string().min(10, { message: "Телефон должен содержать минимум 10 цифр" }),
  passportSeries: z.string().min(4, { message: "Серия паспорта должна содержать минимум 4 символа" }),
  passportNumber: z.string().min(6, { message: "Номер паспорта должен содержать минимум 6 символов" }),
  agreement: z.boolean().refine(val => val === true, {
    message: "Вы должны согласиться с условиями",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export interface BorrowFormProps {
  book: CartItem;
  onComplete?: () => void;
}

const BorrowForm = ({ book, onComplete }: BorrowFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      passportSeries: "",
      passportNumber: "",
      agreement: false,
    },
  });

  // Load user data from localStorage and verify login status
  useEffect(() => {
    const checkLoginStatus = () => {
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
            console.log("BorrowForm: User is logged in:", user.email);
          } else {
            setIsLoggedIn(false);
            console.log("BorrowForm: User data exists but no email");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        console.log("BorrowForm: No user data found");
      }
    };

    // Check on mount
    checkLoginStatus();
    
    // Also check when login state changes
    window.addEventListener('userLoginStateChanged', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('userLoginStateChanged', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [form]);

  // Redirect to login if not logged in
  useEffect(() => {
    // Delayed check to ensure state is updated
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        console.log("BorrowForm: Redirecting to login because user is not logged in");
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в систему, чтобы взять книгу",
          variant: "destructive",
        });
        navigate('/login');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  // Check if book is available in stock
  useEffect(() => {
    if (book && book.stock <= 0) {
      toast({
        title: "Книга недоступна",
        description: "К сожалению, данной книги нет в наличии",
        variant: "destructive",
      });
      if (onComplete) {
        onComplete();
      }
    }
  }, [book, onComplete]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    // Verify user is logged in again
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast({
        title: "Ошибка",
        description: "Требуется авторизация для оформления книги",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (!user || !user.email) {
        toast({
          title: "Ошибка",
          description: "Информация о пользователе повреждена. Пожалуйста, войдите заново.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      // Use the verified user information
      const userEmail = user.email;
      const userName = user.name || values.name;
      
      // Calculate return date (14 days from now)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
      
      // Create borrow record
      const borrowId = Date.now().toString();
      const borrowRecord = {
        id: borrowId,
        date: new Date().toISOString(),
        book: book,
        returnDate: returnDate.toISOString(),
        status: "Взято в чтение",
        userEmail: userEmail,
        passportData: {
          series: values.passportSeries,
          number: values.passportNumber
        },
        customer: {
          name: userName,
          email: userEmail,
          phone: values.phone
        }
      };
      
      // Save to userBorrows_[email]
      const userBorrowsKey = `userBorrows_${userEmail}`;
      const existingBorrows = localStorage.getItem(userBorrowsKey);
      
      let userBorrows = [];
      if (existingBorrows) {
        try {
          userBorrows = JSON.parse(existingBorrows);
        } catch (error) {
          console.error("Error parsing user borrows:", error);
        }
      }
      
      userBorrows.push(borrowRecord);
      localStorage.setItem(userBorrowsKey, JSON.stringify(userBorrows));
      
      // Also save to userOrders_[email] for unified history display
      const userOrdersKey = `userOrders_${userEmail}`;
      const existingOrders = localStorage.getItem(userOrdersKey);
      
      let userOrders = [];
      if (existingOrders) {
        try {
          userOrders = JSON.parse(existingOrders);
        } catch (error) {
          console.error("Error parsing user orders:", error);
        }
      }
      
      // Add as an order-like entry with isBorrow flag
      const orderRecord = {
        id: borrowId,
        date: new Date().toISOString(),
        items: [{ ...book, quantity: 1 }],
        total: 0,
        status: "Взято в чтение",
        isBorrow: true,
        returnDate: returnDate.toISOString(),
        passportData: {
          series: values.passportSeries,
          number: values.passportNumber
        },
        userEmail: userEmail,
        customer: {
          name: userName,
          email: userEmail,
          phone: values.phone
        }
      };
      
      userOrders.push(orderRecord);
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
      
      // Update book stock in localStorage
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        try {
          const books = JSON.parse(storedBooks);
          const updatedBooks = books.map((b: any) => {
            if (b.id === book.id) {
              return { ...b, stock: Math.max(0, b.stock - 1) };
            }
            return b;
          });
          localStorage.setItem('books', JSON.stringify(updatedBooks));
        } catch (error) {
          console.error("Error updating book stock:", error);
        }
      }
      
      toast({
        title: "Книга успешно оформлена",
        description: "Книга будет доступна в течение 14 дней",
      });
      
      setIsSubmitting(false);
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event('userLoginStateChanged'));
      
      // Navigate to profile with orders tab selected
      navigate('/profile?tab=orders');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error processing borrow submission:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при оформлении книги",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Don't render the form if not logged in or book not in stock
  if (!isLoggedIn || (book && book.stock <= 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <p className="text-center text-red-500 mb-4">
          {!isLoggedIn 
            ? "Пожалуйста, войдите в систему, чтобы взять книгу" 
            : "К сожалению, данной книги нет в наличии"}
        </p>
        <Button onClick={() => navigate(!isLoggedIn ? '/login' : '/')}>
          {!isLoggedIn ? "Войти" : "Вернуться в каталог"}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-24 bg-brown-50 rounded overflow-hidden flex-shrink-0">
            <img 
              src={book.image} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="font-medium">{book.title}</h3>
            <p className="text-sm text-brown-600">{book.author}</p>
            <p className="text-sm text-brown-600">В наличии: {book.stock}</p>
          </div>
        </div>
        
        <div className="space-y-4">
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
          
          {/* Display readonly email field */}
          <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input 
              value={loggedInUserEmail || ''} 
              readOnly 
              className="bg-brown-50 cursor-not-allowed"
            />
            <p className="text-xs text-brown-500">Email привязан к вашему аккаунту</p>
          </div>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="passportSeries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Серия паспорта</FormLabel>
                  <FormControl>
                    <Input placeholder="0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер паспорта</FormLabel>
                  <FormControl>
                    <Input placeholder="000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  Я согласен с условиями получения книги для чтения и обязуюсь вернуть ее в течение 14 дней
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || book.stock <= 0}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Оформление...
            </>
          ) : (
            "Взять почитать"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BorrowForm;
