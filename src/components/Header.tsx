import React from 'react';
import { FileText, Printer, CheckSquare, Search, Layers, Compass, GitCommit, LayoutGrid, Globe, Sparkles } from 'lucide-react';
import { PortalType } from '../types';
import { UserMenu } from './auth/UserMenu';

interface HeaderProps {
  currentView: 'live' | 'wireframe' | 'table' | 'process' | 'sitemap' | 'report';
  setCurrentView: (view: 'live' | 'wireframe' | 'table' | 'process' | 'sitemap' | 'report') => void;
  selectedPortal: PortalType | 'ALL';
  setSelectedPortal: (portal: PortalType | 'ALL') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showApprovalBox: boolean;
  setShowApprovalBox: (show: boolean) => void;
  totalScreens: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  selectedPortal,
  setSelectedPortal,
  searchTerm,
  setSearchTerm,
  showApprovalBox,
  setShowApprovalBox,
  totalScreens,
}) => {
  const portalOptions: { key: PortalType | 'ALL'; label: string; count?: string }[] = [
    { key: 'ALL', label: '전체 포털 (All)' },
    { key: 'B2C', label: 'B2C 소비자' },
    { key: 'PLANNER', label: '플래너 & 이모' },
    { key: 'OSM', label: '판매상 OSM 샵' },
    { key: 'SCM', label: '공급상 & 공방 SCM' },
    { key: 'PMS', label: '운영상 PMS 본사' },
    { key: 'BIS', label: '기준정보 BIS' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Document Meta Bar (Based on UNINET TOBMALL TO-BE Spec) */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded text-[11px] border border-purple-700/50">
            TOBMALL TO-BE
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium">友霓网络科技(上海)有限公司</span>
          <span className="hidden md:inline text-slate-500">·</span>
          <span className="hidden md:inline text-slate-400">설계자: 편민철</span>
          <span className="hidden md:inline text-slate-500">·</span>
          <span className="hidden md:inline text-slate-400">작성일자: 2026. 05. 20</span>
          <span className="hidden lg:inline bg-slate-800 text-emerald-300 px-2 py-0.5 rounded text-[11px]">
            단계: B. 분석/설계 (완료)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApprovalBox(!showApprovalBox)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition text-xs ${
              showApprovalBox ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="결재란 (대표 / 본부장 / 실장 서명란)"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>결재 서명란 {showApprovalBox ? '닫기' : '열기'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs transition"
            title="문서 인쇄 / PDF 저장"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">문서 인쇄 / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                TOBMALL 웨딩 플랫폼
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              S2B2C 혁신 모델 (SCM 글로벌공급망 · OSM 대리점샵 · PMS 본사 · 플래너 · 건물주 파트너십)
            </p>
          </div>
        </div>

        {/* View Mode Switcher Buttons & User Auth Menu */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setCurrentView('live')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              currentView === 'live'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>라이브 웹사이트</span>
          </button>

          <button
            onClick={() => setCurrentView('wireframe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              currentView === 'wireframe'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>UI 목업</span>
          </button>

          <button
            onClick={() => setCurrentView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              currentView === 'table'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>화면 정의서</span>
          </button>

          <button
            onClick={() => setCurrentView('process')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              currentView === 'process'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>흐름도 (U1~U16)</span>
          </button>

          <button
            onClick={() => setCurrentView('sitemap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              currentView === 'sitemap'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>사이트맵</span>
          </button>

          <button
            onClick={() => setCurrentView('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              currentView === 'report'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>보고서 & PDF</span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* 우측 상단 회원가입 및 로그인 메뉴 */}
        <UserMenu />
      </div>
    </div>

      {currentView !== 'live' && (
        <div className="px-4 sm:px-6 py-2 bg-slate-50 border-t border-slate-200 flex justify-end">
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="화면명, ID, 프로세스(U1..), 키워드 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      )}
    </header>
  );
};
