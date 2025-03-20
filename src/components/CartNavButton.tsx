
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartNavButton = () => {
  const { cart } = useCart();
  
  // Calculate total number of items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <Link to="/cart" className="relative p-2 text-brown-800 hover:text-brown-900 transition-colors">
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-brown-700 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartNavButton;
