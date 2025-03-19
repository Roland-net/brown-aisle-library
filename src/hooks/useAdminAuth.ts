
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
}

export const useAdminAuth = (): UseAdminAuthResult => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
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

  return { user, books, setBooks, loading };
};
