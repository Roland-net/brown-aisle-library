
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

const formSchema = z.object({
  to: z.string().email("Введите корректный email адрес"),
  subject: z.string().min(1, "Введите тему сообщения"),
  message: z.string().min(1, "Введите текст сообщения")
});

type FormValues = z.infer<typeof formSchema>;

// Конфигурация SMTP
const SMTP_CONFIG = {
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  user: 'rolandmam@mail.ru',
  pass: 'eWTrFptCYkp67qf1KXPv'
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

  // Функция для отправки почты через API бэкенда
  const sendEmail = async (params: { to: string; subject: string; text: string }) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          from: SMTP_CONFIG.user,
          smtpConfig: {
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: SMTP_CONFIG.secure,
            auth: {
              user: SMTP_CONFIG.user,
              pass: SMTP_CONFIG.pass
            }
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка отправки письма');
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка отправки:', error);
      throw error;
    }
  };

  const testSmtpConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      // Отправляем тестовое письмо через наш API
      await sendEmail({
        to: SMTP_CONFIG.user,
        subject: 'Проверка соединения SMTP',
        text: 'Это тестовое сообщение для проверки настроек SMTP. Если вы получили это письмо, значит настройки работают корректно.'
      });
      
      toast({
        title: "Соединение успешно",
        description: `Тестовое письмо отправлено на ${SMTP_CONFIG.user}. Проверьте входящие сообщения.`,
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
      // Отправляем письмо через наш API
      await sendEmail({
        to: data.to,
        subject: data.subject,
        text: data.message
      });
      
      toast({
        title: "Сообщение отправлено",
        description: `Письмо успешно отправлено на адрес ${data.to}`,
      });
      
      // Сбрасываем форму, но сохраняем поле "to"
      form.reset({ 
        to: data.to,
        subject: "", 
        message: "" 
      });
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Проверьте настройки SMTP и попробуйте снова.",
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
          <strong>Важно:</strong> Для корректной работы отправки писем необходимо настроить API 
          на сервере, который будет обрабатывать запросы `/api/send-email`. 
          В текущей реализации предполагается, что такой API существует и принимает указанные параметры.
        </p>
        <p className="text-amber-800 text-sm mt-2">
          <strong>Учетные данные:</strong> SMTP-сервер: {SMTP_CONFIG.host}, порт: {SMTP_CONFIG.port}, 
          адрес: {SMTP_CONFIG.user}, настройки шифрования: SSL
        </p>
      </div>
    </div>
  );
};

export default EmailSender;
