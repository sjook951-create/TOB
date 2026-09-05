import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, QrCode, Smartphone, 
  RefreshCw, Copy, Check, Receipt, ExternalLink, Info,
  Sparkles, CreditCard
} from 'lucide-react';
import { BookingItem } from '../../data/liveData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  defaultBookingId?: string;
  onPaymentSuccess?: (paymentInfo: {
    method: 'alipay' | 'wechat';
    amountKrw: number;
    amountCny: number;
    orderId: string;
    bookingId?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookings,
  defaultBookingId,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
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

  // Fixed exchange rate for demo (1 CNY = 188 KRW)
  const exchangeRate = 188;

  const getAmountKrw = () => {
    if (paymentType === 'fitting') return 50000;
    if (paymentType === 'rental') return 500000;
    return customAmountKrw;
  };

  const amountKrw = getAmountKrw();
  const amountCny = (amountKrw / exchangeRate).toFixed(2);

  // Generate order id on open
  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      setOrderId(`ORD-20260904-${randomSuffix}`);
      setStep('select');
      setCountdown(300);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || step !== 'select') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      const txId = paymentMethod === 'alipay' 
        ? `ALI-PAY-${Date.now().toString().slice(-8)}`
        : `WX-PAY-${Date.now().toString().slice(-8)}`;
      setCompletedTxId(txId);
      setStep('success');

      if (onPaymentSuccess) {
        onPaymentSuccess({
          method: paymentMethod,
          amountKrw,
          amountCny: parseFloat(amountCny),
          orderId,
          bookingId: selectedBookingId || undefined,
        });
      }
    }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-800 transition-all scale-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">간편결제 연동 시스템</h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  DEMO 환경
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Alipay (支付宝) · WeChat Pay (微信支付) 결제 시뮬레이션
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {step === 'select' && (
          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* 1. Order Item / Amount Configuration */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>주문 번호: <strong className="font-mono text-slate-800">{orderId}</strong></span>
                <button 
                  onClick={handleCopyOrderId}
                  className="flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-700 font-medium"
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
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
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
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
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
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
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
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
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

              {/* Total Payable Summary */}
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">최종 결제 금액 (실시간 환율 1 CNY = {exchangeRate} KRW)</span>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 leading-none">
                    ¥ {amountCny} <span className="text-xs font-bold text-slate-500">CNY</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    (₩ {amountKrw.toLocaleString()} KRW)
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector (Alipay vs WeChat) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">결제 수단 선택</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Alipay Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('alipay')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition text-left ${
                    paymentMethod === 'alipay'
                      ? 'border-[#1677FF] bg-[#1677FF]/5 ring-2 ring-[#1677FF]/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1677FF] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    支
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">알리페이</span>
                      <span className="text-[10px] bg-[#1677FF]/10 text-[#1677FF] font-semibold px-1.5 py-0.2 rounded">
                        Alipay
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">支付宝 모바일 결제</span>
                  </div>
                </button>

                {/* WeChat Pay Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wechat')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition text-left ${
                    paymentMethod === 'wechat'
                      ? 'border-[#07C160] bg-[#07C160]/5 ring-2 ring-[#07C160]/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#07C160] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    微
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">위챗페이</span>
                      <span className="text-[10px] bg-[#07C160]/10 text-[#07C160] font-semibold px-1.5 py-0.2 rounded">
                        WeChat
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">微信支付 QR 스캔</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Interactive Payment QR Card */}
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
              <div className="inline-block p-3.5 bg-white rounded-xl shadow-md border border-slate-200 relative my-1">
                {/* QR SVG Mock Pattern */}
                <div className="w-40 h-40 relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                  <svg className="w-36 h-36" viewBox="0 0 120 120" fill="none">
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                    <rect x="16" y="16" width="18" height="18" rx="2" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                    <rect x="80" y="10" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                    <rect x="86" y="16" width="18" height="18" rx="2" fill="white" />
                    <rect x="90" y="20" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                    <rect x="10" y="80" width="30" height="30" rx="4" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />
                    <rect x="16" y="86" width="18" height="18" rx="2" fill="white" />
                    <rect x="20" y="90" width="10" height="10" fill={paymentMethod === 'alipay' ? '#1677FF' : '#07C160'} />

                    {/* Data pattern blocks */}
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
                    <rect x="94" y="88" width="8" height="6" fill="#1e293b" />
                    <rect x="86" y="98" width="8" height="6" fill="#1e293b" />
                  </svg>

                  {/* Center Badge */}
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

              {/* Simulation Demo Trigger Button */}
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
                      ? '알리페이 테스트 결제 승인 (DEMO)' 
                      : '위챗페이 테스트 결제 승인 (DEMO)'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-purple-50 rounded-xl text-[11px] text-purple-700 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>DEMO 안내:</strong> 실제 결제 대행망 연동 전 시뮬레이션 환경입니다. [테스트 결제 승인] 버튼을 누르면 실시간 크로스보더 승인 결과가 시뮬레이션 처리됩니다.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 'processing' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-purple-600 animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {paymentMethod === 'alipay' ? '알리페이' : '위챗페이'} 결제 승인 진행 중
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                글로벌 결제 게이트웨이(Gateway) 통신 중입니다. 잠시만 기다려주세요...
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-in zoom-in-75 duration-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                결제 승인 완료 (PAID)
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-1.5">
                {paymentMethod === 'alipay' ? '알리페이(支付宝)' : '위챗페이(微信支付)'} 결제가 완료되었습니다
              </h4>
              <p className="text-xs text-slate-500">
                고객님의 예약/대여 계약에 결제 내역이 안전하게 반영되었습니다.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-purple-600" />
                  전자 영수증 (Electronic Receipt)
                </span>
                <span className="font-mono text-[11px] text-slate-500">{completedTxId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">결제 일시</span>
                  <span className="font-medium text-slate-700">2026-09-04 14:28:10 (KST)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">결제 수단</span>
                  <span className="font-bold text-slate-800">
                    {paymentMethod === 'alipay' ? 'Alipay 跨境支付' : 'WeChat Pay 微信跨境'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">가맹점 상호</span>
                  <span className="font-medium text-slate-700">友霓网络科技(上海)有限公司</span>
                </div>
                <div>
                  <span className="text-slate-400 block">연계 예약 번호</span>
                  <span className="font-mono font-bold text-purple-700">{selectedBookingId || '일반결제'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between font-bold">
                <span className="text-slate-800">승인 금액</span>
                <div className="text-right">
                  <span className="text-sm text-emerald-600 font-extrabold">¥ {amountCny} CNY</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">(₩ {amountKrw.toLocaleString()} KRW)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                결제 확인 및 완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
