import React from 'react';
import { PenTool, CheckCircle, Info } from 'lucide-react';

export const ApprovalBox: React.FC = () => {
  return (
    <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs mb-6 text-slate-800">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
              TOBMALL 플랫폼 TO-BE 설계 승인서
            </span>
            <span className="text-xs text-slate-500">순번: 0-1 / 단계: B. 분석/설계</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            웹사이트 구성 화면 분석 및 설계 검토 결재란
          </h2>
          <p className="text-xs text-slate-500">
            문서 설계자: 편민철 (友霓网络科技) · 작성일자: 2026. 05. 20
          </p>
        </div>

        {/* Approval Sign Table (Directly matching PDF Page 9) */}
        <div className="w-full lg:w-auto overflow-x-auto">
          <table className="border-collapse border border-slate-400 text-xs text-center bg-slate-50 min-w-[340px]">
            <thead>
              <tr className="bg-slate-200 text-slate-700 font-semibold">
                <th className="border border-slate-300 px-3 py-1.5 w-16">직 함</th>
                <th className="border border-slate-300 px-3 py-1.5 w-20">성 함</th>
                <th className="border border-slate-300 px-3 py-1.5 w-24">서 명</th>
                <th className="border border-slate-300 px-3 py-1.5 w-24">날 자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 py-2 font-medium bg-slate-100">대 표</td>
                <td className="border border-slate-300 py-2 text-slate-600">이진우</td>
                <td className="border border-slate-300 py-2 text-emerald-600 font-medium italic flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>(서명완료)</span>
                </td>
                <td className="border border-slate-300 py-2 text-slate-500 text-[11px]">2026.05.22</td>
              </tr>
              <tr>
                <td className="border border-slate-300 py-2 font-medium bg-slate-100">본 부 장</td>
                <td className="border border-slate-300 py-2 text-slate-600">박원석</td>
                <td className="border border-slate-300 py-2 text-emerald-600 font-medium italic flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>(서명완료)</span>
                </td>
                <td className="border border-slate-300 py-2 text-slate-500 text-[11px]">2026.05.21</td>
              </tr>
              <tr>
                <td className="border border-slate-300 py-2 font-medium bg-slate-100">실 장</td>
                <td className="border border-slate-300 py-2 text-slate-600">편민철</td>
                <td className="border border-slate-300 py-2 text-emerald-600 font-medium italic flex items-center justify-center gap-1">
                  <PenTool className="w-3.5 h-3.5 text-emerald-500" />
                  <span>(설계/인)</span>
                </td>
                <td className="border border-slate-300 py-2 text-slate-500 text-[11px]">2026.05.20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* GAP Analysis & Legend (Page 2 of document) */}
      <div className="mt-4 pt-3 text-xs flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-1 font-semibold text-slate-800">
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>GAP 계획 유형 정의:</span>
        </div>
        <div><span className="font-semibold text-purple-700">CBO:</span> Custom Bolt-On (화면/기능 추가 개발)</div>
        <div><span className="font-semibold text-blue-700">BPM:</span> Base Package Modification (패키지 코드 수정)</div>
        <div><span className="font-semibold text-emerald-700">INT:</span> Interface (외부 위챗/샤오홍슈/결제 연동)</div>
        <div><span className="font-semibold text-amber-700">NVR:</span> 새로운 버전 해결</div>
        <div><span className="font-semibold text-slate-700">PRO:</span> Process 수정 오프라인 해결</div>
      </div>
    </div>
  );
};
