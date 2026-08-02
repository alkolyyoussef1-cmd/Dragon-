import React, { useState } from 'react';
import { Sparkles, Coins, Zap, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserAccount, DCoinPackage, StoreSettings } from '../types';

interface DragonCoinStoreProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onUserUpdate: (updated: UserAccount) => void;
  packages: DCoinPackage[];
  settings: StoreSettings;
  lang: 'ar' | 'en';
}

export const DragonCoinStore: React.FC<DragonCoinStoreProps> = ({
  currentUser,
  onOpenAuth,
  onUserUpdate,
  packages,
  settings,
  lang,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<DCoinPackage | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBuyWithBalance = (pkg: DCoinPackage) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (currentUser.balance < pkg.priceEgp) {
      setErrorMsg(
        lang === 'ar'
          ? `رصيد محفظتك المباشر (${currentUser.balance} EGP) لا يكفي لشراء الباقة (${pkg.priceEgp} EGP)! يرجى تعبئة رصيد المحفظة أولاً.`
          : `Wallet balance (${currentUser.balance} EGP) insufficient!`
      );
      return;
    }

    const totalCoinsPurchased = pkg.dCoinsAmount + pkg.bonusCoins;
    const newBalance = currentUser.balance - pkg.priceEgp;
    const newDCoins = (currentUser.dCoins || 0) + totalCoinsPurchased;

    const updatedUser: UserAccount = {
      ...currentUser,
      balance: newBalance,
      dCoins: newDCoins,
    };

    onUserUpdate(updatedUser);
    setSuccessMsg(
      lang === 'ar'
        ? `🎉 تم شحن ${totalCoinsPurchased.toLocaleString()} عملة D 🪙 بنجاح لرصيدك! تم الخصم من المحفظة.`
        : `Successfully purchased ${totalCoinsPurchased.toLocaleString()} D-Coins!`
    );
    setSelectedPkg(null);

    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-[#1e1436] to-slate-950 border border-amber-500/40 p-8 text-center shadow-2xl">
        <div className="absolute top-0 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Coins className="w-4 h-4 text-amber-400 animate-spin" />
            <span>DRAGON D-COINS RECHARGE CENTER 🪙</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
            متجر شحن عملات الدراجون الذهبية D 🪙
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            اشحن عملات D الذهبية الفاخرة لإرسال الهدايا المتحركة في الغرف الصوتية، دعم المضيفين، ولعب ألعاب المراهنات التنينية!
          </p>

          {currentUser && (
            <div className="mt-4 inline-flex items-center gap-4 bg-[#0d1424] border border-amber-500/40 px-6 py-3 rounded-2xl shadow-xl">
              <span className="text-xs text-slate-300 font-bold">رصيد عملاتك الحالي:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {(currentUser.dCoins || 0).toLocaleString()} 🪙 D
              </span>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-bold text-center animate-bounce">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-sm font-bold text-center">
          {errorMsg}
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-[#0f172a] border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl ${
              pkg.popular 
                ? 'border-amber-400 shadow-amber-500/20 bg-gradient-to-b from-[#1c142b] to-[#0f172a]' 
                : 'border-slate-800 hover:border-amber-500/40'
            }`}
          >
            {pkg.badge && (
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-black text-[10px] font-black shadow">
                {pkg.badge}
              </span>
            )}

            <div className="text-center space-y-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 mx-auto flex items-center justify-center text-3xl shadow-lg">
                🪙
              </div>

              <div>
                <h3 className="text-2xl font-black text-white font-mono">
                  {pkg.dCoinsAmount.toLocaleString()} D
                </h3>
                {pkg.bonusCoins > 0 && (
                  <span className="text-xs font-bold text-emerald-400 block mt-1">
                    + {pkg.bonusCoins.toLocaleString()} عملة مجانية 🎁
                  </span>
                )}
              </div>

              <div className="py-2 border-y border-slate-800">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {pkg.priceEgp} EGP
                </span>
              </div>
            </div>

            <button
              onClick={() => handleBuyWithBalance(pkg)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-lg transition"
            >
              شحن فوراً بالمحفظة ⚡
            </button>
          </div>
        ))}
      </div>

      {/* Notice Info Box */}
      <div className="bg-[#0f172a] border border-amber-500/20 rounded-3xl p-6 text-center space-y-2">
        <h4 className="text-sm font-bold text-amber-400">💡 لا تملك رصيد كافٍ في المحفظة؟</h4>
        <p className="text-xs text-slate-300">
          يمكنك تعبئة رصيد المحفظة عبر فودافون كاش ({settings.vodafoneNumber}) ثم تحويله لعملات D فورياً!
        </p>
      </div>
    </div>
  );
};
