
import { motion } from 'framer-motion';
import Cart from '@/components/Cart';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CartPage = () => {
  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Link 
            to="/catalog" 
            className="inline-flex items-center text-brown-700 hover:text-brown-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Вернуться к каталогу
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Cart />
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
