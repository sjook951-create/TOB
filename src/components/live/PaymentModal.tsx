import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, QrCode, Smartphone, 
  RefreshCw, Copy, Check, Receipt, ExternalLink, Info,
  Sparkles, CreditCard, Globe, Lock, Wallet, Printer,
  ArrowRight, Shield
} from 'lucide-react';
import { BookingItem } from '../../data/liveData';

export type PaymentMethodType = 'paypal' | 'alipay' | 'wechat';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  defaultBookingId?: string;
  onPaymentSuccess?: (paymentInfo: {
    method: PaymentMethodType;
    amountKrw: number;
    amountCny: number;
    amountUsd: number;
    orderId: string;
    txId: string;
    bookingId?: string;
    payerEmail?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookings,
  defaultBookingId,
  onPaymentSuccess,
}) => {
  // Active payment method: defaults to paypal as requested
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('paypal');
  
  // PayPal sub-modes: 'express' (One-Touch yellow button) | 'card' (Guest credit/debit card) | 'qr' (PayPal App scan)
  const [paypalSubMode, setPaypalSubMode] = useState<'express' | 'card' | 'qr'>('express');
  const [paypalFundingSource, setPaypalFundingSource] = useState<'balance' | 'chase_card' | 'bank'>('balance');
  const [paypalEmail, setPaypalEmail] = useState<string>('buyer@global-wedding.com');
  
  // Credit card form state for PayPal card checkout
  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: 'JINWOO KIM',
    expiry: '08/28',
    cvv: '882',
    country: 'South Korea (KR)',
    postalCode: '06015',
  });

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    defaultBookingId || (bookings.length > 0 ? bookings[0].id : '')
  );
  const [paymentType, setPaymentType] = useState<'fitting' | 'rental' | 'custom'>('fitting');
  const [customAmountKrw, setCustomAmountKrw] = useState<number>(50000);
  
  // Payment step: 'select' -> 'processing' -> 'success'
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes
  const [copied, setCopied] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [completedTxId, setCompletedTxId] = useState<string>('');
  const [isProcessingApi, setIsProcessingApi] = useState<boolean>(false);

  // Currency Exchange Rates (Base: KRW)
  const exchangeRateCny = 188; // 1 CNY = 188 KRW
  const exchangeRateUsd = 1340; // 1 USD = 1,340 KRW

  const getAmountKrw = () => {
    if (paymentType === 'fitting') return 50000;
    if (paymentType === 'rental') return 500000;
    return customAmountKrw;
  };

  const amountKrw = getAmountKrw();
  const amountCny = (amountKrw / exchangeRateCny).toFixed(2);
  const amountUsd = (amountKrw / exchangeRateUsd).toFixed(2);

  // Initialize order id on modal open
  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      setOrderId(`ORD-20260905-${randomSuffix}`);
      setStep('select');
      setCountdown(300);
      if (defaultBookingId) {
        setSelectedBookingId(defaultBookingId);
      }
    }
  }, [isOpen, defaultBookingId]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || step !== 'select') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen) return null;

  // Process payment simulation / server-side verification
  const handleSimulatePayment = async () => {
    setStep('processing');
    setIsProcessingApi(true);

    let txId = '';
    let emailUsed = paypalEmail;

    try {
      if (paymentMethod === 'paypal') {
        // Call server-side PayPal endpoints
        const createRes = await fetch('/api/payment/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountKrw,
            amountUsd: parseFloat(amountUsd),
            orderId,
            bookingId: selectedBookingId || undefined,
            itemDescription: paymentType === 'fitting' 
              ? 'VIP Fitting Room Deposit' 
              : paymentType === 'rental' 
                ? 'Dress Rental Guarantee Deposit' 
                : 'Custom Atelier Payment',
          }),
        });
        
        const createData = await createRes.json();
        const serverOrderId = createData.data?.orderId || orderId;

        // Capture order
        const captureRes = await fetch('/api/payment/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: serverOrderId,
            amountUsd: parseFloat(amountUsd),
            payerEmail: paypalEmail,
          }),
        });

        const captureData = await captureRes.json();
        txId = captureData.data?.captureId || `PP-TX-${Date.now().toString().slice(-8)}`;
        emailUsed = captureData.data?.payerEmail || paypalEmail;
      } else if (paymentMethod === 'alipay') {
        txId = `ALI-PAY-${Date.now().toString().slice(-8)}`;
      } else {
        txId = `WX-PAY-${Date.now().toString().slice(-8)}`;
      }
    } catch (e) {
      console.warn('API error during payment, using fallback simulated transaction:', e);
      txId = paymentMethod === 'paypal' 
        ? `PP-TX-${Date.now().toString().slice(-8)}`
        : paymentMethod === 'alipay'
          ? `ALI-PAY-${Date.now().toString().slice(-8)}`
          : `WX-PAY-${Date.now().toString().slice(-8)}`;
    }

    // Delay slightly to give authentic processing feedback
    setTimeout(() => {
      setIsProcessingApi(false);
      setCompletedTxId(txId);
      setStep('success');

      if (onPaymentSuccess) {
        onPaymentSuccess({
          method: paymentMethod,
          amountKrw,
          amountCny: parseFloat(amountCny),
          amountUsd: parseFloat(amountUsd),
          orderId,
          txId,
          bookingId: selectedBookingId || undefined,
          payerEmail: paymentMethod === 'paypal' ? emailUsed : undefined,
        });
      }
    }, 1200);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-800 transition-all scale-in-95 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">글로벌 간편결제 시스템</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-bit SSL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PayPal (글로벌) · Alipay (支付宝) · WeChat Pay (微信支付)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {step === 'select' && (
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
            {/* 1. Order Item & Amount Configuration */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>주문 번호: <strong className="font-mono text-slate-800">{orderId}</strong></span>
                <button 
                  onClick={handleCopyOrderId}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '복사됨' : '복사'}</span>
                </button>
              </div>

              {/* Payment Purpose Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">결제 목적 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('fitting')}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition text-center ${
                      paymentType === 'fitting'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    피팅 예약 보증금<br /><span className="text-[10px] font-normal opacity-90">₩50,000</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('rental')}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition text-center ${
                      paymentType === 'rental'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    대여 계약 보증금<br /><span className="text-[10px] font-normal opacity-90">₩500,000</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('custom')}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition text-center ${
                      paymentType === 'custom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    기타 / 직접입력<br /><span className="text-[10px] font-normal opacity-90">금액 지정</span>
                  </button>
                </div>
              </div>

              {/* Custom Amount Input */}
              {paymentType === 'custom' && (
                <div className="pt-1">
                  <label className="block text-[11px] text-slate-500 mb-1">결제할 원화(KRW) 금액 입력</label>
                  <input
                    type="number"
                    value={customAmountKrw}
                    onChange={(e) => setCustomAmountKrw(Math.max(1000, Number(e.target.value)))}
                    step={10000}
                    min={1000}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Associate Booking Option */}
              {bookings.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">연계할 예약 내역</label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        [{b.id}] {b.customerName} - {b.storeName} ({b.date})
                      </option>
                    ))}
                    <option value="">연계 예약 없음 (일반 결제)</option>
                  </select>
                </div>
              )}

              {/* Total Payable Summary with multi-currency */}
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">
                  {paymentMethod === 'paypal' ? '결제 기준 통화 (USD / 실시간 환산)' : '결제 기준 통화 (CNY / 실시간 환산)'}
                </span>
                <div className="text-right">
                  {paymentMethod === 'paypal' ? (
                    <>
                      <div className="text-lg font-black text-[#003087] leading-none flex items-baseline justify-end gap-1">
                        <span className="text-sm font-bold text-slate-500">$</span>
                        <span>{amountUsd}</span>
                        <span className="text-xs font-bold text-slate-500">USD</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        (₩ {amountKrw.toLocaleString()} KRW · ¥ {amountCny} CNY)
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-black text-slate-900 leading-none flex items-baseline justify-end gap-1">
                        <span className="text-sm font-bold text-slate-500">¥</span>
                        <span>{amountCny}</span>
                        <span className="text-xs font-bold text-slate-500">CNY</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        (₩ {amountKrw.toLocaleString()} KRW · ${amountUsd} USD)
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2. 3-Way Payment Method Selector (PayPal / Alipay / WeChat) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>간편 결제 수단 선택</span>
                <span className="text-[10px] text-slate-400 font-normal">글로벌 크로스보더 정산 지원</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {/* 1. PayPal Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition text-center relative ${
                    paymentMethod === 'paypal'
                      ? 'border-[#0079C1] bg-[#0079C1]/5 ring-2 ring-[#0079C1]/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#003087] text-[#0079C1] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs mb-1">
                    <span className="text-white font-extrabold italic tracking-tighter">P</span>
                    <span className="text-[#0079C1] font-extrabold italic tracking-tighter -ml-1">P</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-tight">페이팔</span>
                  <span className="text-[10px] text-[#0079C1] font-bold">PayPal</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">글로벌 & 해외카드</span>
                  {paymentMethod === 'paypal' && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0079C1] text-white rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </button>

                {/* 2. Alipay Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('alipay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition text-center relative ${
                    paymentMethod === 'alipay'
                      ? 'border-[#1677FF] bg-[#1677FF]/5 ring-2 ring-[#1677FF]/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1677FF] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs mb-1">
                    支
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-tight">알리페이</span>
                  <span className="text-[10px] text-[#1677FF] font-bold">Alipay</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">支付宝 결제</span>
                  {paymentMethod === 'alipay' && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1677FF] text-white rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </button>

                {/* 3. WeChat Pay Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wechat')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition text-center relative ${
                    paymentMethod === 'wechat'
                      ? 'border-[#07C160] bg-[#07C160]/5 ring-2 ring-[#07C160]/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#07C160] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs mb-1">
                    微
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-tight">위챗페이</span>
                  <span className="text-[10px] text-[#07C160] font-bold">WeChat</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">微信支付 스캔</span>
                  {paymentMethod === 'wechat' && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#07C160] text-white rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Detailed Interactive Payment Area */}

            {/* CASE A: PAYPAL SELECTED */}
            {paymentMethod === 'paypal' && (
              <div className="border border-[#0079C1]/30 rounded-xl bg-gradient-to-b from-[#0079C1]/5 to-white overflow-hidden">
                {/* PayPal Header & Mode Tabs */}
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-white rounded-md">
                      <span className="text-[#003087] font-black italic text-xs tracking-tighter">Pay</span>
                      <span className="text-[#0079C1] font-black italic text-xs tracking-tighter">Pal</span>
                    </div>
                    <span className="text-xs font-bold text-white">결제 방식 선택</span>
                  </div>

                  {/* PayPal Sub-Tabs */}
                  <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPaypalSubMode('express')}
                      className={`px-2 py-1 rounded-md transition font-medium ${
                        paypalSubMode === 'express'
                          ? 'bg-[#FFC439] text-[#003087] font-bold shadow-2xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      PayPal 간편
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaypalSubMode('card')}
                      className={`px-2 py-1 rounded-md transition font-medium ${
                        paypalSubMode === 'card'
                          ? 'bg-white text-slate-900 font-bold shadow-2xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      해외 카드
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaypalSubMode('qr')}
                      className={`px-2 py-1 rounded-md transition font-medium ${
                        paypalSubMode === 'qr'
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      앱 QR
                    </button>
                  </div>
                </div>

                {/* Mode 1: PayPal Express Checkout (Gold Button) */}
                {paypalSubMode === 'express' && (
                  <div className="p-4 space-y-3">
                    {/* Simulated Account details */}
                    <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-xs">
                          P
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">연동 계정: {paypalEmail}</span>
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PayPal Verified Account
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-[#003087] font-bold">
                        One-Touch 활성
                      </span>
                    </div>

                    {/* Funding Source Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        PayPal 출금 / 결제 수단 선택
                      </label>
                      <div className="space-y-1.5">
                        <label 
                          onClick={() => setPaypalFundingSource('balance')}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                            paypalFundingSource === 'balance'
                              ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold ring-1 ring-blue-400'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              checked={paypalFundingSource === 'balance'} 
                              onChange={() => setPaypalFundingSource('balance')}
                              className="text-blue-600" 
                            />
                            <Wallet className="w-3.5 h-3.5 text-blue-600" />
                            <span>PayPal 지갑 잔액 (PayPal Balance)</span>
                          </div>
                          <span className="text-emerald-700 font-mono text-[11px] font-bold">잔액 $1,450.00 USD</span>
                        </label>

                        <label 
                          onClick={() => setPaypalFundingSource('chase_card')}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                            paypalFundingSource === 'chase_card'
                              ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold ring-1 ring-blue-400'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              checked={paypalFundingSource === 'chase_card'} 
                              onChange={() => setPaypalFundingSource('chase_card')}
                              className="text-blue-600" 
                            />
                            <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                            <span>Chase Sapphire Visa (****4242)</span>
                          </div>
                          <span className="text-[10px] text-slate-500">해외 원스톱 승인</span>
                        </label>

                        <label 
                          onClick={() => setPaypalFundingSource('bank')}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                            paypalFundingSource === 'bank'
                              ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold ring-1 ring-blue-400'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              checked={paypalFundingSource === 'bank'} 
                              onChange={() => setPaypalFundingSource('bank')}
                              className="text-blue-600" 
                            />
                            <Globe className="w-3.5 h-3.5 text-slate-600" />
                            <span>연동 해외 은행 계좌 (Bank of America ****8891)</span>
                          </div>
                          <span className="text-[10px] text-slate-500">USD 직출금</span>
                        </label>
                      </div>
                    </div>

                    {/* Official PayPal Gold Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="w-full py-3 px-4 bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm border border-[#E0A800]"
                      >
                        <span className="font-extrabold italic tracking-tight text-base text-[#003087]">Pay</span>
                        <span className="font-extrabold italic tracking-tight text-base text-[#0079C1] -ml-1.5">Pal</span>
                        <span className="text-xs font-extrabold text-[#003087] ml-1">로 ${amountUsd} USD 간편 결제하기</span>
                      </button>
                    </div>

                    {/* Pay in 4 installment option */}
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-[#0079C1]" />
                        <span>또는 <strong>Pay in 4</strong> (4회 무이자 분할 결제 $ {(parseFloat(amountUsd) / 4).toFixed(2)}/회 가능)</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Mode 2: Debit or Credit Card powered by PayPal */}
                {paypalSubMode === 'card' && (
                  <div className="p-4 space-y-2.5 text-left">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                      <span className="font-bold text-slate-700">해외 발급 카드 직접 결제</span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">VISA</span>
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">Master</span>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-900 text-[10px] font-bold rounded">AMEX</span>
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">JCB</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">카드 번호</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={cardForm.cardNumber}
                            onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value})}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 pl-8"
                          />
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">유효기간 (MM/YY)</label>
                          <input 
                            type="text" 
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">보안코드 (CVV/CVC)</label>
                          <input 
                            type="text" 
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">카드 소유자 영문명</label>
                          <input 
                            type="text" 
                            value={cardForm.cardHolder}
                            onChange={(e) => setCardForm({...cardForm, cardHolder: e.target.value})}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">우편번호 (Billing Zip)</label>
                          <input 
                            type="text" 
                            value={cardForm.postalCode}
                            onChange={(e) => setCardForm({...cardForm, postalCode: e.target.value})}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Black Button: Debit or Credit Card */}
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="w-full py-2.5 px-4 bg-[#111827] hover:bg-black text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PayPal 보안 게이트웨이로 ${amountUsd} USD 결제하기</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode 3: PayPal Mobile App QR */}
                {paypalSubMode === 'qr' && (
                  <div className="p-4 text-center space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0079C1] animate-pulse" />
                        <span className="font-bold text-slate-800">PayPal 모바일 앱 스캔 대기 중</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        남은 시간: <strong className="text-rose-600">{formatTime(countdown)}</strong>
                      </span>
                    </div>

                    <div className="inline-block p-3 bg-white rounded-xl shadow-md border border-slate-200 relative my-1">
                      <div className="w-36 h-36 relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                        <svg className="w-32 h-32" viewBox="0 0 120 120" fill="none">
                          <rect x="10" y="10" width="30" height="30" rx="4" fill="#003087" />
                          <rect x="16" y="16" width="18" height="18" rx="2" fill="white" />
                          <rect x="20" y="20" width="10" height="10" fill="#0079C1" />

                          <rect x="80" y="10" width="30" height="30" rx="4" fill="#003087" />
                          <rect x="86" y="16" width="18" height="18" rx="2" fill="white" />
                          <rect x="90" y="20" width="10" height="10" fill="#0079C1" />

                          <rect x="10" y="80" width="30" height="30" rx="4" fill="#003087" />
                          <rect x="16" y="86" width="18" height="18" rx="2" fill="white" />
                          <rect x="20" y="90" width="10" height="10" fill="#0079C1" />

                          {/* PayPal pattern */}
                          <rect x="46" y="14" width="6" height="6" fill="#003087" />
                          <rect x="58" y="14" width="8" height="6" fill="#1e293b" />
                          <rect x="68" y="22" width="6" height="8" fill="#0079C1" />
                          <rect x="46" y="26" width="8" height="6" fill="#1e293b" />

                          <rect x="14" y="48" width="6" height="8" fill="#1e293b" />
                          <rect x="26" y="52" width="6" height="8" fill="#003087" />
                          <rect x="36" y="46" width="8" height="6" fill="#1e293b" />

                          <rect x="82" y="48" width="8" height="6" fill="#003087" />
                          <rect x="94" y="52" width="6" height="8" fill="#1e293b" />
                          <rect x="84" y="62" width="8" height="6" fill="#0079C1" />

                          <rect x="48" y="82" width="6" height="8" fill="#1e293b" />
                          <rect x="60" y="80" width="8" height="6" fill="#003087" />
                          <rect x="52" y="94" width="8" height="6" fill="#0079C1" />
                          <rect x="82" y="86" width="8" height="8" fill="#003087" />
                        </svg>

                        {/* PayPal Center Badge */}
                        <div className="absolute w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
                          <span className="text-white font-extrabold italic text-[11px]">P</span>
                          <span className="text-[#0079C1] font-extrabold italic text-[11px] -ml-0.5">P</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      스마트폰에서 PayPal 모바일 앱 카메라로 QR 코드를 스캔하세요
                    </p>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      className="w-full py-2.5 px-4 bg-[#0079C1] hover:bg-[#005ea6] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>PayPal 모바일 앱 스캔 승인 (DEMO)</span>
                    </button>
                  </div>
                )}

                {/* PayPal Buyer Protection Guarantee footer */}
                <div className="px-3 py-2 bg-blue-50/60 border-t border-blue-100 flex items-center justify-between text-[10px] text-blue-900">
                  <span className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    PayPal Buyer Protection (180일 안심 구매자 보호)
                  </span>
                  <span className="text-slate-500 font-medium">글로벌 200개국 지원</span>
                </div>
              </div>
            )}

            {/* CASE B: ALIPAY OR WECHAT PAY SELECTED */}
            {(paymentMethod === 'alipay' || paymentMethod === 'wechat') && (
              <div className={`p-4 rounded-xl border text-center transition-all ${
                paymentMethod === 'alipay'
                  ? 'border-[#1677FF]/30 bg-gradient-to-b from-[#1677FF]/5 to-white'
                  : 'border-[#07C160]/30 bg-gradient-to-b from-[#07C160]/5 to-white'
              }`}>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      paymentMethod === 'alipay' ? 'bg-[#1677FF]' : 'bg-[#07C160]'
                    }`} />
                    <span className="font-bold text-slate-800">
                      {paymentMethod === 'alipay' ? '알리페이(支付宝) 결제 대기 중' : '위챗페이(微信支付) 결제 대기 중'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    남은 시간: <strong className="text-rose-600">{formatTime(countdown)}</strong>
                  </span>
                </div>

                {/* QR Code Graphic Box */}
                <div className="inline-block p-3 bg-white rounded-xl shadow-md border border-slate-200 relative my-1">
                  <div className="w-36 h-36 relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                    <svg className="w-32 h-32" viewBox="0 0 120 120" fill="none">
                      <rect x="10" y="10" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                      <rect x="16" y="16" width="18" height="18" rx="2" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                      <rect x="80" y="10" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                      <rect x="86" y="16" width="18" height="18" rx="2" fill="white" />
                      <rect x="90" y="20" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                      <rect x="10" y="80" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                      <rect x="16" y="86" width="18" height="18" rx="2" fill="white" />
                      <rect x="20" y="90" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                      <rect x="46" y="12" width="6" height="6" fill="#1e293b" />
                      <rect x="56" y="12" width="6" height="6" fill="#1e293b" />
                      <rect x="66" y="18" width="6" height="6" fill="#1e293b" />
                      <rect x="46" y="24" width="8" height="6" fill="#1e293b" />
                      <rect x="60" y="24" width="8" height="6" fill="#1e293b" />

                      <rect x="12" y="46" width="6" height="8" fill="#1e293b" />
                      <rect x="24" y="52" width="6" height="8" fill="#1e293b" />
                      <rect x="36" y="46" width="8" height="6" fill="#1e293b" />

                      <rect x="80" y="48" width="8" height="6" fill="#1e293b" />
                      <rect x="94" y="48" width="6" height="8" fill="#1e293b" />
                      <rect x="84" y="60" width="6" height="6" fill="#1e293b" />
                      <rect x="96" y="62" width="8" height="6" fill="#1e293b" />

                      <rect x="48" y="82" width="6" height="8" fill="#1e293b" />
                      <rect x="60" y="80" width="8" height="6" fill="#1e293b" />
                      <rect x="52" y="94" width="8" height="6" fill="#1e293b" />
                      <rect x="68" y="92" width="6" height="8" fill="#1e293b" />
                      <rect x="82" y="84" width="8" height="8" fill="#1e293b" />
                    </svg>

                    <div className={`absolute w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white ${
                      paymentMethod === 'alipay' ? 'bg-[#1677FF]' : 'bg-[#07C160]'
                    }`}>
                      {paymentMethod === 'alipay' ? '支' : '微'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                  <p className="font-semibold text-slate-800">
                    {paymentMethod === 'alipay' 
                      ? '알리페이(Alipay) 앱을 실행하여 [扫一扫(스캔)]으로 결제하세요'
                      : '위챗(WeChat) 앱을 실행하여 [扫一扫(스캔)]으로 결제하세요'
                    }
                  </p>
                  <p className="text-[11px] text-slate-400">
                    가맹점: TOBMALL GLOBAL (友霓网络科技) · 결제 보안 암호화 적용
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className={`w-full py-2.5 px-4 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                      paymentMethod === 'alipay'
                        ? 'bg-[#1677FF] hover:bg-[#1677FF]/90'
                        : 'bg-[#07C160] hover:bg-[#07C160]/90'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>
                      {paymentMethod === 'alipay' 
                        ? `알리페이 ¥ ${amountCny} CNY 테스트 결제 승인 (DEMO)` 
                        : `위챗페이 ¥ ${amountCny} CNY 테스트 결제 승인 (DEMO)`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Global Notice */}
            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>글로벌 통합 정산:</strong> PayPal, Alipay, WeChat Pay로 결제된 모든 보증금과 정산금은 TOBMALL 다자간 자동 정산 엔진을 통해 원화(KRW), 달러(USD), 위안화(CNY)로 대리점(OSM)과 공급사(SCM)에 자동 분배됩니다.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 'processing' && (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-spin ${
              paymentMethod === 'paypal'
                ? 'bg-blue-50 text-[#0079C1]'
                : paymentMethod === 'alipay'
                  ? 'bg-blue-50 text-[#1677FF]'
                  : 'bg-emerald-50 text-[#07C160]'
            }`}>
              <RefreshCw className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {paymentMethod === 'paypal' 
                  ? 'PayPal 글로벌 안전 결제 승인 진행 중' 
                  : paymentMethod === 'alipay' 
                    ? '알리페이(Alipay) 결제 승인 진행 중' 
                    : '위챗페이(WeChat) 결제 승인 진행 중'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {paymentMethod === 'paypal'
                  ? 'PayPal REST API v2 Gateway (San Jose, CA) 보안 토큰 검증 및 크로스보더 승인 처리 중입니다...'
                  : '글로벌 결제 게이트웨이(Gateway) 통신 중입니다. 잠시만 기다려주세요...'}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="p-5 sm:p-6 space-y-4 text-center overflow-y-auto flex-1">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-in zoom-in-75 duration-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                승인 완료 (PAYMENT COMPLETED)
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-2">
                {paymentMethod === 'paypal' 
                  ? 'PayPal 글로벌 간편결제가 완료되었습니다' 
                  : paymentMethod === 'alipay' 
                    ? '알리페이(支付宝) 결제가 완료되었습니다' 
                    : '위챗페이(微信支付) 결제가 완료되었습니다'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {paymentMethod === 'paypal'
                  ? 'PayPal 구매자 보호 프로그램이 적용되었으며 예약 내역에 승인 번호가 기록되었습니다.'
                  : '고객님의 예약/대여 계약에 결제 내역이 안전하게 반영되었습니다.'}
              </p>
            </div>

            {/* Official Electronic Receipt Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  글로벌 전자 영수증 (Electronic Receipt)
                </span>
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {completedTxId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div>
                  <span className="text-slate-400 block">결제 일시</span>
                  <span className="font-medium text-slate-700">2026-09-05 13:12:45 (KST)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">결제 수단</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    {paymentMethod === 'paypal' ? (
                      <>
                        <span className="text-[#003087] font-black italic">Pay</span>
                        <span className="text-[#0079C1] font-black italic -ml-1">Pal</span>
                        <span>One-Touch Express</span>
                      </>
                    ) : paymentMethod === 'alipay' ? (
                      'Alipay 跨境支付 (알리페이)'
                    ) : (
                      'WeChat Pay 微信跨境 (위챗페이)'
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">판매자 상호</span>
                  <span className="font-medium text-slate-700">TOBMALL GLOBAL PTE. LTD.</span>
                </div>
                <div>
                  <span className="text-slate-400 block">연계 예약 번호</span>
                  <span className="font-mono font-bold text-purple-700">{selectedBookingId || '일반결제'}</span>
                </div>
                {paymentMethod === 'paypal' && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">구매자 PayPal 계정: <strong className="text-slate-700">{paypalEmail}</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <Shield className="w-3 h-3 text-emerald-600" /> Buyer Protected
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between font-bold">
                <span className="text-slate-800">최종 승인 금액</span>
                <div className="text-right">
                  {paymentMethod === 'paypal' ? (
                    <>
                      <span className="text-base text-[#003087] font-extrabold">$ {amountUsd} USD</span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-normal">(₩ {amountKrw.toLocaleString()} KRW)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base text-emerald-600 font-extrabold">¥ {amountCny} CNY</span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-normal">(₩ {amountKrw.toLocaleString()} KRW)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                결제 확인 및 예약 내역 보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
