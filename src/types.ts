export type ServiceCategory = 
  | 'ai' 
  | 'social' 
  | 'whatsapp' 
  | 'gaming' 
  | 'subscriptions' 
  | 'digital' 
  | 'custom';

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  category: ServiceCategory;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  price: number;
  currency: string;
  originalPrice?: number;
  deliveryTime: string;
  deliveryTimeAr: string;
  guarantee: string;
  guaranteeAr: string;
  requirements: string;
  requirementsAr: string;
  instructions: string;
  status: 'active' | 'disabled';
  popular?: boolean;
  badge?: string;
  icon?: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Waiting Payment' 
  | 'Payment Verification' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Scheduled' 
  | 'Completed' 
  | 'Delayed' 
  | 'Cancelled' 
  | 'Refunded' 
  | 'Failed';

export type PaymentMethod = 'wallet' | 'vodafone' | 'instapay' | 'bank' | 'card' | 'paypal' | 'crypto';

export interface PaymentProof {
  senderName?: string;
  senderNumber?: string; // الرقم الذي أرسلت منه
  amountSent?: number;   // المبلغ المرسل
  referenceNumber?: string;
  transactionId?: string;
  screenshotUrl?: string;
  submittedAt?: string;
  paymentTime?: string;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  quantity: number;
  totalPrice: number;
  currency: string;
  customerName: string;
  customerContact: string;
  targetRequirement: string;
  paymentMethod: PaymentMethod;
  paymentProof?: PaymentProof;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string[];
  estimatedDelivery: string;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  attachments?: { type: 'image' | 'file'; url: string; name?: string }[];
  quickActions?: { label: string; action: string }[];
  orderCard?: Order;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export type AdminRole = 'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT_AGENT';

export interface SubAdminAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  active: boolean;
  permissions?: string[];
}

export interface StoreSettings {
  announcement: string;
  announcementActive: boolean;
  vodafoneNumber: string;
  instapayHandle: string;
  cibIban: string;
  usdtAddress: string;
  supportWhatsapp: string;
  currencyRateUSD: number;
  autoConfirmEnabled?: boolean;
  pointsPerReferral?: number;
  pointsToBalanceRatio?: number;
}

export type VIPLevel = 'Silver 🥈' | 'Gold 🥇' | 'Diamond 💎' | 'Dragon VIP 🐉';

export interface VIPAccount {
  id: string;
  customerName: string;
  contact: string;
  vipLevel: VIPLevel;
  discountPercent: number;
  perks: string[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface VIPCode {
  id: string;
  code: string;
  discountPercent: number;
  bonusBalance: number;
  maxUses: number;
  usedCount: number;
  createdAt: string;
  active: boolean;
  descriptionAr?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  balance: number;       // رصيد الحساب المباشر بالجنيه
  points: number;        // نقاط الإحالات والمكافآت
  referralCode: string;
  referredBy?: string;
  vipLevel: VIPLevel;
  discountPercent: number;
  createdAt: string;
  // D-Coin & Level Economy Extensions
  dCoins?: number;                  // رصيد عملات D الذهبية
  senderLevel?: number;              // مستوى الداعم (عند إرسال هدايا)
  receiverLevel?: number;            // مستوى المضيف (عند استلام هدايا)
  totalCoinsSent?: number;
  totalCoinsReceived?: number;
  countryFlag?: string;              // علم الدولة (مثلا: 🇪🇬, 🇸🇦, 🇦🇪)
  agencyId?: string;                 // معرف الوكالة إذا كان مضيفاً
  agencyName?: string;
  salaryBalanceEgp?: number;         // رصيد السحب للرواتب بالجنيه
  receivedGifts?: {
    giftId: string;
    giftName: string;
    giftIcon: string;
    count: number;
    totalCoins: number;
    isAnimated?: boolean;
    isLucky?: boolean;
  }[];
}

export interface GiftItem {
  id: string;
  nameAr: string;
  nameEn: string;
  priceCoins: number;                // سعر الهدية بعملات D
  imageUrl: string;                  // رابط صورة أو فيديو GIF/WebM تحريكي
  isAnimated: boolean;               // هل الهدية متحركة بالكامل
  isLucky: boolean;                  // هل الهدية هدية حظ (تمنح أرباحاً مضاعفة)
  category: 'popular' | 'luxury' | 'lucky' | 'effects';
  soundEffect?: string;
}

export interface MicSeat {
  seatIndex: number;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userFlag?: string;
  senderLevel?: number;
  isMuted?: boolean;
  isSpeaking?: boolean;
  totalCoinsReceived?: number;
}

export interface LiveRoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderLevel?: number;
  senderFlag?: string;
  text: string;
  isSystem?: boolean;
  giftAnim?: {
    giftName: string;
    giftImage: string;
    coinValue: number;
    recipientName: string;
  };
  timestamp: string;
}

export interface LiveRoom {
  id: string;
  title: string;
  category: 'voice' | 'tiktok_live';
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostCountry: string;
  hostLevel: number;
  backgroundTheme?: string;
  streamVideoUrl?: string;           // فيديو بث لايف مباشر
  listenersCount: number;
  totalRoomCoins: number;
  micSeats: MicSeat[];
  messages: LiveRoomMessage[];
  activeGiftAnimation?: {
    giftId: string;
    giftName: string;
    giftImage: string;
    isAnimated: boolean;
    isLucky: boolean;
    senderName: string;
    recipientName: string;
    coinValue: number;
    luckyMultiplier?: number;
  } | null;
}

export interface AgencyTarget {
  id: string;
  targetCoins: number;               // التارجت المطلوب بالعملات (مثلاً 100,000 D)
  salaryEgp: number;                 // الراتب المستحق بالجنيه (مثلاً 5000 EGP)
  descriptionAr: string;
}

export interface Agency {
  id: string;
  name: string;
  code: string;
  ownerName: string;
  ownerPhone: string;
  commissionPercent: number;
  createdAt: string;
  totalHosts: number;
  active: boolean;
}

export interface SalaryWithdrawalRequest {
  id: string;
  hostId: string;
  hostName: string;
  hostPhone: string;
  agencyName?: string;
  coinsAchieved: number;
  salaryEgp: number;
  paymentMethod: PaymentMethod;
  payoutAccount: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  processedAt?: string;
}

export interface SupportTicketMessage {
  id: string;
  senderRole: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedAgentId?: string;
  assignedAgentName?: string;
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DCoinPackage {
  id: string;
  dCoinsAmount: number;
  priceEgp: number;
  bonusCoins: number;
  badge?: string;
  popular?: boolean;
}

export interface WalletDepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  senderNumber: string;
  referenceNumber?: string;
  screenshotUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  note?: string;
}

export const ARAB_COUNTRIES = [
  { code: 'EG', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'SA', nameAr: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', nameAr: 'الإمارات', flag: '🇦🇪' },
  { code: 'KW', nameAr: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', nameAr: 'قطر', flag: '🇶🇦' },
  { code: 'OM', nameAr: 'عمان', flag: '🇴🇲' },
  { code: 'BH', nameAr: 'البحرين', flag: '🇧🇭' },
  { code: 'IQ', nameAr: 'العراق', flag: '🇮🇶' },
  { code: 'JO', nameAr: 'الأردن', flag: '🇯🇴' },
  { code: 'MA', nameAr: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', nameAr: 'الجزائر', flag: '🇩🇿' },
  { code: 'TN', nameAr: 'تونس', flag: '🇹🇳' },
  { code: 'LY', nameAr: 'ليبيا', flag: '🇱🇾' },
  { code: 'SD', nameAr: 'السودان', flag: '🇸🇩' },
  { code: 'YE', nameAr: 'اليمن', flag: '🇾🇪' },
  { code: 'SY', nameAr: 'سوريا', flag: '🇸🇾' },
  { code: 'LB', nameAr: 'لبنان', flag: '🇱🇧' },
  { code: 'PS', nameAr: 'فلسطين', flag: '🇵🇸' },
];

