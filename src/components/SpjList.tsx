import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Copy,
  ShoppingBag,
  School,
} from 'lucide-react';

export const SpjList: React.FC = () => {
  const {
    transactions,
    setSelectedTxId,
    setIsCreateModalOpen,
    setEditingTxId,
    deleteTransaction,
    duplicateTransaction,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTahun, setFilterTahun] = useState('Semua');

  const availableYears = ['Semua', ...Array.from(new Set(transactions.map((t) => t.tahunAnggaran)))];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.noBukti.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.namaSekolah && tx.namaSekolah.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.sebagaiPembayaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sumberDana.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTahun = filterTahun === 'Semua' || tx.tahunAnggaran === filterTahun;

    return matchesSearch && matchesTahun;
  });

  const totalNominal = filteredTransactions.reduce((acc, curr) => acc + curr.totalBelanja, 0);

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTxId(id);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string, noBukti: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus transaksi SPJ No. Bukti #${noBukti}?`)) {
      deleteTransaction(id);
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTransaction(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daftar Transaksi SPJ Sekolah</h2>
            <p className="text-xs text-slate-500">
              Daftar seluruh SPJ sekolah yang dibuat oleh pihak toko (Kuitansi, SPB, BAST & Nota)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingTxId(null);
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat SPJ Baru</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama Sekolah, No. Bukti, atau Barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs shadow-xs">
            <span className="text-slate-500">Tahun:</span>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-none"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
            Total Belanja Terfilter
          </span>
          <span className="text-base font-black text-emerald-700">
            {formatRupiah(totalNominal)}
          </span>
        </div>
      </div>

      {/* Transaction Cards List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
            Belum ada berkas transaksi SPJ. Klik "+ Buat SPJ Baru".
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTxId(tx.id)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-100 group-hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-200 group-hover:border-blue-200 transition">
                  <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-blue-700">
                    BUKTI
                  </span>
                  <span className="text-base font-black text-slate-800 group-hover:text-blue-700">
                    #{tx.noBukti}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition">
                      {tx.namaSekolah}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tx.sumberDana}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      TA {tx.tahunAnggaran}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Uraian: <strong className="text-slate-800">{tx.sebagaiPembayaran}</strong> • {formatTanggalIndo(tx.tanggalTransaksi)}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      KS: {tx.namaKepalaSekolah}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      Bendahara: {tx.namaBendahara}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {tx.items.length} Item Barang
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Nilai Kuitansi</span>
                  <span className="text-base font-black text-emerald-700">
                    {formatRupiah(tx.jumlahSetelahPotong || tx.totalBelanja)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedTxId(tx.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    title="Cetak & Lihat Dokumen"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak / PDF</span>
                  </button>

                  <button
                    onClick={(e) => handleEdit(tx.id, e)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title="Edit SPJ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDuplicate(tx.id, e)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                    title="Duplikasi SPJ"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(tx.id, tx.noBukti, e)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Hapus SPJ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
