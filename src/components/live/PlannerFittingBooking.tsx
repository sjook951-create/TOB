import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Clock, Lock, Unlock, CheckCircle2, XCircle, AlertCircle,
  DoorClosed, User, Phone, MapPin, Sparkles, Check, ArrowRight,
  ShieldAlert, RefreshCw, Layers, Database, BadgeCheck, X
} from 'lucide-react';
import {
  BookingItem, DressItem, FITTING_TIME_SLOTS, FITTING_STORES, FITTING_ROOMS
} from '../../data/liveData';

interface PlannerFittingBookingProps {
  dresses: DressItem[];
  bookings: BookingItem[];
  onBookFitting: (bookingData: Omit<BookingItem, 'id' | 'status'>) => Promise<void>;
  onCancelBooking: (bookingId: string) => void;
  currentPlannerId?: string;
}

const getFormattedDateWithOffset = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return {
    dateStr: `${year}-${month}-${day}`,
    display: `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`,
  };
};

export const PlannerFittingBooking: React.FC<PlannerFittingBookingProps> = ({
  dresses,
  bookings,
  onBookFitting,
  onCancelBooking,
  currentPlannerId = '26-00275 (정하윤 플래너)'
}) => {
  const todayObj = useMemo(() => getFormattedDateWithOffset(0), []);
  const tomorrowObj = useMemo(() => getFormattedDateWithOffset(1), []);
  const dayAfterObj = useMemo(() => getFormattedDateWithOffset(2), []);

  // Planner Switcher state for demonstration and testing multi-planner locking
  const [activePlanner, setActivePlanner] = useState<string>(currentPlannerId);
  // Default to today's date automatically
  const [selectedDate, setSelectedDate] = useState<string>(() => getFormattedDateWithOffset(0).dateStr);
  const [selectedStore, setSelectedStore] = useState<string>(FITTING_STORES[0]);
  const [selectedRoom, setSelectedRoom] = useState<string>(FITTING_ROOMS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Planners DB Modal state
  const [isPlannerDbModalOpen, setIsPlannerDbModalOpen] = useState(false);
  const [plannersList, setPlannersList] = useState<any[]>([]);
  const [isLoadingPlanners, setIsLoadingPlanners] = useState(false);

  // Fetch planners from the dedicated planners DB table
  const fetchPlannersDb = async () => {
    setIsLoadingPlanners(true);
    try {
      const res = await fetch('/api/planners');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPlannersList(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch planners list:', err);
    } finally {
      setIsLoadingPlanners(false);
    }
  };

  useEffect(() => {
    fetchPlannersDb();
  }, []);

  // Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [weddingDate, setWeddingDate] = useState<string>('2026-10-18');
  const [weddingVenue, setWeddingVenue] = useState<string>('신라호텔 다이너스티홀');
  const [selectedDressIds, setSelectedDressIds] = useState<string[]>(['DR-001']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Show notice with auto hide
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Helper to check booking status of each slot
  const checkSlotStatus = (slot: string) => {
    const found = bookings.find(
      b => b.date === selectedDate &&
           b.storeName === selectedStore &&
           b.fittingRoom === selectedRoom &&
           b.timeSlot === slot &&
           b.status !== '취소' &&
           b.status !== '예약취소'
    );

    if (!found) {
      // Check if previously cancelled
      const cancelled = bookings.find(
        b => b.date === selectedDate &&
             b.storeName === selectedStore &&
             b.fittingRoom === selectedRoom &&
             b.timeSlot === slot &&
             (b.status === '취소' || b.status === '예약취소')
      );
      return { status: 'available', booking: null, wasCancelled: !!cancelled };
    }

    // Check if booked by THIS planner
    const isMine = (found.plannerCode || '').trim() === activePlanner.trim() ||
                   (found.plannerCode || '').includes(activePlanner.split(' ')[0]);

    if (isMine) {
      return { status: 'mine', booking: found, wasCancelled: false };
    } else {
      return { status: 'locked', booking: found, wasCancelled: false };
    }
  };

  // My bookings list
  const myBookings = useMemo(() => {
    return bookings.filter(b => {
      const code = b.plannerCode || '';
      return code.trim() === activePlanner.trim() || code.includes(activePlanner.split(' ')[0]);
    });
  }, [bookings, activePlanner]);

  // Handle slot reservation submit
  const handleReserveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('예약하실 타임슬롯을 선택해주세요.');
      return;
    }
    if (!customerName || !phone) {
      alert('신부/고객 성함과 연락처를 입력해주세요.');
      return;
    }

    // Pre-check if slot became taken
    const currentStatus = checkSlotStatus(selectedSlot);
    if (currentStatus.status === 'locked') {
      alert(`[예약 실패] 해당 시간(${selectedSlot})은 다른 플래너가 이미 예약했습니다.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onBookFitting({
        customerName,
        phone,
        storeName: selectedStore,
        date: selectedDate,
        timeSlot: selectedSlot,
        fittingRoom: selectedRoom,
        selectedDresses: selectedDressIds,
        weddingDate,
        weddingVenue,
        plannerCode: activePlanner,
        assignedStylist: '이소영 수석 스타일리스트'
      });

      showNotice(`[예약 확정 완료] ${customerName}님의 피팅룸 예약이 완료되었습니다. 다른 플래너는 이 시간대를 예약할 수 없습니다.`);
      setSelectedSlot(null);
      setCustomerName('');
      setPhone('');
    } catch (err: any) {
      alert(err.message || '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cancel Booking
  const handleCancel = (bookingId: string, slotInfo: string) => {
    if (window.confirm(`[예약 취소 확인]\n정말로 ${slotInfo} 피팅 예약을 취소하시겠습니까?\n\n취소 시 해당 일시의 타임슬롯이 즉시 해제되어 다시 예약 가능한 상태로 전환됩니다.`)) {
      onCancelBooking(bookingId);
      showNotice(`[예약 취소 완료] 피팅룸 예약(${bookingId})이 취소되었습니다. 해당 일시 타임슬롯이 다시 오픈되었습니다.`);
      if (selectedSlot === slotInfo) {
        setSelectedSlot(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Header & Planner Profile Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              SCR-PLN-004 · VIP 피팅룸 실시간 예약
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              타 플래너 중복 차단 엔진 활성
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            대리점 피팅룸 실시간 예약 & 타임슬롯 스케줄 관리
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            매일 09시부터 19시까지 2시간 단위로 예약 가능하며, 다른 플래너가 예약한 시간대는 실시간으로 잠금 처리되어 중복 예약이 방지됩니다.
          </p>
        </div>

        {/* Multi-Planner Switcher (Crucial for testing conflict locks!) & Planners DB View */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchPlannersDb();
              setIsPlannerDbModalOpen(true);
            }}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="본사 발급 8자리 플래너 번호가 보관된 planners DB 테이블 조회"
          >
            <Database className="w-3.5 h-3.5 text-purple-600" />
            <span>플래너 DB 테이블 현황</span>
            <span className="bg-purple-200 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {plannersList.length}명
            </span>
          </button>

          <div className="p-2.5 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center gap-2.5">
            <div className="text-right">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">현재 인증 플래너</span>
              <span className="text-xs font-extrabold text-slate-900 block font-mono">{activePlanner.split(' ')[0]}</span>
            </div>
            <select
              value={activePlanner}
              onChange={(e) => setActivePlanner(e.target.value)}
              className="p-1.5 bg-white border border-purple-300 rounded-lg text-xs font-bold text-purple-900 shadow-2xs focus:ring-2 focus:ring-purple-500"
              title="플래너 계정 전환하여 타 플래너 예약 잠금 테스트"
            >
              <option value="26-00275 (정하윤 플래너)">26-00275 (정하윤 수석플래너)</option>
              <option value="26-00104 (김다은 플래너)">26-00104 (김다은 플래너)</option>
              <option value="26-00388 (최유리 플래너)">26-00388 (최유리 플래너)</option>
              <option value="26-00512 (왕메이 플래너)">26-00512 (왕메이 플래너)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Reservation Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Date & Room Selector + 2-Hour Time Slots (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Controls: Date, Store, Room */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>피팅 일자 및 매장 룸 선택</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Date */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">피팅 희망 일자 *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Store */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">방문 대리점 매장 *</label>
                <select
                  value={selectedStore}
                  onChange={(e) => {
                    setSelectedStore(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {FITTING_STORES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">피팅룸 *</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {FITTING_ROOMS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Date Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">빠른 날짜:</span>
              <button
                type="button"
                onClick={() => { setSelectedDate(todayObj.dateStr); setSelectedSlot(null); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedDate === todayObj.dateStr ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                오늘 ({todayObj.display})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedDate(tomorrowObj.dateStr); setSelectedSlot(null); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedDate === tomorrowObj.dateStr ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                내일 ({tomorrowObj.display})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedDate(dayAfterObj.dateStr); setSelectedSlot(null); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedDate === dayAfterObj.dateStr ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dayAfterObj.display}
              </button>
            </div>
          </div>

          {/* 2-HOUR TIME SLOTS (09:00 ~ 19:00) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>타임슬롯 선택 (매일 09시 ~ 19시, 2시간 단위)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  기준: <strong>{selectedDate}</strong> · {selectedStore} · {selectedRoom}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> 예약 가능
                </span>
                <span className="flex items-center gap-1 text-purple-700">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> 내 예약
                </span>
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> 타 플래너 예약중 (잠금)
                </span>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="space-y-3">
              {FITTING_TIME_SLOTS.map((slot, index) => {
                const { status, booking, wasCancelled } = checkSlotStatus(slot);
                const isSelected = selectedSlot === slot;

                // 1. LOCKED BY ANOTHER PLANNER
                if (status === 'locked') {
                  return (
                    <div
                      key={slot}
                      className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-between text-xs opacity-75 cursor-not-allowed select-none transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 text-sm">{slot}</span>
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                              예약 불가 (타 플래너 예약 완료)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            예약 선점: <strong className="text-slate-700">{booking?.plannerCode || '타 플래너'}</strong>
                            {booking?.customerName ? ` (${booking.customerName.slice(0, 1)}* 고객님)` : ''}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        중복 예약 불가 ✕
                      </span>
                    </div>
                  );
                }

                // 2. BOOKED BY THIS CURRENT PLANNER
                if (status === 'mine') {
                  return (
                    <div
                      key={slot}
                      className="p-4 bg-purple-50/80 border-2 border-purple-500 rounded-xl flex items-center justify-between text-xs shadow-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-purple-900 text-sm">{slot}</span>
                            <span className="bg-purple-200 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              내가 예약 완료
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                              {booking?.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            고객: <strong className="text-slate-900">{booking?.customerName}</strong> ({booking?.phone})
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancel(booking!.id, `${selectedDate} ${slot}`)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>예약 취소 (슬롯 해제)</span>
                      </button>
                    </div>
                  );
                }

                // 3. AVAILABLE (OR FREED BY CANCELLATION)
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <Unlock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{slot}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {index + 1}회차 · 예약 가능
                          </span>
                          {wasCancelled && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              최근 취소로 재가용됨
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          2시간 VIP 프라이빗 피팅 타임슬롯 선점 가능
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white'
                      }`}>
                        {isSelected ? '선택됨 ✓' : '예약하기'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reservation Form & My Bookings (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Reservation Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>신부 피팅 예약 정보 입력</span>
            </h3>

            {selectedSlot ? (
              <form onSubmit={handleReserveSlot} className="space-y-3.5 text-xs">
                {/* Selected Slot Summary Card */}
                <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-xs">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">선택된 예약 정보</span>
                  <div className="font-bold text-slate-900 mt-1">
                    {selectedDate} · <span className="text-purple-700">{selectedSlot}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {selectedStore} · {selectedRoom}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">신부 / 신랑 성함 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 송지은 & 김민우"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">연락처 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">본식 예정일</label>
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">예식 장소</label>
                    <input
                      type="text"
                      value={weddingVenue}
                      onChange={(e) => setWeddingVenue(e.target.value)}
                      placeholder="호텔/웨딩홀"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Dress Selection for Fitting */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">피팅 희망 드레스 선택</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {dresses.slice(0, 6).map((d) => {
                      const isChecked = selectedDressIds.includes(d.id);
                      return (
                        <div
                          key={d.id}
                          onClick={() => {
                            setSelectedDressIds(prev =>
                              isChecked ? prev.filter(id => id !== d.id) : [...prev, d.id]
                            );
                          }}
                          className={`p-1.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                            isChecked ? 'bg-purple-50 border-purple-400 font-bold' : 'bg-white border-slate-200'
                          }`}
                        >
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-10 object-cover rounded shrink-0"
                          />
                          <div className="truncate">
                            <span className="block truncate text-[11px] text-slate-900">{d.name}</span>
                            <span className="text-[9px] text-slate-400">₩{d.rentalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? '예약 처리 중...' : '피팅룸 예약 확정 (타 플래너 중복 차단)'}</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  * 예약 즉시 해당 일시의 타임슬롯은 다른 플래너가 선택할 수 없도록 자동 잠금됩니다.
                </p>
              </form>
            ) : (
              <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">
                  좌측에서 원하시는 타임슬롯을 선택해주세요.
                </p>
                <p className="text-[11px] text-slate-400">
                  매일 09시부터 19시까지 2시간 단위로 비어 있는 시간대(초록색)를 선택하시면 예약 폼이 활성화됩니다.
                </p>
              </div>
            )}
          </div>

          {/* MY BOOKINGS LIST */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span>내가 예약한 피팅룸 현황</span>
              </h3>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                총 {myBookings.length}건
              </span>
            </div>

            {myBookings.length === 0 ? (
              <p className="p-4 text-center text-slate-400">
                현재 플래너님께서 등록하신 피팅룸 예약이 없습니다.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {myBookings.map((b) => {
                  const isCancelled = b.status === '취소' || b.status === '예약취소';
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border transition ${
                        isCancelled
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-purple-50/40 border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{b.customerName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="mt-1 text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1 font-semibold text-purple-900">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          <span>{b.date} · {b.timeSlot}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {b.storeName} ({b.fittingRoom})
                        </div>
                        <div className="text-[10px] text-slate-400">
                          📞 {b.phone} · 예식: {b.weddingVenue || '미정'}
                        </div>
                      </div>

                      {/* Cancel button if active */}
                      {!isCancelled && (
                        <div className="pt-2 mt-2 border-t border-purple-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            ID: {b.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCancel(b.id, `${b.date} ${b.timeSlot}`)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[10px] transition"
                          >
                            예약 취소 (슬롯 재오픈)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Planners Database Table Modal */}
      {isPlannerDbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/30">
                  <Database className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">본사 인증 플래너 DB 테이블 (<code className="font-mono text-purple-200">planners</code>)</h3>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      실시간 연동
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/80 mt-0.5">
                    본사 발급 고유 번호(하이픈 포함 8자리, 예: 26-00275)로 가입 및 관리되는 독립 플래너 데이터베이스
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlannerDbModalOpen(false)}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-info Bar */}
            <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                총 <strong>{plannersList.length}명</strong>의 공인 플래너가 등록되어 있으며, 피팅룸 실시간 예약 권한을 보유합니다.
              </span>
              <button
                type="button"
                onClick={fetchPlannersDb}
                disabled={isLoadingPlanners}
                className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlanners ? 'animate-spin' : ''}`} />
                <span>새로고침</span>
              </button>
            </div>

            {/* Modal Body: Table */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">고유 플래너 번호</th>
                      <th className="py-2.5 px-3">플래너명</th>
                      <th className="py-2.5 px-3">소속 대리점 / 지사</th>
                      <th className="py-2.5 px-3">직급 / 등급</th>
                      <th className="py-2.5 px-3">정산 배분율</th>
                      <th className="py-2.5 px-3 text-center">인증 상태</th>
                      <th className="py-2.5 px-3 text-right">피팅 예약 적용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {plannersList.map((p) => {
                      const isSelected = activePlanner.startsWith(p.plannerNumber);
                      return (
                        <tr key={p.plannerNumber} className={`hover:bg-purple-50/50 transition ${isSelected ? 'bg-purple-50/80 font-bold' : ''}`}>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded text-xs">
                              {p.plannerNumber}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-900">
                            {p.name}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {p.agency}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                              {p.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {p.commissionRate}%
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3 text-emerald-600" />
                              본사인증
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setActivePlanner(`${p.plannerNumber} (${p.name} 플래너)`);
                                setIsPlannerDbModalOpen(false);
                                showNotice(`현재 피팅룸 예약 플래너가 '${p.plannerNumber} (${p.name})' 님으로 변경되었습니다.`);
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                                isSelected
                                  ? 'bg-purple-600 text-white cursor-default'
                                  : 'bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700'
                              }`}
                            >
                              {isSelected ? '선택 중 ✓' : '선택하기'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* DB Architecture Guide note */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                  <span>플래너 DB 테이블 연동 구조 안내</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  • <strong>테이블 분리 원칙:</strong> 일반 회원과 달리 플래너는 본사 승인 고유 번호(XX-XXXXX 형식, 8자리)를 가지며, 전용 <code className="font-mono bg-white px-1 py-0.5 border rounded">planners</code> 테이블에 소속 지사, 커미션 배분율, 인증 상태 등이 영구 보관됩니다.
                  <br />
                  • <strong>예약 권한 제어:</strong> 대리점 피팅룸 실시간 예약 및 슬롯 선점은 오직 본사 인증 플래너 번호를 보유한 계정만 집행할 수 있도록 접근이 보호됩니다.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPlannerDbModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
