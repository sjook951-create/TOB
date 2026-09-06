import React, { useState } from 'react';
import { 
  Share2, QrCode, Smartphone, Award, DollarSign, Users, Sparkles, 
  CheckCircle, Copy, ExternalLink, Calendar, ShieldCheck, Check, Clock,
  DoorClosed
} from 'lucide-react';
import { BookingItem, DressItem } from '../../data/liveData';
import { PlannerFittingBooking } from './PlannerFittingBooking';

interface PlannerPortalProps {
  dresses: DressItem[];
  bookings?: BookingItem[];
  onBookFitting?: (bookingData: Omit<BookingItem, 'id' | 'status'>) => Promise<void>;
  onCancelBooking?: (bookingId: string) => void;
}

export const PlannerPortal: React.FC<PlannerPortalProps> = ({
  dresses,
  bookings = [],
  onBookFitting = async () => {},
  onCancelBooking = () => {},
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'booking' | 'planner' | 'helper'>('booking');
  const [copiedLink, setCopiedLink] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState(false);
  const [helperChecklist, setHelperChecklist] = useState({
    outboundCheck: true,
    veilSteamed: true,
    bustleAdjusted: false,
    returnInspected: false
  });

  const plannerStats = {
    totalRevenue: 4725000,
    referralCount: 15,
    pendingCommission: 945000,
    vipBrideCount: 8
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText?.('https://tobmall.com/myshop/pln-sh-882');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleToggleCheck = (key: keyof typeof helperChecklist) => {
    setHelperChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Planner vs Helper Sub-tab Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('booking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'booking'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <DoorClosed className="w-4 h-4" />
            <span>피팅룸 실시간 예약</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeSubTab === 'booking' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'
            }`}>
              09:00~19:00
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('planner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'planner'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>소셜 마케팅 센터 (SCR-PLN-001/002)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('helper')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'helper'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>헬퍼(이모) 본식 케어 (SCR-PLN-003)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          로그인: <strong className="text-slate-800">정하윤 수석 웨딩플래너</strong> (ID: PLN-SH-882)
        </span>
      </div>

      {/* SUB-TAB 0: PLANNER FITTING ROOM LIVE BOOKING & SCHEDULE */}
      {activeSubTab === 'booking' && (
        <PlannerFittingBooking
          dresses={dresses}
          bookings={bookings}
          onBookFitting={onBookFitting}
          onCancelBooking={onCancelBooking}
          currentPlannerId="PLN-SH-882 (정하윤 플래너)"
        />
      )}

      {/* SUB-TAB 1: PLANNER SOCIAL SHOP & VIRAL CENTER */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                <span>누적 정산 수수료 (15%)</span>
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                ₩{plannerStats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">이번 달 +₩945,000 입금 예정</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>연계 계약 성사</span>
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {plannerStats.referralCount}건
              </div>
              <span className="text-[10px] text-purple-600 font-semibold">전환율 78.4% (상위 5%)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>진행 중인 VIP 신부</span>
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {plannerStats.vipBrideCount}명
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">피팅 및 본식 대기</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>플래너 등급</span>
              </span>
              <div className="text-lg sm:text-xl font-bold text-indigo-700 mt-1">
                MASTER X
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">본사 VIP 전용 라인 지원</span>
            </div>
          </div>

          {/* Social Viral Hub: WeChat Moments & Xiaohongshu Poster Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: My Shop Link & Curation */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    PLANNER MY SHOP (SCR-PLN-001)
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    정하윤 플래너 전용 큐레이션 마이샵
                  </h3>
                </div>
                
                <button
                  onClick={handleCopyShareLink}
                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? '링크 복사 완료!' : '홍보 링크 복사'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                플래너님의 고유 링크 또는 QR 코드를 통해 신부님이 피팅 예약 후 대여 계약 시,
                <strong>대여 금액의 15%가 실시간 다자간 자동 정산(U16)</strong>되어 플래너 계좌로 지급됩니다.
              </p>

              {/* Curated Dresses */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  플래너 추천 큐레이션 드레스 목록 (총 {dresses.length}벌 중 4벌 노출 중)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dresses.slice(0, 4).map((d) => (
                    <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 text-xs">
                      <img 
                        src={d.imageUrl} 
                        alt={d.name} 
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover rounded-lg shrink-0" 
                      />
                      <div className="flex flex-col justify-between flex-1 truncate">
                        <div>
                          <span className="font-bold text-slate-900 block truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-500">{d.designer}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                          <span className="font-bold text-purple-700">₩{d.rentalPrice.toLocaleString()}</span>
                          <span className="text-emerald-700 font-semibold text-[10px]">
                            예상 커미션: ₩{Math.round(d.rentalPrice * 0.15).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live WeChat & Xiaohongshu QR Poster Card */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span className="font-semibold uppercase tracking-wider">소셜 홍보 포스터</span>
                  <span className="bg-purple-500/30 px-2 py-0.5 rounded text-[10px] border border-purple-400/40">
                    위챗 모멘트 · 샤오홍슈
                  </span>
                </div>
                <h4 className="text-lg font-bold mt-2 leading-snug">
                  정하윤 플래너의<br />
                  <span className="text-amber-300">2026 하이엔드 웨딩 컬렉션</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  글로벌 명품 드레스 오프라인 VIP 피팅 초대장
                </p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-xl text-slate-900 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-32 h-32 bg-slate-100 border-2 border-slate-800 rounded-lg flex items-center justify-center p-2 relative">
                  {/* Decorative QR Pattern */}
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                      TOB
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-800">
                  스마트폰 카메라로 스캔 시 즉시 연결
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  CODE: PLN-SH-882
                </span>
              </div>

              <div className="text-center">
                <button
                  onClick={handleCopyShareLink}
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl text-xs transition"
                >
                  위챗 모멘트 포스터 이미지 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: HELPER (이모) ON-SITE WEDDING DAY CARE VIEW */}
      {activeSubTab === 'helper' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                당일 본식 헬퍼(이모) 전용 모바일 뷰
              </span>
              <span className="font-mono text-slate-400">2026. 05. 24 (오늘)</span>
            </div>

            <h3 className="text-lg font-extrabold text-white">
              장유진 신부님 예식 현장 케어 일정
            </h3>
            <div className="text-xs text-emerald-200 space-y-1">
              <div><strong>예식 장소:</strong> 그랜드 인터컨티넨탈 호텔 그랜드볼룸</div>
              <div><strong>대여 드레스:</strong> 동양의 빛 퓨전 오리엔탈 로열 (DR-005)</div>
              <div><strong>헬퍼 담당:</strong> 박순자 헬퍼이모 (경력 14년)</div>
            </div>
          </div>

          {/* Barcode Outbound Verification */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">1. 대여 상품 출고 바코드 스캔 검증 (U10)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                scannedBarcode ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {scannedBarcode ? '스캔 및 출고 검증 완료' : '바코드 확인 필요'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">바코드 시리얼</span>
                <span className="font-mono font-bold text-slate-800">BAR-2026-DR005-9921</span>
              </div>
              <button
                onClick={() => setScannedBarcode(!scannedBarcode)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
              >
                {scannedBarcode ? '재스캔' : '출고 바코드 스캔'}
              </button>
            </div>
          </div>

          {/* On-site Checklist */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 text-xs block">
              2. 본식 현장 착장 및 반납 체크리스트 (SCR-PLN-003)
            </span>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={helperChecklist.outboundCheck}
                  onChange={() => handleToggleCheck('outboundCheck')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block">대리점 샵 상품 출고 상태 검수</span>
                  <span className="text-[11px] text-slate-500">지퍼, 비딩 탈락 여부, 옷걸이 및 보호 수트 확인</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={helperChecklist.veilSteamed}
                  onChange={() => handleToggleCheck('veilSteamed')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block">신부 대기실 착장 및 베일/티아라 세팅</span>
                  <span className="text-[11px] text-slate-500">스팀 다림질 완료, 웨딩 슈즈 및 속옷 코르셋 고정</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={helperChecklist.bustleAdjusted}
                  onChange={() => handleToggleCheck('bustleAdjusted')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block">버슬(Bustle) 트레인 조절 및 2부 리셉션 케어</span>
                  <span className="text-[11px] text-slate-500">피로연 입장 시 롱트레인을 단정하게 올려 고정</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={helperChecklist.returnInspected}
                  onChange={() => handleToggleCheck('returnInspected')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block">예식 종료 후 샵 반납 인계 (U15)</span>
                  <span className="text-[11px] text-slate-500">오염도 1차 확인 및 샵 매니저 반납 서명 수령</span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('본식 케어 완료 보고가 전송되었습니다. 헬퍼 수고비(₩200,000)가 정산 계좌로 등록됩니다.')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
              >
                본식 현장 케어 완료 보고 전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
