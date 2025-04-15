import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import BookStockTable from '@/components/admin/BookStockTable';
import OrdersTable from '@/components/admin/OrdersTable';
import { SupplierMessages } from '@/components/admin/SupplierMessages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const { books, setBooks, loading, isAdmin, isSupplier } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || (isSupplier ? "messages" : "stock");
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam !== activeTab) {
      navigate(`/admin?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, location.search, navigate]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Ошибка",
        description: "Сообщение не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    const messages = JSON.parse(localStorage.getItem('supplierMessages') || '[]');
    const newMsg = {
      date: new Date().toISOString(),
      message: newMessage.trim(),
      from: 'Администратор'
    };
    
    messages.push(newMsg);
    localStorage.setItem('supplierMessages', JSON.stringify(messages));
    
    setNewMessage('');
    toast({
      title: "Успешно",
      description: "Сообщение отправлено поставщику",
    });
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
        <h1 className="text-3xl font-serif mb-8 text-brown-800">
          {isSupplier ? "Сообщения от администратора" : "Администрирование"}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {isAdmin && (
              <>
                <TabsTrigger value="stock">Управление запасами</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Сообщения поставщику
                </TabsTrigger>
              </>
            )}
            {isSupplier && (
              <TabsTrigger value="messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                Входящие сообщения
              </TabsTrigger>
            )}
          </TabsList>
          
          {isAdmin && (
            <>
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
              
              <TabsContent value="messages" className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-brown-700">Сообщения поставщику</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Новое сообщение
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Отправить сообщение поставщику</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Введите сообщение..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button onClick={handleSendMessage}>Отправить</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <SupplierMessages />
                </div>
              </TabsContent>
            </>
          )}
          
          {isSupplier && (
            <TabsContent value="messages" className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
                <h2 className="text-xl font-medium mb-6 text-brown-700">Входящие сообщения</h2>
                <SupplierMessages />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
