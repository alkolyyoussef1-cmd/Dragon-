import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Send, 
  Gift, 
  Users, 
  Sparkles, 
  Flame, 
  Tv, 
  Radio, 
  PlusCircle, 
  X, 
  Trophy, 
  Crown, 
  Heart, 
  Play, 
  ShieldCheck, 
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { LiveRoom, GiftItem, UserAccount, MicSeat, LiveRoomMessage } from '../types';

interface VoiceAndLiveRoomsProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onUserUpdate: (updated: UserAccount) => void;
  gifts: GiftItem[];
  rooms: LiveRoom[];
  onUpdateRooms: (rooms: LiveRoom[]) => void;
  onOpenGamesModal: () => void;
  onOpenCoinStore: () => void;
  lang: 'ar' | 'en';
}

export const VoiceAndLiveRooms: React.FC<VoiceAndLiveRoomsProps> = ({
  currentUser,
  onOpenAuth,
  onUserUpdate,
  gifts,
  rooms,
  onUpdateRooms,
  onOpenGamesModal,
  onOpenCoinStore,
  lang
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [selectedGiftCategory, setSelectedGiftCategory] = useState<'all' | 'popular' | 'luxury' | 'lucky'>('all');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('host');
  const [giftDrawerOpen, setGiftDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState<'voice' | 'tiktok_live'>('voice');
  const [newStreamUrl, setNewStreamUrl] = useState('');

  const activeRoom = rooms.find(r => r.id === activeRoomId) || null;

  // Handles joining mic seat
  const handleToggleMicSeat = (seatIndex: number) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!activeRoom) return;

    const updatedSeats = activeRoom.micSeats.map(seat => {
      if (seat.seatIndex === seatIndex) {
        if (seat.userId === currentUser.id) {
          // Leave seat
          return { seatIndex };
        } else if (!seat.userId) {
          // Join seat
          return {
            seatIndex,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: '🐉',
            userFlag: currentUser.countryFlag || '🇪🇬',
            senderLevel: currentUser.senderLevel || 1,
            isMuted: false,
            isSpeaking: false,
            totalCoinsReceived: 0
          };
        }
      }
      return seat;
    });

    const updatedRoom: LiveRoom = { ...activeRoom, micSeats: updatedSeats };
    onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };

  // Send Live Chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!chatInput.trim() || !activeRoom) return;

    const newMsg: LiveRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderLevel: currentUser.senderLevel || 1,
      senderFlag: currentUser.countryFlag || '🇪🇬',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedRoom: LiveRoom = {
      ...activeRoom,
      messages: [...activeRoom.messages, newMsg]
    };
    onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setChatInput('');
  };

  // Send Gift (Animated / Lucky / Standard)
  const handleSendGift = (gift: GiftItem) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!activeRoom) return;

    const userCoins = currentUser.dCoins || 0;
    if (userCoins < gift.priceCoins) {
      alert(lang === 'ar' ? `رصيد عملات D غير كافٍ! تحتاج ${gift.priceCoins} عملة D. يرجى شحن العملات أولاً.` : `Insufficient D-Coins! Required: ${gift.priceCoins} D-Coins.`);
      onOpenCoinStore();
      return;
    }

    // Deduct coins & update sender level
    const newCoins = userCoins - gift.priceCoins;
    const totalSent = (currentUser.totalCoinsSent || 0) + gift.priceCoins;
    const newSenderLevel = Math.min(100, Math.floor(1 + Math.sqrt(totalSent / 100)));

    let luckyMultiplier = 1;
    let luckyBonusReturn = 0;
    let isLuckyWin = false;

    if (gift.isLucky) {
      // Lucky gift odds: 40% win chance (2x to 50x multiplier)
      if (Math.random() < 0.45) {
        const mults = [2, 3, 5, 10, 20, 50];
        luckyMultiplier = mults[Math.floor(Math.random() * mults.length)];
        luckyBonusReturn = gift.priceCoins * luckyMultiplier;
        isLuckyWin = true;
      }
    }

    const finalCoins = newCoins + luckyBonusReturn;
    
    // Recipient determination
    let recipientName = activeRoom.hostName;
    if (selectedRecipientId !== 'host') {
      const seat = activeRoom.micSeats.find(s => s.seatIndex === Number(selectedRecipientId));
      if (seat && seat.userName) recipientName = seat.userName;
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      dCoins: finalCoins,
      totalCoinsSent: totalSent,
      senderLevel: newSenderLevel
    };
    onUserUpdate(updatedUser);

    // Active Gift Anim Overlay & Chat Message
    const giftAnim = {
      giftId: gift.id,
      giftName: gift.nameAr,
      giftImage: gift.imageUrl,
      isAnimated: gift.isAnimated,
      isLucky: gift.isLucky,
      senderName: currentUser.name,
      recipientName,
      coinValue: gift.priceCoins,
      luckyMultiplier: isLuckyWin ? luckyMultiplier : undefined
    };

    const giftMsgText = isLuckyWin 
      ? `🎉 فاز العضو بحظ اسطوري x${luckyMultiplier} ورجع له ${luckyBonusReturn} عملة D 🪙!`
      : `أرسل ${gift.nameAr} بقيمة ${gift.priceCoins} عملة D 🪙 إلى ${recipientName}`;

    const newMsg: LiveRoomMessage = {
      id: `gift-msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderLevel: newSenderLevel,
      senderFlag: currentUser.countryFlag || '🇪🇬',
      text: giftMsgText,
      giftAnim: {
        giftName: gift.nameAr,
        giftImage: gift.imageUrl,
        coinValue: gift.priceCoins,
        recipientName
      },
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedRoom: LiveRoom = {
      ...activeRoom,
      totalRoomCoins: activeRoom.totalRoomCoins + gift.priceCoins,
      activeGiftAnimation: giftAnim,
      messages: [...activeRoom.messages, newMsg]
    };

    onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));

    // Auto clear gift animation overlay after 4 seconds
    setTimeout(() => {
      onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? { ...updatedRoom, activeGiftAnimation: null } : r));
    }, 4500);
  };

  // Create New Room
  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newRoomTitle.trim()) return;

    const newRoom: LiveRoom = {
      id: `room-${Date.now()}`,
      title: newRoomTitle.trim(),
      category: newRoomType,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: '🐉',
      hostCountry: currentUser.countryFlag || '🇪🇬',
      hostLevel: currentUser.receiverLevel || 1,
      listenersCount: 1,
      totalRoomCoins: 0,
      streamVideoUrl: newStreamUrl.trim() || 'https://assets.mixkit.co/videos/preview/mixkit-party-lights-and-dj-dancing-40715-large.mp4',
      micSeats: [
        { seatIndex: 1, userId: currentUser.id, userName: currentUser.name, userAvatar: '🐉', userFlag: currentUser.countryFlag || '🇪🇬', senderLevel: currentUser.senderLevel || 1, isSpeaking: true, totalCoinsReceived: 0 },
        { seatIndex: 2 },
        { seatIndex: 3 },
        { seatIndex: 4 },
        { seatIndex: 5 },
        { seatIndex: 6 },
        { seatIndex: 7 },
        { seatIndex: 8 }
      ],
      messages: [
        { id: 'm-init', senderId: 'sys', senderName: 'نظام الدراجون 🐉', text: 'تم فتح الغرفة بنجاح! مرحباً بكم في DRAGON LIVE 🔥', timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    onUpdateRooms([newRoom, ...rooms]);
    setCreateRoomOpen(false);
    setActiveRoomId(newRoom.id);
    setNewRoomTitle('');
  };

  const filteredGifts = gifts.filter(g => selectedGiftCategory === 'all' || g.category === selectedGiftCategory);

  return (
    <div className="space-y-6 pb-16">

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#120926] via-[#1a103c] to-[#0d172e] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>DRAGON LIVE ROOMS 🐉 — غرف صوتية ولايف تيك توك</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
              غرف الصوت وتحديات اللايف المباشرة 🎙️🎬
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              تحدث مباشرة مع أصدقائك في غرف الـ 8 مايكات، أرسل الهدايا المتحركة الفاخرة 👑، شارك في ألعاب الحظ، واحصل على رواتب مجزية!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCreateRoomOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-sm shadow-xl flex items-center gap-2 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>إنشاء غرفة / لايف 🔴</span>
            </button>

            <button
              onClick={onOpenCoinStore}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs shadow-lg flex items-center gap-2 transition"
            >
              <span className="text-lg">🪙</span>
              <span>شحن D-Coins</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View: Room List OR Active Room View */}
      {!activeRoom ? (
        /* ==================== ROOM LIST VIEW ==================== */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>الغرف والبثوث النشطة الآن ({rooms.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map(room => (
              <div
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className="group relative bg-[#0f172a] hover:bg-[#15203b] border border-amber-500/20 hover:border-amber-500/50 rounded-3xl p-5 cursor-pointer transition-all duration-300 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1.5 ${
                    room.category === 'voice' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {room.category === 'voice' ? <Radio className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
                    <span>{room.category === 'voice' ? 'غرفة صوتية 🎙️' : 'لايف تيك توك 🎬'}</span>
                  </span>

                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <Users className="w-3.5 h-3.5" />
                    <span>{room.listenersCount} مستمع</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition line-clamp-2 mb-4 leading-snug">
                  {room.title}
                </h3>

                {/* Host Info & Room Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-lg shadow">
                      {room.hostAvatar || '🐉'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{room.hostName}</span>
                        <span>{room.hostCountry}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold block">مستوى المضيف Lvl {room.hostLevel}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold">إجمالي هدايا الغرفة</span>
                    <span className="text-sm font-black text-amber-400 font-mono">{room.totalRoomCoins.toLocaleString()} 🪙</span>
                  </div>
                </div>

                <div className="mt-4 text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 group-hover:from-amber-500 group-hover:to-emerald-500 group-hover:text-black font-extrabold text-xs text-amber-300 transition-all">
                  دخول الغرفة والتحدث الآن ➡️
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ==================== ACTIVE IN-ROOM VIEW ==================== */
        <div className="space-y-6">
          {/* Top Bar inside room */}
          <div className="flex items-center justify-between bg-[#0f172a] border border-amber-500/30 p-4 rounded-3xl shadow-xl">
            <button
              onClick={() => setActiveRoomId(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>خروج من الغرفة</span>
            </button>

            <div className="text-center">
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">{activeRoom.title}</h2>
              <p className="text-xs text-amber-400 font-bold flex items-center justify-center gap-2">
                <span>المضيف: {activeRoom.hostName} {activeRoom.hostCountry}</span>
                <span>• إجمالي الهدايا: {activeRoom.totalRoomCoins.toLocaleString()} 🪙</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenGamesModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow transition animate-pulse"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">ألعاب الرهان 🎰</span>
              </button>

              <button
                onClick={() => setGiftDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-black text-xs font-extrabold shadow transition"
              >
                <Gift className="w-4 h-4" />
                <span>إرسال هدية 🎁</span>
              </button>
            </div>
          </div>

          {/* Room Display Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Video Live Stream OR 8-Mic Voice Room */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Active Gift Overlay Banner */}
              {activeRoom.activeGiftAnimation && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-purple-900 to-amber-950 border-2 border-amber-400 p-6 text-center shadow-2xl animate-bounce">
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={activeRoom.activeGiftAnimation.giftImage} 
                      alt="Gift Animation" 
                      className="w-20 h-20 object-cover rounded-2xl border-2 border-amber-300 shadow-xl"
                    />
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/50">
                        {activeRoom.activeGiftAnimation.isLucky ? '🎁 هدية حظ أسطورية!' : '👑 هدية ملكية متحركة'}
                      </span>
                      <h3 className="text-xl font-black text-white mt-1">
                        {activeRoom.activeGiftAnimation.senderName} أرسل {activeRoom.activeGiftAnimation.giftName}
                      </h3>
                      <p className="text-sm font-bold text-amber-400 font-mono">
                        بقيمة {activeRoom.activeGiftAnimation.coinValue.toLocaleString()} عملة D 🪙 {activeRoom.activeGiftAnimation.recipientName ? `إلى ${activeRoom.activeGiftAnimation.recipientName}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeRoom.category === 'tiktok_live' ? (
                /* TikTok Live Video Stream View */
                <div className="relative rounded-3xl overflow-hidden bg-black border border-rose-500/30 shadow-2xl aspect-video flex items-center justify-center">
                  <video
                    src={activeRoom.streamVideoUrl}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

                  <div className="absolute top-4 right-4 bg-rose-600/90 px-3 py-1 rounded-full text-white text-xs font-black flex items-center gap-1.5 shadow">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>مباشر LIVE 🎬</span>
                  </div>

                  <div className="absolute bottom-6 right-6 text-right text-white space-y-1">
                    <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                      <span>{activeRoom.hostName}</span>
                      <span className="text-sm">{activeRoom.hostCountry}</span>
                    </h3>
                    <p className="text-xs text-slate-200">بث مباشر تفاعلي | تيك توك لايف الدراجون</p>
                  </div>
                </div>
              ) : (
                /* 8-Mic Seats Voice Grid */
                <div className="bg-[#0b1120] border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold flex items-center gap-1.5 text-purple-400">
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>مقاعد المايك الصوتية (8 مايكات)</span>
                    </span>
                    <span className="text-slate-400">اضغط على المايك الفارغ للجلوس والتحدث!</span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 sm:gap-6">
                    {activeRoom.micSeats.map((seat) => (
                      <div
                        key={seat.seatIndex}
                        onClick={() => handleToggleMicSeat(seat.seatIndex)}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                          seat.userId 
                            ? 'bg-[#15203b] border-amber-500/40 hover:border-amber-400 shadow-lg' 
                            : 'bg-[#0f172a]/60 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/40'
                        }`}
                      >
                        {seat.userId ? (
                          <>
                            {seat.isSpeaking && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                            )}
                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 p-0.5 shadow-xl flex items-center justify-center text-2xl">
                              {seat.userAvatar || '🐉'}
                              <span className="absolute -bottom-1 right-0 text-xs">{seat.userFlag}</span>
                            </div>
                            <span className="mt-2 text-xs font-bold text-slate-100 line-clamp-1">{seat.userName}</span>
                            <span className="text-[10px] text-amber-400 font-extrabold font-mono">Lvl {seat.senderLevel || 1}</span>
                            
                            <div className="mt-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              {seat.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                              <PlusCircle className="w-6 h-6" />
                            </div>
                            <span className="mt-2 text-[11px] font-bold text-slate-400">مايك {seat.seatIndex}</span>
                            <span className="text-[10px] text-slate-500">شغور</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Chat & Interactive Gift Bar */}
            <div className="space-y-4 flex flex-col justify-between bg-[#0f172a] border border-slate-800 rounded-3xl p-5 shadow-2xl h-[520px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>الشات المباشر</span>
                </span>
                <span className="text-slate-400 font-mono">{activeRoom.messages.length} رسالة</span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {activeRoom.messages.map((msg) => (
                  <div key={msg.id} className="space-y-1 bg-[#131d33] p-3 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400">{msg.senderName}</span>
                        <span>{msg.senderFlag}</span>
                        {msg.senderLevel && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                            Lvl {msg.senderLevel}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed">{msg.text}</p>

                    {msg.giftAnim && (
                      <div className="mt-1.5 flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
                        <img src={msg.giftAnim.giftImage} alt="Gift" className="w-6 h-6 rounded object-cover" />
                        <span className="font-bold">{msg.giftAnim.giftName} ({msg.giftAnim.coinValue} 🪙)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك في الشات المباشر...' : 'Write live message...'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs shadow hover:brightness-110 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Gift Drawer Modal */}
      {giftDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-amber-500/30 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-black text-white">متجر الهدايا الفاخرة 👑</h3>
              </div>
              <button
                onClick={() => setGiftDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Recipient Selector */}
            {activeRoom && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">اختر المستلم في الغرفة:</label>
                <select
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold outline-none"
                >
                  <option value="host">👑 مضيف الغرفة: {activeRoom.hostName}</option>
                  {activeRoom.micSeats.filter(s => s.userId && s.userName).map(s => (
                    <option key={s.seatIndex} value={s.seatIndex}>
                      🎙️ مايك {s.seatIndex}: {s.userName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Gift Category Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setSelectedGiftCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${selectedGiftCategory === 'all' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
              >
                الكل 🎁
              </button>
              <button
                onClick={() => setSelectedGiftCategory('luxury')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${selectedGiftCategory === 'luxury' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
              >
                فاخرة ومتحركة 👑
              </button>
              <button
                onClick={() => setSelectedGiftCategory('lucky')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${selectedGiftCategory === 'lucky' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
              >
                هدايا حظ (100x) 🎲
              </button>
            </div>

            {/* Gift Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {filteredGifts.map((gift) => (
                <div
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="group relative bg-[#131d33] hover:bg-[#1a2745] border border-amber-500/20 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer transition-all shadow-md"
                >
                  {gift.isLucky && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                      حظ 🎲
                    </span>
                  )}
                  {gift.isAnimated && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black">
                      متحركة ✨
                    </span>
                  )}

                  <img
                    src={gift.imageUrl}
                    alt={gift.nameAr}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-3 shadow group-hover:scale-105 transition"
                  />
                  <h4 className="text-xs font-bold text-white line-clamp-1">{gift.nameAr}</h4>
                  <div className="mt-2 text-amber-400 font-black text-sm font-mono flex items-center justify-center gap-1">
                    <span>🪙</span>
                    <span>{gift.priceCoins.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {createRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-amber-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">إنشاء غرفة / لايف جديد 🔴</h3>
              <button onClick={() => setCreateRoomOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">عنوان الغرفة:</label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="مثال: 🔥 سهرة الدراجون الملكية"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نوع الغرفة:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRoomType('voice')}
                    className={`py-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 ${
                      newRoomType === 'voice' 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>صوتية 8 مايكات 🎙️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRoomType('tiktok_live')}
                    className={`py-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 ${
                      newRoomType === 'tiktok_live' 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    <span>لايف تيك توك 🎬</span>
                  </button>
                </div>
              </div>

              {newRoomType === 'tiktok_live' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">رابط بث الفيديو (اختياري MP4/Live):</label>
                  <input
                    type="text"
                    value={newStreamUrl}
                    onChange={(e) => setNewStreamUrl(e.target.value)}
                    placeholder="https://example.com/stream.mp4"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 text-black font-extrabold text-sm shadow-xl"
              >
                بدء البث فوراً 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
