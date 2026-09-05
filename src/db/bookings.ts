import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
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

export async function getAllBookings() {
  try {
    const rows = await db
      .select()
      .from(fittingBookings)
      .orderBy(desc(fittingBookings.createdAt));
    return rows;
  } catch (error) {
    console.error("Failed to query fitting_bookings:", error);
    throw new Error("데이터베이스 예약 목록 조회 중 오류가 발생했습니다.", { cause: error });
  }
}

export async function createBooking(input: CreateBookingInput) {
  try {
    const code = input.bookingCode || `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
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
    return inserted;
  } catch (error) {
    console.error("Failed to insert booking into fitting_bookings:", error);
    throw new Error("데이터베이스 예약 등록 중 오류가 발생했습니다.", { cause: error });
  }
}

export async function updateBookingStatus(bookingCode: string, status: string) {
  try {
    const [updated] = await db
      .update(fittingBookings)
      .set({ status })
      .where(eq(fittingBookings.bookingCode, bookingCode))
      .returning();
    return updated;
  } catch (error) {
    console.error(`Failed to update booking status for ${bookingCode}:`, error);
    throw new Error("예약 상태 업데이트 중 오류가 발생했습니다.", { cause: error });
  }
}

export async function deleteBooking(bookingCode: string) {
  try {
    const [deleted] = await db
      .delete(fittingBookings)
      .where(eq(fittingBookings.bookingCode, bookingCode))
      .returning();
    return deleted;
  } catch (error) {
    console.error(`Failed to delete booking ${bookingCode}:`, error);
    throw new Error("예약 삭제 중 오류가 발생했습니다.", { cause: error });
  }
}
