
import { motion } from 'framer-motion';
import { Book, BookOpen, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-16">
      <section className="relative bg-brown-800 text-cream-50 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">О библиотеке</h1>
          <p className="text-cream-100/80 max-w-3xl">
            Узнайте больше о нашей библиотеке, её истории и команде создателей
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-serif text-brown-800 mb-4 flex items-center gap-2">
                <Book size={24} className="text-brown-700" />
                Наша миссия
              </h2>
              <p className="text-brown-700 mb-4">
                Наша библиотека стремится сделать чтение доступным для всех. Мы верим, что книги - это не просто источник знаний, 
                но и способ расширить кругозор, развить воображение и проникнуться новыми идеями.
              </p>
              <p className="text-brown-700">
                Мы постоянно расширяем нашу коллекцию, добавляя как классическую литературу, так и современные произведения 
                различных жанров, чтобы каждый читатель смог найти что-то по своему вкусу.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-serif text-brown-800 mb-4 flex items-center gap-2">
                <BookOpen size={24} className="text-brown-700" />
                История библиотеки
              </h2>
              <p className="text-brown-700 mb-4">
                Наша библиотека была основана в 2023 году с целью сделать художественную литературу более доступной 
                для широкой аудитории. Начав с небольшой коллекции, мы постепенно расширили наш каталог до сотен 
                произведений различных авторов и жанров.
              </p>
              <p className="text-brown-700">
                Сегодня мы продолжаем развиваться, внедряя современные технологии для улучшения пользовательского опыта 
                и обеспечивая удобный доступ к книгам как онлайн, так и офлайн.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-serif text-brown-800 mb-6 flex items-center gap-2">
                <Users size={24} className="text-brown-700" />
                Наша команда
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-brown-200">
                  <h3 className="font-medium text-lg mb-2">Авдалян Роланд</h3>
                  <p className="text-brown-600 mb-3">Основатель и руководитель</p>
                  <p className="text-brown-700">
                    Отвечает за стратегическое развитие библиотеки, курирует пополнение 
                    книжной коллекции и работает над расширением доступности книг для читателей.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-brown-200">
                  <h3 className="font-medium text-lg mb-2">Хвостов Тимофей</h3>
                  <p className="text-brown-600 mb-3">Технический директор</p>
                  <p className="text-brown-700">
                    Руководит разработкой и поддержкой технической инфраструктуры библиотеки, 
                    включая онлайн-каталог, систему учета книг и цифровые сервисы для читателей.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
