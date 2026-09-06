import React, { useState } from 'react';
import { 
  Camera, MapPin, Star, Sparkles, Check, Phone, Clock, 
  ExternalLink, Calendar, ArrowRight, Heart, Share2, 
  Image as ImageIcon, Gift, ShieldCheck, ChevronRight, X,
  CheckCircle2, Search, Filter, Layers, Eye
} from 'lucide-react';
import { 
  PHOTO_STUDIOS, PhotoStudioItem, StudioPackage, 
  StudioThemeSample, StudioBookingRequest, INITIAL_STUDIO_BOOKINGS 
} from '../../data/weddingPhotoData';

interface WeddingPhotoStudiosViewProps {
  onSelectDressShowroom?: () => void;
  onBookFitting?: () => void;
  onShowToast?: (msg: string) => void;
}

export const WeddingPhotoStudiosView: React.FC<WeddingPhotoStudiosViewProps> = ({
  onSelectDressShowroom,
  onBookFitting,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [selectedStudioForDetail, setSelectedStudioForDetail] = useState<PhotoStudioItem | null>(null);
  const [selectedStudioForBooking, setSelectedStudioForBooking] = useState<PhotoStudioItem | null>(null);
  const [activeThemeTab, setActiveThemeTab] = useState<number>(0);
  
  // Bookings state
  const [studioBookings, setStudioBookings] = useState<StudioBookingRequest[]>(INITIAL_STUDIO_BOOKINGS);
  const [showMyBookings, setShowMyBookings] = useState<boolean>(false);

  // Booking Form state
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    phone: '',
    preferredDate: '2026-06-20',
    packageId: '',
    packageName: '',
    selectedTheme: '',
    withDressPackage: true,
    notes: ''
  });

  const categories = [
    { key: 'ALL', label: '전체 스튜디오' },
    { key: 'GARDEN', label: '온실 가든 & 자연광' },
    { key: 'PORTRAIT', label: '인물 중심 & 모던 화보' },
    { key: 'LUXURY', label: '럭셔리 캐슬 & 나이트' },
    { key: 'SNAP', label: '제주 자연 야외스냅' },
    { key: 'HANOK', label: '전통 한옥 & 퓨전' }
  ];

  const regions = ['전체', '청담/강남', '제주', '상하이'];

  // Filtered Studios
  const filteredStudios = PHOTO_STUDIOS.filter(studio => {
    const matchCat = selectedCategory === 'ALL' || studio.conceptCategory === selectedCategory;
    const matchReg = selectedRegion === '전체' || studio.region === selectedRegion;
    const matchSearch = 
      studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.shortSlogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.conceptLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.leadPhotographer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchReg && matchSearch;
  });

  // Open detail lookbook modal
  const handleOpenDetailModal = (studio: PhotoStudioItem, themeIndex = 0) => {
    setSelectedStudioForDetail(studio);
    setActiveThemeTab(themeIndex);
  };

  // Open booking modal
  const handleOpenBookingModal = (studio: PhotoStudioItem, defaultPkg?: StudioPackage) => {
    const pkg = defaultPkg || studio.packages[0];
    setSelectedStudioForBooking(studio);
    setBookingForm({
      customerName: '',
      phone: '',
      preferredDate: '2026-06-25',
      packageId: pkg?.id || '',
      packageName: pkg?.name || '',
      selectedTheme: studio.themes[0]?.themeTitle || '시그니처 컨셉',
      withDressPackage: true,
      notes: ''
    });
  };

  // Submit booking request
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudioForBooking) return;
    if (!bookingForm.customerName.trim() || !bookingForm.phone.trim()) {
      alert('신랑 신부님 성함과 연락처를 입력해주세요.');
      return;
    }

    const newBooking: StudioBookingRequest = {
      id: `STUBK-2026-${Math.floor(100 + Math.random() * 900)}`,
      studioId: selectedStudioForBooking.id,
      studioName: selectedStudioForBooking.name,
      customerName: bookingForm.customerName.trim(),
      phone: bookingForm.phone.trim(),
      preferredDate: bookingForm.preferredDate,
      packageId: bookingForm.packageId,
      packageName: bookingForm.packageName || selectedStudioForBooking.packages[0]?.name || '시그니처 20P 패키지',
      selectedTheme: bookingForm.selectedTheme,
      withDressPackage: bookingForm.withDressPackage,
      notes: bookingForm.notes,
      createdAt: new Date().toISOString().slice(0, 10),
      status: '상담접수'
    };

    setStudioBookings(prev => [newBooking, ...prev]);
    setSelectedStudioForBooking(null);
    if (onShowToast) {
      onShowToast(`[웨딩 포토 스튜디오] ${newBooking.studioName} 촬영 상담 예약이 접수되었습니다! 담당 디렉터가 2시간 이내에 해피콜을 드립니다.`);
    } else {
      alert(`[예약 접수 완료] ${newBooking.studioName} 촬영 상담 예약이 성공적으로 접수되었습니다. (접수번호: ${newBooking.id})`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white shadow-xl border border-purple-900/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-0 w-80 h-80 bg-rose-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold backdrop-blur-md">
            <Camera className="w-4 h-4 text-purple-300 animate-pulse" />
            <span>TOBMALL OFFICIAL WEDDING PHOTO STUDIOS</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
              NEW 입점
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            일생에 단 한 번, 영원히 빛날<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
              웨딩 포토 스튜디오 컬렉션
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            청담동 최정상 온실 가든 & 인물 중심 스튜디오부터 제주의 푸른 숲 야외스냅, 
            상하이 와이탄 랜드마크까지! TOBMALL 드레스 제휴 할인 및 단독 혜택으로 스마트하게 준비하세요.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('studio-catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>입점 스튜디오 {PHOTO_STUDIOS.length}개 전체 둘러보기</span>
            </button>

            {onSelectDressShowroom && (
              <button
                onClick={onSelectDressShowroom}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>촬영용 웨딩 드레스 쇼룸 연계</span>
              </button>
            )}

            <button
              onClick={() => setShowMyBookings(prev => !prev)}
              className="px-4 py-2.5 bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 rounded-xl text-xs sm:text-sm font-semibold border border-purple-600/40 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>스튜디오 상담 신청 내역 ({studioBookings.length}건)</span>
            </button>
          </div>
        </div>

        {/* Studio Platform USP Stats Bar */}
        <div className="relative z-10 border-t border-white/10 bg-slate-950/70 backdrop-blur-md px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">입점 공인 스튜디오</span>
            <span className="font-extrabold text-white text-base">엄선 6대 브랜드</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">TOBMALL 제휴 페이백</span>
            <span className="font-extrabold text-amber-300 text-base">최대 20% 특별할인</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">예비신부 촬영 만족도</span>
            <span className="font-extrabold text-emerald-300 text-base">★ 4.95 / 5.0</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">스드메 원스톱 연계</span>
            <span className="font-extrabold text-purple-300 text-base">드레스 + 이모님 풀케어</span>
          </div>
        </div>
      </div>

      {/* My Studio Consultation Drawer / List (Toggleable) */}
      {showMyBookings && (
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-md animate-in fade-in slide-in-from-top-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-extrabold text-sm text-slate-900">나의 웨딩 포토 스튜디오 상담 및 예약 내역</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {studioBookings.length}건
              </span>
            </div>
            <button
              onClick={() => setShowMyBookings(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studioBookings.map((bk) => (
              <div key={bk.id} className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">{bk.studioName}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    bk.status === '예약확정' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {bk.status}
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p>• 고객명: <strong>{bk.customerName}</strong> ({bk.phone})</p>
                  <p>• 희망 촬영일: <strong>{bk.preferredDate}</strong></p>
                  <p>• 선택 패키지: {bk.packageName}</p>
                  <p>• 드레스 패키지 연계: {bk.withDressPackage ? '신청 (TOBMALL 20% 페이백 적용)' : '미신청'}</p>
                </div>
                {bk.notes && (
                  <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-purple-100 italic">
                    "{bk.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Filter & Search Toolbar */}
      <div id="studio-catalog-grid" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === c.key
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Region selector & Keyword Search */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              <span className="text-slate-400 px-1.5 text-[11px] font-medium">지역:</span>
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px] sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="스튜디오명, 스타일, 작가 검색"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Sub filter status */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>입점 스튜디오 <strong>{filteredStudios.length}</strong>개 검색됨</span>
          <span className="text-purple-700 font-medium">✨ TOBMALL 회원 단독 제휴 혜택 상시 적용</span>
        </div>
      </div>

      {/* 3. Studio Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudios.map((studio) => {
          const primaryPkg = studio.packages[0];

          return (
            <div 
              key={studio.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Studio Cover & Header */}
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={studio.coverImage} 
                    alt={studio.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {studio.badge && (
                      <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40 shadow-xs">
                        {studio.badge}
                      </span>
                    )}
                    <span className="bg-purple-900/80 backdrop-blur-md text-purple-200 text-[11px] font-semibold px-2 py-1 rounded-full">
                      {studio.conceptLabel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{studio.rating}</span>
                      <span className="text-slate-400 font-normal">({studio.reviewCount})</span>
                    </span>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-purple-200 text-xs font-semibold mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{studio.location} ({studio.region})</span>
                    </div>
                    <h3 className="text-xl font-bold leading-snug drop-shadow-sm">
                      {studio.name}
                    </h3>
                    <p className="text-xs text-slate-300 drop-shadow-sm truncate">
                      {studio.englishName}
                    </p>
                  </div>
                </div>

                {/* Studio Body Content */}
                <div className="p-5 space-y-4">
                  {/* Slogan */}
                  <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    "{studio.shortSlogan}"
                  </p>

                  {/* Facilities & Photographer */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">세트장 규모 & 시설</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{studio.studioScale}</span>
                    </div>
                    <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">대표 포토 디렉터</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{studio.leadPhotographer}</span>
                    </div>
                  </div>

                  {/* Highlights Bullet points */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">스튜디오 핵심 특장점</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {studio.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOBMALL Exclusive Benefits Card */}
                  <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-purple-950 font-bold text-xs">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span>TOBMALL 회원 단독 입점 혜택</span>
                      <span className="bg-purple-200 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                        단독특전
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-purple-900">
                      {studio.tobmallBenefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                          <span className="font-medium leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Representative Package Price */}
                  {primaryPkg && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">대표 촬영 패키지</span>
                        <span className="font-extrabold text-xs text-slate-900">{primaryPkg.name}</span>
                      </div>
                      <div className="text-right">
                        {primaryPkg.originalPriceKRW && (
                          <span className="text-[11px] text-slate-400 line-through mr-1.5">
                            {primaryPkg.originalPriceKRW.toLocaleString()}원
                          </span>
                        )}
                        <span className="text-base font-black text-purple-700">
                          {primaryPkg.priceKRW.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenDetailModal(studio)}
                  className="py-2.5 px-3 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>샘플 화보 보기 ({studio.themes.length}컨셉)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenBookingModal(studio)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>촬영 상담·예약 신청</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Detail Lookbook Modal */}
      {selectedStudioForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {selectedStudioForDetail.conceptLabel}
                  </span>
                  <span className="text-xs text-slate-500">{selectedStudioForDetail.location}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedStudioForDetail.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedStudioForDetail.englishName}</p>
              </div>
              <button
                onClick={() => setSelectedStudioForDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
              {selectedStudioForDetail.themes.map((th, idx) => (
                <button
                  key={th.id}
                  onClick={() => setActiveThemeTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeThemeTab === idx
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  컨셉 {idx + 1}. {th.themeTitle.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Active Theme Preview */}
            {selectedStudioForDetail.themes[activeThemeTab] && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96 bg-slate-900">
                  <img
                    src={selectedStudioForDetail.themes[activeThemeTab].imageUrl}
                    alt={selectedStudioForDetail.themes[activeThemeTab].themeTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-lg font-bold">
                      {selectedStudioForDetail.themes[activeThemeTab].themeTitle}
                    </h4>
                    <p className="text-xs text-slate-200 mt-1">
                      {selectedStudioForDetail.themes[activeThemeTab].description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedStudioForDetail.themes[activeThemeTab].tags.map((t, idx) => (
                        <span key={idx} className="bg-white/20 backdrop-blur-xs text-purple-100 text-[10px] px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>스튜디오 상세 가이드 & 세트장 안내</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedStudioForDetail.description}
                  </p>
                  <div className="pt-1 text-slate-700 font-medium">
                    <p>• 주소: {selectedStudioForDetail.address}</p>
                    <p>• 대표 디렉터: {selectedStudioForDetail.leadPhotographer}</p>
                    <p>• 촬영 시간: {selectedStudioForDetail.operatingHours}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Packages in Detail */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900">촬영 패키지 안내</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedStudioForDetail.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{pkg.name}</span>
                        {pkg.popular && (
                          <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            인기 1위
                          </span>
                        )}
                      </div>
                      <div className="text-purple-700 font-extrabold text-sm mt-1">
                        {pkg.priceKRW.toLocaleString()}원
                        {pkg.originalPriceKRW && (
                          <span className="text-[11px] text-slate-400 line-through font-normal ml-1.5">
                            {pkg.originalPriceKRW.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{pkg.description}</p>
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <Check className="w-3 h-3 text-purple-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStudioForDetail(null);
                        handleOpenBookingModal(selectedStudioForDetail, pkg);
                      }}
                      className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>이 패키지로 상담 예약하기</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Booking / Consultation Modal */}
      {selectedStudioForBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  웨딩 포토 스튜디오 촬영 상담 예약
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedStudioForBooking.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedStudioForBooking.location} ({selectedStudioForBooking.address})</p>
              </div>
              <button
                onClick={() => setSelectedStudioForBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-3.5 text-xs">
              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    신랑 / 신부님 성함 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="예: 김민지 & 박준혁"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  희망 촬영 예정일 (또는 상담일) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  선택 패키지
                </label>
                <select
                  value={bookingForm.packageId}
                  onChange={(e) => {
                    const sel = selectedStudioForBooking.packages.find(p => p.id === e.target.value);
                    setBookingForm(prev => ({
                      ...prev,
                      packageId: e.target.value,
                      packageName: sel ? sel.name : ''
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {selectedStudioForBooking.packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.priceKRW.toLocaleString()}원)
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Theme Concept */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  선호 촬영 컨셉
                </label>
                <select
                  value={bookingForm.selectedTheme}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, selectedTheme: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {selectedStudioForBooking.themes.map(th => (
                    <option key={th.id} value={th.themeTitle}>
                      {th.themeTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* TOBMALL Dress Bundle Checkbox */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="bundle-dress"
                  checked={bookingForm.withDressPackage}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, withDressPackage: e.target.checked }))}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 mt-0.5"
                />
                <label htmlFor="bundle-dress" className="text-slate-800 font-medium leading-tight cursor-pointer">
                  <strong>TOBMALL 웨딩 드레스 제휴 패키지 동시 신청</strong>
                  <span className="block text-[11px] text-purple-700 mt-0.5">
                    체크 시 스튜디오 촬영비 20% 페이백 + 야간 로드씬 또는 온실 세트 무료 업그레이드 혜택이 적용됩니다.
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  요청사항 또는 메모 (선택)
                </label>
                <textarea
                  rows={2}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="원하시는 분위기, 본식 일정, 기타 문의사항을 편하게 적어주세요."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>스튜디오 촬영 상담 예약 접수</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
