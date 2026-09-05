import React, { useState, useRef, useEffect } from 'react';
import { 
  User, LogIn, UserPlus, LogOut, CheckCircle, 
  ChevronDown, ShieldCheck, Smartphone, Sparkles, Heart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  variant?: 'compact' | 'full';
}

export const UserMenu: React.FC<UserMenuProps> = ({ variant = 'compact' }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'PLANNER': return '웨딩 플래너';
      case 'OSM': return '대리점/샵';
      case 'SCM': return '제작 공방';
      case 'PMS': return '본사 운영';
      case 'B2C':
      default: return '예비 신랑·신부';
    }
  };

  const getProviderBadge = (provider?: string) => {
    switch (provider) {
      case 'wechat':
        return <span className="bg-[#07C160] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">WeChat (微信)</span>;
      case 'alipay':
        return <span className="bg-[#1677FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">알리페이 (支付宝)</span>;
      case 'qq':
        return <span className="bg-[#12B7F5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">QQ (腾讯QQ)</span>;
      case 'kakao':
        return <span className="bg-[#FEE500] text-[#191919] text-[10px] font-bold px-1.5 py-0.5 rounded">카카오</span>;
      case 'google':
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Google</span>;
      default:
        return <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">휴대폰 본인인증</span>;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => openAuthModal('login')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-purple-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs"
        >
          <LogIn className="w-3.5 h-3.5 text-slate-500" />
          <span>로그인</span>
        </button>
        <button
          onClick={() => openAuthModal('signup')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>회원가입</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs text-left"
      >
        <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 overflow-hidden shrink-0">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
            {user.phoneVerified && (
              <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" title="휴대전화 본인인증 완료" />
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
            {getRoleLabel(user.role)}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Card */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-slate-900 text-xs">{user.name}님</span>
              {getProviderBadge(user.provider)}
            </div>
            
            <div className="space-y-1 text-[11px] text-slate-600">
              {user.phone && (
                <div className="flex items-center gap-1 text-slate-700 font-mono">
                  <Smartphone className="w-3 h-3 text-purple-600" />
                  <span>{user.phone}</span>
                  {user.phoneVerified && (
                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      인증됨
                    </span>
                  )}
                </div>
              )}
              {user.email && (
                <div className="text-slate-500 truncate">{user.email}</div>
              )}
            </div>
          </div>

          {/* Quick Info & Security */}
          <div className="px-4 py-2 border-b border-slate-100 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">회원 등급</span>
              <span className="font-bold text-purple-700">{getRoleLabel(user.role)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">인증 상태</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                보안 인증 완료
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1 space-y-0.5">
            <button
              onClick={() => {
                setDropdownOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              <span>휴대전화 번호 재인증 / 소셜 연동</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃 (Sign Out)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
