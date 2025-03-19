
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-16">
      {/* Hero section */}
      <section className="relative bg-brown-900 text-cream-50 py-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Library background" 
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6"
          >
            О библиотеке VOLTRIX
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-1 bg-cream-200 mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Мир книг и знаний, доступный каждому
          </motion.p>
        </div>
      </section>
      
      {/* History section */}
      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif text-brown-800 mb-6">История нашей библиотеки</h2>
              <div className="w-20 h-1 bg-brown-400 mb-8" />
              <p className="text-brown-700 mb-4">
                Библиотека VOLTRIX была основана в 1985 году группой энтузиастов и любителей литературы. Изначально она представляла собой небольшую коллекцию книг, расположенную в историческом здании в центре города.
              </p>
              <p className="text-brown-700 mb-4">
                С течением времени, благодаря поддержке местного сообщества и частных пожертвований, библиотека начала активно расширяться, пополняя свою коллекцию редкими изданиями и современной литературой.
              </p>
              <p className="text-brown-700">
                В 2010 году библиотека VOLTRIX переехала в новое современное здание, где сейчас располагаются обширные коллекции книг, мультимедийные залы, выставочные пространства и уютные читальные залы. Сегодня мы гордимся тем, что наша библиотека стала культурным центром города, объединяющим любителей литературы всех возрастов.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Library interior" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Founders section */}
      <section className="py-16 bg-brown-800 text-cream-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif mb-4">Основатели</h2>
            <div className="w-20 h-1 bg-cream-200 mx-auto" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-brown-700 rounded-lg p-6 text-center"
            >
              <h3 className="text-2xl font-serif mb-3">Авдалян Роланд</h3>
              <p className="text-cream-100/80">
                Основатель и директор библиотеки VOLTRIX. Посвятил свою жизнь расширению доступа к знаниям и литературе.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-brown-700 rounded-lg p-6 text-center"
            >
              <h3 className="text-2xl font-serif mb-3">Хвостов Тимофей</h3>
              <p className="text-cream-100/80">
                Соучредитель и главный библиотекарь. Эксперт в области редких изданий и исторической литературы.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mission section */}
      <section className="py-16 bg-brown-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-serif text-brown-800 mb-6"
            >
              Наша миссия
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-1 bg-brown-400 mx-auto mb-8"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-brown-700 mb-4 text-lg"
            >
              Миссия библиотеки VOLTRIX — сделать знания и литературу доступными для всех, создавая пространство для чтения, обучения и культурного обмена.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-brown-700"
            >
              Мы стремимся быть не просто хранилищем книг, но местом, где встречаются идеи, где каждый может найти вдохновение и знания. Наша цель — развивать любовь к чтению, поддерживать образование и способствовать культурному развитию нашего сообщества.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-4xl font-serif text-brown-800 mb-2">50,000+</h3>
              <p className="text-brown-600">Книг в коллекции</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-4xl font-serif text-brown-800 mb-2">15,000+</h3>
              <p className="text-brown-600">Постоянных читателей</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-4xl font-serif text-brown-800 mb-2">35+</h3>
              <p className="text-brown-600">Лет истории</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
