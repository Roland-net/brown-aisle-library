
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import BookStockTable from '@/components/admin/BookStockTable';
import OrdersTable from '@/components/admin/OrdersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

const Admin = () => {
  const { books, setBooks, loading } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Инициализируем стартовую вкладку на основе URL параметра
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || "stock";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Синхронизируем параметры URL с активной вкладкой
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam !== activeTab) {
      navigate(`/admin?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, location.search, navigate]);
  
  // Email form handling
  const form = useForm({
    defaultValues: {
      to: "",
      subject: "",
      message: ""
    }
  });
  
  const handleEmailSubmit = (values: { to: string; subject: string; message: string }) => {
    // Simulate sending email
    console.log("Email data:", values);
    toast({
      title: "Сообщение отправлено",
      description: `Письмо для ${values.to} успешно отправлено!`,
    });
    form.reset();
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="stock">Управление запасами</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Сообщения
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stock" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-medium mb-4 text-brown-700">Управление запасами книг</h2>
              <BookStockTable books={books} setBooks={setBooks} />
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-medium mb-6 text-brown-700">Управление заказами</h2>
              <OrdersTable />
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-medium mb-6 text-brown-700">Отправка сообщений</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Кому:</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field} 
                            required
                            type="email"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тема:</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Тема сообщения" 
                            {...field}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сообщение:</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Введите текст сообщения..." 
                            className="min-h-[200px]" 
                            {...field}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="mt-4 bg-brown-700 hover:bg-brown-800"
                  >
                    <Mail className="mr-2 h-4 w-4" /> Отправить сообщение
                  </Button>
                </form>
              </Form>
              
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
