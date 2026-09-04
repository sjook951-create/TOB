import React, { useState, useRef } from 'react';
import { 
  Truck, PlusCircle, Layers, CheckCircle2, DollarSign, Clock, ShieldCheck,
  Building, Scissors, AlertCircle, ArrowUpRight, BarChart3, X,
  Upload, Image as ImageIcon, Camera, Trash2, Link as LinkIcon, Sparkles, RefreshCw
} from 'lucide-react';
import { DressItem } from '../../data/liveData';
import ballGownImg from '../../assets/images/ball_gown_dress_1788513739326.jpg';
import mermaidSilkImg from '../../assets/images/mermaid_silk_dress_1788513755894.jpg';
import alineFloralImg from '../../assets/images/aline_floral_dress_1788513769331.jpg';
import empireLaceImg from '../../assets/images/empire_lace_dress_1788513783720.jpg';
import orientalFusionImg from '../../assets/images/oriental_fusion_dress_1788513802329.jpg';
import pearlMajestyImg from '../../assets/images/pearl_majesty_dress_1788513817581.jpg';

interface ScmSupplierPortalProps {
  dresses: DressItem[];
  onRegisterDress: (dress: DressItem) => void;
}

const PRESET_DRESS_PHOTOS = [
  { label: '볼가운 (크리스탈)', img: ballGownImg, category: 'Ball Gown' as const, silhouette: '풍성한 벨라인 (Ball Gown)' },
  { label: '미카도 머메이드', img: mermaidSilkImg, category: 'Mermaid' as const, silhouette: '머메이드 (Mermaid)' },
  { label: '에이라인 플로라', img: alineFloralImg, category: 'A-Line' as const, silhouette: '에이라인 (A-Line)' },
  { label: '엠파이어 레이스', img: empireLaceImg, category: 'Empire' as const, silhouette: '엠파이어 (Empire)' },
  { label: '오리엔탈 퓨전', img: orientalFusionImg, category: 'Traditional Fusion' as const, silhouette: '퓨전 오리엔탈' },
  { label: '프린세스 펄', img: pearlMajestyImg, category: 'Ball Gown' as const, silhouette: '프린세스 벨라인' },
];

export const ScmSupplierPortal: React.FC<ScmSupplierPortalProps> = ({
  dresses,
  onRegisterDress,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'register' | 'royalties'>('inventory');
  
  // Register Form State (SCR-SCM-002 / Process U1)
  const [newDressForm, setNewDressForm] = useState({
    name: '',
    designer: 'Grace Kim Studio (Seoul)',
    workshop: '상하이 1공방 (Shanghai Atelier)',
    category: 'Ball Gown' as DressItem['category'],
    rentalPrice: 1600000,
    deposit: 450000,
    imageUrl: ballGownImg,
    silhouette: '풍성한 벨라인 (Ball Gown)',
    fabric: '이탈리아 실크 오간자, 크리스탈 비딩',
    description: '우아하고 세련된 상체 시스루 레이스와 웅장한 트레인이 결합된 2026 F/W 오트쿠튀르 라인입니다.'
  });

  // Photo upload & selection state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG, WEBP 등)만 업로드 가능합니다.');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setNewDressForm(prev => ({
          ...prev,
          imageUrl: e.target!.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) {
      alert('유효한 이미지 URL을 입력해 주세요.');
      return;
    }
    setNewDressForm(prev => ({ ...prev, imageUrl: customUrlInput.trim() }));
    setUploadedFileName('외부 웹 이미지 링크 적용됨');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDressForm.name) {
      alert('드레스 명칭을 입력해 주세요.');
      return;
    }

    if (!newDressForm.imageUrl) {
      alert('드레스 사진을 등록해 주세요.');
      return;
    }

    const newDress: DressItem = {
      id: `DR-${Math.floor(100 + Math.random() * 900)}`,
      name: newDressForm.name,
      designer: newDressForm.designer,
      workshop: newDressForm.workshop,
      category: newDressForm.category,
      rentalPrice: Number(newDressForm.rentalPrice),
      deposit: Number(newDressForm.deposit),
      imageUrl: newDressForm.imageUrl,
      tag: '신규 등록 (심사대기)',
      status: '심사대기', // Process U1 -> U2 (sent to PMS for review)
      silhouette: newDressForm.silhouette,
      fabric: newDressForm.fabric,
      rating: 5.0,
      rentalCount: 0,
      description: newDressForm.description
    };

    onRegisterDress(newDress);
    setRegisterSuccess(`'${newDress.name}' 상품이 성공적으로 등록되었습니다. 본사 PMS 심사 대기열(U2)로 전달되었습니다.`);
    setTimeout(() => setRegisterSuccess(null), 6000);
    setActiveTab('inventory');
  };

  return (
    <div className="space-y-6">
      {/* SCM Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                SCM 글로벌 공급망 & 디자이너·공방 포털
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded">
                공급망 통합 관제
              </span>
            </div>
            <p className="text-xs text-slate-500">
              글로벌 공급상 150+ 아틀리에 연결 · 쑤저우/상하이/광저우 제조 공방 다이렉트 연계 (U1, U5, U6)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'inventory' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            글로벌 재고 현황 ({dresses.length})
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>신규 상품 등록 (U1)</span>
          </button>
          <button
            onClick={() => setActiveTab('royalties')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'royalties' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>디자이너·공방 로열티 (각 3%)</span>
          </button>
        </div>
      </div>

      {registerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{registerSuccess}</span>
        </div>
      )}

      {/* TAB 1: GLOBAL INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">플랫폼 전체 등록 드레스</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">10,240벌</span>
              <span className="text-[10px] text-indigo-600 font-medium">전월 대비 +320벌</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">현재 대여 가용율</span>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">91.2%</span>
              <span className="text-[10px] text-slate-500 font-medium">실시간 허브 분산 배치</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">제조 공방 진행 중</span>
              <span className="text-lg font-bold text-amber-600 mt-1 block">48벌</span>
              <span className="text-[10px] text-slate-500 font-medium">상하이/쑤저우 오트쿠튀르</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 block">누적 지급 대여 로열티</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">₩34,800,000</span>
              <span className="text-[10px] text-indigo-600 font-medium">디자이너 3% + 공방 3%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              드레스 품목 카탈로그 및 심사/가용 상태 (SCR-SCM-001)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="p-2.5">사진</th>
                    <th className="p-2.5">품목 ID</th>
                    <th className="p-2.5">드레스 명칭 & 라인</th>
                    <th className="p-2.5">디자이너 아틀리에</th>
                    <th className="p-2.5">제조 공방</th>
                    <th className="p-2.5">권장 일일 대여료</th>
                    <th className="p-2.5">상태</th>
                    <th className="p-2.5 text-right">누적 회전(대여)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dresses.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-2.5">
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                          <img 
                            src={d.imageUrl} 
                            alt={d.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-indigo-700">{d.id}</td>
                      <td className="p-2.5">
                        <span className="font-semibold text-slate-900 block">{d.name}</span>
                        <span className="text-[10px] text-slate-500">{d.category} · {d.silhouette}</span>
                      </td>
                      <td className="p-2.5 text-slate-700">{d.designer}</td>
                      <td className="p-2.5 text-slate-600">{d.workshop}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        ₩{d.rentalPrice.toLocaleString()}
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === '가용' ? 'bg-emerald-100 text-emerald-800' :
                          d.status === '피팅중' ? 'bg-amber-100 text-amber-800' :
                          d.status === '대여중' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-indigo-700">
                        {d.rentalCount}회
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER NEW PRODUCT (U1) */}
      {activeTab === 'register' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto text-xs">
          <div className="pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-indigo-700 uppercase">신규 상품 등록 (Process U1 / SCR-SCM-002)</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              디자이너 신작 드레스 등록 및 PMS 심사 요청
            </h3>
            <p className="text-slate-500 mt-1">
              등록 즉시 본사 PMS 운영자 심사 대기열로 자동 접수되며, 심사 승인(U2) 시 B2C 및 OSM 대리점에 실시간 노출됩니다.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            {/* PHOTO UPLOAD & SELECTION SECTION */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>드레스 대표 화보 및 실물 사진 등록 (필수) *</span>
                </label>
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('upload')}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      photoInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    직접 업로드
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('preset')}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      photoInputMode === 'preset' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    샘플 선택
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('url')}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      photoInputMode === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    URL 입력
                  </button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* MODE 1: FILE DRAG & DROP UPLOAD */}
              {photoInputMode === 'upload' && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    dragActive 
                      ? 'border-indigo-600 bg-indigo-50/50' 
                      : 'border-slate-300 hover:border-indigo-500 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      클릭하여 드레스 사진을 선택하거나 파일 드래그앤드롭
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      PNG, JPG, WEBP 지원 · 심사용 고해상도 화보 사진 권장
                    </span>
                  </div>
                  {uploadedFileName && (
                    <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      선택된 파일: {uploadedFileName}
                    </span>
                  )}
                </div>
              )}

              {/* MODE 2: PRESET WEDDING DRESSES */}
              {photoInputMode === 'preset' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 block">
                    디자이너 스튜디오 추천 대표 웨딩 드레스 샘플을 선택할 수 있습니다:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_DRESS_PHOTOS.map((preset, idx) => {
                      const isSelected = newDressForm.imageUrl === preset.img;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewDressForm(prev => ({
                              ...prev,
                              imageUrl: preset.img,
                              category: preset.category,
                              silhouette: preset.silhouette
                            }));
                            setUploadedFileName(`프리셋: ${preset.label}`);
                          }}
                          className={`rounded-xl overflow-hidden border-2 text-left transition flex flex-col group relative ${
                            isSelected ? 'border-indigo-600 shadow-md ring-2 ring-indigo-300' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="aspect-[3/4] w-full bg-slate-100 overflow-hidden">
                            <img 
                              src={preset.img} 
                              alt={preset.label} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                          <span className="p-1 text-[10px] font-bold text-slate-800 truncate block bg-white text-center">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 3: DIRECT IMAGE URL */}
              {photoInputMode === 'url' && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... 드레스 이미지 링크 입력"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg whitespace-nowrap text-xs transition"
                  >
                    적용
                  </button>
                </div>
              )}

              {/* CURRENT PHOTO PREVIEW CARD */}
              {newDressForm.imageUrl && (
                <div className="p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-18 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                      <img 
                        src={newDressForm.imageUrl} 
                        alt="Dress Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">등록될 드레스 화보 미리보기</span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>본사 PMS 심사 및 B2C 쇼룸 게시 규격 충족</span>
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        비율: 3:4 세로형 오트쿠튀르 룩북 규격
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      title="사진 변경"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewDressForm(prev => ({ ...prev, imageUrl: '' }));
                        setUploadedFileName(null);
                      }}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                      title="사진 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">드레스 명칭 *</label>
              <input
                type="text"
                required
                placeholder="예: 2026 루미에르 오프숄더 벨라인"
                value={newDressForm.name}
                onChange={(e) => setNewDressForm({ ...newDressForm, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">디자이너 / 아틀리에 *</label>
                <input
                  type="text"
                  required
                  value={newDressForm.designer}
                  onChange={(e) => setNewDressForm({ ...newDressForm, designer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">생산 공방 *</label>
                <input
                  type="text"
                  required
                  value={newDressForm.workshop}
                  onChange={(e) => setNewDressForm({ ...newDressForm, workshop: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">카테고리 *</label>
                <select
                  value={newDressForm.category}
                  onChange={(e) => setNewDressForm({ ...newDressForm, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                >
                  <option value="Ball Gown">벨라인 (Ball Gown)</option>
                  <option value="Mermaid">머메이드 (Mermaid)</option>
                  <option value="A-Line">에이라인 (A-Line)</option>
                  <option value="Empire">엠파이어 (Empire)</option>
                  <option value="Traditional Fusion">오리엔탈 퓨전</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">권장 1일 대여료 (₩) *</label>
                <input
                  type="number"
                  required
                  value={newDressForm.rentalPrice}
                  onChange={(e) => setNewDressForm({ ...newDressForm, rentalPrice: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">보증금 (₩) *</label>
                <input
                  type="number"
                  required
                  value={newDressForm.deposit}
                  onChange={(e) => setNewDressForm({ ...newDressForm, deposit: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">실루엣 및 라인 명칭</label>
              <input
                type="text"
                value={newDressForm.silhouette}
                onChange={(e) => setNewDressForm({ ...newDressForm, silhouette: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">원단 및 소재 스펙</label>
              <input
                type="text"
                value={newDressForm.fabric}
                onChange={(e) => setNewDressForm({ ...newDressForm, fabric: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">디자인 특징 및 설명</label>
              <textarea
                rows={3}
                value={newDressForm.description}
                onChange={(e) => setNewDressForm({ ...newDressForm, description: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-lg"
              />
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 text-[11px] space-y-1">
              <strong>S2B2C 파트너 혜택 안내:</strong>
              <div>본 상품이 대여될 때마다 디자이너에게 <strong>대여료의 3%</strong>, 제조 공방에 <strong>대여료의 3%</strong>가 지속 지급됩니다.</div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>신규 상품 등록 및 PMS 심사 요청 (U1 완료)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ROYALTIES DASHBOARD */}
      {activeTab === 'royalties' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-indigo-700 uppercase">로열티 정산 (SCR-SCM-005)</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              디자이너 3% 및 생산공방 3% 지속 대여 로열티 실시간 집계
            </h3>
            <p className="text-slate-500 mt-1">
              전통적인 단발성 매입 모델과 달리, 옷이 전국 및 해외 샵에서 회전될 때마다 창작자와 제작자에게 수익이 영구 공유됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">디자이너 로열티 (3%) 정산 현황</span>
                <span className="text-indigo-700 font-bold">누적: ₩17,400,000</span>
              </div>
              <div className="space-y-1 text-slate-600">
                <div>• Grace Kim Studio (Seoul): ₩6,480,000 (14회 대여 연동)</div>
                <div>• Marie Atelier (Paris): ₩5,940,000 (22회 대여 연동)</div>
                <div>• Zhang & Park Collaboration: ₩3,780,000 (11회 대여 연동)</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">제조 공방 로열티 (3%) 정산 현황</span>
                <span className="text-indigo-700 font-bold">누적: ₩17,400,000</span>
              </div>
              <div className="space-y-1 text-slate-600">
                <div>• 상하이 1공방 (Shanghai Atelier): ₩9,240,000 (장인 12명 배분)</div>
                <div>• 쑤저우 웨딩공방 (Suzhou Craft): ₩5,760,000 (자수 장인 배분)</div>
                <div>• 광저우 정밀공방 (Guangzhou): ₩2,400,000 (부자재 공방 배분)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
