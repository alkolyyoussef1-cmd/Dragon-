import React from 'react';
import { ShieldCheck, Zap, Bot, Lock, Heart, Globe, CreditCard } from 'lucide-react';

interface FooterProps {
  lang: 'ar' | 'en';
  onNavigateTab: (tab: 'catalog' | 'chat' | 'track' | 'admin' | 'payment_info') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigateTab }) => {
  return (
    <footer className="bg-[#070a12] border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-[#0d1322] rounded-[6px] flex items-center justify-center font-bold text-emerald-400">
                D
              </div>
            </div>
            <span className="text-lg font-black text-white font-mono tracking-wider">
              DRAGON<span className="text-emerald-400">STORE</span> 🐉
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            {lang === 'ar'
              ? 'متجر الدراجون المعتمد للخدمات الرقمية، اشتراكات الذكاء الاصطناعي، تزويد حسابات التواصل، أرقام الواتساب وشحن الألعاب بأسعار تنافسية وضمان كامل.'
              : 'Official Dragon store for digital subscriptions, AI models, social media growth, virtual phone numbers, and gaming topups.'}
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'ضمان الدراجون وتأكيد فوري 100%' : 'Dragon Official Guarantee'}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {lang === 'ar' ? 'أقسام المتجر' : 'Store Navigation'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigateTab('catalog')} className="hover:text-emerald-400 transition">
                {lang === 'ar' ? 'جميع الخدمات والاشتراكات' : 'All Services Catalog'}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('chat')} className="hover:text-emerald-400 transition flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'ar' ? 'المساعد الذكي DRAGON AI' : 'DRAGON AI Assistant'}</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('track')} className="hover:text-emerald-400 transition">
                {lang === 'ar' ? 'تتبع الطلبات المباشرة' : 'Track Order Status'}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('payment_info')} className="hover:text-emerald-400 transition">
                {lang === 'ar' ? 'طرق الدفع والشحن' : 'Payments & Accounts'}
              </button>
            </li>
          </ul>
        </div>

        {/* Payment Gateways */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {lang === 'ar' ? 'وسائل الدفع المتاحة' : 'Payment Gateways'}
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-300">
              Vodafone Cash
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300">
              InstaPay IPA
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">
              CIB IBAN
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
              USDT TRC20
            </span>
          </div>
        </div>

        {/* Support & Admin */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {lang === 'ar' ? 'الدعم والأمان' : 'Support & Security'}
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'ar' ? 'دعم فني وتلقائي 24 ساعة طوال أيام الأسبوع بواسطة الذكاء الاصطناعي.' : '24/7 AI-powered support and automated order execution.'}
          </p>

          <button
            onClick={() => onNavigateTab('admin')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'ar' ? 'دخول المسؤولين' : 'Admin Portal'}</span>
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 DRAGON STORE AI 🐉. جميع الحقوق محفوظة لمتجر الدراجون.</p>
        <p className="flex items-center gap-1">
          <span>Fast, Trusted, Secure & Modern Digital Solutions</span>
        </p>
      </div>
    </footer>
  );
};
