
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { booksData } from '@/utils/booksData';

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface UserData {
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
  
  useEffect(() => {
    // При загрузке компонента проверяем наличие данных о книгах в localStorage
    // Если их нет, загружаем их
    if (!localStorage.getItem('books')) {
      console.log("Saving books data to localStorage");
      localStorage.setItem('books', JSON.stringify(booksData));
    }
    
    // Проверяем, вошел ли уже пользователь
    const userData = localStorage.getItem('user');
    if (userData) {
      navigate('/profile');
    }
  }, [navigate]);
  
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
      
      // Получаем зарегистрированных пользователей
      const usersString = localStorage.getItem('users');
      const users: UserData[] = usersString ? JSON.parse(usersString) : [];
      
      // Ищем пользователя по email
      const user = users.find(u => u.email === formData.email);
      
      if (!user) {
        toast({
          title: "Ошибка",
          description: "Пользователь с таким email не найден",
          variant: "destructive",
        });
        return;
      }
      
      // Проверяем пароль
      if (user.password !== formData.password) {
        toast({
          title: "Ошибка",
          description: "Неверный пароль",
          variant: "destructive",
        });
        return;
      }
      
      // Сохраняем данные пользователя в localStorage (без пароля)
      const userData = {
        name: user.name,
        email: user.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Dispatch a custom event to notify other components about the login state change
      window.dispatchEvent(new Event('userLoginStateChanged'));
      
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в свой аккаунт",
      });
      
      // Перенаправляем на профиль
      navigate('/profile');
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
      
      // Проверяем, что пользователь с таким email не существует
      const usersString = localStorage.getItem('users');
      let users: UserData[] = usersString ? JSON.parse(usersString) : [];
      
      if (users.some(user => user.email === formData.email)) {
        toast({
          title: "Ошибка",
          description: "Пользователь с таким email уже существует",
          variant: "destructive",
        });
        return;
      }
      
      // Добавляем нового пользователя в список
      const newUser: UserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Сохраняем данные пользователя для текущей сессии (без пароля)
      const userData = {
        name: formData.name,
        email: formData.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Dispatch a custom event to notify other components about the login state change
      window.dispatchEvent(new Event('userLoginStateChanged'));
      
      toast({
        title: "Регистрация завершена",
        description: "Ваш аккаунт был успешно создан",
      });
      
      // Перенаправляем на профиль
      navigate('/profile');
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
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
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
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
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
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
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
