import React, { useState } from 'react';
import { 
  Building2, CheckCircle, Clock, ShieldCheck, DollarSign, Users, Store,
  AlertTriangle, Calculator, FileCheck, ArrowRight, Sparkles, Check,
  Calendar, DoorClosed, Award
} from 'lucide-react';
import { BookingItem, DressItem, RentalContract } from '../../data/liveData';
import { MemberManagementView } from './MemberManagementView';
import { SupabaseStudioManager } from './SupabaseStudioManager';
import { PmsFittingRoomManager } from './PmsFittingRoomManager';
import { PlannerManagementView } from './PlannerManagementView';

interface PmsOperatorPortalProps {
  dresses: DressItem[];
  contracts: RentalContract[];
  bookings?: BookingItem[];
  onApproveDress: (dressId: string) => void;
  onExecuteSettlement: (contractId: string) => void;
  onUpdateBookingStatus?: (bookingId: string, status: BookingItem['status'], stylist?: string) => void;
  onRefreshBookings?: () => void;
}

export const PmsOperatorPortal: React.FC<PmsOperatorPortalProps> = ({
  dresses,
  contracts,
  bookings = [],
  onApproveDress,
  onExecuteSettlement,
  onUpdateBookingStatus = () => {},
  onRefreshBookings,
}) => {
  const [activeTab, setActiveTab] = useState<'control' | 'fitting' | 'approval' | 'settlement' | 'building' | 'members' | 'supabase' | 'planners'>('control');
  
  // Custom Settlement Calculator State (Process U16)
  const [calcRentalFee, setCalcRentalFee] = useState<number>(2100000);
  const [executedSettlements, setExecutedSettlements] = useState<string[]>([]);

  // Dresses pending PMS review (status === '심사대기')
  const pendingDresses = dresses.filter(d => d.status === '심사대기');

  // Settlements pending (status === '반납검수' or '마감정산완료')
  const settlementReadyContracts = contracts.filter(c => c.status === '마감정산완료' || c.status === '반납검수');

  // Active bookings count
  const activeBookingsCount = bookings.filter(b => b.status !== '취소' && b.status !== '예약취소').length;

  // 7-Party distribution ratios
  const agencyShare = Math.round(calcRentalFee * 0.30); // 30% 대리점
  const buildingShare = Math.round(calcRentalFee * 0.20); // 20% 건물주 (왕차오 센터)
  const plannerShare = Math.round(calcRentalFee * 0.15); // 15% 플래너
  const helperFee = 200000; // 헬퍼 이모 현장 출장비
  const designerRoyalty = Math.round(calcRentalFee * 0.03); // 3% 디자이너
  const workshopRoyalty = Math.round(calcRentalFee * 0.03); // 3% 공방
  const platformMargin = calcRentalFee - (agencyShare + buildingShare + plannerShare + helperFee + designerRoyalty + workshopRoyalty);

  const handleRunSettlement = (contractId: string) => {
    onExecuteSettlement(contractId);
    setExecutedSettlements(prev => [...prev, contractId]);
    alert(`계약 [${contractId}]의 7대 주체 스마트 배분정산(U16)이 완료되었습니다.\n각 파트너 지갑 및 전자세금계산서가 발행되었습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* PMS Headquarters Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                PMS 운영상 본사 통합 관제 포털 (SCR-PMS-001)
              </h2>
              <span className="bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                HEADQUARTERS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              友霓网络科技(上海)有限公司 UNINET TECHNOLOGY · 전사 GMV, 승인 심사, 7대 주체 다자간 정산
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'control' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            통합 운영 관제탑
          </button>
          <button
            onClick={() => setActiveTab('fitting')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'fitting' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorClosed className="w-3.5 h-3.5" />
            <span>피팅룸 예약 현황</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'fitting' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'
            }`}>
              {activeBookingsCount}건
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'approval' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>상품 심사 승인 (U2)</span>
            {pendingDresses.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingDresses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'settlement' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>7대 주체 배분정산 (U16)</span>
          </button>
          <button
            onClick={() => setActiveTab('building')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'building' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            건물주 파트너십 (20%)
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'members' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>회원 DB 관리 (Cloud SQL)</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'members' ? 'bg-white text-purple-700' : 'bg-emerald-100 text-emerald-800'
            }`}>PostgreSQL</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'supabase' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Supabase Studio 연동</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'supabase' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
            }`}>Table Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('planners')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'planners' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>플래너 테이블 바로가기</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'planners' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'
            }`}>8자리 DB</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HEADQUARTERS CONTROL TOWER */}
      {activeTab === 'control' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">5월 플랫폼 누적 GMV</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">₩384,500,000</span>
              <span className="text-[10px] text-purple-600 font-semibold">목표 대비 114% 달성</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">전국 활성 오프라인 샵</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">18개 지점</span>
              <span className="text-[10px] text-slate-500">항저우 왕차오, 상하이, 베이징 등</span>
            </div>
            <div 
              onClick={() => setActiveTab('planners')}
              className="p-4 bg-white hover:bg-purple-50/50 cursor-pointer rounded-xl border border-slate-200 shadow-xs transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-500 block">활성 파트너 플래너</span>
                <span className="text-[10px] font-bold text-purple-600 group-hover:underline flex items-center gap-0.5">
                  테이블 바로가기 <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">420명</span>
              <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-600" />
                8자리 고유번호 DB 관리
              </span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">심사 및 정산 대기 큐</span>
              <span className="text-lg font-bold text-rose-600 mt-1 block">
                {pendingDresses.length + settlementReadyContracts.length}건
              </span>
              <span className="text-[10px] text-rose-700 font-semibold">신속 처리 요망</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Summary of Portals */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2 border-slate-100">
                S2B2C 6대 포털 실시간 연동 현황
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">1. B2C 온라인 쇼룸 & 피팅 예약</span>
                  <span className="text-emerald-700 font-bold">정상 가동 중 (실시간 O2O)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">2. 플래너 & 헬퍼 포털 (Planner X)</span>
                  <span className="text-emerald-700 font-bold">420명 활동 / 수수료 15%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">3. 판매상 대리점 샵 관리 (OSM)</span>
                  <span className="text-emerald-700 font-bold">18개 샵 VIP룸 연동</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">4. 공급상 & 아틀리에 & 공방 (SCM)</span>
                  <span className="text-emerald-700 font-bold">10,240벌 재고 관리</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">5. 운영상 본사 통합 관제 (PMS)</span>
                  <span className="text-purple-700 font-bold">관제 센터 가동 중</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">6. 마스터 기준정보 시스템 (BIS)</span>
                  <span className="text-slate-600 font-bold">다국어/환율 기준정보 동기화</span>
                </div>
                <div 
                  onClick={() => setActiveTab('members')}
                  className="flex items-center justify-between p-2 bg-purple-50 hover:bg-purple-100 rounded-lg cursor-pointer transition border border-purple-200"
                >
                  <span className="font-semibold text-purple-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>7. 회원 데이터베이스 (Cloud SQL PostgreSQL)</span>
                  </span>
                  <span className="text-purple-700 font-bold flex items-center gap-1">
                    관리 콘솔 바로가기 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <div 
                  onClick={() => setActiveTab('supabase')}
                  className="flex items-center justify-between p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition border border-emerald-200"
                >
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>8. Supabase Studio 대시보드 (Table Editor)</span>
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    연동 허브 열기 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <div 
                  onClick={() => setActiveTab('planners')}
                  className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-lg cursor-pointer transition border border-purple-300 shadow-2xs"
                >
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-700" />
                    <span>9. 본사 공인 플래너 DB 테이블 (8자리 고유번호/피팅룸 실시간 예약 권한)</span>
                  </span>
                  <span className="text-purple-800 font-extrabold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                    플래너 테이블 바로가기 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Innovation Highlights */}
            <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white p-5 rounded-2xl shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>UNINET TOBMALL 혁신 비즈니스 모델 핵심</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                전통 웨딩 산업의 높은 고정비(직영점 임대료, 자체 재고 매입 위험)를 제거하고, 
                <strong>경자산 무가맹비 모델</strong>로 공급상 재고를 전 세계 오프라인 샵과 공유합니다.
              </p>
              <div className="space-y-1.5 text-slate-300 pt-1">
                <div>✔ <strong>건물주 파트너십 (왕차오 모델):</strong> 임대료 대신 20% 수익 쉐어로 공실 해결</div>
                <div>✔ <strong>지속 로열티 모델:</strong> 디자이너 3% + 생산공방 3% 영구 대여 쉐어</div>
                <div>✔ <strong>소셜 바이럴 플래너:</strong> 15% 수수료 기반 플래너 마이샵 네트워크</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT APPROVAL QUEUE (U2) */}
      {activeTab === 'approval' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-purple-700 uppercase">상품 승인 관제 (Process U2 / SCR-PMS-002)</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              공급상 등록 드레스 검수 및 포털 게시 승인
            </h3>
            <p className="text-slate-500 mt-1">
              SCM 공급상이 등록한 상품의 원단 품질, 사진 해상도, 대여가 적정성을 심사하고 승인 시 B2C 및 OSM 샵에 즉시 노출됩니다.
            </p>
          </div>

          <div className="space-y-3">
            {pendingDresses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                현재 심사 대기 중인 신규 상품이 없습니다. SCM 공급상 포털에서 신규 드레스를 등록해 보세요.
              </div>
            ) : (
              pendingDresses.map((dress) => (
                <div key={dress.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={dress.imageUrl} 
                      alt={dress.name} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover rounded-lg" 
                    />
                    <div>
                      <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                        {dress.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{dress.name}</h4>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {dress.designer} · {dress.workshop}
                      </div>
                      <div className="font-semibold text-purple-700 mt-1">
                        대여가: ₩{dress.rentalPrice.toLocaleString()} (보증금: ₩{dress.deposit.toLocaleString()})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onApproveDress(dress.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>심사 승인 및 B2C 노출 (U2 완료)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 7-PARTY SETTLEMENT ENGINE (U16) */}
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
            <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">
                  혁신 다자간 정산 엔진 (Process U16 / SCR-PMS-004)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  S2B2C 7대 참여 주체 스마트 배분정산 시뮬레이터
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">대여 결제 금액:</span>
                <input
                  type="number"
                  step="100000"
                  value={calcRentalFee}
                  onChange={(e) => setCalcRentalFee(Number(e.target.value))}
                  className="w-32 p-1.5 font-bold text-slate-900 bg-slate-50 border rounded-lg text-right"
                />
                <span>원</span>
              </div>
            </div>

            {/* 7-Party Visual Settlement Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. 대리점 샵 */}
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">1. 판매상 대리점 샵 (30%)</div>
                <div className="text-base font-bold text-purple-900">₩{agencyShare.toLocaleString()}</div>
                <div className="text-[10px] text-purple-700 font-semibold">오프라인 쇼룸 피팅 및 계약 유치</div>
              </div>

              {/* 2. 건물주 파트너십 */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">2. 건물주 파트너십 (20%)</div>
                <div className="text-base font-bold text-amber-900">₩{buildingShare.toLocaleString()}</div>
                <div className="text-[10px] text-amber-800 font-semibold">항저우 왕차오 센터 공간 제공</div>
              </div>

              {/* 3. 플래너 커미션 */}
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">3. 플래너 X 커미션 (15%)</div>
                <div className="text-base font-bold text-indigo-900">₩{plannerShare.toLocaleString()}</div>
                <div className="text-[10px] text-indigo-700 font-semibold">신부 연결 및 소셜 홍보</div>
              </div>

              {/* 4. 헬퍼 이모 출장비 */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">4. 헬퍼(이모) 수고비 (정액)</div>
                <div className="text-base font-bold text-emerald-900">₩{helperFee.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">본식 당일 현장 드레스 착장 케어</div>
              </div>

              {/* 5. 디자이너 로열티 */}
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">5. 디자이너 로열티 (3%)</div>
                <div className="text-base font-bold text-blue-900">₩{designerRoyalty.toLocaleString()}</div>
                <div className="text-[10px] text-blue-700 font-semibold">오트쿠튀르 디자인 창작 권리</div>
              </div>

              {/* 6. 생산 공방 로열티 */}
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 space-y-1">
                <div className="text-slate-500 font-medium text-[11px]">6. 생산공방 로열티 (3%)</div>
                <div className="text-base font-bold text-teal-900">₩{workshopRoyalty.toLocaleString()}</div>
                <div className="text-[10px] text-teal-700 font-semibold">수공예 자수·봉제 장인 배분</div>
              </div>

              {/* 7. 본사 운영 마진 */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs space-y-1 sm:col-span-2">
                <div className="text-slate-400 font-medium text-[11px]">7. 본사 PMS 플랫폼 운영 순마진</div>
                <div className="text-lg font-bold text-amber-300">₩{platformMargin.toLocaleString()}</div>
                <div className="text-[10px] text-slate-300">클라우드 인프라, 품질 보증, 글로벌 물류 관리</div>
              </div>
            </div>
          </div>

          {/* Pending Settlement Contracts Queue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">
              정산 집행 대기 계약 건 목록 (U16 스마트 정산)
            </h3>

            <div className="space-y-3">
              {settlementReadyContracts.map((c) => {
                const isExecuted = executedSettlements.includes(c.id);
                return (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-700">{c.id}</span>
                        <span className="font-bold text-slate-900">{c.customerName} - {c.dressName}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        대여 금액: ₩{c.rentalFee.toLocaleString()} · 계약 샵: {c.storeName}
                      </div>
                    </div>

                    <div>
                      {isExecuted ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">
                          7대 주체 정산 송금 완료
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRunSettlement(c.id)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>스마트 배분 정산 집행 (U16)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: FITTING ROOM RESERVATION CONTROL */}
      {activeTab === 'fitting' && (
        <PmsFittingRoomManager
          bookings={bookings}
          dresses={dresses}
          onUpdateBookingStatus={onUpdateBookingStatus}
          onRefresh={onRefreshBookings}
        />
      )}

      {/* TAB 4: BUILDING OWNER PARTNERSHIP (SCR-PMS-005) */}
      {activeTab === 'building' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-purple-700 uppercase">공간 파트너십 (SCR-PMS-005)</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              건물주 파트너십 항저우 왕차오 센터 (Wangchao Center) 20% 수익 쉐어 모델
            </h3>
            <p className="text-slate-500 mt-1">
              비어 있는 대형 복합몰 및 상가 공간을 플랫폼과 제휴하여, 고정 임대료 대신 대여 매출의 20%를 배분함으로써 공실률 0% 및 고수익을 창출합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">왕차오 센터 5월 정산액 (20%)</span>
              <span className="text-lg font-bold text-purple-900 mt-1 block">₩16,840,000</span>
              <span className="text-[10px] text-emerald-600 font-semibold">기존 공실 대비 +100% 수익 창출</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">전속 면적 및 인프라</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">420 ㎡ (127평)</span>
              <span className="text-[10px] text-slate-500">VIP 피팅룸 2실 + 드레스 쇼룸</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">연계 부대 매출 (F&B/주차)</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">월 4,200만원</span>
              <span className="text-[10px] text-indigo-600 font-semibold">예비 신혼부부 유입 효과</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEMBERS DATABASE MANAGEMENT (Cloud SQL / PostgreSQL) */}
      {activeTab === 'members' && (
        <MemberManagementView />
      )}

      {/* TAB 6: SUPABASE STUDIO DATABASE INTEGRATION */}
      {activeTab === 'supabase' && (
        <SupabaseStudioManager dresses={dresses} />
      )}

      {/* TAB 7: CERTIFIED PLANNERS DATABASE TABLE (8-Digit Code & Fitting Auth) */}
      {activeTab === 'planners' && (
        <PlannerManagementView onNavigateToFitting={() => setActiveTab('fitting')} />
      )}
    </div>
  );
};
