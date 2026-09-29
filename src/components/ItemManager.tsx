import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MasterItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Tag,
  Boxes,
} from 'lucide-react';

export const ItemManager: React.FC = () => {
  const { items, addItem, updateItem, deleteItem, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);

  // Form states
  const [namaBarang, setNamaBarang] = useState('');
  const [kodeBarang, setKodeBarang] = useState('');
  const [satuan, setSatuan] = useState('buah');
  const [hargaStandar, setHargaStandar] = useState(0);
  const [kategori, setKategori] = useState('ATK');
  const [keterangan, setKeterangan] = useState('');

  const categories = [
    'Semua',
    'ATK',
    'Media Belajar APE',
    'Peralatan UKS & Tumbuh Kembang',
    'Konsumsi PMT',
    'Kebersihan & Sanitasi',
    'Elektronik & IT',
    'Lainnya',
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kategori && item.kategori.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'Semua' || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNamaBarang('');
    setKodeBarang(`BRG-${Math.floor(100 + Math.random() * 900)}`);
    setSatuan('buah');
    setHargaStandar(0);
    setKategori('ATK');
    setKeterangan('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setNamaBarang(item.namaBarang);
    setKodeBarang(item.kodeBarang || '');
    setSatuan(item.satuan);
    setHargaStandar(item.hargaStandar);
    setKategori(item.kategori || 'ATK');
    setKeterangan(item.keterangan || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang.trim()) {
      showToast('Nama barang wajib diisi!', 'error');
      return;
    }

    if (editingItem) {
      updateItem(editingItem.id, {
        namaBarang: namaBarang.trim(),
        kodeBarang: kodeBarang.trim(),
        satuan: satuan.trim(),
        hargaStandar: Number(hargaStandar) || 0,
        kategori,
        keterangan: keterangan.trim(),
      });
    } else {
      addItem({
        namaBarang: namaBarang.trim(),
        kodeBarang: kodeBarang.trim(),
        satuan: satuan.trim(),
        hargaStandar: Number(hargaStandar) || 0,
        kategori,
        keterangan: keterangan.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Master Data Barang Belanja</h2>
            <p className="text-xs text-slate-500">
              Database barang, satuan, dan standar harga untuk mempercepat pengisian SPJ
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Barang Baru</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama barang atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Nama Barang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Satuan</th>
                <th className="py-3 px-4 text-right">Harga Standar</th>
                <th className="py-3 px-4">Keterangan / Spesifikasi</th>
                <th className="py-3 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Belum ada data barang yang sesuai. Klik "Tambah Barang Baru".
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {item.namaBarang}
                      {item.kodeBarang && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Kode: {item.kodeBarang}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-600">
                      {item.satuan}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {formatRupiah(item.hargaStandar)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {item.keterangan || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit barang"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus barang "${item.namaBarang}"?`)) {
                              deleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus barang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM INPUT BARANG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingItem ? 'Edit Data Barang' : 'Tambah Master Barang Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Barang Belanja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kertas Linen Folio"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="rim / buah / set / unit"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Standar (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={hargaStandar}
                    onChange={(e) => setHargaStandar(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="ATK">ATK</option>
                    <option value="Media Belajar APE">Media Belajar APE</option>
                    <option value="Peralatan UKS & Tumbuh Kembang">Peralatan UKS & Kesehatan</option>
                    <option value="Konsumsi PMT">Konsumsi PMT</option>
                    <option value="Kebersihan & Sanitasi">Kebersihan & Sanitasi</option>
                    <option value="Elektronik & IT">Elektronik & IT</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Barang</label>
                  <input
                    type="text"
                    placeholder="Opsional"
                    value={kodeBarang}
                    onChange={(e) => setKodeBarang(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Spesifikasi Standar
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Ukuran F4 warna putih, tebal 80gr"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
