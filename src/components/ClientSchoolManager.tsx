import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientSchool } from '../types';
import {
  School,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  UserCheck,
  Building,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

export const ClientSchoolManager: React.FC = () => {
  const { schools, addSchool, updateSchool, deleteSchool, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<ClientSchool | null>(null);

  // Form states
  const [namaSekolah, setNamaSekolah] = useState('');
  const [npsn, setNpsn] = useState('');
  const [jenjang, setJenjang] = useState<'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Lainnya'>('PAUD');
  const [alamat, setAlamat] = useState('');
  const [kecamatan, setKecamatan] = useState('Barong Tongkok');
  const [kabupatenKota, setKabupatenKota] = useState('Kabupaten Kutai Barat');
  const [provinsi, setProvinsi] = useState('Kalimantan Timur');
  const [namaProgram, setNamaProgram] = useState('BOP PAUD');
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('-');
  const [namaBendahara, setNamaBendahara] = useState('');
  const [nipBendahara, setNipBendahara] = useState('-');
  const [jabatanBendahara, setJabatanBendahara] = useState('Bendahara BOP');

  const filteredSchools = schools.filter(
    (s) =>
      s.namaSekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.npsn.includes(searchTerm) ||
      s.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setNamaSekolah('');
    setNpsn('');
    setJenjang('PAUD');
    setAlamat('');
    setKecamatan('Barong Tongkok');
    setKabupatenKota('Kabupaten Kutai Barat');
    setProvinsi('Kalimantan Timur');
    setNamaProgram('BOP PAUD');
    setNamaKepalaSekolah('');
    setNipKepalaSekolah('-');
    setNamaBendahara('');
    setNipBendahara('-');
    setJabatanBendahara('Bendahara BOP');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ClientSchool) => {
    setEditingSchool(s);
    setNamaSekolah(s.namaSekolah);
    setNpsn(s.npsn);
    setJenjang(s.jenjang || 'PAUD');
    setAlamat(s.alamat);
    setKecamatan(s.kecamatan);
    setKabupatenKota(s.kabupatenKota);
    setProvinsi(s.provinsi);
    setNamaProgram(s.namaProgram || 'BOP PAUD');
    setNamaKepalaSekolah(s.namaKepalaSekolah);
    setNipKepalaSekolah(s.nipKepalaSekolah || '-');
    setNamaBendahara(s.namaBendahara);
    setNipBendahara(s.nipBendahara || '-');
    setJabatanBendahara(s.jabatanBendahara || 'Bendahara BOP');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSekolah.trim()) {
      showToast('Nama sekolah wajib diisi!', 'error');
      return;
    }

    const payload = {
      namaSekolah: namaSekolah.trim(),
      npsn: npsn.trim(),
      jenjang,
      alamat: alamat.trim(),
      kecamatan: kecamatan.trim(),
      kabupatenKota: kabupatenKota.trim(),
      provinsi: provinsi.trim(),
      namaProgram: namaProgram.trim(),
      namaKepalaSekolah: namaKepalaSekolah.trim() || 'Nama Kepala Sekolah',
      nipKepalaSekolah: nipKepalaSekolah.trim() || '-',
      namaBendahara: namaBendahara.trim() || 'Nama Bendahara',
      nipBendahara: nipBendahara.trim() || '-',
      jabatanBendahara: jabatanBendahara.trim() || 'Bendahara',
    };

    if (editingSchool) {
      updateSchool(editingSchool.id, payload);
    } else {
      addSchool(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Database Sekolah Pelanggan (Diinput Pihak Toko)</h2>
            <p className="text-xs text-slate-500">
              Simpan data sekolah, NPSN, nama Kepala Sekolah & Bendahara agar dapat dipilih instan saat buat SPB, BAST & Kuitansi
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Sekolah Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama sekolah, NPSN, atau kecamatan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Grid of School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            <School className="w-10 h-10 mx-auto mb-2 opacity-50" />
            Belum ada sekolah tersimpan. Klik "+ Tambah Sekolah Baru" untuk memasukkan nama sekolah pelanggan toko Anda.
          </div>
        ) : (
          filteredSchools.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {s.jenjang || 'Sekolah'} • {s.namaProgram || 'BOP/BOS'}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1.5 leading-snug">
                      {s.namaSekolah}
                    </h3>
                    <p className="text-[11px] text-slate-500">NPSN: {s.npsn || '-'}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Sekolah"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus data sekolah "${s.namaSekolah}"?`)) {
                          deleteSchool(s.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                      title="Hapus Sekolah"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="line-clamp-2">
                    <strong className="text-slate-800">Alamat:</strong> {s.alamat}, Kec. {s.kecamatan}
                  </p>
                  <p>
                    <strong className="text-slate-800">Kepala Sekolah:</strong> {s.namaKepalaSekolah}
                  </p>
                  <p>
                    <strong className="text-slate-800">Bendahara:</strong> {s.namaBendahara} ({s.jabatanBendahara || 'Bendahara'})
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{s.kabupatenKota}</span>
                <span className="text-emerald-600 font-bold">Siap Buat SPJ</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL INPUT SEKOLAH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm">
                {editingSchool ? 'Edit Data Sekolah Pelanggan' : 'Input Data Sekolah Pelanggan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Nama Sekolah / Lembaga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TK Harapan Bangsa / PAUD Ceria / SD Negeri 001"
                    value={namaSekolah}
                    onChange={(e) => setNamaSekolah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NPSN</label>
                  <input
                    type="text"
                    placeholder="Contoh: 69894721"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Sumber Dana</label>
                  <input
                    type="text"
                    placeholder="BOP PAUD / BOS Reguler"
                    value={namaProgram}
                    onChange={(e) => setNamaProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Sekolah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Melati RT 02"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Barong Tongkok"
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kabupaten Kutai Barat"
                    value={kabupatenKota}
                    onChange={(e) => setKabupatenKota(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Data Pejabat Tanda Tangan */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <span className="font-bold text-emerald-800 uppercase tracking-wide block mb-2">
                    Data Pejabat Tanda Tangan di Kuitansi & Berkas SPJ:
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Kepala Sekolah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Neni Kristiani, A.Md"
                    value={namaKepalaSekolah}
                    onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    placeholder="NIP atau tanda -"
                    value={nipKepalaSekolah}
                    onChange={(e) => setNipKepalaSekolah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Bendahara Sekolah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Yustari"
                    value={namaBendahara}
                    onChange={(e) => setNamaBendahara(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP Bendahara</label>
                  <input
                    type="text"
                    placeholder="NIP atau tanda -"
                    value={nipBendahara}
                    onChange={(e) => setNipBendahara(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Jabatan Bendahara</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bendahara BOP / Bendahara BOS"
                    value={jabatanBendahara}
                    onChange={(e) => setJabatanBendahara(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold shadow-sm"
                >
                  {editingSchool ? 'Simpan Perubahan' : 'Simpan Sekolah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
