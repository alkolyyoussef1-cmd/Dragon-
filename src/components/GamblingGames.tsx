import React, { useState } from 'react';
import { Gamepad2, Trophy, Flame, Sparkles, AlertCircle, RotateCw, Box, Dices, Coins } from 'lucide-react';
import { UserAccount } from '../types';

interface GamblingGamesProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onUserUpdate: (updated: UserAccount) => void;
  onOpenCoinStore: () => void;
  lang: 'ar' | 'en';
}

export const GamblingGames: React.FC<GamblingGamesProps> = ({
  currentUser,
  onOpenAuth,
  onUserUpdate,
  onOpenCoinStore,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'chest' | 'dice'>('wheel');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [spinning, setSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<{ message: string; isWin: boolean; coinsChange: number } | null>(null);

  // Treasure chest choice
  const [openedChestIndex, setOpenedChestIndex] = useState<number | null>(null);

  // Dice Choice
  const [selectedDiceChoice, setSelectedDiceChoice] = useState<'high' | 'low' | 'seven'>('high');

  const checkBalance = (): boolean => {
    if (!currentUser) {
      onOpenAuth();
      return false;
    }
    const userCoins = currentUser.dCoins || 0;
    if (userCoins < betAmount) {
      alert(lang === 'ar' ? `رصيد عملات D غير كافٍ! تحتاج ${betAmount} عملة. يرجى شحن العملات أولاً.` : `Insufficient D-coins!`);
      onOpenCoinStore();
      return false;
    }
    return true;
  };

  // Game 1: Wheel Spin Logic
  const handleSpinWheel = () => {
    if (!checkBalance() || !currentUser || spinning) return;
    setSpinning(true);
    setGameResult(null);

    // Deduct bet amount immediately
    const userCoins = currentUser.dCoins || 0;
    let coins = userCoins - betAmount;

    setTimeout(() => {
      // Wheel Multipliers: 0x, 0.5x, 1.5x, 2x, 5x, 10x, 50x
      const odds = [
        { mult: 0, weight: 0.35, text: 'خسارة! 0x' },
        { mult: 1.5, weight: 0.30, text: 'فوز صغير 1.5x 🪙' },
        { mult: 2.0, weight: 0.20, text: 'فوز مضاعف 2x! 🔥' },
        { mult: 5.0, weight: 0.10, text: 'فوز ذهبي 5x! ⚡' },
        { mult: 10.0, weight: 0.04, text: 'فوز ملكي 10x! 👑' },
        { mult: 50.0, weight: 0.01, text: 'الجائزة الكبرى 50x 💥' }
      ];

      const rand = Math.random();
      let cumulative = 0;
      let selectedOutcome = odds[0];

      for (const item of odds) {
        cumulative += item.weight;
        if (rand <= cumulative) {
          selectedOutcome = item;
          break;
        }
      }

      const winCoins = Math.floor(betAmount * selectedOutcome.mult);
      const netChange = winCoins - betAmount;
      coins += winCoins;

      const updatedUser: UserAccount = {
        ...currentUser,
        dCoins: coins
      };
      onUserUpdate(updatedUser);

      setGameResult({
        message: selectedOutcome.mult > 0 
          ? `🎉 ${selectedOutcome.text} — حصلت على ${winCoins} عملة D!`
          : `💔 حظاً أوفر في المرة القادمة! خسر الضربة.`,
        isWin: selectedOutcome.mult > 0,
        coinsChange: netChange
      });

      setSpinning(false);
    }, 2000);
  };

  // Game 2: Treasure Chest Pick Logic
  const handlePickChest = (index: number) => {
    if (!checkBalance() || !currentUser || spinning) return;
    setOpenedChestIndex(index);
    setSpinning(true);
    setGameResult(null);

    const userCoins = currentUser.dCoins || 0;
    let coins = userCoins - betAmount;

    setTimeout(() => {
      const outcomes = [0, 2, 5];
      const shuffled = [...outcomes].sort(() => Math.random() - 0.5);
      const mult = shuffled[index % shuffled.length];

      const winCoins = Math.floor(betAmount * mult);
      const netChange = winCoins - betAmount;
      coins += winCoins;

      const updatedUser: UserAccount = {
        ...currentUser,
        dCoins: coins
      };
      onUserUpdate(updatedUser);

      setGameResult({
        message: mult > 0 
          ? `💎 فتحت الصندوق وعثرت على مضاعف x${mult} — ربحت ${winCoins} عملة!` 
          : `💣 كان الصندوق ملغماً! خسرت ${betAmount} عملة.`,
        isWin: mult > 0,
        coinsChange: netChange
      });

      setSpinning(false);
      setTimeout(() => setOpenedChestIndex(null), 3000);
    }, 1500);
  };

  // Game 3: High / Low Dice Roll Logic
  const handleRollDice = () => {
    if (!checkBalance() || !currentUser || spinning) return;
    setSpinning(true);
    setGameResult(null);

    const userCoins = currentUser.dCoins || 0;
    let coins = userCoins - betAmount;

    setTimeout(() => {
      const d1 = Math.floor(1 + Math.random() * 6);
      const d2 = Math.floor(1 + Math.random() * 6);
      const total = d1 + d2;

      let mult = 0;
      if (selectedDiceChoice === 'low' && total >= 2 && total <= 6) mult = 2;
      else if (selectedDiceChoice === 'high' && total >= 8 && total <= 12) mult = 2;
      else if (selectedDiceChoice === 'seven' && total === 7) mult = 5;

      const winCoins = Math.floor(betAmount * mult);
      const netChange = winCoins - betAmount;
      coins += winCoins;

      const updatedUser: UserAccount = {
        ...currentUser,
        dCoins: coins
      };
      onUserUpdate(updatedUser);

      setGameResult({
        message: mult > 0 
          ? `🎲 النرد خرج ${d1} + ${d2} = (${total}) — توقعك صحيح! ربحت ${winCoins} عملة D!` 
          : `🎲 النرد خرج ${d1} + ${d2} = (${total}) — توقعك خاطئ!`,
        isWin: mult > 0,
        coinsChange: netChange
      });

      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 border border-purple-500/40 p-8 text-center shadow-2xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>DRAGON GAMBLING & LUCKY GAMES 🎰</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
            ألعاب مراهنات وحظ عملات D 🪙
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            راهن بعملات D في عجلة الحظ، صناديق الكنز، ونرد التنين لمضاعفة ثروتك وتصل إلى الجائزة الكبرى 50x!
          </p>

          {currentUser && (
            <div className="mt-4 inline-flex items-center gap-4 bg-[#0d1424] border border-amber-500/40 px-6 py-3 rounded-2xl shadow-xl">
              <span className="text-xs text-slate-300 font-bold">رصيدك الحالي:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {(currentUser.dCoins || 0).toLocaleString()} 🪙 D
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg ${
            activeTab === 'wheel' 
              ? 'bg-amber-500 text-black shadow-amber-500/30' 
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>عجلة الحظ الذهبية 🎡</span>
        </button>

        <button
          onClick={() => setActiveTab('chest')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg ${
            activeTab === 'chest' 
              ? 'bg-amber-500 text-black shadow-amber-500/30' 
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>صندوق الكنز الماسي 🏴‍☠️</span>
        </button>

        <button
          onClick={() => setActiveTab('dice')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg ${
            activeTab === 'dice' 
              ? 'bg-amber-500 text-black shadow-amber-500/30' 
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>نرد التنين High/Low 🎲</span>
        </button>
      </div>

      {/* Bet Amount Selector */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
        <label className="text-xs font-bold text-slate-300 block">مبلغ الرهان (عملات D):</label>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[50, 100, 500, 1000, 5000].map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs font-mono transition ${
                betAmount === amt 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {amt} 🪙
            </button>
          ))}
        </div>
      </div>

      {/* Game Output Notification */}
      {gameResult && (
        <div className={`p-5 rounded-3xl border text-center font-bold text-sm shadow-2xl animate-bounce ${
          gameResult.isWin 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
        }`}>
          {gameResult.message}
        </div>
      )}

      {/* GAME 1: WHEEL OF FORTUNE */}
      {activeTab === 'wheel' && (
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-8 text-center space-y-8 shadow-2xl">
          <div className="relative w-64 h-64 mx-auto rounded-full border-8 border-amber-500 bg-gradient-to-tr from-amber-700 via-purple-900 to-amber-500 shadow-2xl flex items-center justify-center">
            <div className={`text-6xl ${spinning ? 'animate-spin' : ''}`}>🎡</div>
          </div>

          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-black text-base shadow-2xl transition disabled:opacity-50"
          >
            {spinning ? 'جارِ تدوير العجلة...' : `لف العجلة بـ ${betAmount} عملة D 🚀`}
          </button>
        </div>
      )}

      {/* GAME 2: TREASURE CHEST */}
      {activeTab === 'chest' && (
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-8 text-center space-y-8 shadow-2xl">
          <p className="text-xs text-slate-300 font-bold">اختر أحدا الصناديق الثلاثة لمضاعفة رهانك أو الوقوع في الفخ!</p>

          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                onClick={() => handlePickChest(idx)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                  openedChestIndex === idx 
                    ? 'bg-amber-500/20 border-amber-400 scale-105' 
                    : 'bg-[#131d33] border-slate-700 hover:border-amber-500/50'
                }`}
              >
                <div className="text-5xl mb-2">{openedChestIndex === idx ? '🎁' : '📦'}</div>
                <span className="text-xs font-black text-slate-200">صندوق {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: HIGH LOW DICE */}
      {activeTab === 'dice' && (
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-8 text-center space-y-8 shadow-2xl">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedDiceChoice('low')}
              className={`p-4 rounded-2xl border font-bold text-xs ${
                selectedDiceChoice === 'low' ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              صغير Low (2 - 6) [x2]
            </button>

            <button
              onClick={() => setSelectedDiceChoice('seven')}
              className={`p-4 rounded-2xl border font-bold text-xs ${
                selectedDiceChoice === 'seven' ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              الرقم المحظوظ 7 [x5]
            </button>

            <button
              onClick={() => setSelectedDiceChoice('high')}
              className={`p-4 rounded-2xl border font-bold text-xs ${
                selectedDiceChoice === 'high' ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              كبير High (8 - 12) [x2]
            </button>
          </div>

          <button
            onClick={handleRollDice}
            disabled={spinning}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-black text-base shadow-2xl transition disabled:opacity-50"
          >
            {spinning ? 'جارِ رمي النرد...' : `رمي النرد بـ ${betAmount} عملة D 🎲`}
          </button>
        </div>
      )}
    </div>
  );
};
