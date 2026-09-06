// Wedding Photo Studios Data for TOBMALL S2B2C Wedding Ecosystem
import botanicalRomanceImg from '../assets/images/botanical_romance_lace_dress.jpg';
import crystalChandelierImg from '../assets/images/crystal_chandelier_ballgown_dress.jpg';
import pureWhiteModelImg from '../assets/images/pure_white_model_sheath_dress.jpg';
import archWindowImg from '../assets/images/arch_window_silhouette_dress.jpg';
import goldenHourImg from '../assets/images/golden_hour_chiffon_dress.jpg';
import orientalFusionImg from '../assets/images/oriental_fusion_dress_1788513802329.jpg';
import dianaRoyalImg from '../assets/images/diana_royal_cathedral_ballgown.jpg';
import audreyClassicImg from '../assets/images/audrey_classic_1950s_dress.jpg';
import heroShowroomImg from '../assets/images/hero_wedding_showroom_1788513831356.jpg';

export interface StudioThemeSample {
  id: string;
  themeTitle: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface StudioPackage {
  id: string;
  name: string;
  priceKRW: number;
  originalPriceKRW?: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface PhotoStudioItem {
  id: string;
  name: string;
  englishName: string;
  shortSlogan: string;
  conceptCategory: 'ALL' | 'GARDEN' | 'PORTRAIT' | 'LUXURY' | 'SNAP' | 'HANOK';
  conceptLabel: string;
  location: string;
  region: '전체' | '청담/강남' | '제주' | '상하이' | '항저우';
  address: string;
  rating: number;
  reviewCount: number;
  leadPhotographer: string;
  studioScale: string;
  coverImage: string;
  badge?: string;
  highlights: string[];
  description: string;
  tobmallBenefits: string[];
  themes: StudioThemeSample[];
  packages: StudioPackage[];
  contactPhone: string;
  operatingHours: string;
  instagram?: string;
}

export interface StudioBookingRequest {
  id: string;
  studioId: string;
  studioName: string;
  customerName: string;
  phone: string;
  preferredDate: string;
  packageId: string;
  packageName: string;
  selectedTheme: string;
  withDressPackage: boolean;
  notes?: string;
  createdAt: string;
  status: '상담접수' | '예약확정' | '촬영완료' | '상담취소';
}

export const PHOTO_STUDIOS: PhotoStudioItem[] = [
  {
    id: 'STU-001',
    name: '아틀리에 스튜디오',
    englishName: 'Atelier Studio Cheongdam',
    shortSlogan: '우아한 아틀리에 살롱과 클래식 아치 윈도우, 가장 찬란한 순간을 담아내는 오트쿠튀르 감성',
    conceptCategory: 'GARDEN',
    conceptLabel: '클래식 아틀리에 & 자연광 살롱',
    location: '서울 청담동',
    region: '청담/강남',
    address: '서울특별시 강남구 청담동 88-12 아틀리에 빌딩 전관',
    rating: 4.95,
    reviewCount: 348,
    leadPhotographer: '강민우 수석 아티스틱 디렉터 (18년 경력)',
    studioScale: '4층 단독 전관 아틀리에 사옥 · 클래식 아치 살롱 · 루프탑 선셋 세트',
    coverImage: archWindowImg,
    badge: '★ 청담 대표 아틀리에 스튜디오',
    highlights: [
      '프랑스 살롱 감성 클래식 아치 윈도우 & 헤리티지 세트',
      '시간대별 자연광 설계와 오트쿠튀르 화보 연출',
      '하루 2팀 단독 프라이빗 아틀리에 촬영',
      'TOBMALL 디자이너 드레스 3벌 완벽 피팅 연동'
    ],
    description: '청담동 명품거리에 위치한 4층 규모의 프라이빗 단독 아틀리에 사옥으로, 클래식한 아치형 창과 앤틱 살롱, 화원 가든을 갖추고 있습니다. 과한 포즈보다는 신랑 신부 고유의 품격과 자연스러운 눈맞춤을 섬세하게 포착합니다.',
    tobmallBenefits: [
      'TOBMALL 드레스 선택 시 아틀리에 제휴 촬영비 20% 특별 페이백',
      '노을 타임 아틀리에 루프탑 씬 (40만원 상당) 무상 업그레이드',
      '모바일 청첩장용 선수정본 5장 당일 전송',
      '전문 헬퍼 이모 현장 배정 연계'
    ],
    themes: [
      {
        id: 'TH-001-1',
        themeTitle: '클래식 아틀리에 & 아치 윈도우 (Atelier Arch Window)',
        description: '앤틱 아치 창틀 사이로 스며드는 은은한 역광과 신부 단독 드레스 트레인 컷',
        imageUrl: archWindowImg,
        tags: ['#아틀리에', '#아치창문', '#실루엣', '#단독컷']
      },
      {
        id: 'TH-001-2',
        themeTitle: '햇살 가득 온실 가든 (Glasshouse Greenery)',
        description: '통유리 천장으로 쏟아지는 햇살과 라넌큘러스 생화로 가득 찬 온실에서의 로맨틱 씬',
        imageUrl: botanicalRomanceImg,
        tags: ['#온실가든', '#자연광', '#생화부케', '#로맨틱']
      },
      {
        id: 'TH-001-3',
        themeTitle: '선셋 골든아워 루프탑',
        description: '해가 지는 청담 도심 노을을 배경으로 영화의 한 장면처럼 담아내는 황혼 씬',
        imageUrl: goldenHourImg,
        tags: ['#선셋루프탑', '#황금빛노을', '#시티뷰', '#시네마틱']
      }
    ],
    packages: [
      {
        id: 'PKG-001-A',
        name: '아틀리에 시그니처 20P 패키지',
        priceKRW: 1950000,
        originalPriceKRW: 2400000,
        description: '20P 프리미엄 압축 앨범 1권 + 20R 아크릴 고급 액자 1개 + 원본/수정본 데이터 전체 제공',
        features: [
          '아틀리에 실내 살롱 + 온실 가든 + 루프탑 4~5시간 촬영',
          '드레스 3벌 + 개인 캐주얼/한복 1벌',
          '원본 파일 1,200컷+ & 정밀 수정본 20컷',
          'TOBMALL 드레스 착용 시 촬영용 슈즈/베일 무료 대여'
        ],
        popular: true
      },
      {
        id: 'PKG-001-B',
        name: '아틀리에 프리미엄 올인원 30P 패키지',
        priceKRW: 2800000,
        originalPriceKRW: 3400000,
        description: '30P 화보형 최고급 가죽 앨범 1권 + 양가 부모님용 미니 앨범 2권 + 24R 대형 아크릴 액자 2개',
        features: [
          '전층 단독 대관 6시간 무제한 촬영',
          '드레스 4벌 + 캐주얼 2벌',
          '야간 전구 로드씬 & 야간 샴페인 씬 포함',
          '수석 아티스틱 디렉터 전담 지정 촬영'
        ]
      }
    ],
    contactPhone: '02-544-7890',
    operatingHours: '화~일 10:00 ~ 19:30 (월요일 휴무)',
    instagram: '@atelier_studio_cheongdam'
  },
  {
    id: 'STU-002',
    name: '스튜디오 드 메종',
    englishName: 'Studio de Maison Cheongdam',
    shortSlogan: '군더더기 없는 미니멀리즘, 10년 뒤에 꺼내보아도 세련된 보그 에디토리얼 화보',
    conceptCategory: 'PORTRAIT',
    conceptLabel: '인물 중심 모던 & 흑백 화보',
    location: '서울 논현동',
    region: '청담/강남',
    address: '서울특별시 강남구 논현로 142길 25 메종 빌딩 B1~2F',
    rating: 4.98,
    reviewCount: 420,
    leadPhotographer: '최시원 대표 포토그래퍼 (보그/바자 패션지 12년)',
    studioScale: '층고 6.5m 대형 호리존 · 360도 무빙 브론컬러 조명 시스템',
    coverImage: pureWhiteModelImg,
    badge: '★ 인물 중심 & 셀럽 화보 선호도 1위',
    highlights: [
      '배경에 묻히지 않는 신랑 신부 고유의 무드 표현',
      '흑백 시그니처 포트레이트 무제한 촬영',
      '패션 화보 리터칭 기법으로 자연스럽고 정교한 보정',
      '프라이빗 피팅 & 메이크업 체인지룸 3실 완비'
    ],
    description: '화려한 세트 대신 신랑 신부 본연의 감정과 시선, 섬세한 텍스처를 조명으로 빚어냅니다. 하이패션 매거진 출신 크리에이티브 팀이 연출부터 디렉팅까지 1:1로 함께합니다.',
    tobmallBenefits: [
      'TOBMALL 머메이드 & 실크 드레스 선택 시 흑백 시그니처 10P 추가 인화 무료',
      '1:1 1차 모니터링 즉석 보정본 3장 현장 인화 액자 증정',
      'TOBMALL 회원 전용 평일 촬영 시 15% 즉시 추가 할인'
    ],
    themes: [
      {
        id: 'TH-002-1',
        themeTitle: '모던 퓨어 화이트 호리존',
        description: '순백의 미니멀 공간에서 신부의 실루엣과 드레스 드레이프를 극대화하는 컷',
        imageUrl: pureWhiteModelImg,
        tags: ['#호리존', '#실크드레스', '#미니멀', '#인물중심']
      },
      {
        id: 'TH-002-2',
        themeTitle: '누아르 클래식 모노크롬 (Black & White)',
        description: '깊이감 있는 음영과 흑백 톤으로 시간의 흐름을 초월하는 아날로그 감성',
        imageUrl: audreyClassicImg,
        tags: ['#흑백사진', '#클래식화보', '#보그무드', '#모노크롬']
      }
    ],
    packages: [
      {
        id: 'PKG-002-A',
        name: '메종 에디토리얼 20P 패키지',
        priceKRW: 1850000,
        originalPriceKRW: 2200000,
        description: '20P 린넨 패브릭 매거진 앨범 1권 + 20R 원목 슬림 액자 + 고화질 원본/수정본 전송',
        features: [
          '대형 호리존 + 모던 라운지 4시간 촬영',
          '드레스 3벌 (실크/비즈/컬러) + 수트 2벌',
          '대표 포토그래퍼 1:1 디렉팅 및 포즈 코칭',
          '잡지 표지 스타일 커스텀 레이아웃 적용'
        ],
        popular: true
      },
      {
        id: 'PKG-002-B',
        name: '메종 마스터피스 30P 패키지',
        priceKRW: 2700000,
        originalPriceKRW: 3200000,
        description: '30P 최고급 가죽 양장본 앨범 + 24R 갤러리 파인아트 액자 2개 + 시네마 영상 릴스 제작',
        features: [
          '5시간 종일 단독 대관',
          '흑백 전용 암실 톤 리터칭 10컷 추가',
          '세로형 4K 인스타그램 릴스 숏폼 무비 무상 제작'
        ]
      }
    ],
    contactPhone: '02-512-3345',
    operatingHours: '화~일 09:30 ~ 19:00',
    instagram: '@studio_demaison'
  },
  {
    id: 'STU-003',
    name: '청담 비체 스튜디오 & 나이트 로드',
    englishName: 'Cheongdam Biche & Night Scene',
    shortSlogan: '압도적인 샹들리에와 웅장한 캐슬 홀, 라라랜드 같은 도심 속 야간 전구 씬',
    conceptCategory: 'LUXURY',
    conceptLabel: '럭셔리 캐슬 & 로맨틱 나이트씬',
    location: '서울 청담동',
    region: '청담/강남',
    address: '서울특별시 강남구 압구정로 79길 18 비체 캐슬 타워 전관',
    rating: 4.91,
    reviewCount: 295,
    leadPhotographer: '송하늘 총괄 포토 실장',
    studioScale: '350평 복층 럭셔리 대저택 세트 · 대형 크리스탈 샹들리에 · 옥상 전구 로드씬',
    coverImage: crystalChandelierImg,
    badge: '★ 벨라인 & 비즈 드레스 최적화 스튜디오',
    highlights: [
      '실제 유럽 대저택 무드의 웅장한 샹들리에 그랜드 홀',
      '청담 야경을 배경으로 한 야간 옥상 전구씬 & 로드씬 특화',
      '풍성한 벨라인 드레스와 티아라 연출에 최적화된 웅장한 스케일',
      'TOBMALL 로열 크리스탈 라인 드레스 전용 세트 보유'
    ],
    description: '공주님이 된 듯한 로맨틱 판타지를 실현하는 럭셔리 스튜디오입니다. 12m 대형 크리스탈 샹들리에와 계단 씬, 밤이 되면 3,000개의 전구가 켜지는 옥상 로드씬으로 유명합니다.',
    tobmallBenefits: [
      '야간 옥상 전구씬 & 로드씬 촬영 추가금 (45만원 상당) 전액 무료 지원',
      'TOBMALL 다이아몬드 티아라 및 크리스탈 이어링 하이엔드 주얼리 세트 무료 연출',
      '양가 직계 가족 5인 기념사진 1회 무료 촬영 혜택'
    ],
    themes: [
      {
        id: 'TH-003-1',
        themeTitle: '그랜드 샹들리에 & 로열 계단 씬',
        description: '수천 개의 크리스탈이 반짝이는 샹들리에 아래서 펼쳐지는 영화 속 무도회 같은 씬',
        imageUrl: crystalChandelierImg,
        tags: ['#크리스탈샹들리에', '#로열계단', '#벨라인', '#럭셔리']
      },
      {
        id: 'TH-003-2',
        themeTitle: '캐서드럴 롱트레인 클래식',
        description: '길게 늘어뜨린 레이스 트레인과 웅장한 아치형 궁전 배경의 기품 있는 웨딩 씬',
        imageUrl: dianaRoyalImg,
        tags: ['#롱트레인', '#클래식캐슬', '#웅장함', '#여왕의귀환']
      }
    ],
    packages: [
      {
        id: 'PKG-003-A',
        name: '비체 로열 20P + 나이트 패키지',
        priceKRW: 2100000,
        originalPriceKRW: 2600000,
        description: '20P 프리미엄 하드커버 앨범 + 20R 크리스탈 액자 + 야간 전구씬 기본 포함',
        features: [
          '그랜드 샹들리에홀 + 앤틱 살롱 + 루프탑 야경 5시간',
          '드레스 3벌 (풍성 벨라인 1벌 필수 추천)',
          '야간 전구씬 3,000구 점등 촬영 포함'
        ],
        popular: true
      }
    ],
    contactPhone: '02-548-9921',
    operatingHours: '수~월 10:30 ~ 21:00 (화요일 휴무, 나이트 촬영 진행)',
    instagram: '@cheongdam_biche'
  },
  {
    id: 'STU-004',
    name: '루체른 하우스 & 제주 사려니 야외스냅',
    englishName: 'Luzerne House & Jeju Snap',
    shortSlogan: '제주의 웅장한 사려니 숲과 삼다수 목장, 푸른 오름을 달리는 가장 자유로운 웨딩 스냅',
    conceptCategory: 'SNAP',
    conceptLabel: '제주 자연 야외스냅 & 하우스 가든',
    location: '제주도 / 서울 청담 센터',
    region: '제주',
    address: '제주특별자치도 제주시 조천읍 교래숲길 112 / 서울 강남구 청담동 42-1 (서울 미팅룸)',
    rating: 4.96,
    reviewCount: 382,
    leadPhotographer: '한동훈 제주 마스터 작가 (제주 토박이 15년 스냅)',
    studioScale: '제주 전용 베이스캠프 샵 · 전용 4WD 드라이빙 밴 · 드론 항공 시네마틱 촬영팀',
    coverImage: goldenHourImg,
    badge: '★ 제주 숲 & 오름 스냅 예약 만족도 1위',
    highlights: [
      '신비로운 사려니 숲길, 억새풀 오름, 비밀 해변 4대 포인트 투어',
      '제주 날씨 변수에 즉각 대응하는 실시간 로케이션 동선 최적화',
      '헬퍼 이모 동승 및 4WD 이동 밴 풀케어 서비스',
      '4K 드론 항공 시네마틱 비디오 클립 기본 제공'
    ],
    description: '실내 스튜디오의 틀을 벗어나 바람과 햇살, 바다와 숲이 함께하는 제주 감성 야외스냅 전문입니다. TOBMALL의 가볍고 우아한 오간자 실크 드레스와 완벽한 조화를 이룹니다.',
    tobmallBenefits: [
      '드론 항공 촬영 시네마틱 4K 영상 (50만원 상당) 무상 지원',
      'TOBMALL 슬림 머메이드/엠파이어 야외용 드레스 오염 세탁비 전액 면제',
      '생화 부케 & 부토니에 2세트 제주 현지 제작 지원'
    ],
    themes: [
      {
        id: 'TH-004-1',
        themeTitle: '사려니 편백나무 숲길 안개 씬',
        description: '피톤치드 가득한 안개 숲속에서 바람에 흩날리는 베일과 신비로운 햇살',
        imageUrl: goldenHourImg,
        tags: ['#사려니숲', '#편백나무', '#바람결', '#피톤치드']
      }
    ],
    packages: [
      {
        id: 'PKG-004-A',
        name: '제주 올데이 하프투어 20P',
        priceKRW: 1750000,
        originalPriceKRW: 2100000,
        description: '20P 제주 파인아트 앨범 + 20R 아크릴 액자 + 원본 1,500컷 + 정밀보정 20컷',
        features: [
          '숲 + 오름 + 들판 + 노을바다 4개 로케이션 (약 5시간)',
          '드레스 2벌 + 캐주얼 1벌',
          '동행 헬퍼 및 이동 밴 지원'
        ],
        popular: true
      }
    ],
    contactPhone: '064-782-5501',
    operatingHours: '연중무휴 08:00 ~ 20:00 (사전 예약제)',
    instagram: '@luzerne_jeju_snap'
  },
  {
    id: 'STU-005',
    name: '달빛스쿠터 & 한옥 헤리티지',
    englishName: 'Moonlight Heritage Hanok Studio',
    shortSlogan: '100년 전통 한옥의 단아한 기와선과 마당, 동양의 고즈넉한 품격을 담아내는 화보',
    conceptCategory: 'HANOK',
    conceptLabel: '전통 한옥 & 오리엔탈 퓨전',
    location: '서울 북촌 / 강남',
    region: '청담/강남',
    address: '서울특별시 종로구 북촌로 55 전통 한옥 독채 / 강남구 학동로 11-2',
    rating: 4.92,
    reviewCount: 228,
    leadPhotographer: '배서진 궁중 문화재 화보 명인',
    studioScale: '100년 전통 문화재급 한옥 독채 + 실내 모던 스튜디오 복합 공간',
    coverImage: orientalFusionImg,
    badge: '★ 한국 전통미 & 글로벌 커플 선호도 1위',
    highlights: [
      '실제 북촌 한옥 기와와 툇마루, 장독대, 대청마루에서 진행되는 고품격 한옥씬',
      'TOBMALL 오리엔탈 퓨전 및 전통 궁중 드레스 완벽 매칭',
      '외국인 신랑 신부를 위한 영/중 통역 플래너 항시 동행 가능',
      '전통 비녀, 노리개, 갓, 꽃신 등 프리미엄 전통 소품 완비'
    ],
    description: '고즈넉한 한옥의 대청마루와 한지 창호, 사계절 정원의 풍경이 어우러져 단아하고 우아한 한국의 미를 담아냅니다. 전통 예복뿐 아니라 현대적인 웨딩 드레스와의 퓨전 매치로 독보적인 화보를 완성합니다.',
    tobmallBenefits: [
      'TOBMALL 오리엔탈 퓨전 드레스 선택 시 한옥 대관료 (60만원) 전액 무료 지원',
      '고급 비단 족자형 전통 액자 1점 추가 제작 증정',
      '전통 다도 씬 찻잔 세팅 및 촬영 소품 무상 지원'
    ],
    themes: [
      {
        id: 'TH-005-1',
        themeTitle: '북촌 툇마루 & 기와 담장 씬',
        description: '따스한 오후 햇살이 내려앉은 대청마루와 고즈넉한 한옥 기와 담길을 걷는 두 사람',
        imageUrl: orientalFusionImg,
        tags: ['#북촌한옥', '#대청마루', '#오리엔탈퓨전', '#단아한품격']
      }
    ],
    packages: [
      {
        id: 'PKG-005-A',
        name: '한옥 헤리티지 20P 패키지',
        priceKRW: 2200000,
        originalPriceKRW: 2700000,
        description: '20P 전통 한지 커버 수제 앨범 + 20R 원목 액자 + 비단 족자 1개 + 원본 데이터',
        features: [
          '북촌 한옥 독채 대관 3시간 + 실내 스튜디오 2시간 (총 5시간)',
          '한복/오리엔탈 퓨전 2벌 + 클래식 웨딩 드레스 2벌',
          '전통 소품 및 비녀 세팅 지원'
        ],
        popular: true
      }
    ],
    contactPhone: '02-764-8802',
    operatingHours: '화~일 10:00 ~ 18:30 (월요일 휴무)',
    instagram: '@moonlight_hanok_heritage'
  },
  {
    id: 'STU-006',
    name: '상하이 번드 & 와이탄 시티라이트 스튜디오',
    englishName: 'Shanghai The Bund & Skyline Studio',
    shortSlogan: '동양의 파리 상하이 와이탄의 100년 석조 건축과 동방명주 스카이라인을 한눈에',
    conceptCategory: 'LUXURY',
    conceptLabel: '글로벌 와이탄 로케이션 & 파노라마 뷰',
    location: '중국 상하이 와이탄',
    region: '상하이',
    address: '중국 상하이 황푸구 중산동1로 와이탄 18호 5층 & 루프탑 테라스',
    rating: 4.97,
    reviewCount: 206,
    leadPhotographer: 'David Chen & 김하늘 글로벌 크리에이티브 디렉터',
    studioScale: '황푸강 파노라마 테라스 단독 대관 · 프렌치 앤틱 살롱 · 인터내셔널 스냅팀',
    coverImage: heroShowroomImg,
    badge: '★ 글로벌 S2B2C 상하이 랜드마크 스튜디오',
    highlights: [
      '동방명주와 와이탄 석조 건축물이 한눈에 들어오는 프라이빗 테라스',
      '상하이 현지 메이크업 팀 & 한국인 디렉터의 완벽한 콜라보레이션',
      '한/중 크로스보더 커플을 위한 다국어 맞춤 케어',
      '한국-중국 전역 무료 안전 안심 특송 앨범 배송'
    ],
    description: '황푸강 너머 푸둥의 초현대적인 미래 스카이라인과 와이탄의 고전적인 유럽풍 건축이 교차하는 상하이 최고의 럭셔리 로케이션입니다. 세계적인 도시의 로맨스를 품격 있게 담아냅니다.',
    tobmallBenefits: [
      '한국-중국 왕복 및 현지 촬영 플래너 1:1 전담 통역 지원',
      '완성 앨범 및 액자 한/중 안심 국제 특송비 전액 면제',
      '상하이 와이탄 테라스 전용 샴페인 토스트 씬 무료 추가'
    ],
    themes: [
      {
        id: 'TH-006-1',
        themeTitle: '와이탄 테라스 & 동방명주 나이트',
        description: '황푸강의 화려한 조명과 동방명주 타워가 펼쳐지는 루프탑 테라스 시그니처 씬',
        imageUrl: heroShowroomImg,
        tags: ['#상하이와이탄', '#동방명주', '#시티라이트', '#글로벌스냅']
      }
    ],
    packages: [
      {
        id: 'PKG-006-A',
        name: '상하이 와이탄 파노라마 25P 패키지',
        priceKRW: 2900000,
        originalPriceKRW: 3600000,
        description: '25P 이탈리아 가죽 앨범 + 24R 크리스탈 대형 액자 + 한국/중국 무료 배송',
        features: [
          '와이탄 18호 테라스 + 실내 프렌치 살롱 + 와이탄 로드 야경 (총 6시간)',
          '웨딩 드레스 3벌 + 이브닝 드레스 1벌',
          '한/중 동시 출장 플래너 지원'
        ],
        popular: true
      }
    ],
    contactPhone: '+86 21 6329 8818 / 한국센터: 02-512-8819',
    operatingHours: '월~일 10:00 ~ 21:00',
    instagram: '@shanghai_bund_studio'
  }
];

export const INITIAL_STUDIO_BOOKINGS: StudioBookingRequest[] = [
  {
    id: 'STUBK-2026-001',
    studioId: 'STU-001',
    studioName: '아틀리에 스튜디오',
    customerName: '김민지 & 박준혁',
    phone: '010-3344-7788',
    preferredDate: '2026-06-15',
    packageId: 'PKG-001-A',
    packageName: '아틀리에 시그니처 20P 패키지',
    selectedTheme: '햇살 가득 온실 가든 (Glasshouse Greenery)',
    withDressPackage: true,
    notes: 'TOBMALL 벨라인 드레스 2벌과 함께 피팅 후 촬영하고 싶습니다. 오후 2시 채광 좋은 시간대 희망합니다.',
    createdAt: '2026-05-18',
    status: '예약확정'
  },
  {
    id: 'STUBK-2026-002',
    studioId: 'STU-002',
    studioName: '스튜디오 드 메종',
    customerName: '이지은 & 정재훈',
    phone: '010-8877-6655',
    preferredDate: '2026-07-02',
    packageId: 'PKG-002-A',
    packageName: '메종 에디토리얼 20P 패키지',
    selectedTheme: '모던 퓨어 화이트 호리존',
    withDressPackage: true,
    notes: '인물 중심 흑백 씬을 많이 찍고 싶습니다. 슬림 실크 머메이드 드레스 연계 희망합니다.',
    createdAt: '2026-05-19',
    status: '상담접수'
  }
];
