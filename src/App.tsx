import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ApprovalBox } from './components/ApprovalBox';
import { WireframeViewer } from './components/WireframeViewer';
import { ScreenSpecTable } from './components/ScreenSpecTable';
import { ProcessDiagramView } from './components/ProcessDiagramView';
import { SitemapView } from './components/SitemapView';
import { DocumentReportView } from './components/DocumentReportView';
import { LivePlatform } from './components/live/LivePlatform';
import { SCREEN_SPECS } from './data/screenSpecsData';
import { PortalType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'live' | 'wireframe' | 'table' | 'process' | 'sitemap' | 'report'>('live');
  const [selectedPortal, setSelectedPortal] = useState<PortalType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedScreenId, setSelectedScreenId] = useState<string>(SCREEN_SPECS[0]?.id || 'SCR-B2C-001');
  const [showApprovalBox, setShowApprovalBox] = useState<boolean>(false);

  // Filtered screens based on Portal selection and Search query
  const filteredScreens = useMemo(() => {
    return SCREEN_SPECS.filter((screen) => {
      const matchesPortal = selectedPortal === 'ALL' || screen.portal === selectedPortal;
      const matchesSearch =
        searchTerm.trim() === '' ||
        screen.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.processCodes.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        screen.systemModule.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesPortal && matchesSearch;
    });
  }, [selectedPortal, searchTerm]);

  // Navigate to wireframe view with specified screen
  const handleSelectScreen = (screenId: string) => {
    setSelectedScreenId(screenId);
    setCurrentView('wireframe');
  };

  const handleFilterPortalFromSitemap = (portal: PortalType) => {
    setSelectedPortal(portal);
    setCurrentView('wireframe');
    const firstScreen = SCREEN_SPECS.find(s => s.portal === portal);
    if (firstScreen) {
      setSelectedScreenId(firstScreen.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedPortal={selectedPortal}
        setSelectedPortal={setSelectedPortal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showApprovalBox={showApprovalBox}
        setShowApprovalBox={setShowApprovalBox}
        totalScreens={filteredScreens.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Toggleable Official Approval Box */}
        {showApprovalBox && currentView !== 'report' && (
          <ApprovalBox />
        )}

        {/* 1. Interactive Live Website Experience */}
        {currentView === 'live' && (
          <LivePlatform
            onSwitchToDocumentation={() => setCurrentView('report')}
          />
        )}

        {/* 2. UI Mockup Wireframe Viewer */}
        {currentView === 'wireframe' && (
          <WireframeViewer
            screens={filteredScreens}
            selectedScreenId={selectedScreenId}
            onSelectScreen={(id) => setSelectedScreenId(id)}
          />
        )}

        {/* 3. Screen Specification Table */}
        {currentView === 'table' && (
          <ScreenSpecTable
            screens={filteredScreens}
            onSelectScreen={handleSelectScreen}
          />
        )}

        {/* 4. Business Process Diagram (U1~U16) */}
        {currentView === 'process' && (
          <ProcessDiagramView
            onSelectScreen={handleSelectScreen}
          />
        )}

        {/* 5. Sitemap & Architecture View */}
        {currentView === 'sitemap' && (
          <SitemapView
            onSelectScreen={handleSelectScreen}
            onFilterPortal={handleFilterPortalFromSitemap}
          />
        )}

        {/* 6. Document Report & PDF Download */}
        {currentView === 'report' && (
          <DocumentReportView />
        )}
      </main>

      {/* Footer Meta */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TOBMALL 플랫폼 TO-BE</span>
            <span>· 友霓网络科技(上海)有限公司 UNINET TECHNOLOGY</span>
          </div>
          <div className="flex items-center gap-3">
            <span>설계자: 김창해</span>
            <span>·</span>
            <span>버전 1.0 (2026.05.20)</span>
            <span>·</span>
            <span className="text-purple-700 font-semibold">S2B2C & Planner X 통합 플랫폼</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
