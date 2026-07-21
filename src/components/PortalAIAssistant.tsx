import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Bot, 
  User as UserIcon, 
  Compass, 
  BookOpen, 
  Clock, 
  FileText,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PortalAIAssistantProps {
  currentUser: User | null;
}

const PRESET_PROMPTS = [
  {
    text: "Làm sao ôn thi đạt điểm GPA cao?",
    icon: BookOpen,
    category: "Học tập"
  },
  {
    text: "Cách đăng ký Khóa học của con?",
    icon: Compass,
    category: "Hướng dẫn"
  },
  {
    text: "Quy chế khen thưởng danh hiệu 'Học bạ vàng' là gì?",
    icon: FileText,
    category: "Chế độ"
  },
  {
    text: "Mẹo quản lý thời gian tự học hiệu quả?",
    icon: Clock,
    category: "Kỹ năng"
  }
];

export default function PortalAIAssistant({ currentUser }: PortalAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào **${currentUser?.name || "bạn"}**! 👋 Tôi là **Trợ lý Học thuật AI** của Trường THCS Hòa Phú.\n\nTôi ở đây để giúp bạn giải đáp các thắc mắc về:\n- 📖 Phương pháp ôn luyện và học tập thông minh.\n- 📋 Quy trình đăng ký lớp học trực tuyến, xem thời khóa biểu.\n- 🏆 Các tiêu chuẩn đạt danh hiệu vinh danh, học bạ số.\n- 💡 Các mẹo rèn luyện kỹ năng tự học bổ ích.\n\nHãy chọn một câu hỏi gợi ý bên dưới hoặc nhập nội dung bất kỳ để chúng ta cùng thảo luận nhé!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    // Prepare full conversation history for context (up to last 15 messages to avoid huge payloads)
    const chatHistory = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    })).slice(-15);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory,
          userRole: currentUser?.role || 'Khách',
          fullName: currentUser?.name || 'Khách ghé thăm',
          additionalContext: `Thông tin trường THCS Hòa Phú: 
- Địa chỉ: Xã Hòa Xá, Thành phố Hà Nội.
- Cổng thông tin điện tử & chuyển đổi số học đường thông minh.
- Vinh danh học sinh có kết quả học bạ xuất sắc (GPA 9.0 trở lên đạt danh hiệu Học bạ vàng).
- Có đầy đủ các phân hệ quản lý tài khoản, cơ cấu lớp học, bài tập về nhà, đề thi trực tuyến, và liên lạc gia đình.`
        })
      });

      if (!response.ok) {
        let serverErr = `Mã lỗi máy chủ: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            serverErr = `${errData.error}${errData.details ? ` (${errData.details})` : ''}`;
          }
        } catch (_) {}
        throw new Error(serverErr);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.text || "Rất tiếc, tôi chưa thể trả lời câu hỏi này lúc này.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("AI Error:", err);
      setErrorMsg(err.message || "Không thể kết nối với dịch vụ Trợ lý AI. Vui lòng kiểm tra lại kết nối mạng hoặc liên hệ quản trị viên.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện này không?")) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Đã dọn dẹp lịch sử trò chuyện thành công! ✨ Tôi có thể giúp gì thêm cho **${currentUser?.name || "bạn"}** vào lúc này?`,
          timestamp: new Date()
        }
      ]);
      setErrorMsg(null);
    }
  };

  // Helper to render markdown-like content (basic support for bold, bullets, newlines)
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let renderedLine = line;
      
      // Handle bold texts: **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(renderedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderedLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-indigo-950">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < renderedLine.length) {
        parts.push(renderedLine.substring(lastIndex));
      }

      const finalContent = parts.length > 0 ? parts : renderedLine;

      // Handle bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc my-1 text-slate-800 leading-relaxed">
            {typeof finalContent === 'string' ? finalContent.trim().substring(2) : finalContent}
          </li>
        );
      }
      
      return (
        <p key={idx} className="my-1.5 min-h-[1.2rem] text-slate-800 leading-relaxed">
          {finalContent}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden" id="portal-ai-assistant">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-brandBlue to-blue-900 px-6 py-4 flex items-center justify-between border-b border-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-white font-black text-base flex items-center gap-1.5 tracking-wide">
              TRỢ LÝ HỌC THUẬT AI <span className="bg-amber-400 text-indigo-950 font-black text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-normal">Thông Minh</span>
            </h2>
            <p className="text-[11px] text-indigo-100 font-medium">Hệ thống hỗ trợ hỏi đáp trực tuyến 24/7 của THCS Hòa Phú</p>
          </div>
        </div>
        
        <button 
          onClick={handleClearChat}
          title="Xóa cuộc hội thoại"
          className="p-2 text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Chat Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-amber-100 border-amber-200 text-amber-800' 
                : 'bg-indigo-100 border-indigo-200 text-indigo-800'
            }`}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`px-4.5 py-3 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-none font-medium'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                )}
              </div>
              
              <span className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1 justify-end">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4.5 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs shadow-sm max-w-[80%] mx-auto">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đã xảy ra sự cố</p>
              <p className="mt-0.5 text-rose-700">{errorMsg}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset / Suggestions panel */}
      {messages.length === 1 && (
        <div className="px-6 py-3 bg-indigo-50/40 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase text-indigo-950/75 tracking-wider">Gợi ý chủ đề nhanh:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRESET_PROMPTS.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center gap-2.5 text-left px-3.5 py-2.5 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 rounded-xl shadow-xs text-xs text-slate-700 font-medium transition-all duration-200 group"
                >
                  <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 truncate">
                    <span className="block text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">{prompt.category}</span>
                    <span className="block truncate text-slate-800">{prompt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Hỏi Trợ lý AI điều gì đó... (Ví dụ: "Học bạ vàng là gì?")`}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-slate-800 text-xs px-4.5 py-3 rounded-2xl outline-none transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-brandBlue to-indigo-900 text-white rounded-2xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-40 disabled:shadow-none transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
