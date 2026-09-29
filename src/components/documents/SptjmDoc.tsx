import React from 'react';
import { SpjTransaction, PrintSettings } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';

interface SptjmDocProps {
  transaction: SpjTransaction;
  settings: PrintSettings;
}

export const SptjmDoc: React.FC<SptjmDocProps> = ({
  transaction,
  settings,
}) => {
  const lokasiKecamatan = transaction.kecamatanSekolah || 'Barong Tongkok';
  const tanggalDoc = transaction.tempatTanggal || `${lokasiKecamatan}, ${formatTanggalIndo(transaction.tanggalTransaksi)}`;

  const isLarge = settings.fontSizeMode === 'large' || !settings.fontSizeMode;
  const isXLarge = settings.fontSizeMode === 'xlarge';
  const baseTextSize = isXLarge ? 'text-base' : isLarge ? 'text-[15px]' : 'text-sm';

  return (
    <div
      id="doc-sptjm-print"
      className={`spj-printable-page bg-white text-black p-8 sm:p-10 font-serif leading-relaxed ${baseTextSize} w-full max-w-[210mm] mx-auto border-2 border-slate-300 print:border-none print:p-0 print:m-0 print:shadow-none shadow-lg mb-8 print:mb-0`}
      style={{
        fontFamily: settings.fontKeluaran === 'times' ? '"Times New Roman", Times, serif' : 'Arial, sans-serif',
      }}
    >
      {/* KOP SURAT */}
      {settings.kosongkanKop ? (
        <div
          className="w-full flex items-center justify-center border-2 border-dashed border-slate-300 print:border-none mb-6 text-sm text-slate-400 italic print:text-transparent select-none bg-slate-50/50 print:bg-transparent rounded-lg print:rounded-none"
          style={{ height: `${settings.tinggiKopCm || 3.8}cm` }}
        >
          <span>[ Area Kosong Kop Surat Resmi Sekolah ({settings.tinggiKopCm || 3.8} cm) - Siap Dicetak di Kertas Berkepala ]</span>
        </div>
      ) : (
        <div className="text-center pb-3 border-b-4 border-double border-black mb-6">
          <h2 className="font-extrabold text-xl uppercase tracking-wider m-0 leading-tight">
            {transaction.namaSekolah}
          </h2>
          <p className="text-sm uppercase m-0 leading-tight mt-1 font-semibold">
            {transaction.alamatSekolah}, KECAMATAN {transaction.kecamatanSekolah.toUpperCase()}
          </p>
          <p className="text-xs m-0">
            NPSN: {transaction.npsn} • {transaction.kabupatenSekolah}
          </p>
        </div>
      )}

      {/* JUDUL */}
      <div className="text-center my-5">
        <h2 className="font-black text-lg sm:text-xl uppercase underline tracking-wide m-0">
          SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)
        </h2>
        <p className="text-sm font-bold m-0 mt-1">
          Nomor: {transaction.noBukti}/SPTJM/{transaction.tahunAnggaran}
        </p>
      </div>

      <p className="text-justify mb-4">
        Yang bertanda tangan di bawah ini:
      </p>

      <div className="mb-5 space-y-2 pl-4">
        <div className="flex">
          <span className="w-48 font-semibold">Nama Lengkap</span>
          <span className="w-4 font-bold">:</span>
          <span className="flex-1 font-black uppercase text-base">{transaction.namaKepalaSekolah}</span>
        </div>
        <div className="flex">
          <span className="w-48 font-semibold">NIP / NUPTK</span>
          <span className="w-4 font-bold">:</span>
          <span className="flex-1 font-medium">{transaction.nipKepalaSekolah || '-'}</span>
        </div>
        <div className="flex">
          <span className="w-48 font-semibold">Jabatan</span>
          <span className="w-4 font-bold">:</span>
          <span className="flex-1 font-bold">Kepala {transaction.namaSekolah}</span>
        </div>
        <div className="flex">
          <span className="w-48 font-semibold">Nama Satuan Pendidikan</span>
          <span className="w-4 font-bold">:</span>
          <span className="flex-1 font-black">{transaction.namaSekolah} (NPSN: {transaction.npsn})</span>
        </div>
        <div className="flex">
          <span className="w-48 font-semibold">Alamat Lembaga</span>
          <span className="w-4 font-bold">:</span>
          <span className="flex-1">{transaction.alamatSekolah}, Kec. {transaction.kecamatanSekolah}</span>
        </div>
      </div>

      <p className="text-justify mb-4 leading-relaxed font-normal">
        Dengan ini menyatakan dengan sesungguhnya dan penuh tanggung jawab bahwa belanja dana{' '}
        <span className="font-bold">{transaction.sumberDana}</span> Tahun Anggaran{' '}
        <span className="font-bold">{transaction.tahunAnggaran}</span> sebagaimana tertera dalam bukti kuitansi nomor{' '}
        <span className="font-bold">#{transaction.noBukti}</span> sebesar{' '}
        <span className="font-black">{formatRupiah(transaction.totalBelanja)}</span> (
        <span className="italic font-bold">{terbilang(transaction.totalBelanja)}</span>) untuk pembayaran{' '}
        <span className="font-bold">"{transaction.sebagaiPembayaran}"</span> kepada rekanan{' '}
        <span className="font-black uppercase">{transaction.storeName}</span> telah dilaksanakan sesuai ketentuan yang berlaku.
      </p>

      <p className="text-justify mb-4 leading-relaxed font-normal">
        Bukti-bukti pengeluaran dan serah terima barang/jasa disimpan dengan baik sesuai peraturan perundang-undangan dan siap untuk diaudit oleh instansi yang berwenang.
      </p>

      <p className="text-justify mb-6 leading-relaxed font-normal">
        Demikian Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) ini saya buat dengan sadar dan tanpa paksaan dari pihak manapun.
      </p>

      {/* TANDA TANGAN */}
      <div className="flex justify-end pt-2">
        <div className="w-80 text-center">
          <p className="m-0 leading-tight font-medium">{tanggalDoc}</p>
          <p className="m-0 font-bold leading-tight">Kepala {transaction.namaSekolah}</p>
          <div className="h-24 flex items-center justify-center text-slate-300 text-xs italic print:text-transparent">
            (Materai Rp 10.000 & Tanda Tangan)
          </div>
          <p className="font-black underline uppercase m-0 text-base">
            {transaction.namaKepalaSekolah}
          </p>
          {settings.tampilkanNip && (
            <p className="text-xs text-slate-700 print:text-black font-semibold m-0 mt-0.5">
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
