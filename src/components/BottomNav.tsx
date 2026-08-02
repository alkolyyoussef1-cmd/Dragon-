import React from 'react';
import { ShoppingBag, Bot, Wallet, PackageCheck, Gift, ShieldAlert, Flame } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'catalog' | 'chat' | 'track' | 'payment_info' | 'admin' | 'wallet' | 'referral';
  setActiveTab: (tab: any) => void;
  lang: 'ar' | 'en';
  currentUser?: any;
  onOpenAuth?: () => void;
  pendingOrdersCount?: number;
  pendingDepositsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lang,
  pendingOrdersCount = 0,
  pendingDepositsCount = 0,
}) => {
  const navItems = [
    {
      id: 'catalog',
      labelAr: 'المتجر',
      labelEn: 'Catalog',
      icon: ShoppingBag,
      badge: null,
    },
    {
      id: 'chat',
      labelAr: 'الدراجون AI',
      labelEn: 'Dragon AI',
      icon: Bot,
      badge: '🔥',
    },
    {
      id: 'wallet',
      labelAr: 'المحفظة',
      labelEn: 'Wallet',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'track',
      labelAr: 'التتبع',
      labelEn: 'Tracking',
      icon: PackageCheck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      id: 'referral',
      labelAr: 'الأرباح',
      labelEn: 'Earn',
      icon: Gift,
      badge: '🎁',
    },
    {
      id: 'admin',
      labelAr: 'الإدارة',
      labelEn: 'Control',
      icon: ShieldAlert,
      badge: pendingDepositsCount > 0 ? pendingDepositsCount : null,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-2 sm:px-4 pb-2 pt-1 bg-[#0a0f1d]/95 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500/20 to-emerald-500/10 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-black bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full shadow-md animate-pulse">
                  {item.badge}
                </span>
              )}

              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-400 animate-bounce' : 'text-slate-400'}`} />

              <span className={`text-[11px] font-bold mt-1 tracking-tight ${isActive ? 'text-amber-300 font-extrabold' : 'text-slate-400'}`}>
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </span>

              {isActive && (
                <div className="w-4 h-0.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
