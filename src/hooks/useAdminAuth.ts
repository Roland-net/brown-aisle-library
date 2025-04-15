import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { booksData } from '@/utils/booksData';
import { BookType } from '@/context/CartContext';

interface User {
  name: string;
  email: string;
}

interface UseAdminAuthResult {
  user: User | null;
  books: BookType[];
  setBooks: React.Dispatch<React.SetStateAction<BookType[]>>;
  loading: boolean;
  isAdmin: boolean;
  isSupplier: boolean;
}

export const useAdminAuth = (): UseAdminAuthResult => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      setIsAdmin(parsedUser.email === 'roladn.ttt@mail.ru');
      setIsSupplier(parsedUser.email === 'avdalyan.roland@mail.ru');
      
      if (parsedUser.email !== 'roladn.ttt@mail.ru' && parsedUser.email !== 'avdalyan.roland@mail.ru') {
        toast({
          title: 'Доступ запрещен',
          description: 'У вас нет прав для доступа к этой странице',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
    } else {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(booksData);
      localStorage.setItem('books', JSON.stringify(booksData));
    }
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (books.length > 0 && !loading) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, loading]);

  return { user, books, setBooks, loading, isAdmin, isSupplier };
};
