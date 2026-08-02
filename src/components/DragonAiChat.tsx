import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  ShoppingBag, 
  PackageCheck, 
  CreditCard,
  Zap,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, Service } from '../types';

export interface DragonAiChatProps {
  lang: 'ar' | 'en';
  onSelectService: (service: Service) => void;
  onNavigateTab: (tab: 'catalog' | 'track' | 'payment_info') => void;
  services: Service[];
}

export const DragonAiChat: React.FC<DragonAiChatProps> = ({
  lang,
  onSelectService,
  onNavigateTab,
  services,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: lang === 'ar' 
        ? `👋 أهلاً بك في DRAGON STORE 🐉.

سعداء بوجودك معنا في متجر الدراجون الرسمي.

نقدم أفضل الخدمات الرقمية بأعلى جودة، تسليم سريع، أسعار تنافسية ودعم فني مباشر.

اختر الخدمة التي تحتاجها وسأرشدك خطوة بخطوة من البداية حتى النهاية.

الأقسام المتاحة:
🛍 الاشتراكات الرقمية (Gemini, ChatGPT, Canva Pro)
📱 خدمات التواصل الاجتماعي (تيك توك، إنستجرام، تليجرام، يوتيوب)
🤖 خدمات الذكاء الاصطناعي البريميوم
🎮 شحن الألعاب والكروت (شدات ببجي، روبروكس، فري فاير)
📲 خدمات وبرامج الواتساب
📞 أرقام وهمية أمريكية وبريطانية
💳 طرق الدفع والتحويل المباشر (فودافون كاش، إنستا باي، بنكي، USDT)
🎁 العروض الحصرية وحسابات الـ VIP 👑

كيف يمكنني مساعدتك اليوم؟`
        : `👋 Welcome to DRAGON STORE 🐉.

We are thrilled to have you here.

We provide top-tier digital services with fast delivery, competitive prices and trusted support.

Choose the service you need and I'll guide you step-by-step from start to finish.

Available Categories:
🛍 Digital Subscriptions (Gemini, ChatGPT, Canva Pro)
📱 Social Media Growth (TikTok, IG, Telegram, YouTube)
🤖 AI Premium Services
🎮 Gaming & Topups (PUBG UC, Roblox)
📲 WhatsApp Marketing Tools
📞 Virtual Phone Numbers
💳 Instant Payments (Vodafone Cash, Instapay, CIB, USDT)
🎁 Exclusive VIP Perks & Offers 👑

How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: '🤖 اشتراكات الذكاء الاصطناعي', action: 'show_ai' },
        { label: '📱 زيادة متابعين وتفاعل', action: 'show_social' },
        { label: '📲 أرقام وهمية للواتساب', action: 'show_whatsapp' },
        { label: '🎮 شحن شدات وألعاب', action: 'show_gaming' },
        { label: '💳 طرق الدفع والتحويل', action: 'show_payment' },
        { label: '📦 تتبع طلب سابق', action: 'show_track' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'ar' ? 'حجم الصورة كبير جداً (الأقصى 5 ميجابايت)' : 'Image size exceeds 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() && !screenshot) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: screenshot ? [{ type: 'image', url: screenshot, name: 'receipt.png' }] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentScreenshot = screenshot;
    setScreenshot(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages,
          screenshot: currentScreenshot,
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (lang === 'ar' ? 'أهلاً بك في DRAGON STORE 🐉! كيف أستطيع خدمتك اليوم؟' : 'Welcome to DRAGON STORE 🐉! How may I assist you?'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: '🛒 تصفح جميع الخدمات', action: 'go_catalog' },
          { label: '📦 تتبع طلبك الآن', action: 'go_track' },
          { label: '💳 إرشادات التحويل والدفع', action: 'go_payment' },
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: lang === 'ar'
          ? `👋 يسعدنا خدمتك في DRAGON STORE 🐉!

يمكنك اختيار إحدى الخدمات التالية للبدء فوراً:
• 🤖 اشتراك Gemini Pro & ChatGPT Plus
• 📱 زيادة متابعين تيك توك وإنستجرام
• 📲 أرقام وهمية أمريكية لتفعيل الواتساب
• 🎮 شحن شدات ببجي وألعاب

اضغط على زر (متجر الخدمات) للطلب المباشر!`
          : `👋 Happy to assist you at DRAGON STORE 🐉! You can browse our store catalog directly to order any digital service!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string, label: string) => {
    if (action === 'go_catalog') {
      onNavigateTab('catalog');
      return;
    }
    if (action === 'go_track') {
      onNavigateTab('track');
      return;
    }
    if (action === 'go_payment') {
      onNavigateTab('payment_info');
      return;
    }
    if (action === 'show_ai') {
      sendMessage('أريد الاستفسار عن اشتراكات الذكاء الاصطناعي (Gemini Pro و ChatGPT Plus)');
      return;
    }
    if (action === 'show_social') {
      sendMessage('أريد أسعار خدمات زيادة المتابعين والتفاعل للتيك توك والإنستجرام');
      return;
    }
    if (action === 'show_whatsapp') {
      sendMessage('أريد رقم وهمي أمريكي لتفعيل الواتساب أو برامج التسويق');
      return;
    }
    if (action === 'show_gaming') {
      sendMessage('أريد أسعار شحن شدات ببجي وباقات الألعاب');
      return;
    }
    if (action === 'show_payment') {
      sendMessage('ما هي طرق الدفع المتاحة وتفاصيل تحويل فودافون كاش وإنستا باي؟');
      return;
    }
    if (action === 'show_track') {
      sendMessage('كيف أستطيع تتبع حالة طلبي في المتجر؟');
      return;
    }

    sendMessage(label);
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-4 sm:p-6 border border-emerald-800/50 shadow-xl mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-900/50">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0b0f19] animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide font-mono">
                DRAGON <span className="text-emerald-400">AI 🐉</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIAL BOT
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'ar' ? 'مساعدك الذكي لإكمال الطلبات، التحويلات والاستفسارات 24/7' : 'Smart sales & order support consultant available 24/7'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المتجر المباشر' : 'Store Catalog'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#0e1424] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-[580px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white border border-emerald-500/30'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-tr-none shadow-md shadow-teal-950/40'
                        : 'bg-[#151c2f] border border-slate-800 text-slate-100 rounded-tl-none shadow-lg shadow-black/30'
                    }`}
                  >
                    {/* Optional Attachment */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-3">
                        {msg.attachments.map((att, aIdx) => (
                          <div key={aIdx} className="relative rounded-lg overflow-hidden border border-emerald-500/40 max-w-xs">
                            <img src={att.url} alt="Attachment" className="max-h-48 w-full object-cover" />
                            <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/70 text-[10px] text-emerald-400 rounded">
                              {lang === 'ar' ? 'إيصال التحويل' : 'Payment Receipt'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Body Parsed */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-60 pt-1 border-t border-white/10">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyText(msg.text, idx)}
                          className="hover:opacity-100 flex items-center gap-1 transition"
                          title="Copy message"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedIndex === idx ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons attached to message */}
                  {msg.quickActions && msg.quickActions.length > 0 && !isUser && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleQuickAction(qa.action, qa.label)}
                          className="px-3 py-1.5 rounded-xl bg-[#1a233a] hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-700/80 text-xs text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{qa.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-4 text-xs text-emerald-400 flex items-center gap-2 shadow-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>{lang === 'ar' ? 'DRAGON AI يفكر في أفضل إجابة... 🐉' : 'DRAGON AI is thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Selected Attachment Preview */}
        {screenshot && (
          <div className="px-4 py-2 bg-[#12192c] border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border border-emerald-500/40 overflow-hidden bg-black">
                <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {lang === 'ar' ? 'تم إرفاق صورة إيصال الدفع' : 'Payment screenshot attached'}
              </span>
            </div>
            <button
              onClick={() => setScreenshot(null)}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0a0e19] border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition"
              title={lang === 'ar' ? 'إرفاق صوره تحويل' : 'Attach Screenshot'}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب استفسارك أو الخدمة المطلوبة هنا...'
                  : 'Type your message or requested service...'
              }
              className="flex-1 bg-[#141b2d] border border-slate-700/70 focus:border-emerald-500 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition"
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !screenshot)}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-950/50 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
