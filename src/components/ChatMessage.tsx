import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: Readonly<ChatMessageProps>) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-primary/10 ml-auto max-w-[80%]" : "bg-muted max-w-[80%]"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-sm font-medium leading-none">
          {isUser ? "You" : "Assistant"}
        </p>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
