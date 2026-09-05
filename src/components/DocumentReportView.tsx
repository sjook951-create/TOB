import React, { useState, useRef } from 'react';
import { 
  Download, Printer, CheckCircle, FileText, CheckSquare, Layers, 
  ShieldCheck, Eye, EyeOff, Filter, Sparkles, Loader2, AlertCircle, 
  ChevronDown, Check
} from 'lucide-react';
import { SCREEN_SPECS, PROCESS_STEPS } from '../data/screenSpecsData';
import { ApprovalBox } from './ApprovalBox';
import { WireframeMockup } from './WireframeMockup';
import { exportReportToPdf } from '../utils/pdfExport';
import { PortalType } from '../types';

export const DocumentReportView: React.FC = () => {
  const [includeWireframes, setIncludeWireframes] = useState<boolean>(true);
  const [selectedPortal, setSelectedPortal] = useState<PortalType | 'ALL'>('ALL');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<{ step: string; percent: number } | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  
  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Filtered screens for the report
  const filteredScreens = SCREEN_SPECS.filter((s) => {
    return selectedPortal === 'ALL' || s.portal === selectedPortal;
  });

  const portalOptions: { key: PortalType | 'ALL'; label: string; count: number }[] = [
    { key: 'ALL', label: '전체 포털', count: SCREEN_SPECS.length },
    { key: 'B2C', label: 'B2C 소비자', count: SCREEN_SPECS.filter(s => s.portal === 'B2C').length },
    { key: 'PLANNER', label: '플래너/이모', count: SCREEN_SPECS.filter(s => s.portal === 'PLANNER').length },
    { key: 'OSM', label: '대리점 샵 (OSM)', count: SCREEN_SPECS.filter(s => s.portal === 'OSM').length },
    { key: 'SCM', label: '공급망 (SCM)', count: SCREEN_SPECS.filter(s => s.portal === 'SCM').length },
    { key: 'PMS', label: '본사 운영 (PMS)', count: SCREEN_SPECS.filter(s => s.portal === 'PMS').length },
    { key: 'BIS', label: '기준정보 (BIS)', count: SCREEN_SPECS.filter(s => s.portal === 'BIS').length },
  ];

  // Handle PDF Export
  const handleExportPdf = async () => {
    if (!reportContainerRef.current) return;
    
    setIsExporting(true);
    setExportProgress({ step: 'PDF 문서 생성 준비 중...', percent: 5 });
    setExportSuccessMessage(null);

    try {
      const portalLabel = selectedPortal === 'ALL' ? '전체' : selectedPortal;
      const fileName = `TOBMALL_TO-BE_화면설계서_${portalLabel}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;

      await exportReportToPdf(reportContainerRef.current, {
        fileName,
        includeWireframes,
        onProgress: (step, percent) => {
          setExportProgress({ step, percent });
        }
      });

      setExportSuccessMessage(`PDF 다운로드가 완료되었습니다: ${fileName}`);
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF 파일 생성 중 오류가 발생했습니다. 브라우저 인쇄(Ctrl+P) 기능을 이용해 PDF로 저장하실 수도 있습니다.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Control Toolbar (Hidden during Print) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs print:hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded">
                공식 산출물 (Official Specifications)
              </span>
              <span className="text-xs text-slate-500">외부 검토 및 개발 배포용</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              TOBMALL 플랫폼 TO-BE 웹사이트 화면 구성 설계서 & 와이어프레임
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              화면 기능 명세서와 실제 구현 와이어프레임 목업을 포함하여 고화질 PDF 문서로 다운로드할 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
              title="브라우저 인쇄 대화상자 호출"
            >
              <Printer className="w-4 h-4" />
              <span>브라우저 인쇄</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PDF 생성 중 ({exportProgress?.percent || 0}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>PDF 다운로드 (Download as PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter and Option Controls */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Portal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <span className="font-semibold text-slate-600 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-purple-600" />
              <span>내보내기 범위:</span>
            </span>
            {portalOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedPortal(opt.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                  selectedPortal === opt.key
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>

          {/* Wireframe Visibility Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition">
              <input
                type="checkbox"
                checked={includeWireframes}
                onChange={(e) => setIncludeWireframes(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                {includeWireframes ? (
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>와이어프레임 시각화 목업 포함</span>
              </span>
            </label>

            <span className="text-[11px] text-slate-500 hidden md:inline-block">
              현재 <strong className="text-purple-700">{filteredScreens.length}</strong>개 화면 포함
            </span>
          </div>
        </div>

        {/* Export Progress Notification Bar */}
        {isExporting && exportProgress && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-1.5 animate-pulse">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>{exportProgress.step}</span>
              </span>
              <span>{exportProgress.percent}%</span>
            </div>
            <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-200"
                style={{ width: `${exportProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Alert */}
        {exportSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Printable & Exportable Document Canvas */}
      <div 
        ref={reportContainerRef}
        className="max-w-5xl mx-auto space-y-8 bg-white p-6 sm:p-10 border border-slate-300 rounded-xl shadow-md text-slate-800 print:p-0 print:border-none print:shadow-none"
      >
        {/* ================================================================= */}
        {/* PDF PAGE BLOCK 1: Cover Sheet & Approval Block                    */}
        {/* ================================================================= */}
        <div 
          className="pdf-page-block space-y-6 pb-8 border-b border-slate-200"
          data-pdf-title="표지 및 승인 결재란"
        >
          {/* 1. Cover Page Section (Replicating PDF Page 1) */}
          <div className="py-10 px-6 border-4 border-slate-900 rounded-xl text-center space-y-5 bg-slate-50/60">
            <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">
              SYSTEM ARCHITECTURE & SCREEN SPECIFICATION DOCUMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              TOBMALL 플랫폼 TO-BE<br />
              <span className="text-purple-700 text-xl sm:text-2xl font-bold">
                웹사이트 구성 화면 및 UI/UX 와이어프레임 설계서
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              혁신적인 S2B2C 웨딩 생태계 구축 (공급상 · 운영상 · 판매상 대리점 · 플래너/이모 · 글로벌 소비자 · 건물주 파트너십)
            </p>

            <div className="pt-6 border-t border-slate-300 max-w-md mx-auto text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 text-sm">友霓网络科技（上海）有限公司</div>
              <div>UNINET TECHNOLOGY (SHANGHAI) CO., LTD.</div>
              <div className="font-mono text-slate-500 pt-1">발행일자: 2026. 05. 20 · 설계자: 편민철 실장</div>
            </div>
          </div>

          {/* Executive Sign-off & GAP Legend (PDF Page 9 & 2) */}
          <ApprovalBox />
        </div>

        {/* ================================================================= */}
        {/* PDF PAGE BLOCK 2: Business Innovation & System E2E Architecture   */}
        {/* ================================================================= */}
        <div 
          className="pdf-page-block space-y-6 pb-8 border-b border-slate-200"
          data-pdf-title="비즈니스 모델 및 엔드투엔드 흐름도"
        >
          {/* Business Model Comparison Table */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-2 border-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-600 rounded-sm"></span>
              <span>1. 플랫폼 혁신 모델 (전통 B2C vs 혁신 S2B2C)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="border border-slate-300 p-2.5 w-1/4 text-left">구분</th>
                    <th className="border border-slate-300 p-2.5 w-3/8 bg-slate-200/50 text-left">전통 B2C 웨딩 플랫폼</th>
                    <th className="border border-slate-300 p-2.5 w-3/8 bg-purple-50 text-purple-900 text-left">혁신 S2B2C 플랫폼 (TOBMALL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">재고 운용 방식</td>
                    <td className="border border-slate-300 p-2 text-slate-600">자체 재고 직접 매입/보유 (중자산 운영 부담)</td>
                    <td className="border border-slate-300 p-2 font-semibold text-purple-800">공급상 글로벌 재고 공유 (경자산 무가맹비 모델)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">주요 수익원</td>
                    <td className="border border-slate-300 p-2 text-slate-600">단순 상품 마진 (가격 경쟁 치열)</td>
                    <td className="border border-slate-300 p-2 font-semibold text-purple-800">대여 회전 서비스 수수료 + 다자간 배분 정산</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">판매 조직</td>
                    <td className="border border-slate-300 p-2 text-slate-600">자체 소속 영업 조직 한정</td>
                    <td className="border border-slate-300 p-2 font-semibold text-purple-800">지역별 대리점 샵 + 플래너 위챗/샤오홍슈 바이럴</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">공간 및 인프라</td>
                    <td className="border border-slate-300 p-2 text-slate-600">고정 임대료 직영 매장 (공실/임대료 리스크)</td>
                    <td className="border border-slate-300 p-2 font-semibold text-purple-800">건물주 파트너십 (왕차오 센터 모델: 20% 수익 쉐어)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">파트너 로열티</td>
                    <td className="border border-slate-300 p-2 text-slate-600">단발성 납품/제조 결제 후 단절</td>
                    <td className="border border-slate-300 p-2 font-semibold text-purple-800">디자이너 3% + 생산공방 3% 지속 대여 로열티</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* End-to-End Business Lifecycle (U1 to U16) Flow Summary */}
          <section className="space-y-3 pt-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-2 border-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-600 rounded-sm"></span>
              <span>2. 핵심 비즈니스 프로세스 데이터 연계 흐름 (U1 ~ U16)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
              {PROCESS_STEPS.map((step) => (
                <div key={step.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                      ({step.id})
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{step.actor}</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 line-clamp-1">{step.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">모듈: {step.systemModule}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================================================================= */}
        {/* PDF PAGE BLOCKS 3~N: Screen Specifications & Wireframes           */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2 border-slate-300">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-600 rounded-sm"></span>
              <span>3. 포털별 상세 화면 설계서 및 UI 와이어프레임 (총 {filteredScreens.length}개 화면)</span>
            </h3>
            <span className="text-xs text-purple-700 font-semibold">
              {includeWireframes ? '기술명세 + 와이어프레임 통합' : '기술명세 요약'}
            </span>
          </div>

          <div className="space-y-8">
            {filteredScreens.map((s, index) => (
              <div 
                key={s.id} 
                className="pdf-page-block border border-slate-300 rounded-xl p-4 sm:p-5 bg-slate-50/40 space-y-4 shadow-2xs"
                data-pdf-title={`${s.id} ${s.title}`}
              >
                {/* Screen Specification Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-purple-700 text-white px-2 py-0.5 rounded shadow-2xs">
                      {s.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] flex-wrap">
                    <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      경로: {s.path}
                    </span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {s.portalName} ({s.systemModule})
                    </span>
                    <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                      GAP: {s.gapType}
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 font-medium px-1.5 py-0.5 rounded border border-indigo-200">
                      수행: {s.role}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  <strong className="text-slate-900">화면 개요:</strong> {s.summary}
                </p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      핵심 기능 명세 (Key Features):
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                      {s.keyFeatures.map((kf, i) => (
                        <li key={i} className="leading-snug">{kf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      데이터 연계 및 입출력 (Data I/O):
                    </span>
                    <div className="text-slate-600 space-y-1">
                      <div>
                        <strong className="text-slate-700">연계 프로세스:</strong>{' '}
                        <span className="font-mono text-purple-700 font-semibold">{s.processCodes.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">입력 항목 (Inputs):</strong>{' '}
                        <span>{s.dataItems.inputs.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">출력 항목 (Outputs):</strong>{' '}
                        <span>{s.dataItems.outputs.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UI Components Structure */}
                <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200/80 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-800 mr-1">UI 컴포넌트:</span>
                  {s.uiComponents.map((c, i) => (
                    <span key={i} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                      {c.name} ({c.type})
                    </span>
                  ))}
                </div>

                {/* Visual Wireframe Mockup (Rendered if includeWireframes is checked) */}
                {includeWireframes && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>화면 UI 와이어프레임 시각화 목업 (Wireframe Mockup)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {s.id} · {s.wireframeData?.badge}
                      </span>
                    </div>

                    <WireframeMockup screen={s} isCompact={true} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer info inside printable area */}
        <div className="pt-8 border-t border-slate-300 text-center text-xs text-slate-500 space-y-1">
          <div className="font-bold text-slate-800">TOBMALL 플랫폼 TO-BE 설계서 · 友霓网络科技（上海）有限公司</div>
          <div>본 문서는 TOBMALL 플랫폼 시스템 구축 및 외부 검토를 위한 공식 산출물입니다. (대외비)</div>
        </div>
      </div>
    </div>
  );
};
