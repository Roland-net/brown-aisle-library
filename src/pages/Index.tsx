
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Book, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brown-900/95 to-brown-800/70" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-cream-50 mb-6">
              Добро пожаловать в VOLTRIX
            </h1>
            <p className="text-xl text-cream-100/80 mb-10 max-w-2xl">
              Исследуйте мир знаний и открытий в нашей библиотеке. Наша коллекция включает тысячи книг разных жанров для читателей всех возрастов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="btn-primary">
                Перейти в каталог
              </Link>
              <Link to="/about" className="bg-transparent border border-cream-100/30 text-cream-100 hover:bg-brown-700/50 py-2 px-6 rounded-md transition-all duration-200">
                О библиотеке
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-brown-800 mb-4"
            >
              Что мы предлагаем
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-1 bg-brown-400 mx-auto"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-brown-100 text-center"
            >
              <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-brown-700" size={28} />
              </div>
              <h3 className="text-xl font-serif text-brown-800 mb-3">О библиотеке</h3>
              <p className="text-brown-600 mb-6">
                Узнайте историю нашей библиотеки, нашу миссию и ценности, которые мы разделяем.
              </p>
              <Link to="/about" className="text-brown-700 font-medium hover:text-brown-900 transition-colors">
                Подробнее &rarr;
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-brown-100 text-center"
            >
              <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Book className="text-brown-700" size={28} />
              </div>
              <h3 className="text-xl font-serif text-brown-800 mb-3">Каталог книг</h3>
              <p className="text-brown-600 mb-6">
                Богатая коллекция книг разных жанров — от классики до современной литературы.
              </p>
              <Link to="/catalog" className="text-brown-700 font-medium hover:text-brown-900 transition-colors">
                Перейти в каталог &rarr;
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-brown-100 text-center"
            >
              <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="text-brown-700" size={28} />
              </div>
              <h3 className="text-xl font-serif text-brown-800 mb-3">Личный кабинет</h3>
              <p className="text-brown-600 mb-6">
                Войдите в свой аккаунт для доступа к персональным рекомендациям и истории заказов.
              </p>
              <Link to="/login" className="text-brown-700 font-medium hover:text-brown-900 transition-colors">
                Войти &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
