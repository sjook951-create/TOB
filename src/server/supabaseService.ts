import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rlcmybikhtagbfcmgxkf.supabase.co';
const PROJECT_REF = 'rlcmybikhtagbfcmgxkf';

let supabaseClient: SupabaseClient | null = null;
let runtimeSupabaseKey: string | null = null;

export function setRuntimeSupabaseKey(key: string) {
  runtimeSupabaseKey = key ? key.trim() : null;
  supabaseClient = null; // reset client to re-initialize
}

export function getActiveSupabaseKey(): string | null {
  return runtimeSupabaseKey || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || null;
}

export function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  const key = getActiveSupabaseKey();
  return Boolean(key && key.trim().length > 0);
}

export function getSupabase(): SupabaseClient | null {
  const key = getActiveSupabaseKey();
  if (!key) {
    return null;
  }
  if (!supabaseClient) {
    const url = getSupabaseUrl();
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

export function getSupabaseProjectInfo() {
  const url = getSupabaseUrl();
  const configured = isSupabaseConfigured();
  
  // Extract project ref from URL if possible
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  const ref = match ? match[1] : PROJECT_REF;

  return {
    projectRef: ref,
    supabaseUrl: url,
    isConfigured: configured,
    dashboardUrl: `https://supabase.com/dashboard/project/${ref}`,
    tableEditorUrl: `https://supabase.com/dashboard/project/${ref}/editor`,
    sqlEditorUrl: `https://supabase.com/dashboard/project/${ref}/sql`,
    apiKeysUrl: `https://supabase.com/dashboard/project/${ref}/settings/api`,
  };
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- TOB MALL x SUPABASE STUDIO DDL SCRIPT
-- Project: sjook951-create's Project (${PROJECT_REF})
-- ==========================================

-- 1. users 테이블 (회원 관리)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  uid TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_verified TEXT DEFAULT 'false',
  role TEXT DEFAULT 'B2C',
  provider TEXT DEFAULT 'phone',
  photo_url TEXT,
  planner_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. planners 테이블 (본사 인증 플래너 전용 DB)
CREATE TABLE IF NOT EXISTS public.planners (
  id BIGSERIAL PRIMARY KEY,
  planner_number TEXT UNIQUE NOT NULL, -- 8자리 고유번호 (예: 26-00275)
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  agency TEXT DEFAULT '본사 직속 파트너스',
  grade TEXT DEFAULT '수석 플래너',
  status TEXT DEFAULT '인증완료' NOT NULL,
  user_uid TEXT,
  commission_rate TEXT DEFAULT '15%',
  total_bookings TEXT DEFAULT '0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. fitting_bookings 테이블 (오프라인 피팅 예약 관리)
CREATE TABLE IF NOT EXISTS public.fitting_bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  store_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  fitting_room TEXT NOT NULL,
  selected_dresses JSONB DEFAULT '[]'::jsonb NOT NULL,
  wedding_date TEXT NOT NULL,
  wedding_venue TEXT NOT NULL,
  planner_code TEXT,
  status TEXT DEFAULT '예약확정' NOT NULL,
  assigned_stylist TEXT,
  user_uid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. dresses 테이블 (웨딩 드레스 컬렉션 및 신규 등록 드레스 관리)
CREATE TABLE IF NOT EXISTS public.dresses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designer TEXT NOT NULL,
  workshop TEXT NOT NULL,
  category TEXT NOT NULL,
  rental_price BIGINT NOT NULL DEFAULT 0,
  deposit BIGINT NOT NULL DEFAULT 0,
  image_url TEXT,
  tag TEXT DEFAULT '2026 S/S',
  status TEXT NOT NULL DEFAULT '가용',
  silhouette TEXT NOT NULL DEFAULT 'A-Line',
  fabric TEXT NOT NULL DEFAULT 'Silk',
  rating NUMERIC(3, 1) DEFAULT 4.9,
  rental_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS) 활성화 및 개발/관리용 정책 생성
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitting_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dresses ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public access to users'
  ) THEN
    CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitting_bookings' AND policyname = 'Allow public access to fitting_bookings'
  ) THEN
    CREATE POLICY "Allow public access to fitting_bookings" ON public.fitting_bookings FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'dresses' AND policyname = 'Allow public access to dresses'
  ) THEN
    CREATE POLICY "Allow public access to dresses" ON public.dresses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. Supabase Realtime 복제 활성화 (Studio 실시간 변경 감지)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN duplicate_object THEN
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.fitting_bookings;
  EXCEPTION WHEN duplicate_object THEN
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.dresses;
  EXCEPTION WHEN duplicate_object THEN
  END;
END $$;
`;

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'SUPABASE_KEY가 아직 설정되지 않았습니다. 상단의 [Supabase API Keys 페이지 열기]에서 anon 또는 service_role 키를 복사한 후 등록해주세요.',
    };
  }

  try {
    const { data, error } = await client.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Supabase 연결 성공! 단, users 테이블이 아직 생성되지 않았습니다. SQL Editor에서 DDL 스크립트를 실행해주세요.',
          details: { tableMissing: true, error: error.message },
        };
      }
      return {
        success: false,
        message: `Supabase 쿼리 오류: ${error.message} (코드: ${error.code})`,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Supabase Studio 데이터베이스와 정상적으로 연결되었습니다!',
      details: { count: data },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `연결 테스트 중 예외 발생: ${err.message}`,
    };
  }
}

// Push local/CloudSQL users into Supabase
export async function syncUsersToSupabase(usersList: any[]): Promise<{ syncedCount: number; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { syncedCount: 0, error: 'SUPABASE_KEY not configured' };
  }

  try {
    const payload = usersList.map(u => ({
      uid: u.uid,
      name: u.name,
      email: u.email || null,
      phone: u.phone || null,
      phone_verified: u.phoneVerified || u.phone_verified || 'false',
      role: u.role || 'B2C',
      provider: u.provider || 'phone',
      photo_url: u.photoUrl || u.photo_url || null,
      created_at: u.createdAt || u.created_at || new Date().toISOString(),
    }));

    const { data, error } = await client
      .from('users')
      .upsert(payload, { onConflict: 'uid' })
      .select();

    if (error) {
      console.error('[Supabase] syncUsers error:', error);
      return { syncedCount: 0, error: error.message };
    }

    return { syncedCount: data?.length || payload.length };
  } catch (err: any) {
    console.error('[Supabase] syncUsers exception:', err);
    return { syncedCount: 0, error: err.message };
  }
}

// Push local/CloudSQL bookings into Supabase
export async function syncBookingsToSupabase(bookingsList: any[]): Promise<{ syncedCount: number; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { syncedCount: 0, error: 'SUPABASE_KEY not configured' };
  }

  try {
    const payload = bookingsList.map(b => ({
      booking_code: b.bookingCode || b.booking_code,
      customer_name: b.customerName || b.customer_name,
      phone: b.phone,
      store_name: b.storeName || b.store_name,
      date: b.date,
      time_slot: b.timeSlot || b.time_slot,
      fitting_room: b.fittingRoom || b.fitting_room,
      selected_dresses: b.selectedDresses || b.selected_dresses || [],
      wedding_date: b.weddingDate || b.wedding_date,
      wedding_venue: b.weddingVenue || b.wedding_venue,
      planner_code: b.plannerCode || b.planner_code || null,
      status: b.status || '예약확정',
      assigned_stylist: b.assignedStylist || b.assigned_stylist || null,
      user_uid: b.userUid || b.user_uid || null,
      created_at: b.createdAt || b.created_at || new Date().toISOString(),
    }));

    const { data, error } = await client
      .from('fitting_bookings')
      .upsert(payload, { onConflict: 'booking_code' })
      .select();

    if (error) {
      console.error('[Supabase] syncBookings error:', error);
      return { syncedCount: 0, error: error.message };
    }

    return { syncedCount: data?.length || payload.length };
  } catch (err: any) {
    console.error('[Supabase] syncBookings exception:', err);
    return { syncedCount: 0, error: err.message };
  }
}

// Fetch users from Supabase
export async function getSupabaseUsers(): Promise<any[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetch users error:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      uid: row.uid,
      name: row.name,
      email: row.email,
      phone: row.phone,
      phoneVerified: row.phone_verified,
      role: row.role,
      provider: row.provider,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('[Supabase] getSupabaseUsers exception:', err);
    return [];
  }
}

// Dual write user
export async function dualWriteUserToSupabase(user: any) {
  const client = getSupabase();
  if (!client) return;

  try {
    await client.from('users').upsert({
      uid: user.uid,
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
      phone_verified: user.phoneVerified || 'false',
      role: user.role || 'B2C',
      provider: user.provider || 'phone',
      photo_url: user.photoUrl || null,
      created_at: user.createdAt || new Date().toISOString(),
    }, { onConflict: 'uid' });
  } catch (err) {
    console.warn('[Supabase] dualWriteUserToSupabase failed:', err);
  }
}

// Dual write booking
export async function dualWriteBookingToSupabase(booking: any) {
  const client = getSupabase();
  if (!client) return;

  try {
    await client.from('fitting_bookings').upsert({
      booking_code: booking.bookingCode || booking.booking_code,
      customer_name: booking.customerName || booking.customer_name,
      phone: booking.phone,
      store_name: booking.storeName || booking.store_name,
      date: booking.date,
      time_slot: booking.timeSlot || booking.time_slot,
      fitting_room: booking.fittingRoom || booking.fitting_room,
      selected_dresses: booking.selectedDresses || booking.selected_dresses || [],
      wedding_date: booking.weddingDate || booking.wedding_date,
      wedding_venue: booking.weddingVenue || booking.wedding_venue,
      planner_code: booking.plannerCode || booking.planner_code || null,
      status: booking.status || '예약확정',
      assigned_stylist: booking.assignedStylist || booking.assigned_stylist || null,
      user_uid: booking.userUid || booking.user_uid || null,
      created_at: booking.createdAt || booking.created_at || new Date().toISOString(),
    }, { onConflict: 'booking_code' });
  } catch (err) {
    console.warn('[Supabase] dualWriteBookingToSupabase failed:', err);
  }
}

// Push dresses (initial + custom) into Supabase dresses table
export async function syncDressesToSupabase(dressesList: any[]): Promise<{ syncedCount: number; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { syncedCount: 0, error: 'SUPABASE_KEY not configured' };
  }

  try {
    const payload = dressesList.map(d => ({
      id: d.id,
      name: d.name,
      designer: d.designer,
      workshop: d.workshop || '항저우(杭州) 실크 공방',
      category: d.category || 'A-Line',
      rental_price: d.rentalPrice ?? d.rental_price ?? 0,
      deposit: d.deposit ?? 0,
      image_url: d.imageUrl ?? d.image_url ?? '',
      tag: d.tag || '2026 S/S',
      status: d.status || '가용',
      silhouette: d.silhouette || 'A-Line',
      fabric: d.fabric || 'Silk',
      rating: d.rating ?? 4.9,
      rental_count: d.rentalCount ?? d.rental_count ?? 0,
      description: d.description || '',
    }));

    // Batch upsert in chunks of 50
    const chunkSize = 50;
    let totalSynced = 0;
    for (let i = 0; i < payload.length; i += chunkSize) {
      const chunk = payload.slice(i, i + chunkSize);
      const { data, error } = await client
        .from('dresses')
        .upsert(chunk, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('[Supabase] syncDresses chunk error:', error);
        return { syncedCount: totalSynced, error: error.message };
      }
      totalSynced += data?.length || chunk.length;
    }

    return { syncedCount: totalSynced };
  } catch (err: any) {
    console.error('[Supabase] syncDresses exception:', err);
    return { syncedCount: 0, error: err.message };
  }
}

// Fetch all dresses from Supabase
export async function getSupabaseDresses(): Promise<any[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('dresses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetch dresses error:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      designer: row.designer,
      workshop: row.workshop,
      category: row.category,
      rentalPrice: Number(row.rental_price),
      deposit: Number(row.deposit),
      imageUrl: row.image_url,
      tag: row.tag,
      status: row.status,
      silhouette: row.silhouette,
      fabric: row.fabric,
      rating: Number(row.rating),
      rentalCount: Number(row.rental_count),
      description: row.description,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('[Supabase] getSupabaseDresses exception:', err);
    return [];
  }
}

// Dual write single dress to Supabase
export async function dualWriteDressToSupabase(dress: any) {
  const client = getSupabase();
  if (!client) return;

  try {
    await client.from('dresses').upsert({
      id: dress.id,
      name: dress.name,
      designer: dress.designer,
      workshop: dress.workshop || '항저우(杭州) 실크 공방',
      category: dress.category || 'A-Line',
      rental_price: dress.rentalPrice ?? dress.rental_price ?? 0,
      deposit: dress.deposit ?? 0,
      image_url: dress.imageUrl ?? dress.image_url ?? '',
      tag: dress.tag || '2026 S/S 신작',
      status: dress.status || '가용',
      silhouette: dress.silhouette || 'A-Line',
      fabric: dress.fabric || 'Silk',
      rating: dress.rating ?? 4.9,
      rental_count: dress.rentalCount ?? dress.rental_count ?? 0,
      description: dress.description || '',
    }, { onConflict: 'id' });
    console.log(`[Supabase] Dress ${dress.id} (${dress.name}) dual-written to Supabase dresses table`);
  } catch (err) {
    console.warn('[Supabase] dualWriteDressToSupabase failed:', err);
  }
}

// Update dress status in Supabase (e.g. '가용', '피팅중', '대여중', '심사대기')
export async function updateSupabaseDressStatus(dressId: string, status: string) {
  const client = getSupabase();
  if (!client) return;

  try {
    await client.from('dresses').update({ status }).eq('id', dressId);
    console.log(`[Supabase] Dress ${dressId} status updated to ${status}`);
  } catch (err) {
    console.warn('[Supabase] updateSupabaseDressStatus failed:', err);
  }
}

