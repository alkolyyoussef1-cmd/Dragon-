import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Upload, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Globe, 
  Zap, 
  Tag,
  ArrowRight,
  Package
} from 'lucide-react';
import { Service, PaymentMethod, Order, StoreSettings } from '../types';

interface CheckoutModalProps {
  service: Service;
  settings: StoreSettings;
  lang: 'ar' | 'en';
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  service,
  settings,
  lang,
  onClose,
  onOrderCreated,
}) => {
  const [step, setStep] = useState<'details' | 'payment_instructions' | 'proof_submitted'>('details');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [targetRequirement, setTargetRequirement] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Proof fields
  const [senderName, setSenderName] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [amountSent, setAmountSent] = useState<number | string>('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculations
  const rawTotal = service.price * quantity;
  const discountAmount = (rawTotal * appliedDiscount) / 100;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedDiscount(data.discountPercent);
        setCouponMessage({
          text: lang === 'ar' ? `تم كود الخصم بنجاح! خصم ${data.discountPercent}%` : `Promo code applied! ${data.discountPercent}% OFF`,
          success: true,
        });
      } else {
        setCouponMessage({
          text: lang === 'ar' ? 'كود الخصم غير صحيح أو منتهي' : 'Invalid or expired promo code',
          success: false,
        });
      }
    } catch (err) {
      setCouponMessage({ text: 'Error verifying coupon', success: false });
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitOrderStep1 = async () => {
    if (!customerName.trim() || !customerContact.trim() || !targetRequirement.trim()) {
      alert(lang === 'ar' ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: lang === 'ar' ? service.nameAr : service.name,
          category: service.category,
          quantity,
          totalPrice: finalTotal,
          currency: service.currency,
          customerName,
          customerContact,
          targetRequirement,
          paymentMethod,
          couponCode: appliedDiscount > 0 ? couponCode : undefined,
          estimatedDelivery: lang === 'ar' ? service.deliveryTimeAr : service.deliveryTime,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setStep('payment_instructions');
      }
    } catch (err) {
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const submitPaymentProof = async () => {
    if (!createdOrder) return;
    if (!senderNumber && !senderName) {
      alert(lang === 'ar' ? 'الرجاء إدخال الرقم الذي أرسلت منه أو اسم المحول' : 'Please enter the sender number or name');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${createdOrder.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName || customerName,
          senderNumber: senderNumber || customerContact,
          amountSent: amountSent ? Number(amountSent) : createdOrder.totalPrice,
          referenceNumber,
          screenshotUrl,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        onOrderCreated(data.order);
        setStep('proof_submitted');
      }
    } catch (err) {
      alert('Error submitting payment proof');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e1424] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 border-b border-emerald-800/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                {lang === 'ar' ? 'طلب جديد' : 'NEW ORDER'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {createdOrder ? createdOrder.id : service.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {lang === 'ar' ? service.nameAr : service.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* STEP 1: Details & Selection */}
          {step === 'details' && (
            <div className="space-y-6">
              
              {/* Service Summary Box */}
              <div className="bg-[#131a2d] rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' ? 'الضمان وزمن التسليم:' : 'Guarantee & Speed:'}
                  </p>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                    🛡 {lang === 'ar' ? service.guaranteeAr : service.guarantee} • ⚡ {lang === 'ar' ? service.deliveryTimeAr : service.deliveryTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</span>
                  <span className="text-lg font-extrabold text-white font-mono">
                    {service.price} {service.currency}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {lang === 'ar' ? 'الكمية المطلوب طلبها:' : 'Quantity:'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-extrabold text-lg font-mono bg-[#141b2e] py-2 rounded-xl border border-slate-700 text-emerald-400">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Target Requirement Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? service.requirementsAr : service.requirements} <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={targetRequirement}
                  onChange={(e) => setTargetRequirement(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل الرابط أو الإيميل أو الأيدي المطلوب...' : 'Enter account link, email, or ID...'}
                  className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none transition"
                />
              </div>

              {/* Customer Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'الاسم الكامل:' : 'Full Name:'} <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'ar' ? 'اسمك الثلاثي...' : 'Your full name...'}
                    className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'رقم الواتساب / الهاتف:' : 'WhatsApp / Contact:'} <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: 01012345678' : 'e.g. +201012345678'}
                    className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Payment Method Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {lang === 'ar' ? 'اختر طريقة الدفع المناسبة لك:' : 'Select Payment Method:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'vodafone', name: 'فودافون كاش', nameEn: 'Vodafone Cash', icon: <Smartphone className="w-4 h-4 text-rose-400" /> },
                    { id: 'instapay', name: 'إنستا باي', nameEn: 'Instapay', icon: <Zap className="w-4 h-4 text-indigo-400" /> },
                    { id: 'bank', name: 'تحويل بنكي CIB', nameEn: 'Bank CIB', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
                    { id: 'crypto', name: 'USDT / Crypto', nameEn: 'USDT TRC20', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === pm.id
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                          : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pm.icon}
                      <span>{lang === 'ar' ? pm.name : pm.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Promo Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'هل لديك كود خصم؟ (أدخل VENOM10 أو VIP20)' : 'Promo Code:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. VENOM10"
                    className="flex-1 bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs uppercase font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700"
                  >
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs mt-1 font-semibold ${couponMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation Total */}
              <div className="bg-[#141d33] rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'إجمالي المبلغ المطلوب:' : 'Total Amount:'}</span>
                  {appliedDiscount > 0 && (
                    <span className="text-xs text-emerald-400 font-semibold">
                      {lang === 'ar' ? `شامل خصم ${appliedDiscount}%` : `Includes ${appliedDiscount}% OFF`}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {finalTotal} {service.currency}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={submitOrderStep1}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'متابعة لتعليمات الدفع والتحويل' : 'Proceed to Payment Instructions'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Payment Instructions & Proof Upload */}
          {step === 'payment_instructions' && createdOrder && (
            <div className="space-y-6">
              
              <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-4 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{lang === 'ar' ? 'رقم الطلب الخاص بك:' : 'Your Order ID:'}</span>
                  <span className="font-mono text-emerald-400 font-bold text-base">{createdOrder.id}</span>
                </div>
                <p className="text-slate-300">
                  {lang === 'ar' ? 'حدد طريقة الدفع من الأعلى، ثم انسخ بيانات الحساب وأدخل تفاصيل تحويلك بالأسفل.' : 'Select payment method, copy details and confirm transfer below.'}
                </p>
              </div>

              {/* 1. Payment Method Selector (AT THE TOP) */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2">
                  {lang === 'ar' ? '١. حدد طريقة الدفع والتحويل المناسبة لك:' : '1. Select Payment Method:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'vodafone', name: 'فودافون كاش', icon: <Smartphone className="w-4 h-4 text-rose-400" /> },
                    { id: 'instapay', name: 'إنستا باي', icon: <Zap className="w-4 h-4 text-indigo-400" /> },
                    { id: 'bank', name: 'تحويل CIB', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
                    { id: 'crypto', name: 'USDT TRC20', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === pm.id
                          ? 'bg-gradient-to-br from-emerald-900/80 to-teal-950 border-emerald-400 text-white ring-2 ring-emerald-500/50 shadow-lg'
                          : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pm.icon}
                      <span>{pm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Payment Details Box per Method */}
              <div className="bg-[#131b2e] rounded-2xl p-5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'بيانات الشحن والتحويل:' : 'Payment Target Details:'}</span>
                  </h4>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                    {createdOrder.totalPrice} {createdOrder.currency}
                  </span>
                </div>

                {paymentMethod === 'vodafone' && (
                  <div className="flex items-center justify-between p-3 bg-[#0d1322] rounded-xl border border-slate-700">
                    <div>
                      <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'رقم فودافون كاش للشحن:' : 'Vodafone Cash Number:'}</span>
                      <span className="font-mono font-bold text-white text-lg">{settings.vodafoneNumber}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(settings.vodafoneNumber, 'vf')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                    >
                      {copiedField === 'vf' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'vf' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'instapay' && (
                  <div className="flex items-center justify-between p-3 bg-[#0d1322] rounded-xl border border-slate-700">
                    <div>
                      <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'عنوان إنستا باي (IPA):' : 'Instapay Handle:'}</span>
                      <span className="font-mono font-bold text-white text-base">{settings.instapayHandle}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(settings.instapayHandle, 'ip')}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-xs flex items-center gap-1 transition"
                    >
                      {copiedField === 'ip' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'ip' ? 'تم النسخ!' : 'نسخ العنوان'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="flex items-center justify-between p-3 bg-[#0d1322] rounded-xl border border-slate-700">
                    <div>
                      <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'آيبان البنك CIB:' : 'CIB IBAN:'}</span>
                      <span className="font-mono font-bold text-white text-xs">{settings.cibIban}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(settings.cibIban, 'cib')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs flex items-center gap-1 transition"
                    >
                      {copiedField === 'cib' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'cib' ? 'تم النسخ!' : 'نسخ الآيبان'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="flex items-center justify-between p-3 bg-[#0d1322] rounded-xl border border-slate-700">
                    <div className="overflow-hidden">
                      <span className="text-xs text-slate-400 block">USDT Wallet (TRC20):</span>
                      <span className="font-mono font-bold text-emerald-400 text-xs truncate block">{settings.usdtAddress}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(settings.usdtAddress, 'usdt')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-1 transition shrink-0"
                    >
                      {copiedField === 'usdt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'usdt' ? 'تم النسخ!' : 'نسخ المحفظة'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Inputs for Payment Proof as requested by user */}
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? '٢. أدخل بيانات عملية الدفع لإكمال الطلب:' : '2. Enter Payment Confirmation Details:'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* الرقم الذي أرسلت منه */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {lang === 'ar' ? 'الرقم أو الحساب الذي أرسلت منه:' : 'Sender Number / Account:'} <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: 01012345678 أو اسم المحفظة' : 'e.g. 01012345678'}
                      className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none font-mono"
                    />
                  </div>

                  {/* المبلغ المرسل */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {lang === 'ar' ? 'المبلغ المرسل:' : 'Amount Sent:'} <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amountSent !== '' ? amountSent : createdOrder.totalPrice}
                        onChange={(e) => setAmountSent(e.target.value)}
                        placeholder={`${createdOrder.totalPrice}`}
                        className="w-full bg-[#131b2e] border border-slate-700 focus:border-emerald-500 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none font-mono font-bold"
                      />
                      <span className="absolute left-3 top-3 text-xs font-bold text-emerald-400">
                        {createdOrder.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional optional ref & screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'ar' ? 'اسم المحول الكامل (اختياري):' : 'Sender Name (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={customerName}
                      className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'ar' ? 'رقم المرجع / العملية (اختياري):' : 'Reference / Trans ID (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. 98124012"
                      className="w-full bg-[#131b2e] border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Screenshot Upload Optional */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'صورة إيصال التحويل (اختياري):' : 'Receipt Screenshot (Optional):'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="w-full text-xs text-slate-400 bg-[#131b2e] p-2.5 rounded-xl border border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Prominent Confirm Payment Action Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-4 px-5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  {lang === 'ar' ? 'رجوع' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={submitPaymentProof}
                  disabled={loading}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-950/70 flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'تأكيد الدفع 🚀' : 'Confirm Payment 🚀'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'proof_submitted' && createdOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <h3 className="text-xl font-bold text-white">
                {lang === 'ar' ? 'تم تقديم إيصال الدفع وتأكيد الطلب بنجاح! 🎉' : 'Order Submitted & Payment Sent! 🎉'}
              </h3>

              <div className="bg-[#131b2e] rounded-2xl p-4 border border-slate-800 max-w-md mx-auto text-xs space-y-2 text-right">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'الحالة الحالية:' : 'Current Status:'}</span>
                  <span className="text-amber-400 font-semibold">{lang === 'ar' ? 'جاري التحقق من الدفع' : 'Payment Verification'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'ar' ? 'زمن التنفيذ المتوقع:' : 'Estimated Delivery:'}</span>
                  <span className="text-slate-200">{createdOrder.estimatedDelivery}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'يقوم فريق DRAGON STORE 🐉 الآن بمراجعة التحويل وبدء التنفيذ المباشر لطلبك. يمكنك تتبع حالة الطلب في أي وقت!'
                  : 'DRAGON STORE 🐉 team is verifying your transaction. Execution will start immediately.'}
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-lg"
                >
                  {lang === 'ar' ? 'إغلاق ومتابعة التصفح' : 'Close & Browse Store'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
