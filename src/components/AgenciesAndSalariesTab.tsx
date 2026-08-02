import React, { useState } from 'react';
import { Target, Award, Wallet, Building2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { UserAccount, Agency, AgencyTarget, SalaryWithdrawalRequest, StoreSettings, PaymentMethod } from '../types';

interface AgenciesAndSalariesTabProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onUserUpdate: (updated: UserAccount) => void;
  agencies: Agency[];
  targets: AgencyTarget[];
  withdrawals: SalaryWithdrawalRequest[];
  onSubmitWithdrawal: (req: Partial<SalaryWithdrawalRequest>) => void;
  settings: StoreSettings;
  lang: 'ar' | 'en';
}

export const AgenciesAndSalariesTab: React.FC<AgenciesAndSalariesTabProps> = ({
  currentUser,
  onOpenAuth,
  onUserUpdate,
  agencies,
  targets,
  withdrawals,
  onSubmitWithdrawal,
  settings,
  lang,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<AgencyTarget | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone');
  const [payoutAccount, setPayoutAccount] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const coinsAchieved = currentUser ? currentUser.totalCoinsReceived || 85000 : 0;

  const handleWithdrawSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!selectedTarget) {
      setFeedback({ type: 'error', message: 'الرجاء اختيار التارجت المنجز أولاً' });
      return;
    }
    if (coinsAchieved < selectedTarget.targetCoins) {
      setFeedback({ 
        type: 'error', 
        message: `لم تصل إلى التارجت المطلوب بعد! جمعت ${coinsAchieved.toLocaleString()} عملة D بينما التارجت يحتاج ${selectedTarget.targetCoins.toLocaleString()} عملة D.` 
      });
      return;
    }
    if (!payoutAccount.trim()) {
      setFeedback({ type: 'error', message: 'الرجاء أدخل رقم المحفظة أو الحساب لاستلام الراتب' });
      return;
    }

    onSubmitWithdrawal({
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostPhone: currentUser.phone,
      coinsAchieved,
      salaryEgp: selectedTarget.salaryEgp,
      paymentMethod,
      payoutAccount: payoutAccount.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    });

    setFeedback({
      type: 'success',
      message: `🎉 تم تقديم طلب سحب راتبك بقيمة ${selectedTarget.salaryEgp.toLocaleString()} EGP بنجاح! سيصلك التحويل فوراً بعد المراجعة.`
    });
    setPayoutAccount('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/40 p-8 text-center shadow-2xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>DRAGON AGENCY & HOST SALARY SYSTEM 🐉</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
            نظام الرواتب وتارجت المضيفين 💰
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            عندما تتلقى الهدايا وعملات D في الغرف الصوتية، تجمع النقاط للوصول للتارجت وسحب راتبك الشهري فوراً!
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-center font-bold text-xs ${
          feedback.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Target Progress Bar for Current Host */}
      {currentUser && (
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">تقدمك الشهري في جمع الهدايا:</span>
            <span className="font-black text-amber-400 font-mono text-sm">
              {coinsAchieved.toLocaleString()} عملة D 🪙
            </span>
          </div>

          <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (coinsAchieved / 100000) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Targets List & Salary Calculator */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <span>تارجت الرواتب المتاحة شهرياً</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {targets.map((tgt) => {
            const isMet = coinsAchieved >= tgt.targetCoins;
            return (
              <div
                key={tgt.id}
                onClick={() => setSelectedTarget(tgt)}
                className={`bg-[#0f172a] border p-6 rounded-3xl cursor-pointer transition-all space-y-4 ${
                  selectedTarget?.id === tgt.id 
                    ? 'border-emerald-400 bg-[#14233c]' 
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{tgt.descriptionAr}</span>
                  {isMet && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                      التارجت منجز 👑
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">التارجت المطلوب</span>
                    <span className="text-lg font-black text-amber-400 font-mono">{tgt.targetCoins.toLocaleString()} D</span>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold">الراتب المستحق</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{tgt.salaryEgp.toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salary Withdrawal Form */}
      <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          <span>طلب سحب الراتب</span>
        </h3>

        <form onSubmit={handleWithdrawSalary} className="space-y-4">
          {selectedTarget && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              التارجت المحدد: {selectedTarget.descriptionAr} (الراتب: {selectedTarget.salaryEgp.toLocaleString()} EGP)
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">وسيلة استلام الراتب:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none"
            >
              <option value="vodafone">فودافون كاش (Vodafone Cash)</option>
              <option value="instapay">إنستا باي (Instapay)</option>
              <option value="wallet">إضافة مباشرة لمحفظة المتجر</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">رقم المحفظة / عنوان التحويل:</label>
            <input
              type="text"
              value={payoutAccount}
              onChange={(e) => setPayoutAccount(e.target.value)}
              placeholder="مثال: 01012345678"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 text-black font-black text-sm shadow-xl hover:brightness-110 transition"
          >
            إرسال طلب سحب الراتب فوراً 🚀
          </button>
        </form>
      </div>

    </div>
  );
};
