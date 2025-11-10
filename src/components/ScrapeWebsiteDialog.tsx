import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Globe, Loader2, Trash2 } from "lucide-react";

interface ScrapeWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scrapedUrl: string | null;
  urlInput: string;
  onUrlInputChange: (value: string) => void;
  isScraping: boolean;
  onScrape: () => void;
  onClearContext: () => void;
  scrapedMetadata: {
    totalChunks: number;
    scrapedAt: string;
  } | null;
}

export function ScrapeWebsiteDialog({
  open,
  onOpenChange,
  scrapedUrl,
  urlInput,
  onUrlInputChange,
  isScraping,
  onScrape,
  onClearContext,
  scrapedMetadata,
}: ScrapeWebsiteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {scrapedUrl ? "Change Website" : "Scrape Website"}
          </span>
          <span className="sm:hidden">Scrape</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Scrape Website</DialogTitle>
          <DialogDescription>
            Enter a URL to scrape its content and enable RAG-based chat
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com/docs"
                value={urlInput}
                onChange={(e) => onUrlInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isScraping) {
                    onScrape();
                  }
                }}
                disabled={isScraping}
                className="pl-10"
              />
            </div>
            {scrapedUrl && scrapedMetadata && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="text-xs sm:text-sm">
                  <p className="font-medium text-foreground">Current:</p>
                  <p className="text-muted-foreground break-all">{scrapedUrl}</p>
                  <p className="text-muted-foreground mt-1">
                    {scrapedMetadata.totalChunks} chunks
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClearContext}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onScrape}
              disabled={isScraping || !urlInput.trim()}
              className="flex-1"
            >
              {isScraping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Scraping...
                </>
              ) : (
                "Scrape Website"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isScraping}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
