import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Trash2, Shield, CheckCircle2, 
  RefreshCw, Smartphone, Mail, Globe, Database,
  UserCheck, X, ShieldAlert, Sparkles, ExternalLink, Table
} from 'lucide-react';

export interface DbUser {
  id: number;
  uid: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  phoneVerified?: string | null;
  role: string;
  provider?: string | null;
  photoUrl?: string | null;
  createdAt?: string | null;
}

export const MemberManagementView: React.FC = () => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDeletingUid, setIsDeletingUid] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'B2C',
    provider: 'phone',
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showNotification('회원 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${uid}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
        showNotification(`회원 권한이 '${newRole}'(으)로 변경되었습니다.`);
      } else {
        showNotification(data.error || '권한 변경 실패');
      }
    } catch (err) {
      showNotification('권한 변경 중 통신 오류가 발생했습니다.');
    }
  };

  const handleDeleteUser = async (uid: string, name: string) => {
    if (!window.confirm(`정말로 [${name}] 회원을 데이터베이스에서 삭제하시겠습니까?`)) {
      return;
    }
    setIsDeletingUid(uid);
    try {
      const res = await fetch(`/api/users/${uid}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.uid !== uid));
        showNotification(`[${name}] 회원이 정상적으로 삭제되었습니다.`);
      } else {
        showNotification(data.error || '회원 삭제 실패');
      }
    } catch (err) {
      showNotification('회원 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeletingUid(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim()) {
      alert('회원 이름을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name.trim(),
          phone: newUser.phone.trim() || undefined,
          email: newUser.email.trim() || undefined,
          role: newUser.role,
          provider: newUser.provider,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers(prev => [data.user, ...prev]);
        setIsAddModalOpen(false);
        setNewUser({ name: '', phone: '', email: '', role: 'B2C', provider: 'phone' });
        showNotification(`[${data.user.name}] 회원이 Cloud SQL에 성공적으로 등록되었습니다.`);
      } else {
        alert(data.error || '회원 등록 실패');
      }
    } catch (err) {
      alert('회원 등록 처리 중 오류가 발생했습니다.');
    }
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRoleFilter === 'ALL' || user.role === selectedRoleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      user.uid.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  // Role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PMS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PLANNER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'OSM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SCM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'B2C':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getProviderBadge = (provider?: string | null) => {
    switch (provider) {
      case 'google':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Google</span>;
      case 'wechat':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> WeChat</span>;
      case 'kakao':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Kakao</span>;
      case 'apple':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Apple</span>;
      case 'phone':
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"><Smartphone className="w-3 h-3" /> SMS OTP</span>;
    }
  };

  // Metrics
  const totalCount = users.length;
  const verifiedCount = users.filter(u => u.phoneVerified === 'true' || u.phoneVerified === 'verified').length;
  const b2cCount = users.filter(u => u.role === 'B2C').length;
  const partnerCount = users.filter(u => u.role !== 'B2C').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  회원 데이터베이스 통합 관리 (Cloud SQL PostgreSQL)
                </h3>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Google Cloud SQL (asia-southeast1) 인스턴스에 저장된 실시간 회원 레코드 및 권한을 제어합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>동기화</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>신규 회원 수동 등록</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>총 등록 회원수</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalCount}명</span>
          <span className="text-[10px] text-purple-600 font-semibold">Cloud SQL 영구 보관</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>본인인증(OTP) 완료</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">{verifiedCount}명</span>
          <span className="text-[10px] text-slate-500">
            인증률 {totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0}%
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>B2C 신랑/신부 고객</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-xl font-bold text-indigo-600 mt-1 block">{b2cCount}명</span>
          <span className="text-[10px] text-slate-500">웨딩 드레스 피팅 예약 대상</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>파트너/운영진 계정</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-amber-600 mt-1 block">{partnerCount}명</span>
          <span className="text-[10px] text-slate-500">플래너 · 점장 · 공방 · 본사</span>
        </div>
      </div>

      {/* Supabase Studio Direct Management Banner */}
      <div className="bg-emerald-950/90 text-white p-4 rounded-xl border border-emerald-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-300">Supabase Studio (Table Editor) 연동</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                rlcmybikhtagbfcmgxkf
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Supabase 웹 대시보드에서 스프레드시트 뷰로 회원 및 예약 데이터를 실시간 직접 수정·관리할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://supabase.com/dashboard/project/rlcmybikhtagbfcmgxkf/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <span>Supabase Studio 열기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="이름, 전화번호, 이메일, UID 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-purple-600"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { key: 'ALL', label: '전체' },
            { key: 'B2C', label: 'B2C 고객' },
            { key: 'PLANNER', label: '플래너' },
            { key: 'OSM', label: 'OSM 대리점' },
            { key: 'SCM', label: 'SCM 공방' },
            { key: 'PMS', label: 'PMS 본사' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedRoleFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedRoleFilter === f.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">회원 정보</th>
                <th className="py-3 px-4">연락처 & 인증</th>
                <th className="py-3 px-4">인증 수단</th>
                <th className="py-3 px-4">시스템 역할 (Role)</th>
                <th className="py-3 px-4">가입 일시</th>
                <th className="py-3 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                    Cloud SQL 회원 레코드를 불러오는 중입니다...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    조회된 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.uid} className="hover:bg-slate-50/80 transition">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.name.slice(0, 1)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {user.uid}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Verification */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-800">{user.phone || '-'}</span>
                          {user.phoneVerified === 'true' || user.phoneVerified === 'verified' ? (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">인증완료</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">미인증</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{user.email || '미등록'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3 px-4">
                      {getProviderBadge(user.provider)}
                    </td>

                    {/* Role selector */}
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.uid, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${getRoleBadge(user.role)}`}
                      >
                        <option value="B2C">B2C 고객</option>
                        <option value="PLANNER">PLANNER 플래너</option>
                        <option value="OSM">OSM 매장</option>
                        <option value="SCM">SCM 공방</option>
                        <option value="PMS">PMS 본사</option>
                      </select>
                    </td>

                    {/* Created At */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }) : '최근 가입'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.uid, user.name)}
                        disabled={isDeletingUid === user.uid}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="회원 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">신규 회원 수동 등록</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">회원 성명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 박지현"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">휴대전화 번호</label>
                <input
                  type="text"
                  placeholder="예: +82-10-1234-5678"
                  value={newUser.phone}
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">이메일 주소</label>
                <input
                  type="email"
                  placeholder="예: user@tobmall.com"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 focus:outline-hidden text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">시스템 권한 (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 focus:outline-hidden text-xs"
                  >
                    <option value="B2C">B2C 고객</option>
                    <option value="PLANNER">PLANNER 플래너</option>
                    <option value="OSM">OSM 제휴매장</option>
                    <option value="SCM">SCM 공방</option>
                    <option value="PMS">PMS 본사</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">가입 채널 (Provider)</label>
                  <select
                    value={newUser.provider}
                    onChange={e => setNewUser({ ...newUser, provider: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 focus:outline-hidden text-xs"
                  >
                    <option value="phone">휴대폰 SMS</option>
                    <option value="google">Google</option>
                    <option value="wechat">WeChat (微信)</option>
                    <option value="kakao">Kakao</option>
                    <option value="apple">Apple</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Cloud SQL에 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
