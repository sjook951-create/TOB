import React from 'react';
import { ExternalLink, Filter, Layers, Download, Check } from 'lucide-react';
import { ScreenSpec } from '../types';

interface ScreenSpecTableProps {
  screens: ScreenSpec[];
  onSelectScreen: (id: string) => void;
}

export const ScreenSpecTable: React.FC<ScreenSpecTableProps> = ({
  screens,
  onSelectScreen,
}) => {
  const exportToCSV = () => {
    const headers = ['화면ID', '화면명', '포털구분', '모듈', '사용자역할', 'URL경로', '프로세스(U)', 'GAP유형', '핵심기능요약'];
    const rows = screens.map((s) => [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      s.portalName,
      s.systemModule,
      `"${s.role.replace(/"/g, '""')}"`,
      s.path,
      s.processCodes.join('; '),
      s.gapType,
      `"${s.summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TOBMALL_웨딩플랫폼_화면정의서_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            TOBMALL 웨딩 플랫폼 화면 정의서 (Screen Specification Table)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            총 {screens.length}개 대상 화면의 식별자, 경로, 권한, 입출력 및 프로세스 U1~U16 매핑 현황
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-xs self-start sm:self-auto transition"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          <span>CSV 내보내기 (Excel 호환)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 w-28">화면 ID</th>
              <th className="py-3 px-3 w-48">화면명</th>
              <th className="py-3 px-3 w-24">포털/모듈</th>
              <th className="py-3 px-3 w-32">사용자 역할</th>
              <th className="py-3 px-3 w-28 font-mono">프로세스</th>
              <th className="py-3 px-3 w-20 text-center">GAP</th>
              <th className="py-3 px-3 min-w-[240px]">주요 기능 및 입출력 명세</th>
              <th className="py-3 px-3 w-20 text-center">미리보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {screens.map((screen) => (
              <tr key={screen.id} className="hover:bg-purple-50/40 transition">
                <td className="py-3 px-3 font-mono font-bold text-purple-700 whitespace-nowrap">
                  {screen.id}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">{screen.title}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{screen.path}</div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded mr-1">
                    {screen.systemModule}
                  </span>
                  <span className="text-[11px] text-slate-500 block sm:inline mt-0.5 sm:mt-0">
                    {screen.portalName}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700">
                  {screen.role}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                  {screen.processCodes.join(', ')}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    screen.gapType === 'CBO' ? 'bg-purple-100 text-purple-800' :
                    screen.gapType === 'INT' ? 'bg-emerald-100 text-emerald-800' :
                    screen.gapType === 'BPM' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {screen.gapType}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <p className="line-clamp-2 text-slate-700">{screen.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {screen.keyFeatures.slice(0, 2).map((kf, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {kf}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSelectScreen(screen.id)}
                    className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                    title="화면 목업 미리보기"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
