
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

// Получаем данные книг для администрирования
// В реальном проекте это должно быть получено с сервера
const getInitialBooks = (): BookType[] => {
  const booksFromCatalog = JSON.parse(localStorage.getItem('books') || '[]');
  
  // Если нет данных в localStorage, используем данные из Catalog.tsx
  if (booksFromCatalog.length === 0) {
    // Импортировать не можем напрямую, поэтому данные нужно будет сохранить при первом рендере Catalog.tsx
    return [];
  }
  
  return booksFromCatalog;
};

const Admin = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Проверяем, есть ли данные пользователя в localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Проверяем, является ли пользователь администратором
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
      // Если пользователь не авторизован, перенаправляем на страницу входа
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    // Загружаем данные книг из localStorage
    const storedBooks = getInitialBooks();
    if (storedBooks.length > 0) {
      setBooks(storedBooks);
    } else {
      // Если данных нет в localStorage, загружаем с Catalog при первом входе
      fetch('/api/books')
        .then(res => res.json())
        .catch(() => {
          // Если API недоступен, используем данные из компонента Catalog
          // В реальном проекте здесь будет запрос к API
          import('@/pages/Catalog')
            .then(module => {
              // @ts-ignore - обходим TypeScript, чтобы получить доступ к booksData
              const catalogBooks = module.default.booksData || [];
              setBooks(catalogBooks);
              localStorage.setItem('books', JSON.stringify(catalogBooks));
            })
            .catch(error => {
              console.error('Ошибка при импорте данных о книгах:', error);
              toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить данные о книгах',
                variant: 'destructive',
              });
            });
        });
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
    
    // В реальном проекте здесь будет API-запрос для обновления данных на сервере
    
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
