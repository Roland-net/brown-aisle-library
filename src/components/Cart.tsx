
import { Minus, Plus, X, ShoppingBag, BookOpen } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import CheckoutForm from '@/components/CheckoutForm';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import BorrowForm from '@/components/BorrowForm';
import { toast } from '@/components/ui/use-toast';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Check if user is logged in - improved to handle changes
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user && user.email) {
            setIsLoggedIn(true);
            console.log("Cart detected user is logged in:", user.email);
            return;
          }
        }
        setIsLoggedIn(false);
        console.log("Cart detected user is NOT logged in");
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    
    // Check on mount
    checkLoginStatus();
    
    // Also check when storage or login state changes
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('userLoginStateChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLoginStateChanged', checkLoginStatus);
    };
  }, []);

  const handleBorrowBooks = () => {
    // Ensure cart has items
    if (cart.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте книгу в корзину, чтобы взять её почитать",
        variant: "destructive",
      });
      return;
    }

    // Check if user is logged in
    if (!isLoggedIn) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы взять книгу",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Get all available books from cart
    const availableBooks = cart.filter(item => item.stock > 0);
    
    if (availableBooks.length === 0) {
      toast({
        title: "Книги недоступны",
        description: "К сожалению, выбранных книг нет в наличии",
        variant: "destructive",
      });
      return;
    }
    
    // Set all available books as selected
    setSelectedBooks(availableBooks);
    setShowBorrowDialog(true);
  };

  const handleCheckout = () => {
    // Check if cart has items
    if (cart.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте книгу в корзину, чтобы оформить заказ",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is logged in first
    if (!isLoggedIn) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы оформить заказ",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Validate stock quantities for all items in cart
    const invalidItems = cart.filter(item => item.quantity > item.stock);
    if (invalidItems.length > 0) {
      toast({
        title: "Ошибка оформления заказа",
        description: `Недостаточно книг в наличии: ${invalidItems.map(item => item.title).join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    setShowCheckout(!showCheckout);
  };
  
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingBag size={64} className="text-brown-300 mb-4" />
        <h2 className="text-2xl font-serif mb-2">Ваша корзина пуста</h2>
        <p className="text-brown-600 mb-6">Добавьте товары из каталога</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-brown-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-serif mb-6">Корзина</h2>
        
        <div className="divide-y divide-brown-100">
          {cart.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4 flex items-center"
            >
              <div className="w-16 h-24 bg-brown-50 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-brown-600">{item.author}</p>
                <p className="text-brown-800 mt-1">{item.price.toLocaleString()} ₽</p>
                <p className="text-sm text-brown-600">
                  Осталось в наличии: {item.stock - item.quantity >= 0 ? item.stock - item.quantity : 0}
                  {item.quantity > item.stock && 
                    <span className="text-red-500 ml-2">
                      (Превышен лимит!)
                    </span>
                  }
                </p>
              </div>
              
              <div className="flex items-center ml-4">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-brown-100 hover:bg-brown-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                
                <span className={`w-10 text-center font-medium ${item.quantity > item.stock ? 'text-red-500' : ''}`}>{item.quantity}</span>
                
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-brown-100 hover:bg-brown-200 transition-colors"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="ml-4 flex-shrink-0 text-right">
                <p className="font-medium">{(item.price * item.quantity).toLocaleString()} ₽</p>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-4 p-2 text-brown-500 hover:text-brown-700 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-brown-200">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-lg">Итого:</span>
            <span className="font-serif font-semibold text-xl">{totalPrice.toLocaleString()} ₽</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={clearCart}
              variant="outline"
              className="flex-grow-0"
            >
              Очистить корзину
            </Button>
            
            <Button 
              onClick={handleBorrowBooks} 
              variant="secondary"
              className="flex items-center justify-center gap-2"
              disabled={cart.length === 0 || !cart.some(item => item.stock > 0)}
            >
              <BookOpen size={18} />
              Взять почитать
            </Button>
            
            <Button 
              onClick={handleCheckout} 
              variant="default"
              className="flex-grow"
              disabled={cart.some(item => item.quantity > item.stock)}
            >
              {showCheckout ? "Вернуться к корзине" : "Оформить заказ"}
            </Button>
          </div>
          
          {cart.some(item => item.quantity > item.stock) && (
            <p className="text-red-500 mt-2 text-sm">
              В корзине есть товары, количество которых превышает доступное количество. Пожалуйста, уменьшите количество.
            </p>
          )}
        </div>
      </div>
      
      {showCheckout && (
        <div className="border-t border-brown-200 p-6">
          <CheckoutForm />
        </div>
      )}
      
      {/* Borrow Dialog */}
      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Оформление книг на чтение</DialogTitle>
            <DialogDescription>
              Заполните необходимые данные для получения книг
            </DialogDescription>
          </DialogHeader>
          {selectedBooks.length > 0 && (
            <BorrowForm 
              books={selectedBooks} 
              onComplete={() => {
                setShowBorrowDialog(false);
                clearCart();
                navigate('/profile');
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
