import React from 'react';
import { SpjTransaction, PrintSettings } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';
import { StoreStamp } from '../StoreStamp';
import { StoreSignature } from '../StoreSignature';

interface NotaDocProps {
  transaction: SpjTransaction;
  settings: PrintSettings;
}

export const NotaDoc: React.FC<NotaDocProps> = ({
  transaction,
  settings,
}) => {
  const lokasiKecamatan = transaction.kecamatanSekolah || 'Barong Tongkok';
  const tanggalDoc = transaction.tempatTanggal || `${lokasiKecamatan}, ${formatTanggalIndo(transaction.tanggalTransaksi)}`;

  const isLarge = settings.fontSizeMode === 'large' || !settings.fontSizeMode;
  const isXLarge = settings.fontSizeMode === 'xlarge';
  const baseTextSize = isXLarge ? 'text-base' : isLarge ? 'text-[15px]' : 'text-sm';
  const tableTextSize = isXLarge ? 'text-sm' : isLarge ? 'text-[13px]' : 'text-xs';

  return (
    <div
      id="doc-nota-print"
      className={`spj-printable-page bg-white text-black p-8 sm:p-10 font-serif leading-relaxed ${baseTextSize} w-full max-w-[210mm] mx-auto border-2 border-slate-300 print:border-none print:p-0 print:m-0 print:shadow-none shadow-lg mb-8 print:mb-0`}
      style={{
        fontFamily: settings.fontKeluaran === 'times' ? '"Times New Roman", Times, serif' : 'Arial, sans-serif',
      }}
    >
      {/* HEADER NOTA RESMI TOKO */}
      <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-5">
        <div>
          <h2 className="font-black text-xl uppercase tracking-wide m-0 leading-tight">
            {transaction.storeName}
          </h2>
          <p className="text-sm m-0 text-slate-800 print:text-black font-medium mt-1">{transaction.storeAddress}</p>
          <p className="text-xs m-0 text-slate-700 print:text-black font-semibold">
            Pimpinan: {transaction.storeOwner}
          </p>
        </div>
        <div className="text-right">
          <div className="border-4 border-black px-4 py-1.5 inline-block font-black text-base tracking-widest uppercase mb-1">
            NOTA KONTAN
          </div>
          <p className="text-sm font-bold m-0">No: <span>{transaction.noBukti}/NK/{transaction.tahunAnggaran}</span></p>
          <p className="text-xs m-0 font-medium">{tanggalDoc}</p>
        </div>
      </div>

      {/* KEPADA YTH PEMBELI (SEKOLAH YANG DIINPUT TOKO) */}
      <div className="mb-5 bg-slate-50 print:bg-transparent p-3.5 rounded-lg border-2 border-slate-300 print:border-black flex justify-between">
        <div>
          <span className="font-semibold text-xs text-slate-600 print:text-black">Kepada Yth:</span>
          <p className="font-black text-base uppercase m-0 mt-0.5">{transaction.namaSekolah}</p>
          <p className="text-xs font-medium m-0">{transaction.alamatSekolah}, Kec. {transaction.kecamatanSekolah}</p>
          <p className="text-xs text-slate-500 print:text-black m-0">NPSN: {transaction.npsn}</p>
        </div>
        <div className="text-right">
          <span className="font-semibold text-xs text-slate-600 print:text-black">Keperluan Belanja:</span>
          <p className="font-black text-sm m-0 mt-0.5">{transaction.sumberDana}</p>
          <p className="text-xs font-semibold m-0">Tahun Anggaran {transaction.tahunAnggaran}</p>
        </div>
      </div>

      {/* TABEL BARANG */}
      <div className="mb-5 overflow-x-auto">
        <table className={`w-full border-collapse border-2 border-black ${tableTextSize}`}>
          <thead>
            <tr className="bg-slate-100 print:bg-transparent">
              <th className="border-2 border-black px-2 py-2 text-center w-12 font-black">No</th>
              <th className="border-2 border-black px-2 py-2 text-center w-24 font-black">Banyaknya</th>
              <th className="border-2 border-black px-2 py-2 text-center w-20 font-black">Satuan</th>
              <th className="border-2 border-black px-3 py-2 text-center font-black">Nama Barang / Uraian</th>
              <th className="border-2 border-black px-3 py-2 text-center w-36 font-black">Harga Satuan</th>
              <th className="border-2 border-black px-3 py-2 text-center w-36 font-black">Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="border-2 border-black px-2 py-1.5 text-center font-bold">{idx + 1}</td>
                <td className="border-2 border-black px-2 py-1.5 text-center font-black text-base">{item.volume}</td>
                <td className="border-2 border-black px-2 py-1.5 text-center font-medium">{item.satuan}</td>
                <td className="border-2 border-black px-3 py-1.5">
                  <span className="font-bold text-black">{item.namaBarang}</span>
                  {item.spesifikasi && <span className="text-xs text-slate-600 print:text-black block italic">{item.spesifikasi}</span>}
                </td>
                <td className="border-2 border-black px-3 py-1.5 text-right font-medium">{formatRupiah(item.hargaSatuan, false)}</td>
                <td className="border-2 border-black px-3 py-1.5 text-right font-bold">{formatRupiah(item.totalHarga, false)}</td>
              </tr>
            ))}
            <tr className="font-black bg-slate-100 print:bg-transparent">
              <td colSpan={5} className="border-2 border-black px-3 py-2 text-right uppercase text-sm">
                Jumlah Total Belanja
              </td>
              <td className="border-2 border-black px-3 py-2 text-right font-black text-base">
                {formatRupiah(transaction.totalBelanja)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TERBILANG */}
      <div className="mb-6 bg-slate-100 print:bg-transparent p-3 border-2 border-slate-300 print:border-black rounded-md">
        <span className="font-black">Terbilang : </span>
        <span className="italic font-bold text-black">{terbilang(transaction.totalBelanja)}</span>
      </div>

      {/* TANDA TANGAN NOTA */}
      <div className="grid grid-cols-2 gap-6 pt-2">
        <div className="text-center">
          <p className="m-0 leading-tight font-medium">Tanda Terima Pihak Sekolah,</p>
          <div className="h-20 flex items-center justify-center text-slate-300 text-xs italic print:text-transparent">
            (Cap Sekolah & Tanda Tangan)
          </div>
          <p className="font-black underline m-0 text-base">
            {transaction.namaSekolah}
          </p>
        </div>

        <div className="text-center relative">
          <p className="m-0 leading-tight font-medium">Hormat Kami (Pihak Toko),</p>
          <div className="relative h-20 flex items-center justify-center">
            {/* Automatic Store Stamp (samar-samar in background) */}
            <div className="absolute left-6 -top-2 z-0 pointer-events-none">
              <StoreStamp size={82} />
            </div>
            {/* Automatic Store Signature */}
            <div className="relative z-10 flex items-center justify-center">
              <StoreSignature width={130} height={60} />
            </div>
            {/* LUNAS Stamp */}
            <div className="absolute right-0 top-3 border-2 border-red-600 text-red-600 font-black uppercase px-2.5 py-0.5 rounded-sm tracking-wider text-[11px] rotate-[-12deg] opacity-80 select-none z-20 pointer-events-none">
              LUNAS DIBAYAR
            </div>
          </div>
          <p className="font-black underline uppercase m-0 text-base relative z-10">
            {transaction.storeOwner || transaction.storeName}
          </p>
          <p className="text-xs text-slate-700 print:text-black font-semibold m-0 mt-0.5">{transaction.storeName}</p>
        </div>
      </div>
    </div>
  );
};
