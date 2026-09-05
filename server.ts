import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getAllBookings, createBooking, updateBookingStatus, deleteBooking } from "./src/db/bookings.ts";
import { upsertUser, getUserByUid, getUserByPhone } from "./src/db/users.ts";
import { optionalAuth, AuthRequest } from "./src/middleware/auth.ts";

// In-memory store for phone OTP verification codes
const phoneVerificationStore = new Map<string, { code: string; expiresAt: number }>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "TOBMALL Cloud SQL Booking Engine", timestamp: new Date().toISOString() });
  });

  // --- AUTHENTICATION & PHONE VERIFICATION APIS ---

  // POST /api/auth/phone/send-otp - 발송된 6자리 인증번호
  app.post("/api/auth/phone/send-otp", (req, res) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "휴대전화 번호를 입력해주세요." });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    phoneVerificationStore.set(cleanPhone, { code: otpCode, expiresAt });

    console.log(`[SMS OTP 발송] Phone: ${cleanPhone}, Code: ${otpCode}`);

    res.json({
      success: true,
      message: `[TOBMALL 중국 항저우(杭州) 센터] 인증번호 [${otpCode}]가 ${cleanPhone} 번호로 발송되었습니다. (유효시간: 3분)`,
      phone: cleanPhone,
      testCode: otpCode, // Provided for instant testing preview
      expiresAt,
    });
  });

  // POST /api/auth/phone/verify-otp - 인증번호 검증
  app.post("/api/auth/phone/verify-otp", (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: "전화번호와 인증번호를 입력해주세요." });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const record = phoneVerificationStore.get(cleanPhone);

    // Allow universal test code '778899' or stored code
    const isMasterCode = code.trim() === '778899';
    const isValid = isMasterCode || (record && record.code === code.trim() && Date.now() <= record.expiresAt);

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        error: record && Date.now() > record.expiresAt ? "인증번호가 만료되었습니다. 다시 요청해주세요." : "인증번호가 일치하지 않습니다." 
      });
    }

    // Mark verified
    phoneVerificationStore.delete(cleanPhone);

    res.json({
      success: true,
      message: "중국 항저우 기준 휴대전화 번호 본인인증이 성공적으로 완료되었습니다.",
      verified: true,
      phone: cleanPhone,
    });
  });

  // POST /api/auth/signup - 회원가입 및 Cloud SQL 저장
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, phone, email, role, provider, photoUrl } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: "회원 성명을 입력해주세요." });
      }

      const uid = `USER-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const savedUser = await upsertUser({
        uid,
        name,
        phone: phone || undefined,
        email: email || `${uid.toLowerCase()}@tobmall.com`,
        role: role || 'B2C',
        provider: provider || 'phone',
        phoneVerified: phone ? 'true' : 'false',
        photoUrl: photoUrl || undefined,
      });

      res.status(201).json({
        success: true,
        message: `${name}님의 회원가입이 완료되었습니다.`,
        user: savedUser,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, error: error.message || "회원가입 처리 중 오류 발생" });
    }
  });

  // POST /api/auth/social - 소셜 계정 연동 및 로그인 (Google, Kakao, WeChat, Apple)
  app.post("/api/auth/social", async (req, res) => {
    try {
      const { uid, name, email, provider, photoUrl, role, phone } = req.body;
      if (!uid || !name) {
        return res.status(400).json({ success: false, error: "소셜 인증 정보가 누락되었습니다." });
      }

      const savedUser = await upsertUser({
        uid,
        name,
        email: email || `${provider}_${uid.slice(-6)}@tobmall.com`,
        provider: provider || 'social',
        photoUrl,
        role: role || 'B2C',
        phone: phone || undefined,
        phoneVerified: phone ? 'true' : 'false',
      });

      res.json({
        success: true,
        message: `${provider.toUpperCase()} 소셜 계정 연동 로그인이 완료되었습니다.`,
        user: savedUser,
      });
    } catch (error: any) {
      console.error("Social login error:", error);
      res.status(500).json({ success: false, error: error.message || "소셜 계정 연동 실패" });
    }
  });

  // POST /api/auth/login - 일반 로그인 (휴대폰 또는 이메일)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier } = req.body; // Phone number or email
      if (!identifier) {
        return res.status(400).json({ success: false, error: "전화번호 또는 아이디를 입력해주세요." });
      }

      const cleanPhone = identifier.replace(/[^0-9+]/g, '');
      let existingUser = await getUserByPhone(cleanPhone);

      if (!existingUser) {
        // Automatically create session profile for seamless demo experience
        const uid = `USER-${Date.now()}`;
        existingUser = await upsertUser({
          uid,
          name: identifier.includes('@') ? identifier.split('@')[0] : '웨딩 고객',
          phone: cleanPhone || undefined,
          email: identifier.includes('@') ? identifier : undefined,
          role: 'B2C',
          provider: 'phone',
          phoneVerified: 'true',
        });
      }

      res.json({
        success: true,
        message: "로그인되었습니다.",
        user: existingUser,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: error.message || "로그인 처리 실패" });
    }
  });

  // GET /api/bookings - Retrieve all fitting bookings from Cloud SQL
  app.get("/api/bookings", async (req, res) => {
    try {
      const rows = await getAllBookings();
      // Map schema columns to the frontend BookingItem interface
      const bookings = rows.map((r) => ({
        id: r.bookingCode,
        customerName: r.customerName,
        phone: r.phone,
        storeName: r.storeName,
        date: r.date,
        timeSlot: r.timeSlot,
        fittingRoom: r.fittingRoom,
        selectedDresses: (r.selectedDresses as string[]) || [],
        weddingDate: r.weddingDate,
        weddingVenue: r.weddingVenue,
        plannerCode: r.plannerCode || undefined,
        status: r.status as '예약확정' | '피팅완료' | '계약체결' | '취소',
        assignedStylist: r.assignedStylist || undefined,
        createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
      }));

      res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to fetch bookings from database" });
    }
  });

  // POST /api/bookings - Create a new fitting reservation in Cloud SQL
  app.post("/api/bookings", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const {
        customerName,
        phone,
        storeName,
        date,
        timeSlot,
        fittingRoom,
        selectedDresses,
        weddingDate,
        weddingVenue,
        plannerCode,
        status,
        assignedStylist
      } = req.body;

      if (!customerName || !phone || !storeName || !date || !timeSlot) {
        return res.status(400).json({ success: false, error: "필수 예약 항목(고객명, 연락처, 지점, 일시)이 누락되었습니다." });
      }

      const inserted = await createBooking({
        customerName,
        phone,
        storeName,
        date,
        timeSlot,
        fittingRoom: fittingRoom || "VIP 피팅룸 A",
        selectedDresses: Array.isArray(selectedDresses) ? selectedDresses : [],
        weddingDate: weddingDate || "미정",
        weddingVenue: weddingVenue || "미정",
        plannerCode,
        status: status || "예약확정",
        assignedStylist,
        userUid: req.user?.uid,
      });

      res.status(201).json({
        success: true,
        data: {
          id: inserted.bookingCode,
          customerName: inserted.customerName,
          phone: inserted.phone,
          storeName: inserted.storeName,
          date: inserted.date,
          timeSlot: inserted.timeSlot,
          fittingRoom: inserted.fittingRoom,
          selectedDresses: (inserted.selectedDresses as string[]) || [],
          weddingDate: inserted.weddingDate,
          weddingVenue: inserted.weddingVenue,
          plannerCode: inserted.plannerCode || undefined,
          status: inserted.status as '예약확정' | '피팅완료' | '계약체결' | '취소',
          assignedStylist: inserted.assignedStylist || undefined,
        }
      });
    } catch (error: any) {
      console.error("Error creating booking:", error);
      res.status(500).json({ success: false, error: error.message || "예약 데이터베이스 저장에 실패했습니다." });
    }
  });

  // PATCH /api/bookings/:code/status - Update reservation status
  app.patch("/api/bookings/:code/status", async (req, res) => {
    try {
      const { code } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: "변경할 상태값이 필요합니다." });
      }

      const updated = await updateBookingStatus(code, status);
      if (!updated) {
        return res.status(404).json({ success: false, error: "해당 예약을 찾을 수 없습니다." });
      }

      res.json({ success: true, data: updated });
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ success: false, error: error.message || "예약 상태 변경 실패" });
    }
  });

  // DELETE /api/bookings/:code - Cancel / remove reservation
  app.delete("/api/bookings/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const deleted = await deleteBooking(code);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "해당 예약을 찾을 수 없습니다." });
      }
      res.json({ success: true, message: "예약이 데이터베이스에서 삭제되었습니다.", data: deleted });
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ success: false, error: error.message || "예약 삭제 실패" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
