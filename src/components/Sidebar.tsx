import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Package,
  School,
  Store,
  Users,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, transactions, schools, items, myStore } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'spj-list',
      label: 'Transaksi SPJ',
      subtitle: 'Kuitansi, SPB, BAST, Nota',
      icon: FileSpreadsheet,
      badge: transactions.length,
    },
    {
      id: 'schools',
      label: 'Data Sekolah Pelanggan',
      subtitle: 'Diinput oleh Pihak Toko',
      icon: School,
      badge: schools.length,
    },
    {
      id: 'items',
      label: 'Master Barang Toko',
      icon: Package,
      badge: items.length,
    },
    {
      id: 'store',
      label: 'Profil Toko Kami',
      subtitle: 'Identitas Usaha & TTD',
      icon: Store,
      badge: null,
    },
    {
      id: 'users',
      label: 'Hak Akses & Pengguna',
      subtitle: 'Admin & 1 Operator',
      icon: Users,
      badge: null,
    },
    {
      id: 'backup',
      label: 'Cadangan & Data',
      icon: Database,
      badge: null,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 print:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / App Name */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                SPJ
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white tracking-wide">
                  SPJ SEKOLAH
                </h2>
                <p className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">
                  Pihak Rekanan Toko
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Menu Toko
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <span className="block leading-tight">{item.label}</span>
                      {item.subtitle && (
                        <span className="block text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Helper Info */}
        <div className="p-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] font-bold text-white mb-1">
              🏪 {myStore.namaToko}
            </p>
            <p className="text-[10px] text-slate-400 leading-normal">
              Nama sekolah diinput pihak toko untuk setiap pemesanan.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
