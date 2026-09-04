import React, { useState } from 'react';
import { 
  Monitor, Smartphone, Check, ArrowRight, Calendar, User, ShoppingBag, 
  Sparkles, ExternalLink, ShieldCheck, MapPin, Tag, FileCode, CheckCircle2,
  ChevronRight, Building2, TrendingUp, Scissors, Store
} from 'lucide-react';
import { ScreenSpec } from '../types';

interface WireframeViewerProps {
  screens: ScreenSpec[];
  selectedScreenId: string;
  onSelectScreen: (id: string) => void;
}

export const WireframeViewer: React.FC<WireframeViewerProps> = ({
  screens,
  selectedScreenId,
  onSelectScreen,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [detailTab, setDetailTab] = useState<'spec' | 'code' | 'flow'>('spec');

  const currentScreen = screens.find((s) => s.id === selectedScreenId) || screens[0];

  if (!currentScreen) {
    return (
      <div className="p-12 text-center text-slate-500">
        일치하는 화면 정의가 없습니다. 검색 조건을 초기화하세요.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left List of Screens */}
      <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col h-[780px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-purple-600" />
            <span>화면 목록 ({screens.length}건)</span>
          </h3>
          <span className="text-xs text-slate-500">선택하여 미리보기</span>
        </div>

        <div className="overflow-y-auto pr-1 space-y-2 flex-1 scrollbar-thin">
          {screens.map((screen) => {
            const isSelected = screen.id === currentScreen.id;
            return (
              <button
                key={screen.id}
                onClick={() => onSelectScreen(screen.id)}
                className={`w-full text-left p-3 rounded-lg border transition text-xs flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-purple-50/80 border-purple-300 ring-1 ring-purple-400'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-purple-700">{screen.id}</span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {screen.portalName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      screen.gapType === 'CBO' ? 'bg-purple-100 text-purple-800' :
                      screen.gapType === 'INT' ? 'bg-emerald-100 text-emerald-800' :
                      screen.gapType === 'BPM' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {screen.gapType}
                    </span>
                  </div>
                </div>

                <div className="font-semibold text-slate-900 text-xs line-clamp-1">
                  {screen.title}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="line-clamp-1">역할: {screen.role}</span>
                  <span className="font-mono text-indigo-600 font-medium">
                    {screen.processCodes.join(', ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center & Right: Interactive Wireframe Preview & Details Panel */}
      <div className="xl:col-span-8 flex flex-col gap-5">
        {/* Screen Top Header Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-purple-700 text-xs px-2 py-0.5 bg-purple-50 border border-purple-200 rounded">
                {currentScreen.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                모듈: {currentScreen.systemModule}
              </span>
              <span className="text-xs font-mono text-slate-500">
                경로: {currentScreen.path}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {currentScreen.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentScreen.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition ${
                  deviceMode === 'desktop' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-600'
                }`}
                title="데스크톱 뷰"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">데스크톱</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition ${
                  deviceMode === 'mobile' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-600'
                }`}
                title="모바일 뷰"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">모바일</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Realistic Interactive Mockup Canvas */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 sm:p-6 shadow-inner flex justify-center items-start min-h-[520px] overflow-hidden">
          <div
            className={`transition-all duration-300 bg-white border border-slate-300 rounded-xl shadow-lg flex flex-col overflow-hidden ${
              deviceMode === 'desktop' ? 'w-full' : 'w-[375px] max-w-full'
            }`}
          >
            {/* Mock Browser/Device Header */}
            <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  https://tobmall.com{currentScreen.path}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-purple-700">
                {currentScreen.wireframeData.badge}
              </span>
            </div>

            {/* Wireframe Mock Screen Body */}
            <div className="p-4 sm:p-5 flex flex-col gap-4 bg-slate-50/50 max-h-[560px] overflow-y-auto">
              {/* Wireframe Title & Stats Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-5 bg-purple-600 rounded-full inline-block"></span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {currentScreen.wireframeData.sectionTitle}
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    역할: {currentScreen.role}
                  </span>
                </div>

                {/* Optional Top KPI Stats */}
                {currentScreen.wireframeData.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-1">
                    {currentScreen.wireframeData.stats.map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">{stat.value}</div>
                        {stat.sub && (
                          <div className="text-[10px] text-purple-600 font-medium">{stat.sub}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sections rendering based on Wireframe type */}
              {currentScreen.wireframeData.sections.map((section, sIdx) => (
                <div key={sIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                    <span>{section.title}</span>
                    {section.description && (
                      <span className="text-[11px] text-slate-500 font-normal">{section.description}</span>
                    )}
                  </div>

                  {/* Type 1: Hero */}
                  {section.type === 'hero' && (
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-4 rounded-lg flex flex-col gap-2">
                      <div className="text-xs font-semibold tracking-wide text-purple-200">
                        TOBMALL S2B2C ECOSYSTEM
                      </div>
                      <div className="text-sm font-bold leading-snug">
                        {section.title}
                      </div>
                      <p className="text-xs text-purple-100 leading-relaxed">
                        {section.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {section.items.map((item: string, i: number) => (
                          <span key={i} className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type 2: Grid */}
                  {section.type === 'grid' && (
                    <div className={`grid gap-3 ${deviceMode === 'desktop' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                      {section.items.map((item: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition flex flex-col justify-between text-xs">
                          <div>
                            <div className="font-semibold text-slate-900 line-clamp-1">{item.name || item.dress || item.room}</div>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {item.category || item.designer || item.time || item.views}
                            </div>
                            {item.score && (
                              <div className="text-amber-600 font-semibold text-[11px] mt-1">{item.score}</div>
                            )}
                            {item.memo && (
                              <div className="text-slate-600 text-[11px] mt-0.5 bg-white p-1 rounded border border-slate-200">
                                {item.memo}
                              </div>
                            )}
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-purple-700">{item.price || item.rating || item.status || item.cta}</span>
                            <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-0.5">
                              <span>확인</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Type 3: Table */}
                  {section.type === 'table' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            {Object.keys(section.items[0] || {}).map((colKey) => (
                              <th key={colKey} className="py-2 px-2.5 capitalize text-[11px]">
                                {colKey}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {section.items.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              {Object.values(row).map((val: any, cIdx: number) => (
                                <td key={cIdx} className="py-2 px-2.5 text-[11px] text-slate-700 whitespace-nowrap">
                                  {typeof val === 'string' && val.includes('완료') ? (
                                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      {val}
                                    </span>
                                  ) : typeof val === 'string' && val.includes('대기') ? (
                                    <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                      {val}
                                    </span>
                                  ) : (
                                    val
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Type 4: Form */}
                  {section.type === 'form' && (
                    <div className="space-y-2.5">
                      {section.items.map((field: any, fIdx: number) => (
                        <div key={fIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-700 sm:w-1/3">{field.label}</span>
                          <span className="text-slate-900 font-medium sm:w-2/3 bg-white px-2.5 py-1 rounded border border-slate-200/80">
                            {field.value}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 flex justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium">
                          초기화
                        </button>
                        <button className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded font-medium shadow-xs">
                          입력 데이터 확정 및 처리
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Type 5: Steps */}
                  {section.type === 'steps' && (
                    <div className="flex flex-col gap-2">
                      {section.items.map((st: any, sIdx: number) => (
                        <div key={sIdx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {sIdx + 1}
                          </span>
                          <div className="flex-1 font-semibold text-slate-900">{st.step}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{st.date}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.status === '완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {st.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Type 6: Detail */}
                  {section.type === 'detail' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {section.items.map((d: any, dIdx: number) => (
                        <div key={dIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="text-[11px] font-semibold text-slate-500">{d.label}</div>
                          <div className="text-xs font-medium text-slate-900 mt-0.5">{d.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Technical Specification & Layout Details Tab */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDetailTab('spec')}
                className={`text-xs font-bold pb-1 transition border-b-2 ${
                  detailTab === 'spec' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                화면 기능 상세 명세서
              </button>
              <button
                onClick={() => setDetailTab('flow')}
                className={`text-xs font-bold pb-1 transition border-b-2 ${
                  detailTab === 'flow' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                연계 비즈니스 프로세스 ({currentScreen.processCodes.join(', ')})
              </button>
              <button
                onClick={() => setDetailTab('code')}
                className={`text-xs font-bold pb-1 transition border-b-2 ${
                  detailTab === 'code' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                React 컴포넌트 구현 스니펫
              </button>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              GAP 타입: <strong className="text-slate-700">{currentScreen.gapType}</strong>
            </span>
          </div>

          <div className="pt-4 text-xs">
            {detailTab === 'spec' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>핵심 요구 기능 (Key Features)</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 pl-1">
                    {currentScreen.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-bold text-slate-900 mt-4 mb-2">화면 레이아웃 구조</h4>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                    {currentScreen.layoutDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">입력 / 출력 데이터 정의</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">입력 (Inputs)</span>
                      <ul className="text-slate-600 space-y-1 list-disc list-inside">
                        {currentScreen.dataItems.inputs.map((inp, idx) => (
                          <li key={idx}>{inp}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">출력 (Outputs)</span>
                      <ul className="text-slate-600 space-y-1 list-disc list-inside">
                        {currentScreen.dataItems.outputs.map((out, idx) => (
                          <li key={idx}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 mb-2">UI 컴포넌트 분할</h4>
                  <div className="space-y-1.5">
                    {currentScreen.uiComponents.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200">
                        <span className="font-semibold text-slate-800">{comp.name}</span>
                        <span className="px-2 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded font-medium">
                          {comp.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'flow' && (
              <div className="space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  본 화면은 TOBMALL 플랫폼 TO-BE 프로세스 중 <strong>{currentScreen.processCodes.join(', ')}</strong> 단계를 수행하는 인터페이스입니다.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-900">연계 비즈니스 주체:</div>
                  <div className="text-slate-700">
                    역할자 <strong>{currentScreen.role}</strong> 이(가) <strong>{currentScreen.systemModule}</strong> 모듈을 통해 실행하며, 처리 결과는 실시간 데이터베이스 및 후속 프로세스(U단계)로 트리거됩니다.
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'code' && (
              <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-60 scrollbar-thin">
                <pre>{`// Component: ${currentScreen.id}.tsx
// Path: src/pages${currentScreen.path}.tsx
import React, { useState, useEffect } from 'react';

export const ${currentScreen.id.replace(/-/g, '')}: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Role: ${currentScreen.role}
  // Process Mapping: ${currentScreen.processCodes.join(', ')}

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-xl font-bold">${currentScreen.title}</h1>
        <span className="badge">${currentScreen.systemModule}</span>
      </header>

      {/* Main UI Layout: ${currentScreen.layoutDescription} */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Component Implementation */}
      </main>
    </div>
  );
};`}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
