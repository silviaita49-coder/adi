import React from 'react';
import { SpjTransaction, PrintSettings } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { StoreStamp } from '../StoreStamp';
import { StoreSignature } from '../StoreSignature';

interface BastDocProps {
  transaction: SpjTransaction;
  settings: PrintSettings;
}

export const BastDoc: React.FC<BastDocProps> = ({
  transaction,
  settings,
}) => {
  const lokasiKecamatan = transaction.kecamatanSekolah || 'Barong Tongkok';
  const tanggalDoc = transaction.tempatTanggal || `${lokasiKecamatan}, ${formatTanggalIndo(transaction.tanggalTransaksi)}`;

  const isLarge = settings.fontSizeMode === 'large' || !settings.fontSizeMode;
  const isXLarge = settings.fontSizeMode === 'xlarge';

  const baseTextSize = isXLarge ? 'text-[14px]' : isLarge ? 'text-[13px]' : 'text-[12px]';
  const tableTextSize = isXLarge ? 'text-[12px]' : isLarge ? 'text-[11px]' : 'text-[10px]';

  return (
    <div
      id="doc-bast-print"
      className={`spj-printable-page bg-white text-black p-6 sm:p-8 font-serif leading-normal ${baseTextSize} w-full max-w-[210mm] mx-auto border border-slate-300 print:border-none print:p-0 print:m-0 print:shadow-none shadow-md mb-6 print:mb-0`}
      style={{
        fontFamily: settings.fontKeluaran === 'times' ? '"Times New Roman", Times, serif' : 'Arial, sans-serif',
      }}
    >
      {/* KOP SURAT */}
      {settings.kosongkanKop ? (
        <div
          className="w-full flex items-center justify-center border border-dashed border-slate-300 print:border-none mb-3 text-xs text-slate-400 italic print:text-transparent select-none bg-slate-50/50 print:bg-transparent"
          style={{ height: `${settings.tinggiKopCm || 3.8}cm` }}
        >
          <span>[ Area Kosong Kop Surat Resmi Sekolah ({settings.tinggiKopCm || 3.8} cm) ]</span>
        </div>
      ) : (
        <div className="text-center pb-2 border-b-2 border-black mb-3">
          <h2 className="font-bold text-lg uppercase tracking-wide m-0 leading-tight">
            {transaction.namaSekolah}
          </h2>
          <p className="text-xs uppercase m-0 leading-tight mt-1 font-semibold">
            {transaction.alamatSekolah}, KECAMATAN {transaction.kecamatanSekolah.toUpperCase()}
          </p>
          <p className="text-[11px] m-0">
            NPSN: {transaction.npsn} • {transaction.kabupatenSekolah}
          </p>
        </div>
      )}

      {/* JUDUL DAN NOMOR SURAT */}
      <div className="text-center my-3">
        <h3 className="font-bold text-base sm:text-lg uppercase tracking-wide border-b-2 border-black pb-0.5 inline-block m-0">
          BERITA ACARA SERAH TERIMA BARANG (BAST)
        </h3>
        <p className="text-xs font-semibold mt-1 m-0">
          Nomor: {transaction.noBast}
        </p>
      </div>

      {/* PENGANTAR */}
      <p className="text-justify mb-2 leading-snug font-normal text-xs">
        Pada hari ini <span className="font-bold">{formatTanggalIndo(transaction.tanggalTransaksi)}</span>, bertempat di {transaction.namaSekolah}, yang bertanda tangan di bawah ini:
      </p>

      {/* PIHAK PERTAMA (TOKO) */}
      <div className="mb-2 space-y-0.5 pl-2 text-xs">
        <div className="flex">
          <span className="w-5 font-bold">1.</span>
          <span className="w-36 font-semibold">Nama Lengkap</span>
          <span className="w-3 font-bold">:</span>
          <span className="flex-1 font-bold uppercase">{transaction.storeOwner || transaction.storeName}</span>
        </div>
        <div className="flex">
          <span className="w-5"></span>
          <span className="w-36">Nama Toko</span>
          <span className="w-3 font-bold">:</span>
          <span className="flex-1 font-semibold">{transaction.storeName}</span>
        </div>
        <div className="flex">
          <span className="w-5"></span>
          <span className="w-36">Jabatan</span>
          <span className="w-3 font-bold">:</span>
          <span className="flex-1">Pimpinan / Pemilik Toko (selanjutnya disebut <strong className="font-bold">PIHAK PERTAMA</strong> / Penyedia)</span>
        </div>
      </div>

      {/* PIHAK KEDUA (SEKOLAH) */}
      <div className="mb-2 space-y-0.5 pl-2 text-xs">
        <div className="flex">
          <span className="w-5 font-bold">2.</span>
          <span className="w-36 font-semibold">Nama Lengkap</span>
          <span className="w-3 font-bold">:</span>
          <span className="flex-1 font-bold uppercase">{transaction.namaKepalaSekolah}</span>
        </div>
        <div className="flex">
          <span className="w-5"></span>
          <span className="w-36">Jabatan</span>
          <span className="w-3 font-bold">:</span>
          <span className="flex-1">Kepala {transaction.namaSekolah} (selanjutnya disebut <strong className="font-bold">PIHAK KEDUA</strong> / Pemesan)</span>
        </div>
      </div>

      <p className="text-justify mb-2 leading-snug text-xs">
        Menyatakan bahwa <span className="font-bold">PIHAK PERTAMA</span> telah menyerahkan kepada <span className="font-bold">PIHAK KEDUA</span> barang operasional dana {transaction.sumberDana} TA {transaction.tahunAnggaran} dalam kondisi 100% baik:
      </p>

      {/* TABEL RINCIAN BARANG */}
      <div className="mb-2 overflow-x-auto">
        <table className={`w-full border-collapse border border-black ${tableTextSize}`}>
          <thead>
            <tr className="bg-slate-50 print:bg-transparent">
              <th className="border border-black px-1.5 py-1 text-center w-10 font-bold">No</th>
              <th className="border border-black px-2 py-1 text-center font-bold">Nama Barang & Spesifikasi</th>
              <th className="border border-black px-1.5 py-1 text-center w-16 font-bold">Vol</th>
              <th className="border border-black px-1.5 py-1 text-center w-16 font-bold">Satuan</th>
              <th className="border border-black px-2 py-1 text-center w-28 font-bold">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="border border-black px-1.5 py-0.5 text-center font-bold">{idx + 1}</td>
                <td className="border border-black px-2 py-0.5">
                  <span className="font-semibold text-black">{item.namaBarang}</span>
                  {item.spesifikasi && (
                    <span className="text-[10px] text-slate-700 italic block">{item.spesifikasi}</span>
                  )}
                </td>
                <td className="border border-black px-1.5 py-0.5 text-center font-bold">{item.volume}</td>
                <td className="border border-black px-1.5 py-0.5 text-center">{item.satuan}</td>
                <td className="border border-black px-2 py-0.5 text-right font-bold">{formatRupiah(item.totalHarga)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-slate-50 print:bg-transparent">
              <td colSpan={4} className="border border-black px-2 py-1 text-right uppercase text-xs">
                Total Belanja
              </td>
              <td className="border border-black px-2 py-1 text-right font-black text-sm">
                {formatRupiah(transaction.totalBelanja)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* KLAUSUL */}
      <div className="mb-3 text-[11px] leading-snug space-y-1">
        <p className="m-0">1. PIHAK KEDUA telah memeriksa dan menerima barang-barang tersebut dalam keadaan lengkap dan baik.</p>
        <p className="m-0">2. Sejak penandatanganan Berita Acara ini, kepemilikan dan tanggung jawab barang beralih kepada PIHAK KEDUA.</p>
      </div>

      {/* TANDA TANGAN */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="text-center relative">
          <p className="m-0 leading-tight font-medium text-xs">Yang Menyerahkan,</p>
          <p className="m-0 font-bold uppercase text-xs">PIHAK PERTAMA</p>
          <div className="h-18 relative flex items-center justify-center">
            {/* Automatic Store Stamp */}
            <div className="absolute left-6 -top-2 z-0 pointer-events-none">
              <StoreStamp size={80} />
            </div>
            {/* Automatic Store Signature */}
            <div className="relative z-10 flex items-center justify-center">
              <StoreSignature width={130} height={60} />
            </div>
          </div>
          <p className="font-bold underline uppercase m-0 text-sm relative z-10">
            {transaction.storeOwner || transaction.storeName}
          </p>
          <p className="text-[11px] font-semibold m-0 mt-0.5">Pimpinan Toko / Rekanan</p>
        </div>

        <div className="text-center">
          <p className="m-0 leading-tight font-medium text-xs">Yang Menerima,</p>
          <p className="m-0 font-bold uppercase text-xs">PIHAK KEDUA</p>
          <div className="h-18 flex items-center justify-center text-slate-300 text-xs italic print:text-transparent">
            (Tanda Tangan)
          </div>
          <p className="font-bold underline uppercase m-0 text-sm">
            {transaction.namaKepalaSekolah}
          </p>
          {settings.tampilkanNip && (
            <p className="text-[11px] font-semibold m-0 mt-0.5">
              {transaction.nipKepalaSekolah && transaction.nipKepalaSekolah !== '-'
                ? `NIP. ${transaction.nipKepalaSekolah}`
                : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
