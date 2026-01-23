import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Users, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import QuickActionButtons from "@/components/QuickActionButtons";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickActions = [
  {
    label: "Student performance analysis",
    icon: BarChart3,
    action: "Show me overall student performance for this semester",
  },
  {
    label: "Attendance overview",
    icon: Users,
    action: "What is the average attendance in my classes?",
  },
  {
    label: "Recent feedback",
    icon: MessageSquare,
    action: "Show me recent student feedback for my courses",
  },
  {
    label: "Create announcement",
    icon: FileText,
    action: "Help me draft an announcement for my class",
  },
];

const FacultyChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        content: "I'm your Faculty Assistant. I can help you with student analytics, attendance tracking, feedback analysis, and administrative tasks. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleNewChat = () => setMessages([]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/faculty")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <h1 className="ml-6 text-xl font-semibold text-foreground">
          Faculty Assistant
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
                  <BarChart3 className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Faculty Assistant
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your AI-powered teaching companion for analytics, insights, and
                  workflow optimization.
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
            placeholder="Ask about students, analytics, or administrative tasks..."
          />
        </div>
      </div>
    </div>
  );
};

export default FacultyChatbot;
