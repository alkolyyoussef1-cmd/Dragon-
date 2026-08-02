import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { ServiceCatalog } from './components/ServiceCatalog';
import { DragonAiChat } from './components/DragonAiChat';
import { OrderTracker } from './components/OrderTracker';
import { PaymentInfoPage } from './components/PaymentInfoPage';
import { AdminPortal } from './components/AdminPortal';
import { CheckoutModal } from './components/CheckoutModal';
import { WalletTab } from './components/WalletTab';
import { ReferralTab } from './components/ReferralTab';
import { BottomNav } from './components/BottomNav';
import { UserAuthModal } from './components/UserAuthModal';
import { Footer } from './components/Footer';

// New Voice, Coins, Gambling, Agency, Support, and Gift Wall Components
import { VoiceAndLiveRooms } from './components/VoiceAndLiveRooms';
import { DragonCoinStore } from './components/DragonCoinStore';
import { GamblingGames } from './components/GamblingGames';
import { AgenciesAndSalariesTab } from './components/AgenciesAndSalariesTab';
import { CustomerSupportPortal } from './components/CustomerSupportPortal';
import { GiftWallModal } from './components/GiftWallModal';

import { 
  Service, 
  StoreSettings, 
  UserAccount, 
  GiftItem, 
  LiveRoom, 
  Agency, 
  AgencyTarget, 
  SupportTicket, 
  DCoinPackage,
  SalaryWithdrawalRequest
} from './types';

import { 
  INITIAL_GIFTS, 
  INITIAL_ROOMS, 
  INITIAL_AGENCIES, 
  INITIAL_TARGETS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_DCOIN_PACKAGES 
} from './data/servicesData';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('catalog');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Interactive Live Data State
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS);
  const [rooms, setRooms] = useState<LiveRoom[]>(INITIAL_ROOMS);
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [agencyTargets, setAgencyTargets] = useState<AgencyTarget[]>(INITIAL_TARGETS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [dCoinPackages, setDCoinPackages] = useState<DCoinPackage[]>(INITIAL_DCOIN_PACKAGES);
  const [salaryWithdrawals, setSalaryWithdrawals] = useState<SalaryWithdrawalRequest[]>([]);

  // Gift Wall Modal State
  const [giftWallUser, setGiftWallUser] = useState<UserAccount | null>(null);

  // User Auth & Wallet State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('dragon_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    announcement: '🐉 DRAGON STORE — تسليم سريع فور التحويل، رقم فودافون كاش 01041621746، ضمان استبدال 100%!',
    announcementActive: true,
    vodafoneNumber: '01041621746',
    instapayHandle: 'dragonstore@instapay',
    cibIban: 'EG120003000100000001234567890',
    usdtAddress: 'TXYZ1234567890DragonStoreTRC20Address',
    autoConfirmEnabled: false,
  });

  const [checkoutService, setCheckoutService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && data.vodafoneNumber) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const refreshUserAccount = async (phone: string) => {
    try {
      const res = await fetch(`/api/user/profile?phone=${phone}`);
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('dragon_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchSettings();
    if (currentUser?.phone) {
      refreshUserAccount(currentUser.phone);
    }
  }, []);

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('dragon_user', JSON.stringify(user));
  };

  const handleAskAiWithService = (serviceName: string) => {
    setActiveTab('chat');
  };

  const handleAskAiWithOrder = (orderId: string) => {
    setActiveTab('chat');
  };

  return (
    <div className={`min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-amber-500 selection:text-black pb-24 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* Announcement Bar */}
      <AnnouncementBar settings={settings} lang={lang} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenGiftWall={() => setGiftWallUser(currentUser)}
      />

      {/* Main Body Content per Active Tab */}
      <main className="min-h-[calc(100vh-250px)] px-3 sm:px-6 pt-6">
        {activeTab === 'catalog' && (
          <ServiceCatalog
            services={services}
            lang={lang}
            onOrderService={(srv) => setCheckoutService(srv)}
            onAskAi={handleAskAiWithService}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceAndLiveRooms
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdate={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            rooms={rooms}
            gifts={gifts}
            onCreateRoom={(newR) => {
              const r: LiveRoom = {
                id: `room-${Date.now()}`,
                title: newR.title || 'غرفة صوت جديدة 🎙️',
                category: newR.category || 'voice',
                hostName: currentUser?.name || 'مضيف جديد',
                hostAvatar: currentUser?.name?.slice(0, 2) || '🎙️',
                hostId: currentUser?.id || 'host-1',
                hostCountry: currentUser?.countryFlag || '🇪🇬',
                hostLevel: currentUser?.receiverLevel || 1,
                listenersCount: 1,
                totalRoomCoins: 0,
                micSeats: [
                  { seatIndex: 1, userId: currentUser?.id || 'host-1', userName: currentUser?.name || 'مضيف', userAvatar: '🎙️', userFlag: currentUser?.countryFlag || '🇪🇬', senderLevel: currentUser?.senderLevel || 1, totalCoinsReceived: 0 }
                ],
                messages: []
              };
              setRooms([r, ...rooms]);
            }}
            onOpenCoinStore={() => setActiveTab('coins')}
            lang={lang}
          />
        )}

        {activeTab === 'coins' && (
          <DragonCoinStore
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdate={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            packages={dCoinPackages}
            settings={settings}
            lang={lang}
          />
        )}

        {activeTab === 'games' && (
          <GamblingGames
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdate={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            onOpenCoinStore={() => setActiveTab('coins')}
            lang={lang}
          />
        )}

        {activeTab === 'salaries' && (
          <AgenciesAndSalariesTab
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdate={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            agencies={agencies}
            targets={agencyTargets}
            withdrawals={salaryWithdrawals}
            onSubmitWithdrawal={(req) => {
              const fullReq: SalaryWithdrawalRequest = {
                id: `SR-${Date.now()}`,
                hostId: req.hostId || 'h1',
                hostName: req.hostName || 'مضيف',
                hostPhone: req.hostPhone || '',
                coinsAchieved: req.coinsAchieved || 0,
                salaryEgp: req.salaryEgp || 0,
                paymentMethod: req.paymentMethod || 'vodafone',
                payoutAccount: req.payoutAccount || '',
                status: 'Pending',
                createdAt: new Date().toISOString()
              };
              setSalaryWithdrawals([fullReq, ...salaryWithdrawals]);
            }}
            settings={settings}
            lang={lang}
          />
        )}

        {activeTab === 'support' && (
          <CustomerSupportPortal
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            tickets={supportTickets}
            onSubmitTicket={(t) => {
              setSupportTickets([t as SupportTicket, ...supportTickets]);
            }}
            onSendTicketMessage={(tId, text, role, name) => {
              setSupportTickets(prev => prev.map(t => {
                if (t.id === tId) {
                  return {
                    ...t,
                    messages: [
                      ...t.messages,
                      {
                        id: `msg-${Date.now()}`,
                        senderRole: role,
                        senderName: name,
                        text,
                        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]
                  };
                }
                return t;
              }));
            }}
            lang={lang}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletTab
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdated={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            settings={settings}
            lang={lang}
          />
        )}

        {activeTab === 'referral' && (
          <ReferralTab
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onUserUpdated={(u) => {
              setCurrentUser(u);
              localStorage.setItem('dragon_user', JSON.stringify(u));
            }}
            lang={lang}
          />
        )}

        {activeTab === 'chat' && (
          <DragonAiChat
            lang={lang}
            services={services}
            onSelectService={(srv) => setCheckoutService(srv)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'track' && (
          <OrderTracker
            lang={lang}
            onAskAiWithOrder={handleAskAiWithOrder}
          />
        )}

        {activeTab === 'payment_info' && (
          <PaymentInfoPage
            settings={settings}
            lang={lang}
            onGoToStore={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            services={services}
            settings={settings}
            lang={lang}
            onUpdateServices={fetchServices}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* Gift Wall Profile Modal */}
      {giftWallUser && (
        <GiftWallModal
          user={giftWallUser}
          onClose={() => setGiftWallUser(null)}
          onUpdateUserCountry={(countryFlag) => {
            if (currentUser) {
              const updated = { ...currentUser, countryFlag };
              setCurrentUser(updated);
              setGiftWallUser(updated);
              localStorage.setItem('dragon_user', JSON.stringify(updated));
            }
          }}
          lang={lang}
        />
      )}

      {/* User Login/Auth Modal */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        lang={lang}
      />

      {/* Checkout Order Drawer/Modal */}
      {checkoutService && (
        <CheckoutModal
          service={checkoutService}
          settings={settings}
          lang={lang}
          currentUser={currentUser}
          onClose={() => setCheckoutService(null)}
          onOrderCreated={(newOrder) => {
            if (currentUser?.phone) {
              refreshUserAccount(currentUser.phone);
            }
          }}
        />
      )}

      {/* Bottom Fiery Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Global Footer */}
      <Footer lang={lang} onNavigateTab={setActiveTab} />
    </div>
  );
}

export default App;
