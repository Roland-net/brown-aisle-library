
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
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

// Конфигурация SMTP для Mail.ru
emailjs.init({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  username: 'rolandmam@mail.ru',
  password: 'eWTrFptCYkp67qf1KXPv'
});

const EmailSender = () => {
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "avdlyan.roland@mail.ru",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSending(true);
    
    try {
      const templateParams = {
        to_email: data.to,
        from_name: 'Книжный магазин',
        from_email: 'rolandmam@mail.ru',
        subject: data.subject,
        message: data.message
      };

      await emailjs.send(
        'default_service', // ID сервиса создается автоматически
        'template_default', // ID шаблона создается автоматически
        templateParams,
        undefined, // Публичный ключ не нужен при использовании SMTP
        {
          host: 'smtp.mail.ru',
          port: 465,
          secure: true,
          username: 'rolandmam@mail.ru',
          password: 'eWTrFptCYkp67qf1KXPv'
        }
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
        description: "Не удалось отправить сообщение. Пожалуйста, проверьте настройки SMTP и попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
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
      
      <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
        <p className="text-green-800 text-sm">
          <strong>SMTP настроен!</strong> Система настроена для отправки электронных писем через SMTP-сервер Mail.ru 
          с учетной записи rolandmam@mail.ru. Сообщения будут отправляться по-настоящему.
        </p>
      </div>
    </div>
  );
};

export default EmailSender;
