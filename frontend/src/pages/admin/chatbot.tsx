import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import QuickActionButtons from "@/components/QuickActionButtons";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  role: "user" | "assistant" ;
  content: string;
  timestamp: string;
}

const quickActions = [
  {
    label: "Campus-wide analytics",
    icon: BarChart3,
    action: "Show me overall campus performance metrics",
  },
  {
    label: "User management",
    icon: Users,
    action: "Help me manage user roles and permissions",
  },
  {
    label: "System configuration",
    icon: Settings,
    action: "I need to update system settings",
  },
  {
    label: "Generate reports",
    icon: Shield,
    action: "Generate a comprehensive administrative report",
  },
];



const AdminChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => setMessages([]);

  const handleSend = (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I'm your Admin Assistant. I can help you with system management, analytics, user administration, and operational insights. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <h1 className="ml-6 text-xl font-semibold text-foreground">
          Admin Assistant
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar onNewChat={handleNewChat} />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {messages.length === 0 ? (
            <div className="space-y-8 py-12">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Admin Assistant
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Comprehensive administrative support for campus operations,
                  analytics, and system management.
                </p>
              </div>

              <QuickActionButtons
                actions={quickActions}
                onSelect={handleSend}
              />
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatBubble key={index} {...message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
            </div>
          </div>
          <ChatInput
            onSend={handleSend}
            placeholder="Ask about operations, analytics, or system management..."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminChatbot;
