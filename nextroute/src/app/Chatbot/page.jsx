"use client";
import { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ChatbotPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: "New Chat", timestamp: new Date().toISOString(), messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedback, setFeedback] = useState({});
  const messagesEndRef = useRef(null);
  const API_URL =
    process.env.NEXT_PUBLIC_CHATBOT_API || "http://localhost:5000/chatbot";

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load active chat messages
  useEffect(() => {
    const currentChat = chats.find((c) => c.id === activeChat);
    if (currentChat) {
      setMessages(currentChat.messages);
    }
  }, [activeChat, chats]);

  // Create new chat
  const createNewChat = () => {
    const newChatId = Math.max(...chats.map((c) => c.id), 0) + 1;
    const newChat = {
      id: newChatId,
      title: "New Chat",
      timestamp: new Date().toISOString(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChatId);
    setMessages([]);
  };

  // Update chat title based on first message
  const updateChatTitle = (chatId, firstMessage) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title:
                firstMessage.slice(0, 30) +
                (firstMessage.length > 30 ? "..." : ""),
            }
          : chat
      )
    );
  };

  // Delete chat
  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    if (chats.length === 1) {
      createNewChat();
    } else {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChat === chatId) {
        const remainingChats = chats.filter((c) => c.id !== chatId);
        if (remainingChats.length > 0) {
          setActiveChat(remainingChats[0].id);
        }
      }
    }
  };

  // Handle feedback
  const handleFeedback = (messageIndex, type) => {
    setFeedback((prev) => ({
      ...prev,
      [messageIndex]: type,
    }));
    console.log(`Feedback for message ${messageIndex}: ${type}`);
  };

  async function sendQuery(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const userText = query.trim();

    const newUserMessage = { role: "user", text: userText };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    if (messages.length === 0) {
      updateChatTitle(activeChat, userText);
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: updatedMessages, timestamp: new Date().toISOString() }
          : chat
      )
    );

    setQuery("");
    setLoading(true);

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, top_k: 5 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "server error");

      const newAssistantMessage = { role: "assistant", text: data.answer };
      const finalMessages = [...updatedMessages, newAssistantMessage];
      setMessages(finalMessages);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat ? { ...chat, messages: finalMessages } : chat
        )
      );
    } catch (err) {
      const errorMessage = { role: "assistant", text: "Error: " + err.message };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat ? { ...chat, messages: finalMessages } : chat
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 px-4 py-3 bg-[#1F2937] text-gray-300 rounded-2xl shadow-md max-w-max">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
      <span className="text-sm ml-2">Sarvabhashi is typing...</span>
    </div>
  );

  return (
    <div className={`${inter.className} flex h-screen bg-[#0D1117] text-[#E5E7EB]`}>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-[#161B22] flex flex-col overflow-hidden`}
      >
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeChat === chat.id
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-400"
                  : "hover:bg-[#1F2937] text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400">
                    {formatTimestamp(chat.timestamp)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#2D333B] rounded-lg transition-all"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-[#161B22] transition-all"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Sarvabhashi
          </h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Start a conversation ✨</p>
                <p className="text-sm">Ask me anything, I'm here to help.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`flex max-w-[75%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      }`}
                    >
                      {message.role === "user" ? "U" : "S"}
                    </div>
                    {/* Bubble */}
                    <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                            : "bg-[#1F2937] text-gray-200"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleFeedback(index, "like")}
                            className={`p-1.5 rounded-lg transition-all ${
                              feedback[index] === "like"
                                ? "bg-emerald-600/20 text-emerald-400"
                                : "hover:bg-[#2D333B] text-gray-400"
                            }`}
                          >
                            👍
                          </button>
                          <button
                            onClick={() => handleFeedback(index, "dislike")}
                            className={`p-1.5 rounded-lg transition-all ${
                              feedback[index] === "dislike"
                                ? "bg-red-600/20 text-red-400"
                                : "hover:bg-[#2D333B] text-gray-400"
                            }`}
                          >
                            👎
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 lg:px-8 py-4 bg-[#0D1117]">
          <form onSubmit={sendQuery} className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#161B22] rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
