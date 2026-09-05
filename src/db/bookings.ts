import { desc, eq } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import { fittingBookings } from './schema.ts';

export interface CreateBookingInput {
  bookingCode?: string;
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
  status?: string;
  assignedStylist?: string;
  userUid?: string;
}

// In-memory fallback dataset for seamless offline and preview operation
const inMemoryBookings: (typeof fittingBookings.$inferSelect)[] = [
  {
    id: 1,
    bookingCode: 'BK-2026-089',
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
    assignedStylist: '이소영 수석 스타일리스트',
    userUid: null,
    createdAt: new Date('2026-05-20T10:00:00Z'),
  },
  {
    id: 2,
    bookingCode: 'BK-2026-090',
    customerName: '최서현 & 이진호',
    phone: '010-3381-4472',
    storeName: '상하이 와이탄 플래그십 (Bund Flagship)',
    date: '2026-05-25',
    timeSlot: '11:00 ~ 13:00',
    fittingRoom: 'VIP Suite 2 (오트쿠튀르룸)',
    selectedDresses: ['DR-003', 'DR-006'],
    weddingDate: '2026-10-24',
    weddingVenue: '신라호텔 다이너스티홀',
    plannerCode: 'PLN-SH-104 (김다은 플래너)',
    status: '피팅완료',
    assignedStylist: '장웨이 수석 스타일리스트',
    userUid: null,
    createdAt: new Date('2026-05-21T14:30:00Z'),
  },
  {
    id: 3,
    bookingCode: 'BK-2026-091',
    customerName: '왕샤오통 & 장웨이',
    phone: '010-5592-8819',
    storeName: '상하이 와이탄 플래그십 (Bund Flagship)',
    date: '2026-05-26',
    timeSlot: '16:00 ~ 18:00',
    fittingRoom: 'VIP Suite 1 (로열룸)',
    selectedDresses: ['DR-005', 'DR-007'],
    weddingDate: '2026-11-08',
    weddingVenue: '반얀트리 클럽 앤 스파 서울',
    plannerCode: 'PLN-BJ-309 (린이 플래너)',
    status: '계약체결',
    assignedStylist: '천위안 총괄 실장',
    userUid: null,
    createdAt: new Date('2026-05-22T09:15:00Z'),
  },
];

export async function getAllBookings() {
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(fittingBookings)
        .orderBy(desc(fittingBookings.createdAt));
      return rows;
    } catch (error) {
      console.warn("[Cloud SQL] Query failed, using in-memory store:", error);
    }
  }
  return [...inMemoryBookings];
}

export async function createBooking(input: CreateBookingInput) {
  const code = input.bookingCode || `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

  if (isDatabaseConfigured && db) {
    try {
      const [inserted] = await db
        .insert(fittingBookings)
        .values({
          bookingCode: code,
          customerName: input.customerName,
          phone: input.phone,
          storeName: input.storeName,
          date: input.date,
          timeSlot: input.timeSlot,
          fittingRoom: input.fittingRoom,
          selectedDresses: input.selectedDresses || [],
          weddingDate: input.weddingDate,
          weddingVenue: input.weddingVenue,
          plannerCode: input.plannerCode || '직영 포털',
          status: input.status || '예약확정',
          assignedStylist: input.assignedStylist || '미배정 (배정 대기중)',
          userUid: input.userUid || null,
        })
        .returning();
      if (inserted) {
        return inserted;
      }
    } catch (error) {
      console.warn("[Cloud SQL] Insert failed, falling back to in-memory store:", error);
    }
  }

  // Fallback to in-memory store
  const newBooking: typeof fittingBookings.$inferSelect = {
    id: inMemoryBookings.length + 1,
    bookingCode: code,
    customerName: input.customerName,
    phone: input.phone,
    storeName: input.storeName,
    date: input.date,
    timeSlot: input.timeSlot,
    fittingRoom: input.fittingRoom || "VIP 피팅룸 A",
    selectedDresses: input.selectedDresses || [],
    weddingDate: input.weddingDate || "미정",
    weddingVenue: input.weddingVenue || "미정",
    plannerCode: input.plannerCode || '직영 포털',
    status: input.status || '예약확정',
    assignedStylist: input.assignedStylist || '미배정 (배정 대기중)',
    userUid: input.userUid || null,
    createdAt: new Date(),
  };
  inMemoryBookings.unshift(newBooking);
  return newBooking;
}

export async function updateBookingStatus(bookingCode: string, status: string) {
  if (isDatabaseConfigured && db) {
    try {
      const [updated] = await db
        .update(fittingBookings)
        .set({ status })
        .where(eq(fittingBookings.bookingCode, bookingCode))
        .returning();
      if (updated) {
        return updated;
      }
    } catch (error) {
      console.warn(`[Cloud SQL] Update failed for ${bookingCode}:`, error);
    }
  }

  const target = inMemoryBookings.find(b => b.bookingCode === bookingCode);
  if (target) {
    target.status = status;
    return target;
  }
  return null;
}

export async function deleteBooking(bookingCode: string) {
  if (isDatabaseConfigured && db) {
    try {
      const [deleted] = await db
        .delete(fittingBookings)
        .where(eq(fittingBookings.bookingCode, bookingCode))
        .returning();
      if (deleted) {
        return deleted;
      }
    } catch (error) {
      console.warn(`[Cloud SQL] Delete failed for ${bookingCode}:`, error);
    }
  }

  const index = inMemoryBookings.findIndex(b => b.bookingCode === bookingCode);
  if (index !== -1) {
    const [deleted] = inMemoryBookings.splice(index, 1);
    return deleted;
  }
  return null;
}
