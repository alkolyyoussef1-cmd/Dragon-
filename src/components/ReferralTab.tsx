import React, { useState } from 'react';
import { Gift, Copy, Check, Sparkles, Users, Coins, ArrowRightLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserAccount, StoreSettings } from '../types';

interface ReferralTabProps {
  user?: UserAccount | null;
  currentUser?: UserAccount | null;
  onLoginRequest?: () => void;
  onOpenAuth?: () => void;
  settings?: StoreSettings;
  lang: 'ar' | 'en';
  onUserUpdate?: (updatedUser: UserAccount) => void;
  onUserUpdated?: (updatedUser: UserAccount) => void;
}

export const ReferralTab: React.FC<ReferralTabProps> = ({
  user,
  currentUser,
  onLoginRequest,
  onOpenAuth,
  settings = {
    announcement: '',
    announcementActive: false,
    vodafoneNumber: '01041621746',
    instapayHandle: '',
    cibIban: '',
    usdtAddress: '',
    supportWhatsapp: '',
    currencyRateUSD: 50,
    pointsPerReferral: 50,
    pointsToBalanceRatio: 10,
  },
  lang,
  onUserUpdate,
  onUserUpdated,
}) => {
  const activeUser = user || currentUser || null;
  const triggerAuth = () => {
    if (onLoginRequest) onLoginRequest();
    else if (onOpenAuth) onOpenAuth();
  };
  const notifyUserUpdate = (updatedUser: UserAccount) => {
    if (onUserUpdate) onUserUpdate(updatedUser);
    if (onUserUpdated) onUserUpdated(updatedUser);
  };

  const [copied, setCopied] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState<string>('100');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const referralCode = activeUser?.referralCode || 'DRAGON-772';
  const referralUrl = `https://dragon-store.app/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      triggerAuth();
      return;
    }

    const pts = Number(redeemPoints);
    if (isNaN(pts) || pts <= 0 || pts > activeUser.points) {
      setFeedback({ type: 'error', message: 'نقاط غير كافية أو قيمة غير صالحة' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/user/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser.id,
          pointsToRedeem: pts,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        if (activeUser) {
          notifyUserUpdate({
            ...activeUser,
            balance: data.newBalance,
            points: data.newPoints,
          });
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'فشلت عملية الاستبدال' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'حدث خطأ في الاتصال بالشبكة' });
    } finally {
      setLoading(false);
    }
  };

  const pointsRatio = settings?.pointsToBalanceRatio || 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#10192a] to-emerald-950/70 border border-amber-500/30 p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'نظام الأرباح ورابط الإحالة 🐉' : 'REFERRAL & POINTS SYSTEM'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white font-sans tracking-tight">
          {lang === 'ar' ? 'ادعُ أصدقاءك واكسب رصيد مجاني للمحفظة!' : 'Invite Friends & Earn Wallet Rewards'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
          {lang === 'ar'
            ? `احصل على ${settings.pointsPerReferral || 50} نقطة مكافأة عن كل صديق يقوم بالتسجيل من خلال رابط الإحالة الخاص بك وحول النقاط مباشرة لرصيد في محفظتك!`
            : 'Share your referral code to earn reward points every time a friend signs up!'}
        </p>
      </div>

      {/* User Status / Referral Link Card */}
      {activeUser ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1 */}
          <div className="bg-[#0f172a] border border-amber-500/30 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">رصيد نقاطك الحالي</span>
              <span className="text-2xl font-black text-amber-400">{activeUser.points} نقطة</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#0f172a] border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">قيمة النقاط بالجنيه</span>
              <span className="text-2xl font-black text-emerald-400">
                {Math.floor(activeUser.points / pointsRatio)} EGP
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#0f172a] border border-slate-700 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">كود الإحالة الخاص بك</span>
              <span className="text-xl font-mono font-black text-white">{referralCode}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-3xl text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-200 mb-4 font-bold">
            {lang === 'ar' ? 'قم بتسجيل الدخول لتوليد رابط الإحالة الخاص بك وبدء كسب النقاط!' : 'Log in to access your custom referral link!'}
          </p>
          <button
            onClick={triggerAuth}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 text-black font-black text-sm shadow-xl"
          >
            {lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب 🐉' : 'Login / Register'}
          </button>
        </div>
      )}

      {/* Referral Link & Conversion Container */}
      {activeUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Share Referral Link Box */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'رابط الإحالة المباشر الخاص بك' : 'Your Unique Referral Link'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              انسخ الرابط وشاركه مع أصدقائك على الواتساب والتليجرام وسوشيال ميديا! عند قيامهم بالتسجيل سيكتسبون خصم ترحيبي وتحصل أنت على <strong className="text-amber-300">{settings.pointsPerReferral || 50} نقطة</strong> فوراً.
            </p>

            <div className="flex items-center gap-2 bg-[#090e1a] border border-amber-500/40 p-2.5 rounded-2xl">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-transparent text-xs text-amber-300 font-mono outline-none px-2"
              />
              <button
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>

          {/* Convert Points to Wallet Cash Box */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تحويل النقاط لرصيد بالمحفظة ⚡' : 'Convert Points to Wallet Balance'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span>معدل التحويل الحالي:</span>
              <span className="font-bold font-mono">{pointsRatio} نقطة = 1 جنيه رصيد</span>
            </div>

            <form onSubmit={handleRedeem} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  {lang === 'ar' ? 'عدد النقاط المراد استبدالها:' : 'Points to convert:'}
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['50', '100', '200'].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setRedeemPoints(pts)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                        redeemPoints === pts
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {pts} نقطة ({Math.floor(Number(pts) / pointsRatio)} ج.م)
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={pointsRatio}
                  step={pointsRatio}
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.value)}
                  className="w-full bg-[#090e1a] border border-slate-700 text-emerald-300 rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none"
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
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-black font-black text-xs shadow-xl transition"
              >
                {loading ? 'جارِ التحويل...' : 'تحويل فورياً إلى رصيد المحفظة 🐉'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
