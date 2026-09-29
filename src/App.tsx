/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SpjList } from './components/SpjList';
import { ItemManager } from './components/ItemManager';
import { ClientSchoolManager } from './components/ClientSchoolManager';
import { MyStoreSettings } from './components/MyStoreSettings';
import { UserManagement } from './components/UserManagement';
import { BackupRestore } from './components/BackupRestore';
import { SpjDetailModal } from './components/SpjDetailModal';
import { SpjFormModal } from './components/SpjFormModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-bottom-3 duration-200 bg-slate-900 text-white border-slate-700">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'spj-list' && <SpjList />}
          {activeTab === 'schools' && <ClientSchoolManager />}
          {activeTab === 'items' && <ItemManager />}
          {activeTab === 'store' && <MyStoreSettings />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'backup' && <BackupRestore />}
        </main>
      </div>

      {/* Modals */}
      <SpjDetailModal />
      <SpjFormModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
