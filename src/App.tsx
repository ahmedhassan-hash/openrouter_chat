import { ChatCard } from "@/components/ChatCard";
import { Header } from "@/components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scrapeUrl, streamChat } from "@/lib/api";
import type { Message, Source, TokenUsage, ToolCall } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [mode, setMode] = useState<"simple" | "rag">("simple");
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showScrapeDialog, setShowScrapeDialog] = useState(false);

  useEffect(() => {
    if (mode === "rag" && !scrapedUrl && messages.length === 0) {
      setShowScrapeDialog(true);
    }
  }, [mode, scrapedUrl, messages.length]);

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) return;

    setIsScraping(true);
    setError(null);
    try {
      const result = await scrapeUrl(urlInput.trim());
      setScrapedUrl(result.metadata.url);
      setScrapedMetadata({
        totalChunks: result.metadata.totalChunks,
        scrapedAt: result.metadata.scrapedAt,
      });
      setMessages([]);

      const successMessage: Message = {
        role: "assistant",
        content: `Successfully scraped ${result.metadata.url}! Found ${result.metadata.totalChunks} chunks of content. You can now ask me questions about it using RAG mode.`,
      };
      setMessages([successMessage]);
      toast.success("Website scraped successfully!");

      setMode("rag");
      setShowScrapeDialog(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setError(`Failed to scrape URL: ${errorMsg}`);
      toast.error(`Scraping failed: ${errorMsg}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleClearContext = () => {
    setScrapedUrl(null);
    setScrapedMetadata(null);
    setMessages([]);
    setUrlInput("");
    setError(null);
    setMode("simple");
    setShowScrapeDialog(false);
    toast.info("Context cleared");
  };

  const handleSendMessage = async (content: string) => {
    if (mode === "rag" && !scrapedUrl) {
      setError(
        "Please scrape a URL first before using RAG mode, or switch to Simple mode."
      );
      toast.error("RAG mode requires scraped content");
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStatus("");
    setToolCalls([]);

    try {
      let assistantMessage = "";
      let sources: Source[] = [];
      const currentToolCalls: ToolCall[] = [];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", isStreaming: true },
      ]);

      for await (const event of streamChat({
        message: content,
        mode,
        enableWebSearch,
      })) {
        switch (event.type) {
          case "status":
          case "searching_rag":
          case "found_documents":
            setStatus(event.content || "");
            break;

          case "tool_call":
            setStatus(event.content || "");
            if (event.data?.tool && event.data?.query) {
              currentToolCalls.push({
                tool: event.data.tool,
                query: event.data.query,
              });
              setToolCalls([...currentToolCalls]);
            }
            break;

          case "token":
            assistantMessage += event.content || "";
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.role === "assistant") {
                lastMessage.content = assistantMessage;
                lastMessage.isStreaming = true;
              }
              return newMessages;
            });
            break;

          case "complete":
            sources = event.data?.sources || [];
            const finalUsage = event.data?.usage;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.role === "assistant") {
                lastMessage.sources = sources;
                lastMessage.isStreaming = false;
                if (finalUsage) {
                  lastMessage.usage = finalUsage;
                }
              }
              return newMessages;
            });

            setStatus("");
            break;

          case "error":
            throw new Error(event.content || "Unknown error");
        }
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to get response";
      setError(errorMsg);
      toast.error(errorMsg);

      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        return [
          ...newMessages,
          {
            role: "assistant",
            content: `Error: ${errorMsg}`,
          },
        ];
      });
    } finally {
      setIsLoading(false);
      setStatus("");
      setToolCalls([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-2 sm:p-4 h-screen flex flex-col gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <Header
              mode={mode}
              enableWebSearch={enableWebSearch}
              scrapedUrl={scrapedUrl}
              urlInput={urlInput}
              isScraping={isScraping}
              showScrapeDialog={showScrapeDialog}
              scrapedMetadata={scrapedMetadata}
              onModeChange={setMode}
              onWebSearchChange={setEnableWebSearch}
              onUrlInputChange={setUrlInput}
              onScrape={handleScrapeUrl}
              onClearContext={handleClearContext}
              onScrapeDialogChange={setShowScrapeDialog}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <ChatCard
          messages={messages}
          isLoading={isLoading}
          status={status}
          toolCalls={toolCalls}
          mode={mode}
          scrapedUrl={scrapedUrl}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
