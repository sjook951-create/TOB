import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { ScreenSpec } from '../types';

interface WireframeMockupProps {
  screen: ScreenSpec;
  isCompact?: boolean;
}

export const WireframeMockup: React.FC<WireframeMockupProps> = ({
  screen,
  isCompact = false,
}) => {
  const { wireframeData } = screen;
  if (!wireframeData) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-2xs overflow-hidden text-slate-800">
      {/* Mockup Top Browser Bar */}
      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          <span className="ml-2 font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[260px] sm:max-w-none">
            https://tobmall.com{screen.path}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
          {wireframeData.badge || screen.portalName}
        </span>
      </div>

      {/* Mockup Canvas Body */}
      <div className="p-3 sm:p-4 bg-slate-50/50 space-y-3">
        {/* Header & Stats Bar */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-purple-600 rounded-full inline-block"></span>
              <h5 className="text-xs font-bold text-slate-900">
                {wireframeData.sectionTitle}
              </h5>
            </div>
            <span className="text-[10px] font-medium text-slate-500">
              수행 역할: {screen.role}
            </span>
          </div>

          {wireframeData.stats && wireframeData.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
              {wireframeData.stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium truncate">{stat.label}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{stat.value}</div>
                  {stat.sub && (
                    <div className="text-[9px] text-purple-600 font-medium truncate">{stat.sub}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Sections */}
        {wireframeData.sections?.map((section, sIdx) => (
          <div key={sIdx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
              <span>{section.title}</span>
              {section.description && (
                <span className="text-[10px] text-slate-500 font-normal truncate max-w-xs">{section.description}</span>
              )}
            </div>

            {/* Type 1: Hero */}
            {section.type === 'hero' && (
              <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-3 rounded-md space-y-1.5">
                <div className="text-[10px] font-semibold text-purple-200 uppercase tracking-wider">
                  TOBMALL S2B2C ECOSYSTEM
                </div>
                <div className="text-xs font-bold leading-snug">
                  {section.title}
                </div>
                {section.description && (
                  <p className="text-[11px] text-purple-100 leading-relaxed">
                    {section.description}
                  </p>
                )}
                {section.items && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {section.items.map((item: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Type 2: Grid */}
            {section.type === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {section.items.map((item: any, i: number) => (
                  <div key={i} className="p-2.5 rounded border border-slate-200 bg-slate-50/70 flex flex-col justify-between text-[11px]">
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {item.name || item.dress || item.room}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5 line-clamp-1">
                        {item.category || item.designer || item.time || item.views}
                      </div>
                      {item.score && (
                        <div className="text-amber-600 font-semibold text-[10px] mt-0.5">{item.score}</div>
                      )}
                      {item.memo && (
                        <div className="text-slate-600 text-[10px] mt-0.5 bg-white p-1 rounded border border-slate-200 line-clamp-1">
                          {item.memo}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-purple-700">
                        {item.price || item.rating || item.status || item.cta}
                      </span>
                      <span className="text-purple-600 font-medium flex items-center">
                        <span>확인</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Type 3: Table */}
            {section.type === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      {Object.keys(section.items[0] || {}).map((colKey) => (
                        <th key={colKey} className="py-1.5 px-2 capitalize">
                          {colKey}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {section.items.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        {Object.values(row).map((val: any, cIdx: number) => (
                          <td key={cIdx} className="py-1.5 px-2 text-slate-700 whitespace-nowrap">
                            {typeof val === 'string' && val.includes('완료') ? (
                              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                                {val}
                              </span>
                            ) : typeof val === 'string' && val.includes('대기') ? (
                              <span className="text-amber-700 font-semibold bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
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
              <div className="space-y-1.5">
                {section.items.map((field: any, fIdx: number) => (
                  <div key={fIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px]">
                    <span className="font-semibold text-slate-700 sm:w-1/3 truncate">{field.label}</span>
                    <span className="text-slate-900 font-medium sm:w-2/3 bg-white px-2 py-0.5 rounded border border-slate-200/80 truncate">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Type 5: Steps */}
            {section.type === 'steps' && (
              <div className="flex flex-col gap-1.5">
                {section.items.map((st: any, sIdx: number) => (
                  <div key={sIdx} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px]">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">
                      {sIdx + 1}
                    </span>
                    <div className="flex-1 font-semibold text-slate-900 truncate">{st.step}</div>
                    <div className="text-slate-500 font-mono text-[9px]">{st.date}</div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
                {section.items.map((d: any, dIdx: number) => (
                  <div key={dIdx} className="p-1.5 bg-slate-50 rounded border border-slate-200">
                    <div className="font-semibold text-slate-500 text-[9px] truncate">{d.label}</div>
                    <div className="font-medium text-slate-900 mt-0.5 truncate">{d.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
