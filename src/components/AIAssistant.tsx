import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI Financial Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get data from the store to use as context
  const { invoices, inventory, bills, customers, accounts, orgProfile } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Build context
      const context = {
        orgProfile,
        summary: {
          totalInvoices: invoices.length,
          totalInventoryItems: inventory.length,
          totalCustomers: customers.length,
          totalBills: bills.length,
        },
        invoices: invoices.slice(0, 20), // Send a subset to avoid huge payloads
        inventory: inventory.slice(0, 20),
        customers: customers.slice(0, 20),
        bills: bills.slice(0, 20),
        accounts: accounts.slice(0, 20),
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all z-[100] flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-[100] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ height: '600px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm flex items-center gap-2">
                <span className="animate-pulse">Thinking</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1 shrink-0" />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-xl shrink-0 bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
