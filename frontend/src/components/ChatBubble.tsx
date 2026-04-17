import { cn } from "@/lib/utils";
import { User, Bot, ThumbsUp, ThumbsDown, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBubbleProps {
  role: "user" | "assistant"|"admin";
  content: string;
  timestamp?: string;
}

const ChatBubble = ({ role, content, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className={cn("max-w-[85%] space-y-2", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "px-5 py-3.5 transition-all",
            isUser
              ? "rounded-2xl bg-gradient-primary text-primary-foreground shadow-sm"
              : "rounded-xl bg-gradient-card border border-border/50 text-foreground shadow-sm hover:shadow-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {!isUser && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
