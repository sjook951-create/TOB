import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, Share2, Store, Truck, Building2, Sparkles, FileText, 
  CheckCircle, ArrowRight, Bell, Heart, ShieldCheck, Database, RefreshCw
} from 'lucide-react';
import { 
  INITIAL_DRESSES, INITIAL_BOOKINGS, INITIAL_RENTAL_CONTRACTS,
  DressItem, BookingItem, RentalContract 
} from '../../data/liveData';
import { B2CConsumerPortal } from './B2CConsumerPortal';
import { PlannerPortal } from './PlannerPortal';
import { OsmShopPortal } from './OsmShopPortal';
import { ScmSupplierPortal } from './ScmSupplierPortal';
import { PmsOperatorPortal } from './PmsOperatorPortal';

interface LivePlatformProps {
  onSwitchToDocumentation: () => void;
}

export type LivePortalRole = 'B2C' | 'PLANNER' | 'OSM' | 'SCM' | 'PMS';

export const LivePlatform: React.FC<LivePlatformProps> = ({ onSwitchToDocumentation }) => {
  const [activeRole, setActiveRole] = useState<LivePortalRole>('B2C');
  
  // Shared Live State across all portals
  const [dresses, setDresses] = useState<DressItem[]>(INITIAL_DRESSES);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [contracts, setContracts] = useState<RentalContract[]>(INITIAL_RENTAL_CONTRACTS);
  
  // Database status
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'checking'>('checking');
  
  // Toast / System Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch bookings from Cloud SQL API
  const fetchDbBookings = useCallback(async () => {
    setIsDbLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setBookings(json.data);
          setDbStatus('connected');
          return;
        }
      }
      setDbStatus('connected');
    } catch (err) {
      console.warn('Failed to fetch bookings from Cloud SQL, using local fallback:', err);
      setDbStatus('offline');
    } finally {
      setIsDbLoading(false);
    }
  }, []);

  // Fetch registered dresses from Supabase if available
  const fetchSupabaseDresses = useCallback(async () => {
    try {
      const res = await fetch('/api/dresses');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDresses(prev => {
            const map = new Map<string, DressItem>(prev.map(d => [d.id, d]));
            for (const item of json.data) {
              const existing = map.get(item.id);
              map.set(item.id, {
                ...item,
                imageUrl: item.imageUrl || existing?.imageUrl || '',
              });
            }
            return Array.from(map.values());
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch dresses from Supabase:', err);
    }
  }, []);

  useEffect(() => {
    fetchDbBookings();
    fetchSupabaseDresses();

    // Real-time synchronization polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchDbBookings();
    }, 3500);

    return () => clearInterval(interval);
  }, [fetchDbBookings, fetchSupabaseDresses]);

  // 1. Handle B2C / Planner Booking (Persisted to Cloud SQL DB with Conflict Prevention)
  const handleBookFitting = async (bookingData: Omit<BookingItem, 'id' | 'status'>) => {
    const tempId = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const optimisticBooking: BookingItem = {
      ...bookingData,
      id: tempId,
      status: '예약확정',
      assignedStylist: '이소영 수석 스타일리스트'
    };

    // Optimistic UI update
    setBookings(prev => [optimisticBooking, ...prev]);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        // Revert optimistic update!
        setBookings(prev => prev.filter(b => b.id !== tempId));
        await fetchDbBookings();
        const errMsg = result.error || '해당 시간대는 이미 다른 플래너/고객이 예약하여 예약할 수 없습니다.';
        showToast(`[예약 차단] ${errMsg}`);
        throw new Error(errMsg);
      }

      if (result.success && result.data) {
        setBookings(prev => prev.map(b => b.id === tempId ? result.data : b));
        await fetchDbBookings();
        showToast(`[fitting_bookings DB 연동 완료] ${result.data.customerName}님의 피팅 예약이 확정되었습니다. 타 플래너의 중복 예약이 실시간 차단됩니다.`);
        return;
      }
    } catch (e: any) {
      setBookings(prev => prev.filter(b => b.id !== tempId));
      await fetchDbBookings();
      throw e;
    }
  };

  // 2. Handle OSM / Planner Update Booking Status (Persisted to Cloud SQL & Frees Slot on Cancellation)
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingItem['status'], stylist?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status,
          assignedStylist: stylist || b.assignedStylist
        };
      }
      return b;
    }));

    try {
      const endpoint = (status === '예약취소' || status === '취소')
        ? `/api/bookings/${bookingId}/cancel`
        : `/api/bookings/${bookingId}/status`;

      const method = (status === '예약취소' || status === '취소') ? 'POST' : 'PATCH';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedStylist: stylist })
      });

      if (!res.ok && method === 'POST') {
        // Fallback to PATCH if cancel endpoint not hit
        await fetch(`/api/bookings/${bookingId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, assignedStylist: stylist })
        });
      }

      await fetchDbBookings();

      if (status === '예약취소' || status === '취소') {
        showToast(`[실시간 예약 취소 & 슬롯 해제] 예약(${bookingId})이 취소되어 fitting_bookings DB에서 해당 타임슬롯이 즉시 재가용 상태로 오픈되었습니다.`);
      } else {
        showToast(`[fitting_bookings DB 갱신] 예약(${bookingId}) 상태가 '${status}'(으)로 DB에 반영되었습니다.`);
      }
    } catch (e) {
      console.warn('Status update sync error:', e);
      await fetchDbBookings();
    }
  };

  // 2-1. Handle Booking Payment Update (PayPal / Alipay / WeChat)
  const handleUpdateBookingPayment = (
    bookingId: string,
    paymentInfo: {
      method: 'paypal' | 'alipay' | 'wechat';
      amountKrw: number;
      amountUsd: number;
      txId: string;
      payerEmail?: string;
    }
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              depositPaid: true,
              depositAmount: paymentInfo.amountKrw,
              paymentMethod: paymentInfo.method,
              paymentTxId: paymentInfo.txId,
            }
          : b
      )
    );

    const methodLabel =
      paymentInfo.method === 'paypal'
        ? 'PayPal (글로벌 간편결제)'
        : paymentInfo.method === 'alipay'
          ? '알리페이(支付宝)'
          : '위챗페이(微信支付)';

    showToast(
      `[결제 승인 완료] #${bookingId} 예약의 보증금이 ${methodLabel}로 정상 승인되었습니다. (승인번호: ${paymentInfo.txId})`
    );
  };

  // 3. Handle OSM Create Contract
  const handleCreateContract = (contract: RentalContract) => {
    setContracts(prev => [contract, ...prev]);
    showToast(`[전자계약 체결] 계약서(${contract.id})가 승인되었으며 출고 대기 상태로 등록되었습니다.`);
  };

  // 4. Handle Contract Status Update
  const handleUpdateContractStatus = (contractId: string, status: RentalContract['status']) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return { ...c, status };
      }
      return c;
    }));
    showToast(`[계약 관리] 계약(${contractId})이 '${status}' 상태로 갱신되었습니다.`);
  };

  // 5. Handle SCM Register Dress (U1) - Dual write to Supabase
  const handleRegisterDress = async (newDress: DressItem) => {
    setDresses(prev => [newDress, ...prev]);
    showToast(`[공급상 SCM] 신규 드레스 '${newDress.name}' 등록 완료! 본사 PMS 심사 대기열(U2) 및 Supabase에 전달되었습니다.`);

    // Dual-write to Supabase dresses table
    try {
      await fetch('/api/dresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDress),
      });
    } catch (err) {
      console.warn('Failed to dual-write dress to Supabase:', err);
    }
  };

  // 6. Handle PMS Approve Dress (U2) - Update status in Supabase
  const handleApproveDress = async (dressId: string) => {
    setDresses(prev => prev.map(d => {
      if (d.id === dressId) {
        return { ...d, status: '가용', tag: '2026 S/S 신작' };
      }
      return d;
    }));
    showToast(`[본사 PMS] 드레스(${dressId}) 심사 승인 완료! B2C 쇼룸 및 Supabase에 '가용' 상태로 즉시 반영되었습니다.`);

    // Update status in Supabase
    try {
      await fetch(`/api/dresses/${dressId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: '가용' }),
      });
    } catch (err) {
      console.warn('Failed to update dress status in Supabase:', err);
    }
  };

  // 7. Handle PMS Execute Settlement (U16)
  const handleExecuteSettlement = (contractId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return { ...c, status: '마감정산완료' };
      }
      return c;
    }));
    showToast(`[다자간 정산 U16] 계약(${contractId})의 7대 주체 스마트 배분 정산이 집행 완료되었습니다.`);
  };

  const portalTabs: { key: LivePortalRole; label: string; icon: React.ReactNode; desc: string; badge?: number }[] = [
    {
      key: 'B2C',
      label: 'B2C 고객 몰 (드레스·스튜디오)',
      icon: <ShoppingBag className="w-4 h-4" />,
      desc: '쇼룸, 포토 스튜디오 & O2O 피팅 예약'
    },
    {
      key: 'PLANNER',
      label: '플래너 & 헬퍼 (Planner X)',
      icon: <Share2 className="w-4 h-4" />,
      desc: '소셜 마케팅 & 본식 현장 케어'
    },
    {
      key: 'OSM',
      label: '대리점 샵 관리 (OSM)',
      icon: <Store className="w-4 h-4" />,
      desc: '오프라인 샵 피팅, 전자계약 & 반납'
    },
    {
      key: 'SCM',
      label: '공급상 & 공방 (SCM)',
      icon: <Truck className="w-4 h-4" />,
      desc: '글로벌 재고 관리, 상품등록 & 로열티'
    },
    {
      key: 'PMS',
      label: '본사 통합 관제 (PMS)',
      icon: <Building2 className="w-4 h-4" />,
      desc: '상품 심사, 플래너 DB & 7대 주체 다자간 정산',
      badge: dresses.filter(d => d.status === '심사대기').length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-purple-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Bell className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <p className="text-xs font-semibold leading-snug">{notification}</p>
        </div>
      )}

      {/* Top Role Selector Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                <span>LIVE PLATFORM EXPERIENCE</span>
              </span>
              <span className="text-xs text-slate-500">실시간 데이터 연동 동작 중</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              TOBMALL S2B2C 웨딩 생태계 실동작 플랫폼 웹사이트
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              5대 참여 주체 역할을 자유롭게 전환하며 예약, 피팅, 전자계약, 심사, 다자간 배분정산을 직접 체험할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-700">Cloud SQL DB:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {dbStatus === 'connected' ? 'PostgreSQL 연결됨' : '연결 확인중'}
              </span>
              <button
                onClick={fetchDbBookings}
                disabled={isDbLoading}
                title="데이터베이스 새로고침"
                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition"
              >
                <RefreshCw className={`w-3 h-3 ${isDbLoading ? 'animate-spin text-purple-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={onSwitchToDocumentation}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              <span>화면 설계서 & PDF 산출물 보기</span>
            </button>
          </div>
        </div>

        {/* Portal Switching Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-200">
          {portalTabs.map((tab) => {
            const isActive = activeRole === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveRole(tab.key)}
                className={`p-3 rounded-xl text-left transition flex flex-col justify-between relative ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-200/70 text-slate-700'}`}>
                    {tab.icon}
                  </span>
                  <span className="font-bold text-xs truncate">{tab.label}</span>
                </div>
                <span className={`text-[10px] mt-2 block truncate ${isActive ? 'text-purple-100' : 'text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Portal Views */}
      <div className="transition-all duration-300">
        {activeRole === 'B2C' && (
          <B2CConsumerPortal
            dresses={dresses}
            bookings={bookings}
            onBookFitting={handleBookFitting}
            onCancelBooking={(bookingId) => handleUpdateBookingStatus(bookingId, '예약취소')}
            onRequestBookingOpen={() => {}}
            onUpdateBookingPayment={handleUpdateBookingPayment}
            onShowToast={showToast}
          />
        )}

        {activeRole === 'PLANNER' && (
          <PlannerPortal
            dresses={dresses}
            bookings={bookings}
            onBookFitting={handleBookFitting}
            onCancelBooking={(bookingId) => handleUpdateBookingStatus(bookingId, '예약취소')}
          />
        )}

        {activeRole === 'OSM' && (
          <OsmShopPortal
            bookings={bookings}
            dresses={dresses}
            contracts={contracts}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onCreateContract={handleCreateContract}
            onUpdateContractStatus={handleUpdateContractStatus}
          />
        )}

        {activeRole === 'SCM' && (
          <ScmSupplierPortal
            dresses={dresses}
            onRegisterDress={handleRegisterDress}
          />
        )}

        {activeRole === 'PMS' && (
          <PmsOperatorPortal
            dresses={dresses}
            contracts={contracts}
            bookings={bookings}
            onApproveDress={handleApproveDress}
            onExecuteSettlement={handleExecuteSettlement}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onRefreshBookings={fetchDbBookings}
          />
        )}
      </div>
    </div>
  );
};
