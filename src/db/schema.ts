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
