import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, RotateCcw, Briefcase, UserCheck } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (page: string) => void;
}

const QUICK_PROMPTS = [
  { label: 'Summarize core projects & metrics', prompt: 'Summarize Md. Monirul Islam’s key projects and measurable engineering results.' },
  { label: 'মনিরুলের প্রজেক্ট ও দক্ষতা', prompt: 'মোঃ মনিরুল ইসলামের প্রধান প্রজেক্ট, টেকনিক্যাল স্কিল এবং শিক্ষাগত যোগ্যতা সম্পর্কে সংক্ষেপে বলো।' },
  { label: 'Why hire Monirul for Full-Stack?', prompt: 'Why is Md. Monirul Islam a strong candidate for a Full-Stack or Backend Software Engineer role?' },
  { label: 'CP & Algorithms (200+ Solved)', prompt: 'Tell me about Monirul’s Competitive Programming background, Codeforces rating, and C++ expertise.' },
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onToggle, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Assalamu Alaikum & Hello! I am **Md. Monirul Islam's AI Portfolio Assistant**.\n\nAsk me anything in **English or বাংলা** about his Full-Stack architecture, C++ Competitive Programming (200+ solved), ICE degree at **PUST**, or paste a **Job Description** to check role alignment.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const data = await response.json();
      const replyText =
        data?.reply ||
        'Md. Monirul Islam is a Software Engineer and ICE undergraduate at PUST specializing in C++, React, Node.js, Express, MongoDB, and PostgreSQL. Reach him at contact@monirul.dev.cv.';

      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: 'model',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: 'Md. Monirul Islam is an undergraduate in Information and Communication Engineering (ICE) at PUST with 200+ CP problems solved (1350+ Codeforces rating) and full-stack proficiency in React, Node.js, Express, MongoDB, and PostgreSQL. Contact: contact@monirul.dev.cv.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Conversation reset. Ask me in **English or বাংলা** about Md. Monirul Islam's projects, skills, PUST ICE coursework, or paste a job description for an instant fit analysis!",
        timestamp: 'Just now',
      },
    ]);
  };

  const renderFormattedText = (raw: string) => {
    return raw.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'leading-relaxed'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="no-print">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open AI Portfolio Assistant"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xl transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Monirul AI</span>
        </button>
      )}

      {/* Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[82vh] flex flex-col rounded-2xl bg-white dark:bg-[#0e1525] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight text-white">
                  Monirul Islam · Portfolio Assistant
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Gemini AI · English & বাংলা Supported
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Reset Conversation"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onToggle}
                title="Close Assistant"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[380px] bg-slate-50/70 dark:bg-[#090d16]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {msg.role === 'user' ? <p>{msg.text}</p> : renderFormattedText(msg.text)}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-xl px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-mono">
                  Synthesizing response from CV & engineering specs...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starters */}
          <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(q.prompt)}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Helpful Action Bar */}
          {onNavigate && (
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#0e1525] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => {
                  onNavigate('cv');
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium"
              >
                <Briefcase className="w-3 h-3" /> Open Printable CV
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium"
              >
                <UserCheck className="w-3 h-3" /> Direct Contact Form
              </button>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white dark:bg-[#0e1525] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in English or বাংলা about Monirul..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
