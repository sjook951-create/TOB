import ballGownImg from '../assets/images/ball_gown_dress_1788513739326.jpg';
import mermaidSilkImg from '../assets/images/mermaid_silk_dress_1788513755894.jpg';
import alineFloralImg from '../assets/images/aline_floral_dress_1788513769331.jpg';
import empireLaceImg from '../assets/images/empire_lace_dress_1788513783720.jpg';
import orientalFusionImg from '../assets/images/oriental_fusion_dress_1788513802329.jpg';
import pearlMajestyImg from '../assets/images/pearl_majesty_dress_1788513817581.jpg';

export interface DressItem {
  id: string;
  name: string;
  designer: string;
  workshop: string;
  category: 'A-Line' | 'Mermaid' | 'Ball Gown' | 'Empire' | 'Traditional Fusion';
  rentalPrice: number; // KRW or CNY
  deposit: number;
  imageUrl: string;
  tag: string;
  status: '가용' | '피팅중' | '대여중' | '심사대기';
  silhouette: string;
  fabric: string;
  rating: number;
  rentalCount: number;
  description: string;
}

export interface BookingItem {
  id: string;
  customerName: string;
  phone: string;
  storeName: string;
  date: string;
  timeSlot: string;
  fittingRoom: string;
  selectedDresses: string[];
  weddingDate: string;
  weddingVenue: string;
  plannerCode?: string;
  status: '예약확정' | '피팅완료' | '계약체결' | '취소';
  assignedStylist?: string;
}

export interface RentalContract {
  id: string;
  bookingId: string;
  customerName: string;
  dressName: string;
  dressId: string;
  rentalFee: number;
  deposit: number;
  startDate: string;
  endDate: string;
  storeName: string;
  status: '계약완료' | '출고완료' | '본식진행' | '반납검수' | '마감정산완료';
  helperAssigned?: string;
  signature: string; // digital sign indicator
}

export const INITIAL_DRESSES: DressItem[] = [
  {
    id: 'DR-001',
    name: '아우로라 로열 크리스탈 벨라인 (Aurora Royal)',
    designer: 'Grace Kim Studio (Seoul)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 1800000,
    deposit: 500000,
    imageUrl: ballGownImg,
    tag: '2026 S/S 신작',
    status: '가용',
    silhouette: '벨라인 (Ball Gown)',
    fabric: '프랑스 수입 튤, 스와로브스키 비딩',
    rating: 4.9,
    rentalCount: 14,
    description: '빛의 각도에 따라 영롱하게 반짝이는 수공예 크리스탈 비딩과 웅장한 트레인이 특징인 하이엔드 호텔 본식용 드레스입니다.'
  },
  {
    id: 'DR-002',
    name: '세레나데 실크 머메이드 (Serenade Silk)',
    designer: 'Marie Atelier (Paris)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'Mermaid',
    rentalPrice: 1500000,
    deposit: 400000,
    imageUrl: mermaidSilkImg,
    tag: '베스트셀러',
    status: '가용',
    silhouette: '머메이드 (Mermaid)',
    fabric: '미카도 실크 (Mikado Silk)',
    rating: 4.8,
    rentalCount: 22,
    description: '클래식한 미카도 실크의 고급스러운 광택감과 여성스러운 곡선미를 극대화하는 보트넥 오프숄더 드레스입니다.'
  },
  {
    id: 'DR-003',
    name: '블루밍 로맨틱 에이치라인 (Blooming Flora)',
    designer: 'Lee Eun Studio',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'A-Line',
    rentalPrice: 1200000,
    deposit: 300000,
    imageUrl: alineFloralImg,
    tag: '인기 큐레이션',
    status: '피팅중',
    silhouette: '에이라인 (A-Line)',
    fabric: '입체 플라워 아플리케, 오간자 실크',
    rating: 4.9,
    rentalCount: 18,
    description: '야외 가든 웨딩 및 채플 웨딩에 어울리는 자연스럽고 우아한 플라워 모티브 자수 드레스입니다.'
  },
  {
    id: 'DR-004',
    name: '모던 엠파이어 시스루 슬리브 (Modern Empire)',
    designer: 'Chloe Studio',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Empire',
    rentalPrice: 1100000,
    deposit: 300000,
    imageUrl: empireLaceImg,
    tag: '신규 입고',
    status: '가용',
    silhouette: '엠파이어 (Empire)',
    fabric: '실크 쉬폰, 샹티이 레이스',
    rating: 4.7,
    rentalCount: 9,
    description: '가볍고 편안한 피팅감과 세련된 감성을 선사하는 스몰 웨딩 및 2부 리셉션 전용 드레스입니다.'
  },
  {
    id: 'DR-005',
    name: '동양의 빛 퓨전 오리엔탈 로열 (Oriental Fusion)',
    designer: 'Zhang & Park Collaboration',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'Traditional Fusion',
    rentalPrice: 2100000,
    deposit: 600000,
    imageUrl: orientalFusionImg,
    tag: '글로벌 프리미엄',
    status: '가용',
    silhouette: '퓨전 오리엔탈',
    fabric: '황실 금사 자수, 비단 실크',
    rating: 5.0,
    rentalCount: 11,
    description: '한중 전통 미학과 현대 오트쿠튀르 라인을 결합한 독창적 컬렉션으로, 글로벌 VIP 예식에서 각광받는 명작입니다.'
  },
  {
    id: 'DR-006',
    name: '클레오파트라 스퀘어넥 펄 (Pearl Majesty)',
    designer: 'Atelier Milano',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 1950000,
    deposit: 500000,
    imageUrl: pearlMajestyImg,
    tag: '호텔 본식 추천',
    status: '대여중',
    silhouette: '프린세스 벨라인',
    fabric: '천연 담수진주 자수, 새틴 실크',
    rating: 4.9,
    rentalCount: 16,
    description: '단정한 스퀘어 네크라인과 허리라인부터 풍성하게 펼쳐지는 은은한 펄 자수가 장엄한 분위기를 연출합니다.'
  }
];

export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'BK-2026-089',
    customerName: '김지은 & 박민우',
    phone: '010-8742-9912',
    storeName: '항저우 왕차오 센터점 (Wangchao Center)',
    date: '2026-05-24',
    timeSlot: '14:00 ~ 16:00',
    fittingRoom: 'VIP Suite 1 (로열룸)',
    selectedDresses: ['DR-001', 'DR-002'],
    weddingDate: '2026-09-12',
    weddingVenue: '그랜드 인터컨티넨탈 서울 파르나스 그랜드볼룸',
    plannerCode: 'PLN-SH-882 (정하윤 플래너)',
    status: '예약확정',
    assignedStylist: '이소영 수석 스타일리스트'
  },
  {
    id: 'BK-2026-090',
    customerName: '최서현 & 이진호',
    phone: '010-3412-5589',
    storeName: '상하이 와이탄 플래그십 (The Bund)',
    date: '2026-05-25',
    timeSlot: '11:00 ~ 13:00',
    fittingRoom: 'VIP Suite 2 (가든뷰)',
    selectedDresses: ['DR-003', 'DR-004'],
    weddingDate: '2026-10-04',
    weddingVenue: '상하이 페닌슐라 호텔 리셉션홀',
    plannerCode: 'PLN-SH-104 (왕메이 플래너)',
    status: '피팅완료',
    assignedStylist: '왕웨이 실장'
  },
  {
    id: 'BK-2026-091',
    customerName: '장유진 & 강도현',
    phone: '010-6621-4321',
    storeName: '항저우 왕차오 센터점 (Wangchao Center)',
    date: '2026-05-26',
    timeSlot: '16:00 ~ 18:00',
    fittingRoom: 'VIP Suite 1 (로열룸)',
    selectedDresses: ['DR-005'],
    weddingDate: '2026-11-20',
    weddingVenue: '신라호텔 다이너스티홀',
    plannerCode: 'PLN-KR-009 (최유리 플래너)',
    status: '계약체결',
    assignedStylist: '이소영 수석 스타일리스트'
  }
];

export const INITIAL_RENTAL_CONTRACTS: RentalContract[] = [
  {
    id: 'RC-2026-0041',
    bookingId: 'BK-2026-091',
    customerName: '장유진 신부',
    dressName: '동양의 빛 퓨전 오리엔탈 로열 (Oriental Fusion)',
    dressId: 'DR-005',
    rentalFee: 2100000,
    deposit: 600000,
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    storeName: '항저우 왕차오 센터점',
    status: '출고완료',
    helperAssigned: '박순자 헬퍼이모 (경력 14년)',
    signature: '전자서명 완료 (장유진)'
  },
  {
    id: 'RC-2026-0040',
    bookingId: 'BK-2026-085',
    customerName: '윤서아 신부',
    dressName: '세레나데 실크 머메이드 (Serenade Silk)',
    dressId: 'DR-002',
    rentalFee: 1500000,
    deposit: 400000,
    startDate: '2026-05-18',
    endDate: '2026-05-20',
    storeName: '항저우 왕차오 센터점',
    status: '반납검수',
    helperAssigned: '이명숙 헬퍼이모 (경력 18년)',
    signature: '전자서명 완료 (윤서아)'
  }
];
