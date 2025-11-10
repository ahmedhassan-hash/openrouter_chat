import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message, ToolCall } from "@/types";
import { useEffect, useRef } from "react";

interface ChatCardProps {
  messages: Message[];
  isLoading: boolean;
  status: string;
  toolCalls: ToolCall[];
  mode: "simple" | "rag";
  scrapedUrl: string | null;
  onSendMessage: (content: string) => void;
}

export function ChatCard({
  messages,
  isLoading,
  status,
  toolCalls,
  mode,
  scrapedUrl,
  onSendMessage,
}: ChatCardProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
      <CardHeader className="pb-2 sm:pb-4 shrink-0">
        <CardTitle className="text-sm sm:text-base">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 sm:gap-4 overflow-hidden p-2 sm:p-6">
        <ScrollArea className="flex-1 pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-xs sm:text-sm">
                {mode === "rag" && !scrapedUrl
                  ? "Scrape a website above to start chatting with its content"
                  : "Send a message to start chatting"}
              </div>
            )}
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const showStatus =
                isLastMessage && message.role === "assistant" && isLoading;

              return (
                <ChatMessage
                  key={index}
                  message={message}
                  status={showStatus ? status : undefined}
                />
              );
            })}
            {toolCalls.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-0 sm:ml-11">
                <StatusIndicator toolCalls={toolCalls} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="shrink-0">
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading || (mode === "rag" && !scrapedUrl)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
