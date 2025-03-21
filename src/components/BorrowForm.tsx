
import { useState } from 'react';
import { BookType } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Library, Home } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Имя должно содержать минимум 3 символа",
  }),
  passportSeries: z.string().regex(/^\d{4}$/, {
    message: "Серия паспорта должна содержать 4 цифры",
  }),
  passportNumber: z.string().regex(/^\d{6}$/, {
    message: "Номер паспорта должен содержать 6 цифр",
  }),
  phone: z.string().min(10, {
    message: "Номер телефона должен содержать минимум 10 цифр",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  pickupType: z.enum(["library", "selfPickup"]),
  address: z.string().optional(),
  comment: z.string().optional(),
});

interface BorrowFormProps {
  book: BookType;
}

const BorrowForm = ({ book }: BorrowFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      passportSeries: "",
      passportNumber: "",
      phone: "",
      email: "",
      pickupType: "library",
      address: "",
      comment: "",
    },
  });

  const pickupType = form.watch("pickupType");
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему перед оформлением книги",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Parse user data
    const parsedUser = JSON.parse(userData);
    
    // Create borrow record
    const borrowRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      book: book,
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: "Оформлено",
      userEmail: parsedUser.email,
      userDetails: {
        fullName: data.fullName,
        passportSeries: data.passportSeries,
        passportNumber: data.passportNumber,
        phone: data.phone,
        email: data.email,
      },
      pickupDetails: {
        type: data.pickupType,
        address: data.address,
        comment: data.comment,
      }
    };
    
    // Store borrow record in localStorage
    const borrowsKey = `userBorrows_${parsedUser.email}`;
    const existingBorrows = localStorage.getItem(borrowsKey);
    let borrows = [];
    
    if (existingBorrows) {
      borrows = JSON.parse(existingBorrows);
    }
    
    borrows.push(borrowRecord);
    localStorage.setItem(borrowsKey, JSON.stringify(borrows));
    
    // Update stock count
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      const books = JSON.parse(storedBooks);
      
      const bookIndex = books.findIndex((b: any) => b.id === book.id);
      if (bookIndex !== -1) {
        books[bookIndex].stock -= 1;
      }
      
      localStorage.setItem('books', JSON.stringify(books));
    }
    
    // Show success message
    toast({
      title: "Книга оформлена",
      description: `Книга "${book.title}" успешно оформлена на чтение`,
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <div className="py-4">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
            <Check size={24} />
          </div>
          <h3 className="text-xl font-medium mb-2">Книга оформлена!</h3>
          <p className="text-gray-600 mb-4">
            Вы можете забрать книгу в течение 3 дней.
          </p>
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ФИО</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов Иван Иванович" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@mail.ru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passportSeries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Серия паспорта</FormLabel>
                    <FormControl>
                      <Input placeholder="0000" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер паспорта</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 border-t border-b py-4">
              <div className="flex items-center">
                <h3 className="font-medium">Способ получения книги</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="pickupType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col space-y-3">
                        <div
                          className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer ${
                            field.value === "library" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                          onClick={() => form.setValue("pickupType", "library")}
                        >
                          <Library size={20} className={field.value === "library" ? "text-blue-500" : "text-gray-500"} />
                          <div>
                            <p className="font-medium">В библиотеке</p>
                            <p className="text-xs text-gray-500">Прочитать в читальном зале</p>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pickupType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col space-y-3">
                        <div
                          className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer ${
                            field.value === "selfPickup" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                          onClick={() => form.setValue("pickupType", "selfPickup")}
                        >
                          <Home size={20} className={field.value === "selfPickup" ? "text-blue-500" : "text-gray-500"} />
                          <div>
                            <p className="font-medium">Самовывоз</p>
                            <p className="text-xs text-gray-500">Забрать и вернуть через 14 дней</p>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {pickupType === "selfPickup" && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес для возможной доставки</FormLabel>
                      <FormControl>
                        <Input placeholder="ул. Пушкина, д. 10, кв. 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Дополнительная информация" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="font-medium">{book.title}</h4>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Оформление..." : "Оформить книгу"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BorrowForm;
