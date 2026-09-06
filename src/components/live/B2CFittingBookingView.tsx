import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, CheckCircle2, Lock, X, AlertCircle, Sparkles,
  MapPin, Store, User, Phone, Check, RefreshCw, ChevronRight,
  ShieldCheck, Database, ShoppingBag, Heart, ArrowRight
} from 'lucide-react';
import { DressItem, BookingItem, FITTING_TIME_SLOTS, FITTING_ROOMS } from '../../data/liveData';

interface B2CFittingBookingViewProps {
  dresses: DressItem[];
  bookings: BookingItem[];
  selectedBatchDressIds: string[];
  onToggleBatchDress: (dressId: string) => void;
  onSelectAllThreeDresses: (dressIds: string[]) => void;
  onBookFitting: (booking: Omit<BookingItem, 'id' | 'status'>) => Promise<void> | void;
  onCancelBooking?: (bookingId: string) => void;
  onViewMyBookings: () => void;
}

const STORES = [
  '항저우 왕차오 센터점 (Wangchao Center)',
  '상하이 와이탄 플래그십 (The Bund)',
  '베이징 싼리툰 쇼룸 (Sanlitun)',
  '서울 청담 부티크 (Cheongdam)'
];

const getFormattedDate = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return {
    dateStr: `${year}-${month}-${day}`,
    dayName: dayNames[d.getDay()],
  };
};

export const B2CFittingBookingView: React.FC<B2CFittingBookingViewProps> = ({
  dresses,
  bookings,
  selectedBatchDressIds,
  onToggleBatchDress,
  onSelectAllThreeDresses,
  onBookFitting,
  onCancelBooking,
  onViewMyBookings,
}) => {
  const todayInfo = useMemo(() => getFormattedDate(0), []);
  const tomorrowInfo = useMemo(() => getFormattedDate(1), []);
  const dayAfterInfo = useMemo(() => getFormattedDate(2), []);

  const [selectedStore, setSelectedStore] = useState<string>(STORES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => getFormattedDate(0).dateStr);
  const [selectedRoom, setSelectedRoom] = useState<string>(FITTING_ROOMS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Bride Information State
  const [customerName, setCustomerName] = useState<string>('김지은');
  const [phone, setPhone] = useState<string>('010-3849-2918');
  const [weddingDate, setWeddingDate] = useState<string>('2026-10-18');
  const [weddingVenue, setWeddingVenue] = useState<string>('인터컨티넨탈 호텔 그랜드볼룸');
  const [plannerCode, setPlannerCode] = useState<string>('26-00275 (정하윤 플래너)');

  // Dress search/filter within booking screen
  const [dressSearch, setDressSearch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 6000);
  };

  // Check slot status against fitting_bookings DB records
  const checkSlotStatus = (slot: string) => {
    const activeBooking = bookings.find(
      b => b.date === selectedDate &&
           b.storeName === selectedStore &&
           b.fittingRoom === selectedRoom &&
           b.timeSlot === slot &&
           b.status !== '취소' &&
           b.status !== '예약취소'
    );

    if (!activeBooking) {
      // Check if this slot was previously cancelled
      const wasCancelled = bookings.some(
        b => b.date === selectedDate &&
             b.storeName === selectedStore &&
             b.fittingRoom === selectedRoom &&
             b.timeSlot === slot &&
             (b.status === '취소' || b.status === '예약취소')
      );
      return { status: 'available' as const, booking: null, wasCancelled };
    }

    // Check if this active booking belongs to the current user (by name or phone match)
    const isMine = (customerName && activeBooking.customerName.trim() === customerName.trim()) ||
                   (phone && activeBooking.phone.trim() === phone.trim());

    if (isMine) {
      return { status: 'mine' as const, booking: activeBooking, wasCancelled: false };
    } else {
      return { status: 'locked' as const, booking: activeBooking, wasCancelled: false };
    }
  };

  // Handle Slot Booking Submit
  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('예약하실 피팅 타임슬롯을 선택해 주세요.');
      return;
    }
    if (!customerName || !phone) {
      alert('신부님 성함과 연락처를 입력해 주세요.');
      return;
    }

    // Pre-flight check
    const currentStatus = checkSlotStatus(selectedSlot);
    if (currentStatus.status === 'locked') {
      alert(`[예약 불가] 해당 시간(${selectedSlot})은 다른 사람(고객/플래너)이 이미 예약하여 선택할 수 없습니다.`);
      return;
    }

    const dressesToBook = selectedBatchDressIds.length > 0
      ? selectedBatchDressIds
      : dresses.slice(0, 1).map(d => d.id);

    setIsSubmitting(true);
    try {
      await onBookFitting({
        customerName,
        phone,
        storeName: selectedStore,
        date: selectedDate,
        timeSlot: selectedSlot,
        fittingRoom: selectedRoom,
        selectedDresses: dressesToBook,
        weddingDate,
        weddingVenue,
        plannerCode: plannerCode || '온라인 B2C 직접 예약',
        assignedStylist: '이소영 수석 스타일리스트'
      });

      showNotice(`[예약 확정 완료] ${customerName} 신부님의 피팅룸 예약이 fitting_bookings DB에 등록되었습니다! 해당 일시(${selectedDate} ${selectedSlot})는 다른 사용자가 예약할 수 없도록 실시간 잠금되었습니다.`);
      setSelectedSlot(null);
    } catch (err: any) {
      alert(err.message || '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cancellation of My Booking (Instantly Unlocks Time Slot in DB)
  const handleCancelBooking = (bookingId: string, slotDesc: string) => {
    if (window.confirm(`[피팅 예약 취소 확인]\n정말로 ${slotDesc} 예약을 취소하시겠습니까?\n\n취소 즉시 fitting_bookings DB에서 해당 일시의 타임슬롯이 잠금 해제되어 다시 예약 가능한 상태로 복구됩니다.`)) {
      if (onCancelBooking) {
        onCancelBooking(bookingId);
      }
      showNotice(`[예약 취소 완료] 예약(${bookingId})이 취소되었습니다. fitting_bookings DB에서 해당 타임슬롯이 즉시 재가용 상태(녹색)로 오픈되었습니다.`);
    }
  };

  // Filter dresses for the in-screen dress selector
  const selectableDresses = useMemo(() => {
    return dresses.filter(d => {
      if (d.status === '심사대기') return false;
      if (!dressSearch.trim()) return true;
      const q = dressSearch.toLowerCase();
      return d.name.toLowerCase().includes(q) ||
             d.designer.toLowerCase().includes(q) ||
             d.silhouette.toLowerCase().includes(q);
    });
  }, [dresses, dressSearch]);

  const activeMyBookings = useMemo(() => {
    return bookings.filter(b => 
      b.status !== '취소' && 
      b.status !== '예약취소' &&
      ((customerName && b.customerName.trim() === customerName.trim()) ||
       (phone && b.phone.trim() === phone.trim()))
    );
  }, [bookings, customerName, phone]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Notice Banner */}
      {noticeMessage && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-xl border border-emerald-400 flex items-start justify-between gap-3 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{noticeMessage}</p>
          </div>
          <button 
            onClick={() => setNoticeMessage(null)}
            className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Feature Header Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-purple-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-purple-300" />
                <span>Cloud SQL fitting_bookings 실시간 연동</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>중복 예약 차단 & 취소 시 실시간 재오픈</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              피팅룸 실시간 예약 (SCR-B2C-003)
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl leading-relaxed">
              매일 <strong>09시부터 19시까지 2시간 단위</strong>로 VIP 피팅룸을 예약하실 수 있습니다. 
              이미 예약된 일시/타임슬롯은 실시간으로 잠금 처리되며, 예약 취소 시 즉시 재가용 상태로 복원됩니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={onViewMyBookings}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>나의 예약 내역 ({activeMyBookings.length}건)</span>
              <ChevronRight className="w-4 h-4 text-purple-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left (Store / Date / Slot Selector) & Right (Booking Form & Dress Selector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Store/Date/Room & 5 Time Slots */}
        <div className="lg:col-span-7 space-y-5">
          {/* Store / Date / Room Selector Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-4 h-4 text-purple-600" />
              <span>1단계: 매장, 일자 및 VIP 피팅룸 선택</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Store */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  방문 매장 지점 *
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => {
                    setSelectedStore(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                >
                  {STORES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  피팅 희망 일자 *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              {/* Fitting Room */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  피팅룸 선택 *
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                >
                  {FITTING_ROOMS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick date shortcuts */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-medium">빠른 일자:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(todayInfo.dateStr);
                  setSelectedSlot(null);
                }}
                className={`px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                  selectedDate === todayInfo.dateStr
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${selectedDate === todayInfo.dateStr ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'}`}>오늘</span>
                <span>{todayInfo.dateStr} ({todayInfo.dayName})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(tomorrowInfo.dateStr);
                  setSelectedSlot(null);
                }}
                className={`px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                  selectedDate === tomorrowInfo.dateStr
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${selectedDate === tomorrowInfo.dateStr ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>내일</span>
                <span>{tomorrowInfo.dateStr} ({tomorrowInfo.dayName})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(dayAfterInfo.dateStr);
                  setSelectedSlot(null);
                }}
                className={`px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                  selectedDate === dayAfterInfo.dateStr
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${selectedDate === dayAfterInfo.dateStr ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>모레</span>
                <span>{dayAfterInfo.dateStr} ({dayAfterInfo.dayName})</span>
              </button>
            </div>
          </div>

          {/* Time Slots Grid (09:00 ~ 19:00, 2-hour intervals) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>2단계: 피팅 시간대 선택 (매일 09시 ~ 19시, 2시간 단위)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  기준: {selectedStore} · {selectedDate} · {selectedRoom}
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  예약 가능
                </span>
                <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  내가 예약
                </span>
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <Lock className="w-2.5 h-2.5 text-rose-500" />
                  예약 불가 (타인)
                </span>
              </div>
            </div>

            {/* 5 Time Slots Cards */}
            <div className="space-y-2.5">
              {FITTING_TIME_SLOTS.map((slot, index) => {
                const info = checkSlotStatus(slot);
                const isSelected = selectedSlot === slot;

                if (info.status === 'locked') {
                  // Booked by another customer or planner -> LOCKED
                  return (
                    <div
                      key={slot}
                      className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 opacity-90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{slot}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                              예약 불가 (타 고객/플래너 예약 완료)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            예약자: {info.booking?.customerName?.[0] || '고'}*님 ({info.booking?.plannerCode ? '플래너 배정' : '온라인 예약'}) · 상태: {info.booking?.status}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-rose-600 block">
                          🔒 중복 예약 차단됨
                        </span>
                        <span className="text-[10px] text-slate-400">
                          다른 시간대를 선택해 주세요
                        </span>
                      </div>
                    </div>
                  );
                }

                if (info.status === 'mine') {
                  // Booked by THIS customer -> CANCEL / MANAGE
                  return (
                    <div
                      key={slot}
                      className="p-3.5 rounded-xl border-2 border-purple-400 bg-purple-50/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-purple-950">{slot}</span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-600 text-white shadow-2xs">
                              내가 예약 완료 (예약번호: {info.booking?.id})
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-700 mt-0.5 font-medium">
                            {info.booking?.customerName} 신부님 · 드레스 {info.booking?.selectedDresses?.length || 0}벌 피팅 예정 · 상태: {info.booking?.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(info.booking!.id, `${selectedDate} ${slot}`)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          title="예약 취소 시 fitting_bookings DB에서 해당 타임슬롯이 즉시 해제되어 다시 예약 가능해집니다."
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>예약 취소 (슬롯 즉시 재오픈)</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                // Available slot
                return (
                  <div
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-300 shadow-md'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                        isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{slot}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {info.wasCancelled ? '최근 취소로 실시간 재가용됨' : '예약 가능'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (제{index + 1}회차 / 2시간 피팅)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {info.wasCancelled ? '취소된 슬롯이 실시간 잠금 해제되어 즉시 예약하실 수 있습니다.' : '대기 없이 즉시 예약 확정 가능한 타임슬롯입니다.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}>
                        {isSelected ? '✓ 선택 완료' : '시간대 선택'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Bride Info & Dress Selector Form */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleReserveSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-purple-600" />
              <span>3단계: 신부님 정보 및 본식 정보</span>
            </h3>

            {/* Selected slot indicator banner */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
              selectedSlot
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {selectedSlot 
                    ? `선택 슬롯: ${selectedDate} (${selectedSlot})` 
                    : '좌측에서 원하시는 피팅 시간대를 선택해 주세요'}
                </span>
              </div>
              {selectedSlot && (
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  선택됨
                </span>
              )}
            </div>

            {/* Bride Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">신부님 성함 *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="예: 김지은"
                    className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">연락처 (휴대폰) *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Wedding Date & Venue */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs space-y-2">
              <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>본식 정보 연동 (도면 U4, U11 필수 규격)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-medium block mb-0.5 text-[11px]">본식 예정일</label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-0.5 text-[11px]">예식홀 / 장소</label>
                  <input
                    type="text"
                    value={weddingVenue}
                    onChange={(e) => setWeddingVenue(e.target.value)}
                    placeholder="호텔 또는 웨딩홀"
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Planner Code (Enforce Certified Planner for Fitting Booking) */}
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>담당 공인 플래너 고유번호 (8자리) *</span>
                </label>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-200/70 px-2 py-0.5 rounded-full">
                  플래너 예약 전용
                </span>
              </div>
              <input
                type="text"
                required
                value={plannerCode}
                onChange={(e) => setPlannerCode(e.target.value)}
                placeholder="예: 26-00275"
                className="w-full p-2 bg-white border border-purple-300 rounded-lg text-xs font-mono font-bold text-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-purple-800 leading-snug">
                ⚠️ 피팅룸 실시간 예약은 본사에서 발급한 8자리 고유번호(예: 26-00275)를 보유한 플래너만 예약이 가능합니다.
              </p>
              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
                <span className="text-[10px] text-slate-500">인증 플래너 선택:</span>
                {[
                  { code: '26-00275', name: '정하윤' },
                  { code: '26-00104', name: '김다은' },
                  { code: '26-00388', name: '최유리' },
                  { code: '26-00512', name: '왕메이' }
                ].map(p => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => setPlannerCode(`${p.code} (${p.name} 플래너)`)}
                    className="px-2 py-0.5 bg-white hover:bg-purple-100 border border-purple-300 rounded text-[10px] font-mono font-bold text-purple-800 transition"
                  >
                    {p.code} ({p.name})
                  </button>
                ))}
              </div>
            </div>

            {/* Dress Selection (Max 3 dresses) */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                  <span>시착 희망 드레스 (최대 3벌)</span>
                </label>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  selectedBatchDressIds.length === 3
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : selectedBatchDressIds.length > 0
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {selectedBatchDressIds.length} / 3벌 선택됨
                </span>
              </div>

              {/* Quick AI 3 Dresses auto select button */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const topThree = dresses.filter(d => d.status !== '심사대기').slice(0, 3).map(d => d.id);
                    onSelectAllThreeDresses(topThree);
                  }}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border border-purple-200"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>AI 추천 3벌 자동 담기</span>
                </button>
                {selectedBatchDressIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectAllThreeDresses([])}
                    className="text-[11px] text-slate-400 hover:text-rose-500 font-medium"
                  >
                    선택 초기화
                  </button>
                )}
              </div>

              {/* Selected Dress Badges */}
              {selectedBatchDressIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-purple-50/70 rounded-xl border border-purple-100">
                  {selectedBatchDressIds.map((id, index) => {
                    const d = dresses.find(item => item.id === id);
                    return (
                      <div 
                        key={id} 
                        className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-purple-200 text-[11px] text-purple-950 shadow-2xs"
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium max-w-[130px] truncate">{d ? d.name : id}</span>
                        <button
                          type="button"
                          onClick={() => onToggleBatchDress(id)}
                          className="text-slate-400 hover:text-rose-500 ml-0.5 p-0.5"
                          title="제거"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mini Scrollable Dress List for quick toggle */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {selectableDresses.slice(0, 10).map((d) => {
                  const isSelected = selectedBatchDressIds.includes(d.id);
                  const selectedIndex = selectedBatchDressIds.indexOf(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => onToggleBatchDress(d.id)}
                      className={`w-full p-2 rounded-lg border text-left transition flex items-center justify-between ${
                        isSelected 
                          ? 'bg-purple-100/90 border-purple-400 text-purple-950 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-1">
                        <img 
                          src={d.imageUrl} 
                          alt={d.name} 
                          className="w-8 h-10 object-cover rounded shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate">
                          <span className="block text-[11px] truncate leading-tight font-medium">{d.name}</span>
                          <span className="text-[10px] text-slate-500 block">{d.silhouette} · ₩{d.rentalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {selectedIndex + 1}
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0 hover:border-purple-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedSlot || isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md ${
                  selectedSlot && !isSubmitting
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>fitting_bookings DB 등록 중...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedSlot 
                        ? `[${selectedDate} ${selectedSlot}] 피팅 예약 확정` 
                        : '피팅 시간대를 먼저 선택해 주세요'}
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                예약 확정 즉시 fitting_bookings DB에 영구 등록되며, 타 사용자 중복 예약이 실시간 차단됩니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
