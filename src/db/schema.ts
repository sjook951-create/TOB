import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Define the 'users' table with Firebase Auth UID / Account identifier
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Auth UID or custom ID
  email: text('email'),
  name: text('name'),
  phone: text('phone'),
  phoneVerified: text('phone_verified').default('false'),
  role: text('role').default('B2C'),
  provider: text('provider').default('phone'),
  photoUrl: text('photo_url'),
  plannerNumber: text('planner_number'), // HQ issued planner number (e.g. 26-00275)
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'planners' table for certified wedding planner registry
export const planners = pgTable('planners', {
  id: serial('id').primaryKey(),
  plannerNumber: text('planner_number').notNull().unique(), // HQ issued 8-digit unique code: 26-00275
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  agency: text('agency').default('본사 직속 파트너스'), // 소속 에이전시 / 대리점
  grade: text('grade').default('수석 플래너'),
  status: text('status').notNull().default('인증완료'), // '인증완료' | '심사대기' | '정지'
  userUid: text('user_uid'), // Linked Auth UID
  commissionRate: text('commission_rate').default('15%'),
  totalBookings: text('total_bookings').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'fitting_bookings' table for wedding dress fitting reservations
export const fittingBookings = pgTable('fitting_bookings', {
  id: serial('id').primaryKey(),
  bookingCode: text('booking_code').notNull().unique(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  storeName: text('store_name').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  fittingRoom: text('fitting_room').notNull(),
  selectedDresses: jsonb('selected_dresses').$type<string[]>().notNull().default([]),
  weddingDate: text('wedding_date').notNull(),
  weddingVenue: text('wedding_venue').notNull(),
  plannerCode: text('planner_code'),
  status: text('status').notNull().default('예약확정'),
  assignedStylist: text('assigned_stylist'),
  userUid: text('user_uid'),
  createdAt: timestamp('created_at').defaultNow(),
});
