import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Settings2, Trash2 } from "lucide-react";

interface SettingsSheetProps {
  mode: "simple" | "rag";
  onModeChange: (mode: "simple" | "rag") => void;
  enableWebSearch: boolean;
  onWebSearchChange: (enabled: boolean) => void;
  scrapedUrl: string | null;
  messageCount: number;
  onClearChat: () => void;
}

export function SettingsSheet({
  mode,
  onModeChange,
  enableWebSearch,
  onWebSearchChange,
  scrapedUrl,
  messageCount,
  onClearChat,
}: SettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
          <SheetDescription>
            Configure your chat mode and features
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Chat Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => onModeChange(v as "simple" | "rag")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Simple Mode</span>
                    <span className="text-xs text-muted-foreground">
                      General conversation
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="rag">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">RAG Mode</span>
                    <span className="text-xs text-muted-foreground">
                      Chat with scraped content
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {mode === "rag" && !scrapedUrl && (
              <p className="text-xs text-amber-600">
                ⚠️ Scrape a website first to use RAG mode
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Web Search</Label>
              <p className="text-xs text-muted-foreground">
                Enable AI to search the web
              </p>
            </div>
            <Switch
              checked={enableWebSearch}
              onCheckedChange={onWebSearchChange}
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={onClearChat}
              disabled={messageCount === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat History ({messageCount} messages)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will clear all messages and start a fresh conversation
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
