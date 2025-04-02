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

const formSchema = z.object({
  to: z.string().email("Введите корректный email адрес"),
  subject: z.string().min(1, "Введите тему сообщения"),
  message: z.string().min(1, "Введите текст сообщения")
});

type FormValues = z.infer<typeof formSchema>;

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
      // This is a mock implementation since we don't have a real email service connected
      // In a real app, this would connect to your backend service
      console.log("Email data:", data);
      
      // Simulate email sending with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
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
      
      <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-200">
        <p className="text-amber-800 text-sm">
          <strong>Примечание:</strong> Для настройки реальной отправки писем 
          потребуется подключение к почтовому сервису через API. Для этого 
          понадобятся учетные данные почты rolandmam@mail.ru.
        </p>
      </div>
    </div>
  );
};

export default EmailSender;
