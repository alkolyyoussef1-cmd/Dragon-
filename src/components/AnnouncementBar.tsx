import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { StoreSettings } from '../types';

interface AnnouncementBarProps {
  settings: StoreSettings;
  lang: 'ar' | 'en';
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings, lang }) => {
  if (!settings.announcementActive || !settings.announcement) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-b border-emerald-800/40 text-emerald-100 py-2.5 px-4 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
            <Zap className="w-3 h-3 text-emerald-400" />
            {lang === 'ar' ? 'عرض خاص' : 'SPECIAL OFFER'}
          </span>
          <span className="truncate">{settings.announcement}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'ar' ? 'ضمان رسمي 100%' : '100% Guaranteed'}
          </span>
          <span className="flex items-center gap-1 text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'تسليم خلال دقائق' : 'Fast Delivery'}
          </span>
        </div>
      </div>
    </div>
  );
};
