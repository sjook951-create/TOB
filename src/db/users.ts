import { eq } from 'drizzle-orm';
import { db } from './index.ts';
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
}

export async function upsertUser(input: UserInput) {
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
        })
        .where(eq(users.uid, input.uid))
        .returning();
      return updated;
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
        })
        .returning();
      return inserted;
    }
  } catch (error) {
    console.error("Failed to upsert user in Cloud SQL:", error);
    throw error;
  }
}

export async function getUserByUid(uid: string) {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("Failed to query user by uid:", error);
    return null;
  }
}

export async function getUserByPhone(phone: string) {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("Failed to query user by phone:", error);
    return null;
  }
}
