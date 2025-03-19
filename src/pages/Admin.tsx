
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookType } from '@/context/CartContext';
import { Edit2, Save } from 'lucide-react';

// Import the book data directly from Catalog.tsx
// In a real project, this would come from an API
import { booksData } from '@/utils/booksData';

const Admin = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if user is admin
      if (parsedUser.email !== 'roladn.ttt@mail.ru') {
        toast({
          title: 'Доступ запрещен',
          description: 'У вас нет прав для доступа к этой странице',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
    } else {
      // If user is not authenticated, redirect to login
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    // Load books from localStorage or use default data
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      // If no data in localStorage, use the imported data
      setBooks(booksData);
      localStorage.setItem('books', JSON.stringify(booksData));
    }
    
    setLoading(false);
  }, [navigate]);
  
  const handleEdit = (id: number, currentStock: number) => {
    setEditingId(id);
    setEditValue(currentStock);
  };
  
  const handleSave = (id: number) => {
    if (editValue < 0) {
      toast({
        title: 'Ошибка',
        description: 'Количество книг не может быть отрицательным',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedBooks = books.map(book => 
      book.id === id ? { ...book, stock: editValue } : book
    );
    
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    toast({
      title: 'Успех',
      description: 'Количество книг успешно обновлено',
    });
    
    setEditingId(null);
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
        
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <h2 className="text-xl font-medium mb-4 text-brown-700">Управление запасами книг</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Жанр</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>В наличии</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map(book => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>{book.price.toLocaleString()} ₽</TableCell>
                    <TableCell>
                      {editingId === book.id ? (
                        <Input
                          type="number"
                          value={editValue}
                          onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      ) : (
                        <span className={`py-1 px-2 rounded-full text-xs ${
                          book.stock > 5 ? 'bg-green-100 text-green-800' : 
                          book.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {book.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === book.id ? (
                        <Button size="sm" onClick={() => handleSave(book.id)}>
                          <Save size={16} className="mr-1" /> Сохранить
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(book.id, book.stock)}>
                          <Edit2 size={16} className="mr-1" /> Изменить
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
