import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Download,
  Upload,
} from 'lucide-react';

export const BackupRestore: React.FC = () => {
  const {
    exportDatabaseJson,
    importDatabaseJson,
    transactions,
    schools,
    items,
    myStore,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Cadangan & Pemulihan Data SPJ Toko</h2>
            <p className="text-xs text-slate-500">
              Simpan cadangan data (backup) ke komputer Anda atau pulihkan data kapan saja tanpa khawatir hilang
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Ekspor / Cadangkan Data (Backup JSON)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Unduh seluruh data transaksi SPJ sekolah, master barang, data sekolah pelanggan toko, dan profil toko Anda ke dalam file JSON aman.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 mt-4">
              <div className="flex justify-between text-slate-600">
                <span>Toko Anda:</span>
                <span className="font-bold text-slate-800">{myStore.namaToko}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Transaksi SPJ:</span>
                <span className="font-bold text-slate-800">{transactions.length} berkas</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Sekolah Pelanggan:</span>
                <span className="font-bold text-slate-800">{schools.length} sekolah</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Master Barang:</span>
                <span className="font-bold text-slate-800">{items.length} item</span>
              </div>
            </div>
          </div>

          <button
            onClick={exportDatabaseJson}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File Cadangan (.json)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Impor / Pulihkan Data (Restore)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Unggah file cadangan backup JSON sebelumnya untuk mengembalikan seluruh data transaksi SPJ sekolah dan master data Anda.
            </p>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 mt-4">
              ℹ️ File yang diunggah akan memulihkan data tanpa menghapus riwayat browser Anda.
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih File Backup JSON untuk Dipulihkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
