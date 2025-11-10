import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ToolCall } from "@/types";

interface StatusIndicatorProps {
  toolCalls?: ToolCall[];
}

export function StatusIndicator({ toolCalls }: StatusIndicatorProps) {
  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {toolCalls.map((call, idx) => (
        <Badge
          key={idx}
          variant="secondary"
          className="gap-1.5 text-xs animate-in fade-in slide-in-from-left-2"
        >
          <Globe className="h-3 w-3" />
          {call.query ? `Searched: ${call.query}` : "Web search"}
        </Badge>
      ))}
    </div>
  );
}
