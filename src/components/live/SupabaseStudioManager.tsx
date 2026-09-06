import React, { useState, useEffect } from 'react';
import { 
  Database, ExternalLink, Copy, Check, RefreshCw, 
  Table, Terminal, Key, CheckCircle2, AlertCircle, 
  ArrowUpRight, Sparkles, Send, ShieldCheck, HelpCircle,
  Eye, EyeOff
} from 'lucide-react';

interface SupabaseStatus {
  projectRef: string;
  supabaseUrl: string;
  isConfigured: boolean;
  dashboardUrl: string;
  tableEditorUrl: string;
  sqlEditorUrl: string;
  apiKeysUrl: string;
}

interface SupabaseStudioManagerProps {
  dresses?: any[];
}

export const SupabaseStudioManager: React.FC<SupabaseStudioManagerProps> = ({ dresses = [] }) => {
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; synced?: { users: number; bookings: number; dresses?: number } } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sql' | 'guide'>('overview');

  // API Key Setup State
  const [inputKey, setInputKey] = useState<string>('');
  const [showKeyText, setShowKeyText] = useState<boolean>(false);
  const [isSavingKey, setIsSavingKey] = useState<boolean>(false);
  const [keySaveMessage, setKeySaveMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [showKeyForm, setShowKeyForm] = useState<boolean>(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const [resStatus, resSchema] = await Promise.all([
        fetch('/api/supabase/status'),
        fetch('/api/supabase/schema'),
      ]);
      const dataStatus = await resStatus.json();
      if (dataStatus.success) {
        setStatus(dataStatus.data);
      }
      const schemaText = await resSchema.text();
      setSchemaSql(schemaText);
    } catch (err) {
      console.error('Failed to fetch Supabase status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSaveKey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) {
      setKeySaveMessage({ success: false, text: 'Supabase API 키(anon 또는 service_role)를 입력해주세요.' });
      return;
    }
    setIsSavingKey(true);
    setKeySaveMessage(null);
    try {
      const res = await fetch('/api/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: inputKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setKeySaveMessage({ success: true, text: 'Supabase API 키가 성공적으로 등록 및 검증되었습니다!' });
        setInputKey('');
        await fetchStatus();
        if (data.testResult) {
          setTestResult(data.testResult);
        }
      } else {
        setKeySaveMessage({ success: false, text: data.error || '키 등록 실패' });
      }
    } catch (err: any) {
      setKeySaveMessage({ success: false, text: `키 등록 통신 오류: ${err.message}` });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleCopySql = () => {
    if (!schemaSql) return;
    navigator.clipboard.writeText(schemaSql);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/supabase/test', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `통신 오류가 발생했습니다: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dresses: dresses && dresses.length > 0 ? dresses : [] }),
      });
      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        // Retest after sync
        handleTestConnection();
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: `동기화 처리 중 통신 오류: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const projectRef = status?.projectRef || 'rlcmybikhtagbfcmgxkf';
  const supabaseUrl = status?.supabaseUrl || 'https://rlcmybikhtagbfcmgxkf.supabase.co';

  return (
    <div className="space-y-6">
      {/* Top Banner: Supabase Studio Project Integration */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SUPABASE STUDIO 연동 허브
              </span>
              <span className="text-slate-400 text-xs">sjook951-create's Project</span>
            </div>
            
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Supabase Studio에서 DB 테이블 실시간 관리</span>
            </h2>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Supabase 웹 대시보드(Studio)의 <strong className="text-emerald-300 font-bold">Table Editor</strong>를 통해 
              회원 정보(<code className="bg-slate-800/80 px-1 py-0.5 rounded text-[11px]">users</code>)와 
              오프라인 피팅 예약(<code className="bg-slate-800/80 px-1 py-0.5 rounded text-[11px]">fitting_bookings</code>)을 
              스프레드시트 형태로 직접 조회, 수정, 추가, 관리할 수 있습니다.
            </p>

            {/* Project Quick Tags */}
            <div className="pt-2 flex items-center gap-3 text-xs flex-wrap font-mono">
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500 font-sans text-[11px]">URL:</span>
                <span className="text-emerald-400 font-semibold">{supabaseUrl}</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500 font-sans text-[11px]">Region:</span>
                <span>Seoul (ap-northeast-2)</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500 font-sans text-[11px]">Ref:</span>
                <span className="text-amber-400">{projectRef}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2.5 shrink-0">
            <a
              href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 group"
            >
              <Table className="w-4 h-4 text-slate-900" />
              <span>Supabase Table Editor 열기</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>SQL Editor 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Studio 연동 & 동기화 제어</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'sql'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>테이블 생성 DDL (SQL)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'guide'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3단계 관리 가이드</span>
          </button>
        </div>

        <button
          onClick={fetchStatus}
          disabled={isLoading}
          className="text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ACTIONS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5">
          {/* SUPABASE_KEY Configuration & Resolution Card */}
          <div className={`p-5 rounded-2xl border shadow-xs transition ${
            status?.isConfigured 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  status?.isConfigured 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-amber-500 text-white shadow-xs animate-pulse'
                }`}>
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {status?.isConfigured 
                        ? 'Supabase API Key 정상 연동 완료' 
                        : 'Supabase API Key (연동 인증키) 등록 필요'}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      status?.isConfigured 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-200 text-amber-900'
                    }`}>
                      {status?.isConfigured ? 'CONNECTED' : 'KEY 미등록'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {status?.isConfigured 
                      ? 'Supabase Studio 데이터베이스와의 실시간 통신 및 데이터 동기화가 활성화되었습니다.'
                      : 'Supabase Studio와 연동하려면 API Key(anon 또는 service_role)가 필요합니다. 아래에서 1초 만에 바로 등록할 수 있습니다.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/settings/api`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase API Keys 페이지 열기</span>
                </a>
                {status?.isConfigured && (
                  <button
                    onClick={() => setShowKeyForm(!showKeyForm)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    {showKeyForm ? '닫기' : '키 변경'}
                  </button>
                )}
              </div>
            </div>

            {/* Input Form for Key (Shown if not configured OR if user clicked change key) */}
            {(!status?.isConfigured || showKeyForm) && (
              <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3">
                <div className="text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                  <strong className="text-amber-900 font-bold">간단 3초 연동 방법:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-0.5 text-[11px] text-slate-600">
                    <li>우측 상단 <strong>[Supabase API Keys 페이지 열기]</strong> 클릭</li>
                    <li><strong>Project API keys</strong> 섹션의 <code className="bg-slate-100 px-1 py-0.2 rounded font-mono text-emerald-700 font-bold">anon</code> <code className="text-slate-500">public</code> 또는 <code className="bg-slate-100 px-1 py-0.2 rounded font-mono text-emerald-700 font-bold">service_role</code> <code className="text-slate-500">secret</code> 키 옆의 <strong>[Copy]</strong> 복사</li>
                    <li>아래 입력창에 붙여넣고 <strong>[키 등록 및 즉시 연결]</strong> 버튼 클릭!</li>
                  </ol>
                </div>

                <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showKeyText ? "text" : "password"}
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (복사한 Supabase 키 붙여넣기)"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyText(!showKeyText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingKey || !inputKey.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-md"
                  >
                    {isSavingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isSavingKey ? '연결 확인 중...' : '키 등록 및 즉시 연결'}</span>
                  </button>
                </form>

                {keySaveMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    keySaveMessage.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {keySaveMessage.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{keySaveMessage.text}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: SQL Setup Card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Supabase Studio 테이블 생성</h4>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-emerald-200"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'SQL 복사완료!' : 'SQL 복사하기'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                현재 프로젝트에 테이블이 없으면 Studio에서 테이블을 볼 수 없습니다. 
                SQL 스크립트를 복사한 후 Supabase의 <strong>SQL Editor</strong>에서 [Run]을 누르면 
                <code className="text-emerald-700 font-semibold ml-1">users</code>, <code className="text-emerald-700 font-semibold">fitting_bookings</code> 테이블이 생성됩니다.
              </p>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase SQL Editor 열고 붙여넣기</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Step 2: Test & Sync Card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">기존 데이터 Supabase로 전송</h4>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>연결 확인</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                현재 시스템에 보관된 회원, 피팅 예약, 등록된 드레스({dresses?.length || 0}벌) 데이터를 클릭 한 번으로 Supabase 데이터베이스로 전송합니다. 
                전송 즉시 Supabase Studio Table Editor에 반영됩니다.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Supabase로 전송 중...' : '현재 데이터 Supabase로 전송 (Sync)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test or Sync Feedback Alert */}
          {testResult && (
            <div className={`p-4 rounded-xl text-xs border flex items-start gap-3 ${
              testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">{testResult.message}</div>
                {testResult.details?.tableMissing && (
                  <p className="text-slate-600">
                    상단 [SQL 복사하기] 후 Supabase Studio의 SQL Editor에서 스크립트를 실행해 테이블을 생성해주세요.
                  </p>
                )}
              </div>
            </div>
          )}

          {syncResult && (
            <div className={`p-4 rounded-xl text-xs border flex items-start gap-3 ${
              syncResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {syncResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">{syncResult.message}</div>
                {syncResult.synced && (
                  <p className="text-slate-600">
                    회원 {syncResult.synced.users}건, 피팅 예약 {syncResult.synced.bookings}건, 드레스 {syncResult.synced.dresses ?? 0}벌이 성공적으로 전송되었습니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Supabase Studio Table Links */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Supabase Studio 테이블 바로가기 (3대 핵심 테이블)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Users Table Card */}
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group bg-slate-50/50 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>public.users</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded">회원 관리</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      회원 성명, 연락처, 본인인증, 역할(Role), 가입 채널
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end text-slate-400 group-hover:text-emerald-600 text-xs font-semibold">
                  <span>테이블 열기</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </a>

              {/* Bookings Table Card */}
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group bg-slate-50/50 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>public.fitting_bookings</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded">피팅 예약</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      예약코드, 고객명, 피팅일시, 선택드레스, 예식일
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end text-slate-400 group-hover:text-emerald-600 text-xs font-semibold">
                  <span>테이블 열기</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </a>

              {/* Dresses Table Card */}
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 hover:border-pink-500 hover:shadow-md transition group bg-slate-50/50 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>public.dresses</span>
                      <span className="text-[10px] bg-pink-100 text-pink-800 font-semibold px-1.5 py-0.2 rounded">드레스 컬렉션</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      드레스ID, 명칭, 디자이너, 대여가, 실크공방, 상태
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end text-slate-400 group-hover:text-pink-600 text-xs font-semibold">
                  <span>테이블 열기</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL DDL SCRIPT */}
      {activeSubTab === 'sql' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">Supabase SQL Editor 실행용 DDL 스크립트</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? '복사되었습니다!' : '전체 SQL 복사'}</span>
              </button>
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1"
              >
                <span>Supabase SQL Editor 열기</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <pre className="p-4 bg-slate-900/90 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300 border border-slate-800/80 leading-relaxed max-h-96">
            {schemaSql || '-- SQL 로딩 중...'}
          </pre>

          <p className="text-xs text-slate-400">
            * 복사한 후 Supabase Studio의 좌측 메뉴 4번째 <strong>SQL Editor</strong>에서 [New Query]에 붙여넣고 [Run]을 누르면 2초 만에 완벽히 구축됩니다.
          </p>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP GUIDE */}
      {activeSubTab === 'guide' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Supabase Studio에서 완벽하게 DB를 관리하는 3단계 가이드</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  SQL 스크립트 실행 (1회 최초 설정)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  상단의 <strong className="text-emerald-700">[SQL 복사하기]</strong> 버튼을 누른 후, 
                  좌측의 <a href={`https://supabase.com/dashboard/project/${projectRef}/sql`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">SQL Editor</a>를 
                  열고 쿼리 창에 붙여넣은 뒤 우측 하단의 <strong>[Run]</strong> 버튼을 클릭합니다.
                  (실행 즉시 <code className="bg-slate-200 px-1 py-0.5 rounded">users</code>, <code className="bg-slate-200 px-1 py-0.5 rounded">fitting_bookings</code>, 그리고 <code className="bg-slate-200 px-1 py-0.5 rounded">dresses</code> 테이블이 생성됩니다.)
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  Table Editor에서 테이블 확인 및 시각적 관리
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Supabase Studio 좌측 메뉴의 3번째 아이콘인 <a href={`https://supabase.com/dashboard/project/${projectRef}/editor`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">Table Editor</a>로 이동합니다.
                  스프레드시트 엑셀처럼 각 행(Row)을 직접 더블클릭하여 수정하거나 신규 회원 및 드레스를 추가할 수 있습니다.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  웹 앱과 Supabase Studio 양방향 실시간 동기화
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  웹 애플리케이션에서 신규 회원이 가입하거나 드레스 피팅 예약이 완료되고, 
                  공급상(SCM)이 신규 드레스를 등록하거나 본사(PMS)가 심사 승인할 때마다 
                  백그라운드에서 Supabase Studio 데이터베이스로 자동 전송(Dual Write)되어 
                  Studio 창에서도 실시간으로 레코드가 갱신됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
