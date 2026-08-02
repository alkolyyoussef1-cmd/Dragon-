import { Service, StoreSettings, Coupon, SubAdminAccount, VIPAccount, VIPCode, UserAccount, WalletDepositRequest, GiftItem, LiveRoom, Agency, AgencyTarget, SupportTicket, DCoinPackage } from '../types';

export const INITIAL_SERVICES: Service[] = [
  // AI Services
  {
    id: 'srv-gemini-pro',
    name: 'Gemini Advanced & Pro 1.5/3.0',
    nameAr: 'اشتراك جميناي برو وأدفانسد الرسمي',
    category: 'ai',
    description: 'Official Google Gemini Advanced subscription with 2TB Cloud storage and priority AI reasoning access.',
    descriptionAr: 'اشتراك رسمي في خدمة Google Gemini Advanced شامل مساحة 2 تيرابايت وإمكانية الوصول لأسرع نماذج الذكاء الاصطناعي.',
    features: ['Gemini 3.0 Pro & Ultra', '2TB Google One Storage', 'Fast Multimodal Reasoning', 'Coding & Document Analysis'],
    featuresAr: ['وصول أولوية لنماذج Gemini Ultra', 'مساحة 2 تيرابايت Google One', 'تحليل المستندات والأكواد', 'تفعيل رسمي على إيميلك الشخصي'],
    price: 350,
    originalPrice: 500,
    currency: 'EGP',
    deliveryTime: '5-15 Minutes',
    deliveryTimeAr: 'من 5 إلى 15 دقيقة',
    guarantee: 'Full Subscription Period Warranty',
    guaranteeAr: 'ضمان كامل مدة الاشتراك',
    requirements: 'Email address associated with Google account',
    requirementsAr: 'عنوان البريد الإلكتروني الخاص بحساب جوجل',
    instructions: 'Provide your Gmail email address. Activation is completed via direct family group or code.',
    status: 'active',
    popular: true,
    badge: 'BEST SELLER 🔥',
    icon: 'Sparkles'
  },
  {
    id: 'srv-chatgpt-plus',
    name: 'ChatGPT Plus (GPT-4o & Canvas)',
    nameAr: 'اشتراك تشات جي بي تي بلس (GPT-4o)',
    category: 'ai',
    description: 'Personal or shared activation for ChatGPT Plus with access to DALL-E 3, Canvas, and custom GPTs.',
    descriptionAr: 'تفعيل حساب ChatGPT Plus الرسمي مع ميزات توليد الصور DALL-E 3 وإنشاء الـ GPTs المخصصة.',
    features: ['GPT-4o & GPT-4o mini', 'DALL-E 3 Image Generation', 'Code Interpreter & Data Analysis', 'Custom GPTs Access'],
    featuresAr: ['سرعة استجابة فائقة', 'توليد الصور بدقة DALL-E 3', 'محلل البيانات والأكواد', 'الوصول للـ GPTs المخصصة'],
    price: 450,
    originalPrice: 650,
    currency: 'EGP',
    deliveryTime: '10-30 Minutes',
    deliveryTimeAr: 'من 10 إلى 30 دقيقة',
    guarantee: '30 Days Full Replacement Guarantee',
    guaranteeAr: 'ضمان استبدال 30 يوماً كاملة',
    requirements: 'Email address or new account preference',
    requirementsAr: 'الإيميل المراد التفعيل عليه أو طلب حساب جديد',
    instructions: 'Send your OpenAI account details or choose to receive a new pre-activated account.',
    status: 'active',
    popular: true,
    badge: 'MUST HAVE',
    icon: 'Bot'
  },
  {
    id: 'srv-midjourney-pro',
    name: 'Midjourney Standard / Pro Plan',
    nameAr: 'اشتراك ميدجيرني لتوليد الصور الاحترافية',
    category: 'ai',
    description: 'High-speed GPU hours for realistic AI image generation with commercial license rights.',
    descriptionAr: 'ساعات توليد سريعة على أفضل محرك ذكاء اصطناعي لتوليد الصور مع حقوق الاستخدام التجاري.',
    features: ['Fast GPU Hours', 'Relax Mode Unlimited', 'Commercial Usage License', 'Private Generation'],
    featuresAr: ['ساعات توليد فائقة السرعة', 'استخدام غير محدود في الوضع العادي', 'ترخيص استخدام تجاري', 'سرية التصاميم'],
    price: 550,
    originalPrice: 800,
    currency: 'EGP',
    deliveryTime: '15-30 Minutes',
    deliveryTimeAr: 'من 15 إلى 30 دقيقة',
    guarantee: '100% Guaranteed Period',
    guaranteeAr: 'ضمان 100% طوال الشهر',
    requirements: 'Discord Username or Email',
    requirementsAr: 'اسم مستخدم الديسكورد أو الإيميل',
    instructions: 'Connect via Discord or receive dedicated account.',
    status: 'active',
    popular: false,
    badge: 'DESIGNERS CHOICE',
    icon: 'Palette'
  },
  {
    id: 'srv-claude-pro',
    name: 'Claude 3.5 Sonnet Pro',
    nameAr: 'اشتراك كلود 3.5 سونيت برو',
    category: 'ai',
    description: 'Superior coding, writing, and analytical reasoning with Claude 3.5 Sonnet & Opus.',
    descriptionAr: 'الأفضل عالمياً في البرمجة وكتابة المحتوى الاحترافي وتحليل الملفات المعقدة.',
    features: ['5x More Usage vs Free', 'Claude 3.5 Sonnet & Opus', 'Artifacts Feature', 'Projects & Knowledge Base'],
    featuresAr: ['5 أضعاف الاستخدام المجاني', 'ميزة Artifacts لمعاينة الكود', 'دعم القواعد المعرفية والمشاريع', 'تحليل الأكواد معقدة البنية'],
    price: 480,
    originalPrice: 700,
    currency: 'EGP',
    deliveryTime: '15-30 Minutes',
    deliveryTimeAr: 'من 15 إلى 30 دقيقة',
    guarantee: '30 Days Warranty',
    guaranteeAr: 'ضمان 30 يوماً',
    requirements: 'Email address',
    requirementsAr: 'عنوان البريد الإلكتروني',
    instructions: 'Provide your account email.',
    status: 'active',
    popular: false,
    badge: 'CODERS CHOICE',
    icon: 'Code'
  },

  // Social Media Services
  {
    id: 'srv-tiktok-followers',
    name: 'TikTok Real Organic Growth (10,000 Followers)',
    nameAr: 'زيادة متابعين تيك توك حقيقيين (10,000 متابع)',
    category: 'social',
    description: 'High-quality active profile followers with refill warranty to unlock Live Streaming & Creator Rewards.',
    descriptionAr: 'متابعين حسابات حقيقية ونشطة مع ضمان التعويض لفتح البث المباشر وصندوق المبدعين.',
    features: ['Real Looking Profiles', 'No Password Required', 'Auto Refill Guarantee 60 Days', 'Unlocks TikTok Live & Monetization'],
    featuresAr: ['حسابات ذات مظهر حقيقي', 'بدون كلمة سر نهائياً', 'ضمان تعويض 60 يوم تلقائي', 'تأهيل الحساب للبث المباشر'],
    price: 290,
    originalPrice: 450,
    currency: 'EGP',
    deliveryTime: '1-6 Hours',
    deliveryTimeAr: 'من 1 إلى 6 ساعات',
    guarantee: '60-Day Auto-Refill Guarantee',
    guaranteeAr: 'ضمان إعادة تعبئة تلقائية 60 يوماً',
    requirements: 'TikTok Username or Profile Link',
    requirementsAr: 'اسم المستخدم أو رابط حساب التيك توك',
    instructions: 'Ensure profile is Public before ordering.',
    status: 'active',
    popular: true,
    badge: 'POPULAR 🔥',
    icon: 'TrendingUp'
  },
  {
    id: 'srv-instagram-growth',
    name: 'Instagram Followers & Engagement Pack (5,000)',
    nameAr: 'حزمة زيادة متابعين وتفاعل إنستجرام (5,000 متابع)',
    category: 'social',
    description: 'Premium IG followers with bonus post likes and impressions for maximum reach.',
    descriptionAr: 'متابعين إنستجرام VIP مع لايكات مجانية على آخر المنشورات لرفع اكسبلور الحساب.',
    features: ['High Retention Accounts', 'Includes 1,000 Free Likes', 'Safe Drop Protection', 'Fast Organic Delivery Rate'],
    featuresAr: ['حسابات ذات ثبات عالي', 'يشمل 1,000 لايك مجاني', 'حماية الحساب من الحظر', 'سرعة إرسال آمنة'],
    price: 220,
    originalPrice: 350,
    currency: 'EGP',
    deliveryTime: '1-4 Hours',
    deliveryTimeAr: 'من 1 إلى 4 ساعات',
    guarantee: '30-Day Refill Guarantee',
    guaranteeAr: 'ضمان إعادة تعبئة 30 يوماً',
    requirements: 'Instagram Public Username',
    requirementsAr: 'اسم مستخدم إنستجرام العام',
    instructions: 'Turn off Private Account mode.',
    status: 'active',
    popular: true,
    badge: 'TOP VALUE',
    icon: 'Users'
  },
  {
    id: 'srv-telegram-members',
    name: 'Telegram Channel / Group Members (10,000)',
    nameAr: 'زيادة أعضاء قنوات ومجموعات تليجرام (10,000 عضو)',
    category: 'social',
    description: 'Boost your Telegram channel credibility instantly with non-drop active members.',
    descriptionAr: 'رفع عدد أعضاء القناة أو الجروب لزيادة ثقة المشتركين والعملاء الجدد.',
    features: ['Non-Drop Guarantee', 'Instant Start', 'Supports Private & Public Links', 'Post Views Bonus'],
    featuresAr: ['بدون نقص نهائياً', 'بدء إرسال فوري', 'يدعم الرابط العام والخاص', 'مشاهدات مجانية للبوستات'],
    price: 320,
    originalPrice: 500,
    currency: 'EGP',
    deliveryTime: '15-60 Minutes',
    deliveryTimeAr: 'من 15 إلى 60 دقيقة',
    guarantee: 'Lifetime Non-Drop Warranty',
    guaranteeAr: 'ضمان عدم النقص مدى الحياة',
    requirements: 'Telegram Channel/Group Link',
    requirementsAr: 'رابط القناة أو المجموعة',
    instructions: 'Channel must allow member additions.',
    status: 'active',
    popular: false,
    badge: 'INSTANT',
    icon: 'Send'
  },
  {
    id: 'srv-youtube-views-monetization',
    name: 'YouTube Watch Hours & 1000 Subs Pack',
    nameAr: 'باقة تحقيق شروط يوتيوب (4000 ساعة + 1000 مشترك)',
    category: 'social',
    description: 'Complete monetization setup package to fulfill YouTube Partner Program standards.',
    descriptionAr: 'تأهيل القناة للربح من يوتيوب كاملاً بطريقة شرعية وآمنة 100%.',
    features: ['4,000 Real Watch Hours', '1,000 Authentic Subscribers', 'Monetization Approved', 'Safe & Safe Delivery'],
    featuresAr: ['4,000 ساعة مشاهدة حقيقية', '1,000 مشترك حقيقي', 'مقبول في برنامج شركاء يوتيوب', 'آمن تماماً على القناة'],
    price: 1850,
    originalPrice: 2600,
    currency: 'EGP',
    deliveryTime: '3-7 Days',
    deliveryTimeAr: 'من 3 إلى 7 أيام',
    guarantee: 'Full Channel Approval Guarantee',
    guaranteeAr: 'ضمان قبول تفعيل الربح كامل',
    requirements: 'YouTube Channel Link + Video 15min+',
    requirementsAr: 'رابط القناة + فيديو مدته 15 دقيقة أو أكثر',
    instructions: 'Provide video link longer than 15 minutes for watch hours tracking.',
    status: 'active',
    popular: true,
    badge: 'VIP PACKAGE 👑',
    icon: 'Video'
  },

  // WhatsApp & Virtual Numbers
  {
    id: 'srv-whatsapp-bulk-bot',
    name: 'VENOM WhatsApp Marketing & Bot Software',
    nameAr: 'برنامج وبوت واتساب للمبيعات والتسويق الآلي',
    category: 'whatsapp',
    description: 'Automated bulk message sender, auto-responder bot, contact extractor and button templates.',
    descriptionAr: 'برنامج التسويق الأقوى على واتساب: إرسال جماعي، الرد الآلي الذكي، وسحب الداتا وتصنيف الرقم.',
    features: ['Unlimited Message Sending', 'Auto Bot Responder', 'Contact & Group Extractor', 'Anti-Ban Filter Logic'],
    featuresAr: ['إرسال رسائل غير محدود', 'رد آلي وبوت محادثة', 'سحب داتا المجموعات', 'نظام حماية ضد الحظر'],
    price: 600,
    originalPrice: 1000,
    currency: 'EGP',
    deliveryTime: 'Instant Download',
    deliveryTimeAr: 'تحميل ومفاتيح فورية',
    guarantee: '1 Year License & Lifetime Updates',
    guaranteeAr: 'ترخيص سنة كاملة وتحديثات مجانية',
    requirements: 'Windows PC or Server',
    requirementsAr: 'كمبيوتر ويندوز أو سيرفر',
    instructions: 'License key & setup guide delivered immediately upon payment.',
    status: 'active',
    popular: true,
    badge: 'BEST FOR BUSINESS',
    icon: 'MessageSquare'
  },
  {
    id: 'srv-virtual-number-usa',
    name: 'Virtual US / UK Phone Number (WhatsApp / Telegram / SMS)',
    nameAr: 'رقم وهمي أمريكي / بريطاني لتفعيل الواتساب والتليجرام',
    category: 'whatsapp',
    description: 'Clean private virtual phone number for instant SMS verification codes.',
    descriptionAr: 'رقم افتراضي خاص لاستقبال كود التفعيل للواتساب والتليجرام والخدمات العالمية.',
    features: ['100% Private Clean Number', 'Instant SMS Code Delivery', 'Works for WhatsApp, Telegram, ChatGPT', 'Guaranteed First Time Activation'],
    featuresAr: ['رقم خاص نظيف 100%', 'وصول كود SMS فوراً', 'يعمل للواتساب والتليجرام وتاتش جي بي تي', 'ضمان تفعيل من المرة الأولى'],
    price: 95,
    originalPrice: 150,
    currency: 'EGP',
    deliveryTime: '1-5 Minutes',
    deliveryTimeAr: 'من 1 إلى 5 دقائق',
    guarantee: 'Guaranteed Code Arrival or Instant Replacement',
    guaranteeAr: 'ضمان وصول الكود أو استبدال رقم فوراً',
    requirements: 'App name to activate',
    requirementsAr: 'اسم التطبيق المراد تفعيله',
    instructions: 'Our assistant will provide the number live in chat and relay your activation code.',
    status: 'active',
    popular: true,
    badge: 'CHEAP & FAST',
    icon: 'Phone'
  },

  // Subscriptions & Digital
  {
    id: 'srv-canva-pro-lifetime',
    name: 'Canva Pro Brand Kit & Team Upgrade',
    nameAr: 'اشتراك كانفا برو (Canva Pro) الحساب الشخصي',
    category: 'subscriptions',
    description: 'Full Canva Pro design access on your own personal email with AI Magic Studio tools.',
    descriptionAr: 'تفعيل ميزات كانفا برو بالكامل على إيميلك الشخصي شاملة أدوات الذكاء الاصطناعي Magic Studio.',
    features: ['Brand Kit & Custom Fonts', '100M+ Stock Photos & Videos', 'AI Magic Erase & Resize', 'Unlimited Cloud Storage'],
    featuresAr: ['هوية بصرية وخطوط عربية', '100 مليون عنصر وصورة بريميوم', 'إزالة الخلفية بضغطة زر', 'مساحة تخزين غير محدودة'],
    price: 120,
    originalPrice: 300,
    currency: 'EGP',
    deliveryTime: '2-10 Minutes',
    deliveryTimeAr: 'من 2 إلى 10 دقائق',
    guarantee: '1 Year Direct Warranty',
    guaranteeAr: 'ضمان مباشر لمدة سنة كاملة',
    requirements: 'Your Canva Email Address',
    requirementsAr: 'إيميلك في كانفا',
    instructions: 'Accept the email invite link to convert your account to Pro.',
    status: 'active',
    popular: true,
    badge: 'BARGAIN',
    icon: 'Image'
  },
  {
    id: 'srv-spotify-premium-family',
    name: 'Spotify / YouTube Premium (1 Year)',
    nameAr: 'اشتراك سبوتيفاي أو يوتيوب بريميوم (سنة كاملة)',
    category: 'subscriptions',
    description: 'Ad-free streaming, offline downloads, background play on your official email.',
    descriptionAr: 'مشاهدة بدون إعلانات، تشغيل في الخلفية، وتحميل المقاطع بجودة فائقة بدون انقطاع.',
    features: ['Zero Ads Guarantee', 'High Quality 320kbps / 4K', 'Background Play', 'Offline Downloads'],
    featuresAr: ['بدون إعلانات نهائياً', 'جودة صوت وفيديو فائقة', 'تشغيل في الخلفية', 'تحميل الاستماع بدون إنترنت'],
    price: 280,
    originalPrice: 500,
    currency: 'EGP',
    deliveryTime: '5-15 Minutes',
    deliveryTimeAr: 'من 5 إلى 15 دقيقة',
    guarantee: '1 Year Warranty',
    guaranteeAr: 'ضمان سنة كاملة',
    requirements: 'Email address',
    requirementsAr: 'عنوان البريد الإلكتروني',
    instructions: 'Provided via official family invite link.',
    status: 'active',
    popular: false,
    badge: 'POPULAR',
    icon: 'Music'
  },
  {
    id: 'srv-express-nord-vpn',
    name: 'ExpressVPN / NordVPN Premium Dedicated Account',
    nameAr: 'حساب ExpressVPN / NordVPN بريميوم مدفوع',
    category: 'subscriptions',
    description: 'High-speed encryption, unlock global geo-restricted content, streaming and gaming low ping.',
    descriptionAr: 'تشفير عالي السرعة، فتح جميع المواقع والخدمات المحجوبة بنجاح مع بينج منخفض للألعاب.',
    features: ['Ultra Fast 10Gbps Servers', 'Bypasses Censorship', 'Supports All Devices', 'Auto Re-connect Security'],
    featuresAr: ['سيرفرات فائقة السرعة', 'تجاوز الحجب والتشفير', 'يدعم جميع الأجهزة', 'ضمان ثبات الاتصال'],
    price: 190,
    originalPrice: 350,
    currency: 'EGP',
    deliveryTime: 'Instant',
    deliveryTimeAr: 'تسليم فوري',
    guarantee: '6 Month / 1 Year Warranty',
    guaranteeAr: 'ضمان 6 أشهر أو سنة',
    requirements: 'Device type (PC, iOS, Android)',
    requirementsAr: 'نوع الجهاز',
    instructions: 'Credentials generated instantly.',
    status: 'active',
    popular: false,
    badge: 'SECURE',
    icon: 'ShieldCheck'
  },

  // Gaming Services
  {
    id: 'srv-pubg-uc-topup',
    name: 'PUBG Mobile UC Official Direct Top-Up',
    nameAr: 'شحن شدات ببجي موبايل (PUBG UC) عن طريق الايدي ID',
    category: 'gaming',
    description: 'Instant official PUBG Mobile Midasbuy direct player ID top-up with bonus UC.',
    descriptionAr: 'شحن شدات ببجي عن طريق الأيدي ID مباشر ورسمي 100% مع البونص.',
    features: ['100% Official Midasbuy Partner', 'Instant Arrival', 'Includes Extra UC Bonus', 'No Login Credentials Needed'],
    featuresAr: ['شحن رسمي عن طريق ID', 'وصول فوري للعبة', 'شدات إضافية مجانية', 'بدون تسجيل دخول'],
    price: 490,
    originalPrice: 600,
    currency: 'EGP',
    deliveryTime: '1-3 Minutes',
    deliveryTimeAr: 'من 1 إلى 3 دقائق',
    guarantee: 'Official Receipt Guaranteed',
    guaranteeAr: 'إيصال شحن رسمي معتمد',
    requirements: 'PUBG Player ID (e.g., 512948102)',
    requirementsAr: 'الأيدي ID الخاص بك في اللعبة',
    instructions: 'Enter numeric Player ID in order requirements.',
    status: 'active',
    popular: true,
    badge: 'FASTEST ⚡',
    icon: 'Gamepad2'
  },
  {
    id: 'srv-freefire-roblox-giftcard',
    name: 'Roblox Robux / FreeFire Diamonds Top-Up',
    nameAr: 'شحن روبروكس Robux / جواهر فري فاير',
    category: 'gaming',
    description: 'Direct code or ID topup for Roblox gift cards, Free Fire diamonds and Steam Wallet.',
    descriptionAr: 'كروت روبروكس ورصيد ستيم وجواهر فري فاير بأسعار استثنائية.',
    features: ['Direct Code Redemption', 'Supports All Regions', 'Instant SMS/Chat Delivery', 'Genuine Codes Only'],
    featuresAr: ['أكواد تفعيل فورية', 'يدعم كافة الحسابات', 'تسليم عبر الشات فوراً', 'أكواد مضمونة 100%'],
    price: 380,
    originalPrice: 480,
    currency: 'EGP',
    deliveryTime: '2-5 Minutes',
    deliveryTimeAr: 'من 2 إلى 5 دقائق',
    guarantee: 'Replacement Guarantee on Code Error',
    guaranteeAr: 'ضمان الاستبدال في حال وجود خطأ بالرقم',
    requirements: 'Game User ID or Email',
    requirementsAr: 'الأيدي أو الإيميل',
    instructions: 'Code sent live in VENOM AI chat.',
    status: 'active',
    popular: false,
    badge: 'OFFICIAL',
    icon: 'Gift'
  },

  // Digital Solutions & Custom Development
  {
    id: 'srv-custom-bot-website',
    name: 'Custom Telegram/Discord Bot or Web Store Development',
    nameAr: 'برمجة متجر إلكتروني / بوت تليجرام أو ديسكورد مخصص',
    category: 'digital',
    description: 'Professional custom digital ecommerce website, Telegram automation bot, or custom API integration.',
    descriptionAr: 'تصميم وبرمجة مواقع المتاجر الرقمية وبوتات التليجرام والديسكورد المخصصة لحسابك.',
    features: ['Custom Admin Control Panel', 'Payment Gateways Integration', 'Modern Ultra Responsive UI', 'Hosting & Domain Setup'],
    featuresAr: ['لوحة تحكم كاملة بالعربي', 'ربط بوابات الدفع (فودافون كاش/إنستا باي)', 'تصميم عصري سريع جداً', 'استضافة ودومين مجاناً'],
    price: 2500,
    originalPrice: 3800,
    currency: 'EGP',
    deliveryTime: '24-48 Hours',
    deliveryTimeAr: 'خلال 24 إلى 48 ساعة',
    guarantee: 'Full Operational Guarantee & Tech Support',
    guaranteeAr: 'ضمان عمل كامل وتشغيل الدعم الفني',
    requirements: 'Project requirements & scope',
    requirementsAr: 'متطلبات ومواصفات المشروع',
    instructions: 'Discuss specs with VENOM AI or support team.',
    status: 'active',
    popular: true,
    badge: 'ENTERPRISE 👑',
    icon: 'Globe'
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  announcement: '🔥 أهلاً بكم في DRAGON STORE 🐉 — تسليم فوري، ضمان استبدال 100%، وأقوى الأسعار للخدمات الرقمية!',
  announcementActive: true,
  vodafoneNumber: '01041621746',
  instapayHandle: 'dragonstore@instapay',
  cibIban: 'EG3800200021000002194810291',
  usdtAddress: 'T8xNm92Kzq1P9x4Lmn2kL1902KzLpaM12',
  supportWhatsapp: '+201041621746',
  currencyRateUSD: 50.0,
  autoConfirmEnabled: false,
  pointsPerReferral: 50,
  pointsToBalanceRatio: 10 // 100 points = 10 EGP balance
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'DRAGON10',
    discountPercent: 10,
    maxUses: 500,
    usedCount: 42,
    expiresAt: '2027-12-31',
    active: true
  },
  {
    code: 'DRAGONVIP',
    discountPercent: 25,
    maxUses: 100,
    usedCount: 18,
    expiresAt: '2027-12-31',
    active: true
  },
  {
    code: 'WELCOME15',
    discountPercent: 15,
    maxUses: 1000,
    usedCount: 125,
    expiresAt: '2027-12-31',
    active: true
  }
];

export const INITIAL_SUB_ADMINS: SubAdminAccount[] = [
  {
    id: 'admin-101',
    username: 'support',
    password: 'dragon2026',
    name: 'أحمد - مشرف خدمة العملاء',
    role: 'SUPPORT_AGENT',
    createdAt: '2026-08-01',
    active: true,
    permissions: ['orders', 'chat']
  },
  {
    id: 'admin-102',
    username: 'superadmin',
    password: 'dragon2026',
    name: 'م. علي - سوبر أدمن النظام',
    role: 'SUPER_ADMIN',
    createdAt: '2026-08-01',
    active: true,
    permissions: ['orders', 'services', 'coupons', 'vip', 'wallet']
  },
  {
    id: 'admin-103',
    username: 'manager',
    password: 'dragon2026',
    name: 'م. كريم - أدمن المبيعات',
    role: 'ADMIN',
    createdAt: '2026-08-01',
    active: true,
    permissions: ['orders', 'services', 'coupons']
  }
];

export const INITIAL_VIP_ACCOUNTS: VIPAccount[] = [
  {
    id: 'vip-1',
    customerName: 'محمود العراقي',
    contact: '01019283741',
    vipLevel: 'Dragon VIP 🐉',
    discountPercent: 25,
    perks: ['خصم تلقائي 25%', 'أولوية تنفيذ فورية خلال 3 دقائق', 'شعار VIP ذهبي مخصص', 'دعم فني مباشر على مدار الساعة'],
    totalOrders: 24,
    totalSpent: 6800,
    createdAt: '2026-06-15',
    status: 'active'
  },
  {
    id: 'vip-2',
    customerName: 'سارة خالد',
    contact: '01284910293',
    vipLevel: 'Diamond 💎',
    discountPercent: 15,
    perks: ['خصم تلقائي 15%', 'أولوية التنفيذ', 'استبدال بدون أسئلة'],
    totalOrders: 11,
    totalSpent: 3200,
    createdAt: '2026-07-02',
    status: 'active'
  }
];

export const INITIAL_VIP_CODES: VIPCode[] = [
  {
    id: 'vip-code-1',
    code: 'DRAGON-VIP-100',
    discountPercent: 30,
    bonusBalance: 100,
    maxUses: 50,
    usedCount: 7,
    createdAt: '2026-08-01',
    active: true,
    descriptionAr: 'كود VIP ملكي يمنح 30% خصم + 100 جنيه رصيد هدية للمحفظة!'
  },
  {
    code: 'FIRE-2026',
    id: 'vip-code-2',
    discountPercent: 20,
    bonusBalance: 50,
    maxUses: 200,
    usedCount: 31,
    createdAt: '2026-08-01',
    active: true,
    descriptionAr: 'كود اللهب الناري خصم 20% و50 جنيه رصيد مجاني'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-101',
    name: 'أحمد محمود (المالك 👑)',
    phone: '01041621746',
    email: 'ahmed@dragon-store.app',
    balance: 5000,
    dCoins: 250000,
    senderLevel: 35,
    receiverLevel: 42,
    points: 1200,
    countryFlag: '🇪🇬',
    referralCode: 'DRAGON-772',
    vipLevel: 'Dragon VIP 🐉',
    discountPercent: 20,
    createdAt: '2026-08-01',
    receivedGifts: [
      { giftId: 'gift-1', giftName: 'تاج الدراجون الملكي 👑', giftIcon: '👑', count: 12, totalCoins: 12000, isAnimated: true },
      { giftId: 'gift-2', giftName: 'سيارة التنين السريعة 🏎️', giftIcon: '🏎️', count: 5, totalCoins: 25000, isAnimated: true },
      { giftId: 'gift-5', giftName: 'قلعة الدراجون الذهبية 🏰', giftIcon: '🏰', count: 2, totalCoins: 100000, isAnimated: true },
    ]
  },
  {
    id: 'usr-102',
    name: 'سارة خالد 🌟',
    phone: '01099887766',
    email: 'sara@dragon.app',
    balance: 1200,
    dCoins: 85000,
    senderLevel: 22,
    receiverLevel: 29,
    points: 450,
    countryFlag: '🇸🇦',
    referralCode: 'SARA-990',
    vipLevel: 'Diamond 💎',
    discountPercent: 15,
    createdAt: '2026-08-01',
    receivedGifts: [
      { giftId: 'gift-1', giftName: 'تاج الدراجون الملكي 👑', giftIcon: '👑', count: 4, totalCoins: 4000, isAnimated: true },
      { giftId: 'gift-4', giftName: 'صندوق التنين المحظوظ 🎁', giftIcon: '🎁', count: 18, totalCoins: 1800, isLucky: true }
    ]
  }
];

export const INITIAL_DEPOSITS: WalletDepositRequest[] = [
  {
    id: 'DEP-901',
    userId: 'usr-101',
    userName: 'أحمد محمود',
    userPhone: '01041621746',
    amount: 500,
    paymentMethod: 'vodafone',
    senderNumber: '01041621746',
    referenceNumber: 'VF-8829104',
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    note: 'تم شحن المحفظة بنجاح بواسطة الإدارة'
  }
];

export const INITIAL_GIFTS: GiftItem[] = [
  {
    id: 'gift-1',
    nameAr: 'تاج الدراجون الملكي 👑',
    nameEn: 'Dragon Royal Crown',
    priceCoins: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop',
    isAnimated: true,
    isLucky: false,
    category: 'luxury'
  },
  {
    id: 'gift-2',
    nameAr: 'سيارة التنين السريعة 🏎️',
    nameEn: 'Dragon Supercar',
    priceCoins: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=500&auto=format&fit=crop',
    isAnimated: true,
    isLucky: false,
    category: 'luxury'
  },
  {
    id: 'gift-3',
    nameAr: 'طائرة الدراجون الخاصة 🛩️',
    nameEn: 'Dragon Private Jet',
    priceCoins: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&auto=format&fit=crop',
    isAnimated: true,
    isLucky: false,
    category: 'luxury'
  },
  {
    id: 'gift-4',
    nameAr: 'صندوق التنين المحظوظ 🎁 (100x)',
    nameEn: 'Lucky Dragon Box (100x)',
    priceCoins: 100,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop',
    isAnimated: false,
    isLucky: true,
    category: 'lucky'
  },
  {
    id: 'gift-5',
    nameAr: 'قلعة الدراجون الذهبية 🏰',
    nameEn: 'Dragon Golden Castle',
    priceCoins: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop',
    isAnimated: true,
    isLucky: false,
    category: 'luxury'
  },
  {
    id: 'gift-6',
    nameAr: 'خاتم الألماس الملكي 💍',
    nameEn: 'Diamond Ring',
    priceCoins: 500,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop',
    isAnimated: false,
    isLucky: false,
    category: 'popular'
  },
  {
    id: 'gift-7',
    nameAr: 'قهوة الدراجون الدافئة ☕',
    nameEn: 'Dragon Coffee',
    priceCoins: 10,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
    isAnimated: false,
    isLucky: false,
    category: 'popular'
  },
  {
    id: 'gift-8',
    nameAr: 'بيضة التنين العجيبة 🥚 (200x)',
    nameEn: 'Mystery Dragon Egg (200x)',
    priceCoins: 500,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop',
    isAnimated: true,
    isLucky: true,
    category: 'lucky'
  }
];

export const INITIAL_ROOMS: LiveRoom[] = [
  {
    id: 'room-101',
    title: '🔥 سهرة الدراجون الصوتية | دردشة، ضحك وأغاني 🎙️🐉',
    category: 'voice',
    hostId: 'usr-101',
    hostName: 'أحمد محمود 👑',
    hostAvatar: '🐉',
    hostCountry: '🇪🇬',
    hostLevel: 42,
    listenersCount: 142,
    totalRoomCoins: 125000,
    backgroundTheme: 'from-amber-950/80 via-purple-950/80 to-slate-950',
    micSeats: [
      { seatIndex: 1, userId: 'usr-101', userName: 'أحمد 👑', userAvatar: '🐉', userFlag: '🇪🇬', senderLevel: 35, isSpeaking: true, totalCoinsReceived: 62000 },
      { seatIndex: 2, userId: 'usr-102', userName: 'سارة 🌟', userAvatar: '👩‍💼', userFlag: '🇸🇦', senderLevel: 22, isSpeaking: false, totalCoinsReceived: 41000 },
      { seatIndex: 3, userId: 'usr-103', userName: 'عمر ⚡', userAvatar: '😎', userFlag: '🇦🇪', senderLevel: 18, isMuted: true, totalCoinsReceived: 12000 },
      { seatIndex: 4, userId: 'usr-104', userName: 'فاطمة 💎', userAvatar: '👸', userFlag: '🇰🇼', senderLevel: 30, totalCoinsReceived: 10000 },
      { seatIndex: 5 },
      { seatIndex: 6 },
      { seatIndex: 7 },
      { seatIndex: 8 }
    ],
    messages: [
      { id: 'm1', senderId: 'usr-102', senderName: 'سارة 🌟', senderLevel: 22, senderFlag: '🇸🇦', text: 'أهلاً بالجميع في روم الدراجون! 🔥', timestamp: '20:10' },
      { id: 'm2', senderId: 'usr-103', senderName: 'عمر ⚡', senderLevel: 18, senderFlag: '🇦🇪', text: 'أقوى سهرة صوتية 🐉✨', timestamp: '20:11' },
      { id: 'm3', senderId: 'usr-101', senderName: 'أحمد 👑', senderLevel: 35, senderFlag: '🇪🇬', text: 'منورين يا شباب، استعدوا لرمي الهدايا والعاب الحظ! 🎁', timestamp: '20:12' }
    ]
  },
  {
    id: 'room-102',
    title: '⚡ بث لايف تيك توك المباشر | تحديات وعجلة الحظ 🎬',
    category: 'tiktok_live',
    hostId: 'usr-102',
    hostName: 'سارة خالد 🌟',
    hostAvatar: '👸',
    hostCountry: '🇸🇦',
    hostLevel: 29,
    listenersCount: 890,
    totalRoomCoins: 340000,
    streamVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-party-lights-and-dj-dancing-40715-large.mp4',
    micSeats: [
      { seatIndex: 1, userId: 'usr-102', userName: 'سارة 🌟', userAvatar: '👸', userFlag: '🇸🇦', senderLevel: 22, isSpeaking: true, totalCoinsReceived: 340000 }
    ],
    messages: [
      { id: 'm10', senderId: 'usr-101', senderName: 'أحمد 👑', senderLevel: 35, senderFlag: '🇪🇬', text: 'ماشاء الله لايف رائع! ❤️', timestamp: '20:15' }
    ]
  }
];

export const INITIAL_AGENCIES: Agency[] = [
  {
    id: 'agc-1',
    name: 'وكالة التنين الذهبي 🐉',
    code: 'DRAGON-GOLD',
    ownerName: 'أحمد محمود',
    ownerPhone: '01041621746',
    commissionPercent: 15,
    createdAt: '2026-08-01',
    totalHosts: 12,
    active: true
  },
  {
    id: 'agc-2',
    name: 'وكالة صقور الخليج ومصر 🦅',
    code: 'HAWK-ARAB',
    ownerName: 'سارة خالد',
    ownerPhone: '01099887766',
    commissionPercent: 12,
    createdAt: '2026-08-01',
    totalHosts: 8,
    active: true
  }
];

export const INITIAL_TARGETS: AgencyTarget[] = [
  {
    id: 'tgt-1',
    targetCoins: 50000,
    salaryEgp: 2500,
    descriptionAr: 'التارجت الفضي: جمع 50,000 عملة D = راتب 2,500 جنيه مصري 🥈'
  },
  {
    id: 'tgt-2',
    targetCoins: 100000,
    salaryEgp: 5500,
    descriptionAr: 'التارجت الذهبي: جمع 100,000 عملة D = راتب 5,500 جنيه مصري 🥇'
  },
  {
    id: 'tgt-3',
    targetCoins: 300000,
    salaryEgp: 18000,
    descriptionAr: 'التارجت الماسي: جمع 300,000 عملة D = راتب 18,000 جنيه مصري 💎'
  },
  {
    id: 'tgt-4',
    targetCoins: 1000000,
    salaryEgp: 65000,
    descriptionAr: 'تارجت التنين الملكي 🐉: جمع 1,000,000 عملة D = راتب 65,000 جنيه مصري 👑'
  }
];

export const INITIAL_DCOIN_PACKAGES: DCoinPackage[] = [
  { id: 'pkg-1', dCoinsAmount: 1000, priceEgp: 50, bonusCoins: 100, badge: 'المبتدئين' },
  { id: 'pkg-2', dCoinsAmount: 5000, priceEgp: 220, bonusCoins: 600, popular: true, badge: 'الأكثر طلباً 🔥' },
  { id: 'pkg-3', dCoinsAmount: 20000, priceEgp: 800, bonusCoins: 3000, badge: 'عروض الـ VIP 💎' },
  { id: 'pkg-4', dCoinsAmount: 100000, priceEgp: 3500, bonusCoins: 20000, badge: 'ملك التنانين 🐉' }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICKET-101',
    userId: 'usr-102',
    userName: 'سارة خالد',
    userPhone: '01099887766',
    subject: 'استفسار حول شحن رصيد عملات D واستلام التارجت',
    status: 'In Progress',
    assignedAgentName: 'الدعم الفني المباشر 🎧',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      { id: 'sm1', senderRole: 'user', senderName: 'سارة خالد', text: 'السلام عليكم، أود الاستفسار عن كيفية سحب راتب التارجت بعد الوصول إلى 100 ألف عملة؟', timestamp: '19:40' },
      { id: 'sm2', senderRole: 'agent', senderName: 'فريق الدعم 🎧', text: 'وعليكم السلام يا فندم! يمكنك التوجه لتبويب (الرواتب والوكالة) واختيار طلب سحب الراتب مباشرة وسيتم تحويله فوراً لبرقم فودافون كاش أو إنستا باي.', timestamp: '19:42' }
    ]
  }
];

export const ARAB_COUNTRIES = [
  { code: 'EG', flag: '🇪🇬', nameAr: 'مصر', nameEn: 'Egypt' },
  { code: 'SA', flag: '🇸🇦', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
  { code: 'AE', flag: '🇦🇪', nameAr: 'الإمارات', nameEn: 'UAE' },
  { code: 'KW', flag: '🇰🇼', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { code: 'QA', flag: '🇶🇦', nameAr: 'قطر', nameEn: 'Qatar' },
  { code: 'IQ', flag: '🇮🇶', nameAr: 'العراق', nameEn: 'Iraq' },
  { code: 'MA', flag: '🇲🇦', nameAr: 'المغرب', nameEn: 'Morocco' },
  { code: 'DZ', flag: '🇩🇿', nameAr: 'الجزائر', nameEn: 'Algeria' },
  { code: 'JO', flag: '🇯🇴', nameAr: 'الأردن', nameEn: 'Jordan' },
  { code: 'BH', flag: '🇧🇭', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { code: 'OM', flag: '🇴🇲', nameAr: 'عُمان', nameEn: 'Oman' },
  { code: 'LY', flag: '🇱🇾', nameAr: 'ليبيا', nameEn: 'Libya' },
  { code: 'TN', flag: '🇹🇳', nameAr: 'تونس', nameEn: 'Tunisia' },
  { code: 'SD', flag: '🇸🇩', nameAr: 'السودان', nameEn: 'Sudan' }
];


