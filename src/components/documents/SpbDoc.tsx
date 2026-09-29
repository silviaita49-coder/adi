import React from 'react';
import { SpjTransaction, PrintSettings } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';
import { StoreStamp } from '../StoreStamp';
import { StoreSignature } from '../StoreSignature';

interface SpbDocProps {
  transaction: SpjTransaction;
  settings: PrintSettings;
}

export const SpbDoc: React.FC<SpbDocProps> = ({
  transaction,
  settings,
}) => {
  const lokasiKecamatan = transaction.kecamatanSekolah || 'Barong Tongkok';
  const tanggalDoc = transaction.tempatTanggal || `${lokasiKecamatan}, ${formatTanggalIndo(transaction.tanggalTransaksi)}`;

  const isLarge = settings.fontSizeMode === 'large' || !settings.fontSizeMode;
  const isXLarge = settings.fontSizeMode === 'xlarge';

  const baseTextSize = isXLarge ? 'text-[15px]' : isLarge ? 'text-[14px]' : 'text-[13px]';
  const tableTextSize = isXLarge ? 'text-[13px]' : isLarge ? 'text-[12px]' : 'text-[11px]';

  return (
    <div
      id="doc-spb-print"
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
          SURAT PESANAN BARANG (SPB)
        </h3>
        <p className="text-xs font-semibold mt-1 m-0">
          Nomor: {transaction.noSpb}
        </p>
      </div>

      {/* TUJUAN PESANAN & TANGGAL */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
        <div>
          <p className="m-0 font-semibold">Kepada Yth,</p>
          <p className="m-0 font-bold text-sm uppercase">{transaction.storeName}</p>
          <p className="m-0 text-black">{transaction.storeAddress}</p>
          <p className="m-0 italic">Di Tempat</p>
        </div>
        <div className="text-right">
          <p className="m-0 font-bold">{tanggalDoc}</p>
          <p className="m-0">Sumber Dana: <span className="font-bold">{transaction.sumberDana}</span></p>
          <p className="m-0">Tahun Anggaran: <span className="font-bold">{transaction.tahunAnggaran}</span></p>
        </div>
      </div>

      {/* PENGANTAR */}
      <p className="text-justify mb-3 leading-snug font-normal text-xs">
        Dengan hormat, sehubungan dengan kebutuhan operasional di{' '}
        <span className="font-bold">{transaction.namaSekolah}</span> yang bersumber dari dana{' '}
        <span className="font-bold">{transaction.sumberDana}</span> Tahun Anggaran{' '}
        <span className="font-bold">{transaction.tahunAnggaran}</span>, dengan ini kami mengajukan pesanan barang sebagai berikut:
      </p>

      {/* TABEL RINCIAN PESANAN BARANG */}
      <div className="mb-3 overflow-x-auto">
        <table className={`w-full border-collapse border border-black ${tableTextSize}`}>
          <thead>
            <tr className="bg-slate-50 print:bg-transparent">
              <th className="border border-black px-1.5 py-1 text-center w-10 font-bold">No</th>
              <th className="border border-black px-2 py-1 text-center font-bold">Nama Barang & Spesifikasi</th>
              <th className="border border-black px-1.5 py-1 text-center w-16 font-bold">Vol</th>
              <th className="border border-black px-1.5 py-1 text-center w-16 font-bold">Satuan</th>
              <th className="border border-black px-2 py-1 text-center w-28 font-bold">Harga Satuan</th>
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
                    <span className="text-[11px] text-slate-700 italic block">{item.spesifikasi}</span>
                  )}
                </td>
                <td className="border border-black px-1.5 py-0.5 text-center font-bold">{item.volume}</td>
                <td className="border border-black px-1.5 py-0.5 text-center">{item.satuan}</td>
                <td className="border border-black px-2 py-0.5 text-right font-medium">{formatRupiah(item.hargaSatuan)}</td>
                <td className="border border-black px-2 py-0.5 text-right font-bold">{formatRupiah(item.totalHarga)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-slate-50 print:bg-transparent">
              <td colSpan={5} className="border border-black px-2 py-1 text-right uppercase text-xs">
                Jumlah Total Pesanan
              </td>
              <td className="border border-black px-2 py-1 text-right font-black text-sm">
                {formatRupiah(transaction.totalBelanja)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TERBILANG */}
      <div className="mb-3 text-xs border border-black p-2 bg-transparent">
        <span className="font-bold">Terbilang : </span>
        <span className="italic font-bold text-black">{terbilang(transaction.totalBelanja)}</span>
      </div>

      {/* KETENTUAN */}
      <p className="text-justify mb-4 leading-snug text-xs">
        Barang-barang tersebut di atas mohon dapat disediakan dalam kondisi 100% baik, baru, dan sesuai rincian. Pembayaran akan dilakukan setelah barang diserahterimakan secara lengkap melalui Berita Acara Serah Terima (BAST).
      </p>

      {/* TANDA TANGAN */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="text-center relative">
          <p className="m-0 leading-tight font-medium text-xs">Menerima dan Menyetujui,</p>
          <p className="m-0 font-bold uppercase text-xs">{transaction.storeName}</p>
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
            {transaction.storeOwner || 'Pemilik Toko'}
          </p>
          <p className="text-[11px] text-black font-semibold m-0 mt-0.5">Pimpinan Toko / Rekanan</p>
        </div>

        <div className="text-center">
          <p className="m-0 leading-tight font-medium text-xs">Pemesan,</p>
          <p className="m-0 font-bold text-xs">Kepala {transaction.namaSekolah}</p>
          <div className="h-18 flex items-center justify-center text-slate-300 text-xs italic print:text-transparent">
            (Tanda Tangan)
          </div>
          <p className="font-bold underline uppercase m-0 text-sm">
            {transaction.namaKepalaSekolah}
          </p>
          {settings.tampilkanNip && (
            <p className="text-[11px] text-black font-semibold m-0 mt-0.5">
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
