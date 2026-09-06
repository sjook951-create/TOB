import { eq } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import { users } from './schema.ts';

export interface UserInput {
  uid: string;
  email?: string;
  name: string;
  phone?: string;
  phoneVerified?: string;
  role?: string;
  provider?: string;
  photoUrl?: string;
  plannerNumber?: string;
}

// In-memory fallback users cache
const inMemoryUsers: (typeof users.$inferSelect)[] = [];

export async function upsertUser(input: UserInput) {
  if (isDatabaseConfigured && db) {
    try {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.uid, input.uid))
        .limit(1);

      if (existing.length > 0) {
        const [updated] = await db
          .update(users)
          .set({
            name: input.name || existing[0].name,
            email: input.email || existing[0].email,
            phone: input.phone || existing[0].phone,
            phoneVerified: input.phoneVerified || existing[0].phoneVerified,
            role: input.role || existing[0].role,
            provider: input.provider || existing[0].provider,
            photoUrl: input.photoUrl || existing[0].photoUrl,
            plannerNumber: input.plannerNumber || existing[0].plannerNumber,
          })
          .where(eq(users.uid, input.uid))
          .returning();
        if (updated) return updated;
      } else {
        const [inserted] = await db
          .insert(users)
          .values({
            uid: input.uid,
            email: input.email || null,
            name: input.name,
            phone: input.phone || null,
            phoneVerified: input.phoneVerified || 'false',
            role: input.role || 'B2C',
            provider: input.provider || 'phone',
            photoUrl: input.photoUrl || null,
            plannerNumber: input.plannerNumber || null,
          })
          .returning();
        if (inserted) return inserted;
      }
    } catch (error) {
      console.warn("[Cloud SQL] upsertUser failed, falling back to in-memory store:", error);
    }
  }

  // In-memory fallback
  const existingIndex = inMemoryUsers.findIndex(u => u.uid === input.uid);
  if (existingIndex !== -1) {
    const existing = inMemoryUsers[existingIndex];
    const updated: typeof users.$inferSelect = {
      ...existing,
      name: input.name || existing.name,
      email: input.email || existing.email,
      phone: input.phone || existing.phone,
      phoneVerified: input.phoneVerified || existing.phoneVerified,
      role: input.role || existing.role,
      provider: input.provider || existing.provider,
      photoUrl: input.photoUrl || existing.photoUrl,
      plannerNumber: input.plannerNumber || existing.plannerNumber,
    };
    inMemoryUsers[existingIndex] = updated;
    return updated;
  } else {
    const newUser: typeof users.$inferSelect = {
      id: inMemoryUsers.length + 1,
      uid: input.uid,
      email: input.email || null,
      name: input.name,
      phone: input.phone || null,
      phoneVerified: input.phoneVerified || 'false',
      role: input.role || 'B2C',
      provider: input.provider || 'phone',
      photoUrl: input.photoUrl || null,
      plannerNumber: input.plannerNumber || null,
      createdAt: new Date(),
    };
    inMemoryUsers.push(newUser);
    return newUser;
  }
}

export async function getUserByUid(uid: string) {
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.uid, uid))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (error) {
      console.warn("[Cloud SQL] getUserByUid failed:", error);
    }
  }
  return inMemoryUsers.find(u => u.uid === uid) || null;
}

export async function getUserByPhone(phone: string) {
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (error) {
      console.warn("[Cloud SQL] getUserByPhone failed:", error);
    }
  }
  return inMemoryUsers.find(u => u.phone === phone) || null;
}

export async function getUserByPlannerNumber(plannerNumber: string) {
  if (!plannerNumber) return null;
  const clean = plannerNumber.trim();
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.plannerNumber, clean))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (error) {
      console.warn("[Cloud SQL] getUserByPlannerNumber failed:", error);
    }
  }
  return inMemoryUsers.find(u => u.plannerNumber === clean) || null;
}

export async function getAllUsers() {
  if (isDatabaseConfigured && db) {
    try {
      const rows = await db
        .select()
        .from(users)
        .orderBy(users.createdAt);
      return rows.reverse();
    } catch (error) {
      console.warn("[Cloud SQL] getAllUsers failed:", error);
    }
  }
  return [...inMemoryUsers].reverse();
}

export async function deleteUser(uid: string) {
  if (isDatabaseConfigured && db) {
    try {
      await db.delete(users).where(eq(users.uid, uid));
      return true;
    } catch (error) {
      console.warn("[Cloud SQL] deleteUser failed:", error);
    }
  }
  const idx = inMemoryUsers.findIndex(u => u.uid === uid);
  if (idx !== -1) {
    inMemoryUsers.splice(idx, 1);
    return true;
  }
  return false;
}

export async function updateUserRole(uid: string, role: string) {
  if (isDatabaseConfigured && db) {
    try {
      const [updated] = await db
        .update(users)
        .set({ role })
        .where(eq(users.uid, uid))
        .returning();
      if (updated) return updated;
    } catch (error) {
      console.warn("[Cloud SQL] updateUserRole failed:", error);
    }
  }
  const user = inMemoryUsers.find(u => u.uid === uid);
  if (user) {
    user.role = role;
    return user;
  }
  return null;
}
