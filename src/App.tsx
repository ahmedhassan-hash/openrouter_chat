import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, Trash2 } from "lucide-react";
import { scrapeUrl, chatWithContext } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [scrapedUrl, setScrapedUrl] = useState<string | null>(null);
  const [scrapedMetadata, setScrapedMetadata] = useState<{
    totalChunks: number;
    scrapedAt: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) return;

    setIsScraping(true);
    try {
      const result = await scrapeUrl(urlInput.trim());
      setScrapedUrl(result.metadata.url);
      setScrapedMetadata({
        totalChunks: result.metadata.totalChunks,
        scrapedAt: result.metadata.scrapedAt,
      });
      setMessages([]);

      // Add success message
      const successMessage: Message = {
        role: "assistant",
        content: `Successfully scraped ${result.metadata.url}! Found ${result.metadata.totalChunks} chunks of content. You can now ask me questions about it.`,
      };
      setMessages([successMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error scraping URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
      setMessages([errorMessage]);
    } finally {
      setIsScraping(false);
    }
  };

  const handleClearContext = () => {
    setScrapedUrl(null);
    setScrapedMetadata(null);
    setMessages([]);
    setUrlInput("");
  };

  const handleSendMessage = async (content: string) => {
    if (!scrapedUrl) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Please scrape a URL first before asking questions.",
      };
      setMessages([errorMessage]);
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatWithContext(content);

      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Failed to get response"
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col gap-4">
        {/* URL Input Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Website Scraper</CardTitle>
            <CardDescription>
              Paste a URL to scrape and chat with the content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/documentation"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isScraping) {
                      handleScrapeUrl();
                    }
                  }}
                  disabled={isScraping}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleScrapeUrl}
                disabled={isScraping || !urlInput.trim()}
              >
                {isScraping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Scraping...
                  </>
                ) : (
                  "Scrape"
                )}
              </Button>
              {scrapedUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearContext}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {scrapedUrl && scrapedMetadata && (
              <div className="mt-3 text-sm text-muted-foreground">
                ✓ Scraped: <span className="font-medium">{scrapedUrl}</span> (
                {scrapedMetadata.totalChunks} chunks)
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Chat with Website</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && !scrapedUrl && (
                  <div className="text-center text-muted-foreground py-8">
                    Scrape a website above to start chatting with its content
                  </div>
                )}
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading || !scrapedUrl}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
