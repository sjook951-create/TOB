import React, { useState, useRef, useEffect } from 'react';
import { 
  Store, Calendar, UserCheck, Scissors, PenTool, CheckCircle, Clock, 
  Search, ShieldCheck, ChevronRight, AlertCircle, RefreshCw, Sparkles, X,
  Check, FileSignature
} from 'lucide-react';
import { BookingItem, DressItem, RentalContract } from '../../data/liveData';

interface OsmShopPortalProps {
  bookings: BookingItem[];
  dresses: DressItem[];
  contracts: RentalContract[];
  onUpdateBookingStatus: (bookingId: string, status: BookingItem['status'], stylist?: string) => void;
  onCreateContract: (contract: RentalContract) => void;
  onUpdateContractStatus: (contractId: string, status: RentalContract['status']) => void;
}

export const OsmShopPortal: React.FC<OsmShopPortalProps> = ({
  bookings,
  dresses,
  contracts,
  onUpdateBookingStatus,
  onCreateContract,
  onUpdateContractStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'fittinglog' | 'contract' | 'returns'>('schedule');
  const [selectedBookingForFitting, setSelectedBookingForFitting] = useState<BookingItem | null>(null);

  // Fitting Log Form State (SCR-OSM-003)
  const [fittingLog, setFittingLog] = useState({
    bust: '84',
    waist: '64',
    hip: '90',
    height: '168',
    heel: '9',
    favoriteDressId: 'DR-001',
    stylistNotes: 'A라인 및 벨라인에 매우 만족하심. 본식 식장(그랜드볼룸) 천고가 높아 풍성한 트레인 벨라인 추천.',
    satisfactionScore: '5.0'
  });

  // Digital Contract Signing State (SCR-OSM-004)
  const [contractModalBooking, setContractModalBooking] = useState<BookingItem | null>(null);
  const [selectedRentalDressId, setSelectedRentalDressId] = useState<string>('DR-001');
  const [rentalPeriod, setRentalPeriod] = useState({
    start: '2026-09-11',
    end: '2026-09-13'
  });
  const [hasSigned, setHasSigned] = useState<boolean>(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Clear canvas
  const handleClearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
      }
    }
  };

  const handleStartSigning = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e1b4b';

    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDrawSigning = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const handleStopSigning = () => {
    setIsDrawing(false);
  };

  const handleSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractModalBooking) return;
    if (!hasSigned) {
      alert('고객 전자서명을 패드에 입력해 주세요.');
      return;
    }

    const dress = dresses.find(d => d.id === selectedRentalDressId) || dresses[0];
    const newContract: RentalContract = {
      id: `RC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: contractModalBooking.id,
      customerName: `${contractModalBooking.customerName} 신부`,
      dressName: dress.name,
      dressId: dress.id,
      rentalFee: dress.rentalPrice,
      deposit: dress.deposit,
      startDate: rentalPeriod.start,
      endDate: rentalPeriod.end,
      storeName: contractModalBooking.storeName,
      status: '계약완료',
      helperAssigned: '박순자 헬퍼이모 (본사 매칭)',
      signature: '전자서명 완료 (패드 자필)'
    };

    onCreateContract(newContract);
    onUpdateBookingStatus(contractModalBooking.id, '계약체결');
    setContractModalBooking(null);
    setHasSigned(false);
    setActiveSubTab('contract');
  };

  return (
    <div className="space-y-6">
      {/* Store Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                항저우 왕차오 센터점 (Hangzhou Wangchao Store)
              </h2>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded">
                대리점 OSM 샵 관리 포털
              </span>
            </div>
            <p className="text-xs text-slate-500">
              건물주 파트너십 매장 (20% 공간 수익 쉐어) · VIP 피팅룸 2실 운영 중 · 총 보유 드레스 120벌
            </p>
          </div>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeSubTab === 'schedule' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            피팅 예약 스케줄러 ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fittinglog')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeSubTab === 'fittinglog' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            피팅 체험 & 치수 등록 (SCR-OSM-003)
          </button>
          <button
            onClick={() => setActiveSubTab('contract')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeSubTab === 'contract' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전자 계약서 현황 ({contracts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('returns')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeSubTab === 'returns' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            반납 검수 & 보증금 반환 (SCR-OSM-006)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FITTING ROOM TIMETABLE & BOOKING QUEUE (SCR-OSM-002) */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">오늘 예약된 피팅</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">3건</span>
              <span className="text-[10px] text-purple-600 font-medium">VIP 1룸 2건 / VIP 2룸 1건</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">계약 체결율</span>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">85.7%</span>
              <span className="text-[10px] text-slate-500 font-medium">피팅 완료 고객 7명 중 6명</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">출고 대기 (본식 임박)</span>
              <span className="text-lg font-bold text-amber-600 mt-1 block">2벌</span>
              <span className="text-[10px] text-amber-700 font-medium">헬퍼 이모 배정 완료</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">대리점 순수익 배분 (30%)</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">₩8,420,000</span>
              <span className="text-[10px] text-indigo-600 font-medium">5월 누적 집계</span>
            </div>
          </div>

          {/* Bookings Queue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>접수된 오프라인 피팅 예약 대기열 (SCR-OSM-002)</span>
                <span className="text-xs font-normal text-slate-500">실시간 B2C 온라인 예약 연동</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="p-2.5">예약 번호</th>
                    <th className="p-2.5">신부/신랑 성함</th>
                    <th className="p-2.5">희망 일시 & 피팅룸</th>
                    <th className="p-2.5">본식 일자 & 예식홀</th>
                    <th className="p-2.5">담당 스타일리스트</th>
                    <th className="p-2.5">상태</th>
                    <th className="p-2.5 text-right">작업 관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-mono font-bold text-purple-700">{b.id}</td>
                      <td className="p-2.5">
                        <span className="font-semibold text-slate-900 block">{b.customerName}</span>
                        <span className="text-[11px] text-slate-500">{b.phone}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="font-medium text-slate-800 block">{b.date} ({b.timeSlot})</span>
                        <span className="text-[10px] text-purple-600 font-semibold">{b.fittingRoom}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="font-medium text-slate-800 block">{b.weddingDate}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{b.weddingVenue}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="text-slate-800 font-medium">{b.assignedStylist || '미배정'}</span>
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          b.status === '예약확정' ? 'bg-purple-100 text-purple-800' :
                          b.status === '피팅완료' ? 'bg-amber-100 text-amber-800' :
                          b.status === '계약체결' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                        {b.status === '예약확정' && (
                          <button
                            onClick={() => {
                              onUpdateBookingStatus(b.id, '피팅완료', '이소영 수석 스타일리스트');
                              setSelectedBookingForFitting(b);
                              setActiveSubTab('fittinglog');
                            }}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition text-[11px]"
                          >
                            피팅 시작 & 기록
                          </button>
                        )}
                        {b.status === '피팅완료' && (
                          <button
                            onClick={() => {
                              setContractModalBooking(b);
                              if (b.selectedDresses.length > 0) {
                                setSelectedRentalDressId(b.selectedDresses[0]);
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition text-[11px]"
                          >
                            전자계약 작성
                          </button>
                        )}
                        {b.status === '계약체결' && (
                          <span className="text-emerald-700 font-semibold text-[11px]">계약 완료됨</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FITTING EXPERIENCE LOG & MEASUREMENTS (SCR-OSM-003) */}
      {activeSubTab === 'fittinglog' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                FITTING EXPERIENCE LOG (SCR-OSM-003)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                신부 맞춤 피팅 치수 및 스타일링 선호도 기록 (U12)
              </h3>
            </div>
            
            <div className="text-xs text-slate-500">
              대상 고객: <strong className="text-purple-700">
                {selectedBookingForFitting ? selectedBookingForFitting.customerName : '김지은 신부님'}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Measurements Input */}
            <div className="space-y-4 text-xs">
              <span className="font-bold text-slate-900 block border-b pb-1">1. 상세 신체 치수 (단위: cm)</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">바스트 (Bust)</label>
                  <input
                    type="number"
                    value={fittingLog.bust}
                    onChange={(e) => setFittingLog({ ...fittingLog, bust: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">허리 (Waist)</label>
                  <input
                    type="number"
                    value={fittingLog.waist}
                    onChange={(e) => setFittingLog({ ...fittingLog, waist: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">힙 (Hip)</label>
                  <input
                    type="number"
                    value={fittingLog.hip}
                    onChange={(e) => setFittingLog({ ...fittingLog, hip: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">키 (Height)</label>
                  <input
                    type="number"
                    value={fittingLog.height}
                    onChange={(e) => setFittingLog({ ...fittingLog, height: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">착용 희망 힐 높이</label>
                <select
                  value={fittingLog.heel}
                  onChange={(e) => setFittingLog({ ...fittingLog, heel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                >
                  <option value="5">5 cm (단화형)</option>
                  <option value="7">7 cm (기본 펌프스)</option>
                  <option value="9">9 cm (하이힐)</option>
                  <option value="12">12 cm (가보시 킬힐)</option>
                </select>
              </div>
            </div>

            {/* Favorite Selection & Stylist Notes */}
            <div className="lg:col-span-2 space-y-4 text-xs">
              <span className="font-bold text-slate-900 block border-b pb-1">2. 스타일링 코멘트 및 최종 후보 선택</span>

              <div>
                <label className="text-slate-600 block mb-1">최우선 픽 드레스</label>
                <select
                  value={fittingLog.favoriteDressId}
                  onChange={(e) => setFittingLog({ ...fittingLog, favoriteDressId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-lg font-medium"
                >
                  {dresses.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.id}] {d.name} - ₩{d.rentalPrice.toLocaleString()} ({d.designer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">수석 스타일리스트 소견 및 가봉 요청사항</label>
                <textarea
                  rows={3}
                  value={fittingLog.stylistNotes}
                  onChange={(e) => setFittingLog({ ...fittingLog, stylistNotes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-purple-900 font-bold block">고객 피팅 만족도 평점</span>
                  <span className="text-slate-500 text-[10px]">본사 PMS 품질 평가 및 대리점 KPI 반영</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <span>★ 5.0 만점</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => alert('피팅 로그 및 신체 치수가 클라우드 데이터베이스에 안전하게 저장되었습니다.')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition text-xs"
                >
                  피팅 로그 저장 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RENTAL CONTRACTS LIST (SCR-OSM-004) */}
      {activeSubTab === 'contract' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>전자 계약 및 출고·정산 현황 (SCR-OSM-004/005)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="font-bold text-slate-900">{c.customerName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {c.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900">{c.dressName}</div>
                  <div className="text-slate-500">대여 기간: {c.startDate} ~ {c.endDate}</div>
                  <div className="flex items-center justify-between pt-1 text-slate-700">
                    <span>대여료: <strong>₩{c.rentalFee.toLocaleString()}</strong></span>
                    <span>보증금: <strong>₩{c.deposit.toLocaleString()}</strong></span>
                  </div>
                  <div className="text-emerald-700 font-semibold pt-1">
                    담당 헬퍼: {c.helperAssigned}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{c.signature}</span>
                  {c.status === '계약완료' && (
                    <button
                      onClick={() => onUpdateContractStatus(c.id, '출고완료')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-[11px]"
                    >
                      출고 승인 (U10)
                    </button>
                  )}
                  {c.status === '출고완료' && (
                    <button
                      onClick={() => onUpdateContractStatus(c.id, '반납검수')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px]"
                    >
                      반납 입고 검수 (U15)
                    </button>
                  )}
                  {c.status === '반납검수' && (
                    <span className="text-amber-700 font-semibold">반납 검수 탭에서 마감 가능</span>
                  )}
                  {c.status === '마감정산완료' && (
                    <span className="text-emerald-700 font-bold">정산 배분 완료 (U16)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RETURN INSPECTION & DEPOSIT REFUND (SCR-OSM-006) */}
      {activeSubTab === 'returns' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-purple-700 uppercase">반납 검수 (SCR-OSM-006)</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              본식 종료 드레스 상태 검수 및 보증금 반환 · 정산 트리거 (U15, U16)
            </h3>
          </div>

          <div className="space-y-4">
            {contracts.filter(c => c.status === '반납검수').length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                현재 반납 검수 대기 중인 계약 건이 없습니다.
              </div>
            ) : (
              contracts.filter(c => c.status === '반납검수').map(c => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between font-bold">
                    <span>{c.customerName} - {c.dressName}</span>
                    <span className="text-purple-700">보증금 환불 대상: ₩{c.deposit.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-800 font-semibold">
                      원단 훼손/찢김: 없음 (양호)
                    </div>
                    <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-800 font-semibold">
                      하단 비딩 탈락: 정상 범위
                    </div>
                    <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-800 font-semibold">
                      오염 세탁 판정: 일반 세탁 완료 가능
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        onUpdateContractStatus(c.id, '마감정산완료');
                        alert(`보증금 ₩${c.deposit.toLocaleString()}이 고객 계좌로 즉시 환불되었습니다.\n본사 PMS 7대 주체 다자간 배분정산(U16)이 집행 대기열로 등록되었습니다!`);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                    >
                      검수 통과 & 보증금 전액 반환 확정 (U16 정산 연동)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ELECTRONIC CONTRACT MODAL WITH DIGITAL SIGNATURE PAD (SCR-OSM-004) */}
      {contractModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">전자 계약 체결 (SCR-OSM-004)</span>
                <h3 className="text-base font-bold text-slate-900">웨딩 드레스 대여 계약서 및 고객 서명</h3>
              </div>
              <button 
                onClick={() => setContractModalBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitContract} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div><strong>계약자:</strong> {contractModalBooking.customerName} ({contractModalBooking.phone})</div>
                <div><strong>예식 일자 및 장소:</strong> {contractModalBooking.weddingDate} · {contractModalBooking.weddingVenue}</div>
                <div><strong>계약 체결 샵:</strong> {contractModalBooking.storeName}</div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">최종 대여 드레스 선택 *</label>
                <select
                  value={selectedRentalDressId}
                  onChange={(e) => setSelectedRentalDressId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                >
                  {dresses.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} | 대여료 ₩{d.rentalPrice.toLocaleString()} (보증금 ₩{d.deposit.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">출고 희망일 (예식 전일)</label>
                  <input
                    type="date"
                    value={rentalPeriod.start}
                    onChange={(e) => setRentalPeriod({ ...rentalPeriod, start: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">반납 예정일 (예식 익일)</label>
                  <input
                    type="date"
                    value={rentalPeriod.end}
                    onChange={(e) => setRentalPeriod({ ...rentalPeriod, end: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              {/* Digital Signature Pad */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 text-purple-600" />
                    <span>고객 전자 자필 서명 패드 (Digital Signature) *</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleClearSignature}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                  >
                    서명 지우기
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-1 relative flex items-center justify-center">
                  <canvas
                    ref={signatureCanvasRef}
                    width={480}
                    height={120}
                    onMouseDown={handleStartSigning}
                    onMouseMove={handleDrawSigning}
                    onMouseUp={handleStopSigning}
                    onMouseLeave={handleStopSigning}
                    onTouchStart={handleStartSigning}
                    onTouchMove={handleDrawSigning}
                    onTouchEnd={handleStopSigning}
                    className="cursor-crosshair w-full bg-white rounded-lg touch-none"
                  />
                  {!hasSigned && (
                    <div className="absolute pointer-events-none text-slate-400 text-xs select-none">
                      여기에 마우스나 손가락으로 자필 서명해 주세요
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContractModalBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition shadow-xs"
                >
                  대여 전자계약 체결 및 승인 (U13 완료)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
