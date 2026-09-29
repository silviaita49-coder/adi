import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import {
  FileText,
  Store,
  Package,
  Plus,
  Printer,
  TrendingUp,
  Receipt,
  School,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    transactions,
    schools,
    items,
    myStore,
    setIsCreateModalOpen,
    setSelectedTxId,
    setActiveTab,
    currentUser,
    printSettings,
  } = useApp();

  const totalBelanja = transactions.reduce((acc, curr) => acc + curr.totalBelanja, 0);

  const recentTxs = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>Pihak Toko / Rekanan: {myStore.namaToko}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Aplikasi SPJ Sekolah untuk Pihak Toko & Rekanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">
            Halo <strong className="text-white">{currentUser.fullName}</strong>. Anda dapat membuat berkas SPJ (Kuitansi, SPB, BAST & Nota Kontan) untuk berbagai sekolah pelanggan dengan nama sekolah yang diinput langsung oleh pihak toko.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Transaksi SPJ Sekolah Baru</span>
            </button>

            <button
              onClick={() => setActiveTab('schools')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/15 transition cursor-pointer"
            >
              <School className="w-4 h-4" />
              <span>Kelola Data Sekolah Pemesan ({schools.length})</span>
            </button>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-72 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
            <span>⚙️ Setelan Cetak Toko:</span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div>
              <span className="text-slate-400">Ukuran Teks:</span>
              <p className="font-bold text-white capitalize">{printSettings.fontSizeMode || 'Besar (16px)'}</p>
            </div>
            <div>
              <span className="text-slate-400">Kop Surat:</span>
              <p className="font-bold text-white">
                {printSettings.kosongkanKop ? 'Dikosongkan (Kertas Kop Resmi Sekolah)' : 'Kop Teks'}
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-emerald-300 font-medium">
              ✓ Dilengkapi fitur perbesar tulisan (Zoom) agar teks terlihat jelas.
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Nilai Belanja
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{formatRupiah(totalBelanja)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{transactions.length} transaksi SPJ terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Berkas SPJ Siap Cetak
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{transactions.length} Dokumen</p>
          <p className="text-[11px] text-slate-400 mt-1">Kuitansi, SPB, BAST & Nota</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sekolah Pelanggan
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <School className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{schools.length} Sekolah</p>
          <p className="text-[11px] text-slate-400 mt-1">Diinput oleh pihak toko</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Master Barang Toko
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{items.length} Item</p>
          <p className="text-[11px] text-slate-400 mt-1">Barang belanja toko Anda</p>
        </div>
      </div>

      {/* Recent SPJ Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Transaksi SPJ Terbaru</h3>
            <p className="text-xs text-slate-500">Klik untuk melihat, memperbesar, atau mencetak dokumen</p>
          </div>
          <button
            onClick={() => setActiveTab('spj-list')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Transaksi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentTxs.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTxId(tx.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0 transition">
                  #{tx.noBukti}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition">
                      {tx.namaSekolah}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tx.sumberDana}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Barang: <strong className="text-slate-700">{tx.sebagaiPembayaran}</strong> • {formatTanggalIndo(tx.tanggalTransaksi)}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="font-black text-sm text-emerald-700 block">
                  {formatRupiah(tx.jumlahSetelahPotong || tx.totalBelanja)}
                </span>
                <span className="text-[10px] text-blue-600 font-bold flex items-center sm:justify-end gap-1">
                  <Printer className="w-3 h-3" /> Cetak / Perbesar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
