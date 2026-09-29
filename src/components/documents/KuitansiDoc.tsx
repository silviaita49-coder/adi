import React from 'react';
import { SpjTransaction, PrintSettings } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';
import { StoreStamp } from '../StoreStamp';
import { StoreSignature } from '../StoreSignature';

interface KuitansiDocProps {
  transaction: SpjTransaction;
  settings: PrintSettings;
}

export const KuitansiDoc: React.FC<KuitansiDocProps> = ({
  transaction,
  settings,
}) => {
  const totalAngka = transaction.totalBelanja;
  const ppn = transaction.nominalPpn || 0;
  const pph = transaction.nominalPph || 0;
  const netBayar = transaction.jumlahSetelahPotong || totalAngka - ppn - pph;
  const textTerbilang = terbilang(netBayar);

  const lokasiKecamatan = transaction.kecamatanSekolah || 'Barong Tongkok';
  const tanggalDoc = transaction.tempatTanggal || `${lokasiKecamatan}, ${formatTanggalIndo(transaction.tanggalTransaksi)}`;

  const isLarge = settings.fontSizeMode === 'large' || !settings.fontSizeMode;
  const isXLarge = settings.fontSizeMode === 'xlarge';

  const baseTextSize = isXLarge ? 'text-[15px]' : isLarge ? 'text-[14px]' : 'text-[13px]';
  const labelWidth = isXLarge ? 'w-48' : isLarge ? 'w-44' : 'w-40';
  const tableTextSize = isXLarge ? 'text-[13px]' : isLarge ? 'text-[12px]' : 'text-[11px]';

  return (
    <div
      id="doc-kuitansi-print"
      className={`spj-printable-page bg-white text-black p-6 sm:p-8 font-serif leading-normal ${baseTextSize} w-full max-w-[210mm] mx-auto border border-slate-300 print:border-none print:p-0 print:m-0 print:shadow-none shadow-md mb-6 print:mb-0`}
      style={{
        fontFamily: settings.fontKeluaran === 'times' ? '"Times New Roman", Times, serif' : 'Arial, sans-serif',
      }}
    >
      {/* KOP SURAT */}
      {settings.kosongkanKop ? (
        <div
          className="w-full flex items-center justify-center border border-dashed border-slate-300 print:border-none mb-4 text-xs text-slate-400 italic print:text-transparent select-none bg-slate-50/50 print:bg-transparent"
          style={{ height: `${settings.tinggiKopCm || 3.8}cm` }}
        >
          <span>[ Area Kosong Kop Surat Resmi Sekolah ({settings.tinggiKopCm || 3.8} cm) ]</span>
        </div>
      ) : (
        <div className="text-center pb-2 border-b-2 border-black mb-4">
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

      {/* HEADER TAHUN ANGGARAN & NO BUKTI */}
      <div className="flex justify-end mb-3">
        <table className={`font-bold w-auto min-w-[240px] ${tableTextSize}`}>
          <tbody>
            <tr>
              <td className="py-0.5 pr-2 uppercase tracking-wide">TAHUN ANGGARAN</td>
              <td className="py-0.5 px-1">:</td>
              <td className="py-0.5 pl-2 font-black text-sm">{transaction.tahunAnggaran}</td>
            </tr>
            <tr>
              <td className="py-0.5 pr-2 uppercase tracking-wide">NO. BUKTI</td>
              <td className="py-0.5 px-1">:</td>
              <td className="py-0.5 pl-2 font-black text-sm">{transaction.noBukti}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* JUDUL DOKUMEN */}
      <div className="text-center my-4">
        <span className="font-bold text-base sm:text-lg tracking-wide uppercase border-b-2 border-black pb-0.5 inline-block">
          KUITANSI / BUKTI PEMBAYARAN
        </span>
      </div>

      {/* BADAN KUITANSI: format a, b, c, d */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-start">
          <div className="w-6 font-bold">a.</div>
          <div className={`${labelWidth} font-semibold shrink-0`}>Sudah Terima Dari</div>
          <div className="w-4 text-center font-bold">:</div>
          <div className="flex-1 font-bold text-black">{transaction.sudahTerimaDari}</div>
        </div>

        <div className="flex items-start">
          <div className="w-6 font-bold">b.</div>
          <div className={`${labelWidth} font-semibold shrink-0`}>Uang Sebesar</div>
          <div className="w-4 text-center font-bold">:</div>
          <div className="flex-1 font-black text-base text-black">
            {formatRupiah(netBayar)}
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-6 font-bold">c.</div>
          <div className={`${labelWidth} font-semibold shrink-0`}>Terbilang</div>
          <div className="w-4 text-center font-bold">:</div>
          <div className="flex-1 italic font-semibold border-b border-black pb-0.5">
            "{textTerbilang}"
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-6 font-bold">d.</div>
          <div className={`${labelWidth} font-semibold shrink-0`}>Sebagai Pembayaran</div>
          <div className="w-4 text-center font-bold">:</div>
          <div className="flex-1 font-semibold text-black leading-snug">{transaction.sebagaiPembayaran}</div>
        </div>
      </div>

      {/* TABEL PERHITUNGAN PAJAK */}
      <div className="flex justify-end my-4">
        <div className="w-72">
          <table className={`w-full border-collapse border border-black ${tableTextSize}`}>
            <thead>
              <tr className="bg-slate-50 print:bg-transparent">
                <th className="border border-black px-2.5 py-1 text-center font-bold">Pajak</th>
                <th className="border border-black px-2.5 py-1 text-center font-bold">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2.5 py-0.5 font-medium">Jumlah</td>
                <td className="border border-black px-2.5 py-0.5 text-right font-bold">
                  {formatRupiah(totalAngka)}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2.5 py-0.5">Potongan PPN</td>
                <td className="border border-black px-2.5 py-0.5 text-right font-medium">
                  {ppn > 0 ? formatRupiah(ppn) : 'Rp -'}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2.5 py-0.5">
                  Potongan {transaction.jenisPph !== 'Bebas Pajak' ? transaction.jenisPph : 'PPh'}
                </td>
                <td className="border border-black px-2.5 py-0.5 text-right font-medium">
                  {pph > 0 ? formatRupiah(pph) : 'Rp -'}
                </td>
              </tr>
              <tr className="font-bold bg-slate-50 print:bg-transparent">
                <td className="border border-black px-2.5 py-1">Jumlah setelah potong</td>
                <td className="border border-black px-2.5 py-1 text-right font-black">
                  {formatRupiah(netBayar)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TANDA TANGAN PENERIMA (PIHAK TOKO / PENYEDIA) */}
      <div className="flex justify-end my-4">
        <div className="w-64 text-center relative">
          <p className="m-0 leading-tight font-medium text-xs">{tanggalDoc}</p>
          <p className="m-0 font-bold text-xs mt-0.5">Yang Menerima,</p>
          <div className="h-18 relative flex items-center justify-center">
            {/* Automatic Store Stamp (samar-samar) */}
            <div className="absolute left-4 -top-2 z-0 pointer-events-none">
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
          <p className="text-[11px] text-black font-semibold mt-0.5 m-0">
            {transaction.storeName}
          </p>
        </div>
      </div>

      {/* CATATAN RESMI */}
      <div className="border-t border-black pt-1.5 mt-3 text-[10px] text-black">
        <p className="m-0 italic">
          * Dokumen bukti sah belanja dana {transaction.sumberDana} TA {transaction.tahunAnggaran} Satuan Pendidikan {transaction.namaSekolah}.
        </p>
      </div>
    </div>
  );
};
