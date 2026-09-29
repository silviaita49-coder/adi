import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KuitansiDoc } from './documents/KuitansiDoc';
import { SpbDoc } from './documents/SpbDoc';
import { BastDoc } from './documents/BastDoc';
import { NotaDoc } from './documents/NotaDoc';
import { SptjmDoc } from './documents/SptjmDoc';
import { downloadElementAsPdf, downloadAll5DocumentsAsPdf, openPrintWindow } from '../utils/pdfGenerator';
import {
  Printer,
  Download,
  FileText,
  Receipt,
  FileCheck2,
  FileCheck,
  CheckCircle,
  X,
  Settings2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Type,
  Layers,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

export const SpjDetailModal: React.FC = () => {
  const {
    selectedTxId,
    setSelectedTxId,
    transactions,
    printSettings,
    updatePrintSettings,
    duplicateTransaction,
    showToast,
  } = useApp();

  const [activeDocTab, setActiveDocTab] = useState<'all' | 'kuitansi' | 'spb' | 'bast' | 'nota' | 'sptjm'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState<number>(printSettings.zoomLevel || 125);

  if (!selectedTxId) return null;

  const transaction = transactions.find((t) => t.id === selectedTxId);
  if (!transaction) return null;

  // PRINT ALL 5 DOCUMENTS (1 Paket Bundel SPJ)
  const handlePrintAll = () => {
    // 1. Try opening dedicated print window (Immune to iframe sandbox)
    const opened = openPrintWindow(`${transaction.noBukti} - ${transaction.namaSekolah}`);
    if (opened) {
      showToast('Membuka jendela cetak & simpan PDF di tab baru...', 'info');
      return;
    }

    // 2. Fallback to direct window.print()
    try {
      document.body.classList.remove('print-single-mode');
      window.print();
    } catch (e) {
      console.warn('Direct print blocked by sandbox:', e);
      showToast('Gunakan tautan "Buka di Tab Baru Laptop" di atas untuk mencetak.', 'error');
    }
  };

  // PRINT ONLY CURRENT ACTIVE DOCUMENT
  const handlePrintSingle = () => {
    document.body.classList.add('print-single-mode');
    try {
      window.print();
    } catch {
      openPrintWindow(`${transaction.noBukti} - ${transaction.namaSekolah}`);
    }
    setTimeout(() => {
      document.body.classList.remove('print-single-mode');
    }, 1200);
  };

  // DOWNLOAD ALL 5 DOCUMENTS INTO 1 BUNDLE PDF
  const handleDownloadAllPdf = async () => {
    setIsExporting(true);
    const safeSchoolName = (transaction.namaSekolah || 'Sekolah').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `SPJ-LENGKAP-5-DOKUMEN-Bukti${transaction.noBukti}-${safeSchoolName}.pdf`;

    setExportProgressText('Mempersiapkan render 5 dokumen PDF...');
    showToast('Memulai download 5 dokumen sekaligus...', 'info');

    const success = await downloadAll5DocumentsAsPdf(filename, (step, total, docName) => {
      setExportProgressText(`Memproses (${step}/${total}): ${docName}`);
      showToast(`Merender PDF (${step}/${total}): ${docName}`, 'info');
    });

    setIsExporting(false);
    setExportProgressText('');

    if (success) {
      showToast('SUKSES! File PDF 5 Dokumen SPJ berhasil diunduh.', 'success');
    } else {
      showToast('Download otomatis dicegah peramban. Membuka jendela cetak untuk simpan PDF...', 'info');
      openPrintWindow(`${transaction.noBukti} - ${transaction.namaSekolah}`);
    }
  };

  // DOWNLOAD ONLY THE CURRENT ACTIVE DOCUMENT (SINGLE)
  const handleDownloadCurrentSinglePdf = async () => {
    setIsExporting(true);
    let elementId = 'doc-kuitansi-print';
    let docTitle = 'Kuitansi';

    if (activeDocTab === 'spb') {
      elementId = 'doc-spb-print';
      docTitle = 'SPB';
    } else if (activeDocTab === 'bast') {
      elementId = 'doc-bast-print';
      docTitle = 'BAST';
    } else if (activeDocTab === 'nota') {
      elementId = 'doc-nota-print';
      docTitle = 'Nota-Kontan';
    } else if (activeDocTab === 'sptjm') {
      elementId = 'doc-sptjm-print';
      docTitle = 'SPTJM';
    }

    const safeSchoolName = (transaction.namaSekolah || 'Sekolah').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${docTitle}-Bukti${transaction.noBukti}-${safeSchoolName}.pdf`;

    showToast(`Membuat file PDF ${docTitle}...`, 'info');
    const success = await downloadElementAsPdf(elementId, filename);
    setIsExporting(false);

    if (success) {
      showToast(`Berhasil mengunduh dokumen ${docTitle} format PDF!`);
    } else {
      showToast('Download terhalang. Membuka jendela cetak untuk simpan PDF...', 'info');
      openPrintWindow(`${transaction.noBukti} - ${transaction.namaSekolah}`);
    }
  };

  const changeZoom = (delta: number) => {
    const newZoom = Math.min(Math.max(zoom + delta, 85), 200);
    setZoom(newZoom);
    updatePrintSettings({ zoomLevel: newZoom });
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center print:p-0 print:bg-white print:static ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      <div className={`bg-slate-100 flex flex-col overflow-hidden border border-slate-300 print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full print:bg-white transition-all ${
        isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-full max-w-6xl max-h-[96vh] rounded-2xl shadow-2xl'
      }`}>
        
        {/* LAPTOP IFRAME NOTICE / POPUP HELPER BANNER */}
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 print:hidden shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
              Info Laptop
            </span>
            <span>
              Jika tombol cetak/download terhalang oleh jendela pratinjau editor: Buka di Tab Baru Laptop untuk cetak langsung tanpa batasan.
            </span>
          </div>

          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Tab Baru Laptop ↗</span>
          </a>
        </div>

        {/* MODAL TOP BAR (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base text-white">
                  Bukti #{transaction.noBukti}: {transaction.namaSekolah}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                  {transaction.sumberDana}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  TA {transaction.tahunAnggaran}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Total Belanja: <strong className="text-emerald-400 font-black">Rp {transaction.totalBelanja.toLocaleString('id-ID')}</strong> • 5 Berkas SPJ Siap Dicetak & Diunduh
              </p>
            </div>
          </div>

          {/* Quick Controls: Zoom, Print, PDF, Fullscreen */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => changeZoom(-15)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition cursor-pointer"
                title="Perkecil Zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-black px-2 text-emerald-400 select-none min-w-[45px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => changeZoom(15)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition cursor-pointer"
                title="Perbesar Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Setelan Kop Toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                showConfig ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Pengaturan Kop Surat Kosong"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden md:inline">Atur Kop</span>
            </button>

            {/* TOMBOL CETAK / SIMPAN KE PDF */}
            <button
              onClick={handlePrintAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Buka jendela cetak printer atau Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan ke PDF</span>
            </button>

            {/* TOMBOL UNDUH SEMUA 5 DOKUMEN PDF */}
            <button
              onClick={handleDownloadAllPdf}
              disabled={isExporting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Download file PDF 5 dokumen sekaligus langsung ke laptop Anda"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Mengunduh...' : 'Unduh SEMUA (5 PDF)'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
              title={isFullscreen ? 'Kecilkan Tampilan' : 'Tampilan Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedTxId(null)}
              className="p-2 hover:bg-rose-900/60 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROGRESS BANNER IF EXPORTING */}
        {isExporting && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-black flex items-center justify-between animate-pulse print:hidden shadow-inner">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 animate-bounce" />
              <span>{exportProgressText || 'Sedang memproses 5 dokumen PDF... Mohon tunggu sebentar.'}</span>
            </div>
            <span className="text-[11px] bg-emerald-800 px-3 py-1 rounded-full font-bold">
              1. Kuitansi • 2. SPB • 3. BAST • 4. Nota • 5. SPTJM
            </span>
          </div>
        )}

        {/* SETTINGS PANEL COLLAPSIBLE (Hidden on print) */}
        {showConfig && (
          <div className="bg-indigo-950 text-indigo-100 p-4 border-b border-indigo-900 text-xs flex flex-wrap items-center justify-between gap-4 print:hidden animate-in slide-in-from-top-2">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                <input
                  type="checkbox"
                  checked={printSettings.kosongkanKop}
                  onChange={(e) => updatePrintSettings({ kosongkanKop: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 w-5 h-5"
                />
                <span className="text-emerald-300">
                  Kosongkan Kop Surat (Untuk Kertas Kop Resmi Sekolah)
                </span>
              </label>

              {printSettings.kosongkanKop && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">Tinggi Area Kosong:</span>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.1"
                    value={printSettings.tinggiKopCm}
                    onChange={(e) => updatePrintSettings({ tinggiKopCm: parseFloat(e.target.value) || 3.8 })}
                    className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-black"
                  />
                  <span>cm</span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printSettings.tampilkanNip}
                  onChange={(e) => updatePrintSettings({ tampilkanNip: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 w-4 h-4"
                />
                <span>Tampilkan NIP di Tanda Tangan</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-300">Ukuran Teks:</span>
                <select
                  value={printSettings.fontSizeMode || 'large'}
                  onChange={(e) => updatePrintSettings({ fontSizeMode: e.target.value as any })}
                  className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-bold"
                >
                  <option value="normal">Standar (14px)</option>
                  <option value="large">Besar (16px - Jelas)</option>
                  <option value="xlarge">Ekstra Besar (18px)</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-indigo-200 bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-800">
              💡 Area kop dikosongkan agar Anda dapat mencetak di atas kertas berkop logo sekolah pemesan tanpa tumpang tindih.
            </div>
          </div>
        )}

        {/* DOCUMENT SELECTION TABS */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 overflow-x-auto print:hidden shadow-xs">
          <div className="flex items-center gap-1.5 min-w-max">
            {/* Tab: Lihat Semua 5 Dokumen */}
            <button
              onClick={() => setActiveDocTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Semua 5 Dokumen Sekaligus</span>
            </button>

            <span className="text-slate-300 font-bold px-1">|</span>

            {/* Tab 1: Kuitansi */}
            <button
              onClick={() => setActiveDocTab('kuitansi')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'kuitansi'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>1. Kuitansi / Bukti Bayar</span>
            </button>

            {/* Tab 2: SPB */}
            <button
              onClick={() => setActiveDocTab('spb')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'spb'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Surat Pesanan (SPB)</span>
            </button>

            {/* Tab 3: BAST */}
            <button
              onClick={() => setActiveDocTab('bast')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'bast'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>3. BAST (Serah Terima)</span>
            </button>

            {/* Tab 4: Nota Kontan */}
            <button
              onClick={() => setActiveDocTab('nota')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'nota'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>4. Nota Kontan Toko</span>
            </button>

            {/* Tab 5: SPTJM */}
            <button
              onClick={() => setActiveDocTab('sptjm')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeDocTab === 'sptjm'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>5. Lembar SPTJM</span>
            </button>
          </div>

          {/* Single doc actions if looking at individual tab */}
          {activeDocTab !== 'all' && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrintSingle}
                className="px-2.5 py-1 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer"
                title="Cetak hanya dokumen ini"
              >
                Cetak Lembar Ini
              </button>
              <button
                onClick={handleDownloadCurrentSinglePdf}
                disabled={isExporting}
                className="px-2.5 py-1 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer"
                title="Unduh hanya dokumen ini"
              >
                Unduh Lembar Ini
              </button>
            </div>
          )}
        </div>

        {/* DOCUMENT PREVIEW CONTAINER */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-300/80 print:p-0 print:bg-white print:overflow-visible">
          <div
            id="zoomable-doc-container"
            className="mx-auto transition-transform duration-150 origin-top flex flex-col items-center gap-8 print:gap-0 print:transform-none"
            style={{
              transform: `scale(${zoom / 100})`,
              marginBottom: `${Math.max(0, (zoom - 100) * 12)}px`,
            }}
          >
            {/* DOKUMEN 1: KUITANSI */}
            <div
              className={`w-full max-w-[210mm] ${
                activeDocTab === 'all' || activeDocTab === 'kuitansi'
                  ? 'block'
                  : 'hidden print:block'
              } ${activeDocTab === 'kuitansi' ? 'print-active-doc' : ''}`}
            >
              {activeDocTab === 'all' && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider mb-0 flex items-center justify-between print:hidden">
                  <span>1. Kuitansi / Bukti Pembayaran</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Halaman 1</span>
                </div>
              )}
              <KuitansiDoc transaction={transaction} settings={printSettings} />
            </div>

            {/* DOKUMEN 2: SPB */}
            <div
              className={`w-full max-w-[210mm] ${
                activeDocTab === 'all' || activeDocTab === 'spb'
                  ? 'block'
                  : 'hidden print:block'
              } ${activeDocTab === 'spb' ? 'print-active-doc' : ''}`}
            >
              {activeDocTab === 'all' && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider mb-0 flex items-center justify-between print:hidden">
                  <span>2. Surat Pesanan Barang (SPB)</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Halaman 2</span>
                </div>
              )}
              <SpbDoc transaction={transaction} settings={printSettings} />
            </div>

            {/* DOKUMEN 3: BAST */}
            <div
              className={`w-full max-w-[210mm] ${
                activeDocTab === 'all' || activeDocTab === 'bast'
                  ? 'block'
                  : 'hidden print:block'
              } ${activeDocTab === 'bast' ? 'print-active-doc' : ''}`}
            >
              {activeDocTab === 'all' && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider mb-0 flex items-center justify-between print:hidden">
                  <span>3. Berita Acara Serah Terima (BAST)</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Halaman 3</span>
                </div>
              )}
              <BastDoc transaction={transaction} settings={printSettings} />
            </div>

            {/* DOKUMEN 4: NOTA KONTAN */}
            <div
              className={`w-full max-w-[210mm] ${
                activeDocTab === 'all' || activeDocTab === 'nota'
                  ? 'block'
                  : 'hidden print:block'
              } ${activeDocTab === 'nota' ? 'print-active-doc' : ''}`}
            >
              {activeDocTab === 'all' && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider mb-0 flex items-center justify-between print:hidden">
                  <span>4. Nota Kontan Toko</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Halaman 4</span>
                </div>
              )}
              <NotaDoc transaction={transaction} settings={printSettings} />
            </div>

            {/* DOKUMEN 5: SPTJM */}
            <div
              className={`w-full max-w-[210mm] ${
                activeDocTab === 'all' || activeDocTab === 'sptjm'
                  ? 'block'
                  : 'hidden print:block'
              } ${activeDocTab === 'sptjm' ? 'print-active-doc' : ''}`}
            >
              {activeDocTab === 'all' && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider mb-0 flex items-center justify-between print:hidden">
                  <span>5. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Halaman 5</span>
                </div>
              )}
              <SptjmDoc transaction={transaction} settings={printSettings} />
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>
              Sekolah Pemesan: <strong className="text-slate-900 uppercase font-black">{transaction.namaSekolah}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => changeZoom(15)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Perbesar ({zoom}%)</span>
            </button>

            {/* Tombol Cetak / Simpan ke PDF */}
            <button
              onClick={handlePrintAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Buka dialog cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan ke PDF</span>
            </button>

            {/* Tombol Unduh Semua PDF */}
            <button
              onClick={handleDownloadAllPdf}
              disabled={isExporting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Mengunduh...' : 'Unduh SEMUA (5 Dokumen PDF)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
