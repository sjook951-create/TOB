import React, { useState, useEffect } from 'react';
import { 
  X, Video, ExternalLink, Copy, Check, Sparkles, Plus, 
  Radio, Users, Flame, Heart, Share2, Globe, QrCode,
  Edit3, Trash2, Smartphone, Eye
} from 'lucide-react';

export interface TiktokLinkItem {
  id: string;
  title: string;
  hostName: string;
  followers: string;
  url: string;
  viewers: string;
  isLive: boolean;
  description: string;
  category: string;
  isCustom?: boolean;
}

interface TiktokWanghongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_TIKTOK_LINKS: TiktokLinkItem[] = [
  {
    id: 'tt-official',
    title: 'TOBMALL 2026 S/S 신작 컬렉션 쇼룸 라이브',
    hostName: 'TOBMALL Official (@tobmall_wedding)',
    followers: '850K',
    url: 'https://www.tiktok.com/@tobmall_wedding/live',
    viewers: '18.4K',
    isLive: true,
    description: '상하이 플래그십 아틀리에 본식 드레스 실시간 런웨이 및 피팅 룸 스트리밍',
    category: '공식 쇼룸',
  },
  {
    id: 'tt-wanghong-xiaowei',
    title: '탑 왕홍 [샤오웨이(小薇)]의 본식 드레스 셀렉션',
    hostName: '왕홍 샤오웨이 (@xiaowei_bride_live)',
    followers: '3.2M',
    url: 'https://www.tiktok.com/@xiaowei_bride_live',
    viewers: '42.8K',
    isLive: true,
    description: '신부 체형별 맞춤 라인 추천 & 실시간 피팅룸 예약 특별 프로모션',
    category: '스타 왕홍',
  },
  {
    id: 'tt-k-wedding',
    title: 'K-웨딩 & 하이엔드 오뜨꾸뛰르 디자이너 인터뷰',
    hostName: '정하윤 수석 플래너 (@k_wedding_global)',
    followers: '420K',
    url: 'https://www.tiktok.com/@k_wedding_global',
    viewers: '9.2K',
    isLive: false,
    description: '한국 청담동 드레스 공방 제작 비하인드 및 플래너 1:1 상담 하이라이트',
    category: '디자이너',
  }
];

export const TiktokWanghongModal: React.FC<TiktokWanghongModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [links, setLinks] = useState<TiktokLinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('tobmall_custom_tiktok_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...DEFAULT_TIKTOK_LINKS, ...parsed];
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TIKTOK_LINKS;
  });

  const [selectedLinkId, setSelectedLinkId] = useState<string>(DEFAULT_TIKTOK_LINKS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQrForId, setShowQrForId] = useState<string | null>(null);

  // Custom link input form state (왕홍이 원하는 틱톡 링크 연결 기능)
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customHostName, setCustomHostName] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('https://www.tiktok.com/@');
  const [customDescription, setCustomDescription] = useState<string>('');

  if (!isOpen) return null;

  const selectedLink = links.find((item) => item.id === selectedLinkId) || links[0];

  const handleCopyLink = (item: TiktokLinkItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customTitle.trim()) {
      alert('방송 제목과 틱톡 링크 URL을 입력해주세요.');
      return;
    }

    const newLink: TiktokLinkItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      hostName: customHostName.trim() || '내 틱톡 채널',
      followers: '내 팔로워',
      url: customUrl.trim(),
      viewers: '라이브 대기',
      isLive: true,
      description: customDescription.trim() || '왕홍 직접 지정 실시간 틱톡 라이브 스트리밍',
      category: '왕홍 맞춤 연동',
      isCustom: true,
    };

    const updated = [newLink, ...links];
    setLinks(updated);
    setSelectedLinkId(newLink.id);
    setIsAddingCustom(false);

    // Save custom links to localStorage
    try {
      const customOnly = updated.filter((item) => item.isCustom);
      localStorage.setItem('tobmall_custom_tiktok_links', JSON.stringify(customOnly));
    } catch (err) {
      console.error(err);
    }

    // Reset form
    setCustomTitle('');
    setCustomHostName('');
    setCustomUrl('https://www.tiktok.com/@');
    setCustomDescription('');
  };

  const handleDeleteCustomLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = links.filter((item) => item.id !== id);
    setLinks(filtered);
    if (selectedLinkId === id) {
      setSelectedLinkId(filtered[0]?.id || DEFAULT_TIKTOK_LINKS[0].id);
    }
    try {
      const customOnly = filtered.filter((item) => item.isCustom);
      localStorage.setItem('tobmall_custom_tiktok_links', JSON.stringify(customOnly));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 text-slate-800 transition-all flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f2fe] via-[#fe0979] to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">틱톡(TikTok · 抖音) 라이브 커머스 연동</h3>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  왕홍 LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                사전 등록된 드레스 방송 바로가기 및 왕홍 전용 틱톡 링크 연결
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Top Bar: Wanghong Custom Link Register Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 rounded-xl border border-rose-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  왕홍(网红) 맞춤 틱톡 링크 연동
                </span>
                <span className="text-[11px] text-slate-600">
                  자신이 원하는 틱톡 라이브 룸이나 채널 URL을 직접 등록하여 쇼룸과 연동할 수 있습니다.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCustom ? '입력창 닫기' : '원하는 틱톡 링크 직접 등록'}</span>
            </button>
          </div>

          {/* Wanghong Custom Link Input Form */}
          {isAddingCustom && (
            <form 
              onSubmit={handleAddCustomLink}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                  새로운 틱톡 링크 정보 등록
                </span>
                <span className="text-[11px] text-slate-500">등록 시 즉시 목록에 추가되어 연결됩니다</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    라이브 방송 제목 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: [왕홍 미나] TOBMALL 단독 드레스 피팅 라이브"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    왕홍 닉네임 / 채널명
                  </label>
                  <input
                    type="text"
                    placeholder="예: 왕홍 미나 (@mina_wedding)"
                    value={customHostName}
                    onChange={(e) => setCustomHostName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  틱톡(TikTok) 링크 URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://www.tiktok.com/@username/live 또는 채널 링크"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  도우인(Douyin 抖音) 링크 또는 틱톡 라이브 룸 웹/앱 주소를 입력하세요.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  방송 소개 / 추천 멘트
                </label>
                <input
                  type="text"
                  placeholder="예: 실시간 채팅으로 원하는 드레스 피팅 번호를 남겨주시면 바로 착용해 드립니다!"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  틱톡 링크 등록 완료
                </button>
              </div>
            </form>
          )}

          {/* Two Columns: Left (Link Cards) & Right (Selected Link Preview & Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Registered Links List (5 cols) */}
            <div className="lg:col-span-6 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span className="font-bold text-slate-700">사전 등록 틱톡 채널 ({links.length}개)</span>
                <span>클릭하여 미리보기</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {links.map((item) => {
                  const isSelected = item.id === selectedLinkId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLinkId(item.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50/50 shadow-xs ring-1 ring-rose-300'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            item.isCustom
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {item.category}
                          </span>
                          {item.isLive && (
                            <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.2 rounded-full flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                          )}
                        </div>

                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomLink(item.id, e)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span className="truncate">{item.hostName}</span>
                        {item.isLive && (
                          <span className="text-rose-600 font-bold flex items-center gap-0.5 shrink-0">
                            <Users className="w-3 h-3" />
                            {item.viewers}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Action Panel (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between border border-slate-800">
              <div className="space-y-3">
                {/* Active Link Title & Host */}
                <div className="pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedLink.category}
                    </span>
                    {selectedLink.isLive && (
                      <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        실시간 방송 중
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                    {selectedLink.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    진행: <strong className="text-slate-200">{selectedLink.hostName}</strong> (팔로워 {selectedLink.followers})
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 leading-relaxed">
                  {selectedLink.description}
                </p>

                {/* Live Stream URL Box */}
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate font-mono text-[11px] text-slate-300">
                    {selectedLink.url}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(selectedLink)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-medium shrink-0 transition"
                  >
                    {copiedId === selectedLink.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>링크 복사</span>
                      </>
                    )}
                  </button>
                </div>

                {/* QR Code toggle box for Mobile Scanning */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowQrForId(showQrForId === selectedLink.id ? null : selectedLink.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-rose-400" />
                    <span>{showQrForId === selectedLink.id ? '모바일 QR 코드 접기' : '스마트폰 틱톡 앱으로 스캔하기 (QR코드)'}</span>
                  </button>

                  {showQrForId === selectedLink.id && (
                    <div className="mt-2 p-3 bg-white text-slate-900 rounded-xl text-center flex flex-col items-center animate-in fade-in duration-150">
                      {/* Stylized QR mockup */}
                      <div className="w-28 h-28 bg-slate-50 border border-slate-200 p-2 rounded-lg relative flex items-center justify-center">
                        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                          <rect x="5" y="5" width="28" height="28" rx="2" fill="#000" />
                          <rect x="9" y="9" width="20" height="20" rx="1" fill="#fff" />
                          <rect x="13" y="13" width="12" height="12" fill="#000" />

                          <rect x="67" y="5" width="28" height="28" rx="2" fill="#000" />
                          <rect x="71" y="9" width="20" height="20" rx="1" fill="#fff" />
                          <rect x="75" y="13" width="12" height="12" fill="#000" />

                          <rect x="5" y="67" width="28" height="28" rx="2" fill="#000" />
                          <rect x="9" y="71" width="20" height="20" rx="1" fill="#fff" />
                          <rect x="13" y="75" width="12" height="12" fill="#000" />

                          <rect x="38" y="10" width="8" height="8" fill="#fe0979" />
                          <rect x="50" y="10" width="8" height="8" fill="#00f2fe" />
                          <rect x="38" y="24" width="6" height="6" fill="#000" />
                          <rect x="10" y="38" width="8" height="6" fill="#000" />
                          <rect x="24" y="42" width="6" height="8" fill="#fe0979" />
                          <rect x="40" y="40" width="20" height="20" rx="3" fill="#000" />
                          <rect x="70" y="40" width="8" height="8" fill="#000" />
                          <rect x="82" y="42" width="8" height="6" fill="#00f2fe" />
                          <rect x="40" y="68" width="8" height="8" fill="#000" />
                          <rect x="54" y="72" width="6" height="6" fill="#fe0979" />
                          <rect x="70" y="68" width="10" height="10" fill="#000" />
                          <rect x="84" y="80" width="8" height="8" fill="#000" />
                        </svg>
                        <div className="absolute w-6 h-6 rounded-full bg-black border border-white flex items-center justify-center text-white text-[9px] font-bold">
                          TT
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        틱톡 또는 스마트폰 카메라로 스캔하면 방송으로 즉시 이동합니다
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => handleOpenLink(selectedLink.url)}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>틱톡(TikTok) 라이브 바로가기 (새 창)</span>
                </button>

                <p className="text-[10px] text-center text-slate-500">
                  ※ 클릭 시 틱톡 웹사이트 또는 모바일 틱톡 앱으로 안전하게 연결됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>TOBMALL 왕홍 라이브 연계 O2O 쇼룸 플랫폼</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
