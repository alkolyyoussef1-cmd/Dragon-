import React, { useState } from 'react';
import { Headphones, Send, MessageSquare, CheckCircle2, User, ShieldCheck, Clock, PlusCircle, X } from 'lucide-react';
import { UserAccount, SupportTicket, SupportTicketMessage } from '../types';

interface CustomerSupportPortalProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Partial<SupportTicket>) => void;
  onSendTicketMessage: (ticketId: string, text: string, senderRole: 'user' | 'agent', senderName: string) => void;
  isAgent?: boolean;
  agentName?: string;
  lang: 'ar' | 'en';
}

export const CustomerSupportPortal: React.FC<CustomerSupportPortalProps> = ({
  currentUser,
  onOpenAuth,
  tickets,
  onSubmitTicket,
  onSendTicketMessage,
  isAgent = false,
  agentName = 'فريق الدعم الفني 🎧',
  lang,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [newSubject, setNewSubject] = useState('');
  const [newInitialMsg, setNewInitialMsg] = useState('');
  const [replyText, setReplyText] = useState('');
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  const userTickets = isAgent 
    ? tickets 
    : tickets.filter(t => t.userId === currentUser?.id || t.userPhone === currentUser?.phone);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || userTickets[0] || null;

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newSubject.trim() || !newInitialMsg.trim()) return;

    const newTicket: Partial<SupportTicket> = {
      id: `TICKET-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      subject: newSubject.trim(),
      status: 'Open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'user',
          senderName: currentUser.name,
          text: newInitialMsg.trim(),
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmitTicket(newTicket);
    setCreateTicketOpen(false);
    setNewSubject('');
    setNewInitialMsg('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const role = isAgent ? 'agent' : 'user';
    const name = isAgent ? agentName : (currentUser?.name || 'عميل');

    onSendTicketMessage(activeTicket.id, replyText.trim(), role, name);
    setReplyText('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 border border-blue-500/40 p-8 text-center shadow-2xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <Headphones className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>DRAGON CUSTOMER SERVICE DESK 🎧 — خدمة العملاء المباشرة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
            مركز خدمة العملاء والدعم الفني 🎧
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            مواجهة مشكلة أو استفسار؟ تواصل مباشرة مع فريق الدعم الفني المخصص للرد على جميع تساؤلاتك وحلها فوراً!
          </p>

          {!isAgent && (
            <button
              onClick={() => setCreateTicketOpen(true)}
              className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-xl inline-flex items-center gap-2 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>فتح تذكرة دعم جديدة ✉️</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Ticket List Sidebar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>التذاكر المفتوحة ({userTickets.length})</span>
            {isAgent && <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">وضع الموظف 🎧</span>}
          </h3>

          <div className="space-y-3 max-h-[450px] overflow-y-auto">
            {userTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeTicket?.id === t.id 
                    ? 'bg-[#15203b] border-amber-500/50 shadow-md' 
                    : 'bg-[#121b2d]/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-amber-400 font-mono">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === 'Open' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                <p className="text-[10px] text-slate-400 mt-1">العميل: {t.userName} ({t.userPhone})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Chat Body */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-[520px]">
          {activeTicket ? (
            <>
              {/* Top Details */}
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">صاحب التذكرة: {activeTicket.userName} - {activeTicket.userPhone}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/40">
                  {activeTicket.assignedAgentName || 'الدعم الفني المباشر'}
                </span>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2">
                {activeTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl max-w-[80%] text-xs space-y-1 ${
                      m.senderRole === 'agent'
                        ? 'bg-blue-950/80 border border-blue-500/40 text-blue-100 ml-auto'
                        : 'bg-[#131d33] border border-slate-800 text-slate-200 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] text-amber-400 font-bold">
                      <span>{m.senderName}</span>
                      <span className="text-slate-500">{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-slate-100">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك للدعم الفني..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs shadow hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center text-slate-400 my-auto">
              اختر تذكرة لمشاهدة المحادثة
            </div>
          )}
        </div>

      </div>

      {/* Create Ticket Modal */}
      {createTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-amber-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">فتح تذكرة دعم جديدة ✉️</h3>
              <button onClick={() => setCreateTicketOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">موضوع الاستفسار:</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="مثال: استفسار حول شحن العملات"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">تفاصيل المشكلة / السؤال:</label>
                <textarea
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="اكتب شرحاً مبسطاً..."
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 text-black font-extrabold text-xs shadow-xl"
              >
                إرسال للتنفيذ والدعم 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
