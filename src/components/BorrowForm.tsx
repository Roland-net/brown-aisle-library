
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
  agreement: z.boolean().refine(val => val === true, {
    message: "Вы должны согласиться с условиями",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export interface BorrowFormProps {
  books: CartItem[];
  onComplete?: () => void;
}

const BorrowForm = ({ books, onComplete }: BorrowFormProps) => {
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

  // Check if at least one book is available in stock
  useEffect(() => {
    if (books.length > 0 && !books.some(book => book.stock > 0)) {
      toast({
        title: "Книги недоступны",
        description: "К сожалению, выбранных книг нет в наличии",
        variant: "destructive",
      });
      if (onComplete) {
        onComplete();
      }
    }
  }, [books, onComplete]);

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
      
      // Get all available books
      const availableBooks = books.filter(book => book.stock > 0);
      
      if (availableBooks.length === 0) {
        toast({
          title: "Книги недоступны",
          description: "К сожалению, выбранных книг нет в наличии",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create borrow records for each book
      const borrowRecords = [];
      const orderRecords = [];
      const borrowedBooksInfo = [];
      
      // Get stored books to update stock
      let storedBooks = [];
      try {
        const storedBooksData = localStorage.getItem('books');
        if (storedBooksData) {
          storedBooks = JSON.parse(storedBooksData);
        }
      } catch (error) {
        console.error("Error loading stored books:", error);
      }
      
      // Process each book
      for (const book of availableBooks) {
        // Create unique borrowId for each book
        const borrowId = `${Date.now()}-${book.id}`;
        
        // Create borrow record
        const borrowRecord = {
          id: borrowId,
          date: new Date().toISOString(),
          book: book,
          returnDate: returnDate.toISOString(),
          status: "Взято в чтение",
          userEmail: userEmail,
          customer: {
            name: userName,
            email: userEmail,
            phone: values.phone
          }
        };
        borrowRecords.push(borrowRecord);
        
        // Add as an order-like entry with isBorrow flag
        const orderRecord = {
          id: borrowId,
          date: new Date().toISOString(),
          items: [{ ...book, quantity: 1 }],
          total: 0,
          status: "Взято в чтение",
          isBorrow: true,
          returnDate: returnDate.toISOString(),
          userEmail: userEmail,
          customer: {
            name: userName,
            email: userEmail,
            phone: values.phone
          }
        };
        orderRecords.push(orderRecord);
        
        // Update book stock
        if (storedBooks.length > 0) {
          const bookIndex = storedBooks.findIndex((b: any) => b.id === book.id);
          if (bookIndex !== -1) {
            storedBooks[bookIndex].stock = Math.max(0, storedBooks[bookIndex].stock - 1);
          }
        }
        
        // Add book info for toast message
        borrowedBooksInfo.push(book.title);
      }
      
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
      
      userBorrows = [...userBorrows, ...borrowRecords];
      localStorage.setItem(userBorrowsKey, JSON.stringify(userBorrows));
      
      // Save to userOrders_[email] for unified history display
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
      
      userOrders = [...userOrders, ...orderRecords];
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
      
      // Update book stock in localStorage
      if (storedBooks.length > 0) {
        localStorage.setItem('books', JSON.stringify(storedBooks));
      }
      
      // Create toast message based on number of books
      const booksMessage = borrowedBooksInfo.length === 1 
        ? "Книга успешно оформлена" 
        : "Книги успешно оформлены";
      const detailMessage = borrowedBooksInfo.length === 1
        ? "Книга будет доступна в течение 14 дней"
        : `Оформлено книг: ${borrowedBooksInfo.length}. Срок чтения: 14 дней`;
      
      toast({
        title: booksMessage,
        description: detailMessage,
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

  // Don't render the form if not logged in or no books in stock
  if (!isLoggedIn || (books.length > 0 && !books.some(book => book.stock > 0))) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <p className="text-center text-red-500 mb-4">
          {!isLoggedIn 
            ? "Пожалуйста, войдите в систему, чтобы взять книгу" 
            : "К сожалению, выбранных книг нет в наличии"}
        </p>
        <Button onClick={() => navigate(!isLoggedIn ? '/login' : '/')}>
          {!isLoggedIn ? "Войти" : "Вернуться в каталог"}
        </Button>
      </div>
    );
  }

  // Filter books to show only those in stock
  const availableBooks = books.filter(book => book.stock > 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Display selected books */}
        <div className="space-y-4 mb-4">
          <h3 className="font-medium text-lg">Выбранные книги:</h3>
          <div className="max-h-60 overflow-y-auto pr-2">
            {availableBooks.map((book) => (
              <div key={book.id} className="flex items-center space-x-4 mb-4 p-2 border border-brown-100 rounded">
                <div className="w-12 h-16 bg-brown-50 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">{book.title}</h4>
                  <p className="text-xs text-brown-600">{book.author}</p>
                </div>
              </div>
            ))}
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
                  Я согласен с условиями получения книг для чтения и обязуюсь вернуть их в течение 14 дней
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || availableBooks.length === 0}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Оформление...
            </>
          ) : (
            `Взять ${availableBooks.length > 1 ? 'книги' : 'книгу'} почитать`
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BorrowForm;
