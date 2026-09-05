import React, { useState } from 'react';
import { 
  Sparkles, Calendar, MapPin, Search, Filter, ShoppingBag, Heart, 
  Check, Star, Clock, ChevronRight, Store, ArrowRight, UserCheck, CheckCircle2,
  CalendarCheck, X, CreditCard, Video
} from 'lucide-react';
import { DressItem, BookingItem } from '../../data/liveData';
import heroShowroomImg from '../../assets/images/hero_wedding_showroom_1788513831356.jpg';
import { PaymentModal } from './PaymentModal';
import { TiktokWanghongModal } from './TiktokWanghongModal';

interface B2CConsumerPortalProps {
  dresses: DressItem[];
  bookings: BookingItem[];
  onBookFitting: (booking: Omit<BookingItem, 'id' | 'status'>) => void;
  onRequestBookingOpen: (dressId?: string) => void;
}

export const B2CConsumerPortal: React.FC<B2CConsumerPortalProps> = ({
  dresses,
  bookings,
  onBookFitting,
  onRequestBookingOpen,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'mywedding'>('catalog');
  const [previewDress, setPreviewDress] = useState<DressItem | null>(null);

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
    date: '2026-06-05',
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
      dress.silhouette.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBooking = (dress?: DressItem) => {
    if (dress) {
      setBookingForm(prev => ({
        ...prev,
        selectedDresses: [dress.id]
      }));
    }
    setIsBookingModalOpen(true);
  };

  const handleToggleDressSelection = (id: string) => {
    setBookingForm(prev => {
      const exists = prev.selectedDresses.includes(id);
      if (exists) {
        return { ...prev, selectedDresses: prev.selectedDresses.filter(d => d !== id) };
      } else {
        if (prev.selectedDresses.length >= 3) {
          alert('피팅 예약 시 한 번에 최대 3벌까지 선택 가능합니다.');
          return prev;
        }
        return { ...prev, selectedDresses: [...prev.selectedDresses, id] };
      }
    });
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.phone) {
      alert('신부님 성함과 연락처를 입력해 주세요.');
      return;
    }
    onBookFitting(bookingForm);
    setIsBookingModalOpen(false);
    setActiveTab('mywedding');
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
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
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
              onClick={() => handleOpenBooking()}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>O2O 피팅룸 예약하기 (U11)</span>
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>드레스 컬렉션 둘러보기 ({filteredDresses.length})</span>
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
            <span>나의 예약 및 대여 현황 ({bookings.length})</span>
          </button>

          <button
            onClick={() => handleOpenPaymentModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:via-indigo-500 hover:to-emerald-500 text-white shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>간편결제 (알리페이 · 위챗페이)</span>
            <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">DEMO</span>
          </button>

          <button
            onClick={() => setIsTiktokModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white shadow-xs border border-slate-800"
          >
            <Video className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>틱톡 라이브 (왕홍 연동)</span>
            <span className="bg-gradient-to-r from-[#fe0979] to-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          B2C 온라인 포털 (SCR-B2C-001 ~ 004)
        </span>
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
            {filteredDresses.map((dress) => (
              <div 
                key={dress.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Dress Image with Badge */}
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img 
                    src={dress.imageUrl} 
                    alt={dress.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
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
                      onClick={() => setPreviewDress(dress)}
                      className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                    >
                      상세 정보
                    </button>
                    <button
                      onClick={() => handleOpenBooking(dress)}
                      className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1"
                    >
                      <span>피팅 예약 (U11)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY WEDDING DASHBOARD */}
      {activeTab === 'mywedding' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  MY WEDDING DASHBOARD
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  나의 피팅 예약 및 대여 계약 현황 (SCR-B2C-004)
                </h3>
              </div>
              <button
                onClick={() => handleOpenBooking()}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
              >
                + 새로운 샵 피팅 예약하기
              </button>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
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
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                      <div>
                        <strong>선택 피팅 드레스: </strong>
                        {booking.selectedDresses.map(id => {
                          const d = dresses.find(item => item.id === id);
                          return d ? d.name : id;
                        }).join(', ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600 font-medium">대리점 OSM 실시간 연계 승인 완료</span>
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentModal(booking.id)}
                          className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>보증금 결제 (알리/위챗)</span>
                        </button>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="font-semibold text-slate-700 block mb-1">시간대 및 룸 *</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="11:00 ~ 13:00">11:00 ~ 13:00 (오전)</option>
                    <option value="14:00 ~ 16:00">14:00 ~ 16:00 (오후 골든)</option>
                    <option value="16:30 ~ 18:30">16:30 ~ 18:30 (오후 늦게)</option>
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
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  시착 희망 드레스 선택 (최대 3벌, 현재 {bookingForm.selectedDresses.length}벌 선택됨)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                  {dresses.slice(0, 6).map((d) => {
                    const isSelected = bookingForm.selectedDresses.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleToggleDressSelection(d.id)}
                        className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                          isSelected 
                            ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-1">
                          <span className="block text-[11px] truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-400">{d.category}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />}
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
      {/* ALIPAY & WECHAT PAY DEMO MODAL */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookings={bookings}
        defaultBookingId={targetBookingIdForPayment}
      />

      {/* TIKTOK WANGHONG LIVE MODAL */}
      <TiktokWanghongModal
        isOpen={isTiktokModalOpen}
        onClose={() => setIsTiktokModalOpen(false)}
      />
    </div>
  );
};
