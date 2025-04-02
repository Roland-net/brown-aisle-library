import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MailCheck } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import emailjs from 'emailjs-com';

const formSchema = z.object({
  to: z.string().email("Введите корректный email адрес"),
  subject: z.string().min(1, "Введите тему сообщения"),
  message: z.string().min(1, "Введите текст сообщения")
});

type FormValues = z.infer<typeof formSchema>;

// EmailJS не имеет прямого метода init с конфигурацией SMTP
// Настройки SMTP должны передаваться в метод send
const SMTP_CONFIG = {
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  username: 'rolandmam@mail.ru',
  password: 'eWTrFptCYkp67qf1KXPv'
};

const EmailSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "avdlyan.roland@mail.ru",
      subject: "",
      message: ""
    }
  });

  const testSmtpConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      // Отправляем тестовое письмо на email владельца
      const testParams = {
        to_email: SMTP_CONFIG.username,
        from_name: 'Система проверки SMTP',
        from_email: SMTP_CONFIG.username,
        subject: 'Проверка соединения SMTP',
        message: 'Это тестовое сообщение для проверки настроек SMTP. Если вы получили это письмо, значит настройки работают корректно.'
      };
      
      // В EmailJS нужно использовать serviceID и templateID
      // Для SMTP соединения нужно использовать другой подход или другую библиотеку
      await emailjs.send(
        'service_8unjwrp', // Это должен быть ваш serviceID из EmailJS
        'template_zxeyfh9', // Это должен быть ваш templateID из EmailJS
        testParams,
        'oc0ViRaRxK79NwGO0' // Это должен быть ваш publicKey из EmailJS
      );
      
      toast({
        title: "Соединение успешно",
        description: `Тестовое письмо отправлено на ${SMTP_CONFIG.username}. Проверьте входящие сообщения.`,
      });
    } catch (error) {
      console.error("Error testing SMTP connection:", error);
      toast({
        title: "Ошибка соединения",
        description: "Не удалось установить соединение с SMTP сервером. Проверьте настройки и учетные данные.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSending(true);
    
    try {
      const templateParams = {
        to_email: data.to,
        from_name: 'Книжный магазин',
        from_email: SMTP_CONFIG.username,
        subject: data.subject,
        message: data.message
      };

      // В EmailJS нужно использовать serviceID и templateID
      await emailjs.send(
        'service_8unjwrp', // Это должен быть ваш serviceID из EmailJS
        'template_zxeyfh9', // Это должен быть ваш templateID из EmailJS
        templateParams,
        'oc0ViRaRxK79NwGO0' // Это должен быть ваш publicKey из EmailJS
      );
      
      toast({
        title: "Сообщение отправлено",
        description: `Письмо успешно отправлено на адрес ${data.to}`,
      });
      
      // Reset the form but keep the "to" field
      form.reset({ 
        to: data.to,
        subject: "", 
        message: "" 
      });
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Пожалуйста, проверьте настройки EmailJS и попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Форма отправки сообщений</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={testSmtpConnection}
          disabled={isTestingConnection}
        >
          {isTestingConnection ? (
            <>Проверка...</>
          ) : (
            <>
              <MailCheck className="mr-2 h-4 w-4" /> Проверить соединение
            </>
          )}
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Получатель</FormLabel>
                <FormControl>
                  <Input placeholder="Email получателя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тема</FormLabel>
                <FormControl>
                  <Input placeholder="Введите тему письма" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сообщение</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Введите текст сообщения" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <>Отправка...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Отправить
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-200">
        <p className="text-amber-800 text-sm">
          <strong>Информация о настройках:</strong> Система настроена для отправки электронных писем через EmailJS, 
          который используется в качестве сервиса отправки. Для корректной работы необходимо зарегистрироваться 
          на сайте emailjs.com, создать сервис и шаблон, и заменить временные ID в коде на реальные.
        </p>
        <p className="text-amber-800 text-sm mt-2">
          <strong>Учетные данные:</strong> SMTP-сервер: smtp.mail.ru, порт: 465, 
          адрес: {SMTP_CONFIG.username}, настройки шифрования: SSL
        </p>
      </div>
    </div>
  );
};

export default EmailSender;
