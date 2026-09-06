import { GoogleGenAI, Type } from "@google/genai";

export interface UserPreferences {
  age: string;
  style: string;
  silhouette?: string;
  budget: number;
  venue: string;
  bodyType?: string;
  additionalNotes?: string;
}

export interface CandidateDressSummary {
  id: string;
  name: string;
  designer: string;
  category: string;
  rentalPrice: number;
  deposit: number;
  silhouette: string;
  fabric: string;
  tag: string;
  description: string;
  rating?: number;
}

export interface RecommendationItem {
  dressId: string;
  role: string;
  matchScore: number;
  recommendationReason: string;
  stylingTip: string;
}

export interface RecommendationResponse {
  styleConcept: string;
  consultantNote: string;
  budgetAnalysis: {
    budgetStatus: string;
    savingAdvice: string;
    totalPrice: number;
    budget: number;
  };
  recommendations: RecommendationItem[];
  source: 'gemini-3.8-flash' | 'expert-curator';
}

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

/**
 * Intelligent fallback curation when Gemini API key is missing or call fails
 */
export function generateCuratedRecommendations(
  prefs: UserPreferences,
  dresses: CandidateDressSummary[]
): RecommendationResponse {
  if (!dresses || dresses.length === 0) {
    throw new Error("추천할 드레스 목록이 없습니다.");
  }

  const budget = prefs.budget || 2500000;
  const ageStr = prefs.age || '30대 초반';
  const styleStr = prefs.style || '클래식 & 단아함';
  const venueStr = prefs.venue || '호텔 그랜드볼룸';
  const silhouetteStr = prefs.silhouette || 'ALL';

  // Calculate score for each dress
  const scored = dresses.map(d => {
    let score = 70;

    // Silhouette match
    if (silhouetteStr !== 'ALL' && silhouetteStr !== '전체 추천') {
      if (d.category.toLowerCase().includes(silhouetteStr.toLowerCase()) || 
          d.silhouette.toLowerCase().includes(silhouetteStr.toLowerCase())) {
        score += 15;
      }
    }

    // Style match keywords
    const keywords = [
      styleStr,
      prefs.additionalNotes || '',
      prefs.bodyType || '',
      venueStr
    ].join(' ').toLowerCase();

    const textToMatch = (d.name + ' ' + d.tag + ' ' + d.fabric + ' ' + d.description).toLowerCase();

    if (keywords.includes('클래식') && (textToMatch.includes('클래식') || textToMatch.includes('미카도') || textToMatch.includes('단아'))) score += 12;
    if (keywords.includes('비딩') && (textToMatch.includes('비딩') || textToMatch.includes('크리스털') || textToMatch.includes('스파클') || textToMatch.includes('글리터'))) score += 12;
    if (keywords.includes('로맨틱') && (textToMatch.includes('레이스') || textToMatch.includes('튤') || textToMatch.includes('플라워') || textToMatch.includes('로맨틱'))) score += 12;
    if (keywords.includes('모던') && (textToMatch.includes('슬림') || textToMatch.includes('크레이프') || textToMatch.includes('시크') || textToMatch.includes('미니멀'))) score += 12;
    if (keywords.includes('오리엔탈') || keywords.includes('전통') || keywords.includes('수화복')) {
      if (d.category === 'Traditional Fusion' || textToMatch.includes('금사') || textToMatch.includes('수화복')) score += 20;
    }
    if (keywords.includes('유색') || keywords.includes('컬러') || keywords.includes('2부') || keywords.includes('피로연')) {
      if (textToMatch.includes('바이올렛') || textToMatch.includes('크림슨') || textToMatch.includes('푸시아') || textToMatch.includes('사파이어') || textToMatch.includes('코랄') || textToMatch.includes('피로연')) score += 18;
    }

    // Budget affinity
    const priceRatio = d.rentalPrice / budget;
    if (priceRatio <= 1.05 && priceRatio >= 0.6) {
      score += 10;
    } else if (priceRatio > 1.2) {
      score -= 8;
    }

    // Rating boost
    if (d.rating && d.rating >= 4.9) {
      score += 5;
    }

    return { dress: d, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Pick 3 diverse dresses (1 main ceremony, 1 comparative, 1 reception/statement)
  const selected: CandidateDressSummary[] = [];
  const selectedCategories = new Set<string>();

  for (const item of scored) {
    if (selected.length === 0) {
      selected.push(item.dress);
      selectedCategories.add(item.dress.category);
    } else if (selected.length === 1) {
      // Prefer different silhouette or complementary style for direct comparison
      selected.push(item.dress);
      selectedCategories.add(item.dress.category);
    } else if (selected.length === 2) {
      // 3rd dress: prefer a distinctive 2부/after reception or colorful / fusion piece if available, or top distinct category
      selected.push(item.dress);
      break;
    }
  }

  // Fallback if less than 3
  for (const item of scored) {
    if (selected.length >= 3) break;
    if (!selected.some(s => s.id === item.dress.id)) {
      selected.push(item.dress);
    }
  }

  const totalPrice = selected.reduce((sum, d) => sum + d.rentalPrice, 0);

  const styleConcept = `${ageStr} 신부님을 위한 '${styleStr}' & ${venueStr} 맞춤 큐레이션`;
  const consultantNote = `신부님(${ageStr})의 선호 스타일인 '${styleStr}'과 예식장('${venueStr}')의 공간감을 종합 고려하여, 본식 1부에서 독보적인 기품을 완성하는 메인 가운부터 피팅 비교 및 2부 리셉션까지 아우르는 최적의 드레스 3벌을 엄선했습니다. 총 대여 예산(${budget.toLocaleString()}원) 대비 합리적인 금액대로 구성되었습니다.`;

  const roles = [
    '1순위: 1부 본식 메인 셀렉션',
    '2순위: 실루엣 비교 피팅 셀렉션',
    '3순위: 2부 피로연 & 이브닝 추천'
  ];

  const stylingTips = [
    `${venueStr}의 높은 버진로드에 맞춰 3m 롱 트레인 베일과 은은한 진주 티아라 매치 추천`,
    `슬림한 네크라인을 강조하는 드롭형 크리스털 이어링과 내추럴 로우번 헤어 스타일링 추천`,
    `2부 하객 인사 및 애프터 파티에서 빛나는 화사한 부케와 포인트 링 매치 추천`
  ];

  const recommendations: RecommendationItem[] = selected.slice(0, 3).map((dress, idx) => ({
    dressId: dress.id,
    role: roles[idx] || `추천 ${idx + 1}`,
    matchScore: Math.min(99, Math.max(89, Math.round(scored.find(s => s.dress.id === dress.id)?.score || 92) + (3 - idx) * 2)),
    recommendationReason: `[${dress.silhouette}] 실루엣과 고급스러운 [${dress.fabric.split(',')[0] || dress.fabric}] 패브릭이 신부님의 우아함을 극대화하며, ${venueStr}의 조명 아래서 자연스러운 광택감과 체형 보완을 동시에 실현합니다.`,
    stylingTip: stylingTips[idx] || '단아한 로우번 헤어와 미니멀 주얼리 매치 권장'
  }));

  return {
    styleConcept,
    consultantNote,
    budgetAnalysis: {
      budgetStatus: totalPrice <= budget * 1.1 ? '예산 내 완벽 매칭 (안심 견적)' : '프리미엄 하이엔드 업그레이드 제안',
      savingAdvice: `3벌 동시 피팅 예약 후 본식 계약 시 TOBMALL VIP 멤버십 10% 추가 우대 및 헬퍼 케어 지원`,
      totalPrice,
      budget
    },
    recommendations,
    source: 'expert-curator'
  };
}

/**
 * Call Gemini 3.8 Flash via @google/genai SDK on the server side
 */
export async function recommendDressesWithGemini(
  prefs: UserPreferences,
  candidateDresses: CandidateDressSummary[]
): Promise<RecommendationResponse> {
  const ai = getGenAI();
  if (!ai) {
    console.log("[AI Recommend] GEMINI_API_KEY is not set; using smart expert curator engine.");
    return generateCuratedRecommendations(prefs, candidateDresses);
  }

  const promptDresses = candidateDresses.slice(0, 46).map(d => ({
    id: d.id,
    name: d.name,
    designer: d.designer,
    category: d.category,
    rentalPrice: d.rentalPrice,
    silhouette: d.silhouette,
    fabric: d.fabric,
    tag: d.tag,
    description: d.description
  }));

  const systemInstruction = `당신은 대한민국 청담동 및 글로벌 하이엔드 웨딩 아틀리에의 20년 경력 수석 웨딩 디렉터이자 AI 스타일링 전문가입니다.
고객이 전달한 '신부 나이', '선호 취향/스타일', '선호 실루엣', '총 대여 예산', '예식 장소(웨딩홀)', '신체 보완점', '추가 희망사항'을 면밀히 분석하세요.
주어진 후보 드레스 데이터베이스 중에서 고객에게 가장 완벽한 3벌의 드레스를 선택하고, 각 드레스의 구체적인 추천 사유와 스타일링 팁을 JSON 형식으로 작성하세요.

선정 기준:
1. 1순위: 1부 본식 메인 가운 (예식 장소와 취향을 100% 만족하는 최상의 드레스)
2. 2순위: 실루엣 또는 넥라인 비교 피팅용 드레스 (신부님이 고민할 수 있는 대안적 매력)
3. 3순위: 2부 피로연 / 애프터 파티 / 유색 또는 오리엔탈 퓨전 가운 (2부 세러머니의 화사함)
4. 반드시 주어진 드레스의 실제 'id'(예: DR-001)만을 dressId로 반환하세요.
5. 한국어로 매우 세련되고 다정하며 전문적인 컨설턴트 톤앤매너로 작성하세요.`;

  const userPrompt = `[고객 프로필 & 웨딩 정보]
- 신부 나이: ${prefs.age || '미지정'}
- 선호 취향 & 스타일: ${prefs.style || '미지정'}
- 선호 실루엣: ${prefs.silhouette || '전체'}
- 총 대여 예산: ${prefs.budget ? prefs.budget.toLocaleString() + '원' : '예산 무관'}
- 예식 장소: ${prefs.venue || '호텔 그랜드볼룸'}
- 신체 특징/보완점: ${prefs.bodyType || '균형 잡힌 체형'}
- 추가 요청 사항: ${prefs.additionalNotes || '없음'}

[선택 가능한 드레스 후보 목록 (총 ${promptDresses.length}벌)]
${JSON.stringify(promptDresses, null, 1)}

위 후보 목록에서 신부님께 가장 완벽한 3벌을 엄선하여 JSON 응답 스키마에 맞게 분석 리포트를 생성해 주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleConcept: {
              type: Type.STRING,
              description: "신부님을 위한 맞춤 스타일링 컨셉 명칭"
            },
            consultantNote: {
              type: Type.STRING,
              description: "신부님의 나이, 취향, 체형, 예산, 예식홀을 반영한 수석 디렉터의 종합 컨설팅 코멘트"
            },
            budgetStatus: {
              type: Type.STRING,
              description: "예산 분석 코멘트 (예: 예산 내 완벽 매칭, 하이엔드 가치 제안 등)"
            },
            savingAdvice: {
              type: Type.STRING,
              description: "예산 절감 및 패키지 팁"
            },
            recommendations: {
              type: Type.ARRAY,
              description: "엄선된 3벌의 드레스 목록",
              items: {
                type: Type.OBJECT,
                properties: {
                  dressId: {
                    type: Type.STRING,
                    description: "후보 목록 중 드레스의 고유 ID (예: DR-001)"
                  },
                  role: {
                    type: Type.STRING,
                    description: "추천 역할 (예: 1부 본식 메인 가운, 2순위 비교 피팅, 3순위 2부 피로연 이브닝)"
                  },
                  matchScore: {
                    type: Type.INTEGER,
                    description: "추천 매칭율 (85~99 사이의 정수)"
                  },
                  recommendationReason: {
                    type: Type.STRING,
                    description: "신부님의 체형, 나이, 웨딩홀 및 취향에 기반한 구체적인 추천 이유"
                  },
                  stylingTip: {
                    type: Type.STRING,
                    description: "어울리는 베일, 티아라, 주얼리, 부케 및 헤어스타일 제안"
                  }
                },
                required: ["dressId", "role", "matchScore", "recommendationReason", "stylingTip"]
              }
            }
          },
          required: ["styleConcept", "consultantNote", "budgetStatus", "savingAdvice", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned empty text response");
    }

    const parsed = JSON.parse(text);

    // Validate dress IDs exist in candidateDresses
    const validDresses = (parsed.recommendations || []).filter((r: any) =>
      candidateDresses.some(d => d.id === r.dressId)
    );

    if (validDresses.length < 3) {
      // Supplement with curated if less than 3 valid
      const curated = generateCuratedRecommendations(prefs, candidateDresses);
      for (const cur of curated.recommendations) {
        if (validDresses.length >= 3) break;
        if (!validDresses.some((v: any) => v.dressId === cur.dressId)) {
          validDresses.push(cur);
        }
      }
    }

    const totalPrice = validDresses.slice(0, 3).reduce((sum: number, rec: any) => {
      const dress = candidateDresses.find(d => d.id === rec.dressId);
      return sum + (dress ? dress.rentalPrice : 0);
    }, 0);

    return {
      styleConcept: parsed.styleConcept || `${prefs.style} 맞춤 웨딩 스타일링`,
      consultantNote: parsed.consultantNote || "신부님의 매력을 돋보이게 할 수석 디렉터의 셀렉션입니다.",
      budgetAnalysis: {
        budgetStatus: parsed.budgetStatus || (totalPrice <= (prefs.budget || 2500000) ? '예산 내 완벽 구성' : '프리미엄 업그레이드'),
        savingAdvice: parsed.savingAdvice || '3벌 동시 예약 시 패키지 10% 추가 우대 적용 가능',
        totalPrice,
        budget: prefs.budget || 2500000
      },
      recommendations: validDresses.slice(0, 3),
      source: 'gemini-3.8-flash'
    };
  } catch (error) {
    console.warn("[AI Recommend] Gemini API error, falling back to expert curator:", error);
    return generateCuratedRecommendations(prefs, candidateDresses);
  }
}
