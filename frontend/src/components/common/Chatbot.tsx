import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import api from '../../services/api';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "What are your skills?",
    "Tell me about your projects.",
    "How can I contact you?",
    "What services do you offer?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question?: string) => {
    const userMessage = question || input;
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chatbot', { message: userMessage });
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-black shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-shadow"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={28} /></motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}><MessageSquare size={28} /></motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 w-[90vw] max-w-md h-[70vh] max-h-[600px] glass-dark rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-40"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-sm text-gray-400">Powered by Esron.io</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center shrink-0"><Bot size={18} /></div>}
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-black rounded-br-none' : 'glass bg-white/5 rounded-bl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                     <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center shrink-0"><Bot size={18} /></div>
                     <div className="p-4 glass bg-white/5 rounded-2xl rounded-bl-none flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                     </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Predefined Questions & Input */}
            <div className="p-6 border-t border-white/10">
              {messages.length === 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">Or ask me...</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedQuestions.map(q => (
                      <button 
                        key={q} 
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 glass text-xs rounded-full border border-white/10 hover:bg-white/10 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                />
                <button type="submit" className="px-5 bg-primary text-black rounded-xl font-bold disabled:opacity-50" disabled={isLoading || !input.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
