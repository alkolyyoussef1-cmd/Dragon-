import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  RefreshCw,
  Eye,
  X,
  Settings,
  Tag,
  Crown,
  UserCheck,
  Bot,
  Sparkles,
  CreditCard,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Order, Service, StoreSettings, AdminRole, OrderStatus, SubAdminAccount, VIPAccount, WalletDepositRequest, VIPCode } from '../types';

interface AdminPortalProps {
  services: Service[];
  settings: StoreSettings;
  lang: 'ar' | 'en';
  onUpdateServices: () => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  services,
  settings,
  lang,
  onUpdateServices,
  onUpdateSettings,
}) => {
  // Auth State
  const [loginTab, setLoginTab] = useState<'owner' | 'sub'>('owner');
  const [pinInput, setPinInput] = useState('');
  const [subUsername, setSubUsername] = useState('');
  const [subPassword, setSubPassword] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN' | 'SUPPORT_AGENT'>('OWNER');
  const [currentAccountName, setCurrentAccountName] = useState('المالك الرئيسي');

  // Owner/Admin Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'deposits' | 'sub_admins' | 'vip_users' | 'vip_codes' | 'services' | 'settings' | 'ai_tool'>('orders');

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [subAdmins, setSubAdmins] = useState<SubAdminAccount[]>([]);
  const [vipUsers, setVipUsers] = useState<VIPAccount[]>([]);
  const [walletDeposits, setWalletDeposits] = useState<WalletDepositRequest[]>([]);
  const [vipCodes, setVipCodes] = useState<VIPCode[]>([]);

  // New VIP Code Modal State
  const [newVipCodeModal, setNewVipCodeModal] = useState(false);
  const [newVipCodeForm, setNewVipCodeForm] = useState({
    code: '',
    discountPercent: 20,
    bonusBalance: 50,
    maxUses: 100,
    descriptionAr: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Inspection Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNoteInput, setStatusNoteInput] = useState('');

  // Service Edit/Add Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({
    name: '',
    nameAr: '',
    category: 'ai',
    description: '',
    descriptionAr: '',
    features: ['Instant Access'],
    featuresAr: ['وصول فوري'],
    price: 300,
    currency: 'EGP',
    deliveryTime: '5-15 Mins',
    deliveryTimeAr: 'من 5 إلى 15 دقيقة',
    guarantee: '30 Days Warranty',
    guaranteeAr: 'ضمان 30 يوماً',
    requirements: 'Email address',
    requirementsAr: 'عنوان الإيميل',
    instructions: 'Follow instructions',
    status: 'active',
  });

  // New Sub-Admin Form State
  const [newAdminModal, setNewAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'SUPPORT_AGENT' as AdminRole,
  });

  // New VIP Account Form State
  const [newVipModal, setNewVipModal] = useState(false);
  const [newVipForm, setNewVipForm] = useState({
    customerName: '',
    contact: '',
    vipLevel: 'Dragon VIP 🐉',
    discountPercent: 20,
  });

  // Owner AI Tool State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // Fetching Data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const res = await fetch('/api/admin/sub-admins');
      const data = await res.json();
      setSubAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching sub admins:', err);
    }
  };

  const fetchVipUsers = async () => {
    try {
      const res = await fetch('/api/admin/vip-users');
      const data = await res.json();
      setVipUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching VIP users:', err);
    }
  };

  const fetchWalletDeposits = async () => {
    try {
      const res = await fetch('/api/wallet/deposits');
      const data = await res.json();
      setWalletDeposits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching deposits:', err);
    }
  };

  const fetchVipCodes = async () => {
    try {
      const res = await fetch('/api/vip-codes');
      const data = await res.json();
      setVipCodes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching VIP codes:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchWalletDeposits();
      fetchVipCodes();
      if (userRole === 'OWNER' || userRole === 'SUPER_ADMIN') {
        fetchSubAdmins();
        fetchVipUsers();
      }
    }
  }, [isAuthenticated, userRole]);

  const handleApproveDeposit = async (id: string) => {
    try {
      const res = await fetch(`/api/wallet/deposits/${id}/approve`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        alert(`تمت الموافقة على طلب الشحن! تم إضافة ${data.deposit.amount} جنيه لرصيد العميل ${data.deposit.userName} 🐉`);
        fetchWalletDeposits();
      } else {
        alert(data.error || 'فشلت عملية الموافقة');
      }
    } catch (err) {
      alert('حدث خطأ أثناء الاتصال بالسيرفر');
    }
  };

  const handleRejectDeposit = async (id: string) => {
    const note = prompt('أدخل سبب رفض طلب الشحن (اختياري):');
    try {
      const res = await fetch(`/api/wallet/deposits/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم رفض طلب الشحن');
        fetchWalletDeposits();
      }
    } catch (err) {
      alert('خطأ أثناء الرفض');
    }
  };

  const handleCreateVipCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVipCodeForm.code) {
      alert('يرجى إدخال كود VIP');
      return;
    }

    try {
      const res = await fetch('/api/vip-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVipCodeForm),
      });
      const data = await res.json();
      if (data.success) {
        setNewVipCodeModal(false);
        setNewVipCodeForm({ code: '', discountPercent: 20, bonusBalance: 50, maxUses: 100, descriptionAr: '' });
        fetchVipCodes();
        alert('تم إنشاء كود VIP الجديد بنجاح! 👑');
      } else {
        alert(data.error || 'تعذر إنشاء الكود');
      }
    } catch (err) {
      alert('خطأ أثناء إنشاء الكود');
    }
  };

  const handleDeleteVipCode = async (id: string) => {
    if (!confirm('هل أنت متاكد من حذف كود VIP هذا؟')) return;
    try {
      await fetch(`/api/vip-codes/${id}`, { method: 'DELETE' });
      fetchVipCodes();
    } catch (err) {
      alert('خطأ أثناء حذف الكود');
    }
  };

  // Login Handlers
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/owner-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (data.success && data.role === 'OWNER') {
        setIsAuthenticated(true);
        setUserRole('OWNER');
        setCurrentAccountName('مالك DRAGON STORE (الرئيسي)');
      } else {
        alert(data.error || 'رمز المالك غير صحيح!');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالسيرفر');
    }
  };

  const handleSubLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/sub-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: subUsername, password: subPassword }),
      });
      const data = await res.json();
      if (data.success && data.account) {
        setIsAuthenticated(true);
        setUserRole(data.role || 'SUPPORT_AGENT');
        setCurrentAccountName(data.account.name || subUsername);
      } else {
        alert(data.error || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      alert('خطأ في تسجيل الدخول للمشرفين');
    }
  };

  // Status updates
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: statusNoteInput.trim() || `تحديث الحالة إلى ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setStatusNoteInput('');
        fetchOrders();
      }
    } catch (err) {
      alert('خطأ أثناء تحديث حالة الطلب');
    }
  };

  // Save Service
  const saveService = async () => {
    if (!editingService.name || !editingService.nameAr || !editingService.price) {
      alert('يرجى إكمال الحقول الأساسية للخدمة');
      return;
    }

    try {
      const isEdit = !!editingService.id;
      const url = isEdit ? `/api/services/${editingService.id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      const data = await res.json();
      if (data.success) {
        setServiceModalOpen(false);
        onUpdateServices();
      }
    } catch (err) {
      alert('خطأ أثناء حفظ الخدمة');
    }
  };

  // Save Store Settings
  const saveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(settingsForm);
        alert('تم حفظ إعدادات المتجر وطرق الدفع بنجاح! 🐉');
      }
    } catch (err) {
      alert('خطأ أثناء حفظ الإعدادات');
    }
  };

  // Add Sub Admin
  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.username || !newAdminForm.password || !newAdminForm.name) {
      alert('يرجى ملء جميع حقول المشرف');
      return;
    }

    try {
      const res = await fetch('/api/admin/sub-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdminForm),
      });
      const data = await res.json();
      if (data.success) {
        setNewAdminModal(false);
        setNewAdminForm({ name: '', username: '', password: '', role: 'SUPPORT_AGENT' });
        fetchSubAdmins();
        alert('تم إنشاء حساب المشرف بنجاح! 🛡');
      } else {
        alert(data.error || 'تعذر إنشاء الحساب');
      }
    } catch (err) {
      alert('خطأ أثناء إنشاء حساب المشرف');
    }
  };

  const handleDeleteSubAdmin = async (id: string) => {
    if (!confirm('هل أنت تأكد من حذف حساب المشرف هذا؟')) return;
    try {
      await fetch(`/api/admin/sub-admins/${id}`, { method: 'DELETE' });
      fetchSubAdmins();
    } catch (err) {
      alert('خطأ أثناء الحذف');
    }
  };

  // Add VIP Account
  const handleCreateVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVipForm.customerName || !newVipForm.contact) {
      alert('اسم العميل ورقم التواصل مطلوبين');
      return;
    }

    try {
      const res = await fetch('/api/admin/vip-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVipForm),
      });
      const data = await res.json();
      if (data.success) {
        setNewVipModal(false);
        setNewVipForm({ customerName: '', contact: '', vipLevel: 'Dragon VIP 🐉', discountPercent: 20 });
        fetchVipUsers();
        alert('تم إضافة العميل لنظام الـ VIP بنجاح! 👑');
      } else {
        alert(data.error || 'تعذر إضافة العميل');
      }
    } catch (err) {
      alert('خطأ في الإضافة');
    }
  };

  const handleDeleteVip = async (id: string) => {
    if (!confirm('هل تريد حذف هذا العميل من القائمة الذهبية؟')) return;
    try {
      await fetch(`/api/admin/vip-users/${id}`, { method: 'DELETE' });
      fetchVipUsers();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };

  // Run Owner AI Tool Prompt
  const handleRunAiTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('/api/admin/owner-ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      setAiResponse(data.reply || 'تم تنفيذ الطلب بنجاح.');
    } catch (err) {
      setAiResponse('حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.paymentProof?.senderNumber && o.paymentProof.senderNumber.includes(searchQuery));
    
    if (selectedStatus === 'all') return matchesSearch;
    return matchesSearch && o.status === selectedStatus;
  });

  // Analytics Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === 'Completed' || o.status === 'Confirmed' ? o.totalPrice : 0), 0);
  const pendingPaymentProofs = orders.filter((o) => o.status === 'Payment Verification' || o.status === 'Waiting Payment').length;
  const activeOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Confirmed').length;

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-900/50 mx-auto">
              <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-2xl">
                🐉
              </div>
            </div>
            <h2 className="text-xl font-black text-white tracking-wider">
              DRAGON STORE <span className="text-emerald-400">ADMIN CONTROL</span>
            </h2>
            <p className="text-xs text-slate-400">
              لوحة التحكم والإدارة المركزية - متجر الدراجون الرسمي
            </p>
          </div>

          {/* Toggle Login Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#131b2e] rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setLoginTab('owner')}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                loginTab === 'owner'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>لوحة المالك (Owner)</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginTab('sub')}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                loginTab === 'sub'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة المشرفين (Admins)</span>
            </button>
          </div>

          {/* OWNER LOGIN FORM */}
          {loginTab === 'owner' && (
            <form onSubmit={handleOwnerLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>رمز أمان المالك (Owner Secret PIN):</span>
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="أدخل الرمز الخاص بالمالك..."
                  className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-2xl px-4 py-3 text-sm outline-none font-mono text-center tracking-widest text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <span>دخول لوحة المالك الرئيسية 👑</span>
              </button>
            </form>
          )}

          {/* SUB ADMIN LOGIN FORM */}
          {loginTab === 'sub' && (
            <form onSubmit={handleSubLogin} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم:</label>
                <input
                  type="text"
                  value={subUsername}
                  onChange={(e) => setSubUsername(e.target.value)}
                  placeholder="اسم المستخدم للمشرف..."
                  className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور:</label>
                <input
                  type="password"
                  value={subPassword}
                  onChange={(e) => setSubPassword(e.target.value)}
                  placeholder="كلمة المرور..."
                  className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 mt-2"
              >
                <span>تسجيل دخول المشرف 🛡</span>
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto my-6 px-4 space-y-6">
      
      {/* Top Welcome Bar */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#111c33] to-[#0b0f19] rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
            🐉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                DRAGON CONTROL PANEL
              </h2>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                userRole === 'OWNER' 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {userRole === 'OWNER' ? '👑 OWNER / المالك' : '🛡 ADMIN / مشرف'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مرحباً بك، <strong className="text-emerald-400">{currentAccountName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>تحديث البيانات</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold border border-rose-800/40 transition"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e1424] rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">إجمالي إيرادات المتجر:</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">{totalRevenue} EGP</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e1424] rounded-2xl p-4 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">طلبات بإنتظار مراجعة التحويل:</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block">{pendingPaymentProofs} طلب</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e1424] rounded-2xl p-4 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">طلبات قيد التنفيذ المباشر:</span>
            <span className="text-2xl font-black text-indigo-400 font-mono mt-0.5 block">{activeOrdersCount} طلب</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
              : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>الطلبات والإثباتات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'deposits'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold shadow-lg'
              : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>طلبات شحن المحفظة ({walletDeposits.filter(d => d.status === 'Pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vip_codes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'vip_codes'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold shadow-lg'
              : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-300" />
          <span>أكواد VIP والخصومات ({vipCodes.length})</span>
        </button>

        {(userRole === 'OWNER' || userRole === 'SUPER_ADMIN') && (
          <>
            <button
              onClick={() => setActiveTab('sub_admins')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === 'sub_admins'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
                  : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>إدارة المشرفين ({subAdmins.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vip_users')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === 'vip_users'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
                  : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>عملاء VIP ({vipUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
                  : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>إدارة الخدمات ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
                  : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>طرق الدفع والإعلانات</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_tool')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === 'ai_tool'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-extrabold shadow-lg'
                  : 'bg-[#0e1424] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>مساعد المالك الذكي 🤖</span>
            </button>
          </>
        )}
      </div>

      {/* TAB 1: ORDERS & PAYMENT PROOFS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Controls Search & Filter */}
          <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
                className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl pr-9 pl-4 py-2 text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#131b2e] border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="Waiting Payment">بإنتظار الدفع</option>
                <option value="Payment Verification">مراجعة إيصال التحويل</option>
                <option value="Confirmed">تم تأكيد التحويل</option>
                <option value="Processing">جاري التنفيذ المباشر</option>
                <option value="Completed">مكتمل بنجاح</option>
                <option value="Cancelled">ملغي</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-slate-400 text-sm">لا توجد طلبات تطابق بحثك حالياً</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#131b2e] text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">رقم الطلب</th>
                      <th className="p-4">العميل والتواصل</th>
                      <th className="p-4">الخدمة والمطلوب</th>
                      <th className="p-4">طريقة وتفاصيل الدفع</th>
                      <th className="p-4">الرقم المأخوذ منه والمبلغ</th>
                      <th className="p-4">الحالة والتحديث</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 font-mono font-bold text-emerald-400">{order.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.customerContact}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{order.serviceName}</div>
                          <div className="text-[11px] text-amber-300 font-mono truncate max-w-[150px]">{order.targetRequirement}</div>
                        </td>
                        <td className="p-4">
                          <span className="uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">{order.paymentProof?.senderNumber || order.paymentProof?.senderName || 'لم يدخل بعد'}</div>
                          <div className="text-emerald-400 font-bold">{order.paymentProof?.amountSent || order.totalPrice} {order.currency}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-block ${
                            order.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            order.status === 'Processing' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            order.status === 'Confirmed' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            order.status === 'Payment Verification' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-bold flex items-center justify-center gap-1 mx-auto transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة وتأكيد</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WALLET DEPOSITS APPROVAL */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>مراجعة وإعتماد طلبات شحن المحفظة (فودافون كاش / إنستا باي)</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">
              {walletDeposits.filter((d) => d.status === 'Pending').length} طلبات بإنتظار التفعيل
            </span>
          </div>

          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            {walletDeposits.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">لا توجد طلبات إيداع في الوقت الحالي</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#131b2e] text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">كود الطلب</th>
                      <th className="p-4">العميل والهاتف</th>
                      <th className="p-4">طريقة التحويل</th>
                      <th className="p-4">المبلغ والمرسل</th>
                      <th className="p-4">الرقم المرجعي</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">الإجراء المباشر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {walletDeposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 font-mono font-bold text-amber-400">{dep.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{dep.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{dep.userPhone}</div>
                        </td>
                        <td className="p-4">
                          <span className="uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {dep.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="font-extrabold text-amber-400 text-sm">{dep.amount} EGP</div>
                          <div className="text-[11px] text-slate-400">من: {dep.senderNumber}</div>
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {dep.referenceNumber || 'بدون'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-block ${
                              dep.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : dep.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            {dep.status === 'Approved' ? 'تم الشحن ✅' : dep.status === 'Rejected' ? 'مرفوض ❌' : 'قيد المراجعة ⏳'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {dep.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApproveDeposit(dep.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] shadow transition"
                              >
                                إعتماد وإضافة الرصيد ✅
                              </button>
                              <button
                                onClick={() => handleRejectDeposit(dep.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-[11px] border border-rose-800 transition"
                              >
                                رفض
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">تم الاتخاذ</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VIP CODES & PROMOS */}
      {activeTab === 'vip_codes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>إدارة أكواد الخصوم والـ VIP والمكافآت</span>
            </h3>

            <button
              onClick={() => setNewVipCodeModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء كود VIP جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vipCodes.map((c) => (
              <div key={c.id} className="bg-[#0e1424] p-5 rounded-3xl border border-amber-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                    {c.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    خصم {c.discountPercent}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{c.descriptionAr || 'كود خصم VIP مخصص'}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#131b2e] p-2.5 rounded-xl text-slate-300 font-mono">
                  <div>هدية المحفظة: <strong className="text-amber-400">{c.bonusBalance} EGP</strong></div>
                  <div>الاستخدامات: <strong className="text-emerald-400">{c.usedCount}/{c.maxUses}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold">كود فعال ⚡</span>
                  <button
                    onClick={() => handleDeleteVipCode(c.id)}
                    className="p-1.5 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUB-ADMINS MANAGEMENT */}
      {activeTab === 'sub_admins' && (userRole === 'OWNER' || userRole === 'SUPER_ADMIN') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>إدارة حسابات المشرفين وخدمة العملاء</span>
            </h3>

            <button
              onClick={() => setNewAdminModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء حساب مشرف جديد</span>
            </button>
          </div>

          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subAdmins.map((admin) => (
                <div key={admin.id} className="bg-[#131b2e] p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">@{admin.username}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {admin.role}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{admin.name}</h4>
                    <p className="text-[11px] text-slate-400">تاريخ الإنشاء: {admin.createdAt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-semibold">حساب نشط ⚡</span>
                    <button
                      onClick={() => handleDeleteSubAdmin(admin.id)}
                      className="p-1.5 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIP USERS MANAGEMENT */}
      {activeTab === 'vip_users' && userRole === 'OWNER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>إدارة قائمة العملاء VIP والخصومات التلقائية</span>
            </h3>

            <button
              onClick={() => setNewVipModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عميل VIP جديد</span>
            </button>
          </div>

          <div className="bg-[#0e1424] rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vipUsers.map((vip) => (
                <div key={vip.id} className="bg-[#131b2e] p-4 rounded-2xl border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-xs flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>{vip.vipLevel}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      خصم {vip.discountPercent}%
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{vip.customerName}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{vip.contact}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400">إجمالي الطلبات: {vip.totalOrders}</span>
                    <button
                      onClick={() => handleDeleteVip(vip.id)}
                      className="p-1.5 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeTab === 'services' && userRole === 'OWNER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              <span>تعديل وإضافة خدمات المتجر الرقمية</span>
            </h3>

            <button
              onClick={() => {
                setEditingService({
                  name: '',
                  nameAr: '',
                  category: 'ai',
                  description: '',
                  descriptionAr: '',
                  features: ['Instant Delivery'],
                  featuresAr: ['تسليم فوري'],
                  price: 250,
                  currency: 'EGP',
                  deliveryTime: '5 Mins',
                  deliveryTimeAr: '5 دقائق',
                  guarantee: '30 Days',
                  guaranteeAr: 'ضمان 30 يوم',
                  requirements: 'Target Account',
                  requirementsAr: 'الحساب المطلوب',
                  instructions: 'Direct delivery',
                  status: 'active',
                });
                setServiceModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خدمة جديدة للمتجر</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{s.nameAr}</h4>
                  <p className="text-xs font-mono text-emerald-400 font-bold">{s.price} {s.currency}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingService(s);
                    setServiceModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENT GATEWAYS & SETTINGS */}
      {activeTab === 'settings' && userRole === 'OWNER' && (
        <div className="bg-[#0e1424] rounded-3xl border border-slate-800 p-6 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            تحديث وسائل الدفع والشحن المباشر
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">شريط التنبيهات العلوي للمتجر:</label>
              <input
                type="text"
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم فودافون كاش:</label>
                <input
                  type="text"
                  value={settingsForm.vodafoneNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, vodafoneNumber: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-3 py-2 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان إنستا باي (IPA):</label>
                <input
                  type="text"
                  value={settingsForm.instapayHandle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instapayHandle: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-3 py-2 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">آيبان بنك CIB:</label>
              <input
                type="text"
                value={settingsForm.cibIban}
                onChange={(e) => setSettingsForm({ ...settingsForm, cibIban: e.target.value })}
                className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-3 py-2 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">USDT TRC20 Wallet:</label>
              <input
                type="text"
                value={settingsForm.usdtAddress}
                onChange={(e) => setSettingsForm({ ...settingsForm, usdtAddress: e.target.value })}
                className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-3 py-2 outline-none font-mono text-emerald-400"
              />
            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs transition shadow-lg mt-4"
            >
              حفظ طرق الدفع والإعدادات 🐉
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: OWNER AI TOOL */}
      {activeTab === 'ai_tool' && userRole === 'OWNER' && (
        <div className="bg-[#0e1424] rounded-3xl border border-emerald-500/30 p-6 space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h3 className="text-base font-bold text-white">مساعد المالك الذكي (DRAGON OWNER AI ASSISTANT)</h3>
              <p className="text-xs text-slate-400">توليد وصياغة الخدمات، الإعلانات، والعروض التسويقية الذكية للمتجر</p>
            </div>
          </div>

          <form onSubmit={handleRunAiTool} className="space-y-3">
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="مثال: اكتب لي وصف تسويقي جذاب لخدمة شحن شدات ببجي مع عرض خصم لفترة محدودة..."
              className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-2xl p-4 text-xs outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiLoading ? 'جاري توليد الرد...' : 'توليد الاستجابة بالذكاء الاصطناعي'}</span>
            </button>
          </form>

          {aiResponse && (
            <div className="mt-4 p-4 bg-[#131b2e] rounded-2xl border border-cyan-500/30 text-xs leading-relaxed space-y-2 text-slate-200">
              <span className="font-bold text-cyan-400 block">نتيجة التوليد:</span>
              <div className="whitespace-pre-wrap font-sans">{aiResponse}</div>
            </div>
          )}
        </div>
      )}

      {/* INSPECTION & PROOF VERIFICATION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">{selectedOrder.id} - تفاصيل وإثبات الطلب</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#131b2e] p-3 rounded-xl border border-slate-800 space-y-1">
                <p><span className="text-slate-400">العميل:</span> <strong className="text-white">{selectedOrder.customerName}</strong> ({selectedOrder.customerContact})</p>
                <p><span className="text-slate-400">الخدمة:</span> <strong className="text-emerald-400">{selectedOrder.serviceName}</strong></p>
                <p><span className="text-slate-400">المطلوب للتنفيذ:</span> <strong className="text-amber-300 font-mono">{selectedOrder.targetRequirement}</strong></p>
                <p><span className="text-slate-400">المبلغ وطريقة التحويل:</span> <strong className="text-white font-mono">{selectedOrder.totalPrice} {selectedOrder.currency}</strong> ({selectedOrder.paymentMethod})</p>
              </div>

              {/* Payment Proof Block */}
              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 space-y-2">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تفاصيل إيصال الدفع المرسلة من العميل:</span>
                </p>
                <p><span className="text-slate-400">الرقم/الحساب المأخوذ منه:</span> <strong className="text-white font-mono">{selectedOrder.paymentProof?.senderNumber || selectedOrder.paymentProof?.senderName || 'غير مدخل'}</strong></p>
                <p><span className="text-slate-400">المبلغ المرسل:</span> <strong className="text-emerald-300 font-mono font-bold">{selectedOrder.paymentProof?.amountSent || selectedOrder.totalPrice} {selectedOrder.currency}</strong></p>
                <p><span className="text-slate-400">رقم المرجع/العملية:</span> <strong className="text-slate-200 font-mono">{selectedOrder.paymentProof?.referenceNumber || 'بدون مرجع'}</strong></p>
                
                {selectedOrder.paymentProof?.screenshotUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1">صورة إيصال التحويل:</span>
                    <img src={selectedOrder.paymentProof.screenshotUrl} alt="Receipt" className="max-h-56 rounded-xl border border-emerald-500/40 object-cover w-full" />
                  </div>
                )}
              </div>

              {/* Status Update Controls */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="block font-bold text-slate-300">تحديث حالة الطلب وإضافة ملاحظة:</label>
                <input
                  type="text"
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  placeholder="ملاحظة إضافية للعميل عند تتبع الطلب..."
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none"
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Confirmed')}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs"
                  >
                    تأكيد الدفع 💳
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                    className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs"
                  >
                    بدء التنفيذ ⚡
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    إكمال الطلب 🎉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUB ADMIN MODAL */}
      {newAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إنشاء حساب مشرف جديد</h3>
              <button onClick={() => setNewAdminModal(false)} className="p-1 rounded bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="مثال: أحمد مشرف المبيعات"
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">اسم المستخدم (Username):</label>
                <input
                  type="text"
                  value={newAdminForm.username}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                  placeholder="e.g. ahmed_sales"
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">كلمة المرور:</label>
                <input
                  type="password"
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="كلمة مرور حصرية..."
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs transition shadow-lg mt-2"
              >
                حفظ الحساب 🛡
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE VIP ACCOUNT MODAL */}
      {newVipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1424] border border-amber-500/30 rounded-3xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-1.5">
                <Crown className="w-5 h-5" />
                <span>إضافة عميل VIP جديد</span>
              </h3>
              <button onClick={() => setNewVipModal(false)} className="p-1 rounded bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVip} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم العميل VIP:</label>
                <input
                  type="text"
                  value={newVipForm.customerName}
                  onChange={(e) => setNewVipForm({ ...newVipForm, customerName: e.target.value })}
                  placeholder="اسم العميل المميز..."
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">رقم الهاتف / الواتساب:</label>
                <input
                  type="text"
                  value={newVipForm.contact}
                  onChange={(e) => setNewVipForm({ ...newVipForm, contact: e.target.value })}
                  placeholder="01012345678"
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">نسبة الخصم التلقائي (%):</label>
                <input
                  type="number"
                  value={newVipForm.discountPercent}
                  onChange={(e) => setNewVipForm({ ...newVipForm, discountPercent: Number(e.target.value) })}
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs transition shadow-lg mt-2"
              >
                إضافة العميل VIP 👑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW VIP CODE MODAL */}
      {newVipCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#0e1424] border border-amber-500/30 rounded-3xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>إنشاء كود VIP خصم وهدية</span>
              </h3>
              <button onClick={() => setNewVipCodeModal(false)} className="p-1 rounded bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVipCode} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">كود الخصم (رمز كود الـ VIP):</label>
                <input
                  type="text"
                  required
                  value={newVipCodeForm.code}
                  onChange={(e) => setNewVipCodeForm({ ...newVipCodeForm, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: DRAGON-VIP-100"
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-amber-300 font-mono font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">نسبة الخصم (%):</label>
                  <input
                    type="number"
                    value={newVipCodeForm.discountPercent}
                    onChange={(e) => setNewVipCodeForm({ ...newVipCodeForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">هدية رصيد (EGP):</label>
                  <input
                    type="number"
                    value={newVipCodeForm.bonusBalance}
                    onChange={(e) => setNewVipCodeForm({ ...newVipCodeForm, bonusBalance: Number(e.target.value) })}
                    className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">أقصى عدد لاستخدام الكود:</label>
                <input
                  type="number"
                  value={newVipCodeForm.maxUses}
                  onChange={(e) => setNewVipCodeForm({ ...newVipCodeForm, maxUses: Number(e.target.value) })}
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">وصف الكود بالعربي:</label>
                <input
                  type="text"
                  value={newVipCodeForm.descriptionAr}
                  onChange={(e) => setNewVipCodeForm({ ...newVipCodeForm, descriptionAr: e.target.value })}
                  placeholder="مثال: كود خصم خاص 20% وهدية 50 جنيه لرصيد المحفظة"
                  className="w-full bg-[#131b2e] border border-slate-700 p-2.5 text-xs rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs transition shadow-lg mt-2"
              >
                حفظ وإنشاء الكود 👑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE EDIT MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h3>
              <button onClick={() => setServiceModalOpen(false)} className="p-1 rounded bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم الخدمة (عربي):</label>
                <input
                  type="text"
                  value={editingService.nameAr || ''}
                  onChange={(e) => setEditingService({ ...editingService, nameAr: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 p-2 text-xs rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Service Name (English):</label>
                <input
                  type="text"
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 p-2 text-xs rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">السعر (EGP):</label>
                  <input
                    type="number"
                    value={editingService.price || 0}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-[#131b2e] border border-slate-700 p-2 text-xs rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">القسم:</label>
                  <select
                    value={editingService.category || 'ai'}
                    onChange={(e: any) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full bg-[#131b2e] border border-slate-700 p-2 text-xs rounded-xl text-white"
                  >
                    <option value="ai">الذكاء الاصطناعي</option>
                    <option value="social">السوشيال ميديا</option>
                    <option value="whatsapp">الواتساب والأرقام</option>
                    <option value="subscriptions">الاشتراكات</option>
                    <option value="gaming">الألعاب والكروت</option>
                    <option value="digital">الخدمات الرقمية</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={saveService}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs transition shadow-lg mt-2"
              >
                حفظ الخدمة 🐉
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
