import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Globe, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap,
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { StoreSettings } from '../types';

interface PaymentInfoPageProps {
  settings: StoreSettings;
  lang: 'ar' | 'en';
  onGoToStore: () => void;
}

export const PaymentInfoPage: React.FC<PaymentInfoPageProps> = ({ settings, lang, onGoToStore }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 border border-emerald-800/40 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-emerald-950/60">
          <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white font-sans">
          {lang === 'ar' ? 'طرق الدفع والشحن المعتمدة في DRAGON STORE 🐉' : 'Approved Payment & Transfer Methods'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'نوفر لك أسهل وآمن وسائل الدفع الإلكتروني والمحلي مع تأكيد فوري وتنفيذ سريع للخدمات'
            : 'Fast, secure local and international payment gateways with immediate order execution'}
        </p>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vodafone Cash */}
        <div className="bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'فودافون كاش (Vodafone Cash)' : 'Vodafone Cash'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {lang === 'ar' ? 'تحويل فوري بدون عمولات' : 'Instant Zero-Fee Local Transfer'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#131b2e] rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'رقم الكاش الرسمي:' : 'Official Number:'}</span>
              <span className="text-lg font-black text-white font-mono">{settings.vodafoneNumber}</span>
            </div>
            <button
              onClick={() => handleCopy(settings.vodafoneNumber, 'vf')}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition"
            >
              {copiedField === 'vf' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'قم بالتحويل من أي محفظة إلكترونية (فودافون كاش، اتصالات، أورانج، وي، أو الأهلي فون) ثم احتفظ برقم المرجع أو صوره الشاشة.'
              : 'Transfer from any mobile wallet in Egypt. Save reference ID or receipt screenshot.'}
          </p>
        </div>

        {/* Instapay */}
        <div className="bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'تطبيق إنستا باي (InstaPay IPA)' : 'InstaPay App'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {lang === 'ar' ? 'تحويل بنكي فوري 24/7' : '24/7 Instant Bank Transfer'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#131b2e] rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'عنوان الدفع InstaPay:' : 'InstaPay IPA:'}</span>
              <span className="text-lg font-black text-white font-mono">{settings.instapayHandle}</span>
            </div>
            <button
              onClick={() => handleCopy(settings.instapayHandle, 'ip')}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition"
            >
              {copiedField === 'ip' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'افتح تطبيق InstaPay واختر تحويل إلى عنوان دفع (IPA) أو رقم هاتف ثم اكتب اسم الحساب الموضح أعلاه.'
              : 'Open InstaPay app and transfer to IPA handle or phone number directly.'}
          </p>
        </div>

        {/* Bank CIB */}
        <div className="bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'تحويل بنكي CIB IBAN' : 'CIB Bank Transfer'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {lang === 'ar' ? 'متاح للبنوك المباشرة' : 'Direct Bank Transfer'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#131b2e] rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'رقم الآيبان الدولي (IBAN):' : 'CIB IBAN:'}</span>
              <span className="text-xs font-mono font-bold text-white break-all">{settings.cibIban}</span>
            </div>
            <button
              onClick={() => handleCopy(settings.cibIban, 'cib')}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition shrink-0 ml-2"
            >
              {copiedField === 'cib' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'للتحويلات البنكية المباشرة عبر تطبيق البنك أو ماكينات ATM بدون كارت.'
              : 'For direct bank application transfers or cardless ATM deposits.'}
          </p>
        </div>

        {/* USDT TRC20 Crypto */}
        <div className="bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'العملات الرقمية USDT (TRC20)' : 'Crypto USDT (TRC20)'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {lang === 'ar' ? 'تحويل دولي آمن 100%' : 'Global Crypto Transfer'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#131b2e] rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">USDT Address (TRC20):</span>
              <span className="text-xs font-mono font-bold text-emerald-400 break-all">{settings.usdtAddress}</span>
            </div>
            <button
              onClick={() => handleCopy(settings.usdtAddress, 'usdt')}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition shrink-0 ml-2"
            >
              {copiedField === 'usdt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'يدعم التحويل عبر Binance, OKX, Bybit أو أي محفظة crypto على شبكة Tron TRC20.'
              : 'Supports Binance, OKX, Bybit, or any wallet on Tron TRC20 network.'}
          </p>
        </div>

      </div>

      {/* Safety & Verification Flow */}
      <div className="bg-[#0e1424] rounded-3xl p-6 border border-slate-800 space-y-4 text-center max-w-2xl mx-auto">
        <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">
          {lang === 'ar' ? 'خطوات التأكيد بعد التحويل' : 'Verification Workflow'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'بعد إتمام التحويل، اضغط على زر (اطلب الآن) من متجر الخدمات، اختر طريقة الدفع وأدخل رقم العملية أو ارفع صورة الإيصال ليتم مراجعتها وتفعيل طلبك فوراً!'
            : 'After completing payment, submit your transaction ID or receipt image during checkout for instant verification.'}
        </p>

        <div className="pt-2">
          <button
            onClick={onGoToStore}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <span>{lang === 'ar' ? 'الانتقال لمتجر الخدمات للطلب' : 'Go To Store Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
