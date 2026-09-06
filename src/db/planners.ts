import { eq } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import { planners } from './schema.ts';

export interface PlannerInput {
  plannerNumber: string; // 8-digit format: '26-00275'
  name: string;
  phone: string;
  email?: string;
  agency?: string;
  grade?: string;
  status?: string;
  userUid?: string;
  commissionRate?: string;
}

export interface PlannerRecord {
  id: number;
  plannerNumber: string;
  name: string;
  phone: string;
  email: string | null;
  agency: string | null;
  grade: string | null;
  status: string;
  userUid: string | null;
  commissionRate: string | null;
  totalBookings: string | null;
  createdAt: Date | null;
}

// Initial seed dataset representing certified planners issued by HQ
const inMemoryPlanners: PlannerRecord[] = [
  {
    id: 1,
    plannerNumber: '26-00275',
    name: '정하윤 수석 플래너',
    phone: '010-8742-9912',
    email: 'hayun.jung@tobmall.com',
    agency: '본사 직속 프리미엄 센터',
    grade: '수석 플래너 (Master)',
    status: '인증완료',
    userUid: 'USER-PLN-00275',
    commissionRate: '15%',
    totalBookings: '28',
    createdAt: new Date('2026-01-15T09:00:00Z'),
  },
  {
    id: 2,
    plannerNumber: '26-00104',
    name: '김다은 책임 플래너',
    phone: '010-3381-4472',
    email: 'daeun.kim@tobmall.com',
    agency: '상하이 와이탄 지사',
    grade: '책임 플래너 (Senior)',
    status: '인증완료',
    userUid: 'USER-PLN-00104',
    commissionRate: '15%',
    totalBookings: '19',
    createdAt: new Date('2026-02-01T10:30:00Z'),
  },
  {
    id: 3,
    plannerNumber: '26-00389',
    name: '이소영 수석 플래너',
    phone: '010-4421-9981',
    email: 'soyoung.lee@tobmall.com',
    agency: '베이징 차오양 지사',
    grade: '수석 플래너 (Master)',
    status: '인증완료',
    userUid: 'USER-PLN-00389',
    commissionRate: '15%',
    totalBookings: '34',
    createdAt: new Date('2026-02-18T14:20:00Z'),
  },
  {
    id: 4,
    plannerNumber: '26-00512',
    name: '박민지 전임 플래너',
    phone: '010-5512-3341',
    email: 'minji.park@tobmall.com',
    agency: '서울 청담 부티크 파트너스',
    grade: '전임 플래너 (Associate)',
    status: '인증완료',
    userUid: 'USER-PLN-00512',
    commissionRate: '15%',
    totalBookings: '12',
    createdAt: new Date('2026-03-10T11:00:00Z'),
  },
  {
    id: 5,
    plannerNumber: '26-00715',
    name: '최유리 플래너',
    phone: '010-8812-4419',
    email: 'yuri.choi@tobmall.com',
    agency: '본사 직속 프리미엄 센터',
    grade: '공인 플래너 (Junior)',
    status: '가입대기',
    userUid: null,
    commissionRate: '15%',
    totalBookings: '0',
    createdAt: new Date('2026-04-01T09:00:00Z'),
  },
  {
    id: 6,
    plannerNumber: '26-00820',
    name: '황지민 플래너',
    phone: '010-7719-2234',
    email: 'jimin.hwang@tobmall.com',
    agency: '서울 청담 부티크 파트너스',
    grade: '책임 플래너 (Senior)',
    status: '가입대기',
    userUid: null,
    commissionRate: '15%',
    totalBookings: '0',
    createdAt: new Date('2026-04-02T10:00:00Z'),
  },
  {
    id: 7,
    plannerNumber: '26-00991',
    name: '강서연 플래너',
    phone: '010-6623-1190',
    email: 'seoyeon.kang@tobmall.com',
    agency: '상하이 와이탄 지사',
    grade: '수석 플래너 (Master)',
    status: '가입대기',
    userUid: null,
    commissionRate: '15%',
    totalBookings: '0',
    createdAt: new Date('2026-04-03T11:30:00Z'),
  },
];

/**
 * Validates whether the given string is in the official 8-digit format:
 * e.g., '26-00275' (2 digits, hyphen, 5 digits)
 */
export function validatePlannerNumberFormat(plannerNumber: string): boolean {
  if (!plannerNumber) return false;
  const clean = plannerNumber.trim();
  return /^\d{2}-\d{5}$/.test(clean);
}

/**
 * Normalizes user input into 8-character format if numbers only (e.g. '2600275' -> '26-00275')
 */
export function normalizePlannerNumber(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^\d{2}-\d{5}$/.test(trimmed)) {
    return trimmed;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length === 7) {
    return `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2)}`;
  }
  return trimmed;
}

/**
 * Retrieves all registered planners
 */
export async function getAllPlanners(): Promise<PlannerRecord[]> {
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db.select().from(planners).orderBy(planners.createdAt);
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          ...r,
          email: r.email || null,
          agency: r.agency || null,
          grade: r.grade || null,
          userUid: r.userUid || null,
          commissionRate: r.commissionRate || null,
          totalBookings: r.totalBookings || null,
          createdAt: r.createdAt ? new Date(r.createdAt) : null,
        }));
      }
    } catch (error) {
      console.warn('[Cloud SQL] getAllPlanners failed, using in-memory store:', error);
    }
  }
  return [...inMemoryPlanners];
}

/**
 * Retrieves a planner by their 8-digit planner number
 */
export async function getPlannerByNumber(plannerNumber: string): Promise<PlannerRecord | null> {
  const normalized = normalizePlannerNumber(plannerNumber);
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(planners)
        .where(eq(planners.plannerNumber, normalized))
        .limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          ...r,
          email: r.email || null,
          agency: r.agency || null,
          grade: r.grade || null,
          userUid: r.userUid || null,
          commissionRate: r.commissionRate || null,
          totalBookings: r.totalBookings || null,
          createdAt: r.createdAt ? new Date(r.createdAt) : null,
        };
      }
    } catch (error) {
      console.warn('[Cloud SQL] getPlannerByNumber failed:', error);
    }
  }

  const found = inMemoryPlanners.find(p => p.plannerNumber === normalized);
  return found || null;
}

/**
 * Registers or updates a planner in the planners table
 */
export async function upsertPlanner(input: PlannerInput): Promise<PlannerRecord> {
  const normalizedNumber = normalizePlannerNumber(input.plannerNumber);

  if (isDatabaseConfigured && db) {
    try {
      const existing = await db
        .select()
        .from(planners)
        .where(eq(planners.plannerNumber, normalizedNumber))
        .limit(1);

      if (existing.length > 0) {
        const [updated] = await db
          .update(planners)
          .set({
            name: input.name,
            phone: input.phone,
            email: input.email || existing[0].email,
            agency: input.agency || existing[0].agency,
            grade: input.grade || existing[0].grade,
            status: input.status || existing[0].status,
            userUid: input.userUid || existing[0].userUid,
            commissionRate: input.commissionRate || existing[0].commissionRate,
          })
          .where(eq(planners.plannerNumber, normalizedNumber))
          .returning();
        if (updated) return updated as PlannerRecord;
      } else {
        const [inserted] = await db
          .insert(planners)
          .values({
            plannerNumber: normalizedNumber,
            name: input.name,
            phone: input.phone,
            email: input.email || null,
            agency: input.agency || '본사 직속 파트너스',
            grade: input.grade || '인증 플래너',
            status: input.status || '인증완료',
            userUid: input.userUid || null,
            commissionRate: input.commissionRate || '15%',
            totalBookings: '0',
          })
          .returning();
        if (inserted) return inserted as PlannerRecord;
      }
    } catch (error) {
      console.warn('[Cloud SQL] upsertPlanner failed, falling back to memory store:', error);
    }
  }

  // Fallback in-memory
  const existingIdx = inMemoryPlanners.findIndex(p => p.plannerNumber === normalizedNumber);
  if (existingIdx !== -1) {
    const existing = inMemoryPlanners[existingIdx];
    const updated: PlannerRecord = {
      ...existing,
      name: input.name,
      phone: input.phone,
      email: input.email || existing.email,
      agency: input.agency || existing.agency,
      grade: input.grade || existing.grade,
      status: input.status || existing.status,
      userUid: input.userUid || existing.userUid,
      commissionRate: input.commissionRate || existing.commissionRate,
    };
    inMemoryPlanners[existingIdx] = updated;
    return updated;
  } else {
    const newRecord: PlannerRecord = {
      id: inMemoryPlanners.length + 1,
      plannerNumber: normalizedNumber,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      agency: input.agency || '본사 직속 파트너스',
      grade: input.grade || '인증 플래너',
      status: input.status || '인증완료',
      userUid: input.userUid || null,
      commissionRate: input.commissionRate || '15%',
      totalBookings: '0',
      createdAt: new Date(),
    };
    inMemoryPlanners.push(newRecord);
    return newRecord;
  }
}

/**
 * Deletes a planner by their 8-digit planner number
 */
export async function deletePlanner(plannerNumber: string): Promise<boolean> {
  const normalizedNumber = normalizePlannerNumber(plannerNumber);
  if (isDatabaseConfigured && db) {
    try {
      await db.delete(planners).where(eq(planners.plannerNumber, normalizedNumber));
    } catch (error) {
      console.warn('[Cloud SQL] deletePlanner failed:', error);
    }
  }
  const idx = inMemoryPlanners.findIndex(p => p.plannerNumber === normalizedNumber);
  if (idx !== -1) {
    inMemoryPlanners.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * Updates a planner's status or commission rate
 */
export async function updatePlanner(plannerNumber: string, updates: Partial<PlannerInput>): Promise<PlannerRecord | null> {
  const normalizedNumber = normalizePlannerNumber(plannerNumber);
  const existing = await getPlannerByNumber(normalizedNumber);
  if (!existing) return null;

  return upsertPlanner({
    plannerNumber: normalizedNumber,
    name: updates.name || existing.name,
    phone: updates.phone || existing.phone,
    email: updates.email || existing.email || undefined,
    agency: updates.agency || existing.agency || undefined,
    grade: updates.grade || existing.grade || undefined,
    status: updates.status || existing.status,
    commissionRate: updates.commissionRate || existing.commissionRate || undefined,
    userUid: updates.userUid || existing.userUid || undefined,
  });
}
