import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, CheckCircle2, XCircle, User, Phone, MapPin,
  Filter, ChevronLeft, ChevronRight, RefreshCw,
  DoorClosed, Lock, Unlock, Eye, Sparkles
} from 'lucide-react';
import { BookingItem, DressItem, FITTING_TIME_SLOTS, FITTING_STORES, FITTING_ROOMS } from '../../data/liveData';

interface PmsFittingRoomManagerProps {
  bookings: BookingItem[];
  dresses: DressItem[];
  onUpdateBookingStatus: (bookingId: string, status: BookingItem['status'], stylist?: string) => void;
  onRefresh?: () => void;
}

export const PmsFittingRoomManager: React.FC<PmsFittingRoomManagerProps> = ({
  bookings,
  dresses,
  onUpdateBookingStatus,
  onRefresh
}) => {
  // Selected Date state (Default: '2026-05-24' or current date)
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-24');
  const [selectedStore, setSelectedStore] = useState<string>('전체');
  const [selectedRoom, setSelectedRoom] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<BookingItem | null>(null);

  // Date controls
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    if (!isNaN(current.getTime())) {
      current.setDate(current.getDate() + days);
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  // KPIs
  const totalBookingsCount = bookings.length;
  const activeBookings = bookings.filter(b => b.status !== '취소' && b.status !== '예약취소');
  const activeBookingsCount = activeBookings.length;
  const cancelledBookingsCount = bookings.filter(b => b.status === '취소' || b.status === '예약취소').length;
  const todayBookingsCount = bookings.filter(b => b.date === selectedDate && b.status !== '취소' && b.status !== '예약취소').length;

  // Stores and rooms list
  const storeList = useMemo(() => {
    return ['전체', ...FITTING_STORES];
  }, []);

  const roomList = useMemo(() => {
    return ['전체', ...FITTING_ROOMS];
  }, []);

  // Filtered Bookings for List View
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedDate && selectedDate !== '' && b.date !== selectedDate && viewMode === 'grid') {
        return false;
      }
      if (selectedDate && selectedDate !== '' && b.date !== selectedDate && viewMode === 'table' && !searchQuery) {
        // In table view, if no search query, filter by date too
        return false;
      }
      if (selectedStore !== '전체' && b.storeName !== selectedStore) {
        return false;
      }
      if (selectedRoom !== '전체' && b.fittingRoom !== selectedRoom) {
        return false;
      }
      if (selectedStatus !== '전체') {
        if (selectedStatus === '예약취소' && b.status !== '취소' && b.status !== '예약취소') return false;
        if (selectedStatus !== '예약취소' && b.status !== selectedStatus) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCustomer = b.customerName.toLowerCase().includes(q);
        const matchPhone = b.phone.includes(q);
        const matchPlanner = (b.plannerCode || '').toLowerCase().includes(q);
        const matchId = b.id.toLowerCase().includes(q);
        if (!matchCustomer && !matchPhone && !matchPlanner && !matchId) return false;
      }
      return true;
    });
  }, [bookings, selectedDate, selectedStore, selectedRoom, selectedStatus, searchQuery, viewMode]);

  // Handle Cancel Booking from PMS
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(`정말로 예약(${bookingId})을 취소하시겠습니까?\n취소 즉시 해당 일시의 타임슬롯이 다른 플래너에게 '예약 가능' 상태로 재가용됩니다.`)) {
      onUpdateBookingStatus(bookingId, '예약취소');
      if (selectedBookingForModal && selectedBookingForModal.id === bookingId) {
        setSelectedBookingForModal(prev => prev ? { ...prev, status: '예약취소' } : null);
      }
    }
  };

  // Quick Status Change
  const handleChangeStatus = (bookingId: string, newStatus: BookingItem['status']) => {
    onUpdateBookingStatus(bookingId, newStatus);
    if (selectedBookingForModal && selectedBookingForModal.id === bookingId) {
      setSelectedBookingForModal(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Helper to find booking for a room & timeSlot on selectedDate
  const getBookingForSlot = (store: string, room: string, slot: string) => {
    // Find active booking first
    const active = bookings.find(
      b => b.date === selectedDate &&
           b.storeName === store &&
           b.fittingRoom === room &&
           b.timeSlot === slot &&
           b.status !== '취소' &&
           b.status !== '예약취소'
    );
    if (active) return { booking: active, isCancelled: false };

    // Check if there was a cancelled booking
    const cancelled = bookings.find(
      b => b.date === selectedDate &&
           b.storeName === store &&
           b.fittingRoom === room &&
           b.timeSlot === slot &&
           (b.status === '취소' || b.status === '예약취소')
    );
    if (cancelled) return { booking: cancelled, isCancelled: true };

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <DoorClosed className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              전국 대리점 피팅룸 실시간 예약 통합 관제 현황 (PMS)
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              실시간 동기화
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            플래너 및 고객의 피팅룸 타임슬롯(09:00~19:00 / 2시간 단위) 예약 점유, 독점 락(Lock) 해제 및 일시별 스케줄을 실시간 제어합니다.
          </p>
        </div>

        {/* View Mode Toggle & Refresh */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition"
              title="데이터 새로고침"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'grid' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              타임슬롯 매트릭스 뷰
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'table' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              예약 목록 상세 뷰 ({bookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>선택 일자({selectedDate}) 예약</span>
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {todayBookingsCount}건
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">
            {FITTING_ROOMS.length * FITTING_TIME_SLOTS.length}개 슬롯 중 점유
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>전체 유효 점유 슬롯</span>
          </span>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            {activeBookingsCount}건
          </div>
          <span className="text-[10px] text-slate-500">타 플래너 예약 중복 차단</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Unlock className="w-3.5 h-3.5 text-amber-600" />
            <span>취소 및 재가용 슬롯</span>
          </span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {cancelledBookingsCount}건
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">예약 취소 즉시 재예약 가능</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>운영 시간 규격</span>
          </span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            09:00 ~ 19:00
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">2시간 단위 5개 타임슬롯</span>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Date Navigator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => handleShiftDate(-1)}
                className="p-1 hover:bg-white text-slate-600 rounded transition"
                title="이전 날"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-0.5 bg-transparent text-xs font-bold text-slate-900 border-none outline-none cursor-pointer"
              />
              <button
                onClick={() => handleShiftDate(1)}
                className="p-1 hover:bg-white text-slate-600 rounded transition"
                title="다음 날"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedDate('2026-05-24')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                selectedDate === '2026-05-24'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              5월 24일
            </button>
            <button
              onClick={() => setSelectedDate('2026-05-25')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                selectedDate === '2026-05-25'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              5월 25일
            </button>
            <button
              onClick={() => setSelectedDate('2026-05-26')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                selectedDate === '2026-05-26'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              5월 26일
            </button>
          </div>

          {/* Store & Room Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">지점:</span>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {storeList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">피팅룸:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {roomList.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">상태:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="전체">전체 상태</option>
                <option value="예약확정">예약확정 (점유)</option>
                <option value="피팅완료">피팅완료</option>
                <option value="계약체결">계약체결</option>
                <option value="예약취소">예약취소 (해제됨)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: TIME-SLOT MATRIX GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          {(selectedStore === '전체' ? FITTING_STORES : [selectedStore]).map((store) => (
            <div key={store} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{store}</h3>
                  <span className="text-[11px] text-slate-500">
                    기준 일자: <strong>{selectedDate}</strong>
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  매일 09:00 ~ 19:00 (2시간 슬롯 × 5타임)
                </span>
              </div>

              <div className="p-4 overflow-x-auto">
                <div className="min-w-[760px] space-y-4">
                  {/* Timeline Header */}
                  <div className="grid grid-cols-6 gap-2 text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
                    <div className="text-slate-700 pl-2">피팅룸 구분</div>
                    {FITTING_TIME_SLOTS.map((slot, idx) => (
                      <div key={slot} className="text-center bg-slate-100/60 py-1 rounded-md text-slate-700 font-bold">
                        <span className="block text-[10px] text-purple-700 font-semibold">{idx + 1}회차 (2시간)</span>
                        <span>{slot}</span>
                      </div>
                    ))}
                  </div>

                  {/* Room Rows */}
                  {(selectedRoom === '전체' ? FITTING_ROOMS : [selectedRoom]).map((room) => (
                    <div key={room} className="grid grid-cols-6 gap-2 items-stretch py-1">
                      {/* Room Label */}
                      <div className="flex flex-col justify-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-xs text-slate-900">{room}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">VIP 단독 피팅 공간</span>
                      </div>

                      {/* 5 Time Slots */}
                      {FITTING_TIME_SLOTS.map((slot) => {
                        const slotData = getBookingForSlot(store, room, slot);

                        // 1. Slot is Vacant / Available
                        if (!slotData) {
                          return (
                            <div
                              key={slot}
                              className="p-3 bg-emerald-50/40 hover:bg-emerald-50/80 border border-dashed border-emerald-200 rounded-xl flex flex-col justify-between text-center transition min-h-[110px]"
                            >
                              <div className="flex items-center justify-between text-[10px] text-emerald-700">
                                <span className="font-semibold">{slot.split(' ')[0]}</span>
                                <Unlock className="w-3 h-3 text-emerald-500" />
                              </div>
                              <div className="my-auto">
                                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full">
                                  공실 (예약 가능)
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1">모든 플래너 예약 가능</p>
                              </div>
                            </div>
                          );
                        }

                        // 2. Slot was Cancelled (Slot is now freed & available!)
                        if (slotData.isCancelled) {
                          const b = slotData.booking;
                          return (
                            <div
                              key={slot}
                              className="p-3 bg-amber-50/40 border border-dashed border-amber-300 rounded-xl flex flex-col justify-between transition min-h-[110px]"
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-amber-800">{slot.split(' ')[0]}</span>
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[9px]">
                                  취소됨 · 재가용
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 line-through block font-medium">
                                  {b.customerName}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {b.plannerCode || '직영 포털'}
                                </span>
                              </div>
                              <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1 pt-1 border-t border-amber-200">
                                <Unlock className="w-2.5 h-2.5" />
                                <span>타 플래너 예약 가능</span>
                              </div>
                            </div>
                          );
                        }

                        // 3. Slot is Actively Booked
                        const b = slotData.booking;
                        return (
                          <div
                            key={slot}
                            className="p-3 bg-white border-2 border-purple-400/80 rounded-xl shadow-xs flex flex-col justify-between transition hover:shadow-md min-h-[110px] relative group"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-800">{slot.split(' ')[0]}</span>
                              <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                                b.status === '계약체결'
                                  ? 'bg-purple-100 text-purple-800'
                                  : b.status === '피팅완료'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {b.status}
                              </span>
                            </div>

                            <div className="my-1">
                              <span className="font-bold text-xs text-slate-900 block truncate">
                                {b.customerName}
                              </span>
                              <span className="text-[10px] text-purple-700 font-semibold block truncate">
                                {b.plannerCode || '직영 고객'}
                              </span>
                              <span className="text-[9px] text-slate-400 block truncate">
                                📞 {b.phone}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
                              <span className="text-slate-400 truncate max-w-[70px]">
                                {b.assignedStylist ? b.assignedStylist.split(' ')[0] : '스타일리스트'}
                              </span>
                              <button
                                onClick={() => setSelectedBookingForModal(b)}
                                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold transition flex items-center gap-0.5"
                              >
                                <Eye className="w-2.5 h-2.5" />
                                <span>관리</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW OF ALL BOOKINGS */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              전체 피팅룸 예약 데이터 목록 ({filteredBookings.length}건)
            </h3>
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="고객명, 연락처, 플래너 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3">예약코드</th>
                  <th className="p-3">예약일시 / 타임슬롯</th>
                  <th className="p-3">대리점 매장 / 룸</th>
                  <th className="p-3">고객명 & 연락처</th>
                  <th className="p-3">담당 플래너</th>
                  <th className="p-3">담당 스타일리스트</th>
                  <th className="p-3 text-center">예약 상태</th>
                  <th className="p-3 text-center">PMS 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      선택한 조건에 일치하는 피팅룸 예약이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const isCancelled = b.status === '취소' || b.status === '예약취소';
                    return (
                      <tr key={b.id} className={`hover:bg-slate-50/80 transition ${isCancelled ? 'bg-slate-50/50 opacity-70' : ''}`}>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {b.id}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{b.date}</span>
                          <span className="text-[11px] text-purple-700 font-semibold">{b.timeSlot}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-800 block">{b.storeName}</span>
                          <span className="text-[10px] text-slate-500">{b.fittingRoom}</span>
                        </td>
                        <td className="p-3">
                          <span className={`font-bold block ${isCancelled ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {b.customerName}
                          </span>
                          <span className="text-[11px] text-slate-500">{b.phone}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                            {b.plannerCode || '직영 포털'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">
                          {b.assignedStylist || '미배정'}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : b.status === '계약체결'
                              ? 'bg-purple-100 text-purple-800'
                              : b.status === '피팅완료'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedBookingForModal(b)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition"
                            >
                              상세보기
                            </button>
                            {!isCancelled && (
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-[11px] transition"
                              >
                                예약취소
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKING DETAIL & MANAGEMENT MODAL */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  피팅룸 예약 상세 및 상태 제어
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  예약 코드: {selectedBookingForModal.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Status Alert */}
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
              selectedBookingForModal.status === '취소' || selectedBookingForModal.status === '예약취소'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : selectedBookingForModal.status === '계약체결'
                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                : selectedBookingForModal.status === '피팅완료'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                {selectedBookingForModal.status === '취소' || selectedBookingForModal.status === '예약취소' ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>현재 상태: <strong>{selectedBookingForModal.status}</strong></span>
              </div>
              {selectedBookingForModal.status === '취소' || selectedBookingForModal.status === '예약취소' ? (
                <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded text-rose-700 border border-rose-200">
                  타임슬롯 해제 완료 (재예약 가능)
                </span>
              ) : (
                <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded text-indigo-700 border border-indigo-200">
                  타 플래너 예약 중복 잠금(Lock) 활성
                </span>
              )}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">고객 성명 & 연락처</span>
                <span className="font-bold text-slate-900 block">{selectedBookingForModal.customerName}</span>
                <span className="text-slate-600 block">{selectedBookingForModal.phone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">예약 일시 & 타임슬롯</span>
                <span className="font-bold text-slate-900 block">{selectedBookingForModal.date}</span>
                <span className="font-bold text-purple-700 block">{selectedBookingForModal.timeSlot}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">대리점 매장 & 피팅룸</span>
                <span className="font-bold text-slate-900 block truncate">{selectedBookingForModal.storeName}</span>
                <span className="text-slate-600 block">{selectedBookingForModal.fittingRoom}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">담당 플래너 정보</span>
                <span className="font-bold text-purple-700 block">{selectedBookingForModal.plannerCode || '직영 포털'}</span>
                <span className="text-[10px] text-slate-500 block">수수료 15% 정산 연동</span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">본식 정보</span>
                <span className="font-medium text-slate-800 block">
                  예정일: {selectedBookingForModal.weddingDate || '미정'} · 예식 장소: {selectedBookingForModal.weddingVenue || '미정'}
                </span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block text-[10px]">담당 스타일리스트</span>
                <span className="font-bold text-slate-900 block">
                  {selectedBookingForModal.assignedStylist || '미배정 (현장 배정)'}
                </span>
              </div>
            </div>

            {/* Selected Dresses Preview */}
            {selectedBookingForModal.selectedDresses && selectedBookingForModal.selectedDresses.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  피팅 희망 드레스 ({selectedBookingForModal.selectedDresses.length}벌)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBookingForModal.selectedDresses.map((dressId) => {
                    const dress = dresses.find(d => d.id === dressId);
                    return (
                      <div key={dressId} className="p-2 bg-purple-50/50 rounded-lg border border-purple-100 flex items-center gap-2 text-xs">
                        {dress?.imageUrl && (
                          <img
                            src={dress.imageUrl}
                            alt={dress.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-12 object-cover rounded"
                          />
                        )}
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">{dress?.name || dressId}</span>
                          <span className="text-[10px] text-slate-500">{dress?.designer || '하이엔드 컬렉션'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PMS Control Actions */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                PMS 관리자 상태 변경
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleChangeStatus(selectedBookingForModal.id, '예약확정')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedBookingForModal.status === '예약확정'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  예약확정 (점유)
                </button>
                <button
                  onClick={() => handleChangeStatus(selectedBookingForModal.id, '피팅완료')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedBookingForModal.status === '피팅완료'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  피팅완료
                </button>
                <button
                  onClick={() => handleChangeStatus(selectedBookingForModal.id, '계약체결')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedBookingForModal.status === '계약체결'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  계약체결
                </button>
              </div>

              {/* Cancellation Button */}
              {selectedBookingForModal.status !== '취소' && selectedBookingForModal.status !== '예약취소' && (
                <div className="pt-2">
                  <button
                    onClick={() => handleCancelBooking(selectedBookingForModal.id)}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>예약 취소 및 타임슬롯 즉시 해제</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    * 예약 취소 시 즉시 데이터베이스 및 다른 플래너 화면에서 이 타임슬롯이 '예약 가능' 상태로 전환됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
