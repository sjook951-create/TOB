import ballGownImg from '../assets/images/ball_gown_dress_1788513739326.jpg';
import mermaidSilkImg from '../assets/images/mermaid_silk_dress_1788513755894.jpg';
import alineFloralImg from '../assets/images/aline_floral_dress_1788513769331.jpg';
import empireLaceImg from '../assets/images/empire_lace_dress_1788513783720.jpg';
import orientalFusionImg from '../assets/images/oriental_fusion_dress_1788513802329.jpg';
import pearlMajestyImg from '../assets/images/pearl_majesty_dress_1788513817581.jpg';
import starlightCrystalImg from '../assets/images/starlight_crystal_dress_1788583338802.jpg';
import vintageLaceImg from '../assets/images/vintage_lace_dress_1788583360798.jpg';
import modernSheathImg from '../assets/images/modern_sheath_dress_1788583378485.jpg';
import altheaBowLaceImg from '../assets/images/althea_bow_lace_dress.jpg';
import pleatedTieredMermaidImg from '../assets/images/pleated_tiered_mermaid_dress.jpg';
import kallHalterCoutureImg from '../assets/images/kall_halter_couture_dress.jpg';
import drapedSilkMermaidImg from '../assets/images/draped_silk_mermaid_dress.jpg';
import royalCrystalBallgownImg from '../assets/images/royal_crystal_ballgown_dress.jpg';
import floralAppliqueAlineImg from '../assets/images/floral_applique_aline_dress.jpg';
import classicMikadoEmpireImg from '../assets/images/classic_mikado_empire_dress.jpg';
import illusionLaceMermaidImg from '../assets/images/illusion_lace_mermaid_dress.jpg';
import goldenImperialFusionImg from '../assets/images/golden_imperial_fusion_dress.jpg';
import ivoryChandelierAlineImg from '../assets/images/ivory_chandelier_couture_dress.jpg';
import crystalChandelierBallgownImg from '../assets/images/crystal_chandelier_ballgown_dress.jpg';
import pureWhiteModelSheathImg from '../assets/images/pure_white_model_sheath_dress.jpg';
import coutureBowBackImg from '../assets/images/couture_bow_back_dress.jpg';
import handmadeLaceEmpireImg from '../assets/images/handmade_lace_empire_dress.jpg';
import elyRoyalHeritageBallgownImg from '../assets/images/ely_royal_heritage_ballgown.jpg';
import victorianCorsetLaceImg from '../assets/images/victorian_corset_lace_dress.jpg';
import sweetheartPearlBustierImg from '../assets/images/mannequin_couture_sweetheart_dress.jpg';
import halterChiffonEmpireImg from '../assets/images/mannequin_halter_chiffon_dress.jpg';
import runwayHauteCoutureFusionImg from '../assets/images/runway_haute_couture_fusion_dress.jpg';
import dianaRoyalCathedralImg from '../assets/images/diana_royal_cathedral_ballgown.jpg';
import audreyClassic1950sImg from '../assets/images/audrey_classic_1950s_dress.jpg';
import edwardianSilkHeritageImg from '../assets/images/edwardian_silk_heritage_dress.jpg';

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
  },
  {
    id: 'DR-007',
    name: '스타라이트 크리스탈 일루전 벨라인 (Starlight Crystal)',
    designer: 'Elena Blanc Couture (Milan)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2200000,
    deposit: 600000,
    imageUrl: starlightCrystalImg,
    tag: '2026 하이엔드 신작',
    status: '가용',
    silhouette: '일루전 벨라인',
    fabric: '이탈리아 쉬머 튤, 스와로브스키 스타더스트 크리스탈',
    rating: 5.0,
    rentalCount: 8,
    description: '별빛을 수놓은 듯한 일루전 네크라인과 은은하게 흩뿌려진 크리스탈 비딩, 웅장한 캐시드럴 트레인으로 극적인 아우라를 완성하는 최고급 본식 드레스입니다.'
  },
  {
    id: 'DR-008',
    name: '로맨틱 보헤미안 샹티이 레이스 에이라인 (Boho Chantilly)',
    designer: 'Atelier Clara (Provence)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1350000,
    deposit: 350000,
    imageUrl: vintageLaceImg,
    tag: '가든 & 야외 웨딩',
    status: '가용',
    silhouette: '보헤미안 에이라인',
    fabric: '프랑스 수제 샹티이 레이스, 실크 시폰',
    rating: 4.8,
    rentalCount: 15,
    description: '우아한 비숍 슬리브와 입체 플로럴 자수, 바람에 하늘거리는 가벼운 트레인으로 자연스럽고 로맨틱한 무드를 선사하는 야외/채플 웨딩 추천 드레스입니다.'
  },
  {
    id: 'DR-009',
    name: '미니멀 시크 카울넥 크레이프 머메이드 (Minimalist Cowl)',
    designer: 'Studio Min (New York & Seoul)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Mermaid',
    rentalPrice: 1650000,
    deposit: 450000,
    imageUrl: modernSheathImg,
    tag: '도회적 모더니즘',
    status: '가용',
    silhouette: '시스 머메이드',
    fabric: '헤비 실크 크레이프 (Silk Crepe), 실크 새틴 안감',
    rating: 4.9,
    rentalCount: 12,
    description: '절제된 실루엣과 드레이핑 카울넥 네크라인, 과감하고 우아한 백리스 디테일로 현대적인 신부의 세련미를 극대화한 건축미적 드레스입니다.'
  },
  {
    id: 'DR-010',
    name: '알테아 보우 리본 로맨틱 튤 (Althea Lace Bow)',
    designer: 'Atelier Althea (Paris & Seoul)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1450000,
    deposit: 400000,
    imageUrl: altheaBowLaceImg,
    tag: '2026 피팅 신작 / 보우 디테일',
    status: '가용',
    silhouette: '소프트 에이라인 (Soft A-Line)',
    fabric: '수입 샹티이 레이스, 실크 튤, 새틴 보우 리본 타이',
    rating: 4.9,
    rentalCount: 7,
    description: '깊은 V네크라인과 섬세한 시스루 튤 윙 슬리브, 바스트와 허리를 장식하는 더블 새틴 보우 리본 타이와 코르셋 본딩 레이스가 로맨틱하고 보헤미안 무드를 자아내는 오트쿠튀르 드레스입니다.'
  },
  {
    id: 'DR-011',
    name: '플리츠 뷔스티에 티어드 러플 머메이드 (Pleated Tiered Mermaid)',
    designer: 'Maison de Blanc Couture',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Mermaid',
    rentalPrice: 1750000,
    deposit: 450000,
    imageUrl: pleatedTieredMermaidImg,
    tag: '3cm 가슴선업 맞춤 / 쿠튀르 플리츠',
    status: '가용',
    silhouette: '스트랩리스 머메이드 (Strapless Mermaid)',
    fabric: '마이크로 아코디언 플리츠 오간자, 티어드 튤 러플, 보우 악센트',
    rating: 5.0,
    rentalCount: 10,
    description: '정교한 세로 마이크로 플리츠가 바디 실루엣을 슬림하게 감싸며, 3cm 상향 설계된 하트탑 뷔스티에와 무릎 아래로 드라마틱하게 펼쳐지는 티어드 튤 러플 및 리본 포인트가 돋보이는 모던 하이엔드 드레스입니다.'
  },
  {
    id: 'DR-012',
    name: '칼 하이넥 프렌치 레이스 쿠튀르 (Kall High-Neck Couture 25)',
    designer: 'Kall Atelier Haute Couture',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Traditional Fusion',
    rentalPrice: 2300000,
    deposit: 600000,
    imageUrl: kallHalterCoutureImg,
    tag: '런웨이 컬렉션 No.25',
    status: '가용',
    silhouette: '하이넥 시스 & 러플 케이프 트레인',
    fabric: '프랑스 수제 코드 레이스, 시어 일루전 튤, 오간자 러플',
    rating: 5.0,
    rentalCount: 5,
    description: '우아한 빅토리아풍 하이넥 홀터 네크라인과 정교한 프렌치 코드 레이스 패턴, 런웨이 No.25번 고유 태그와 사이드로 풍성하게 물결치는 티어드 오간자 케이프 트레인으로 최고의 장인정신과 아우라를 선사하는 최상위 마스터피스입니다.'
  },
  {
    id: 'DR-013',
    name: '오프숄더 드레이프 새틴 머메이드 (Draped Silk Mermaid)',
    designer: 'Grace Kim Studio (Seoul)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Mermaid',
    rentalPrice: 1800000,
    deposit: 500000,
    imageUrl: drapedSilkMermaidImg,
    tag: '2026 S/S 신작 / 드레이핑',
    status: '가용',
    silhouette: '오프숄더 머메이드 (Off-Shoulder Mermaid)',
    fabric: '헤비 실크 미카도 새틴, 입체 비대칭 드레이프 오간자',
    rating: 4.9,
    rentalCount: 14,
    description: '어깨 라인을 부드럽게 감싸는 조각적인 오프숄더 드레이핑과 모던하게 핏되는 실크 머메이드 라인으로 세련되고 우아한 신부의 자태를 극대화한 컬렉션입니다.'
  },
  {
    id: 'DR-014',
    name: '로열 크리스탈 비딩 웅장한 볼가운 (Royal Crystal Ballgown)',
    designer: 'Atelier Milano (Milan & Shanghai)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2400000,
    deposit: 650000,
    imageUrl: royalCrystalBallgownImg,
    tag: '호텔 그랜드볼룸 원픽',
    status: '가용',
    silhouette: '임페리얼 벨라인 (Imperial Ball Gown)',
    fabric: '오스트리아 스와로브스키 크리스탈, 실버 메탈릭 얀, 8단 로열 튤',
    rating: 5.0,
    rentalCount: 19,
    description: '상체 일루전 하트탑에 수놓인 수만 개의 크리스탈 비즈와 웅장하게 펼쳐지는 캐시드럴 볼가운 실루엣이 호텔 본식 조명 아래에서 눈부신 광채를 발산합니다.'
  },
  {
    id: 'DR-015',
    name: '플로럴 입체 아플리케 로맨틱 에이라인 (Floral Applique A-Line)',
    designer: 'Atelier Clara (Provence)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1550000,
    deposit: 400000,
    imageUrl: floralAppliqueAlineImg,
    tag: '가든 & 하우스 웨딩',
    status: '가용',
    silhouette: '소프트 에이라인 (Soft A-Line)',
    fabric: '3D 실크 플라워 아플리케, 소프트 시폰 튤, 샹티이 레이스',
    rating: 4.9,
    rentalCount: 11,
    description: '상체부터 스커트 자락까지 꽃잎이 흩날리듯 피어나는 3D 플로럴 아플리케와 가벼운 에어리 튤 소재로 자연스럽고 싱그러운 로맨티시즘을 완성합니다.'
  },
  {
    id: 'DR-016',
    name: '스퀘어넥 클래식 미카도 엠파이어 (Classic Mikado Empire)',
    designer: 'Studio Min (New York & Seoul)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Empire',
    rentalPrice: 1650000,
    deposit: 450000,
    imageUrl: classicMikadoEmpireImg,
    tag: '단아한 채플 웨딩',
    status: '가용',
    silhouette: '클래식 엠파이어 (Classic Empire)',
    fabric: '최고급 미카도 실크, 펄 밴드 트리밍, 탈부착 와토 백 트레인',
    rating: 4.8,
    rentalCount: 9,
    description: '단아한 스퀘어 네크라인과 하이웨이스트 엠파이어 라인, 구조적인 미카도 실크의 고급스러운 광택감이 어우러져 절제된 클래식 귀족미를 선사합니다.'
  },
  {
    id: 'DR-017',
    name: '일루전 프렌치 레이스 백리스 머메이드 (Illusion Backless Mermaid)',
    designer: 'Elena Blanc Couture (Milan)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Mermaid',
    rentalPrice: 1900000,
    deposit: 500000,
    imageUrl: illusionLaceMermaidImg,
    tag: '하이엔드 슬림 라인',
    status: '가용',
    silhouette: '피티드 일루전 머메이드 (Illusion Mermaid)',
    fabric: '프랑스 수제 리버 레이스, 누드 일루전 튤, 싸개단추 백라인',
    rating: 5.0,
    rentalCount: 13,
    description: '정교한 프렌치 레이스가 피부 위에 투영되는 시스루 일루전 네크라인과 드라마틱한 딥 백리스 라인으로 관능미와 품격을 동시에 담아낸 꾸뛰르 머메이드입니다.'
  },
  {
    id: 'DR-018',
    name: '황실 금사 자수 퓨전 임페리얼 (Golden Imperial Fusion)',
    designer: 'Heritage East & West (Seoul & Hangzhou)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'Traditional Fusion',
    rentalPrice: 2500000,
    deposit: 700000,
    imageUrl: goldenImperialFusionImg,
    tag: '글로벌 VIP 마스터피스',
    status: '가용',
    silhouette: '하이엔드 퓨전 오리엔탈 (Imperial Fusion)',
    fabric: '24K 순금사 핸드메이드 자수, 천연 비단 공단, 샴페인 골드 튤',
    rating: 5.0,
    rentalCount: 7,
    description: '동양의 황실 봉황 자수 기법과 서양의 꾸뛰르 볼가운 실루엣을 독창적으로 융합하여, 아시아 및 글로벌 VIP 웨딩에서 찬사를 받는 최고급 리미티드 마스터피스입니다.'
  },
  {
    id: 'DR-019',
    name: '헤리티지 레이스 풀 실루엣 A라인 (Heritage Full Silhouette A-Line)',
    designer: 'Atelier Clara (Provence)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1500000,
    deposit: 400000,
    imageUrl: ivoryChandelierAlineImg,
    tag: '클래식 아이보리 / 풀 실루엣',
    status: '가용',
    silhouette: '하이엔드 플로어렝스 A라인',
    fabric: '빈티지 샹티이 자수 레이스, 헤비 튤, 실크 태프터 안감',
    rating: 4.9,
    rentalCount: 11,
    description: '단아한 바디스부터 바닥까지 우아하고 풍성하게 떨어지는 풀 렝스(Full-length) A라인 드레스로, 드레스 전체의 정교한 레이스 패턴과 기품 있는 실루엣이 본식에서 완벽한 존재감을 완성합니다.'
  },
  {
    id: 'DR-020',
    name: '크리스탈 일루전 백리스 볼가운 (Crystal Illusion Ball Gown)',
    designer: 'Elena Blanc Couture (Milan)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2350000,
    deposit: 650000,
    imageUrl: crystalChandelierBallgownImg,
    tag: '퓨어 화이트 / 크리스탈 일루전',
    status: '가용',
    silhouette: '캐시드럴 일루전 볼가운',
    fabric: '오스트리아 프리미엄 크리스탈 비딩, 펄 엠브로이더리, 7단 튤',
    rating: 5.0,
    rentalCount: 14,
    description: '크리스탈 샹들리에의 화려한 빛을 머금은 듯 정교한 비딩과 입체적인 백라인, 웅장한 볼가운 실루엣이 호텔 본식에서 압도적인 존재감을 선사합니다.'
  },
  {
    id: 'DR-021',
    name: '미니멀 보트넥 실크 슬릿 시스 (Minimal Boatneck Silk Sheath)',
    designer: 'Studio Min (New York & Seoul)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Mermaid',
    rentalPrice: 1700000,
    deposit: 450000,
    imageUrl: pureWhiteModelSheathImg,
    tag: '밀크 화이트 / 모던 슬릭',
    status: '가용',
    silhouette: '슬림 시스 머메이드',
    fabric: '100% 실크 조젯, 헤비 실크 크레이프 안감',
    rating: 4.8,
    rentalCount: 16,
    description: '단아한 보트넥 라인과 군더더기 없는 유려한 슬림 핏, 걸을 때마다 드러나는 은은한 슬릿과 트레인이 모던하고 지적인 신부의 세련미를 완성합니다.'
  },
  {
    id: 'DR-022',
    name: '쿠튀르 입체 보우 오프숄더 벨라인 (Couture Sculptural Bow Ball Gown)',
    designer: 'Grace Kim Studio (Seoul)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2150000,
    deposit: 550000,
    imageUrl: coutureBowBackImg,
    tag: '소프트 아이보리 / 3D 보우 백',
    status: '가용',
    silhouette: '로열 벨라인',
    fabric: '이탈리아 실크 오간자, 입체 미카도 보우 리본, 쉬머 튤',
    rating: 5.0,
    rentalCount: 9,
    description: '등 라인을 드라마틱하게 감싸는 조각적인 오간자 리본 보우 트레인과 허리를 잘록하게 잡아주는 코르셋 바디스로 동화 같은 본식을 연출하는 프리미엄 볼가운입니다.'
  },
  {
    id: 'DR-023',
    name: '아틀리에 핸드메이드 보태니컬 엠파이어 (Handmade Botanical Empire)',
    designer: 'Atelier Clara (Provence)',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'Empire',
    rentalPrice: 1600000,
    deposit: 450000,
    imageUrl: handmadeLaceEmpireImg,
    tag: '웜 아이보리 / 채플 엠파이어',
    status: '가용',
    silhouette: '하이웨이스트 엠파이어',
    fabric: '수제 코튼 보태니컬 자수 레이스, 실크 시폰 롱 트레인',
    rating: 4.9,
    rentalCount: 12,
    description: '장인의 손길로 한 땀 한 땀 수놓은 나뭇잎 모티프의 자수와 하이웨이스트 실루엣이 결합되어, 성스럽고 고전적인 채플 웨딩에 어울리는 기품을 자아냅니다.'
  },
  {
    id: 'DR-024',
    name: '로열 헤리티지 다이아몬드 엠브로이더리 (Royal Heritage Diamond)',
    designer: 'Atelier Milano (Milan & Shanghai)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2600000,
    deposit: 700000,
    imageUrl: elyRoyalHeritageBallgownImg,
    tag: '크림 아이보리 / 헤리티지 컬렉션',
    status: '가용',
    silhouette: '헤리티지 볼가운',
    fabric: '영국 황실 헤리티지 다이아몬드 비딩 레이스, 헤비 브로케이드',
    rating: 5.0,
    rentalCount: 6,
    description: '영국 대성당 헤리티지 전시의 찬사를 받은 클래식 로열 가운으로, 정교한 다이아몬드 패턴의 펄 비딩과 웅장한 트레인이 최고의 헤리티지 웨딩을 완성합니다.'
  },
  {
    id: 'DR-025',
    name: '빅토리안 뷔스티에 코르셋 A라인 (Victorian Bustier Corset)',
    designer: 'Maison de Blanc Couture',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1850000,
    deposit: 500000,
    imageUrl: victorianCorsetLaceImg,
    tag: '앤틱 아이보리 / 바스크 코르셋',
    status: '가용',
    silhouette: '클래식 코르셋 A라인',
    fabric: '빈티지 리버 레이스, 실크 태프터, 보닝 코르셋 바디스',
    rating: 4.9,
    rentalCount: 13,
    description: '섬세한 바스크 웨이스트 코르셋과 부드럽게 퍼지는 빈티지 레이스 스커트가 조화를 이루어 앤틱하면서도 귀족적인 실루엣을 자랑하는 오뜨 꾸뛰르 드레스입니다.'
  },
  {
    id: 'DR-026',
    name: '스위트하트 펄 뷔스티에 머메이드 (Sweetheart Pearl Bustier)',
    designer: 'Elena Blanc Couture (Milan)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Mermaid',
    rentalPrice: 1950000,
    deposit: 500000,
    imageUrl: sweetheartPearlBustierImg,
    tag: '스노우 화이트 / 펄 뷔스티에',
    status: '가용',
    silhouette: '피티드 머메이드',
    fabric: '입체 진주 비딩, 스트럭처드 튤, 프렌치 코드 레이스',
    rating: 5.0,
    rentalCount: 15,
    description: '사랑스러운 하트탑 넥라인에 촘촘히 세공된 미세 진주 비즈와 무릎선부터 풍성하게 퍼지는 플레어 튤 라인으로 완벽한 S라인 황금비율을 연출합니다.'
  },
  {
    id: 'DR-027',
    name: '헤리티지 리젠시 실크 엠파이어 (Heritage Regency Silk Empire)',
    designer: 'Studio Min (New York & Seoul)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Empire',
    rentalPrice: 1550000,
    deposit: 400000,
    imageUrl: halterChiffonEmpireImg,
    tag: '소프트 화이트 / 리젠시 엠파이어',
    status: '가용',
    silhouette: '클래식 하이웨이스트 엠파이어',
    fabric: '영국 헤리티지 실크 오간자, 플로럴 자수 보더, 퓨어 실크 시폰',
    rating: 4.8,
    rentalCount: 8,
    description: '가슴 바로 아래에서 부드럽게 떨어지는 리젠시 시대의 정통 하이웨이스트 엠파이어 라인으로, 단아하면서도 순수한 여신 분위기를 연출하는 하이엔드 드레스입니다.'
  },
  {
    id: 'DR-028',
    name: '파리 런웨이 오뜨 꾸뛰르 퓨전 (Paris Runway Haute Couture)',
    designer: 'Kall Atelier Haute Couture',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Traditional Fusion',
    rentalPrice: 2700000,
    deposit: 750000,
    imageUrl: runwayHauteCoutureFusionImg,
    tag: '루미너스 화이트 / 런웨이 스페셜',
    status: '가용',
    silhouette: '아방가르드 퓨전 머메이드',
    fabric: '파리 꾸뛰르 3D 플리츠 오간자, 메탈릭 실버 자수, 실크 미카도',
    rating: 5.0,
    rentalCount: 4,
    description: '파리 패션위크 런웨이를 빛낸 아방가르드 조형미와 동서양의 선의 미학이 융합된 최고 등급 마스터피스로, 독보적인 예술성과 카리스마를 선사합니다.'
  },
  {
    id: 'DR-029',
    name: '다이애나 로열 세인트 폴 캐시드럴 볼가운 (Diana Royal Cathedral Ball Gown)',
    designer: 'Kevin Thornhill Royal Archive (UK & Seoul)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown',
    rentalPrice: 2800000,
    deposit: 800000,
    imageUrl: dianaRoyalCathedralImg,
    tag: '2026 로열 에디션 / 세기의 웨딩',
    status: '가용',
    silhouette: '임페리얼 캐시드럴 볼가운',
    fabric: '아이보리 실크 태프터, 앤틱 레이스 프릴, 10,000개 진주 비딩, 25피트 롱 트레인',
    rating: 5.0,
    rentalCount: 5,
    description: '세기의 로열 웨딩을 오마주한 최고급 헤리티지 가운으로, 풍성하고 웅장한 볼륨감의 퍼프 슬리브와 수작업 앤틱 레이스 프릴 네크라인, 압도적인 캐시드럴 트레인이 일생 단 한 번의 찬란한 순간을 선사합니다.'
  },
  {
    id: 'DR-030',
    name: '미드센추리 1950s 오드리 클래식 레이스 (Mid-Century 1950s Audrey Classic)',
    designer: 'Atelier Clara & Durham Archive',
    workshop: '쑤저우 웨딩공방 (Suzhou Craft)',
    category: 'A-Line',
    rentalPrice: 1650000,
    deposit: 450000,
    imageUrl: audreyClassic1950sImg,
    tag: '클래식 빈티지 / 1950s 아카이브',
    status: '가용',
    silhouette: '미드센추리 클래식 A라인',
    fabric: '빈티지 브로케이드 실크 새틴, 노팅엄 플로럴 레이스 볼레로, 크리놀린 튤',
    rating: 4.9,
    rentalCount: 9,
    description: '1950년대 황금기 오드리 헵번 룩을 재현한 미드센추리 클래식 가운으로, 섬세한 레이스 볼레로 일루전과 잘록한 허리라인에서 우아하게 퍼지는 티어드 크리놀린 풀 스커트가 단아하고 클래식한 품격을 자아냅니다.'
  },
  {
    id: 'DR-031',
    name: '에드워디안 1903 하이넥 헤리티지 실크 (Edwardian 1903 High-Neck Silk Heritage)',
    designer: 'Burwell Heritage Studio (UK & Seoul)',
    workshop: '광저우 정밀공방 (Guangzhou)',
    category: 'Empire',
    rentalPrice: 1750000,
    deposit: 450000,
    imageUrl: edwardianSilkHeritageImg,
    tag: '뮤지엄 헤리티지 / 에드워디안 실크',
    status: '가용',
    silhouette: '에드워디안 하이넥 엠파이어',
    fabric: '100년 헤리티지 실크 크레이프 드 신, 수제 바텐버그 레이스, 비숍 슬리브',
    rating: 5.0,
    rentalCount: 6,
    description: '1903년 에드워디안 시대의 기품을 고스란히 담아낸 최고급 실크 가운으로, 고귀한 하이넥 칼라와 섬세한 바텐버그 레이스 턱시도 주름, 우아하게 흐르는 실크 크레이프 실루엣이 성스러운 대성당 예식에 특별한 아우라를 부여합니다.'
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
