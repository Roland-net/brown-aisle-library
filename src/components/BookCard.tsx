
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookType } from '@/context/CartContext';
import CartButton from './CartButton';

interface BookCardProps {
  book: BookType;
}

const BookCard = ({ book }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full opacity-0 transition-all duration-300 ease-out"
             style={{
               transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
               opacity: isHovered ? 1 : 0,
             }}>
          <CartButton book={book} />
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-brown-100 text-brown-700 rounded-full">
            {book.genre}
          </span>
          <span className={`text-xs font-medium rounded-full px-2 py-1 ${
            book.stock > 5 ? 'bg-green-100 text-green-800' : 
            book.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {book.stock > 0 ? `В наличии: ${book.stock}` : 'Нет в наличии'}
          </span>
        </div>
        <h3 className="font-serif font-medium text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-brown-600 text-sm mb-2">{book.author}</p>
        <div className="mt-auto">
          <p className="font-medium text-brown-800">{book.price.toLocaleString()} ₽</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
