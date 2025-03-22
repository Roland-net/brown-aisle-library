
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoaderCircle } from "lucide-react";
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { useOrders } from '@/context/OrderContext';

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z.string().min(10, { message: "Телефон должен содержать минимум 10 цифр" }),
  delivery: z.enum(["самовывоз", "доставка"]),
  address: z.string().optional(),
  paymentMethod: z.enum(["card", "cash"]),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "Вы должны согласиться с условиями" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      delivery: "самовывоз",
      address: "",
      paymentMethod: "card",
      agreement: false,
    },
  });
  
  const deliveryMethod = form.watch("delivery");

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
    
    // Simulate API call
    setTimeout(() => {
      // Создаем заказ
      const newOrder = addOrder({
        items: cart,
        customer: {
          name: values.name,
          phone: values.phone,
          email: values.email
        },
        total: totalPrice
      });
      
      // Очищаем корзину
      clearCart();
      
      // Показываем уведомление
      toast({
        title: "Заказ успешно оформлен",
        description: `Номер вашего заказа: ${newOrder.id}`,
      });
      
      // Редирект на главную
      navigate('/', { replace: true });
      
      setIsSubmitting(false);
    }, 1500);
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
        
        <div className="border-t border-brown-200 pt-6">
          <h3 className="text-xl font-serif mb-4">Способ получения</h3>
          
          <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="самовывоз" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Самовывоз из магазина
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="доставка" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Доставка курьером
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {deliveryMethod === "доставка" && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Адрес доставки</FormLabel>
                  <FormControl>
                    <Input placeholder="Город, улица, дом, квартира" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="border-t border-brown-200 pt-6">
          <h3 className="text-xl font-serif mb-4">Способ оплаты</h3>
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="card" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Банковской картой онлайн
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cash" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Наличными при получении
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
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
