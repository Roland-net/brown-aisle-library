
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
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z.string().min(10, { message: "Телефон должен содержать минимум 10 цифр" }),
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
  const navigate = useNavigate();

  // Load user data from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.email) {
          setLoggedInUserEmail(user.email);
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
    setIsSubmitting(true);
    
    // Get the user email for borrow tracking
    const userEmail = values.email || loggedInUserEmail;
    
    if (!userEmail) {
      toast({
        title: "Ошибка",
        description: "Email не указан",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
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
      customer: {
        name: values.name,
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
      userEmail: userEmail,
      customer: {
        name: values.name,
        email: userEmail,
        phone: values.phone
      }
    };
    
    userOrders.push(orderRecord);
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    
    console.log("New borrow record created:", borrowRecord);
    console.log("Added to user orders as:", orderRecord);
    
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
    
    // Navigate to profile with orders tab selected
    navigate('/profile?tab=orders');
    
    if (onComplete) {
      onComplete();
    }
  };

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
              <FormItem>
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
          disabled={isSubmitting}
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
