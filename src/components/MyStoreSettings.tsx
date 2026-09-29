import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreStamp } from './StoreStamp';
import { StoreSignature } from './StoreSignature';
import {
  Store as StoreIcon,
  Save,
  CheckCircle,
  Phone,
  MapPin,
  CreditCard,
  User,
  Stamp,
  PenTool,
  Upload,
  Sparkles,
} from 'lucide-react';

export const MyStoreSettings: React.FC = () => {
  const { myStore, updateMyStore } = useApp();

  const [namaToko, setNamaToko] = useState(myStore.namaToko);
  const [namaPemilik, setNamaPemilik] = useState(myStore.namaPemilik);
  const [alamat, setAlamat] = useState(myStore.alamat);
  const [noHp, setNoHp] = useState(myStore.noHp);
  const [npwp, setNpwp] = useState(myStore.npwp || '');
  const [bank, setBank] = useState(myStore.bank || '');
  const [noRekening, setNoRekening] = useState(myStore.noRekening || '');
  const [kategoriUsaha, setKategoriUsaha] = useState(myStore.kategoriUsaha || 'Pengadaan ATK & Perlengkapan Sekolah');
  
  // Stempel settings
  const [tampilkanStempel, setTampilkanStempel] = useState(myStore.tampilkanStempel ?? true);
  const [stempelType, setStempelType] = useState(myStore.stempelType || 'toko_kita');
  const [customStempelUrl, setCustomStempelUrl] = useState(myStore.customStempelUrl || '');
  const [kepekatanStempel, setKepekatanStempel] = useState<'samar' | 'sedang' | 'jelas'>(
    myStore.kepekatanStempel || 'samar'
  );

  // Tanda Tangan settings
  const [tampilkanTtd, setTampilkanTtd] = useState(myStore.tampilkanTtd ?? true);
  const [customTtdUrl, setCustomTtdUrl] = useState(myStore.customTtdUrl || '');

  const [isSaved, setIsSaved] = useState(false);

  const handleCustomStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomStempelUrl(result);
        setStempelType('custom_upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomTtdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomTtdUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyStore({
      namaToko: namaToko.trim(),
      namaPemilik: namaPemilik.trim(),
      alamat: alamat.trim(),
      noHp: noHp.trim(),
      npwp: npwp.trim(),
      bank: bank.trim(),
      noRekening: noRekening.trim(),
      kategoriUsaha: kategoriUsaha.trim(),
      tampilkanStempel,
      stempelType,
      customStempelUrl,
      kepekatanStempel,
      tampilkanTtd,
      customTtdUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <StoreIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profil Toko, Stempel & Tanda Tangan</h2>
            <p className="text-xs text-slate-500">
              Identitas usaha, stempel otomatis (samar-samar), dan tanda tangan yang tercetak di setiap berkas SPJ
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* SECTION 1: STEMPEL TOKO OTOMATIS */}
        <div className="bg-gradient-to-br from-amber-50 to-blue-50 p-6 rounded-2xl border-2 border-amber-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-800 rounded-lg">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  1. Stempel Toko Otomatis
                </h3>
                <p className="text-slate-600 text-[11px]">
                  Stempel tercetak di atas nama pemilik toko pada Kuitansi, SPB, BAST, dan Nota
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tampilkanStempel}
                onChange={(e) => setTampilkanStempel(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {tampilkanStempel && (
            <div className="space-y-4 pt-3 border-t border-amber-200">
              {/* OPSI KEPEKATAN STEMPEL: SAMAR-SAMAR (DEFAULT) */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-black text-slate-900 block text-xs">
                    Tingkat Kepekatan Tinta Stempel:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sesuai permintaan Anda, setelan default adalah <strong>Samar-Samar</strong> agar natural seperti cap basah kertas asli.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setKepekatanStempel('samar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      kepekatanStempel === 'samar'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Samar-Samar (Rekomendasi)
                  </button>

                  <button
                    type="button"
                    onClick={() => setKepekatanStempel('sedang')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      kepekatanStempel === 'sedang'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Sedang
                  </button>

                  <button
                    type="button"
                    onClick={() => setKepekatanStempel('jelas')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      kepekatanStempel === 'jelas'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Jelas / Terang
                  </button>
                </div>
              </div>

              {/* MODEL STEMPEL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Radio 1: Stempel TOKO KITA */}
                <label
                  className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    stempelType === 'toko_kita'
                      ? 'border-blue-600 bg-white shadow-md'
                      : 'border-slate-200 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="stempelType"
                      checked={stempelType === 'toko_kita'}
                      onChange={() => setStempelType('toko_kita')}
                      className="text-blue-600"
                    />
                    <span className="font-extrabold text-slate-900">Stempel "TOKO KITA"</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Desain bulat kuning-biru sesuai logo Anda ("Belanja Mudah, Harga Bersahabat").
                  </p>
                  <div className="flex justify-center p-2 bg-slate-50 rounded-lg">
                    <StoreStamp size={68} />
                  </div>
                </label>

                {/* Radio 2: Auto Name Stamp */}
                <label
                  className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    stempelType === 'auto_nama'
                      ? 'border-blue-600 bg-white shadow-md'
                      : 'border-slate-200 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="stempelType"
                      checked={stempelType === 'auto_nama'}
                      onChange={() => setStempelType('auto_nama')}
                      className="text-blue-600"
                    />
                    <span className="font-extrabold text-slate-900">Sesuai Nama Toko Anda</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Teks melingkar otomatis menggunakan nama toko Anda ("{namaToko || 'Nama Toko'}").
                  </p>
                  <div className="flex justify-center p-2 bg-slate-50 rounded-lg">
                    <StoreStamp size={68} />
                  </div>
                </label>

                {/* Radio 3: Custom Upload */}
                <label
                  className={`p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    stempelType === 'custom_upload'
                      ? 'border-blue-600 bg-white shadow-md'
                      : 'border-slate-200 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="stempelType"
                        checked={stempelType === 'custom_upload'}
                        onChange={() => setStempelType('custom_upload')}
                        className="text-blue-600"
                      />
                      <span className="font-extrabold text-slate-900">Upload Cap Sendiri</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Unggah scan cap stempel fisik toko Anda sendiri.
                    </p>
                  </div>

                  <div className="mt-2">
                    {customStempelUrl ? (
                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                        <img src={customStempelUrl} alt="Cap Anda" className="w-10 h-10 object-contain" />
                        <span className="text-[10px] text-emerald-700 font-bold">✓ Terpasang</span>
                      </div>
                    ) : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomStampUpload}
                      className="mt-2 block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: TANDA TANGAN OTOMATIS PEMILIK TOKO */}
        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 text-indigo-800 rounded-lg">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  2. Tanda Tangan Otomatis Pemilik Toko
                </h3>
                <p className="text-slate-600 text-[11px]">
                  Tanda tangan Anda otomatis tertera di atas garis tanda tangan pada Kuitansi, SPB, BAST, dan Nota
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tampilkanTtd}
                onChange={(e) => setTampilkanTtd(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {tampilkanTtd && (
            <div className="pt-3 border-t border-indigo-200 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-black text-slate-900 block text-xs">
                    Pratinjau Tanda Tangan & Cap Stempel Toko:
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Posisi tanda tangan berada tepat di atas garis nama, berpadu dengan stempel toko yang samar di belakangnya.
                  </p>
                </div>

                <div className="relative w-52 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-inner">
                  {/* Background Stamp */}
                  <div className="absolute left-4 top-1 pointer-events-none">
                    <StoreStamp size={72} />
                  </div>
                  {/* Foreground Signature */}
                  <div className="relative z-10">
                    <StoreSignature width={130} height={60} />
                  </div>
                </div>
              </div>

              {/* Upload Custom Signature Option */}
              <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">
                    Ganti dengan Foto Tanda Tangan Anda Sendiri (Opsional):
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Jika ingin menggunakan foto tanda tangan lain, unggah foto tanda tangan di atas kertas putih.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {customTtdUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomTtdUrl('')}
                      className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded font-semibold cursor-pointer"
                    >
                      Reset ke TTD Bawaan
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomTtdUpload}
                    className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: IDENTITAS USAHA TOKO */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <StoreIcon className="w-4 h-4 text-blue-600" />
            3. Identitas Usaha & Penandatangan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Nama Toko / Perusahaan Anda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Toko Kita / Toko Perlengkapan Sekolah"
                value={namaToko}
                onChange={(e) => setNamaToko(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-black text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Nama Pemilik / Penandatangan TTD <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Maria / Ahmad Ridwan"
                value={namaPemilik}
                onChange={(e) => setNamaPemilik(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
              <input
                type="text"
                placeholder="081234567890"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Alamat Toko</label>
              <input
                type="text"
                placeholder="Contoh: Kampung Muara Asa, Kec. Barong Tongkok"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NPWP Toko (Opsional)</label>
              <input
                type="text"
                placeholder="08.123.456.7-728.000"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Usaha</label>
              <input
                type="text"
                placeholder="ATK, Percetakan, APE"
                value={kategoriUsaha}
                onChange={(e) => setKategoriUsaha(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank</label>
              <input
                type="text"
                placeholder="BPD Kaltimtara / BRI / Mandiri"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Rekening</label>
              <input
                type="text"
                placeholder="1234-5678-9012"
                value={noRekening}
                onChange={(e) => setNoRekening(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black flex items-center gap-2 shadow-md cursor-pointer transition text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Profil, Stempel & TTD'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
