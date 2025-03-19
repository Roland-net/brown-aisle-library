
import { useState } from 'react';
import { BookType } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Save } from 'lucide-react';

interface BookStockTableProps {
  books: BookType[];
  setBooks: React.Dispatch<React.SetStateAction<BookType[]>>;
}

const BookStockTable = ({ books, setBooks }: BookStockTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleEdit = (id: number, currentStock: number) => {
    setEditingId(id);
    setEditValue(currentStock);
  };
  
  const handleSave = (id: number) => {
    if (editValue < 0) {
      toast({
        title: 'Ошибка',
        description: 'Количество книг не может быть отрицательным',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedBooks = books.map(book => 
      book.id === id ? { ...book, stock: editValue } : book
    );
    
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    toast({
      title: 'Успех',
      description: 'Количество книг успешно обновлено',
    });
    
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Автор</TableHead>
            <TableHead>Жанр</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>В наличии</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.price.toLocaleString()} ₽</TableCell>
              <TableCell>
                {editingId === book.id ? (
                  <Input
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                ) : (
                  <span className={`py-1 px-2 rounded-full text-xs ${
                    book.stock > 5 ? 'bg-green-100 text-green-800' : 
                    book.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {book.stock}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === book.id ? (
                  <Button size="sm" onClick={() => handleSave(book.id)}>
                    <Save size={16} className="mr-1" /> Сохранить
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(book.id, book.stock)}>
                    <Edit2 size={16} className="mr-1" /> Изменить
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookStockTable;
