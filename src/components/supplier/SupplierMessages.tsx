
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  date: string;
  subject: string;
  message: string;
  from: string;
}

export function SupplierMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem('supplierMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-brown-600">
        <Mail className="mx-auto h-12 w-12 text-brown-400 mb-4" />
        <p>У вас пока нет сообщений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <Alert key={index}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(msg.date).toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                От: {msg.from}
              </span>
            </div>
            <AlertDescription>
              {msg.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
}
