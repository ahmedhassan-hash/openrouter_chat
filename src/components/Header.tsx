import { ScrapeWebsiteDialog } from "@/components/ScrapeWebsiteDialog";
import { SettingsSheet } from "@/components/SettingsSheet";
import { Badge } from "@/components/ui/badge";
import { Globe, Sparkles } from "lucide-react";

interface HeaderProps {
  mode: "simple" | "rag";
  enableWebSearch: boolean;
  scrapedUrl: string | null;
  urlInput: string;
  isScraping: boolean;
  showScrapeDialog: boolean;
  scrapedMetadata: {
    totalChunks: number;
    scrapedAt: string;
  } | null;
  messageCount: number;
  onModeChange: (mode: "simple" | "rag") => void;
  onWebSearchChange: (enabled: boolean) => void;
  onUrlInputChange: (value: string) => void;
  onScrape: () => void;
  onClearContext: () => void;
  onScrapeDialogChange: (open: boolean) => void;
  onClearChat: () => void;
}

export function Header({
  mode,
  enableWebSearch,
  scrapedUrl,
  urlInput,
  isScraping,
  showScrapeDialog,
  scrapedMetadata,
  messageCount,
  onModeChange,
  onWebSearchChange,
  onUrlInputChange,
  onScrape,
  onClearContext,
  onScrapeDialogChange,
  onClearChat,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold truncate flex items-center gap-2">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Sasta Gpt
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
          Multi-mode AI chat with RAG and web search
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:flex">
          {mode === "simple" ? "Simple Mode" : "RAG Mode"}
        </Badge>
        {enableWebSearch && (
          <Badge variant="secondary" className="hidden sm:flex gap-1">
            <Globe className="h-3 w-3" />
            Web Search
          </Badge>
        )}

        {mode === "rag" && (
          <ScrapeWebsiteDialog
            open={showScrapeDialog}
            onOpenChange={onScrapeDialogChange}
            scrapedUrl={scrapedUrl}
            urlInput={urlInput}
            onUrlInputChange={onUrlInputChange}
            isScraping={isScraping}
            onScrape={onScrape}
            onClearContext={onClearContext}
            scrapedMetadata={scrapedMetadata}
          />
        )}

        <SettingsSheet
          mode={mode}
          onModeChange={onModeChange}
          enableWebSearch={enableWebSearch}
          onWebSearchChange={onWebSearchChange}
          scrapedUrl={scrapedUrl}
          messageCount={messageCount}
          onClearChat={onClearChat}
        />
      </div>
    </div>
  );
}
