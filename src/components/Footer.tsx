
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brown-900 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">VOLTRIX</h3>
            <p className="text-cream-200/80 text-sm max-w-xs">
              Ваша библиотека для чтения, обучения и развития. Рады приветствовать Вас в мире знаний и открытий.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-serif mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cream-200/80 hover:text-cream-100 text-sm transition-colors duration-200">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream-200/80 hover:text-cream-100 text-sm transition-colors duration-200">
                  О библиотеке
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-cream-200/80 hover:text-cream-100 text-sm transition-colors duration-200">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-cream-200/80 hover:text-cream-100 text-sm transition-colors duration-200">
                  Вход
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-serif mb-4">Контакты</h3>
            <address className="text-cream-200/80 text-sm not-italic">
              <p>улица Библиотечная, 123</p>
              <p>Москва, Россия</p>
              <p className="mt-3">Email: info@voltrix.ru</p>
              <p>Телефон: +7 (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-brown-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream-200/60 text-sm">
            © {currentYear} VOLTRIX. Все права защищены.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-cream-200/60 hover:text-cream-100 transition-colors duration-200">
              Условия использования
            </a>
            <a href="#" className="text-cream-200/60 hover:text-cream-100 transition-colors duration-200">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
