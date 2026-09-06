import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, RefreshCw, Calendar, 
  DollarSign, MapPin, Heart, ShieldCheck, Tag, Info, ArrowRight,
  Sliders, Star, CheckSquare, Layers, Wand2, User, Eye, Copy, Check
} from 'lucide-react';
import { DressItem } from '../../data/liveData';
import { RecommendationItem, RecommendationResponse } from '../../server/aiRecommendService';

interface AiDressRecommendationViewProps {
  dresses: DressItem[];
  selectedBatchDressIds: string[];
  onToggleBatchDress: (dressId: string) => void;
  onSelectAllThreeDresses: (dressIds: string[]) => void;
  onOpenBookingModalWithDresses: (dressIds: string[]) => void;
  onPreviewDress: (dress: DressItem) => void;
}

export const AiDressRecommendationView: React.FC<AiDressRecommendationViewProps> = ({
  dresses,
  selectedBatchDressIds,
  onToggleBatchDress,
  onSelectAllThreeDresses,
  onOpenBookingModalWithDresses,
  onPreviewDress,
}) => {
  // Input form state
  const [age, setAge] = useState<string>('29');
  const [selectedAgePreset, setSelectedAgePreset] = useState<string>('20대 중후반 (25~29세)');
  
  const [style, setStyle] = useState<string>('클래식 & 단아한 우아함');
  const [silhouette, setSilhouette] = useState<string>('ALL');
  const [budget, setBudget] = useState<number>(2500000);
  const [venue, setVenue] = useState<string>('호텔 그랜드볼룸 (어두운 홀, 높은 층고)');
  const [bodyType, setBodyType] = useState<string>('팔뚝 라인 커버 (오프숄더/볼레로 선호)');
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    '호텔 조명 아래서 은은하게 반짝이는 비즈감이 있으면 좋겠고, 2부 피로연용으로 세련된 유색 드레스나 퓨전 가운도 한 벌 비교해보고 싶습니다.'
  );

  // Recommendation status & results
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Pre-configured style options
  const styleOptions = [
    { 
      id: 'classic', 
      label: '클래식 & 단아한 우아함', 
      desc: '로열 미카도 실크, 깔끔한 선, 세월이 흘러도 변치 않는 품격',
      badge: '시그니처'
    },
    { 
      id: 'glam', 
      label: '화려한 크리스털 비딩 & 럭셔리', 
      desc: '조명 아래 은하수처럼 반짝이는 비즈와 화려한 스파클',
      badge: '호텔 예식 인기'
    },
    { 
      id: 'romantic', 
      label: '로맨틱 & 페미닌 튤 레이스', 
      desc: '입체 플라워 자수, 부드러운 오간자와 몽환적인 튤 볼륨',
      badge: '가든·채플 선호'
    },
    { 
      id: 'modern', 
      label: '모던 & 시크 미니멀리즘', 
      desc: '감각적인 드레이핑 실크, 슬릿 디테일, 세련된 하이패션',
      badge: '트렌드'
    },
    { 
      id: 'fusion', 
      label: '전통 퓨전 & 황실 수화복', 
      desc: '진홍빛 실크와 순금사 자수의 기품, 2부 세러머니 독보적 화려함',
      badge: '2부 피로연 특화'
    },
    { 
      id: 'colorful', 
      label: '비비드 컬러풀 & 이브닝 가운', 
      desc: '바이올렛, 사파이어 블루, 푸시아 로즈, 선셋 코랄의 환상적인 색채',
      badge: '2026 신작'
    }
  ];

  const agePresets = [
    { label: '20대 초반 (20~24세)', defaultVal: '23' },
    { label: '20대 중후반 (25~29세)', defaultVal: '28' },
    { label: '30대 초반 (30~34세)', defaultVal: '32' },
    { label: '30대 중후반 (35~39세)', defaultVal: '37' },
    { label: '40대 이상 (40세~)', defaultVal: '42' },
  ];

  const silhouetteOptions = [
    { key: 'ALL', label: 'AI 최적 실루엣 추천' },
    { key: 'A-Line', label: 'A라인 (자연스러운 체형 보완)' },
    { key: 'Ball Gown', label: '벨라인 (웅장한 호텔 볼륨)' },
    { key: 'Mermaid', label: '머메이드 (슬림 바디라인 강조)' },
    { key: 'Empire', label: '엠파이어 (클래식 하이웨이스트)' },
    { key: 'Traditional Fusion', label: '오리엔탈 퓨전 & 수화복' },
  ];

  const venueOptions = [
    '호텔 그랜드볼룸 (어두운 홀, 높은 층고)',
    '컨벤션 웨딩홀 (대형 버진로드, 핀 조명)',
    '야외 가든 & 테라스 웨딩 (자연광, 싱그러움)',
    '성당 & 채플홀 (경건함, 롱 트레인 강조)',
    '하우스 & 스몰웨딩 (활동성, 내추럴 무드)',
    '2부 애프터 파티 & 나이트 리셉션'
  ];

  const bodyTypeOptions = [
    '팔뚝 라인 커버 (오프숄더/볼레로 선호)',
    '키가 커 보이는 하이웨이스트 & 롱라인',
    '쇄골 & 목선 넥라인 강조 (하트톱/브이넥)',
    '골반 & 힙 볼륨 바디라인 부각',
    '가볍고 활동성이 우수한 편안한 피팅감',
    '체형 고민 없음 (모든 실루엣 피팅 가능)'
  ];

  const quickPromptTags = [
    '어두운 호텔 홀 비즈 볼가운',
    '야외 가든 청순 A라인 레이스',
    '호텔 본식 + 2부 화사한 유색 드레스',
    '단아하고 절제된 미카도 실크',
    '궁중 황실 금사 전통 수화복',
    '슬림 머메이드 & 케이프 연출'
  ];

  const handleApplyPromptTag = (tag: string) => {
    setAdditionalNotes(prev => prev ? `${prev} / ${tag}` : tag);
  };

  // Execute AI Recommendation
  const handleRequestRecommendation = async () => {
    setIsLoading(true);
    setResult(null);

    const steps = [
      '신부님의 연령대와 선호 취향 분석 중...',
      '웨딩홀 환경 및 대여 예산 최적 밸런스 산출 중...',
      '46벌의 프리미엄 드레스 데이터베이스 매칭 중...',
      'Gemini AI 수석 디렉터 스타일링 리포트 생성 중...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 800);

    try {
      const payload = {
        preferences: {
          age: `${age}세 (${selectedAgePreset.split(' ')[0]})`,
          style,
          silhouette,
          budget,
          venue,
          bodyType,
          additionalNotes,
        },
        candidateDresses: dresses.map(d => ({
          id: d.id,
          name: d.name,
          designer: d.designer,
          category: d.category,
          rentalPrice: d.rentalPrice,
          deposit: d.deposit,
          silhouette: d.silhouette,
          fabric: d.fabric,
          tag: d.tag,
          description: d.description,
          rating: d.rating,
        }))
      };

      const response = await fetch('/api/gemini/recommend-dresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setResult(json.data);
          // Auto-select these 3 dresses for convenience
          const recIds = json.data.recommendations.map((r: RecommendationItem) => r.dressId);
          onSelectAllThreeDresses(recIds);
        } else {
          throw new Error(json.error || '추천 데이터 처리 실패');
        }
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (err: any) {
      console.warn('AI recommendation API failed, applying local fallback:', err);
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = `[TOBMALL AI 웨딩 드레스 맞춤 추천서]\n` +
      `컨셉: ${result.styleConcept}\n` +
      `컨설턴트 코멘트: ${result.consultantNote}\n` +
      `예산: ${result.budgetAnalysis.budget.toLocaleString()}원 (추천 드레스 합계: ${result.budgetAnalysis.totalPrice.toLocaleString()}원)\n\n` +
      result.recommendations.map((rec, idx) => {
        const d = dresses.find(item => item.id === rec.dressId);
        return `${idx + 1}. [${rec.role}] ${d ? d.name : rec.dressId}\n` +
               `- 매칭율: ${rec.matchScore}%\n` +
               `- 대여가: ${d ? d.rentalPrice.toLocaleString() : '-'}원\n` +
               `- 추천이유: ${rec.recommendationReason}\n` +
               `- 스타일링 팁: ${rec.stylingTip}\n`;
      }).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Get dress item by ID
  const getDress = (id: string): DressItem | undefined => {
    return dresses.find(d => d.id === id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Gemini 3.8 Flash AI 웨딩 스타일리스트</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            내 취향 · 나이 · 총 예산 맞춤 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200">
              최고의 웨딩 드레스 3벌 AI 큐레이션
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            고객님의 나이대, 선호 스타일, 예식 장소, 대여 예산 및 신체 특징을 다각도로 분석하여,
            <strong> 1부 본식 메인 가운</strong>, <strong>실루엣 비교 가운</strong>, <strong>2부 피로연 이브닝 가운</strong>까지
            완벽하게 어우러지는 3벌을 즉시 1:1 추천해 드립니다.
          </p>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">신부님 웨딩 스타일링 프로필 입력</h3>
              <p className="text-xs text-slate-500">정확한 정보를 입력할수록 더욱 완벽하고 개인화된 3벌의 드레스가 추천됩니다.</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            총 46벌 실시간 데이터 연동
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. 신부 나이 (Age) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>신부 나이 (연령대)</span>
              </span>
              <span className="text-purple-700 font-extrabold text-sm">{age}세</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {agePresets.map((preset) => {
                const isSelected = selectedAgePreset === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSelectedAgePreset(preset.label);
                      setAge(preset.defaultVal);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition border ${
                      isSelected
                        ? 'bg-purple-50 text-purple-900 border-purple-400 ring-1 ring-purple-400 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="20"
                max="50"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">만 {age}세</span>
            </div>
          </div>

          {/* 2. 총 대여 예산 (Budget) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                <span>총 드레스 대여 예산 (3벌 피팅/본식)</span>
              </span>
              <span className="text-purple-700 font-extrabold text-sm">{budget.toLocaleString()} 원</span>
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '180만원', val: 1800000 },
                { label: '220만원', val: 2200000 },
                { label: '250만원 (추천)', val: 2500000 },
                { label: '300만원', val: 3000000 },
                { label: '350만원', val: 3500000 },
                { label: '400만원 (하이엔드)', val: 4000000 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setBudget(item.val)}
                  className={`px-2 py-2 rounded-xl text-xs font-medium text-center transition border ${
                    budget === item.val
                      ? 'bg-purple-50 text-purple-900 border-purple-400 ring-1 ring-purple-400 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="1500000"
                max="5000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">{(budget / 10000).toFixed(0)}만원</span>
            </div>
          </div>
        </div>

        {/* 3. 내 취향 & 드레스 스타일 (Style Preference) */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>선호 취향 & 디자인 무드 (택 1)</span>
            </span>
            <span className="text-xs text-slate-500">가장 매력적으로 느껴지는 스타일을 선택하세요</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {styleOptions.map((opt) => {
              const isSelected = style === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStyle(opt.label)}
                  className={`p-3.5 rounded-xl text-left transition border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white font-semibold text-slate-600 shrink-0 border border-slate-200">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 선호 실루엣 & 예식 장소 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 선호 실루엣 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>선호 드레스 실루엣</span>
            </label>
            <select
              value={silhouette}
              onChange={(e) => setSilhouette(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            >
              {silhouetteOptions.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* 예식 장소 & 웨딩홀 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>예식 장소 & 웨딩홀 환경</span>
            </label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            >
              {venueOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. 체형 보완 & 추가 요청 사항 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>체형 보완 희망 포인트</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {bodyTypeOptions.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBodyType(b)}
                  className={`p-2.5 text-left rounded-xl text-xs transition border ${
                    bodyType === b
                      ? 'bg-purple-50 text-purple-900 border-purple-400 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                <span>추가 희망 사항 (AI에게 전할 메모)</span>
              </label>
              <span className="text-[11px] text-slate-400">자유롭게 입력 가능</span>
            </div>

            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="예: 어두운 홀 조명에서 빛나는 화려한 비즈 볼가운 1벌과 2부 피로연용 유색 드레스 1벌을 함께 추천받고 싶습니다."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
            />

            {/* Quick prompt tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">추천 키워드:</span>
              {quickPromptTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleApplyPromptTag(tag)}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 rounded-lg transition border border-slate-200/80"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>AI 분석은 46벌의 고해상도 아틀리에 드레스 데이터베이스를 실시간으로 탐색합니다.</span>
          </div>

          <button
            type="button"
            onClick={handleRequestRecommendation}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                <span>{loadingStep || 'AI 드레스 3벌 분석 중...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>✨ AI 맞춤 3벌 드레스 추천받기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-purple-200 p-10 text-center shadow-sm space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-spin text-purple-600" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{loadingStep}</h4>
            <p className="text-xs text-slate-500 mt-1">
              신부님의 연령({age}세), 선호 스타일({style}), 예산({budget.toLocaleString()}원)을 토대로 청담동 수석 디렉터의 관점에서 3벌을 큐레이션하고 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            <div className="h-32 bg-slate-100 rounded-xl"></div>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* AI Recommendation Results Section */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Header of Results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                2
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">AI 맞춤 큐레이션 결과 (3벌)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    분석 완료
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  본식 1부 메인, 실루엣 비교, 2부 피로연까지 완벽하게 조합된 3벌의 드레스입니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료' : '추천서 복사'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const recIds = result.recommendations.map(r => r.dressId);
                  onOpenBookingModalWithDresses(recIds);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>이 3벌로 즉시 피팅 예약</span>
              </button>
            </div>
          </div>

          {/* Stylist Director Note Card */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-white rounded-2xl border border-purple-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  AI Bridal Stylist Concept
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  ✨ {result.styleConcept}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">추천 소스:</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-2xs">
                  {result.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'TOBMALL 정밀 큐레이터'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {result.consultantNote}
            </p>

            {/* Budget Summary Bar */}
            <div className="bg-white rounded-xl border border-purple-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">고객 설정 대여 예산</span>
                <span className="font-extrabold text-slate-800 text-sm">{result.budgetAnalysis.budget.toLocaleString()} 원</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">추천 3벌 합산 대여 금액</span>
                <span className="font-extrabold text-purple-700 text-sm">{result.budgetAnalysis.totalPrice.toLocaleString()} 원</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">예산 분석 & VIP 혜택</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{result.budgetAnalysis.budgetStatus}</span>
                </span>
              </div>
            </div>

            <div className="text-[11px] text-purple-800 bg-purple-100/70 px-3 py-2 rounded-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{result.budgetAnalysis.savingAdvice}</span>
            </div>
          </div>

          {/* 3 Recommended Dresses Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.recommendations.map((rec, idx) => {
              const dress = getDress(rec.dressId);
              if (!dress) return null;
              const isSelectedForBatch = selectedBatchDressIds.includes(dress.id);

              return (
                <div 
                  key={dress.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isSelectedForBatch ? 'border-purple-500 ring-2 ring-purple-400' : 'border-slate-200'
                  }`}
                >
                  {/* Card Header Badge */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                        idx === 0 ? 'bg-purple-600' : idx === 1 ? 'bg-indigo-600' : 'bg-rose-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {rec.role}
                      </span>
                    </div>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      매칭 {rec.matchScore}%
                    </span>
                  </div>

                  {/* Image Showcase */}
                  <div className="relative group aspect-[3/4] overflow-hidden bg-slate-950">
                    <img 
                      src={dress.imageUrl} 
                      alt={dress.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button
                        type="button"
                        onClick={() => onPreviewDress(dress)}
                        className="w-full py-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>고해상도 룩북 상세보기</span>
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs">
                      {dress.silhouette}
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => onToggleBatchDress(dress.id)}
                        className={`p-2 rounded-xl backdrop-blur-xs transition shadow-md ${
                          isSelectedForBatch
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/80 hover:bg-white text-slate-700'
                        }`}
                        title="피팅 예약 목록에 담기"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-purple-700 font-semibold truncate">
                        {dress.designer}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                        {dress.name}
                      </h5>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">대여료</span>
                        <span className="font-extrabold text-purple-700 text-sm">
                          {dress.rentalPrice.toLocaleString()} 원
                        </span>
                      </div>

                      {/* AI Reason Callout */}
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-left">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>AI 맞춤 추천 사유</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {rec.recommendationReason}
                        </p>
                      </div>

                      {/* Styling Tip */}
                      <div className="mt-2 text-[11px] text-purple-900 bg-purple-50/80 p-2.5 rounded-lg border border-purple-100">
                        <span className="font-bold block text-purple-800 mb-0.5">💡 디렉터 스타일링 팁:</span>
                        <span>{rec.stylingTip}</span>
                      </div>
                    </div>

                    {/* Button actions */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewDress(dress)}
                        className="py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
                      >
                        상세보기
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleBatchDress(dress.id)}
                        className={`py-2.5 text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1 ${
                          isSelectedForBatch
                            ? 'bg-purple-700 text-white'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {isSelectedForBatch ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>선택완료</span>
                          </>
                        ) : (
                          <span>피팅 담기</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Consolidated Action Sticky Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-slate-900">
                  추천받은 3벌의 드레스를 한 번에 피팅 예약하시겠습니까?
                </h5>
                <p className="text-xs text-slate-500">
                  항저우·상하이·베이징·서울 오프라인 프라이빗 VIP 피팅룸에서 1:1 전담 스타일리스트와 함께 피팅할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                조건 재설정
              </button>

              <button
                type="button"
                onClick={() => {
                  const recIds = result.recommendations.map(r => r.dressId);
                  onOpenBookingModalWithDresses(recIds);
                }}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>3벌 동시 O2O 피팅룸 예약하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
