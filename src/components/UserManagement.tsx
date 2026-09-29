import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount, UserRole } from '../types';
import {
  Users,
  Shield,
  User as UserIcon,
  KeyRound,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  Lock,
  ArrowRightLeft,
  Check,
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, currentUser, setCurrentUser, updateUser, showToast, isAdmin } = useApp();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  const handleStartEdit = (user: UserAccount) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setFullName(user.fullName);
    setPassword(user.password || '');
    setTitle(user.title || '');
  };

  const handleSaveEdit = (userId: string) => {
    if (!username.trim() || !fullName.trim()) {
      showToast('Username dan Nama Lengkap wajib diisi!', 'error');
      return;
    }

    updateUser(userId, {
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      password: password.trim(),
      title: title.trim(),
    });

    setEditingUserId(null);
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    showToast(`Beralih login sebagai: ${user.fullName} (${user.role.toUpperCase()})`, 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Hak Akses & Pengguna</h2>
            <p className="text-xs text-slate-500">
              Konfigurasi akun Admin utama Anda dan 1 user staf/operator sekolah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500">Akun Aktif Sekarang:</span>
          <span className="font-bold text-slate-900">{currentUser.fullName}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            currentUser.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => {
          const isCurrentUser = currentUser.id === user.id;
          const isCurrentlyEditing = editingUserId === user.id;

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-6 border transition shadow-xs flex flex-col justify-between ${
                isCurrentUser ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm ${
                        user.role === 'admin' ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                    >
                      {user.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{user.fullName}</h3>
                        {isCurrentUser && (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{user.title || (user.role === 'admin' ? 'Administrator' : 'Staf Operator')}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    Role: {user.role}
                  </span>
                </div>

                {isCurrentlyEditing ? (
                  <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Tampilan</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Username Login</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Password</label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jabatan / Keterangan</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(user.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Username:</span>
                      <span className="font-mono font-bold text-slate-800">{user.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Password:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {user.password ? '••••••••' : '(tidak ada)'}
                        <span className="text-[10px] text-slate-400 ml-1">({user.password})</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tingkat Izin:</span>
                      <span className="font-medium text-slate-800">
                        {user.role === 'admin' ? 'Akses Penuh (Full Control)' : 'Akses Input & Cetak SPJ'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(user)}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah Akun</span>
                </button>

                {!isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => handleSwitchUser(user)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Login sebagai {user.username}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MATRIX PERMISSION TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          Tabel Matriks Hak Akses (Admin vs User Operator)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase">
                <th className="py-2.5 px-3">Fitur / Modul</th>
                <th className="py-2.5 px-3 text-center w-36 bg-emerald-50 text-emerald-900 rounded-t-lg">
                  Admin (Ibu Silvia)
                </th>
                <th className="py-2.5 px-3 text-center w-36 bg-blue-50 text-blue-900 rounded-t-lg">
                  User (Operator)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Buat & Edit Transaksi SPJ (Kuitansi, SPB, BAST, Nota)
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Cetak & Unduh Dokumen PDF (Semua berkas)
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Kelola Master Toko & Rekanan Penyedia
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Kelola Master Barang & Satuan Belanja
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Ubah Profil Sekolah, NPSN & Kecamatan
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-400" /> Hanya Lihat
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Ubah Pejabat Tanda Tangan (Kepala Sekolah & Bendahara)
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-400" /> Hanya Lihat
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Kelola Password Akun Pengguna & Backup Data
                </td>
                <td className="py-2.5 px-3 text-center bg-emerald-50/50">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Diizinkan
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center bg-blue-50/50">
                  <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                    <XCircle className="w-4 h-4 text-red-400" /> Dibatasi
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
