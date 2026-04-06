import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  RefreshCw, 
  MessageSquare,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { ai } from '../lib/gemini';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AyurBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Namaste! I am AyurBot, your Ayurvedic wellness companion. How can I help you achieve balance today? You can ask me about symptoms, herbs, diet, or general Ayurvedic principles.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are AyurBot, a knowledgeable and compassionate Ayurvedic wellness assistant. 
          Your goal is to provide helpful information based on Ayurvedic principles (IKS). 
          Always include a disclaimer that you are an AI and not a doctor. 
          Use a warm, respectful tone. 
          Format your responses using Markdown for better readability. 
          If asked about symptoms, suggest natural remedies but emphasize consulting a professional for severe cases.
          Refer to Doshas (Vata, Pitta, Kapha) where appropriate.`,
        },
      });

      // We need to pass the history to the chat
      // However, the sendMessage API in the SDK usually handles history if we use the same chat instance.
      // For simplicity in this stateless-like component, we'll just send the current message.
      // In a real app, we'd maintain the chat instance.
      
      const response = await chat.sendMessage({ message: input });
      
      const botMessage: Message = {
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. Could you please rephrase?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in AyurBot:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I encountered an error while connecting to my knowledge base. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">AyurBot</h1>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={12} /> AI Wellness Assistant
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
          title="Clear Chat"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-emerald-100 text-emerald-600" : "bg-emerald-600 text-white"
              )}>
                {msg.role === 'user' ? <UserIcon size={20} /> : <Leaf size={20} />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-emerald-50 text-emerald-900 rounded-tr-none" 
                  : "bg-white border border-emerald-50 text-emerald-800 rounded-tl-none shadow-sm"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className="text-[10px] opacity-40 mt-2 block font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mr-auto max-w-[85%]">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Leaf size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-50 shadow-sm rounded-tl-none flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-emerald-50/50 border-t border-emerald-50">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AyurBot anything..."
              className="flex-1 bg-white border border-emerald-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all font-medium text-emerald-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-emerald-400 font-medium uppercase tracking-widest">
            AyurBot can make mistakes. Consult a practitioner for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AyurBot;
