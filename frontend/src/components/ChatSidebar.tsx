import { Plus, MessageSquare, Upload, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  onNewChat: () => void;
  chatHistory?: ChatHistory[];
  currentChatId?: string;
  onSelectChat?: (id: string) => void;
}

const ChatSidebar = ({ onNewChat, chatHistory = [], currentChatId, onSelectChat }: ChatSidebarProps) => {
  const defaultHistory: ChatHistory[] = chatHistory.length > 0 ? chatHistory : [
    { id: "1", title: "Check my attendance", timestamp: "Today" },
    { id: "2", title: "Fee payment inquiry", timestamp: "Yesterday" },
    { id: "3", title: "Certificate application", timestamp: "2 days ago" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Quick Tools */}
      <div className="p-4 space-y-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Quick Actions
        </h3>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 pb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            Recent Chats
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {defaultHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat?.(chat.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg transition-colors group",
                  currentChatId === chat.id
                    ? "bg-accent/10 text-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default ChatSidebar;