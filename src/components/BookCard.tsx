
import { Plus, Check } from 'lucide-react';
import { BookType, useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

interface BookCardProps {
  book: BookType;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addToCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const isInCart = cart.some(item => item.id === book.id);
  
  const handleAddToCart = () => {
    if (book.stock <= 0) {
      toast({
        title: "Нет в наличии",
        description: "К сожалению, эта книга закончилась",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    
    // Simulating a small delay for better UX
    setTimeout(() => {
      addToCart(book);
      
      toast({
        title: "Добавлено в корзину",
        description: `"${book.title}" добавлена в корзину`,
      });
      
      setIsAdding(false);
    }, 300);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-brown-200"
    >
      <div className="aspect-[2/3] bg-brown-50 relative overflow-hidden">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        
        {book.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600 text-white font-medium rounded-md">
              Нет в наличии
            </span>
          </div>
        )}
        
        {book.stock > 0 && book.stock <= 3 && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
              Осталось {book.stock} шт.
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-brown-100 rounded-full text-brown-700">
            {book.genre}
          </span>
        </div>
        
        <h3 className="font-medium mb-1 line-clamp-2 min-h-[48px]">
          {book.title}
        </h3>
        
        <p className="text-sm text-brown-600 mb-3">{book.author}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-serif font-semibold">{book.price.toLocaleString()} ₽</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || book.stock <= 0}
            className={`p-2 rounded-full transition-colors ${
              isInCart 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : (book.stock > 0 
                  ? 'bg-brown-100 text-brown-700 hover:bg-brown-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )
            }`}
          >
            {isInCart ? (
              <Check size={18} />
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-sm text-brown-600">
          {book.stock > 0 ? (
            <span>В наличии: {book.stock} шт.</span>
          ) : (
            <span className="text-red-500">Нет в наличии</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
