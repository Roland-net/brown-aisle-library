
import { useState } from 'react';
import BookStockTable from '@/components/admin/BookStockTable';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { SendIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const supplierOrderSchema = z.object({
  subject: z.string().min(1, 'Требуется указать тему'),
  bookList: z.string().min(1, 'Пожалуйста, укажите список книг для заказа'),
});

type SupplierOrderValues = z.infer<typeof supplierOrderSchema>;

const Admin = () => {
  const { books, setBooks, loading } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SupplierOrderValues>({
    resolver: zodResolver(supplierOrderSchema),
    defaultValues: {
      subject: 'Заказ книг для магазина',
      bookList: '',
    },
  });

  const onSubmit = async (values: SupplierOrderValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would connect to a backend API
      // Since we don't have a backend, we'll simulate sending an email
      console.log('Sending email to: rolandmam@mail.ru');
      console.log('Subject:', values.subject);
      console.log('Book list:', values.bookList);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Заказ отправлен",
        description: "Заказ успешно отправлен поставщику на почту rolandmam@mail.ru",
      });
      
      form.reset({
        subject: 'Заказ книг для магазина',
        bookList: '',
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ поставщику",
        variant: "destructive",
      });
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-screen">
        <p>Загрузка...</p>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-12 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-serif mb-8 text-brown-800">Администрирование</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
            <h2 className="text-xl font-medium mb-4 text-brown-700">Управление запасами книг</h2>
            <BookStockTable books={books} setBooks={setBooks} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-4 text-brown-700">Заказ книг у поставщика</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тема письма</FormLabel>
                      <FormControl>
                        <Input placeholder="Укажите тему письма" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bookList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Список книг</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Введите список книг для заказа (название, автор, количество)"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Отправка...' : 'Отправить заказ поставщику'}
                </Button>
                
                <div className="text-sm text-gray-500 mt-2">
                  Заказ будет отправлен на почту: <span className="font-medium">rolandmam@mail.ru</span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
