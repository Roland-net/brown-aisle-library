
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart, BookType } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

interface CartButtonProps {
  book: BookType;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const CartButton = ({ book, size = 'md', showText = true }: CartButtonProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(book);
    setIsAdded(true);
    
    toast({
      title: "Добавлено в корзину",
      description: `${book.title} добавлена в вашу корзину`,
      duration: 3000,
    });
    
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };
  
  const sizeClasses = {
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };
  
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  };
  
  return (
    <button
      onClick={handleAddToCart}
      className={`
        flex items-center justify-center gap-2 font-medium rounded-md 
        transition-all duration-300 ease-out
        ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-brown-800 hover:bg-brown-900'} 
        text-white ${sizeClasses[size]}
      `}
    >
      {isAdded ? (
        <>
          <Check size={iconSize[size]} />
          {showText && <span>Добавлено</span>}
        </>
      ) : (
        <>
          <ShoppingCart size={iconSize[size]} />
          {showText && <span>В корзину</span>}
        </>
      )}
    </button>
  );
};

export default CartButton;
