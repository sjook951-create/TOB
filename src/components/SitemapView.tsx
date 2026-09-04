import React from 'react';
import { 
  Network, Globe, Store, Truck, Shield, Database, 
  Users, Building, ExternalLink, ChevronRight, CheckCircle 
} from 'lucide-react';
import { SCREEN_SPECS, SYSTEM_MODULE_SUMMARIES } from '../data/screenSpecsData';
import { PortalType } from '../types';

interface SitemapViewProps {
  onSelectScreen: (id: string) => void;
  onFilterPortal: (portal: PortalType) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  onSelectScreen,
  onFilterPortal
}) => {
  const portalGroups: {
    portal: PortalType;
    title: string;
    icon: any;
    color: string;
    badge: string;
    sub: string;
  }[] = [
    {
      portal: 'B2C',
      title: 'B2C 고객 온라인 포털 (Online Shop)',
      icon: Globe,
      color: 'from-rose-500 to-pink-600',
      badge: 'B2C / OSM 연계',
      sub: '글로벌 드레스 룩북, 3D/VR, O2O 피팅 예약, 토털 패키지'
    },
    {
      portal: 'PLANNER',
      title: '플래너 & 헬퍼(이모) 포털',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
      badge: '소셜 마케팅 & 현장케어',
      sub: '위챗 모멘트 바이럴 링크, 샤오홍슈 숏폼, 본식 헬퍼 출고/입고 체크, 수수료 정산'
    },
    {
      portal: 'OSM',
      title: '판매상 대리점 샵 관리 (OSM)',
      icon: Store,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Off-line Shop Management',
      sub: '피팅룸 스케줄, 인원 배정, 상품 시착/체험, 대여 계약, 이모 출고/입고/마감'
    },
    {
      portal: 'SCM',
      title: '공급상 & 디자이너 & 공방 (SCM)',
      icon: Truck,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Supply Chain Management',
      sub: '신작 등록(U1), 수주/출하지시, 생산공방 연계 제조, 디자이너 3% 로열티'
    },
    {
      portal: 'PMS',
      title: '운영상 본사 통합 관리 (PMS)',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Portal Management System',
      sub: '상품 심사 승인(U2), 다자간 룰기반 배분정산 엔진(U16), 건물주 20% 수익분배'
    },
    {
      portal: 'BIS',
      title: '마스터 기준정보 시스템 (BIS)',
      icon: Database,
      color: 'from-slate-700 to-slate-900',
      badge: 'Baseline Information System',
      sub: '회사/부서/사용자 RBAC, 창고, 거래처, 품목 매핑, 다국어 환율 동기화'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Architecture Overview (Recreating Page 4 Architecture Diagram) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
              도면 순번 1-2 시스템 구조 설계
            </span>
            <span className="text-xs text-slate-500">TOBMALL 플랫폼 TO-BE</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            TOBMALL S2B2C 엔터프라이즈 사이트맵 및 시스템 계층도
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            공급상(SCM/SVM/ETM) ➔ 운영상(B2B/PMS) ➔ 판매상(SMS/EVM/OMS) ➔ 판매자(B2C/OSM) 및 하위 BIS 통합 기반
          </p>
        </div>

        {/* System Architecture Flow Diagram */}
        <div className="py-4 overflow-x-auto">
          <div className="min-w-[760px] flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center">
            <div className="flex-1 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <span className="font-bold text-blue-900 block mb-1">공급상 (Supplier)</span>
              <div className="flex justify-center gap-1 text-[11px] font-mono text-blue-700 font-semibold">
                <span className="bg-white px-2 py-0.5 rounded border border-blue-100">SCM</span>
                <span className="bg-white px-2 py-0.5 rounded border border-blue-100">SVM</span>
                <span className="bg-white px-2 py-0.5 rounded border border-blue-100">ETM</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">상품공급 / 웨딩여행 / 교육훈련</span>
            </div>

            <span className="text-slate-400 font-bold text-lg">➔</span>

            <div className="flex-1 bg-purple-50 border border-purple-200 p-3 rounded-lg">
              <span className="font-bold text-purple-900 block mb-1">운영상 (Operator)</span>
              <div className="flex justify-center gap-1 text-[11px] font-mono text-purple-700 font-semibold">
                <span className="bg-white px-2 py-0.5 rounded border border-purple-100">B2B</span>
                <span className="bg-white px-2 py-0.5 rounded border border-purple-100">PMS</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">포털관리 / 상품심사 / 배분정산</span>
            </div>

            <span className="text-slate-400 font-bold text-lg">➔</span>

            <div className="flex-1 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <span className="font-bold text-emerald-900 block mb-1">판매상 (Agency)</span>
              <div className="flex justify-center gap-1 text-[11px] font-mono text-emerald-700 font-semibold">
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-100">SMS</span>
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-100">EVM</span>
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-100">OMS</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">마이샵 / 이벤트 / 오더관리</span>
            </div>

            <span className="text-slate-400 font-bold text-lg">➔</span>

            <div className="flex-1 bg-rose-50 border border-rose-200 p-3 rounded-lg">
              <span className="font-bold text-rose-900 block mb-1">판매자 & 소비자</span>
              <div className="flex justify-center gap-1 text-[11px] font-mono text-rose-700 font-semibold">
                <span className="bg-white px-2 py-0.5 rounded border border-rose-100">B2C</span>
                <span className="bg-white px-2 py-0.5 rounded border border-rose-100">OSM</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">온라인 홍보 / 오프라인 피팅 체험</span>
            </div>
          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full border border-slate-300">
              하부 공통 인프라: BIS (Baseline Information System - 회사/창고/거래처/품목/가격/환율)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Portals with their Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portalGroups.map((group) => {
          const groupScreens = SCREEN_SPECS.filter((s) => s.portal === group.portal);
          const Icon = group.icon;

          return (
            <div
              key={group.portal}
              className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col"
            >
              {/* Card Header with Gradient Accent */}
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${group.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
                      <span className="text-[11px] text-slate-500">{group.badge}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {groupScreens.length}개 화면
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 line-clamp-1">{group.sub}</p>
              </div>

              {/* Screens List */}
              <div className="p-3 divide-y divide-slate-100 flex-1">
                {groupScreens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => onSelectScreen(screen.id)}
                    className="w-full text-left py-2 px-2 hover:bg-slate-50 rounded-lg transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-purple-700">
                          {screen.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition">
                          {screen.title}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {screen.path}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => onFilterPortal(group.portal)}
                  className="text-xs text-purple-700 font-semibold hover:underline"
                >
                  본 포털 화면 모아보기 ➔
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
