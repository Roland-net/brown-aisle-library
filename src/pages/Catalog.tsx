
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookType } from '@/context/CartContext';
import BookCard from '@/components/BookCard';
import GenreFilter from '@/components/GenreFilter';
import { Search, SlidersHorizontal } from 'lucide-react';

// Sample book data
const booksData: BookType[] = [
  {
    id: 1,
    title: "Гордость и предубеждение",
    author: "Джейн Остин",
    price: 650,
    genre: "Классическая литература",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    price: 720,
    genre: "Классическая литература",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "1984",
    author: "Джордж Оруэлл",
    price: 580,
    genre: "Антиутопия",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Гарри Поттер и философский камень",
    author: "Дж. К. Роулинг",
    price: 850,
    genre: "Фэнтези",
    image: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Преступление и наказание",
    author: "Федор Достоевский",
    price: 690,
    genre: "Классическая литература",
    image: "https://images.unsplash.com/photo-1551029506-0807df4e2031?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Война и мир",
    author: "Лев Толстой",
    price: 950,
    genre: "Классическая литература",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "Три товарища",
    author: "Эрих Мария Ремарк",
    price: 680,
    genre: "Современная проза",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Цветы для Элджернона",
    author: "Дэниел Киз",
    price: 590,
    genre: "Научная фантастика",
    image: "https://images.unsplash.com/photo-1511108690759-009324a90311?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    title: "Мартин Иден",
    author: "Джек Лондон",
    price: 710,
    genre: "Современная проза",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    title: "Шерлок Холмс",
    author: "Артур Конан Дойл",
    price: 760,
    genre: "Детектив",
    image: "https://images.unsplash.com/photo-1598618253208-d75408cee680?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    title: "Великий Гэтсби",
    author: "Фрэнсис Скотт Фицджеральд",
    price: 620,
    genre: "Классическая литература",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    title: "Властелин колец",
    author: "Дж. Р. Р. Толкин",
    price: 880,
    genre: "Фэнтези",
    image: "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Catalog = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>(booksData);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique genres
  const genres = Array.from(new Set(booksData.map(book => book.genre)));
  
  // Filter books based on selected genre and search term
  useEffect(() => {
    let result = booksData;
    
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
  }, [selectedGenre, searchTerm]);
  
  return (
    <div className="pt-16">
      <section className="relative bg-brown-800 text-cream-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Каталог книг</h1>
          <p className="text-cream-100/80 max-w-3xl">
            Исследуйте нашу коллекцию книг разных жанров. Воспользуйтесь фильтрами для поиска интересующих вас изданий.
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
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;
