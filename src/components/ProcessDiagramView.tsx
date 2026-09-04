import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, User, Building, Store, Users, ShoppingCart, 
  Layers, ChevronRight, Info, AlertCircle 
} from 'lucide-react';
import { PROCESS_STEPS, SCREEN_SPECS } from '../data/screenSpecsData';

interface ProcessDiagramViewProps {
  onSelectScreen: (screenId: string) => void;
}

export const ProcessDiagramView: React.FC<ProcessDiagramViewProps> = ({ onSelectScreen }) => {
  const [activeStepId, setActiveStepId] = useState<string>('U1');

  const activeStep = PROCESS_STEPS.find((p) => p.id === activeStepId) || PROCESS_STEPS[0];
  const relatedScreens = SCREEN_SPECS.filter((s) => s.processCodes.includes(activeStep.id));

  const actors = [
    { name: '공급상', icon: Building, color: 'border-blue-500 bg-blue-50 text-blue-700', desc: '상품공급, 수주, 출고, 공방로열티' },
    { name: '운영상', icon: Layers, color: 'border-purple-500 bg-purple-50 text-purple-700', desc: '포털운영, 상품심사, 배분정산 (PMS)' },
    { name: '판매상', icon: Store, color: 'border-emerald-500 bg-emerald-50 text-emerald-700', desc: '대리점 샵, 피팅룸, 대여계약, OSM' },
    { name: '판매자', icon: Users, color: 'border-amber-500 bg-amber-50 text-amber-700', desc: '플래너(위챗홍보), 헬퍼이모(현장케어)' },
    { name: '소비자', icon: ShoppingCart, color: 'border-rose-500 bg-rose-50 text-rose-700', desc: '드레스탐색, 샵예약, 본식정보등록' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Flow chart logic */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded">
                도면 순번 1-3 & 3-1 기준
              </span>
              <span className="text-xs text-slate-500">TOBMALL 플랫폼 TO-BE 비즈니스 프로세스</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              S2B2C 엔드투엔드 비즈니스 흐름도 (U1 ~ U16 전체 절차)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              공급상 상품등록(U1)부터 운영상 상품심사(U2), 대리점 마이샵(U3) 및 발주/수주/출고(U4~U8), 플래너 홍보(U10), 소비자 예약(U11), 오프라인 피팅/대여(U12~U15), 최종 다자간 배분정산(U16)까지의 전체 라이프사이클
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {actors.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.name} className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${act.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{act.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Step Node Selector Buttons */}
        <div className="pt-4 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-[900px]">
            {PROCESS_STEPS.map((step, idx) => {
              const isCurrent = step.id === activeStep.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveStepId(step.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-xs transition text-left shrink-0 w-44 ${
                      isCurrent
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300'
                        : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                      }`}>
                        ({step.id})
                      </span>
                      <span className={`text-[10px] font-semibold ${isCurrent ? 'text-purple-100' : 'text-slate-500'}`}>
                        {step.actor}
                      </span>
                    </div>
                    <div className={`font-bold mt-1 line-clamp-1 text-xs ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                      {step.name}
                    </div>
                    <div className={`text-[10px] mt-0.5 line-clamp-1 ${isCurrent ? 'text-purple-100' : 'text-slate-500'}`}>
                      모듈: {step.systemModule}
                    </div>
                  </button>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Card for Active Selected Process Step */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
              ({activeStep.id}) {activeStep.name}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
              수행 주체: {activeStep.actor}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              관련 모듈: {activeStep.systemModule}
            </span>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-xs">업무 수행 절차 설명</h4>
            {activeStep.description}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">입력 데이터 (Input)</span>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {activeStep.inputData.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">출력 데이터 (Output)</span>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {activeStep.outputData.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-xs">
            <span className="font-semibold text-slate-700 mr-2">원본 문서 관련 프로그램:</span>
            {activeStep.relatedPrograms.map((prog, i) => (
              <span key={i} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] mr-1.5 font-medium">
                • {prog}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Implemented Web Screens for this Process */}
        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>본 절차({activeStep.id})를 구현하는 웹 화면</span>
            </h4>
            <span className="text-[11px] text-purple-700 font-semibold">{relatedScreens.length}개 화면</span>
          </div>

          <div className="mt-3 space-y-2.5 flex-1">
            {relatedScreens.length > 0 ? (
              relatedScreens.map((screen) => (
                <div
                  key={screen.id}
                  className="bg-white p-3 rounded-lg border border-slate-200 hover:border-purple-300 shadow-2xs transition flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700 text-xs">{screen.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                      {screen.portalName}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">{screen.title}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{screen.summary}</p>

                  <button
                    onClick={() => onSelectScreen(screen.id)}
                    className="mt-1 flex items-center justify-between text-[11px] font-semibold text-purple-600 hover:text-purple-800 pt-1.5 border-t border-slate-100"
                  >
                    <span>화면 와이어프레임 바로보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-4 text-center">
                연결된 화면 정의 준비 중
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
