import React, { useState, useEffect } from 'react';
import {
  Award, Search, UserPlus, Trash2, Shield, CheckCircle2,
  RefreshCw, Phone, Mail, Database, Sparkles, X, DoorClosed,
  Copy, Check, AlertCircle, ArrowUpRight, Building
} from 'lucide-react';

export interface PlannerItem {
  id: number;
  plannerNumber: string;
  name: string;
  phone: string;
  email: string | null;
  agency: string | null;
  grade: string | null;
  status: string;
  userUid: string | null;
  commissionRate: string | null;
  totalBookings: string | null;
  createdAt: string | null;
}

interface PlannerManagementViewProps {
  onNavigateToFitting?: () => void;
}

export const PlannerManagementView: React.FC<PlannerManagementViewProps> = ({
  onNavigateToFitting
}) => {
  const [planners, setPlanners] = useState<PlannerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [agencyFilter, setAgencyFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // New Planner Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newPlannerNumber, setNewPlannerNumber] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAgency, setNewAgency] = useState<string>('본사 직속 프리미엄 센터');
  const [newGrade, setNewGrade] = useState<string>('수석 플래너 (Master)');
  const [newCommissionRate, setNewCommissionRate] = useState<string>('15%');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchPlanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/planners');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPlanners(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch planners:', err);
      showNotification('플래너 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanners();
  }, []);

  // Generate recommended 8-digit planner number: 26-XXXXX
  const handleOpenAddModal = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    setNewPlannerNumber(`26-${randomSuffix}`);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAgency('본사 직속 프리미엄 센터');
    setNewGrade('수석 플래너 (Master)');
    setNewCommissionRate('15%');
    setIsAddModalOpen(true);
  };

  const handleCreatePlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('플래너 성명과 연락처를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/planners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plannerNumber: newPlannerNumber.trim(),
          name: newName.trim(),
          phone: newPhone.trim(),
          email: newEmail.trim() || undefined,
          agency: newAgency.trim(),
          grade: newGrade.trim(),
          commissionRate: newCommissionRate.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPlanners(prev => [data.data, ...prev]);
        setIsAddModalOpen(false);
        showNotification(`[${data.data.name}] 플래너(${data.data.plannerNumber})가 planners DB에 성공적으로 등록되었습니다.`);
      } else {
        alert(data.error || '플래너 등록 실패');
      }
    } catch (err) {
      alert('플래너 등록 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlanner = async (plannerNumber: string, name: string) => {
    if (!window.confirm(`정말로 [${plannerNumber} / ${name}] 플래너를 DB에서 삭제하시겠습니까?\n삭제 시 해당 플래너 번호로의 피팅룸 실시간 예약 권한이 회수됩니다.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/planners/${plannerNumber}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPlanners(prev => prev.filter(p => p.plannerNumber !== plannerNumber));
        showNotification(`[${plannerNumber} / ${name}] 플래너가 성공적으로 삭제되었습니다.`);
      } else {
        showNotification(data.error || '플래너 삭제 실패');
      }
    } catch (err) {
      showNotification('플래너 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    showNotification(`플래너 고유번호 [${num}]가 클립보드에 복사되었습니다.`);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // Filter planners
  const filteredPlanners = planners.filter(p => {
    const matchesAgency = agencyFilter === 'ALL' || (p.agency && p.agency.includes(agencyFilter));
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.plannerNumber.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.agency && p.agency.toLowerCase().includes(query)) ||
      (p.grade && p.grade.toLowerCase().includes(query));
    return matchesAgency && matchesQuery;
  });

  const uniqueAgencies = Array.from(
    new Set(planners.map(p => p.agency).filter(Boolean))
  ) as string[];

  const totalBookingsSum = planners.reduce((sum, p) => {
    const val = parseInt(p.totalBookings || '0', 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-purple-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Award className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                본사 공인 플래너 DB 테이블 (<code className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-xs border border-purple-200">planners</code>)
              </h2>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                독립 테이블 실시간 연동
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              본사 발급 8자리 고유번호(<code className="font-mono text-slate-700">XX-XXXXX</code>) 체계로 가입되며, 오프라인 피팅룸 실시간 예약 권한이 부여된 공인 파트너 명단입니다.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToFitting && (
            <button
              type="button"
              onClick={onNavigateToFitting}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="피팅룸 실시간 예약 관제 탭으로 이동"
            >
              <DoorClosed className="w-3.5 h-3.5 text-purple-600" />
              <span>피팅룸 예약 현황 바로가기</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          )}

          <button
            type="button"
            onClick={fetchPlanners}
            disabled={isLoading}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>신규 플래너 8자리 번호 발급</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 block">등록 인증 플래너</span>
          <span className="text-xl font-extrabold text-purple-900 mt-1 block">{planners.length}명</span>
          <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
            <Shield className="w-3 h-3" />
            전용 planners DB 관리
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 block">기준 커미션 배분율</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">15.0%</span>
          <span className="text-[10px] text-slate-500">7대 주체 스마트 계약 자동 분배</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 block">피팅룸 실시간 연계</span>
          <span className="text-xl font-extrabold text-indigo-700 mt-1 block">
            {totalBookingsSum}건
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold">피팅룸 예약 권한 100% 부여</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 block">플래너 번호 형식 규격</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1 block font-mono">8자리</span>
          <span className="text-[10px] text-emerald-700 font-semibold">하이픈 포함 (예: 26-00275)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-semibold">소속 지사 필터:</span>
          <button
            type="button"
            onClick={() => setAgencyFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              agencyFilter === 'ALL'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 지사 ({planners.length})
          </button>
          {uniqueAgencies.map(agency => (
            <button
              key={agency}
              type="button"
              onClick={() => setAgencyFilter(agency)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                agencyFilter === agency
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {agency} ({planners.filter(p => p.agency === agency).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="8자리 번호, 성명, 연락처, 지사 검색..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Planners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">플래너 데이터베이스 목록</span>
            <span className="text-[11px] text-slate-500">
              (총 {planners.length}명 중 {filteredPlanners.length}명 표시)
            </span>
          </div>
          <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            테이블: <strong className="font-mono">planners</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4">고유 번호 (8자리)</th>
                <th className="py-3 px-4">플래너 성명</th>
                <th className="py-3 px-4">소속 지사 / 대리점</th>
                <th className="py-3 px-4">연락처 & 이메일</th>
                <th className="py-3 px-4">직급 / 등급</th>
                <th className="py-3 px-4 text-center">정산율</th>
                <th className="py-3 px-4 text-center">피팅 연계</th>
                <th className="py-3 px-4 text-center">인증 상태</th>
                <th className="py-3 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                    <span>플래너 DB 테이블을 조회하는 중입니다...</span>
                  </td>
                </tr>
              ) : filteredPlanners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>조건에 일치하는 플래너가 없습니다.</span>
                  </td>
                </tr>
              ) : (
                filteredPlanners.map((planner) => (
                  <tr key={planner.plannerNumber} className="hover:bg-purple-50/40 transition">
                    {/* 8-digit Planner Number with Copy */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                        <span className="text-purple-900">{planner.plannerNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(planner.plannerNumber)}
                          className="text-purple-400 hover:text-purple-700 transition"
                          title="8자리 번호 복사"
                        >
                          {copiedNumber === planner.plannerNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{planner.name}</div>
                      {planner.userUid && (
                        <div className="text-[10px] text-slate-400 font-mono">{planner.userUid}</div>
                      )}
                    </td>

                    {/* Agency */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{planner.agency || '본사 직속'}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{planner.phone}</span>
                      </div>
                      {planner.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <Mail className="w-3 h-3" />
                          <span>{planner.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Grade */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {planner.grade || '인증 플래너'}
                      </span>
                    </td>

                    {/* Commission */}
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {planner.commissionRate || '15%'}
                    </td>

                    {/* Total Bookings */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-xs">
                        {planner.totalBookings || '0'}건
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {planner.status === '가입대기' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          발급완료 (미가입)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {planner.status || '인증완료'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDeletePlanner(planner.plannerNumber, planner.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="플래너 DB 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Planner Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-400/30">
                  <UserPlus className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">신규 플래너 8자리 번호 발급 및 등록</h3>
                  <p className="text-xs text-purple-200/80">
                    본사 고유번호를 발급하여 <code className="font-mono text-white">planners</code> 테이블에 영구 저장합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlanner} className="p-5 space-y-4 text-xs">
              {/* Planner Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    본사 발급 8자리 플래너 번호 *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.floor(10000 + Math.random() * 90000);
                      setNewPlannerNumber(`26-${rand}`);
                    }}
                    className="text-[11px] text-purple-600 hover:text-purple-800 font-bold"
                  >
                    자동 난수 생성
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPlannerNumber}
                  onChange={(e) => setNewPlannerNumber(e.target.value)}
                  placeholder="예: 26-00275"
                  className="w-full p-2.5 bg-purple-50/50 border border-purple-200 rounded-xl font-mono font-bold text-purple-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  형식: 하이픈 포함 8자리 (예: 26-00275, 26은 2026년 본사 정규 인가 코드)
                </p>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    플래너 성명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="예: 정하윤"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    연락처 (휴대폰) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="예: 010-8742-9912"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  이메일 주소 (선택)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="예: hayun.jung@tobmall.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              {/* Agency & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    소속 지사 / 대리점
                  </label>
                  <select
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="본사 직속 프리미엄 센터">본사 직속 프리미엄 센터</option>
                    <option value="상하이 와이탄 지사">상하이 와이탄 지사</option>
                    <option value="베이징 차오양 지사">베이징 차오양 지사</option>
                    <option value="서울 청담 부티크 파트너스">서울 청담 부티크 파트너스</option>
                    <option value="항저우 왕차오 센터">항저우 왕차오 센터</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    직급 / 등급
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="수석 플래너 (Master)">수석 플래너 (Master)</option>
                    <option value="책임 플래너 (Senior)">책임 플래너 (Senior)</option>
                    <option value="전임 플래너 (Associate)">전임 플래너 (Associate)</option>
                    <option value="공인 플래너 (Junior)">공인 플래너 (Junior)</option>
                  </select>
                </div>
              </div>

              {/* Commission Rate */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  정산 수수료 배분율
                </label>
                <input
                  type="text"
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(e.target.value)}
                  placeholder="예: 15%"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>플래너 DB 등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
