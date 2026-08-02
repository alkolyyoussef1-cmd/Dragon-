import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ShieldCheck, Copy, Check, QrCode, CreditCard, Sparkles, Send, Clock, AlertCircle } from 'lucide-react';
import { UserAccount, StoreSettings, WalletDepositRequest, PaymentMethod } from '../types';

interface WalletTabProps {
  user?: UserAccount | null;
  currentUser?: UserAccount | null;
  onLoginRequest?: () => void;
  onOpenAuth?: () => void;
  onUserUpdated?: (updatedUser: UserAccount) => void;
  onUserUpdate?: (updatedUser: UserAccount) => void;
  settings?: StoreSettings;
  lang: 'ar' | 'en';
  onDepositSuccess?: () => void;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  user,
  currentUser,
  onLoginRequest,
  onOpenAuth,
  settings = {
    announcement: '',
    announcementActive: false,
    vodafoneNumber: '01041621746',
    instapayHandle: 'dragonstore@instapay',
    cibIban: '',
    usdtAddress: '',
    supportWhatsapp: '',
    currencyRateUSD: 50,
    pointsPerReferral: 50,
    pointsToBalanceRatio: 10,
  },
  lang,
}) => {
  const activeUser = user || currentUser || null;
  const triggerAuth = () => {
    if (onLoginRequest) onLoginRequest();
    else if (onOpenAuth) onOpenAuth();
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone');
  const [amount, setAmount] = useState<string>('100');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [recentDeposits, setRecentDeposits] = useState<WalletDepositRequest[]>([]);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      triggerAuth();
      return;
    }

    if (!amount || Number(amount) <= 0 || !senderNumber.trim()) {
      setFeedback({ type: 'error', message: lang === 'ar' ? 'الرجاء إدخال مبلغ صحيح ورقم المحول منه!' : 'Please enter valid amount & sender number!' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser.id,
          userName: activeUser.name,
          userPhone: activeUser.phone,
          amount: Number(amount),
          paymentMethod,
          senderNumber: senderNumber.trim(),
          referenceNumber: referenceNumber.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.deposit) {
        setFeedback({
          type: 'success',
          message: lang === 'ar'
            ? '🔥 تم إرسال طلب الشحن بنجاح! سيتم مراجعة التحويل وإضافة الرصيد لحسابك خلال دقائق معدودة.'
            : 'Deposit request submitted successfully! Funds will be added shortly.',
        });
        setRecentDeposits((prev) => [data.deposit, ...prev]);
        setSenderNumber('');
        setReferenceNumber('');
      } else {
        setFeedback({ type: 'error', message: data.error || 'حدث خطأ أثناء تقديم الطلب' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'تعذر الاتصال بالسيرفر، حاول مرة أخرى' });
    } finally {
      setSubmitting(false);
    }
  };

  const vodafoneCashNumber = settings.vodafoneNumber || '01041621746';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#111927] to-emerald-950/60 border border-amber-500/30 p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'محفظة الدراجون المباشرة 🐉' : 'DRAGON INSTANT WALLET'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white font-sans tracking-tight">
          {lang === 'ar' ? 'شحن رصيد الحساب والدفع الفوري' : 'Account Wallet & Instant Top-up'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
          {lang === 'ar'
            ? 'اشحن محفظتك بفوادفون كاش أو إنستا باي واطلب جميع خدمات الذكاء الاصطناعي والألعاب بضغطة زر واحدة بدون انتظار!'
            : 'Top up your account wallet via Vodafone Cash or Instapay to order instant digital services with 1-click checkout!'}
        </p>

        {/* User Balance Card */}
        {activeUser ? (
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-4 bg-[#0d1424] border border-amber-500/40 p-4 sm:px-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-lg">
                🐉
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">{activeUser.name} ({activeUser.phone})</span>
                <span className="text-2xl font-black text-amber-400">{activeUser.balance} EGP</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <span>{activeUser.vipLevel}</span>
              <span>• {activeUser.points} نقطة مكافآت</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl max-w-md mx-auto">
            <p className="text-xs text-amber-300 mb-3 font-semibold">
              {lang === 'ar' ? 'قم بتسجيل الدخول برقم هاتفك لبدء شحن واستخدام رصيد المحفظة!' : 'Log in with your phone number to access your wallet!'}
            </p>
            <button
              onClick={triggerAuth}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-lg transition"
            >
              {lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب 🐉' : 'Login / Create Account'}
            </button>
          </div>
        )}
      </div>

      {/* Payment Gateway Transfer Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Gateway Selection */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ArrowDownLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'خطوة 1: اختر طريقة التحويل' : 'Step 1: Select Transfer Method'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('vodafone')}
              className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                paymentMethod === 'vodafone'
                  ? 'bg-red-950/40 border-red-500/80 text-white shadow-lg shadow-red-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-red-400">Vodafone Cash</span>
                <span className="text-lg">📱</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">01041621746</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('instapay')}
              className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                paymentMethod === 'instapay'
                  ? 'bg-teal-950/40 border-teal-500/80 text-white shadow-lg shadow-teal-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-teal-400">Instapay IPN</span>
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">{settings.instapayHandle}</span>
            </button>
          </div>

          {/* Active Gateway Details */}
          <div className="p-4 rounded-2xl bg-[#090e1a] border border-amber-500/20 space-y-3">
            {paymentMethod === 'vodafone' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">رقم تحويل فودافون كاش الرسمية:</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">مباشر 24/7</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-red-500/40">
                  <span className="font-mono text-base font-extrabold text-red-400 tracking-wider">
                    {vodafoneCashNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(vodafoneCashNumber, 'vdf')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 text-xs font-bold transition"
                  >
                    {copiedField === 'vdf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'vdf' ? 'تم النسخ' : 'نسخ الرقم'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  📌 يرجى التحويل من خلال محفظة فودافون كاش أو أطراف محفظة إلكترونية للرقم <strong className="text-amber-300">{vodafoneCashNumber}</strong> ثم إدخال بيانات التحويل في النموذج المثير.
                </p>
              </>
            )}

            {paymentMethod === 'instapay' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">عنوان إنستا باي (Instapay Handle):</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">فورياً</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-teal-500/40">
                  <span className="font-mono text-sm font-bold text-teal-300">
                    {settings.instapayHandle}
                  </span>
                  <button
                    onClick={() => handleCopy(settings.instapayHandle, 'insta')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 text-xs font-bold transition"
                  >
                    {copiedField === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'insta' ? 'تم النسخ' : 'نسخ العنوان'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 2: Deposit Form */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Send className="w-4 h-4" />
            <span>{lang === 'ar' ? 'خطوة 2: تأكيد بيانات التحويل للشحن' : 'Step 2: Confirm Deposit Details'}</span>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-bold">
                {lang === 'ar' ? 'المبلغ المراد شحنه (بالجنيه EGP):' : 'Amount to deposit (EGP):'}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['50', '100', '250', '500'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                      amount === preset
                        ? 'bg-amber-500 text-black border-amber-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {preset} ج.م
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل مبلغ الشحن..."
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-amber-300 rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-bold">
                {lang === 'ar' ? 'رقم المحفظة / الحساب الذي قمت بالتحويل منه:' : 'Sender Phone / Account:'}
              </label>
              <input
                type="text"
                required
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="مثال: 01041621746"
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-bold">
                {lang === 'ar' ? 'الرقم المرجعي / كود العملية (اختياري):' : 'Reference / Transaction ID:'}
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="مثال: VF-991204"
                className="w-full bg-[#090e1a] border border-slate-700 focus:border-amber-500 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 text-sm outline-none font-mono"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-sm shadow-xl shadow-amber-500/10 transition flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{submitting ? 'جارِ إرسال طلب الشحن...' : 'تأكيد إرسال الشحن للمحفظة 🐉'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recent Deposits Status */}
      {recentDeposits.length > 0 && (
        <div className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>طلبات الشحن الأخيرة الخاصة بك</span>
          </h3>
          <div className="space-y-2">
            {recentDeposits.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between p-3 rounded-xl bg-[#090e1a] border border-slate-800 text-xs">
                <div>
                  <span className="font-mono font-bold text-amber-400">{dep.id}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-300">{dep.amount} EGP ({dep.paymentMethod.toUpperCase()})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    dep.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : dep.status === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  }`}
                >
                  {dep.status === 'Approved' ? 'تم الشحن ✅' : dep.status === 'Rejected' ? 'مرفوض ❌' : 'قيد المراجعة ⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
