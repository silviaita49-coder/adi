export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  title?: string;
  avatarColor?: string;
}

// Toko / Rekanan Profile (Pihak Toko)
export interface StoreProfile {
  namaToko: string;
  namaPemilik: string; // Penandatangan dari pihak toko
  alamat: string;
  noHp: string;
  npwp?: string;
  bank?: string;
  noRekening?: string;
  kategoriUsaha?: string;
  // Stempel Toko Otomatis
  tampilkanStempel: boolean;
  stempelType: 'toko_kita' | 'auto_nama' | 'custom_upload';
  customStempelUrl?: string;
  kepekatanStempel?: 'samar' | 'sedang' | 'jelas'; // default 'samar' sesuai permintaan user

  // Tanda Tangan Toko Otomatis
  tampilkanTtd: boolean;
  customTtdUrl?: string; // upload custom ttd or default to user's uploaded signature
}

// Data Sekolah Pelanggan yang diinput oleh Pihak Toko
export interface ClientSchool {
  id: string;
  namaSekolah: string;
  npsn: string;
  jenjang: 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Lainnya';
  alamat: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  namaProgram: string; // BOP PAUD / DANA BOS
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaBendahara: string;
  nipBendahara: string;
  jabatanBendahara: string;
}

export interface MasterItem {
  id: string;
  kodeBarang?: string;
  namaBarang: string;
  satuan: string; // rim, buah, unit, paket, kotak, botol, lembar, dll
  hargaStandar: number;
  kategori: string;
  keterangan?: string;
}

export interface SpjItemDetail {
  id: string;
  itemId?: string;
  namaBarang: string;
  spesifikasi?: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  totalHarga: number;
}

export interface SpjTransaction {
  id: string;
  noBukti: string; // contoh: "3" atau "03/BOP/2026"
  noSpb: string;
  noBast: string;
  tahunAnggaran: string;
  sumberDana: string; // BOP PAUD / BOS Reguler
  tanggalTransaksi: string;
  tanggalBayar: string;
  tempatTanggal: string;

  // Data Sekolah (Diinput oleh Toko per SPJ)
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kecamatanSekolah: string;
  kabupatenSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaBendahara: string;
  nipBendahara: string;
  jabatanBendahara: string;

  // Data Toko (Pihak Toko)
  storeId?: string;
  storeName: string;
  storeOwner: string;
  storeAddress: string;

  // Rincian Belanja
  items: SpjItemDetail[];
  totalBelanja: number;

  // Pajak
  kenaPpn: boolean;
  persenPpn: number;
  nominalPpn: number;
  kenaPph: boolean;
  jenisPph: 'PPh 21' | 'PPh 22' | 'PPh 23' | 'Bebas Pajak';
  persenPph: number;
  nominalPph: number;
  jumlahSetelahPotong: number;

  // Uraian Kuitansi
  sudahTerimaDari: string;
  sebagaiPembayaran: string;
  catatan?: string;
  status: 'draft' | 'siap_cetak' | 'lunas';
  dibuatOleh: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrintSettings {
  kosongkanKop: boolean;
  tinggiKopCm: number;
  tampilkanNip: boolean;
  fontKeluaran: 'times' | 'arial' | 'sans';
  fontSizeMode: 'normal' | 'large' | 'xlarge'; // Ukuran teks agar jelas terlihat
  zoomLevel: number; // 100, 125, 150, 175
}
