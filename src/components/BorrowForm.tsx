import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
    
    // Симуляция API вызова
    setTimeout(() => {
      // Сохраняем заимствованные книги в localStorage
      const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
      
      if (book && book.id) {
        const borrowedBook = {
          id: book.id,
          title: book.title,
          borrowDate: new Date().toISOString(),
          returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 дней
          customer: {
            name: values.name,
            email: values.email,
            phone: values.phone
          }
        };
        
        localStorage.setItem('borrowedBooks', JSON.stringify([...borrowedBooks, borrowedBook]));
      }
      
      toast({
        title: "Книга успешно оформлена",
        description: "Книга будет доступна в течение 14 дней",
      });
      
      setIsSubmitting(false);
      
      if (onComplete) {
        onComplete();
      }
    }, 1500);
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
