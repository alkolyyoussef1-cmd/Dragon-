import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Bot, 
  Calendar, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  lang: 'ar' | 'en';
  onAskAiWithOrder: (orderId: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ lang, onAskAiWithOrder }) => {
  const [searchId, setSearchId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrder = async (idToSearch?: string) => {
    const q = idToSearch || searchId;
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Processing':
      case 'Confirmed':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Payment Verification':
      case 'Waiting Payment':
      case 'Pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Cancelled':
      case 'Failed':
      case 'Refunded':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Waiting Payment':
        return 1;
      case 'Payment Verification':
        return 2;
      case 'Confirmed':
      case 'Processing':
        return 3;
      case 'Completed':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-emerald-950/50">
          <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
            <PackageCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white font-sans">
          {lang === 'ar' ? 'تتبع حالة طلبك في DRAGON STORE 🐉' : 'Track Your DRAGON STORE Order'}
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {lang === 'ar'
            ? 'أدخل كود الطلب الخاص بك (مثال: DRAGON-1042) لمتابعة التحديثات اللحظية ومستوى التنفيذ'
            : 'Enter your Order ID (e.g., DRAGON-1042) to track live status updates and execution progress'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0e1424] p-4 rounded-2xl border border-slate-800 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrder()}
            placeholder={lang === 'ar' ? 'أدخل كود الطلب مثل DRAGON-1042...' : 'Enter Order ID like DRAGON-1042...'}
            className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono uppercase outline-none"
          />
        </div>
        <button
          onClick={() => fetchOrder()}
          disabled={loading || !searchId.trim()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition shadow-lg shrink-0 flex items-center gap-1.5"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'بحث' : 'Track'}</span>
        </button>
      </div>

      {/* Results */}
      {searched && orders.length === 0 && !loading && (
        <div className="text-center py-12 bg-[#0e1424] rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="font-bold text-slate-300">
            {lang === 'ar' ? 'لم نجد أي طلب بهذا الكود' : 'No order found with this ID'}
          </p>
          <p className="text-[11px] text-slate-500">
            {lang === 'ar' ? 'تأكد من كتابة الكود الصحيح (مثال: DRAGON-1042) أو تواصل مع الدعم الفني' : 'Double check your Order ID or chat with DRAGON AI'}
          </p>
        </div>
      )}

      {orders.map((order) => {
        const currentStep = getStatusStep(order.status);
        return (
          <div
            key={order.id}
            className="bg-[#0e1424] rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl"
          >
            {/* Top Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-white font-mono">{order.id}</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {order.serviceName} • {order.quantity}x ({order.totalPrice} {order.currency})
                </p>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'زمن التسليم المتوقع:' : 'Est. Delivery:'} {order.estimatedDelivery}</span>
              </div>
            </div>

            {/* Visual Progress Steps */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                <div className={`space-y-1 ${currentStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold font-mono text-xs ${currentStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    1
                  </div>
                  <span>{lang === 'ar' ? 'إنشاء الطلب' : 'Created'}</span>
                </div>

                <div className={`space-y-1 ${currentStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold font-mono text-xs ${currentStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    2
                  </div>
                  <span>{lang === 'ar' ? 'التحقق من الدفع' : 'Payment Check'}</span>
                </div>

                <div className={`space-y-1 ${currentStep >= 3 ? 'text-[#00e5ff]' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold font-mono text-xs ${currentStep >= 3 ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    3
                  </div>
                  <span>{lang === 'ar' ? 'جاري التنفيذ' : 'Processing'}</span>
                </div>

                <div className={`space-y-1 ${currentStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold font-mono text-xs ${currentStep >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    4
                  </div>
                  <span>{lang === 'ar' ? 'اكتمال الخدمة' : 'Completed'}</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#131b2e] p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">{lang === 'ar' ? 'بيانات الحساب / الرابط المطلوبة:' : 'Target Link/Email:'}</span>
                <span className="text-white font-mono font-bold">{order.targetRequirement}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                <span className="text-emerald-400 font-semibold uppercase">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Admin Notes Timeline */}
            {order.notes && order.notes.length > 0 && (
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'سجل تحديثات الطلب:' : 'Order Activity Log:'}</span>
                </h4>
                <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/30">
                  {order.notes.map((note, nIdx) => (
                    <p key={nIdx} className="text-[11px] text-slate-300 bg-[#131a2c] p-2.5 rounded-xl border border-slate-800">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onAskAiWithOrder(order.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'استفسر من DRAGON AI عن هذا الطلب' : 'Ask DRAGON AI about this order'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
