import { cn } from "@/lib/utils";
import { User, Bot, Loader2, Copy, Check, Activity } from "lucide-react";
import type { Message } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MarkdownContent } from "./MarkdownContent";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
  status?: string;
}

export function ChatMessage({ message, status }: Readonly<ChatMessageProps>) {
  const isUser = message.role === "user";
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const showStatus = !isUser && status;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Response copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy response");
    }
  };

  return (
    <div className="w-full group">
      <div
        className={cn(
          "flex gap-3 p-3 sm:p-4 rounded-lg transition-all",
          isUser
            ? "bg-primary/10 ml-auto max-w-[95%] sm:max-w-[85%] md:max-w-[80%]"
            : "bg-muted max-w-[95%] sm:max-w-[90%]"
        )}
      >
        <div
          className={cn(
            "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full",
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isUser ? (
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-medium leading-none">
              {isUser ? "You" : "Assistant"}
            </p>
            {!isUser && message.content && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>

          {showStatus && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground animate-in fade-in">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              <span>{status}</span>
            </div>
          )}

          {message.content && (
            <div className="text-sm text-foreground">
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              ) : (
                <MarkdownContent content={message.content} />
              )}
              {message.isStreaming && (
                <span className="inline-block w-1 h-4 ml-1 bg-foreground animate-pulse" />
              )}
            </div>
          )}

          {!isUser && message.usage && message.usage.total_tokens > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="text-xs font-mono">
                <Activity className="h-3 w-3 mr-1" />
                {message.usage.total_tokens.toLocaleString()} tokens
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                In: {message.usage.input_tokens.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                Out: {message.usage.output_tokens.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="mt-2 ml-0 sm:ml-11 max-w-[95%] sm:max-w-[90%]">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs sm:text-sm p-2 h-auto"
              >
                <span className="text-muted-foreground">
                  📚 Sources ({message.sources.length})
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              {message.sources.map((source, idx) => (
                <div
                  key={idx}
                  className="rounded-md bg-muted/50 p-2 sm:p-3 text-xs sm:text-sm border border-border"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-primary">
                      [{source.index}]
                    </span>
                    {source.metadata.source && (
                      <a
                        href={source.metadata.source as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="hidden sm:inline">View source</span>
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {source.content}
                  </p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
