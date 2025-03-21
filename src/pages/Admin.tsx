
import { useAdminAuth } from '@/hooks/useAdminAuth';
import BookStockTable from '@/components/admin/BookStockTable';

const Admin = () => {
  const { books, setBooks, loading } = useAdminAuth();
  
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
        
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <h2 className="text-xl font-medium mb-4 text-brown-700">Управление запасами книг</h2>
          <BookStockTable books={books} setBooks={setBooks} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
