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
    image: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
    stock: 12
  },
  {
    id: 2,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    price: 720,
    genre: "Классическая литература",
    image: "https://s1.livelib.ru/boocover/1000530481/o/13c3/Mihail_Bulgakov__Master_i_Margarita.jpeg",
    stock: 8
  },
  {
    id: 3,
    title: "1984",
    author: "Джордж Оруэлл",
    price: 580,
    genre: "Антиутопия",
    image: "https://cdn.eksmo.ru/v2/ITD000000000925262/COVER/cover1.jpg",
    stock: 5
  },
  {
    id: 4,
    title: "Гарри Поттер и философский камень",
    author: "Дж. К. Роулинг",
    price: 850,
    genre: "Фэнтези",
    image: "https://cdn.eksmo.ru/v2/ITD000000000851711/COVER/cover1.jpg",
    stock: 15
  },
  {
    id: 5,
    title: "Преступление и наказание",
    author: "Федор Достоевский",
    price: 690,
    genre: "Классическая литература",
    image: "https://s1.livelib.ru/boocover/1000326153/o/1cde/Fedor_Dostoevskij__Prestuplenie_i_nakazanie.jpeg",
    stock: 7
  },
  {
    id: 6,
    title: "Война и мир",
    author: "Лев Толстой",
    price: 950,
    genre: "Классическая литература",
    image: "https://cdn.eksmo.ru/v2/ASE000000000838580/COVER/cover1.jpg",
    stock: 3
  },
  {
    id: 7,
    title: "Три товарища",
    author: "Эрих Мария Ремарк",
    price: 680,
    genre: "Современная проза",
    image: "https://s1.livelib.ru/boocover/1000509055/o/0db7/Erih_Mariya_Remark__Tri_tovarischa.jpeg",
    stock: 9
  },
  {
    id: 8,
    title: "Цветы для Элджернона",
    author: "Дэниел Киз",
    price: 590,
    genre: "Научная фантастика",
    image: "https://s1.livelib.ru/boocover/1000959521/o/b9dd/Deniel_Kiz__Tsvety_dlya_Eldzhernona.jpeg",
    stock: 11
  },
  {
    id: 9,
    title: "Мартин Иден",
    author: "Джек Лондон",
    price: 710,
    genre: "Современная проза",
    image: "https://s1.livelib.ru/boocover/1000522133/o/1c11/Dzhek_London__Martin_Iden.jpeg",
    stock: 6
  },
  {
    id: 10,
    title: "Шерлок Холмс",
    author: "Артур Конан Дойл",
    price: 760,
    genre: "Детектив",
    image: "https://cdn.eksmo.ru/v2/AST000000000166078/COVER/cover1.jpg",
    stock: 4
  },
  {
    id: 11,
    title: "Великий Гэтсби",
    author: "Фрэнсис Скотт Фицджеральд",
    price: 620,
    genre: "Классическая литература",
    image: "https://s1.livelib.ru/boocover/1002873147/o/d8bb/Frensis_Skott_Fitsdzherald__Velikij_Getsbi.jpeg",
    stock: 10
  },
  {
    id: 12,
    title: "Властелин колец",
    author: "Дж. Р. Р. Толкин",
    price: 880,
    genre: "Фэнтези",
    image: "https://s1.livelib.ru/boocover/1001539536/o/aaf9/Dzhon_R._R._Tolkin__Vlastelin_Kolets._Tryohknizhe.jpeg",
    stock: 2
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
