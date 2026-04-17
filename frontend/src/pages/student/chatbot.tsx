import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import QuickActionButtons from "@/components/QuickActionButtons";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  role: "user" | "assistant"|"admin";
  content: string;
  timestamp: string;
}

const quickActions = [
  {
    label: "Check my attendance",
    icon: CheckCircle2,
    action: "What is my current attendance percentage?",
  },
  {
    label: "View today's schedule",
    icon: Calendar,
    action: "Show me my timetable for today",
  },
  {
    label: "Apply for certificate",
    icon: FileText,
    action: "I want to apply for a bonafide certificate",
  },
  {
    label: "Get help with fees",
    icon: HelpCircle,
    action: "Help me understand my fee structure",
  },
];

const StudentChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect( () => {
      const conversation = async ()=>{
        try{
          const conversations = await fetch("/api/conversations").then(res => res.json());
          const formattedConversations = conversations.map((conv:any)=>{
            return({
              id:conv._id,
              title:conv.title,
            })
          })
          setConversations(formattedConversations);
        }catch(error){
          console.error("Error fetching conversations:", error);
        }
      }
      conversation();
    }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
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
      const geminiResponse = await fetch(`/api/chat`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({message:content}),
      });
      const data = await geminiResponse.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply ?? "No reply from server",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
  
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSelectChat = async (id: string) => {
    setActiveConversationId(id);
    const messages = await fetch(`/api/conversations/${activeConversationId}`).then(res => res.json());

  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/student")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <h1 className="ml-6 text-xl font-semibold text-foreground">
          College Assistant
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar onNewChat={handleNewChat} chatHistory={conversations} onSelectChat={handleSelectChat}/>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="space-y-8 py-12 animate-fade-in">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                      <HelpCircle className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      Hi! I'm your College Assistant
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      I can help you with attendance, timetables, certificates, fees,
                      and answer any questions about campus life.
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

          {/* Input Area */}
          <ChatInput
            onSend={handleSend}
            placeholder="Ask anything."
          />
        </div>
      </div>
    </div>
  );
};

export default StudentChatbot;
