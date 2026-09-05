import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, CheckCircle, ShieldCheck, 
  Sparkles, Lock, User, Mail, ChevronDown, 
  Globe, AlertCircle, RefreshCw, LogIn, UserPlus
} from 'lucide-react';
import { useAuth, SocialProvider, UserRole } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal,
    sendPhoneOtp, 
    verifyPhoneOtp, 
    registerWithPhone, 
    loginWithPhone, 
    loginWithSocial,
    isLoading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(authModalMode);
  
  // Country and Phone (중국 항저우 기준 기본 설정)
  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('138-5718-8888');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('B2C');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode from context
  useEffect(() => {
    setActiveTab(authModalMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (otpSent && timerSeconds > 0 && !isPhoneVerified) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds, isPhoneVerified]);

  if (!isAuthModalOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Send OTP
  const handleSendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMessage('올바른 휴대전화 번호를 입력해주세요.');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const result = await sendPhoneOtp(fullPhone);

    if (result.success) {
      setOtpSent(true);
      setTimerSeconds(180);
      setIsPhoneVerified(false);
      setSuccessMessage(result.message);
      if (result.testCode) {
        setTestOtpNotice(`[중국 항저우 SMS 시뮬레이션] 인증번호는 [${result.testCode}] 입니다.`);
        // auto-fill suggestion for quick demo
        setOtpCode(result.testCode);
      }
    } else {
      setErrorMessage(result.message || '인증번호 발송에 실패했습니다.');
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async () => {
    setErrorMessage(null);
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('6자리 인증번호를 정확히 입력해주세요.');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const result = await verifyPhoneOtp(fullPhone, otpCode);

    if (result.success) {
      setIsPhoneVerified(true);
      setSuccessMessage('휴대전화 번호 인증이 성공적으로 완료되었습니다.');
      setErrorMessage(null);
    } else {
      setErrorMessage(result.message || '인증번호가 일치하지 않거나 만료되었습니다.');
    }
  };

  // 3. Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    if (!isPhoneVerified) {
      setErrorMessage('휴대전화 번호 인증을 완료해주세요.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('서비스 이용약관 및 개인정보 수집에 동의해주세요.');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const res = await registerWithPhone({
      name: name.trim(),
      phone: fullPhone,
      email: email.trim() || undefined,
      role,
    });

    if (!res.success) {
      setErrorMessage(res.message || '회원가입에 실패했습니다.');
    }
  };

  // 4. Submit Phone Login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phoneNumber.trim()) {
      setErrorMessage('휴대전화 번호를 입력해주세요.');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const res = await loginWithPhone(fullPhone);

    if (!res.success) {
      setErrorMessage(res.message || '로그인에 실패했습니다.');
    }
  };

  // 5. Social Login
  const handleSocialClick = async (provider: SocialProvider) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const res = await loginWithSocial(provider);
    if (!res.success) {
      setErrorMessage(res.message || `${provider} 소셜 로그인에 실패했습니다.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black tracking-tight">TOBMALL</h3>
                <span className="text-[10px] font-bold uppercase bg-white/20 px-1.5 py-0.5 rounded text-purple-100">
                  Global Wedding
                </span>
              </div>
              <p className="text-xs text-purple-200">회원가입 및 소셜 연동 통합 인증 센터</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switching: 로그인 vs 회원가입 */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-3.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>로그인 (Login)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            className={`py-3.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'signup'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>간편 회원가입 (Sign Up)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Notifications */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. 소셜 계정 연동 버튼 그룹 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                1초 소셜 계정 간편 연동
              </span>
              <span className="text-[10px] text-purple-600 font-semibold">비밀번호 없이 즉시 연동</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* 1. WeChat (위챗 / 微信) */}
              <button
                type="button"
                onClick={() => handleSocialClick('wechat')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#07C160] hover:bg-[#06ad56] text-white font-bold rounded-xl transition shadow-2xs text-xs"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M8.5 15c-4.14 0-7.5-2.91-7.5-6.5C1 4.91 4.36 2 8.5 2c4.14 0 7.5 2.91 7.5 6.5 0 .72-.13 1.41-.37 2.05-.2.53-.47 1.03-.8 1.48L16 14.5l-2.18-.75C12.44 14.52 10.53 15 8.5 15zm7.25-4c-.16 0-.32.01-.48.04.45.92.73 1.94.73 3.01 0 .76-.14 1.48-.39 2.15l1.64.57-.86-1.78c.68-.86 1.1-1.92 1.1-3.09 0-2.48-2.24-4.5-5-4.5h-.24c1.88.94 3.2 2.62 3.48 4.6zm-8.25-4a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm6.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5zm2.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                <span>위챗(WeChat / 微信)으로 1초 간편 로그인</span>
              </button>

              {/* 2. Alipay (알리페이 / 支付宝) */}
              <button
                type="button"
                onClick={() => handleSocialClick('alipay')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#1677FF] hover:bg-[#0958d9] text-white font-bold rounded-xl transition shadow-2xs text-xs"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 1024 1024">
                  <path d="M853.333333 170.666667v682.666666H170.666667V170.666667h682.666666m85.333334-85.333334H85.333333v853.333334h853.333334V85.333333z"/>
                  <path d="M469.333333 384h213.333334v-85.333333H554.666667v-85.333334h-85.333334v85.333334H298.666667v85.333333h170.666666v85.333333H341.333333v85.333334h128c0 78.933333-51.2 149.333333-149.333333 181.333333 17.066667 29.866667 42.666667 61.866667 68.266667 87.466667 128-51.2 192-153.6 200.533333-268.8h170.666667v-85.333334H554.666667V384h-85.333334z"/>
                  <path d="M576 682.666667c42.666667-42.666667 74.666667-96 96-149.333334H576c-8.533333 53.333333-32 104.533333-64 149.333334l64 0z"/>
                </svg>
                <span>알리페이(Alipay / 支付宝) 계정으로 계속하기</span>
              </button>

              {/* 3. QQ (腾讯QQ) */}
              <button
                type="button"
                onClick={() => handleSocialClick('qq')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#12B7F5] hover:bg-[#0ea5db] text-white font-bold rounded-xl transition shadow-2xs text-xs"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 1024 1024">
                  <path d="M824.8 613.7c-17.6-42.4-44.5-98.1-66.2-132.8 1.1-12.8 1.7-25.7 1.7-38.6 0-149.7-111.4-271-248.8-271s-248.8 121.3-248.8 271c0 12.9 0.6 25.8 1.7 38.6-21.7 34.7-48.6 90.4-66.2 132.8-28.5 68.7-39.2 142.1-39.2 187.3 0 12.5 1.1 24.3 3.3 35.3 11.2 56.6 44.4 97.4 92.5 111.1 36.6 10.4 75.8 4.7 114.7-16.5 45.4 20.8 94.6 32.2 142 32.2 47.4 0 96.6-11.4 142-32.2 38.9 21.2 78.1 26.9 114.7 16.5 48.1-13.7 81.3-54.5 92.5-111.1 2.2-11 3.3-22.8 3.3-35.3 0-45.2-10.7-118.6-39.2-187.3z"/>
                </svg>
                <span>QQ(腾讯QQ) 계정으로 계속하기</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              또는 휴대전화 번호 인증
            </span>
          </div>

          {/* 2. 휴대전화 번호 본인인증 섹션 (중국 항저우 기준) */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>휴대전화 번호 본인인증</span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span>🇨🇳</span>
                  <span>중국 항저우(杭州) 기준</span>
                </span>
              </div>
              {isPhoneVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  인증완료
                </span>
              ) : (
                <span className="text-[10px] text-amber-600 font-semibold">인증 필요</span>
              )}
            </div>

            {/* Country code & Phone Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={isPhoneVerified}
                    className="appearance-none bg-white border border-slate-200 text-slate-800 font-semibold py-2 pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                  >
                    <option value="+86">🇨🇳 +86 (중국 항저우 杭州)</option>
                    <option value="+82">🇰🇷 +82 (한국)</option>
                    <option value="+1">🇺🇸 +1 (미국)</option>
                    <option value="+81">🇯🇵 +81 (일본)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="138-5718-8888 (항저우 11자리)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isPhoneVerified}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isPhoneVerified || isLoading}
                  className="shrink-0 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition text-xs shadow-2xs whitespace-nowrap"
                >
                  {otpSent ? '재발송' : '인증번호 발송'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>📍 항저우(杭州) 지역번호 0571 / 중국 이동통신 SMS 실명 인증</span>
              </div>

              {/* OTP Input and verification timer */}
              {otpSent && !isPhoneVerified && (
                <div className="space-y-1.5 pt-1 animate-in fade-in">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6자리 인증번호"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold tracking-widest text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[11px] text-purple-600">
                        {formatTime(timerSeconds)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-2xs whitespace-nowrap"
                    >
                      확인
                    </button>
                  </div>

                  {testOtpNotice && (
                    <div className="flex items-center justify-between text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                      <span>{testOtpNotice}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode('778899');
                        }}
                        className="text-[10px] font-bold text-purple-900 underline hover:text-purple-700"
                      >
                        간편 테스트코드 (778899)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 3. 로그인 탭 폼 */}
          {activeTab === 'login' && (
            <form onSubmit={handlePhoneLogin} className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>휴대전화 번호로 로그인</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-slate-500 text-[11px]">
                <span>계정이 없으신가요?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-purple-700 font-bold hover:underline"
                >
                  간편 회원가입하기
                </button>
              </div>
            </form>
          )}

          {/* 4. 회원가입 탭 폼 */}
          {activeTab === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  회원 성명 (실명) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="예: 王小美 (Wang Xiaomei) 또는 김지은"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  이메일 주소 <span className="text-slate-400 font-normal">(선택)</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="xiaomei@wedding.cn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Membership Role */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  회원 구분 (플랫폼 역할) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('B2C')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition text-xs ${
                      role === 'B2C'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 ring-1 ring-purple-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    예비 신랑·신부
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('PLANNER')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition text-xs ${
                      role === 'PLANNER'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 ring-1 ring-purple-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    웨딩 플래너
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('OSM')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition text-xs ${
                      role === 'OSM'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 ring-1 ring-purple-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    대리점/드레스샵
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-600 text-[11px] leading-tight">
                    [필수] TOBMALL 서비스 이용약관, 개인정보 수집 및 위치기반 피팅 예약 안내에 동의합니다.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>회원가입 완료 및 로그인</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
                <span>이미 계정이 있으신가요?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-purple-700 font-bold hover:underline"
                >
                  로그인하기
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Security Guarantee */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL 암호화 본인인증 & Cloud SQL 보안 저장</span>
          </div>
          <span className="font-semibold text-slate-400">UNINET Security</span>
        </div>
      </div>
    </div>
  );
};
