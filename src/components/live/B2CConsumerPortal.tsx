import React, { useState } from 'react';
import { 
  Sparkles, Calendar, MapPin, Search, Filter, ShoppingBag, Heart, 
  Check, Star, Clock, ChevronRight, Store, ArrowRight, UserCheck, CheckCircle2,
  CalendarCheck, X, CreditCard, Video, CheckSquare, Database
} from 'lucide-react';
import { DressItem, BookingItem, FITTING_TIME_SLOTS, FITTING_ROOMS } from '../../data/liveData';
import heroShowroomImg from '../../assets/images/hero_wedding_showroom_1788513831356.jpg';
import { PaymentModal } from './PaymentModal';
import { TiktokWanghongModal } from './TiktokWanghongModal';
import { UserMenu } from '../auth/UserMenu';
import { AiDressRecommendationView } from './AiDressRecommendationView';
import { B2CFittingBookingView } from './B2CFittingBookingView';

interface B2CConsumerPortalProps {
  dresses: DressItem[];
  bookings: BookingItem[];
  onBookFitting: (booking: Omit<BookingItem, 'id' | 'status'>) => Promise<void> | void;
  onCancelBooking?: (bookingId: string) => void;
  onRequestBookingOpen: (dressId?: string) => void;
  onUpdateBookingPayment?: (bookingId: string, paymentInfo: any) => void;
}

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const B2CConsumerPortal: React.FC<B2CConsumerPortalProps> = ({
  dresses,
  bookings,
  onBookFitting,
  onCancelBooking,
  onRequestBookingOpen,
  onUpdateBookingPayment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'ai-recommend' | 'fitting-booking' | 'mywedding'>('catalog');
  const [previewDress, setPreviewDress] = useState<DressItem | null>(null);

  // Batch Dress Selection State (Max 3 dresses for simultaneous fitting)
  const [selectedBatchDressIds, setSelectedBatchDressIds] = useState<string[]>([]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isTiktokModalOpen, setIsTiktokModalOpen] = useState<boolean>(false);
  const [targetBookingIdForPayment, setTargetBookingIdForPayment] = useState<string | undefined>(undefined);

  const handleOpenPaymentModal = (bookingId?: string) => {
    setTargetBookingIdForPayment(bookingId);
    setIsPaymentModalOpen(true);
  };
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    phone: '',
    storeName: '항저우 왕차오 센터점 (Wangchao Center)',
    date: getTodayDateString(),
    timeSlot: '14:00 ~ 16:00',
    fittingRoom: 'VIP Suite 1 (로열룸)',
    selectedDresses: [] as string[],
    weddingDate: '2026-10-18',
    weddingVenue: '인터컨티넨탈 호텔 그랜드볼룸',
    plannerCode: 'PLN-SH-882 (정하윤 플래너 추천)'
  });

  const categories = [
    { key: 'ALL', label: '전체 드레스' },
    { key: 'Ball Gown', label: '벨라인 (Ball Gown)' },
    { key: 'Mermaid', label: '머메이드 (Mermaid)' },
    { key: 'A-Line', label: '에이라인 (A-Line)' },
    { key: 'Empire', label: '엠파이어 (Empire)' },
    { key: 'Traditional Fusion', label: '오리엔탈 퓨전' },
  ];

  const stores = [
    '항저우 왕차오 센터점 (Wangchao Center)',
    '상하이 와이탄 플래그십 (The Bund)',
    '베이징 싼리툰 쇼룸 (Sanlitun)',
    '서울 청담 부티크 (Cheongdam)'
  ];

  const filteredDresses = dresses.filter((dress) => {
    if (dress.status === '심사대기') return false; // Not yet approved by PMS
    const matchesCategory = selectedCategory === 'ALL' || dress.category === selectedCategory;
    const matchesSearch = 
      dress.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      dress.designer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      dress.silhouette.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      dress.tag.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleBatchDress = (dressId: string) => {
    setSelectedBatchDressIds(prev => {
      if (prev.includes(dressId)) {
        return prev.filter(id => id !== dressId);
      }
      if (prev.length >= 3) {
        alert('피팅 예약은 한 번에 최대 3벌까지 선택 가능합니다. 기존 선택을 해제한 후 다시 선택해 주세요.');
        return prev;
      }
      return [...prev, dressId];
    });
  };

  const handleOpenBatchBooking = () => {
    const today = getTodayDateString();
    setBookingForm(prev => ({
      ...prev,
      date: today,
      selectedDresses: selectedBatchDressIds.length > 0 ? [...selectedBatchDressIds] : []
    }));
    setIsBookingModalOpen(true);
  };

  const handleOpenBooking = (dress?: DressItem) => {
    const today = getTodayDateString();
    if (dress) {
      // If user has batch selection including this dress, keep batch; else prioritize this dress
      const initialDresses = selectedBatchDressIds.includes(dress.id)
        ? selectedBatchDressIds
        : [dress.id];
      setBookingForm(prev => ({
        ...prev,
        date: today,
        selectedDresses: initialDresses
      }));
    } else {
      setBookingForm(prev => ({
        ...prev,
        date: today,
        selectedDresses: selectedBatchDressIds.length > 0 ? [...selectedBatchDressIds] : []
      }));
    }
    setIsBookingModalOpen(true);
  };

  const handleToggleDressSelection = (id: string) => {
    setBookingForm(prev => {
      const exists = prev.selectedDresses.includes(id);
      if (exists) {
        const next = prev.selectedDresses.filter(d => d !== id);
        // Also sync batch state if user modifies inside modal
        setSelectedBatchDressIds(next);
        return { ...prev, selectedDresses: next };
      } else {
        if (prev.selectedDresses.length >= 3) {
          alert('피팅 예약 시 한 번에 최대 3벌까지 선택 가능합니다.');
          return prev;
        }
        const next = [...prev.selectedDresses, id];
        setSelectedBatchDressIds(next);
        return { ...prev, selectedDresses: next };
      }
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.phone) {
      alert('신부님 성함과 연락처를 입력해 주세요.');
      return;
    }
    if (bookingForm.selectedDresses.length === 0) {
      alert('피팅 희망 드레스를 1개 이상 (최대 3개) 선택해 주세요.');
      return;
    }

    // Check if slot is taken by another person
    const isTaken = bookings.some(
      (b) =>
        b.date === bookingForm.date &&
        b.storeName === bookingForm.storeName &&
        b.fittingRoom === bookingForm.fittingRoom &&
        b.timeSlot === bookingForm.timeSlot &&
        b.status !== '취소' &&
        b.status !== '예약취소'
    );
    if (isTaken) {
      alert(`[예약 불가] 해당 일시(${bookingForm.date} ${bookingForm.timeSlot})는 이미 다른 플래너/고객이 예약했습니다. 다른 시간대를 선택해 주세요.`);
      return;
    }

    try {
      await onBookFitting(bookingForm);
      setSelectedBatchDressIds([]); // Reset batch selection upon successful booking
      setIsBookingModalOpen(false);
      setActiveTab('mywedding');
    } catch (err: any) {
      alert(err.message || '예약 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSelectAllThreeDresses = (dressIds: string[]) => {
    setSelectedBatchDressIds(dressIds.slice(0, 3));
  };

  const handleOpenBookingModalWithDresses = (dressIds: string[]) => {
    const validIds = dressIds.slice(0, 3);
    setSelectedBatchDressIds(validIds);
    setBookingForm(prev => ({
      ...prev,
      selectedDresses: validIds
    }));
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Showcase Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroShowroomImg} 
            alt="TOBMALL Bridal Collection" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>S2B2C 혁신 글로벌 웨딩 드레스 쇼룸</span>
          </div>
          
          <h2 id="b2c-hero-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            한국 최고의 웨딩 드레스 디자이너의<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200">
              작품을 직접 만나보세요
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            원하는 드레스를 선택하고 1:1 맞춤 피팅을 경험하세요.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai-recommend')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition flex items-center gap-2 ring-2 ring-amber-300/40"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>AI 맞춤 드레스 3벌 추천</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('fitting-booking');
                setBookingForm(prev => ({ ...prev, date: getTodayDateString() }));
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>피팅룸 실시간 예약</span>
            </button>

            <button
              onClick={() => setActiveTab('mywedding')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>마이웨딩 예약 조회 ({bookings.length}건)</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Mini USP Stats */}
        <div className="relative z-10 border-t border-white/10 bg-slate-950/60 backdrop-blur-xs px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">글로벌 보유 드레스</span>
            <span className="font-bold text-white text-sm">10,000+ 벌</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">파트너 디자이너</span>
            <span className="font-bold text-white text-sm">150+ 아틀리에</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">오프라인 피팅샵</span>
            <span className="font-bold text-white text-sm">항저우·상하이·베이징</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">본식 헬퍼(이모) 케어</span>
            <span className="font-bold text-purple-300 text-sm">전문 자격증 100%</span>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector (Catalog vs My Wedding) */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>드레스 전체</span>
          </button>

          {/* AI 추천 메뉴 */}
          <button
            onClick={() => setActiveTab('ai-recommend')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs border ${
              activeTab === 'ai-recommend'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-800 ring-2 ring-purple-300 shadow-md'
                : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI 맞춤 추천</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
              activeTab === 'ai-recommend' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              3벌 큐레이션
            </span>
          </button>

          {/* 피팅룸 실시간 예약 메뉴 (fitting_bookings DB 연동) */}
          <button
            onClick={() => {
              setActiveTab('fitting-booking');
              setBookingForm(prev => ({ ...prev, date: getTodayDateString() }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs border ${
              activeTab === 'fitting-booking'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-800 ring-2 ring-purple-300 shadow-md'
                : 'bg-white hover:bg-purple-50 text-purple-750 border-purple-200 hover:border-purple-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>피팅룸 실시간 예약</span>
          </button>

          <button
            onClick={() => setActiveTab('mywedding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'mywedding'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>나의 예약 ({bookings.length})</span>
          </button>

          {/* 피팅 예약 모달 열기 버튼 (최대 3벌) */}
          <button
            onClick={handleOpenBatchBooking}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs border ${
              selectedBatchDressIds.length > 0
                ? 'bg-purple-700 hover:bg-purple-800 text-white border-purple-800 ring-2 ring-purple-300'
                : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
            }`}
            title="원하는 드레스를 최대 3벌 선택하여 한 번에 피팅 예약합니다"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>피팅 예약</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              selectedBatchDressIds.length > 0
                ? 'bg-white text-purple-900'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {selectedBatchDressIds.length}/3벌 선택
            </span>
          </button>

          <button
            onClick={() => handleOpenPaymentModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-[#003087] via-[#0079C1] to-emerald-600 hover:opacity-95 text-white shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>간편 결제</span>
            <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">DEMO</span>
          </button>

          <button
            onClick={() => setIsTiktokModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white shadow-xs border border-slate-800"
          >
            <Video className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>틱톡 LIVE</span>
          </button>
        </div>

        {/* 로그인, 회원가입 메뉴 (우측 삭제된 라벨 위치로 이동) */}
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>

      {/* TAB 1: DRESS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === c.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="드레스명, 디자이너, 실루엣 검색..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Dress Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDresses.map((dress) => {
              const isBatchSelected = selectedBatchDressIds.includes(dress.id);
              const batchOrder = selectedBatchDressIds.indexOf(dress.id) + 1;

              return (
                <div 
                  key={dress.id}
                  className={`group bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                    isBatchSelected
                      ? 'border-purple-500 shadow-md ring-2 ring-purple-400/40 bg-purple-50/10'
                      : 'border-slate-200 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Dress Image with Badge */}
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                    <img 
                      src={dress.imageUrl} 
                      alt={dress.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Quick Selection Checkbox for Batch Booking */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBatchDress(dress.id);
                      }}
                      className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-md backdrop-blur-md ${
                        isBatchSelected
                          ? 'bg-purple-600 text-white ring-2 ring-white shadow-purple-900/30'
                          : 'bg-slate-900/80 hover:bg-slate-900 text-white'
                      }`}
                      title={isBatchSelected ? '선택 취소' : '일괄 피팅 예약 목록에 담기 (최대 3벌)'}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{isBatchSelected ? `선택 (${batchOrder}/3)` : '피팅 담기'}</span>
                    </button>

                    <div className="absolute top-11 left-3 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {dress.tag}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-purple-700 backdrop-blur-xs">
                        {dress.silhouette}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dress.status === '가용' 
                          ? 'bg-emerald-500 text-white' 
                          : dress.status === '피팅중' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {dress.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/70 backdrop-blur-xs p-2.5 rounded-xl text-white flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-300 block">권장 일일 대여가</span>
                        <span className="font-bold text-amber-300 text-sm">
                          ₩{dress.rentalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-slate-300">
                        <span>보증금: ₩{dress.deposit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dress Info Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{dress.designer}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{dress.rating}</span>
                          <span className="text-slate-400">({dress.rentalCount}회 대여)</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition line-clamp-1">
                        {dress.name}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {dress.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBatchDress(dress.id)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                          isBatchSelected
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-purple-50/80 hover:bg-purple-100 text-purple-700 border border-purple-200'
                        }`}
                        title="최대 3벌 일괄 예약 목록에 추가/제외"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{isBatchSelected ? '선택 해제' : '피팅 담기'}</span>
                      </button>

                      <button
                        onClick={() => setPreviewDress(dress)}
                        className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => handleOpenBooking(dress)}
                        className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1"
                      >
                        <span>예약하기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Floating Bar for Batch Fitting Reservation */}
          {selectedBatchDressIds.length > 0 && (
            <div className="sticky bottom-6 z-40 bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-purple-500/40 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  {selectedBatchDressIds.length}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>선택한 드레스 {selectedBatchDressIds.length}/3벌 피팅 대기</span>
                    <span className="text-[10px] text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded font-bold">
                      최대 3벌 동시 예약
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate max-w-[240px] sm:max-w-md">
                    {selectedBatchDressIds
                      .map(id => dresses.find(d => d.id === id)?.name)
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatchDressIds([])}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  선택 비우기
                </button>
                <button
                  type="button"
                  onClick={handleOpenBatchBooking}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>선택 드레스 피팅 예약하기 ({selectedBatchDressIds.length}벌)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: AI DRESS RECOMMENDATION */}
      {activeTab === 'ai-recommend' && (
        <AiDressRecommendationView
          dresses={dresses}
          selectedBatchDressIds={selectedBatchDressIds}
          onToggleBatchDress={handleToggleDressSelection}
          onSelectAllThreeDresses={handleSelectAllThreeDresses}
          onOpenBookingModalWithDresses={handleOpenBookingModalWithDresses}
          onPreviewDress={(dress) => setPreviewDress(dress)}
        />
      )}

      {/* TAB: FITTING ROOM BOOKING (SCR-B2C-003, fitting_bookings DB 연동) */}
      {activeTab === 'fitting-booking' && (
        <B2CFittingBookingView
          dresses={dresses}
          bookings={bookings}
          selectedBatchDressIds={selectedBatchDressIds}
          onToggleBatchDress={handleToggleDressSelection}
          onSelectAllThreeDresses={handleSelectAllThreeDresses}
          onBookFitting={onBookFitting}
          onCancelBooking={onCancelBooking}
          onViewMyBookings={() => setActiveTab('mywedding')}
        />
      )}

      {/* TAB 2: MY WEDDING DASHBOARD */}
      {activeTab === 'mywedding' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    MY WEDDING DASHBOARD
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>fitting_bookings DB 실시간 동기화</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  나의 피팅 예약 및 대여 계약 현황 (SCR-B2C-004)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('fitting-booking')}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>+ 새로운 피팅룸 예약하기</span>
              </button>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className={`p-5 rounded-xl border transition space-y-3 ${
                      booking.status === '취소' || booking.status === '예약취소'
                        ? 'border-rose-200 bg-rose-50/30 opacity-75'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {booking.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {booking.customerName} 고객님 피팅 예약
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        booking.status === '예약취소' || booking.status === '취소'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : booking.status === '예약확정'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">방문 매장</span>
                        <span className="font-semibold text-slate-800">{booking.storeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">피팅 일시 / 룸</span>
                        <span className="font-semibold text-slate-800">{booking.date} ({booking.timeSlot})</span>
                        <span className="text-[11px] text-purple-600 block">{booking.fittingRoom}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">본식 예정일 / 홀</span>
                        <span className="font-semibold text-slate-800">{booking.weddingDate}</span>
                        <span className="text-[11px] text-slate-600 block truncate">{booking.weddingVenue}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">담당 스타일리스트</span>
                        <span className="font-semibold text-indigo-700">{booking.assignedStylist || '배정 진행 중'}</span>
                        <span className="text-[10px] text-slate-400 block">{booking.plannerCode}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-slate-800">선택 피팅 드레스 ({booking.selectedDresses.length}벌): </strong>
                        {booking.selectedDresses.map((id, idx) => {
                          const d = dresses.find(item => item.id === id);
                          return (
                            <span 
                              key={id} 
                              className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-purple-200 text-purple-900 text-[11px] font-medium shadow-2xs"
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span>{d ? d.name : id}</span>
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Instant Cancellation Button (Releases slot in fitting_bookings DB) */}
                        {booking.status !== '취소' && booking.status !== '예약취소' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`[피팅 예약 취소 확인]\n정말로 ${booking.date} (${booking.timeSlot}) 예약을 취소하시겠습니까?\n\n취소 즉시 fitting_bookings DB에서 해당 일시/타임슬롯이 잠금 해제되어 다시 예약 가능한 상태로 복구됩니다.`)) {
                                if (onCancelBooking) {
                                  onCancelBooking(booking.id);
                                }
                              }
                            }}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                            title="예약 취소 시 fitting_bookings DB에서 해당 타임슬롯이 즉시 해제되어 다시 예약 가능해집니다."
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>예약 취소 (슬롯 즉시 재오픈)</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-medium border border-slate-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-slate-400" />
                            <span>예약 취소 완료 (타임슬롯 재오픈됨)</span>
                          </span>
                        )}

                        {booking.depositPaid ? (
                          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>보증금 결제 완료 ({booking.paymentMethod === 'paypal' ? 'PayPal' : booking.paymentMethod === 'alipay' ? '알리페이' : '위챗페이'})</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(booking.id)}
                            className="px-2.5 py-1 bg-gradient-to-r from-[#003087] via-[#0079C1] to-emerald-600 hover:opacity-95 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>보증금 간편결제 (PayPal/알리/위챗)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                현재 등록된 피팅 예약이 없습니다. 상단에서 피팅 예약을 진행해 보세요.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRESS DETAIL MODAL */}
      {previewDress && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setPreviewDress(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={previewDress.imageUrl} 
                  alt={previewDress.name} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="w-full sm:w-1/2 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {previewDress.silhouette}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{previewDress.name}</h3>
                  <span className="text-xs text-slate-500">{previewDress.designer}</span>

                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>대여 비용:</strong> ₩{previewDress.rentalPrice.toLocaleString()}</div>
                    <div><strong>보증금:</strong> ₩{previewDress.deposit.toLocaleString()}</div>
                    <div><strong>소재:</strong> {previewDress.fabric}</div>
                    <div><strong>제조 공방:</strong> {previewDress.workshop}</div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {previewDress.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const d = previewDress;
                    setPreviewDress(null);
                    handleOpenBooking(d);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
                >
                  본 드레스로 피팅룸 예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* O2O BOOKING MODAL (U4, U11) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">O2O 피팅 예약 (SCR-B2C-003)</span>
                <h3 className="text-base font-bold text-slate-900">오프라인 샵 방문 예약 및 본식 정보 등록</h3>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">신부님 성함 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 김지은"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">연락처 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">방문 대리점 매장 선택 *</label>
                <select
                  value={bookingForm.storeName}
                  onChange={(e) => setBookingForm({ ...bookingForm, storeName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {stores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">피팅 희망 일자 *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">피팅룸 선택 *</label>
                  <select
                    value={bookingForm.fittingRoom}
                    onChange={(e) => setBookingForm({ ...bookingForm, fittingRoom: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    {FITTING_ROOMS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">시간대 (09:00~19:00, 2시간 단위) *</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    {FITTING_TIME_SLOTS.map((slot) => {
                      const isTaken = bookings.some(
                        (b) =>
                          b.date === bookingForm.date &&
                          b.storeName === bookingForm.storeName &&
                          b.fittingRoom === bookingForm.fittingRoom &&
                          b.timeSlot === slot &&
                          b.status !== '취소' &&
                          b.status !== '예약취소'
                      );
                      return (
                        <option key={slot} value={slot} disabled={isTaken}>
                          {slot} {isTaken ? '(예약 불가 / 이미 예약됨)' : '(예약 가능)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Crucial Data: Wedding Date and Venue */}
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                <span className="font-bold text-purple-900 block">
                  ★ 본식 정보 등록 (도면 U4, U11 필수 규격)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">본식 예정일</label>
                    <input
                      type="date"
                      value={bookingForm.weddingDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, weddingDate: e.target.value })}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">예식홀 및 장소</label>
                    <input
                      type="text"
                      value={bookingForm.weddingVenue}
                      onChange={(e) => setBookingForm({ ...bookingForm, weddingVenue: e.target.value })}
                      placeholder="호텔 또는 웨딩홀 이름"
                      className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Dress selection picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 block text-xs">
                    시착 희망 드레스 선택 (최대 3벌 일괄 선택)
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    bookingForm.selectedDresses.length === 3
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : bookingForm.selectedDresses.length > 0
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bookingForm.selectedDresses.length} / 3벌 선택됨
                  </span>
                </div>

                {/* Selected dresses chips */}
                {bookingForm.selectedDresses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-purple-50/70 rounded-xl border border-purple-100">
                    {bookingForm.selectedDresses.map((id, index) => {
                      const d = dresses.find(item => item.id === id);
                      return (
                        <div 
                          key={id} 
                          className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-purple-200 text-xs text-purple-950 shadow-2xs"
                        >
                          <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium max-w-[160px] truncate">{d ? d.name : id}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleDressSelection(id)}
                            className="text-slate-400 hover:text-rose-500 ml-1 p-0.5"
                            title="드레스 선택 해제"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
                  {dresses.filter(d => d.status !== '심사대기').map((d) => {
                    const isSelected = bookingForm.selectedDresses.includes(d.id);
                    const selectedIndex = bookingForm.selectedDresses.indexOf(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleToggleDressSelection(d.id)}
                        className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                          isSelected 
                            ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold shadow-2xs' 
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
                            <span className="block text-[11px] truncate leading-tight">{d.name}</span>
                            <span className="text-[10px] text-slate-500 block">{d.silhouette} · ₩{d.rentalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {selectedIndex + 1}
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Planner code */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">플래너 추천 코드 (선택)</label>
                <input
                  type="text"
                  value={bookingForm.plannerCode}
                  onChange={(e) => setBookingForm({ ...bookingForm, plannerCode: e.target.value })}
                  placeholder="플래너 고유 코드 또는 이름"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition"
                >
                  피팅룸 방문 예약 확정 (U11 완료)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* GLOBAL PAYMENT MODAL (PAYPAL, ALIPAY, WECHAT) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookings={bookings}
        defaultBookingId={targetBookingIdForPayment}
        onPaymentSuccess={(paymentInfo) => {
          if (paymentInfo.bookingId && onUpdateBookingPayment) {
            onUpdateBookingPayment(paymentInfo.bookingId, paymentInfo);
          }
        }}
      />

      {/* TIKTOK WANGHONG LIVE MODAL */}
      <TiktokWanghongModal
        isOpen={isTiktokModalOpen}
        onClose={() => setIsTiktokModalOpen(false)}
      />
    </div>
  );
};
