import { ScreenSpec, ProcessStep } from '../types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'U1',
    name: '상품 정보 등록 및 포털 추천',
    actor: '공급상',
    systemModule: 'BIS',
    description: '공급상별로 글로벌 드레스 및 웨딩 상품 정보(가격, 규격, 이미지, 재고)를 등록하고 포털에 추천합니다.',
    relatedPrograms: ['상품정보등록', '거래처정보등록'],
    inputData: ['상품명', '카테고리', '원가/공급가', '소재/규격', '고해상도 이미지/영상'],
    outputData: ['상품 마스터 코드', '심사 대기 상태값']
  },
  {
    id: 'U2',
    name: '상품 심사 및 포털 개시',
    actor: '운영상',
    systemModule: 'PMS',
    description: '운영자가 공급상의 등록 상품을 심사하고 승인하여 B2B 포털 및 글로벌 카탈로그에 공식 개시합니다.',
    relatedPrograms: ['상품분류등록', '상품심사등록', '배분정산등록'],
    inputData: ['심사 대기 상품 목록', '품질 검증서', '디자이너 IP 인증'],
    outputData: ['심사 승인/반려', '포털 전시 개시 일자', '로열티 요율(3%)']
  },
  {
    id: 'U3',
    name: '상품 선정 및 마이샵 추가',
    actor: '판매상',
    systemModule: 'SMS',
    description: '대리점/판매상이 B2B 포털에서 원하는 상품을 셀렉트하여 자사 마이샵 및 오프라인 쇼룸 진열 목록에 추가합니다.',
    relatedPrograms: ['상품선정등록', '상품정보개시'],
    inputData: ['포털 개시 상품 카탈로그', '지역별 예상 수요'],
    outputData: ['마이샵 등록 리스트', '선정 상태값']
  },
  {
    id: 'U4',
    name: '발주 등록',
    actor: '판매상',
    systemModule: 'SCM',
    description: '선정한 상품에 대해 공급처에 발주를 등록합니다 (무가맹비/경자산 모델 지원).',
    relatedPrograms: ['발주등록', '입고검사등록'],
    inputData: ['선정 상품 코드', '발주 수량/사이즈', '희망 납기일'],
    outputData: ['발주서(PO) 번호', '발주 접수 대기']
  },
  {
    id: 'U5',
    name: '수주 등록',
    actor: '공급상',
    systemModule: 'SCM',
    description: '대리점의 발주 정보를 참조하여 수주를 확정하고 공급망 생산/출하 계획에 반영합니다.',
    relatedPrograms: ['수주등록', '출하지시등록'],
    inputData: ['발주서 내역', '생산공방 재고 현황'],
    outputData: ['수주 확정서', '생산/출하 일정 번호']
  },
  {
    id: 'U6',
    name: '출고 등록',
    actor: '공급상',
    systemModule: 'SCM',
    description: '수주 정보를 기반으로 글로벌 물류센터에서 대리점으로 상품을 포장 및 출고 등록합니다.',
    relatedPrograms: ['출고등록', '출하지시등록'],
    inputData: ['수주 번호', '검품 확인서', '송장 번호'],
    outputData: ['출고 전표', '배송 추적 상태']
  },
  {
    id: 'U7',
    name: '입고 등록',
    actor: '판매상',
    systemModule: 'SCM',
    description: '출고 정보를 참조하여 오프라인 매장/쇼룸 창고에 실물 상품을 검수 후 입고 등록합니다.',
    relatedPrograms: ['입고검사등록', '입고등록'],
    inputData: ['출고 송장', '실물 수량 및 컨디션 체크'],
    outputData: ['입고 전표', '매장 진열 가능 재고']
  },
  {
    id: 'U8',
    name: '매입 및 매출 등록',
    actor: '판매상',
    systemModule: 'SCM',
    description: '입고 완료된 상품에 대해 대리점은 매입을 등록하고, 공급상은 매출을 동시 확정합니다.',
    relatedPrograms: ['매입등록', '매출등록'],
    inputData: ['입고 확정 전표', '세금계산서/인보이스'],
    outputData: ['매입 전표', '매출 확정 데이터']
  },
  {
    id: 'U10',
    name: '플래너 상품 홍보 (SNS/모멘트)',
    actor: '판매자',
    systemModule: 'B2C',
    description: '플래너가 모바일 워크스페이스에서 위챗 모멘트, 샤오홍슈, 틱톡용 홍보 링크 및 카탈로그를 발행하여 고객을 유치합니다.',
    relatedPrograms: ['상품정보홍보', '플래너실적현황'],
    inputData: ['마이샵 추천 상품', '플래너 전용 추천 코드'],
    outputData: ['맞춤 홍보 카드/링크', 'SNS 공유 로그']
  },
  {
    id: 'U11',
    name: '소비자 예약 및 본식 정보 등록',
    actor: '소비자',
    systemModule: 'B2C',
    description: '소비자가 온라인에서 드레스를 탐색하고 샵 방문 피팅 예약 및 본식 일정/장소 정보를 등록합니다.',
    relatedPrograms: ['상품예약정보', '본식행사정보', '샵방문예약등록'],
    inputData: ['희망 피팅 일시', '오프라인 샵 지점', '본식 일자 및 예식장 위치'],
    outputData: ['예약 번호', '피팅 스케줄 확정']
  },
  {
    id: 'U12',
    name: '샵 인원(피팅 매니저) 배정',
    actor: '판매상',
    systemModule: 'OSM',
    description: '접수된 고객 예약 정보를 확인하고 매장 내 전담 피팅 매니저를 배정합니다.',
    relatedPrograms: ['인원배정정보', '예약정보확인'],
    inputData: ['방문 예약 목록', '매장 직원 근무 스케줄'],
    outputData: ['피팅 룸 및 전담 담당자 배정표']
  },
  {
    id: 'U13',
    name: '상품 체험 및 대여 등록',
    actor: '판매상',
    systemModule: 'OSM',
    description: '고객의 매장 피팅 후 최종 선택된 드레스에 대해 정식 대여 계약을 체결하고 시스템에 등록합니다.',
    relatedPrograms: ['상품체험등록', '상품대여등록', '상품대여비용등록'],
    inputData: ['피팅 메모', '고객 체형 치수', '대여 패키지 옵션'],
    outputData: ['대여 계약서', '대여료 및 보증금 결제 정보']
  },
  {
    id: 'U14',
    name: '대여 출고 및 헬퍼(이모) 매칭',
    actor: '판매상',
    systemModule: 'OSM',
    description: '본식 일정에 맞춰 드레스 컨디션을 최종 점검하고 동행할 헬퍼(이모)를 지정하여 대여 출고를 등록합니다.',
    relatedPrograms: ['대여출고등록', '이모배정정보'],
    inputData: ['본식 일시/장소', '출고 드레스 바코드', '지정 헬퍼 연락처'],
    outputData: ['대여 출고증', '헬퍼 현장 케어 체크리스트']
  },
  {
    id: 'U15',
    name: '본식 종료 및 대여 입고',
    actor: '판매상',
    systemModule: 'OSM',
    description: '본식 행사가 완료된 후 헬퍼(이모)가 드레스를 샵으로 회수하고, 오염 및 훼손 상태 검수 후 대여 입고를 등록합니다.',
    relatedPrograms: ['대여입고등록', '회수출고등록'],
    inputData: ['회수 드레스 실물', '훼손 여부 체크리스트', '헬퍼 업무 완료 서명'],
    outputData: ['입고 검수 보고서', '보증금 환급 승인']
  },
  {
    id: 'U16',
    name: '배분 정산 및 마감 등록',
    actor: '운영상',
    systemModule: 'PMS',
    description: '행사가 최종 마감되면 대여 매출을 공급상, 대리점, 플래너(수수료), 헬퍼(용역비), 디자이너(3%), 공방(3%), 건물주(20%)로 자동 배분 정산합니다.',
    relatedPrograms: ['배분정산등록', '임대마감등록', '플래너입금현황'],
    inputData: ['대여 최종 완료 데이터', '정산 요율 규칙표', '공간 귀속 정보'],
    outputData: ['파트너별 정산 지급 명세서', '자동 정산 회계 전표']
  }
];

export const SCREEN_SPECS: ScreenSpec[] = [
  // ==========================================
  // 1. [B2C] 소비자 포털 (글로벌 온라인 웨딩 플랫폼)
  // ==========================================
  {
    id: 'SCR-B2C-001',
    title: 'B2C 메인 포털 & 브랜드 쇼케이스',
    portal: 'B2C',
    portalName: '소비자 포털',
    role: '예비 신랑/신부, 일반 고객',
    path: '/b2c',
    summary: '전 세계 프리미엄 웨딩 드레스, 인기 디자이너 컬렉션, 3D/VR 쇼룸 및 전국 오프라인 피팅샵 예약을 연결하는 메인 관문 화면',
    gapType: 'CBO',
    processCodes: ['U10', 'U11'],
    systemModule: 'B2C',
    keyFeatures: [
      '글로벌 디자이너 신작 드레스 큐레이션 및 하이라이트 영상 배너',
      '지역별(중국 상하이, 항저우 왕차오 센터, 한국 청담 등) 오프라인 체험 샵 빠른 찾기',
      '플래너 매칭 및 1:1 맞춤 웨딩 컨시어지 챗봇 연계',
      '인기 토털 웨딩 패키지 (드레스 + 스튜디오 + 메이크업 + 웨딩홀 + 여행) 원클릭 둘러보기'
    ],
    uiComponents: [
      { name: '글로벌 네비게이션 (GNB)', type: 'Header', description: '다국어(KR/CN/EN), 통화(KRW/CNY/USD), 브랜드/컬렉션/오프라인샵/마이웨딩 바로가기' },
      { name: '히어로 비주얼 배너', type: 'CardGrid', description: '최신 오뜨꾸뛰르 디자이너 드레스 및 시즌 프로모션 캐러셀' },
      { name: '스마트 퀵 검색 바', type: 'FilterBar', description: '지역 선택, 본식 예정일, 스타일(A라인/머메이드/벨라인) 다이렉트 검색' },
      { name: 'O2O 피팅 쇼룸 맵 바로가기', type: 'CardGrid', description: '항저우 왕차오 센터 등 프리미엄 랜드마크 샵 소개 및 예약 CTA' }
    ],
    dataItems: {
      inputs: ['검색 키워드', '지역 필터', '예식 예정월'],
      outputs: ['추천 드레스 리스트', '인근 오프라인 샵 위치', '이벤트 프로모션']
    },
    layoutDescription: '상단 네비게이션 바 → 히어로 비주얼 슬라이더 → 퀵 검색 엔진 → 디자이너 컬렉션 쇼케이스 → O2O 오프라인 매장 안내 → 이용자 후기 & FAQ',
    wireframeData: {
      badge: 'B2C 메인 포털',
      sectionTitle: 'TOBMALL Global Wedding & Showroom',
      stats: [
        { label: '입점 디자이너 브랜드', value: '180+', sub: '글로벌 명품 라인' },
        { label: '보유 드레스 수량', value: '10,000+', sub: '실시간 피팅 가능' },
        { label: '오프라인 쇼룸 거점', value: '35개소', sub: '항저우 왕차오 센터 외' }
      ],
      sections: [
        {
          type: 'hero',
          title: '세상에서 가장 찬란한 순간, 글로벌 명품 드레스를 직접 경험하세요',
          description: '한국의 트렌디한 디자인과 글로벌 생산 네트워크가 만난 신개념 S2B2C 웨딩 플랫폼',
          items: ['2026 뉴 컬렉션 런칭', '피팅 예약 시 무료 스타일링 상담', '샤오홍슈·위챗 인증 후기 15,000건 돌파']
        },
        {
          type: 'grid',
          title: '인기 디자이너 드레스 컬렉션',
          items: [
            { name: 'Grace Royal Lace A-Line', designer: 'Atelier de Seoul', tag: '신작', rating: '4.9 (84)' },
            { name: 'Sparkle Mermaid Silk Dress', designer: 'Maison Blanc Paris', tag: '인기', rating: '5.0 (120)' },
            { name: 'Pure Romantic Off-Shoulder', designer: 'K-Bride Studio', tag: '피팅추천', rating: '4.8 (62)' },
            { name: 'Grand Ballroom Crystal Gown', designer: 'Wangchao Atelier', tag: '하이엔드', rating: '4.9 (95)' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-B2C-002',
    title: '글로벌 드레스 갤러리 & 스마트 필터',
    portal: 'B2C',
    portalName: '소비자 포털',
    role: '소비자, 플래너',
    path: '/b2c/dresses',
    summary: '실시간 가용 재고 기반으로 디자이너, 실루엣, 넥라인, 대여 가격대, 본식 계절별 상세 다차원 필터링 및 고화질 룩북 뷰어',
    gapType: 'CBO',
    processCodes: ['U3', 'U10'],
    systemModule: 'B2C',
    keyFeatures: [
      '다차원 필터: 실루엣(머메이드, A라인, 프린세스), 넥라인(스위트하트, 오프숄더, 하이넥), 소재(실크, 레이스, 튤)',
      '대여 가능 여부 실시간 배지 (즉시 피팅 가능 / 예약 대기)',
      '디자이너 브랜드 스토리 및 고해상도 360도 회전 룩북',
      '관심 드레스 위시리스트 담기 및 플래너 상담 카트에 추가'
    ],
    uiComponents: [
      { name: '다차원 패싯 필터 바', type: 'FilterBar', description: '체형별, 스타일별, 예산대별, 지역별 즉각 필터링' },
      { name: '드레스 카드 갤러리 그리드', type: 'CardGrid', description: '이미지 호버 시 모델 착장 영상 및 피팅 매장 태그 노출' },
      { name: '비교하기 플로팅 독', type: 'ActionToolbar', description: '선택한 최대 4벌의 드레스 실루엣, 가격, 디자이너 비교' }
    ],
    dataItems: {
      inputs: ['스타일 필터', '디자이너 선택', '대여 가격 범위'],
      outputs: ['필터링된 상품 목록', '매장별 시착 가능 수량']
    },
    layoutDescription: '좌측 고정 필터 패널 (카테고리/소재/사이즈) + 우측 정렬/보기 옵션 툴바 + 3~4열 반응형 카드 그리드 + 하단 무한 스크롤 / 페이지네이션',
    wireframeData: {
      badge: '상품 탐색 및 룩북',
      sectionTitle: 'Dress Collection & Smart Filter',
      sections: [
        {
          type: 'grid',
          title: '검색 결과 (총 428개 드레스)',
          items: [
            { name: 'K-Elegance V-Neck Silk', category: '머메이드 / 미카도실크', price: '대여: ¥8,800', shop: '상하이 플래그십' },
            { name: 'Crown Floral Embroidery Ballgown', category: '벨라인 / 비즈', price: '대여: ¥12,000', shop: '항저우 왕차오 센터' },
            { name: 'Modern Minimalist Crepe Gown', category: '슬림 A라인 / 크레이프', price: '대여: ¥7,500', shop: '베이징 강남센터' },
            { name: 'Fairy Illusion Sleeve Dress', category: '엠파이어 / 튤', price: '대여: ¥9,200', shop: '선전 난산센터' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-B2C-003',
    title: '오프라인 샵 방문 예약 및 본식 장소 등록',
    portal: 'B2C',
    portalName: '소비자 포털',
    role: '소비자, 플래너 대리 예약',
    path: '/b2c/reservation',
    summary: '소비자가 인근 대리점 샵을 선택하여 피팅 일시를 예약하고 본식 날짜 및 예식 장소 정보를 동시에 등록하는 핵심 O2O 입력 화면 (문서 7p U4 프로세스 연계)',
    gapType: 'CBO',
    processCodes: ['U4', 'U11'],
    systemModule: 'B2C',
    keyFeatures: [
      '원하는 오프라인 샵 지점 선택 (지도 연계 및 룸별 스케줄 실시간 연동)',
      '희망 피팅 일시 선택 (1타임 90분, 프라이빗 피팅룸)',
      '시착 희망 드레스 최대 3~5벌 사전 지정',
      '본식 필수 정보 입력 (본식 일자, 예식장 이름 및 도시, 예상 하객 수, 테마)',
      '담당 플래너 추천 코드 입력 시 할인 혜택 및 실적 연동'
    ],
    uiComponents: [
      { name: '지점 및 피팅룸 선택기', type: 'Form', description: '지역별 샵 목록 및 룸 상태 캘린더' },
      { name: '본식 정보 입력 폼', type: 'Form', description: '예식일시, 예식홀 주소, 스타일 선호도' },
      { name: '시착 바구니 모달', type: 'Modal', description: '관심 드레스 목록에서 시착 희망 목록 확정' },
      { name: '예약 확인 및 안내 알림톡 전송 버튼', type: 'ActionToolbar', description: '예약 즉시 카카오톡/위챗 확인서 발행' }
    ],
    dataItems: {
      inputs: ['예약자명', '연락처', '지점', '방문일시', '본식일자', '예식장 주소', '플래너 코드'],
      outputs: ['예약 확정 번호', '피팅룸 배정 대기 상태', '예약 리포트']
    },
    layoutDescription: '3단계 스텝 위저드: STEP 1. 오프라인 샵 및 피팅룸 일시 선택 → STEP 2. 본식 정보 및 시착 희망 드레스 지정 → STEP 3. 예약자 정보 확인 및 완료',
    wireframeData: {
      badge: 'O2O 피팅 예약 (U4/U11)',
      sectionTitle: 'Shop Visit & Wedding Details Reservation',
      sections: [
        {
          type: 'form',
          title: 'STEP 1 ~ STEP 3 통합 예약 신청',
          items: [
            { label: '방문 희망 지점', value: '항저우 왕차오 센터점 (2F 프리미엄 쇼룸)' },
            { label: '피팅 방문 일시', value: '2026-06-15 (토) 14:00 (Room 302)' },
            { label: '본식 일자 / 장소', value: '2026-10-18 (일) 12:30 / 쉐라톤 그랜드 볼룸' },
            { label: '시착 요청 드레스', value: 'Crown Floral Ballgown (M size), Sparkle Mermaid (S size)' },
            { label: '연계 플래너', value: '플래너 김혜원 (코드: PLN-8821)' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-B2C-004',
    title: '마이웨딩 (예약현황 및 대여계약 관리)',
    portal: 'B2C',
    portalName: '소비자 포털',
    role: '로그인 소비자',
    path: '/b2c/my-wedding',
    summary: '방문 피팅 예약 내역, 담당 매니저/이모 배정 상태, 대여 확정 전자계약서 확인 및 결제 내역 조회 (문서 7p U8 프로세스 연계)',
    gapType: 'CBO',
    processCodes: ['U8', 'U11', 'U13'],
    systemModule: 'B2C',
    keyFeatures: [
      '피팅 예약 D-Day 카운트다운 및 길찾기 안내',
      '피팅 후기 및 현장 착장 사진 앨범 (비공개 보관)',
      '최종 대여 계약서 확인 (드레스 상태 점검표, 대여기간, 보증금 정책)',
      '온라인 결제(대여비, 피팅비, 보증금) 영수증 및 환급 현황'
    ],
    uiComponents: [
      { name: '웨딩 타임라인 트래커', type: 'Timeline', description: '예약 → 피팅체험 → 대여계약 → 출고(이모동행) → 본식 → 반납' },
      { name: '계약 상세 카드', type: 'CardGrid', description: '드레스 품목, 부속 악세사리, 케어 헬퍼(이모) 정보' },
      { name: '결제 및 영수증 뷰어', type: 'Table', description: '위챗페이/알리페이/신용카드 결제 내역' }
    ],
    dataItems: {
      inputs: ['고객 인증 토큰', '계약 동의 서명'],
      outputs: ['진행 단계 상태', '전자 계약서 PDF', '지정 헬퍼 연락처']
    },
    layoutDescription: '상단 D-Day 대시보드 → 진행 상태 타임라인 바 → 예약/피팅/대여 내역 탭 → 결제 및 전자서명 섹션',
    wireframeData: {
      badge: '마이페이지',
      sectionTitle: 'My Wedding Journey & Rental Contract',
      sections: [
        {
          type: 'steps',
          title: '본식 진행 타임라인 (D-42)',
          items: [
            { step: '01. 예약완료', date: '05-22', status: '완료' },
            { step: '02. 피팅체험', date: '06-15', status: '완료' },
            { step: '03. 대여계약/결제', date: '06-16', status: '완료' },
            { step: '04. 이모배정/출고', date: '10-17', status: '진행예정' },
            { step: '05. 본식진행', date: '10-18', status: '대기' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // 2. [PLANNER] 플래너 & 헬퍼(이모) 포털
  // ==========================================
  {
    id: 'SCR-PLN-001',
    title: '플래너 & 이모 정보 등록 및 심사 신청',
    portal: 'PLANNER',
    portalName: '플래너 & 헬퍼 포털',
    role: '웨딩 플래너, 드레스 피팅 헬퍼(이모)',
    path: '/planner/register',
    summary: 'B2B 포털에서 지역 정보를 선정하고 플래너 또는 헬퍼(이모) 프로필과 경력 정보를 등록하여 본사 심사를 요청하는 화면 (문서 7p U1 프로세스 연계)',
    gapType: 'CBO',
    processCodes: ['U1', 'U2'],
    systemModule: 'B2C',
    keyFeatures: [
      '구분 선택: 전문 웨딩 플래너 vs 드레스 전문 헬퍼(이모)',
      '활동 희망 지역(화동, 화남, 화북 등 대리점 관할) 선택',
      '경력 증빙 서류 및 자격 인증서 업로드 (교육이수증 등)',
      '수익금 정산용 은행 계좌 및 위챗/알리페이 수취 정보 등록'
    ],
    uiComponents: [
      { name: '회원 유형 토글', type: 'Form', description: '플래너 / 헬퍼(이모) 전환 스위치' },
      { name: '활동 지역 및 프로필 입력 폼', type: 'Form', description: '거점 도시, 경력, 전문 분야 입력' },
      { name: '자격 증빙 서류 업로더', type: 'Form', description: '드래그앤드롭 파일 첨부' },
      { name: '심사 신청 버튼', type: 'ActionToolbar', description: '제출 시 PMS 심사 대기열로 자동 전송' }
    ],
    dataItems: {
      inputs: ['이름/연락처', '자격증', '지역', '정산 계좌'],
      outputs: ['등록 접수 번호', '심사 상태값(접수/심사중/승인)']
    },
    layoutDescription: '중앙 집중형 신청 폼 + 서류 첨부 영역 + 약관 동의 및 개인정보 처리 방침',
    wireframeData: {
      badge: '파트너 등록 (U1)',
      sectionTitle: 'Planner & Helper Registration',
      sections: [
        {
          type: 'form',
          title: '신청 정보 기재',
          items: [
            { label: '파트너 유형', value: '전문 웨딩 플래너 (인플루언서 연계)' },
            { label: '거점 활동 권역', value: '화동 지역 - 저장성 항저우 (왕차오 센터 관할)' },
            { label: 'SNS 채널 정보', value: '위챗 모멘트 (친구 4,200명), 샤오홍슈 (@wedding_lucy)' },
            { label: '정산용 계좌', value: '공상은행 6222-****-****-9102 (예금주: 김플래너)' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PLN-002',
    title: '플래너 마이샵 & 소셜 홍보 센터 (위챗/샤오홍슈)',
    portal: 'PLANNER',
    portalName: '플래너 & 헬퍼 포털',
    role: '승인된 웨딩 플래너',
    path: '/planner/myshop',
    summary: 'B2B 포털에서 선정한 드레스 및 웨딩 패키지를 자신의 마이샵에 담고, 위챗 모멘트/샤오홍슈/틱톡 라이브용 전용 링크 및 홍보 카드를 생성하는 화면 (문서 7p U3, 5p U10 연계)',
    gapType: 'CBO',
    processCodes: ['U3', 'U10'],
    systemModule: 'B2C',
    keyFeatures: [
      '마이샵 추천 상품 카탈로그 커스텀 구성',
      '위챗 모멘트용 원클릭 홍보 포스터(QR코드 내장) 자동 생성',
      '샤오홍슈 & 틱톡 라이브 방송용 상품 소개 스크립트 및 딥링크 생성',
      '홍보 링크 클릭수, 예약 전환율, 유입 고객 실시간 트래킹'
    ],
    uiComponents: [
      { name: '마이샵 상품 진열대', type: 'CardGrid', description: '선택한 12개 드레스 및 패키지' },
      { name: 'SNS 마케팅 툴킷', type: 'ActionToolbar', description: '위챗 모멘트 카드 다운로드, 샤오홍슈 숏폼 링크 복사' },
      { name: '유입 성과 요약 위젯', type: 'Chart', description: '주간 링크 클릭수, 피팅 방문 예약 전환 건수' }
    ],
    dataItems: {
      inputs: ['홍보 대상 상품 선택', '할인 쿠폰 태그 지정'],
      outputs: ['전용 단축 URL', '맞춤형 QR 코드 이미지', '유입 성과 통계']
    },
    layoutDescription: '상단 성과 지표 요약 → 좌측 마이샵 큐레이션 관리 → 우측 소셜 채널별 원클릭 홍보 배너/QR 생성기',
    wireframeData: {
      badge: 'SNS 상품 홍보 (U10)',
      sectionTitle: 'Planner MyShop & Viral Marketing Hub',
      stats: [
        { label: '이번 달 홍보 노출', value: '48,290회', sub: '+24% 전월대비' },
        { label: '피팅 예약 전환', value: '38건', sub: '전환율 4.8%' },
        { label: '예상 수수료 수익', value: '¥28,500', sub: '대여 성사 시 정산' }
      ],
      sections: [
        {
          type: 'grid',
          title: '내 마이샵 큐레이션 상품 (총 8개)',
          items: [
            { name: 'Wangchao Exclusive Ballgown', views: '2,480회', clicks: '312회', cta: '위챗 카드 생성' },
            { name: 'Romantic French Lace Mermaid', views: '1,920회', clicks: '240회', cta: '샤오홍슈 링크' },
            { name: 'K-Star Tailored Tuxedo Set', views: '890회', clicks: '110회', cta: '홍보 배너 다운' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PLN-003',
    title: '헬퍼(이모) 본식 스케줄 & 현장 케어 체크리스트',
    portal: 'PLANNER',
    portalName: '플래너 & 헬퍼 포털',
    role: '드레스 헬퍼(이모), 샵 관리자',
    path: '/planner/helper-schedule',
    summary: '본식 일정에 맞춰 배정된 이모가 출고된 드레스를 수령하고, 예식 현장에서 드레스 피팅 케어를 진행한 후 회수 및 반납을 완료하는 모바일 전용 화면 (문서 7p U9, U10 연계)',
    gapType: 'CBO',
    processCodes: ['U9', 'U10', 'U14', 'U15'],
    systemModule: 'OSM',
    keyFeatures: [
      '배정된 본식 행사 정보 확인 (신부명, 예식홀 주소, 시작 시간, 긴급 연락처)',
      '출고 드레스 바코드 스캔 및 훼손 여부 사전 체크리스트',
      '본식 진행 단계별 체크인 (샵 픽업 → 예식장 도착 → 1부/2부 환복 → 행사 종료)',
      '반납 드레스 입고 사진 업로드 및 현장 수령증 전자 서명'
    ],
    uiComponents: [
      { name: '오늘의 행사 카드', type: 'CardGrid', description: '예식 시간, 신부 연락처, 이동 경로 안내' },
      { name: '드레스 컨디션 체크 시트', type: 'Form', description: '오염, 비즈 탈락, 지퍼 상태 체크박스' },
      { name: '단계별 체크인 버튼', type: 'ActionToolbar', description: '현장 도착, 식 완료, 샵 입고 완료 원터치 기록' }
    ],
    dataItems: {
      inputs: ['바코드 확인', '점검 체크포인트', '현장 사진 3장'],
      outputs: ['행사 진행 타임스탬프', '대여 입고 승인 요청']
    },
    layoutDescription: '모바일 뷰 친화적 원컬럼 카드 레이아웃 + 대형 터치 체크인 버튼 + 사진 업로드 섹션',
    wireframeData: {
      badge: '현장 케어 (U9/U10)',
      sectionTitle: 'Helper On-Site Care & Return Check',
      sections: [
        {
          type: 'detail',
          title: '2026-06-20 (토) 12:30 본식 배정 내역',
          items: [
            { label: '신부 / 신랑', value: '이수민 신부 / 박준형 신랑' },
            { label: '예식 장소', value: '항저우 그랜드 하얏트 3F 그랜드볼룸' },
            { label: '대여 드레스', value: 'Grace Royal Lace A-Line (TAG: #DR-8801)' },
            { label: '출고 상태', value: '매장 출고 확인 완료 (2026-06-20 09:00)' },
            { label: '현재 단계', value: '예식장 도착 및 신부 대기실 피팅 케어 중' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PLN-004',
    title: '플래너 & 이모 수수료 정산 및 입금 관리',
    portal: 'PLANNER',
    portalName: '플래너 & 헬퍼 포털',
    role: '플래너, 헬퍼(이모)',
    path: '/planner/settlement',
    summary: '대여 및 본식 행사가 마감된 오더에 대해 플랫폼에서 자동 배분 정산된 판매수익, 소개 수수료, 헬퍼 용역비 입금 내역을 확인하는 화면 (문서 7p U11, 5p U16 연계)',
    gapType: 'CBO',
    processCodes: ['U11', 'U16'],
    systemModule: 'PMS',
    keyFeatures: [
      '월별/건별 정산 총액, 지급 완료액, 지급 대기액 요약',
      '행사별 정산 상세 내역 (대여금액, 정산 요율, 원천징수세액, 실 수령액)',
      '세금계산서 및 전자 지급 명세서 다운로드',
      '출금 신청 및 등록 계좌 변경 관리'
    ],
    uiComponents: [
      { name: '수익 요약 KPI 카드', type: 'CardGrid', description: '누적 정산액, 이번 달 정산 예정액' },
      { name: '정산 내역 테이블', type: 'Table', description: '행사일, 고객명, 드레스명, 수수료, 입금상태' },
      { name: '즉시 출금 요청 모달', type: 'Modal', description: '최소 1,000위안 이상 실시간 이체 신청' }
    ],
    dataItems: {
      inputs: ['조회 기간', '정산 상태 필터'],
      outputs: ['정산 명세표', '입금 확인증 PDF']
    },
    layoutDescription: '상단 수수료 요약 카드 → 월별 정산 추이 차트 → 행사별 세부 정산 테이블 → 계좌 정보 관리',
    wireframeData: {
      badge: '수익 정산 (U16)',
      sectionTitle: 'Planner & Helper Payout Management',
      stats: [
        { label: '이번 달 정산 확정액', value: '¥34,200', sub: '18건 행사 마감' },
        { label: '정산 대기액', value: '¥8,400', sub: '행사 검수 진행중' },
        { label: '올해 누적 수익금', value: '¥182,500', sub: '성공률 99.1%' }
      ],
      sections: [
        {
          type: 'table',
          title: '최근 배분 정산 완료 내역',
          items: [
            { id: 'SET-9901', date: '06-18', client: '장미영 고객', item: 'Sparkle Mermaid', role: '플래너 수수료', amount: '¥1,800', status: '입금완료' },
            { id: 'SET-9902', date: '06-17', client: '왕웨이 고객', item: 'Wangchao Ballgown', role: '헬퍼 동행비', amount: '¥1,200', status: '입금완료' },
            { id: 'SET-9903', date: '06-16', client: '한지은 고객', item: 'K-Romantic Dress', role: '플래너 수수료', amount: '¥2,100', status: '입금완료' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // 3. [OSM] 판매상 / 대리점 오프라인 샵 관리 시스템
  // ==========================================
  {
    id: 'SCR-OSM-001',
    title: 'OSM 샵 종합 운영 대시보드',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '오프라인 샵 매니저, 대리점 점주',
    path: '/osm/dashboard',
    summary: '오늘의 예약 피팅 현황, 드레스 시착 룸 가동률, 대여 출고 및 반납 일정, 매장 보유 재고를 한눈에 파악하는 통합 관제 대시보드 (문서 4p OSM, 7p 연계)',
    gapType: 'CBO',
    processCodes: ['U11', 'U12', 'U14', 'U15'],
    systemModule: 'OSM',
    keyFeatures: [
      '일일 피팅 스케줄 타임테이블 (룸별 예약자, 담당 직원 매칭)',
      '출고 예정 드레스(본식 D-1) 및 반납 대기 드레스 실시간 카운트',
      '샵 전속 피팅 직원 및 헬퍼(이모) 가용 풀 현황',
      '월간 매장 대여 매출 및 배분 수익 지표'
    ],
    uiComponents: [
      { name: '샵 운영 KPI 카드', type: 'CardGrid', description: '오늘 피팅 12건, 본식 출고 6건, 반납 대기 5건' },
      { name: '타임라인 스케줄러', type: 'Timeline', description: '10:00 ~ 19:00 피팅룸 1~4번 실시간 점유율' },
      { name: '출고/회수 긴급 알림 바', type: 'BadgeGroup', description: '지연 반납, 긴급 수선 필요 품목 하이라이트' }
    ],
    dataItems: {
      inputs: ['매장 지점 코드', '날짜 선택'],
      outputs: ['예약 현황', '피팅룸 스케줄', '직원 배정 상태']
    },
    layoutDescription: '상단 샵 핵심 지표 카드 4종 → 좌측 룸별 예약 타임테이블 → 우측 출고/입고 현황 리스트 및 직원 현황',
    wireframeData: {
      badge: 'OSM 관제 대시보드',
      sectionTitle: 'Off-line Shop Management Dashboard',
      stats: [
        { label: '오늘 피팅 예약', value: '14건', sub: '피팅룸 100% 가동' },
        { label: '본식 드레스 출고', value: '6벌', sub: '헬퍼 매칭 완료' },
        { label: '회수 입고 검수', value: '4벌', sub: '2벌 검수 대기' },
        { label: '이번 달 매장 매출', value: '¥148,000', sub: '목표 대비 112%' }
      ],
      sections: [
        {
          type: 'grid',
          title: '실시간 피팅룸 예약 현황 (항저우 왕차오 2F)',
          items: [
            { room: 'VIP Suite 1', time: '14:00 - 15:30', client: '유진 신부', staff: '박소현 실장', status: '진행중' },
            { room: 'Deluxe Room 2', time: '14:30 - 16:00', client: '린샤오 신부', staff: '이지은 매니저', status: '대기' },
            { room: 'Classic Room 3', time: '15:00 - 16:30', client: '강민주 신부', staff: '최서윤 매니저', status: '대기' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-OSM-002',
    title: '샵 방문예약 접수 및 피팅 매니저 배정',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '샵 매니저',
    path: '/osm/reservations',
    summary: 'B2C 고객 및 플래너로부터 접수된 피팅 방문 예약을 검토하고, 매장 피팅룸 및 전담 직원을 배정하는 관리 화면 (문서 7p U5, 5p U12 연계)',
    gapType: 'CBO',
    processCodes: ['U5', 'U11', 'U12'],
    systemModule: 'OSM',
    keyFeatures: [
      '신규 예약 신청 건 실시간 승인/일정 조율',
      '고객이 요청한 시착 희망 드레스 매장 재고 유무 자동 체크',
      '담당 피팅 매니저 배정 및 고객 사전 취향 설문 확인',
      '예약 확정 및 방문 안내 메시지 발송'
    ],
    uiComponents: [
      { name: '예약 신청 대기열', type: 'Table', description: '예약번호, 고객명, 희망일시, 본식일, 상태' },
      { name: '피팅룸 및 직원 배정 모달', type: 'Modal', description: '가용 룸 및 직원 캘린더 드래그앤드롭 매칭' },
      { name: '드레스 사전 피킹 리스트', type: 'CardGrid', description: '요청 드레스 창고 위치 및 준비 상태' }
    ],
    dataItems: {
      inputs: ['예약 승인', '담당 매니저 지정', '피팅룸 번호'],
      outputs: ['배정 결과 저장', '고객 안내 알림톡']
    },
    layoutDescription: '좌측 미배정 예약 목록 → 중앙 배정 캘린더 매트릭스 → 우측 선택 고객 상세 정보 및 시착 요청 드레스 목록',
    wireframeData: {
      badge: '인원 배정 (U5/U12)',
      sectionTitle: 'Fitting Reservation & Staff Assignment',
      sections: [
        {
          type: 'table',
          title: '방문 예약 접수 목록 (오늘 신규 8건)',
          items: [
            { id: 'RSV-2026-088', client: '이수민', date: '2026-06-21 14:00', hall: '그랜드하얏트', staff: '미배정', action: '직원배정' },
            { id: 'RSV-2026-089', client: '장천', date: '2026-06-21 15:30', hall: '메리어트 볼룸', staff: '이지은', action: '배정완료' },
            { id: 'RSV-2026-090', client: '김태리', date: '2026-06-22 11:00', hall: '더채플앳논현', staff: '미배정', action: '직원배정' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-OSM-003',
    title: '현장 상품 체험 및 피팅 등록',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '피팅 매니저, 샵 스타일리스트',
    path: '/osm/fitting-log',
    summary: '고객이 매장에서 직접 시착해 본 드레스들의 착장 사진, 신체 사이즈 보정 메모, 고객 반응을 기록하는 전문 피팅 로그 화면 (문서 7p U6 연계)',
    gapType: 'CBO',
    processCodes: ['U6', 'U13'],
    systemModule: 'OSM',
    keyFeatures: [
      '피팅 진행 중 실시간 드레스 바코드 스캔 및 추가',
      '신체 치수(가슴, 허리, 힙, 힐 높이 등) 맞춤 수선 메모 입력',
      '착장 각도별(정면/측면/후면/베일 연출) 사진 태깅 업로드',
      '고객 선호도 평점 (★ 1~5개) 및 최종 후보 드레스 지정'
    ],
    uiComponents: [
      { name: '피팅 고객 정보 요약 바', type: 'Header', description: '고객명, 본식일, 홀 스타일, 체형 특징' },
      { name: '시착 드레스 카드 리스트', type: 'CardGrid', description: '시착한 4벌의 사진, 핏감 메모, 수선 필요 여부' },
      { name: '치수 기록 시트', type: 'Form', description: '가슴둘레, 허리, 가봉 세부 옵션' }
    ],
    dataItems: {
      inputs: ['시착 드레스 바코드', '치수 데이터', '착장 사진', '수선 요청사항'],
      outputs: ['피팅 체험 리포트', '대여 전환 후보 목록']
    },
    layoutDescription: '상단 고객 요약 바 → 좌측 시착 드레스 갤러리/사진 첨부 → 우측 상세 치수 측정 및 가봉 특이사항 기재 폼',
    wireframeData: {
      badge: '상품 체험 등록 (U6)',
      sectionTitle: 'In-Shop Fitting Experience & Alteration Notes',
      sections: [
        {
          type: 'grid',
          title: '시착 드레스 및 평가 (이수민 고객)',
          items: [
            { dress: 'Grace Royal Lace (#DR-8801)', score: '★★★★★ (최우수)', memo: '허리 1인치 줄임 필요, 7cm 힐 권장' },
            { dress: 'Sparkle Mermaid (#DR-7721)', score: '★★★★☆', memo: '골반선 완벽, 넥라인 비즈 보강' },
            { dress: 'Pure Romantic Dress (#DR-6502)', score: '★★★☆☆', memo: '홀 조명 대비 비즈 광택 부족' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-OSM-004',
    title: '상품 대여 계약 및 현장 결제 등록',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '샵 매니저',
    path: '/osm/rentals/contract',
    summary: '고객이 최종 확정한 드레스에 대해 대여 계약을 생성하고, 피팅비 차감, 대여료 및 보증금 결제를 처리하는 대여 등록 화면 (문서 7p U7, U8 연계)',
    gapType: 'CBO',
    processCodes: ['U7', 'U8', 'U13'],
    systemModule: 'OSM',
    keyFeatures: [
      '최종 대여 드레스 및 포함 액세서리(티아라, 베일, 슈즈) 패키지 묶음 확정',
      '대여 기간(본식 전일 출고 ~ 본식 익일 반납) 자동 설정',
      '정가, 플래너 프로모션 할인, 피팅비 환급 적용 견적 산출',
      '보증금(Deposit) 및 위챗페이/신용카드 결제 승인 연동'
    ],
    uiComponents: [
      { name: '대여 계약 상품 명세표', type: 'Table', description: '드레스, 베일, 헤어피스, 대여단가' },
      { name: '금액 정산 계산기', type: 'Form', description: '대여료 + 보증금 - 할인액 = 최종 결제액' },
      { name: '태블릿 전자 서명 패드', type: 'Modal', description: '고객 자필 서명 및 대여 약관 동의' }
    ],
    dataItems: {
      inputs: ['대여 상품 코드', '수선 완료일', '결제 수단', '고객 전자 서명'],
      outputs: ['정식 대여 계약서 번호', '결제 영수증', '대여 출고 대기열 생성']
    },
    layoutDescription: '좌측 계약 품목 리스트 및 수선 일정 → 우측 금액 산출서 및 결제 패널 → 하단 전자 서명 및 계약서 발행',
    wireframeData: {
      badge: '상품 대여 등록 (U7/U8)',
      sectionTitle: 'Rental Contract & Payment Processing',
      sections: [
        {
          type: 'form',
          title: '대여 계약 명세서 (계약번호: RNT-2026-0412)',
          items: [
            { label: '확정 드레스', value: 'Grace Royal Lace A-Line (M size / 가봉 완료)' },
            { label: '포함 소품', value: '3m 롱 트레인 베일, 진주 헤어밴드, 7cm 웨딩슈즈' },
            { label: '대여 기간', value: '2026-10-17 10:00 출고 ~ 2026-10-19 14:00 반납' },
            { label: '대여 총액', value: '¥9,800 (피팅비 ¥300 전액 차감 반영)' },
            { label: '보증금(Deposit)', value: '¥3,000 (반납 검수 후 즉시 환급)' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-OSM-005',
    title: '대여 출고 및 헬퍼(이모) 매칭 관리',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '샵 매니저',
    path: '/osm/rentals/dispatch',
    summary: '본식 일정과 장소를 확인하고, 검수 및 패킹된 드레스를 전담 헬퍼(이모)에게 인도하여 대여 출고를 처리하는 화면 (문서 7p U9, 5p U14 연계)',
    gapType: 'CBO',
    processCodes: ['U9', 'U14'],
    systemModule: 'OSM',
    keyFeatures: [
      '출고 D-1 스케줄 및 가봉 완료 상태 점검',
      '공인 헬퍼(이모) 풀에서 본식 장소 거리 및 평점 기반 최적 매칭',
      '출고 전 바코드 스캔 및 패킹 백 번호 부여',
      '이모에게 현장 주의사항(실크 주름 관리법, 비즈 세팅법) 인계증 발행'
    ],
    uiComponents: [
      { name: '출고 대기 목록', type: 'Table', description: '본식일, 신부명, 드레스, 패킹상태, 담당헬퍼' },
      { name: '헬퍼(이모) 매칭 다이얼로그', type: 'Modal', description: '활동 가능 헬퍼 목록, 평점, 본식 경력' },
      { name: '출고 확인 바코드 스캐너', type: 'ActionToolbar', description: '실물 태그 스캔 즉시 출고 완료 처리' }
    ],
    dataItems: {
      inputs: ['출고 드레스 태그', '지정 헬퍼 ID', '인도 확인 서명'],
      outputs: ['대여 출고증', '현장 서비스 진행 상태 전환']
    },
    layoutDescription: '상단 출고 D-Day 탭 → 출고 대상 테이블 → 우측 헬퍼 매칭 및 패킹 상태 패널 → 하단 출고 승인 버튼',
    wireframeData: {
      badge: '대여 출고 등록 (U9/U14)',
      sectionTitle: 'Rental Dispatch & Helper Assignment',
      sections: [
        {
          type: 'table',
          title: '오늘 출고 대상 드레스 (총 5건)',
          items: [
            { id: 'DIS-101', dress: 'Grace Royal Lace', client: '이수민', venue: '그랜드하얏트', helper: '왕메이링 이모', status: '출고완료' },
            { id: 'DIS-102', dress: 'Sparkle Mermaid', client: '박소라', venue: '쉐라톤 볼룸', helper: '장춘화 이모', status: '패킹완료(대기)' },
            { id: 'DIS-103', dress: 'Grand Ballroom Gown', client: '자오웨이', venue: '인터컨티넨탈', helper: '김명순 이모', status: '가봉중' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-OSM-006',
    title: '대여 입고 및 마감 등록 (정산 승인)',
    portal: 'OSM',
    portalName: '판매상(대리점) 포털',
    role: '샵 매니저',
    path: '/osm/rentals/return',
    summary: '행사가 끝난 드레스를 회수 입고하고, 세탁/손상 검수 후 보증금 환급 및 플랫폼 운영상에 배분정산 마감을 전송하는 화면 (문서 7p U10, U11, 5p U15 연계)',
    gapType: 'CBO',
    processCodes: ['U10', 'U11', 'U15', 'U16'],
    systemModule: 'OSM',
    keyFeatures: [
      '헬퍼(이모) 반납 드레스 실물 바코드 접수',
      '상태 정밀 검수표 작성 (밑단 오염, 레이스 찢김, 비즈 손실 여부)',
      '보증금 전액 환급 또는 차감 처리 승인',
      '대여 마감 확정 버튼 클릭 시 PMS 정산 엔진(U16)으로 실적 자동 이관'
    ],
    uiComponents: [
      { name: '반납 대기 리스트', type: 'Table', description: '입고일, 반납 헬퍼, 드레스명, 본식 종료시간' },
      { name: '검수 체크리스트 폼', type: 'Form', description: '세탁 등급(A/B/C), 수선 필요 여부' },
      { name: '보증금 정산 및 대여 마감 처리기', type: 'ActionToolbar', description: '대여마감등록 버튼' }
    ],
    dataItems: {
      inputs: ['반납 드레스 상태', '수선비 차감액', '최종 입고 승인'],
      outputs: ['대여 마감 데이터', '보증금 환급 전표', '정산배분 트리거']
    },
    layoutDescription: '좌측 반납 접수 드레스 목록 → 중앙 상태 검수 체크리스트 → 우측 보증금 환급 및 정산 마감 전송 버튼',
    wireframeData: {
      badge: '대여 마감 (U11/U15)',
      sectionTitle: 'Return Inspection & Rental Closing Registration',
      sections: [
        {
          type: 'form',
          title: '반납 검수 및 마감 처리 (Grace Royal Lace #DR-8801)',
          items: [
            { label: '반납 접수 일시', value: '2026-10-18 20:30 (왕메이링 이모 인도)' },
            { label: '드레스 실물 상태', value: '정상 (밑단 경미한 오염 - 기본 클리닝 처리 가능)' },
            { label: '손상 여부', value: '없음 (비즈 및 레이스 훼손율 0%)' },
            { label: '보증금 처리', value: '보증금 ¥3,000 고객 위챗페이 계좌로 100% 즉시 환급' },
            { label: '대여 마감 상태', value: '대여 마감 등록 완료 → PMS 배분정산(U16) 큐 전송' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // 4. [SCM] 공급상 & 디자이너 & 생산공방 포털
  // ==========================================
  {
    id: 'SCR-SCM-001',
    title: 'SCM 글로벌 공급망 및 재고 관제탑',
    portal: 'SCM',
    portalName: '공급상 & 공방 포털',
    role: '공급상 관리자, 글로벌 물류 책임자',
    path: '/scm/dashboard',
    summary: '글로벌 드레스 수주/발주 현황, 생산공방 제조 진행률, 물류센터 재고 및 대리점 출고 트래킹을 총괄하는 공급망 대시보드 (문서 4p, 6p 2-1 연계)',
    gapType: 'BPM',
    processCodes: ['U4', 'U5', 'U6', 'U7'],
    systemModule: 'SCM',
    keyFeatures: [
      '전체 공급 드레스 수량 및 대리점 공급 점유율',
      '일일 신규 발주 접수(U4) 및 수주 확정(U5) 현황',
      '물류센터 출하지시 및 국제 배송 트래킹',
      '생산공방별 가동률 및 제작 완료 예정일 모니터링'
    ],
    uiComponents: [
      { name: '공급망 핵심 KPI', type: 'CardGrid', description: '총 유통 10,000벌, 가용재고, 수주 대기, 회수율' },
      { name: '주문-출고 파이프라인', type: 'Timeline', description: '발주 → 수주 → 출하지시 → 출고 → 입고완료' },
      { name: '지역별 대리점 재고 분배 맵', type: 'Chart', description: '상하이, 항저우, 베이징, 서울 재고 분포' }
    ],
    dataItems: {
      inputs: ['공급사 ID', '기간'],
      outputs: ['수주 실적', '출하 잔여 수량', '재고 회전율']
    },
    layoutDescription: '상단 공급망 핵심 지표 4종 → 중앙 주문-출하 파이프라인 그래프 → 하단 대리점별 발주 현황 그리드',
    wireframeData: {
      badge: 'SCM 공급망 관제탑',
      sectionTitle: 'Global Supply Chain & Inventory Tower',
      stats: [
        { label: '글로벌 유통 드레스', value: '10,000벌', sub: '플랫폼 네트워크' },
        { label: '금월 수주 완료', value: '342건', sub: '전월비 +18%' },
        { label: '공방 제작 진행중', value: '85벌', sub: '평균 공기 14일' },
        { label: '물류 출고 리드타임', value: '1.8일', sub: '당일 출하지시율 94%' }
      ],
      sections: [
        {
          type: 'table',
          title: '실시간 대리점 발주 요청 접수 현황 (U4 → U5)',
          items: [
            { po: 'PO-2026-4401', agency: '항저우 왕차오 샵', item: 'Sparkle Mermaid 5벌', date: '06-18', status: '수주확정 대기' },
            { po: 'PO-2026-4402', agency: '상하이 와이탄 샵', item: 'Grace Royal Lace 8벌', date: '06-18', status: '출하지시 완료' },
            { po: 'PO-2026-4403', agency: '청담 플래그십', item: 'K-Bride Minimal 3벌', date: '06-17', status: '물류 배송중' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-SCM-002',
    title: '신규 상품 정보 등록 및 포털 추천 (U1)',
    portal: 'SCM',
    portalName: '공급상 & 공방 포털',
    role: '공급업체 상품 기획자',
    path: '/scm/products/new',
    summary: '공급상이 디자이너 브랜드 드레스의 상세 규격, 공급가, 고화질 룩북, 원부자재 정보를 입력하고 B2B 포털에 추천 심사를 올리는 화면 (문서 5p, 6p U1 연계)',
    gapType: 'CBO',
    processCodes: ['U1'],
    systemModule: 'BIS',
    keyFeatures: [
      '상품 기본 정보(상품명, 브랜드/디자이너, 카테고리) 등록',
      '가격 정책(공급가, 권장 대여가, 1회 피팅 권장가, 제작 원가) 기재',
      '다각도 착장 사진, 고화질 워킹 영상 및 3D 모델링 파일 업로드',
      '소재 성분, 규격, 색상별 보유 초도 수량 설정 후 포털 추천 심사(U2) 요청'
    ],
    uiComponents: [
      { name: '상품 마스터 정보 폼', type: 'Form', description: '품목코드, 품목명, 영문/중문명, 디자이너' },
      { name: '가격 체계 매트릭스', type: 'Table', description: '공급가, 권장 대여가, 원가, 마진율' },
      { name: '미디어 에셋 업로더', type: 'Form', description: '고해상도 이미지 및 룩북 파일 업로드' },
      { name: '포털 추천 제출 버튼', type: 'ActionToolbar', description: 'PMS 상품심사 대기열로 즉시 전송' }
    ],
    dataItems: {
      inputs: ['상품 메타데이터', '원가/공급가', '디자이너 IP 정보', '룩북 사진'],
      outputs: ['신규 상품 임시 코드', '심사 요청 완료 상태']
    },
    layoutDescription: '좌측 카테고리 및 기본 사양 입력 → 중앙 가격 및 재고 정책 → 우측 이미지/영상 미리보기 및 추천 제출 바',
    wireframeData: {
      badge: '상품 정보 등록 (U1)',
      sectionTitle: 'New Product Registration & Portal Recommendation',
      sections: [
        {
          type: 'form',
          title: '상품 상세 명세 입력 (Grace Royal Lace Gown)',
          items: [
            { label: '브랜드 / 디자이너', value: 'Atelier de Seoul (수석 디자이너 정유진)' },
            { label: '카테고리 분류', value: '웨딩드레스 > A라인 > 프렌치 레이스' },
            { label: '공급가 / 권장 대여가', value: '공급가: ¥3,500 / 권장 대여단가: ¥9,800' },
            { label: '디자이너 로열티', value: '대여 회차당 3% (약 ¥294) 자동 귀속 조건' },
            { label: '포털 추천 의견', value: '2026 가을 본식 시즌 메인 라인업 강력 추천' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-SCM-003',
    title: '대리점 발주(U4) 접수 및 수주·출하지시 (U5, U6)',
    portal: 'SCM',
    portalName: '공급상 & 공방 포털',
    role: '공급상 물류 담당자',
    path: '/scm/orders',
    summary: '판매상(대리점)이 발주한 주문(U4)을 확인하여 수주를 확정(U5)하고, 물류센터에 출하지시 및 송장을 발급하는 화면 (문서 5p, 6p U4, U5, U6 연계)',
    gapType: 'BPM',
    processCodes: ['U4', 'U5', 'U6'],
    systemModule: 'SCM',
    keyFeatures: [
      '대리점별 발주서(PO) 실시간 접수 및 재고 자동 할당',
      '수주 확정 및 전자 수주서 대리점 자동 발송',
      '물류창고 WMS 연동 출하지시서(Picking & Packing) 생성',
      '국제/국내 택배 송장 출력 및 출고 완료(U6) 처리'
    ],
    uiComponents: [
      { name: '발주 접수 대기 테이블', type: 'Table', description: '발주일자, 대리점명, 주문상품, 수량, 납기희망일' },
      { name: '수주 확정 모달', type: 'Modal', description: '출하 가능 일정 확인 및 수주 승인' },
      { name: '출하 송장 일괄 출력기', type: 'ActionToolbar', description: '바코드 라벨 및 송장 생성' }
    ],
    dataItems: {
      inputs: ['발주 승인', '출하 창고 선택', '배송 송장 번호'],
      outputs: ['수주 전표', '출고 전표(U6)', '대리점 입고 대기 상태']
    },
    layoutDescription: '상단 발주 상태별 탭 (대기/수주/출하지시/출고완료) → 주문 목록 그리드 → 상세 출하 패널',
    wireframeData: {
      badge: '수주 및 출고 (U5/U6)',
      sectionTitle: 'Order Acceptance & Shipping Instruction',
      sections: [
        {
          type: 'table',
          title: '발주 및 출하 처리 목록',
          items: [
            { id: 'ORD-8810', shop: '항저우 왕차오 샵', item: 'Royal Lace (M 3벌, L 2벌)', poDate: '06-18', status: '수주확정', action: '출하지시' },
            { id: 'ORD-8811', shop: '상하이 푸동 샵', item: 'Sparkle Mermaid (S 2벌)', poDate: '06-18', status: '출하지시', action: '송장발행' },
            { id: 'ORD-8812', shop: '베이징 조양 샵', item: 'Off-Shoulder Gown (M 4벌)', poDate: '06-17', status: '출고완료', action: '배송추적' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-SCM-004',
    title: '생산공방 연계 제조 발주 & 공정 트래킹 (Planner X)',
    portal: 'SCM',
    portalName: '공급상 & 공방 포털',
    role: '생산공방 관리자, 공급사 생산관리팀',
    path: '/scm/workshops',
    summary: '중국 전역 수백 개 생산공방을 플랫폼 전초기지로 연결하여 디자이너 패턴에 따른 드레스 제작 발주 및 제작 공정 현황을 추적하는 화면 (Planner X 문서 4p 연계)',
    gapType: 'INT',
    processCodes: ['U1', 'U5'],
    systemModule: 'SCM',
    keyFeatures: [
      '디자이너 패턴/작업지시서 기반 공방 생산 오더 배정',
      '제작 단계별 상태 추적: 원단 재단 → 비즈 자수 수작업 → 봉제 → 품질 검사(QC)',
      '공방별 제작비 선급금 및 3% 대여 로열티 연계 계약 확인',
      '완성품 검품 통과 후 글로벌 물류센터 자동 입고 등록'
    ],
    uiComponents: [
      { name: '공방 칸반 보드', type: 'Table', description: '발주접수 → 재단/자수 → 가봉 → 최종QC → 입고' },
      { name: '작업지시서(Tech Pack) 뷰어', type: 'Modal', description: '디자이너 오리지널 패턴 및 봉제 가이드' },
      { name: '공방 생산성 매트릭스', type: 'Chart', description: '공방별 납기준수율, QC 합격률' }
    ],
    dataItems: {
      inputs: ['공방 지정', '작업지시서', '원부자재 입고일', '검품 결과'],
      outputs: ['공방 제조 번호', '공정 상태값', '완제품 시리얼 넘버']
    },
    layoutDescription: '상단 공방별 가동률 요약 → 중앙 공정 칸반 테이블 → 우측 작업지시서 및 검품 사진 확인 패널',
    wireframeData: {
      badge: '생산공방 생태계 (Planner X)',
      sectionTitle: 'Production Workshop Network & Process Tracker',
      stats: [
        { label: '연계 생산공방', value: '42개소', sub: '쑤저우, 광저우 등' },
        { label: '현재 제작 중 드레스', value: '184벌', sub: '디자이너 패턴 기반' },
        { label: '평균 제작 기간', value: '12.4일', sub: '목표 14일 이내' }
      ],
      sections: [
        {
          type: 'kanban',
          title: '제작 공정 파이프라인',
          items: [
            { step: '01. 패턴/재단', count: '45벌', workshops: '쑤저우 1공방 외 3곳' },
            { step: '02. 비즈/자수 수작업', count: '62벌', workshops: '항저우 명품공방 외 5곳' },
            { step: '03. 최종 봉제/마감', count: '48벌', workshops: '광저우 테일러공방' },
            { step: '04. QC 품질 검품', count: '29벌', workshops: '중앙 물류검품센터' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-SCM-005',
    title: '디자이너 & 생산공방 3% 지속 로열티 집계 현황',
    portal: 'SCM',
    portalName: '공급상 & 공방 포털',
    role: '웨딩드레스 디자이너, 생산공방 대표',
    path: '/scm/royalties',
    summary: '디자이너와 공방이 제작한 드레스가 글로벌 대여 매장에서 대여될 때마다 발생하는 3% 로열티 누적 수익을 실시간 집계하는 정산 화면 (Planner X 문서 3p, 4p 연계)',
    gapType: 'CBO',
    processCodes: ['U16'],
    systemModule: 'PMS',
    keyFeatures: [
      '드레스 모델별 누적 대여 횟수 및 총 대여 매출 집계',
      '디자이너 로열티 (대여 매출의 3%) 실시간 계산 및 누적 현황',
      '생산공방 로열티 (대여 매출의 3%) 실시간 계산 및 지급 내역',
      '1벌당 목표 회전율(20회 기준 30% 마진 회수 모델) 달성률 그래프'
    ],
    uiComponents: [
      { name: '로열티 누적 KPI 카드', type: 'CardGrid', description: '총 대여 횟수, 총 로열티 수익, 지급 완료액' },
      { name: '드레스별 대여 실적 랭킹', type: 'Table', description: '드레스명, 누적대여, 대여매출, 3% 로열티 금액' },
      { name: '회전율 시뮬레이터', type: 'Chart', description: '10,000벌 유통 × 20회 대여 = 90억 로열티 모델' }
    ],
    dataItems: {
      inputs: ['파트너 계약 코드', '조회 월'],
      outputs: ['누적 로열티 명세', '송금 증빙서']
    },
    layoutDescription: '상단 3% 로열티 핵심 지표 카드 → 중앙 드레스 품목별 대여 횟수 및 발생 로열티 상세 테이블 → 하단 월별 정산 내역서',
    wireframeData: {
      badge: '지속 로열티 (Planner X)',
      sectionTitle: 'Designer & Workshop 3% Lifetime Royalty',
      stats: [
        { label: '누적 총 대여 횟수', value: '4,820회', sub: '유통 드레스 450벌' },
        { label: '총 발생 대여 매출', value: '¥38,560,000', sub: '대리점 전체 실적' },
        { label: '3% 로열티 누적액', value: '¥1,156,800', sub: '디자이너/공방 각각 귀속' }
      ],
      sections: [
        {
          type: 'table',
          title: '드레스별 누적 로열티 발생 TOP 3',
          items: [
            { code: '#DR-8801', title: 'Grace Royal Lace', rentals: '18회', rentRevenue: '¥176,400', royalty3pct: '¥5,292', status: '정산완료' },
            { code: '#DR-7721', title: 'Sparkle Mermaid', rentals: '16회', rentRevenue: '¥140,800', royalty3pct: '¥4,224', status: '정산완료' },
            { code: '#DR-6502', title: 'Romantic Off-Shoulder', rentals: '14회', rentRevenue: '¥105,000', royalty3pct: '¥3,150', status: '정산완료' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // 5. [PMS] 운영상 본사 포털 관리 시스템 (PMS)
  // ==========================================
  {
    id: 'SCR-PMS-001',
    title: '플랫폼 통합 운영 관제탑 (Total Control Center)',
    portal: 'PMS',
    portalName: '운영상(본사) 포털',
    role: '플랫폼 최고관리자 (대표, 본부장, 실장)',
    path: '/pms/control-tower',
    summary: '전체 S2B2C 생태계 거래액, 공급상 수주/출고, 대리점 샵 가동률, 플래너 활동 현황 및 배분정산 마감 상태를 총괄 감독하는 본사 메인 관제 화면',
    gapType: 'CBO',
    processCodes: ['U2', 'U10', 'U11', 'U16'],
    systemModule: 'PMS',
    keyFeatures: [
      '전체 거래 볼륨(GMV), 대여 건수, 피팅 예약 건수 실시간 롤링 집계',
      '권역별(화동, 화남, 화북 등) 대리점 샵 및 쇼룸 운영 현황 모니터링',
      '심사 대기열 현황 (상품 심사 U2, 플래너 심사 U2) 즉시 처리 위젯',
      '금월 배분 정산 마감 일정 및 자금 흐름 모니터링'
    ],
    uiComponents: [
      { name: '생태계 종합 KPI', type: 'CardGrid', description: '총 거래액, 활성 대리점, 등록 플래너, 가동 드레스' },
      { name: '승인/심사 긴급 대기열', type: 'BadgeGroup', description: '신규 상품 심사 14건, 플래너 승인 8건' },
      { name: 'S2B2C 흐름 실시간 상태 맵', type: 'Timeline', description: 'U1 상품등록부터 U16 정산까지 파이프라인 이상 유무' }
    ],
    dataItems: {
      inputs: ['실시간 시스템 이벤트 로그'],
      outputs: ['총괄 대시보드 지표', '운영 이상 알림']
    },
    layoutDescription: '상단 5대 핵심 KPI → 중앙 실시간 거래 추이 그래프 및 지역별 현황 맵 → 하단 즉시 처리 심사 대기 리스트',
    wireframeData: {
      badge: 'PMS 본사 관제탑',
      sectionTitle: 'TOBMALL Platform Total Operations Control',
      stats: [
        { label: '연간 누적 대여 매출', value: '¥128,400,000', sub: '목표 104% 달성' },
        { label: '활성 대리점 샵', value: '38개점', sub: '항저우 왕차오 외' },
        { label: '활동 중 플래너/이모', value: '1,420명', sub: '이번 주 +68명' },
        { label: '금월 정산 마감률', value: '98.5%', sub: '익월 5일 자동지급' }
      ],
      sections: [
        {
          type: 'grid',
          title: '긴급 심사 및 승인 대기 업무',
          items: [
            { task: '신규 상품 포털 개시 심사 (U2)', count: '12건', priority: '높음', action: '심사화면 이동' },
            { task: '플래너 & 이모 자격 검토 (U2)', count: '7건', priority: '보통', action: '승인처리' },
            { task: '건물주 수익 쉐어 정산 마감', count: '3개 빌딩', priority: '높음', action: '정산검토' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PMS-002',
    title: '상품 심사 및 포털 공개 승인 (U2)',
    portal: 'PMS',
    portalName: '운영상(본사) 포털',
    role: '플랫폼 상품기획 MD, 운영 관리자',
    path: '/pms/products/review',
    summary: '공급상이 등록 추천한 드레스 및 웨딩 상품(U1)을 검토하여 품질, 디자인 저작권, 적정 가격을 심사하고 포털 개시를 승인/반려하는 화면 (문서 5p, 6p U2 연계)',
    gapType: 'BPM',
    processCodes: ['U1', 'U2'],
    systemModule: 'PMS',
    keyFeatures: [
      '공급상별 심사 신청 상품 상세 스펙 및 룩북 정밀 검토',
      '가격 적합성 평가: 공급가 대비 대여료 마진 구조(30% 마진 룰) 검증',
      '디자이너 IP 라이선스 및 위조 방지 검증',
      '원클릭 포털 개시 승인 또는 보완 요청 사유 반려 처리'
    ],
    uiComponents: [
      { name: '심사 대상 상품 큐', type: 'Table', description: '신청일, 공급사, 브랜드, 품목명, 공급가, 희망대여가' },
      { name: '드레스 고화질 검수 뷰어', type: 'Modal', description: '360도 착장 및 디테일 봉제 줌 뷰' },
      { name: '승인/반려 판정 툴바', type: 'ActionToolbar', description: '승인, 조건부승인, 반려 사유 입력' }
    ],
    dataItems: {
      inputs: ['심사 대기 상품 ID', 'MD 평가 소견', '승인 구분'],
      outputs: ['심사 완료 상태', 'B2B/B2C 포털 카탈로그 개시 일자']
    },
    layoutDescription: '좌측 심사 대기 목록 테이블 → 중앙 선택 상품 상세 스펙 및 미디어 뷰어 → 우측 판정 및 포털 개시 설정 패널',
    wireframeData: {
      badge: '상품 심사 등록 (U2)',
      sectionTitle: 'Product Inspection & Portal Publication Approval',
      sections: [
        {
          type: 'table',
          title: '심사 대기 상품 목록 (총 12건)',
          items: [
            { id: 'RVW-301', name: 'Grace Royal Lace Gown', supplier: '한중웨딩서플라이', price: '¥9,800', designer: 'Atelier de Seoul', status: '심사중' },
            { id: 'RVW-302', name: 'Crystal Starlight Veil', supplier: '명품자수공방', price: '¥1,500', designer: '수석자수장', status: '대기' },
            { id: 'RVW-303', name: 'Modern Tailored Tuxedo', supplier: 'K-Tailor Group', price: '¥4,800', designer: '김재원 옴므', status: '대기' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PMS-003',
    title: 'S2B2C 다자간 배분정산 엔진 (U16)',
    portal: 'PMS',
    portalName: '운영상(본사) 포털',
    role: '운영상 정산재무팀장',
    path: '/pms/settlement/engine',
    summary: '행사 마감된 대여 오더에 대해 공급상, 판매상(대리점), 플래너, 헬퍼(이모), 디자이너(3%), 생산공방(3%), 건물주(20%)의 수익을 룰 기반으로 자동 배분 정산하는 핵심 엔진 화면 (문서 3p, 5p, 6p U16 연계)',
    gapType: 'CBO',
    processCodes: ['U10', 'U11', 'U16'],
    systemModule: 'PMS',
    keyFeatures: [
      '대여 1건당 다자간 스마트 배분 공식 자동 실행',
      '배분 규칙: 공급상 공급원가 + 대리점 판매마진(30%) + 디자이너 IP(3%) + 공방(3%) + 헬퍼 동행비 + 건물주 공간수수료(20%) + 플랫폼 수수료',
      '월간 대리점별/참여자별 정산 마감 확정 및 은행 자동 송금 전문 생성',
      '정산 오차 및 반품/환불 건에 대한 조정 및 차감 관리'
    ],
    uiComponents: [
      { name: '배분 정산 시뮬레이터', type: 'Chart', description: '대여료 100% 기준 참여자별 슬라이스 배분 파이차트' },
      { name: '정산 대상 오더 목록', type: 'Table', description: '오더번호, 행사일, 대여매출, 각 주체별 배분액' },
      { name: '정산 마감 승인 버튼', type: 'ActionToolbar', description: '최종 결재 후 지급 전문 생성' }
    ],
    dataItems: {
      inputs: ['행사 마감 데이터(U11)', '정산 요율표', '세무 정보'],
      outputs: ['배분 정산 전표', '참여자별 송금 명세서', '재무 보고서']
    },
    layoutDescription: '상단 배분 공식 요약 위젯 → 중앙 월별 정산 총괄 현황 → 하단 건별 7대 주체 배분 상세 그리드',
    wireframeData: {
      badge: '배분 정산 등록 (U16)',
      sectionTitle: 'Multi-Stakeholder Revenue Settlement Engine',
      sections: [
        {
          type: 'table',
          title: '오더 #ORD-2026-0618 (대여가 ¥10,000 기준 배분 결과)',
          items: [
            { stakeholder: '판매상 (오프라인 대리점)', rate: '30%', amount: '¥3,000', note: '매장 운영 및 피팅 마진' },
            { stakeholder: '건물주 (왕차오 센터)', rate: '20%', amount: '¥2,000', note: '공간 제공 수익 쉐어 (플랫폼 80/건물주 20)' },
            { stakeholder: '플래너 (홍보 및 고객 유치)', rate: '15%', amount: '¥1,500', note: '위챗 모멘트 추천 실적' },
            { stakeholder: '헬퍼 이모 (현장 케어 용역)', rate: '고정', amount: '¥1,000', note: '본식 1일 동행 수당' },
            { stakeholder: '웨딩 디자이너', rate: '3%', amount: '¥300', note: '글로벌 디자인 IP 로열티' },
            { stakeholder: '생산공방', rate: '3%', amount: '¥300', note: '제조 파트너십 지속 로열티' },
            { stakeholder: '공급상 / 플랫폼 본사', rate: '잔여', amount: '¥1,900', note: '원가 회수 및 플랫폼 운영 수수료' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-PMS-004',
    title: '건물주 파트너십 및 공간 수익 배분 관리 (Planner X)',
    portal: 'PMS',
    portalName: '운영상(본사) 포털',
    role: '건물주 파트너, 플랫폼 공간사업팀',
    path: '/pms/building-partners',
    summary: '항저우 왕차오 센터를 비롯한 프리미엄 빌딩 건물주와 체결한 공실 활용 매장 모델의 매출 실적, 방문 유동인구 및 20% 수익 분배를 관리하는 화면 (Planner X 문서 5p, 6p 연계)',
    gapType: 'CBO',
    processCodes: ['U16'],
    systemModule: 'PMS',
    keyFeatures: [
      '건물별(항저우 왕차오 센터 1호점 등) 전용 면적, 인테리어 투자액, 층별 매장 현황',
      '고정 임대료 대신 매출 배분 모델: 매장 총 매출의 건물주 20% / 플랫폼 80% 자동 계산',
      '건물 유동 고객 수, 웨딩 고객 집적 효과, 건물 가치 상승 지표 분석',
      '중국 전국 단위 프리미엄 빌딩 신규 입점 파이프라인 관리'
    ],
    uiComponents: [
      { name: '공간 파트너십 KPI', type: 'CardGrid', description: '총 운영 매장 수, 건물주 배분 총액, 평당 매출액' },
      { name: '건물별 매출 및 배분 명세서', type: 'Table', description: '빌딩명, 당월 대여매출, 건물주 정산액(20%), 지급일' },
      { name: '왕차오 센터 성공사례 분석 뷰', type: 'Chart', description: '기존 고정 임대료 대비 플랫폼 수익 쉐어 비교' }
    ],
    dataItems: {
      inputs: ['빌딩 코드', '계약 면적', '매출 귀속 데이터'],
      outputs: ['건물주 정산서', '수익성 분석 리포트']
    },
    layoutDescription: '상단 랜드마크 파트너십 현황 카드 → 좌측 건물별 매출-배분 테이블 → 우측 임대료 대체 수익 비교 차트',
    wireframeData: {
      badge: '건물주 파트너십 (Planner X)',
      sectionTitle: 'Building Owner Partnership & Space Revenue Share',
      stats: [
        { label: '항저우 왕차오 센터 매장', value: '1,200㎡', sub: '2F 프리미엄 쇼룸' },
        { label: '당월 매장 총 매출', value: '¥820,000', sub: '피팅 및 대여 실적' },
        { label: '건물주 배분액 (20%)', value: '¥164,000', sub: '기존 임대료 대비 +135%' }
      ],
      sections: [
        {
          type: 'detail',
          title: '건물주 수익 모델 비교 분석 (왕차오 센터 1호점)',
          items: [
            { label: '기존 고정 임대료 방식', value: '월 고정 임대료 ¥70,000 (공실 리스크 및 임차인 교체 부담)' },
            { label: '플랫폼 백화점식 수수료 모델', value: '매출 20% 배분: 평균 월 ¥160,000 ~ ¥210,000 창출' },
            { label: '건물 가치 상승 효과', value: '주말 웨딩 유동인구 일평균 450명 유입 → 저층 식음/상가 활성화' },
            { label: '전국 확장 계획', value: '상하이, 베이징, 광저우 랜드마크 건물주 제휴 모델 표준화 진행중' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // 6. [BIS] 마스터 기준정보 관리 시스템 (BIS)
  // ==========================================
  {
    id: 'SCR-BIS-001',
    title: '회사·부서·사용자 및 역할 권한 관리',
    portal: 'BIS',
    portalName: '기준정보(BIS) 포털',
    role: '통합 시스템 최고 관리자',
    path: '/bis/organizations',
    summary: '공급상, 판매상, 운영상 법인 정보와 최대 3단계 부서 계층, 사용자 계정 및 메뉴 접근 권한을 설정하는 마스터 화면 (문서 8p U1~U4 연계)',
    gapType: 'BPM',
    processCodes: ['U1', 'U2', 'U3', 'U4'],
    systemModule: 'BIS',
    keyFeatures: [
      '회사 구분별(공급상, 판매상/대리점, 운영상 본사) 법인 및 사업자 정보 등록 (U1)',
      '최대 3단계 계층형 부서 트리 관리 (U2)',
      '사용자 계정 생성, 법인 소속 배정 및 상태 제어 (U3)',
      '역할(Role) 기반 메뉴 접근 및 기능별(읽기/쓰기/승인) 권한 매트릭스 설정 (U4)'
    ],
    uiComponents: [
      { name: '법인 및 부서 조직도 트리', type: 'Table', description: '트리 뷰 형태로 계층 구조 탐색' },
      { name: '사용자 목록 및 권한 뱃지', type: 'Table', description: '계정ID, 소속법인, 부서, 직급, 활성여부' },
      { name: 'RBAC 권한 매트릭스 모달', type: 'Modal', description: 'SCM, OSM, PMS, B2C 모듈별 세부 제어' }
    ],
    dataItems: {
      inputs: ['회사 기본정보', '부서명/상위부서', '사용자 프로필', '역할 권한 매핑'],
      outputs: ['조직도 마스터', '접근 제어 토큰']
    },
    layoutDescription: '좌측 조직 계층 트리 패널 → 중앙 사용자 관리 그리드 → 우측 역할 권한 매트릭스 체크박스 패널',
    wireframeData: {
      badge: '기준정보 관리 (BIS U1~U4)',
      sectionTitle: 'Company, Department, User & Role Permissions',
      sections: [
        {
          type: 'table',
          title: '등록 법인 및 주체 현황 (총 84개사)',
          items: [
            { code: 'CORP-001', name: 'UNINET TECHNOLOGY (운영상 본사)', type: '플랫폼 운영사', users: '32명', status: '정상' },
            { code: 'CORP-002', name: 'Atelier Seoul Ltd. (공급상)', type: '드레스 공급사', users: '14명', status: '정상' },
            { code: 'CORP-003', name: '항저우 왕차오 웨딩샵 (판매상)', type: '대리점/쇼룸', users: '18명', status: '정상' },
            { code: 'CORP-004', name: '쑤저우 드레스 공방 (생산공방)', type: '제조 파트너', users: '25명', status: '정상' }
          ]
        }
      ]
    }
  },
  {
    id: 'SCR-BIS-002',
    title: '창고·거래처·품목·가격 및 다국어 환율 설정',
    portal: 'BIS',
    portalName: '기준정보(BIS) 포털',
    role: '기준정보 관리자',
    path: '/bis/master-data',
    summary: '내부/외부 창고, 거래처 마스터, 3단계 카테고리/품목, 공급/대여 가격 정책 및 제3자 연동 다국어 통화 환율을 등록하는 화면 (문서 8p U5~U12 연계)',
    gapType: 'BPM',
    processCodes: ['U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12'],
    systemModule: 'BIS',
    keyFeatures: [
      '회사 내부 물류창고 및 외부 임대창고 위치/구역 정보 등록 (U5)',
      '모든 공급업체, 구매업체, 협력사 거래처 마스터 관리 (U6)',
      '최대 3단계 상품 카테고리 및 규격/중량 품목 정보 관리 (U7, U8)',
      '상세 거래처별 단가 및 통화별(KRW/CNY/USD) 가격 테이블 (U9, U10)',
      '기준 통화 환율 자동 동기화 및 수동 보정 설정 (U11)',
      '플랫폼 전사 환경설정 및 비즈니스 룰 커스터마이징 (U12)'
    ],
    uiComponents: [
      { name: '기준정보 카테고리 탭', type: 'Header', description: '창고 / 거래처 / 품목 / 가격 / 환율 / 환경설정' },
      { name: '품목 및 마스터 테이블', type: 'Table', description: '코드, 품목명, 규격, 기본통화, 공급단가' },
      { name: '실시간 환율 변동 위젯', type: 'Form', description: '1 CNY = 192.4 KRW (제3자 금융 API 연동)' }
    ],
    dataItems: {
      inputs: ['창고 코드', '거래처 정보', '품목 규격', '통화 환율값', '시스템 변수'],
      outputs: ['BIS 기준 데이터베이스', '전 시스템 동기화 캐시']
    },
    layoutDescription: '상단 탭 바 (창고/거래처/품목/가격/환율) → 좌측 검색 및 필터 패널 → 메인 마스터 데이터 그리드 → 상세 편집 모달',
    wireframeData: {
      badge: '기준정보 마스터 (BIS U5~U12)',
      sectionTitle: 'Warehouse, Vendor, Item, Price & FX Configuration',
      sections: [
        {
          type: 'table',
          title: '통합 기준 환율 및 주요 통화 매핑 (2026-06 기준)',
          items: [
            { currency: 'CNY (중국 위안화)', base: '1.00 CNY', targetKRW: '192.50 KRW', targetUSD: '0.141 USD', sync: '자동 (매일 09:00)' },
            { currency: 'KRW (대한민국 원)', base: '1,000 KRW', targetCNY: '5.19 CNY', targetUSD: '0.732 USD', sync: '자동' },
            { currency: 'USD (미국 달러)', base: '1.00 USD', targetCNY: '7.09 CNY', targetKRW: '1,365 KRW', sync: '자동' }
          ]
        }
      ]
    }
  }
];

export const SYSTEM_MODULE_SUMMARIES = [
  { code: 'B2C', name: '소비자 포털 (B2C Mall)', count: 4, desc: '글로벌 온라인 드레스 쇼룸, O2O 피팅 예약, 토털 패키지 견적' },
  { code: 'PLANNER', name: '플래너 & 헬퍼 포털', count: 4, desc: '위챗/샤오홍슈 SNS 바이럴 홍보 센터, 현장 케어 체크인, 수수료 정산' },
  { code: 'OSM', name: '판매상 대리점 샵 (OSM)', count: 6, desc: '피팅룸 스케줄, 인원 배정, 상품 시착/체험, 대여 계약, 이모 출고/입고' },
  { code: 'SCM', name: '공급상 & 공방 포털 (SCM)', count: 5, desc: '글로벌 공급망 수주/출고, 생산공방 연계 제조, 디자이너 3% 지속 로열티' },
  { code: 'PMS', name: '본사 포털 관리 (PMS)', count: 4, desc: '상품 심사 승인, 다자간 스마트 배분정산 엔진, 건물주 파트너십 관리' },
  { code: 'BIS', name: '기준정보 관리 (BIS)', count: 2, desc: '회사/부서/권한, 창고, 거래처, 품목, 통화 환율, 전사 환경설정' }
];
