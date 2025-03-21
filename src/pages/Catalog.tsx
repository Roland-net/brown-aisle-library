
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookType } from '@/context/CartContext';
import BookCard from '@/components/BookCard';
import GenreFilter from '@/components/GenreFilter';
import { Search, SlidersHorizontal } from 'lucide-react';
import { booksData } from '@/utils/booksData';

const Catalog = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<number[]>([]);
  
  // Load books data
  useEffect(() => {
    // Сначала проверяем localStorage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      try {
        const parsedBooks = JSON.parse(storedBooks);
        if (Array.isArray(parsedBooks) && parsedBooks.length > 0) {
          setBooks(parsedBooks);
          console.log('Loaded books from localStorage:', parsedBooks.length);
          return;
        }
      } catch (error) {
        console.error('Error parsing books from localStorage:', error);
      }
    }
    
    // Если в localStorage нет данных или они некорректны, используем данные из booksData
    console.log('Using default books data:', booksData.length);
    setBooks(booksData);
    localStorage.setItem('books', JSON.stringify(booksData));
  }, []);
  
  // Load borrowed books for current user
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    
    try {
      const parsedUser = JSON.parse(userData);
      const userEmail = parsedUser.email;
      
      // Get borrowed books from localStorage
      const userBorrows = localStorage.getItem(`userBorrows_${userEmail}`);
      if (userBorrows) {
        const parsedBorrows = JSON.parse(userBorrows);
        if (Array.isArray(parsedBorrows) && parsedBorrows.length > 0) {
          // Filter active borrows (not returned)
          const activeBorrows = parsedBorrows.filter((borrow: any) => 
            borrow.status === "Оформлено" || borrow.status === "Взято в чтение"
          );
          
          // Extract book IDs
          const borrowedBookIds = activeBorrows.map((borrow: any) => borrow.book.id);
          setBorrowedBooks(borrowedBookIds);
          console.log("Currently borrowed books:", borrowedBookIds);
        }
      }
    } catch (error) {
      console.error("Error loading borrowed books:", error);
    }
  }, []);
  
  // Extract unique genres
  const genres = Array.from(new Set(books.map(book => book.genre)));
  
  // Filter books based on selected genre and search term
  useEffect(() => {
    let result = books;
    
    if (selectedGenre) {
      result = result.filter(book => book.genre === selectedGenre);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      );
    }
    
    setFilteredBooks(result);
  }, [selectedGenre, searchTerm, books]);
  
  console.log('Current books state:', books.length);
  console.log('Filtered books:', filteredBooks.length);
  
  return (
    <div className="pt-16">
      <section className="relative bg-brown-800 text-cream-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Каталог книг</h1>
          <p className="text-cream-100/80 max-w-3xl">
            Исследуйте нашу коллекцию книг разных жанров. Книги доступны для покупки или чтения в библиотеке.
          </p>
        </div>
      </section>
      
      <section className="py-10 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-serif text-brown-800 mb-4 md:mb-0">Все книги</h2>
            
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <input
                  type="text"
                  placeholder="Поиск по названию или автору..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-brown-100 text-brown-700 rounded-md"
              >
                <SlidersHorizontal size={18} />
                Фильтры
              </button>
            </div>
          </div>
          
          <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
            />
          </div>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Книги не найдены</h3>
              <p className="text-brown-600">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  isBorrowed={borrowedBooks.includes(book.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;
