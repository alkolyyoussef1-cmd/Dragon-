import React from 'react';
import { Trophy, Gift, Award, Star, ShieldCheck, Crown, X, Heart, Globe } from 'lucide-react';
import { UserAccount, ARAB_COUNTRIES } from '../types';

interface GiftWallModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onUpdateUserCountry?: (countryFlag: string) => void;
  lang: 'ar' | 'en';
}

export const GiftWallModal: React.FC<GiftWallModalProps> = ({
  user,
  onClose,
  onUpdateUserCountry,
  lang,
}) => {
  if (!user) return null;

  const totalGiftsCount = user.receivedGifts?.reduce((acc, item) => acc + item.count, 0) || 0;
  const totalGiftsCoins = user.receivedGifts?.reduce((acc, item) => acc + item.totalCoins, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f172a] border border-amber-500/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-2xl shadow-xl">
              🐉
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>جدار هدايا وملف العضو</span>
                <span>{user.countryFlag || '🇪🇬'}</span>
              </h3>
              <p className="text-xs text-amber-400 font-bold">{user.name} • {user.vipLevel}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level & Stats Header Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#131d33] border border-amber-500/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">مستوى الداعم Sender</span>
            <span className="text-xl font-black text-amber-400 font-mono">Lvl {user.senderLevel || 1}</span>
          </div>

          <div className="bg-[#131d33] border border-purple-500/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">مستوى المضيف Host</span>
            <span className="text-xl font-black text-purple-400 font-mono">Lvl {user.receiverLevel || 1}</span>
          </div>

          <div className="bg-[#131d33] border border-emerald-500/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">إجمالي الهدايا</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{totalGiftsCount} هدية</span>
          </div>

          <div className="bg-[#131d33] border border-rose-500/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">قيمتها بالعملات</span>
            <span className="text-xl font-black text-rose-400 font-mono">{totalGiftsCoins.toLocaleString()} 🪙</span>
          </div>
        </div>

        {/* Country Selector */}
        {onUpdateUserCountry && (
          <div className="space-y-2 bg-[#131d33] p-4 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>اختر دولة الحساب والأعلام:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ARAB_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onUpdateUserCountry(c.flag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    user.countryFlag === c.flag ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.nameAr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gift Wall Showcase Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>جدار الهدايا المستلمة (Gift Wall 🏆)</span>
          </h4>

          {user.receivedGifts && user.receivedGifts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.receivedGifts.map((g, idx) => (
                <div
                  key={idx}
                  className="bg-[#131d33] border border-amber-500/30 p-4 rounded-2xl text-center space-y-2 shadow-lg relative overflow-hidden"
                >
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                    x{g.count}
                  </span>
                  <div className="text-4xl my-2">{g.giftIcon || '👑'}</div>
                  <h5 className="text-xs font-bold text-white">{g.giftName}</h5>
                  <span className="text-[11px] text-amber-400 font-bold font-mono block">
                    {g.totalCoins.toLocaleString()} عملة D 🪙
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-[#131d33] rounded-2xl border border-slate-800">
              لم يستلم هذا الحساب هدايا بعد. شارك في الغرف الصوتية للبدء في تلقي الهدايا والتنافس!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
