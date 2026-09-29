import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StoreProfile,
  ClientSchool,
  MasterItem,
  SpjTransaction,
  UserAccount,
  PrintSettings,
} from '../types';

interface AppContextType {
  // Auth & Roles
  currentUser: UserAccount;
  users: UserAccount[];
  setCurrentUser: (user: UserAccount) => void;
  updateUser: (id: string, updated: Partial<UserAccount>) => void;
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  deleteUser: (id: string) => void;
  isAdmin: boolean;

  // Profil Toko (Pihak Toko)
  myStore: StoreProfile;
  updateMyStore: (data: Partial<StoreProfile>) => void;

  // Master Sekolah Pelanggan (Diinput & Dikelola oleh Toko)
  schools: ClientSchool[];
  addSchool: (school: Omit<ClientSchool, 'id'>) => void;
  updateSchool: (id: string, data: Partial<ClientSchool>) => void;
  deleteSchool: (id: string) => void;

  // Master Barang
  items: MasterItem[];
  addItem: (item: Omit<MasterItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<MasterItem>) => void;
  deleteItem: (id: string) => void;

  // Transaksi SPJ
  transactions: SpjTransaction[];
  addTransaction: (tx: Omit<SpjTransaction, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTransaction: (id: string, tx: Partial<SpjTransaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => string;

  // Print & Display Settings (Zoom & Font Size)
  printSettings: PrintSettings;
  updatePrintSettings: (settings: Partial<PrintSettings>) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;

  // Active Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Detail Modal Trigger
  selectedTxId: string | null;
  setSelectedTxId: (id: string | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  editingTxId: string | null;
  setEditingTxId: (id: string | null) => void;

  // Toast notification
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Backup & Reset
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'spj_toko_sekolah_app_v2';

// Toko Anda (Profil Pihak Toko)
const defaultMyStore: StoreProfile = {
  namaToko: 'Toko Perlengkapan Sekolah & ATK',
  namaPemilik: 'Nama Pemilik / Pimpinan Toko',
  alamat: 'Jl. Utama Pasar No. 12',
  noHp: '081234567890',
  npwp: '08.123.456.7-728.000',
  bank: 'Bank Kaltimtara / BRI / Mandiri',
  noRekening: '1234-5678-9012',
  kategoriUsaha: 'Pengadaan ATK, APE & Perlengkapan Sekolah',
  tampilkanStempel: true,
  stempelType: 'toko_kita',
  customStempelUrl: '',
  kepekatanStempel: 'samar',
  tampilkanTtd: true,
  customTtdUrl: '',
};

// Daftar Sekolah Langganan yang Dilayani Toko (Dapat diubah bebas oleh toko)
const defaultSchools: ClientSchool[] = [
  {
    id: 'school-1',
    namaSekolah: 'PAUD / TK Harapan Bangsa',
    npsn: '69894721',
    jenjang: 'PAUD',
    alamat: 'Jl. Melati RT 02',
    kecamatan: 'Barong Tongkok',
    kabupatenKota: 'Kabupaten Kutai Barat',
    provinsi: 'Kalimantan Timur',
    namaProgram: 'BOP PAUD',
    namaKepalaSekolah: 'Nama Kepala Sekolah, S.Pd',
    nipKepalaSekolah: '-',
    namaBendahara: 'Nama Bendahara Sekolah',
    nipBendahara: '-',
    jabatanBendahara: 'Bendahara BOP',
  },
  {
    id: 'school-2',
    namaSekolah: 'SD Negeri 001 Barong',
    npsn: '30401234',
    jenjang: 'SD',
    alamat: 'Jl. Pendidikan No. 45',
    kecamatan: 'Barong Tongkok',
    kabupatenKota: 'Kabupaten Kutai Barat',
    provinsi: 'Kalimantan Timur',
    namaProgram: 'BOS Reguler',
    namaKepalaSekolah: 'Drs. H. Mulyadi, M.Pd',
    nipKepalaSekolah: '19700101 199503 1 002',
    namaBendahara: 'Sri Wahyuni, S.Pd',
    nipBendahara: '19820512 200801 2 015',
    jabatanBendahara: 'Bendahara BOS Reguler',
  },
];

const defaultUsers: UserAccount[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'password123',
    fullName: 'Admin Toko (Pihak Toko)',
    role: 'admin',
    title: 'Administrator Toko & Keuangan',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'user-operator',
    username: 'operator',
    password: 'user123',
    fullName: 'Operator Kasir & Pembuat SPJ',
    role: 'user',
    title: 'Staf Administrasi SPJ Toko',
    avatarColor: 'bg-blue-600',
  },
];

const defaultItems: MasterItem[] = [
  {
    id: 'item-1',
    kodeBarang: 'ATK-001',
    namaBarang: 'Kertas Linen Folio',
    satuan: 'rim',
    hargaStandar: 85000,
    kategori: 'ATK',
    keterangan: 'Kertas linen putih berkualitas',
  },
  {
    id: 'item-2',
    kodeBarang: 'PER-002',
    namaBarang: 'Timbangan Digital',
    satuan: 'unit',
    hargaStandar: 70000,
    kategori: 'Peralatan Sekolah & UKS',
    keterangan: 'Timbangan akurat',
  },
  {
    id: 'item-3',
    kodeBarang: 'ATK-003',
    namaBarang: 'Kertas HVS 70gr A4',
    satuan: 'rim',
    hargaStandar: 55000,
    kategori: 'ATK',
    keterangan: 'PaperOne / Sinar Dunia',
  },
  {
    id: 'item-4',
    kodeBarang: 'APE-004',
    namaBarang: 'Alat Peraga Edukatif (APE)',
    satuan: 'set',
    hargaStandar: 220000,
    kategori: 'Media Ajar & Edukasi',
    keterangan: 'Aman untuk anak',
  },
];

const defaultTransactions: SpjTransaction[] = [
  {
    id: 'tx-001',
    noBukti: '3',
    noSpb: '003/SPB-BOP/2026',
    noBast: '003/BAST-BOP/2026',
    tahunAnggaran: '2026',
    sumberDana: 'BOP PAUD',
    tanggalTransaksi: '2026-09-28',
    tanggalBayar: '2026-09-28',
    tempatTanggal: 'Barong Tongkok, 28 September 2026',

    // School data (entered by Toko)
    namaSekolah: 'PAUD / TK Harapan Bangsa',
    npsn: '69894721',
    alamatSekolah: 'Jl. Melati RT 02',
    kecamatanSekolah: 'Barong Tongkok',
    kabupatenSekolah: 'Kabupaten Kutai Barat',
    namaKepalaSekolah: 'Nama Kepala Sekolah, S.Pd',
    nipKepalaSekolah: '-',
    namaBendahara: 'Nama Bendahara Sekolah',
    nipBendahara: '-',
    jabatanBendahara: 'Bendahara BOP',

    // Toko data
    storeName: 'Toko Perlengkapan Sekolah & ATK',
    storeOwner: 'Nama Pemilik / Pimpinan Toko',
    storeAddress: 'Jl. Utama Pasar No. 12',

    items: [
      {
        id: 'row-1',
        itemId: 'item-1',
        namaBarang: 'Kertas linen',
        spesifikasi: 'Ukuran F4 warna putih',
        volume: 1,
        satuan: 'rim',
        hargaSatuan: 85000,
        totalHarga: 85000,
      },
      {
        id: 'row-2',
        itemId: 'item-2',
        namaBarang: 'Timbangan digital',
        spesifikasi: 'Digital sensor akurat',
        volume: 1,
        satuan: 'unit',
        hargaSatuan: 70000,
        totalHarga: 70000,
      },
    ],
    totalBelanja: 155000,
    kenaPpn: false,
    persenPpn: 0,
    nominalPpn: 0,
    kenaPph: false,
    jenisPph: 'Bebas Pajak',
    persenPph: 0,
    nominalPph: 0,
    jumlahSetelahPotong: 155000,
    sudahTerimaDari: 'Bendahara BOP PAUD / TK Harapan Bangsa',
    sebagaiPembayaran: 'Kertas linen dan Timbangan digital',
    catatan: 'Pengadaan sarana perlengkapan sekolah',
    status: 'lunas',
    dibuatOleh: 'admin',
    createdAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-09-28T09:00:00Z',
  },
];

const defaultPrintSettings: PrintSettings = {
  kosongkanKop: true, // Selalu kosongkan kop sesuai permintaan user agar bisa pakai kertas kop resmi sekolah
  tinggiKopCm: 3.8,
  tampilkanNip: true,
  fontKeluaran: 'times',
  fontSizeMode: 'large', // Ukuran besar agar jelas terbaca!
  zoomLevel: 125, // Zoom 125% bawaan agar besar dan nyaman di layar!
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myStore, setMyStore] = useState<StoreProfile>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_my_store`);
      return stored ? JSON.parse(stored) : defaultMyStore;
    } catch {
      return defaultMyStore;
    }
  });

  const [schools, setSchools] = useState<ClientSchool[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_client_schools`);
      return stored ? JSON.parse(stored) : defaultSchools;
    } catch {
      return defaultSchools;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_users`);
      return stored ? JSON.parse(stored) : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_current_user`);
      return stored ? JSON.parse(stored) : defaultUsers[0];
    } catch {
      return defaultUsers[0];
    }
  });

  const [items, setItems] = useState<MasterItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_items`);
      return stored ? JSON.parse(stored) : defaultItems;
    } catch {
      return defaultItems;
    }
  });

  const [transactions, setTransactions] = useState<SpjTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_txs`);
      return stored ? JSON.parse(stored) : defaultTransactions;
    } catch {
      return defaultTransactions;
    }
  });

  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_print`);
      return stored ? JSON.parse(stored) : defaultPrintSettings;
    } catch {
      return defaultPrintSettings;
    }
  });

  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    return printSettings.zoomLevel || 125;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_my_store`, JSON.stringify(myStore));
  }, [myStore]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_client_schools`, JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_print`, JSON.stringify({ ...printSettings, zoomLevel }));
  }, [printSettings, zoomLevel]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const isAdmin = currentUser.role === 'admin';

  // Toko Update
  const updateMyStore = (data: Partial<StoreProfile>) => {
    setMyStore((prev) => ({ ...prev, ...data }));
    showToast('Profil usaha toko Anda berhasil disimpan');
  };

  // Client Schools Management (by Toko)
  const addSchool = (schoolData: Omit<ClientSchool, 'id'>) => {
    const newSchool: ClientSchool = {
      ...schoolData,
      id: `school-${Date.now()}`,
    };
    setSchools((prev) => [newSchool, ...prev]);
    showToast(`Sekolah ${newSchool.namaSekolah} berhasil didaftarkan`);
  };

  const updateSchool = (id: string, data: Partial<ClientSchool>) => {
    setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    showToast('Data sekolah berhasil diperbarui');
  };

  const deleteSchool = (id: string) => {
    setSchools((prev) => prev.filter((s) => s.id !== id));
    showToast('Sekolah dihapus dari daftar');
  };

  // User management
  const updateUser = (id: string, updated: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newU = { ...u, ...updated };
          if (currentUser.id === id) {
            setCurrentUser(newU);
          }
          return newU;
        }
        return u;
      })
    );
    showToast('Akun pengguna diperbarui');
  };

  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Pengguna ${newUser.fullName} berhasil ditambahkan`);
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      showToast('Minimal harus ada 1 pengguna!', 'error');
      return;
    }
    if (currentUser.id === id) {
      showToast('Tidak bisa menghapus akun yang sedang aktif!', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Pengguna dihapus');
  };

  // Master Barang
  const addItem = (itemData: Omit<MasterItem, 'id'>) => {
    const newItem: MasterItem = {
      ...itemData,
      id: `item-${Date.now()}`,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(`Barang ${newItem.namaBarang} berhasil ditambahkan`);
  };

  const updateItem = (id: string, itemData: Partial<MasterItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...itemData } : i)));
    showToast('Data barang diperbarui');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Barang berhasil dihapus');
  };

  // Transactions SPJ
  const addTransaction = (txData: Omit<SpjTransaction, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString();
    const id = `tx-${Date.now()}`;
    const newTx: SpjTransaction = {
      ...txData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`SPJ No. Bukti #${newTx.noBukti} untuk ${newTx.namaSekolah} berhasil dibuat!`);
    return id;
  };

  const updateTransaction = (id: string, txData: Partial<SpjTransaction>) => {
    const now = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...txData, updatedAt: now } : t))
    );
    showToast('Data transaksi SPJ berhasil diperbarui');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi SPJ telah dihapus');
  };

  const duplicateTransaction = (id: string): string => {
    const source = transactions.find((t) => t.id === id);
    if (!source) return '';

    const nextNumber = `${parseInt(source.noBukti, 10) ? parseInt(source.noBukti, 10) + 1 : source.noBukti + '-Copy'}`;
    const now = new Date().toISOString();
    const newId = `tx-${Date.now()}`;

    const duplicated: SpjTransaction = {
      ...source,
      id: newId,
      noBukti: nextNumber,
      noSpb: source.noSpb.replace(/\d+/, nextNumber),
      noBast: source.noBast.replace(/\d+/, nextNumber),
      createdAt: now,
      updatedAt: now,
      dibuatOleh: currentUser.username,
      status: 'draft',
    };

    setTransactions((prev) => [duplicated, ...prev]);
    showToast(`Berhasil menduplikasi SPJ jadi No. Bukti #${nextNumber}`);
    return newId;
  };

  const updatePrintSettings = (settings: Partial<PrintSettings>) => {
    setPrintSettings((prev) => ({ ...prev, ...settings }));
    showToast('Setelan tampilan & cetak diperbarui');
  };

  const exportDatabaseJson = () => {
    const dump = {
      app: 'SPJ_TOKO_SEKOLAH_BACKUP',
      exportedAt: new Date().toISOString(),
      myStore,
      schools,
      users,
      items,
      transactions,
      printSettings,
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup-SPJ-Toko-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('File backup data SPJ berhasil diunduh');
  };

  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.myStore) setMyStore(data.myStore);
      if (data.schools) setSchools(data.schools);
      if (data.items) setItems(data.items);
      if (data.transactions) setTransactions(data.transactions);
      if (data.users) setUsers(data.users);
      if (data.printSettings) setPrintSettings(data.printSettings);
      showToast('Data SPJ berhasil dipulihkan');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Gagal membaca file cadangan JSON', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        updateUser,
        addUser,
        deleteUser,
        isAdmin,
        myStore,
        updateMyStore,
        schools,
        addSchool,
        updateSchool,
        deleteSchool,
        items,
        addItem,
        updateItem,
        deleteItem,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        printSettings,
        updatePrintSettings,
        zoomLevel,
        setZoomLevel,
        activeTab,
        setActiveTab,
        selectedTxId,
        setSelectedTxId,
        isCreateModalOpen,
        setIsCreateModalOpen,
        editingTxId,
        setEditingTxId,
        toast,
        showToast,
        exportDatabaseJson,
        importDatabaseJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
