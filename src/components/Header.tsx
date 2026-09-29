import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store as StoreIcon,
  Plus,
  Shield,
  User as UserIcon,
  ChevronDown,
  Menu,
  ZoomIn,
  ZoomOut,
  Type,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    myStore,
    currentUser,
    users,
    setCurrentUser,
    setIsCreateModalOpen,
    setEditingTxId,
    printSettings,
    updatePrintSettings,
    showToast,
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSwitchUser = (user: any) => {
    setCurrentUser(user);
    setIsUserDropdownOpen(false);
    showToast(`Beralih akun ke: ${user.fullName} (${user.role.toUpperCase()})`, 'info');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 print:hidden shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Toko Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                {myStore.namaToko}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Pihak Penyedia Toko • Pembuat Dokumen SPJ, SPB, BAST & Kuitansi Sekolah
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Zoom & User Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Global Font Size Quick Toggle */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200 text-xs gap-1.5">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 text-[11px]">Ukuran Teks:</span>
            <select
              value={printSettings.fontSizeMode || 'large'}
              onChange={(e) => updatePrintSettings({ fontSizeMode: e.target.value as any })}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="normal">Standar (14px)</option>
              <option value="large">Besar (16px - Jelas)</option>
              <option value="xlarge">Ekstra Besar (18px)</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingTxId(null);
              setIsCreateModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat SPJ Baru</span>
          </button>

          {/* User Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                  currentUser.role === 'admin' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
              >
                {currentUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-bold text-xs text-slate-800 block leading-tight">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 capitalize block leading-tight">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 text-xs">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Akun Toko Aktif
                    </p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{currentUser.fullName}</p>
                    <p className="text-slate-500 text-[11px] font-mono">@{currentUser.username}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Hak Akses: {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">
                      Ganti Akun Pengguna:
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                          u.id === currentUser.id
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              u.role === 'admin' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                          />
                          <span>{u.fullName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
