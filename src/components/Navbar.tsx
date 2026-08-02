import React from 'react';
import { 
  Sparkles, 
  Bot, 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  Lock, 
  Globe, 
  PackageCheck,
  CreditCard,
  Menu,
  X,
  Wallet,
  Users,
  User,
  Gift
} from 'lucide-react';
import { UserAccount } from '../types';

export type NavTabType = 
  | 'catalog' 
  | 'wallet' 
  | 'referral' 
  | 'chat' 
  | 'track' 
  | 'admin' 
  | 'payment_info' 
  | 'voice' 
  | 'coins' 
  | 'games' 
  | 'salaries' 
  | 'support';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onOpenGiftWall?: () => void;
  pendingOrdersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  currentUser,
  onOpenAuthModal,
  onOpenGiftWall,
  pendingOrdersCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-amber-500/20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-500 p-0.5 shadow-xl shadow-amber-950/70 group-hover:shadow-amber-500/40 transition-all duration-300 transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
                <span className="text-2xl">🐉</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                  DRAGON<span className="text-amber-400">STORE ⚡</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === 'ar' ? 'متجر الدراجون للخدمات الرقمية وشحن الرصيد 🐉' : 'Official Dragon Digital Store'}
              </p>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#13192a]/90 p-2 rounded-2xl border border-amber-500/20 shadow-lg">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'متجر الخدمات' : 'Catalog'}</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'المحفظة والشحن' : 'Wallet'}</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm animate-pulse">🎙️</span>
              <span>{lang === 'ar' ? 'غرف الصوت واللايف' : 'Live Rooms'}</span>
            </button>

            <button
              onClick={() => setActiveTab('coins')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'coins'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">🪙</span>
              <span>{lang === 'ar' ? 'شحن عملات D' : 'D-Coins'}</span>
            </button>

            <button
              onClick={() => setActiveTab('salaries')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'salaries'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">💰</span>
              <span>{lang === 'ar' ? 'الرواتب والوكالات' : 'Salaries'}</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'support'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">🎧</span>
              <span>{lang === 'ar' ? 'خدمة العملاء' : 'Support'}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>{lang === 'ar' ? 'DRAGON AI' : 'DRAGON AI'}</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}</span>
            </button>

            <button
              onClick={() => setActiveTab('payment_info')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'payment_info'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'طرق الدفع' : 'Payments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                  : 'text-slate-400 hover:text-slate-200 border-slate-700/50 hover:bg-slate-800/40'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'المالك والإدارة' : 'Admin'}</span>
            </button>
          </nav>

          {/* Right Controls: User Balance Header & Language Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenGiftWall}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition"
                  title="عرض جدار الهدايا والمستويات"
                >
                  <span className="text-base">{currentUser.countryFlag || '🇪🇬'}</span>
                  <span className="text-amber-400 font-mono font-black">{(currentUser.dCoins || 0).toLocaleString()} 🪙 D</span>
                </button>

                <button
                  onClick={() => setActiveTab('wallet')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition"
                >
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 hidden sm:inline">{currentUser.name}</span>
                  <span className="text-emerald-400 font-mono font-black">{currentUser.balance || 0} EGP</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-black text-xs font-extrabold shadow transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تسجيل دخول' : 'Login'}</span>
              </button>
            )}

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-semibold text-slate-300 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1322] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'catalog' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300'
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? 'متجر الخدمات' : 'Store Catalog'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'wallet' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300'
            }`}
          >
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'ar' ? 'المحفظة وتعبئة الرصيد 💳' : 'Wallet & Top Up'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('referral'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'referral' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300'
            }`}
          >
            <Gift className="w-5 h-5 text-amber-300" />
            <span>{lang === 'ar' ? 'دعوة أصدقاء وكسب أرباح 🎁' : 'Referral Program'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'chat' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300'
            }`}
          >
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'ar' ? 'DRAGON AI المساعد الذكي 🐉' : 'DRAGON AI Assistant'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('track'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'track' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300'
            }`}
          >
            <PackageCheck className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'ar' ? 'تتبع طلبك' : 'Track Order'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === 'admin' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
            }`}
          >
            <Lock className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? 'لوحة تحكم المالك والإدارة' : 'Admin Control System'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
