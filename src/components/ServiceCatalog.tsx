import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Bot, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Filter, 
  Users, 
  MessageSquare, 
  Gamepad2, 
  Image as ImageIcon, 
  Globe, 
  Check, 
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Service, ServiceCategory } from '../types';

interface ServiceCatalogProps {
  services: Service[];
  lang: 'ar' | 'en';
  onOrderService: (service: Service) => void;
  onAskAi: (serviceName: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  lang,
  onOrderService,
  onAskAi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const categories: { id: ServiceCategory | 'all'; name: string; nameAr: string; icon: React.ReactNode }[] = [
    { id: 'all', name: 'All Services', nameAr: 'جميع الخدمات', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'ai', name: 'AI Services', nameAr: '🤖 خدمات الذكاء الاصطناعي', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'social', name: 'Social Media', nameAr: '📱 سوشيال ميديا', icon: <Users className="w-4 h-4 text-cyan-400" /> },
    { id: 'whatsapp', name: 'WhatsApp & Virtual', nameAr: '📲 واتساب وأرقام وهمية', icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    { id: 'subscriptions', name: 'Subscriptions', nameAr: '💎 اشتراكات رقمية', icon: <ImageIcon className="w-4 h-4 text-amber-400" /> },
    { id: 'gaming', name: 'Gaming Topups', nameAr: '🎮 شحن ألعاب وكروت', icon: <Gamepad2 className="w-4 h-4 text-purple-400" /> },
    { id: 'digital', name: 'Web & Solutions', nameAr: '🌐 برمجة وحلول رقمية', icon: <Globe className="w-4 h-4 text-teal-400" /> },
  ];

  const filteredServices = services
    .filter((srv) => srv.status === 'active')
    .filter((srv) => {
      if (selectedCategory !== 'all' && srv.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          srv.name.toLowerCase().includes(q) ||
          srv.nameAr.includes(q) ||
          srv.description.toLowerCase().includes(q) ||
          srv.descriptionAr.includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default popular
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1322] via-[#0f182c] to-[#0d1322] border border-emerald-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المتجر الرسمي المعتمد 2026' : 'Official Verified Store 2026'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-sans">
            DRAGON <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">STORE AI 🐉</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'احصل على أرقى الخدمات الرقمية، اشتراكات الذكاء الاصطناعي، تزويد السوشيال ميديا، الأرقام الوهمية وشحن الألعاب بأسرع تسليم وضمان 100% مع دعم المساعد الذكي DRAGON AI.'
              : 'Premium digital subscriptions, AI services, social media growth, virtual phone numbers, and gaming topups with fast delivery & 100% replacement warranty.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'ضمان استبدال معتمد' : 'Verified Replacement Warranty'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'تسليم فوري ومباشر' : 'Instant Direct Delivery'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'مساعد ذكي للطلب والدفع' : 'AI Order Assistant'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="space-y-4">
        
        {/* Search Bar & Sorting */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن أي خدمة أو اشتراك...' : 'Search any service or subscription...'}
              className="w-full bg-[#0d1322] border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-400 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">{lang === 'ar' ? 'الترتيب:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#0d1322] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="popular">{lang === 'ar' ? 'الأكثر طلباً 🔥' : 'Most Popular'}</option>
              <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/40'
                    : 'bg-[#0d1322] text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                {cat.icon}
                <span>{lang === 'ar' ? cat.nameAr : cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1322] rounded-3xl border border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">
            {lang === 'ar' ? 'لم نجد أي خدمة تطابق بحثك' : 'No services match your search'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'جرب تغيير كلمة البحث أو تصفح الأقسام الأخرى' : 'Try searching another keyword or clearing filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-[#0e1424] hover:bg-[#11192d] border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-emerald-950/30"
            >
              {/* Card Top: Badge & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold tracking-wide">
                    {service.badge || (lang === 'ar' ? 'خدمة متميزة' : 'PREMIUM')}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded-md border border-cyan-800/30">
                    <Zap className="w-3 h-3" />
                    <span>{lang === 'ar' ? service.deliveryTimeAr : service.deliveryTime}</span>
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {lang === 'ar' ? service.nameAr : service.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? service.descriptionAr : service.description}
                </p>

                {/* Features List */}
                <ul className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  {(lang === 'ar' ? service.featuresAr : service.features).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Bottom: Price & Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-4">
                
                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">
                      {service.price}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {service.currency}
                    </span>
                    {service.originalPrice && (
                      <span className="text-xs text-slate-500 line-through ml-1 font-mono">
                        {service.originalPrice} {service.currency}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    🛡 {lang === 'ar' ? service.guaranteeAr : service.guarantee}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOrderService(service)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'اطلب الآن' : 'Order Now'}</span>
                  </button>

                  <button
                    onClick={() => onAskAi(lang === 'ar' ? service.nameAr : service.name)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#141c2e] hover:bg-slate-800 text-teal-300 border border-teal-500/30 hover:border-teal-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'استفسر بالـ AI' : 'Ask DRAGON'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
