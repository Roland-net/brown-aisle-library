
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import BookStockTable from '@/components/admin/BookStockTable';
import OrdersTable from '@/components/admin/OrdersTable';
import { SupplierMessages } from '@/components/supplier/SupplierMessages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {
  const { books, setBooks, loading, isAdmin, isSupplier } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || "stock";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam !== activeTab) {
      navigate(`/admin?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, location.search, navigate]);
  
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
          {isSupplier ? "Панель поставщика" : "Администрирование"}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {isAdmin && (
              <>
                <TabsTrigger value="stock">Управление запасами</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
              </>
            )}
            {isSupplier && (
              <TabsTrigger value="messages">Сообщения</TabsTrigger>
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
