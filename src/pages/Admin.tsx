
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
  emailFrom: z.string().email('Требуется указать корректный email').optional(),
});

type SupplierOrderValues = z.infer<typeof supplierOrderSchema>;

const Admin = () => {
  const { books, setBooks, loading } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const form = useForm<SupplierOrderValues>({
    resolver: zodResolver(supplierOrderSchema),
    defaultValues: {
      subject: 'Заказ книг для магазина',
      bookList: '',
      emailFrom: '',
    },
  });

  const onSubmit = async (values: SupplierOrderValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Отправка сообщения на: rolandmam@mail.ru');
      console.log('Тема:', values.subject);
      console.log('Список книг:', values.bookList);
      
      // Check if webhook URL is provided
      if (!webhookUrl) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, введите URL для отправки сообщений",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Send email via webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS issues
        body: JSON.stringify({
          to: "rolandmam@mail.ru",
          subject: values.subject,
          message: values.bookList,
          from: values.emailFrom || "bookstore@example.com",
          timestamp: new Date().toISOString(),
        }),
      });
      
      toast({
        title: "Заказ отправлен",
        description: "Заказ успешно отправлен поставщику на почту rolandmam@mail.ru",
      });
      
      form.reset({
        subject: 'Заказ книг для магазина',
        bookList: '',
        emailFrom: values.emailFrom,
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
            
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">Настройка отправки сообщений</h3>
              <p className="text-sm text-amber-700 mb-2">
                Для настоящей отправки сообщений введите URL сервиса отправки сообщений:
              </p>
              <Input 
                placeholder="Введите URL сервиса для отправки сообщений (например, Zapier Webhook URL)" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-amber-600">
                Вы можете использовать сервисы интеграции, такие как Zapier или Make.com, 
                чтобы создать рабочий процесс отправки электронных писем.
              </p>
            </div>
            
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
                
                <FormField
                  control={form.control}
                  name="emailFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email отправителя (необязательно)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Введите email отправителя" 
                          type="email" 
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
                  disabled={isSubmitting || !webhookUrl}
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
