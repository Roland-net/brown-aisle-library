
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните все поля",
          variant: "destructive",
        });
        return;
      }
      
      // В реальном приложении здесь была бы проверка учетных данных
      // Для демонстрации просто сохраняем данные пользователя
      const userData = {
        name: formData.email.split('@')[0], // Используем часть email как имя
        email: formData.email
      };
      
      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в свой аккаунт",
      });
      
      // Перенаправляем на каталог и перезагружаем страницу
      navigate('/catalog');
      window.location.reload();
    } else {
      // Register logic
      if (!formData.name || !formData.email || !formData.password) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните все поля",
          variant: "destructive",
        });
        return;
      }
      
      // Сохраняем данные пользователя в localStorage
      const userData = {
        name: formData.name,
        email: formData.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Регистрация завершена",
        description: "Ваш аккаунт был успешно создан",
      });
      
      // Перенаправляем на каталог и перезагружаем страницу
      navigate('/catalog');
      window.location.reload();
    }
  };
  
  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg overflow-hidden shadow-md border border-brown-200"
          >
            <div className="p-8">
              <h2 className="text-2xl font-serif text-brown-800 mb-6 text-center">
                {isLogin ? "Вход в аккаунт" : "Регистрация"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">
                      Имя
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 border border-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        placeholder="Введите ваше имя"
                      />
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      placeholder="Введите ваш email"
                    />
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-brown-700 mb-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      placeholder="Введите ваш пароль"
                    />
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-brown-700 hover:bg-brown-800 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {isLogin ? "Войти" : "Зарегистрироваться"}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-brown-600 hover:text-brown-800 text-sm transition-colors"
                >
                  {isLogin 
                    ? "Нет аккаунта? Зарегистрироваться" 
                    : "Уже есть аккаунт? Войти"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
