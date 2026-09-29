import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpjTransaction, SpjItemDetail, ClientSchool } from '../types';
import { formatTanggalIndo } from '../utils/formatters';
import { terbilang } from '../utils/terbilang';
import {
  X,
  Plus,
  Trash2,
  Store as StoreIcon,
  Calculator,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag,
  FileCheck,
  School,
  UserCheck,
} from 'lucide-react';

export const SpjFormModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingTxId,
    setEditingTxId,
    transactions,
    addTransaction,
    updateTransaction,
    myStore,
    schools,
    items: masterItems,
    currentUser,
    setSelectedTxId,
    showToast,
  } = useApp();

  const isEditing = !!editingTxId;
  const existingTx = isEditing ? transactions.find((t) => t.id === editingTxId) : null;

  // School data (entered by Toko)
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [npsn, setNpsn] = useState('');
  const [alamatSekolah, setAlamatSekolah] = useState('');
  const [kecamatanSekolah, setKecamatanSekolah] = useState('Barong Tongkok');
  const [kabupatenSekolah, setKabupatenSekolah] = useState('Kabupaten Kutai Barat');
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('-');
  const [namaBendahara, setNamaBendahara] = useState('');
  const [nipBendahara, setNipBendahara] = useState('-');
  const [jabatanBendahara, setJabatanBendahara] = useState('Bendahara BOP');

  // SPJ Transaction data
  const [noBukti, setNoBukti] = useState('');
  const [tahunAnggaran, setTahunAnggaran] = useState(new Date().getFullYear().toString());
  const [sumberDana, setSumberDana] = useState('BOP PAUD');
  const [tanggalTransaksi, setTanggalTransaksi] = useState(new Date().toISOString().slice(0, 10));
  const [tanggalBayar, setTanggalBayar] = useState(new Date().toISOString().slice(0, 10));
  const [tempatTanggal, setTempatTanggal] = useState('');

  // Items
  const [items, setItems] = useState<SpjItemDetail[]>([
    {
      id: `row-${Date.now()}-1`,
      namaBarang: '',
      spesifikasi: '',
      volume: 1,
      satuan: 'buah',
      hargaSatuan: 0,
      totalHarga: 0,
    },
  ]);

  // Payment description
  const [sudahTerimaDari, setSudahTerimaDari] = useState('');
  const [sebagaiPembayaran, setSebagaiPembayaran] = useState('');
  const [catatan, setCatatan] = useState('');
  const [status, setStatus] = useState<'draft' | 'siap_cetak' | 'lunas'>('siap_cetak');

  // Tax
  const [kenaPpn, setKenaPpn] = useState(false);
  const [persenPpn, setPersenPpn] = useState(11);
  const [nominalPpn, setNominalPpn] = useState(0);

  const [kenaPph, setKenaPph] = useState(false);
  const [jenisPph, setJenisPph] = useState<'PPh 21' | 'PPh 22' | 'PPh 23' | 'Bebas Pajak'>('Bebas Pajak');
  const [persenPph, setPersenPph] = useState(1.5);
  const [nominalPph, setNominalPph] = useState(0);

  // Initialize
  useEffect(() => {
    if (isEditing && existingTx) {
      setNamaSekolah(existingTx.namaSekolah || '');
      setNpsn(existingTx.npsn || '');
      setAlamatSekolah(existingTx.alamatSekolah || '');
      setKecamatanSekolah(existingTx.kecamatanSekolah || 'Barong Tongkok');
      setKabupatenSekolah(existingTx.kabupatenSekolah || 'Kabupaten Kutai Barat');
      setNamaKepalaSekolah(existingTx.namaKepalaSekolah || '');
      setNipKepalaSekolah(existingTx.nipKepalaSekolah || '-');
      setNamaBendahara(existingTx.namaBendahara || '');
      setNipBendahara(existingTx.nipBendahara || '-');
      setJabatanBendahara(existingTx.jabatanBendahara || 'Bendahara');

      setNoBukti(existingTx.noBukti);
      setTahunAnggaran(existingTx.tahunAnggaran);
      setSumberDana(existingTx.sumberDana);
      setTanggalTransaksi(existingTx.tanggalTransaksi);
      setTanggalBayar(existingTx.tanggalBayar);
      setTempatTanggal(existingTx.tempatTanggal);
      setItems(existingTx.items);
      setSudahTerimaDari(existingTx.sudahTerimaDari);
      setSebagaiPembayaran(existingTx.sebagaiPembayaran);
      setCatatan(existingTx.catatan || '');
      setStatus(existingTx.status);
      setKenaPpn(existingTx.kenaPpn);
      setNominalPpn(existingTx.nominalPpn || 0);
      setKenaPph(existingTx.kenaPph);
      setJenisPph(existingTx.jenisPph);
      setNominalPph(existingTx.nominalPph || 0);
    } else if (isCreateModalOpen) {
      // Pick next sequence number
      const numbers = transactions.map((t) => parseInt(t.noBukti, 10)).filter((n) => !isNaN(n));
      const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

      setNoBukti(nextNum.toString());
      setTahunAnggaran(new Date().getFullYear().toString());
      setSumberDana('BOP PAUD');
      const today = new Date().toISOString().slice(0, 10);
      setTanggalTransaksi(today);
      setTanggalBayar(today);

      // Default school: use first school from list if available, or empty
      if (schools.length > 0) {
        applySchoolData(schools[0]);
      } else {
        setNamaSekolah('');
        setNpsn('');
        setAlamatSekolah('');
        setKecamatanSekolah('Barong Tongkok');
        setKabupatenSekolah('Kabupaten Kutai Barat');
        setNamaKepalaSekolah('');
        setNipKepalaSekolah('-');
        setNamaBendahara('');
        setNipBendahara('-');
        setJabatanBendahara('Bendahara BOP');
        setSudahTerimaDari('');
      }

      setTempatTanggal(`Barong Tongkok, ${formatTanggalIndo(today)}`);
      setItems([
        {
          id: `row-${Date.now()}-1`,
          namaBarang: '',
          spesifikasi: '',
          volume: 1,
          satuan: 'buah',
          hargaSatuan: 0,
          totalHarga: 0,
        },
      ]);
      setSebagaiPembayaran('');
      setCatatan('');
      setStatus('siap_cetak');
      setKenaPpn(false);
      setNominalPpn(0);
      setKenaPph(false);
      setJenisPph('Bebas Pajak');
      setNominalPph(0);
    }
  }, [isCreateModalOpen, editingTxId, existingTx]);

  const applySchoolData = (school: ClientSchool) => {
    setSelectedSchoolId(school.id);
    setNamaSekolah(school.namaSekolah);
    setNpsn(school.npsn);
    setAlamatSekolah(school.alamat);
    setKecamatanSekolah(school.kecamatan);
    setKabupatenSekolah(school.kabupatenKota);
    setNamaKepalaSekolah(school.namaKepalaSekolah);
    setNipKepalaSekolah(school.nipKepalaSekolah);
    setNamaBendahara(school.namaBendahara);
    setNipBendahara(school.nipBendahara);
    setJabatanBendahara(school.jabatanBendahara || 'Bendahara');
    setSudahTerimaDari(`Bendahara ${school.namaProgram || 'BOP'} ${school.namaSekolah}`);
  };

  const handlePickClientSchool = (schoolId: string) => {
    const found = schools.find((s) => s.id === schoolId);
    if (found) {
      applySchoolData(found);
    }
  };

  // Item row operations
  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaBarang: '',
        spesifikasi: '',
        volume: 1,
        satuan: 'buah',
        hargaSatuan: 0,
        totalHarga: 0,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) {
      showToast('Minimal harus ada 1 barang dalam pesanan!', 'error');
      return;
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemFieldChange = (index: number, field: keyof SpjItemDetail, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };

      if (field === 'volume' || field === 'hargaSatuan') {
        const vol = field === 'volume' ? parseFloat(value) || 0 : target.volume;
        const price = field === 'hargaSatuan' ? parseFloat(value) || 0 : target.hargaSatuan;
        target.totalHarga = vol * price;
      }

      updated[index] = target;
      return updated;
    });
  };

  const handlePickMasterItem = (index: number, masterItemId: string) => {
    const master = masterItems.find((m) => m.id === masterItemId);
    if (!master) return;

    setItems((prev) => {
      const updated = [...prev];
      const vol = updated[index].volume || 1;
      updated[index] = {
        ...updated[index],
        itemId: master.id,
        namaBarang: master.namaBarang,
        spesifikasi: master.keterangan || '',
        satuan: master.satuan || 'buah',
        hargaSatuan: master.hargaStandar || 0,
        totalHarga: vol * (master.hargaStandar || 0),
      };
      return updated;
    });
  };

  const totalBelanja = items.reduce((sum, item) => sum + (item.totalHarga || 0), 0);

  // Recalculate tax
  useEffect(() => {
    if (kenaPpn) {
      setNominalPpn(Math.round((totalBelanja * (persenPpn || 11)) / 100));
    } else {
      setNominalPpn(0);
    }
  }, [kenaPpn, persenPpn, totalBelanja]);

  useEffect(() => {
    if (kenaPph && jenisPph !== 'Bebas Pajak') {
      setNominalPph(Math.round((totalBelanja * (persenPph || 1.5)) / 100));
    } else {
      setNominalPph(0);
    }
  }, [kenaPph, jenisPph, persenPph, totalBelanja]);

  const jumlahSetelahPotong = totalBelanja - nominalPpn - nominalPph;

  const handleAutoSuggestPembayaran = () => {
    const validItems = items.filter((i) => i.namaBarang.trim());
    if (validItems.length === 0) return;

    if (validItems.length === 1) {
      setSebagaiPembayaran(validItems[0].namaBarang);
    } else if (validItems.length === 2) {
      setSebagaiPembayaran(`${validItems[0].namaBarang} dan ${validItems[1].namaBarang}`);
    } else {
      setSebagaiPembayaran(`${validItems[0].namaBarang}, ${validItems[1].namaBarang}, dkk.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noBukti.trim()) {
      showToast('Nomor bukti wajib diisi!', 'error');
      return;
    }

    if (!namaSekolah.trim()) {
      showToast('Nama Sekolah wajib diisi oleh pihak toko!', 'error');
      return;
    }

    const validItems = items.filter((i) => i.namaBarang.trim().length > 0 && i.totalHarga > 0);
    if (validItems.length === 0) {
      showToast('Harap masukkan minimal 1 barang belanja dengan harga yang valid!', 'error');
      return;
    }

    const defaultTempatTanggal = tempatTanggal || `${kecamatanSekolah || 'Barong Tongkok'}, ${formatTanggalIndo(tanggalTransaksi)}`;
    const defaultSebagai = sebagaiPembayaran.trim() || validItems.map((i) => i.namaBarang).join(' dan ');
    const defaultSudahTerima = sudahTerimaDari.trim() || `Bendahara ${sumberDana} ${namaSekolah}`;

    const payload = {
      noBukti: noBukti.trim(),
      noSpb: `${noBukti.padStart(3, '0')}/SPB-${sumberDana.replace(/\s+/g, '')}/${tahunAnggaran}`,
      noBast: `${noBukti.padStart(3, '0')}/BAST-${sumberDana.replace(/\s+/g, '')}/${tahunAnggaran}`,
      tahunAnggaran,
      sumberDana,
      tanggalTransaksi,
      tanggalBayar,
      tempatTanggal: defaultTempatTanggal,

      // Data Sekolah
      namaSekolah: namaSekolah.trim(),
      npsn: npsn.trim(),
      alamatSekolah: alamatSekolah.trim(),
      kecamatanSekolah: kecamatanSekolah.trim(),
      kabupatenSekolah: kabupatenSekolah.trim(),
      namaKepalaSekolah: namaKepalaSekolah.trim() || 'Nama Kepala Sekolah',
      nipKepalaSekolah: nipKepalaSekolah.trim() || '-',
      namaBendahara: namaBendahara.trim() || 'Nama Bendahara',
      nipBendahara: nipBendahara.trim() || '-',
      jabatanBendahara: jabatanBendahara.trim() || 'Bendahara',

      // Data Toko Kami
      storeName: myStore.namaToko,
      storeOwner: myStore.namaPemilik,
      storeAddress: myStore.alamat,

      items: validItems,
      totalBelanja,
      kenaPpn,
      persenPpn: kenaPpn ? persenPpn : 0,
      nominalPpn,
      kenaPph: kenaPph && jenisPph !== 'Bebas Pajak',
      jenisPph,
      persenPph: kenaPph ? persenPph : 0,
      nominalPph,
      jumlahSetelahPotong,
      sudahTerimaDari: defaultSudahTerima,
      sebagaiPembayaran: defaultSebagai,
      catatan,
      status,
      dibuatOleh: currentUser.username,
    };

    if (isEditing && editingTxId) {
      updateTransaction(editingTxId, payload);
      setSelectedTxId(editingTxId);
    } else {
      const newId = addTransaction(payload);
      setSelectedTxId(newId);
    }

    handleClose();
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setEditingTxId(null);
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {isEditing ? `Edit SPJ (Bukti #${existingTx?.noBukti})` : 'Buat Berkas SPJ Sekolah Baru (Pihak Toko)'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Input data sekolah pemesan dan rincian belanja toko Anda
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* SECTION 1: DATA SEKOLAH PEMESAN (DIINPUT OLEH PIHAK TOKO) */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-300 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
              <h4 className="font-black text-sm text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-700" />
                1. Data Sekolah Pemesan (Diinput oleh Anda Selaku Pihak Toko)
              </h4>

              {schools.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-900">Pilih Sekolah Langganan:</span>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => handlePickClientSchool(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="">-- Ketik Bebas / Pilih Sekolah --</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.namaSekolah} ({s.kecamatan})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Sekolah Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TK / PAUD Harapan Bangsa, SD Negeri 001, dll."
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">NPSN Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: 69894721"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Alamat Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Melati RT 02 / Kampung Muara Asa"
                  value={alamatSekolah}
                  onChange={(e) => setAlamatSekolah(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Kecamatan Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: Barong Tongkok"
                  value={kecamatanSekolah}
                  onChange={(e) => setKecamatanSekolah(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>

              {/* Tanda Tangan Sekolah */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Kepala Sekolah (TTD Mengetahui) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap & Gelar KS"
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  placeholder="NIP atau tanda -"
                  value={nipKepalaSekolah}
                  onChange={(e) => setNipKepalaSekolah(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Bendahara Sekolah (TTD Setuju & Lunas) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Bendahara"
                  value={namaBendahara}
                  onChange={(e) => setNamaBendahara(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">NIP Bendahara</label>
                <input
                  type="text"
                  placeholder="NIP atau tanda -"
                  value={nipBendahara}
                  onChange={(e) => setNipBendahara(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Jabatan Bendahara</label>
                <input
                  type="text"
                  placeholder="Bendahara BOP / Bendahara BOS"
                  value={jabatanBendahara}
                  onChange={(e) => setJabatanBendahara(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: IDENTITAS TRANSAKSI & PENYEDIA TOKO */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2. Nomor SPJ & Identitas Toko Anda
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. Bukti Transaksi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 3 atau 003"
                  value={noBukti}
                  onChange={(e) => setNoBukti(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
                <input
                  type="text"
                  required
                  value={tahunAnggaran}
                  onChange={(e) => setTahunAnggaran(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sumber Dana</label>
                <input
                  type="text"
                  required
                  placeholder="BOP PAUD / BOS Reguler"
                  value={sumberDana}
                  onChange={(e) => setSumberDana(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
                <input
                  type="date"
                  required
                  value={tanggalTransaksi}
                  onChange={(e) => {
                    setTanggalTransaksi(e.target.value);
                    if (!tanggalBayar) setTanggalBayar(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nama Toko Anda</label>
                <input
                  type="text"
                  value={myStore.namaToko}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Pemilik / Penandatangan Toko</label>
                <input
                  type="text"
                  value={myStore.namaPemilik}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-semibold text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: RINCIAN BARANG PESANAN */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  3. Rincian Barang yang Dipesan & Dibelanjakan
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris Barang</span>
              </button>
            </div>

            {/* Dynamic Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 uppercase font-bold text-left">
                    <th className="py-2 px-2 w-8 text-center">#</th>
                    <th className="py-2 px-2">Nama Barang & Spesifikasi</th>
                    <th className="py-2 px-2 w-20 text-center">Volume</th>
                    <th className="py-2 px-2 w-24">Satuan</th>
                    <th className="py-2 px-2 w-32">Harga Satuan (Rp)</th>
                    <th className="py-2 px-2 w-32 text-right">Subtotal (Rp)</th>
                    <th className="py-2 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-100/70">
                      <td className="py-2.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <div className="space-y-1">
                          {masterItems.length > 0 && (
                            <select
                              value={item.itemId || ''}
                              onChange={(e) => handlePickMasterItem(idx, e.target.value)}
                              className="w-full px-2 py-1 text-[11px] bg-slate-100 border border-slate-300 rounded text-slate-600"
                            >
                              <option value="">-- Ambil dari Master Barang Toko --</option>
                              {masterItems.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.namaBarang} ({m.satuan}) - Rp {m.hargaStandar.toLocaleString('id-ID')}
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Kertas linen"
                            value={item.namaBarang}
                            onChange={(e) => handleItemFieldChange(idx, 'namaBarang', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Spesifikasi (opsional, misal: F4 tebal)"
                            value={item.spesifikasi || ''}
                            onChange={(e) => handleItemFieldChange(idx, 'spesifikasi', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-600"
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={item.volume}
                          onChange={(e) => handleItemFieldChange(idx, 'volume', e.target.value)}
                          className="w-full px-2 py-1.5 text-center bg-white border border-slate-300 rounded-md font-bold focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          required
                          placeholder="rim/buah/set"
                          value={item.satuan}
                          onChange={(e) => handleItemFieldChange(idx, 'satuan', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-center font-medium"
                        />
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="0"
                          step="500"
                          required
                          value={item.hargaSatuan}
                          onChange={(e) => handleItemFieldChange(idx, 'hargaSatuan', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-right font-bold"
                        />
                      </td>

                      <td className="py-2.5 px-2 text-right font-black text-slate-900 text-sm">
                        Rp {item.totalHarga.toLocaleString('id-ID')}
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-white">
                    <td colSpan={5} className="py-3 px-3 text-right font-bold uppercase text-slate-700">
                      Total Belanja Bruto:
                    </td>
                    <td className="py-3 px-2 text-right font-black text-base text-emerald-700">
                      Rp {totalBelanja.toLocaleString('id-ID')}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* SECTION 4: KUITANSI & PAJAK */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              4. Perhitungan Pajak & Kuitansi Pembayaran
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                    <input
                      type="checkbox"
                      checked={kenaPpn}
                      onChange={(e) => setKenaPpn(e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Potongan PPN ({persenPpn}%)</span>
                  </label>
                  {kenaPpn && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500">Rp</span>
                      <input
                        type="number"
                        value={nominalPpn}
                        onChange={(e) => setNominalPpn(parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-xs border border-slate-300 rounded text-right font-bold"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                    <input
                      type="checkbox"
                      checked={kenaPph}
                      onChange={(e) => {
                        setKenaPph(e.target.checked);
                        if (e.target.checked && jenisPph === 'Bebas Pajak') setJenisPph('PPh 22');
                      }}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Potongan PPh</span>
                  </label>

                  {kenaPph && (
                    <select
                      value={jenisPph}
                      onChange={(e) => setJenisPph(e.target.value as any)}
                      className="px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 font-semibold"
                    >
                      <option value="PPh 22">PPh 22 (Barang / 1.5%)</option>
                      <option value="PPh 21">PPh 21 (Jasa / Upah)</option>
                      <option value="Bebas Pajak">Bebas Pajak</option>
                    </select>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Jumlah Bersih Diterima Toko:</span>
                  <span className="font-black text-base text-emerald-700">
                    Rp {jumlahSetelahPotong.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    a. Sudah Terima Dari:
                  </label>
                  <input
                    type="text"
                    required
                    value={sudahTerimaDari || (namaSekolah ? `Bendahara ${sumberDana} ${namaSekolah}` : '')}
                    onChange={(e) => setSudahTerimaDari(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      d. Sebagai Pembayaran:
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSuggestPembayaran}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Isi Otomatis dari Barang</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kertas linen dan Timbangan digital"
                    value={sebagaiPembayaran}
                    onChange={(e) => setSebagaiPembayaran(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block mb-0.5">Terbilang:</span>
                  <span className="italic text-emerald-900 font-bold">
                    "{terbilang(jumlahSetelahPotong)}"
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan SPJ' : 'Simpan & Lihat Dokumen SPJ'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
