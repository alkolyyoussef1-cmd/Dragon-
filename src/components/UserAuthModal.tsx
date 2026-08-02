import React, { useState } from 'react';
import { X, User, Phone, Sparkles, ShieldCheck, Gift } from 'lucide-react';
import { UserAccount } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  lang: 'ar' | 'en';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError(lang === 'ar' ? 'الرجاء إدخال رقم الهاتف' : 'Phone number is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'عميل الدراجون',
          phone: phone.trim(),
          referralCodeInput: referralInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      setError('تعذر الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-5 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
            🐉
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
            {lang === 'ar' ? 'حساب متجر الدراجون 🐉' : 'DRAGON STORE Account'}
          </h2>
          <p className="text-xs text-slate-300">
            {lang === 'ar'
              ? 'أدخل اسمك ورقم هاتفك للوصول لمحفظتك وسجل طلباتك ونقاط الإحالة!'
              : 'Enter your phone number to manage your wallet & orders!'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'ar' ? 'الاسم بالكامل:' : 'Full Name:'}
            </label>
            <div className="relative">
              <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد محمود"
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl pr-10 pl-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'ar' ? 'رقم الهاتف (Vodafone/Mobile):' : 'Phone Number:'}
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 01041621746"
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl pr-10 pl-3 py-2 text-sm outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'ar' ? 'كود إحالة صديق (اختياري للحصول على نقاط هدية):' : 'Referral Code (Optional):'}
            </label>
            <div className="relative">
              <Gift className="absolute right-3 top-2.5 w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="مثال: DRAGON-772"
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-amber-300 rounded-xl pr-10 pl-3 py-2 text-sm outline-none font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'جارِ الدخول...' : 'تسجيل الدخول / البدء الآن 🐉'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
