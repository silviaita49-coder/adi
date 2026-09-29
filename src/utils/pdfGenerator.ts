import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface DocItemInfo {
  id: string;
  name: string;
}

/**
 * Trigger file download via Blob (bypasses iframe sandbox download limits)
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Revoke URL error:', e);
    }
  }, 4000);
}

/**
 * Capture an element safely with html2canvas with optimal print resolution & clean styling
 */
async function captureElementForPdf(element: HTMLElement): Promise<HTMLCanvasElement> {
  const zoomContainer = document.getElementById('zoomable-doc-container');
  const oldTransform = zoomContainer ? zoomContainer.style.transform : '';
  const wasHidden = element.classList.contains('hidden') || element.style.display === 'none';

  // Temporarily reset zoom & ensure element is visible
  if (zoomContainer) {
    zoomContainer.style.transform = 'none';
  }
  if (wasHidden) {
    element.classList.remove('hidden');
    element.style.display = 'block';
  }

  // Save temporary styles
  const prevBoxShadow = element.style.boxShadow;
  const prevBorder = element.style.border;
  const prevMargin = element.style.margin;

  // Apply clean print styling during capture
  element.style.boxShadow = 'none';
  element.style.border = 'none';
  element.style.margin = '0 auto';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x high-definition rendering (crystal clear text, no fuzzy pixels)
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc, clonedEl) => {
        // Strip any shadow or modern rounded tags on the clone
        const el = clonedEl as HTMLElement;
        el.style.boxShadow = 'none';
        el.style.border = 'none';
        el.style.borderRadius = '0';
        el.style.backgroundColor = '#ffffff';

        // Ensure all table borders are solid black
        const tables = el.querySelectorAll('table, th, td');
        tables.forEach((t) => {
          (t as HTMLElement).style.borderColor = '#000000';
        });
      },
    });
    return canvas;
  } finally {
    // Restore original styles
    element.style.boxShadow = prevBoxShadow;
    element.style.border = prevBorder;
    element.style.margin = prevMargin;

    if (wasHidden) {
      element.classList.add('hidden');
      element.style.display = '';
    }
    if (zoomContainer && oldTransform) {
      zoomContainer.style.transform = oldTransform;
    }
  }
}

/**
 * Add a captured canvas to a jsPDF page with intelligent single-page auto-fit.
 * GUARANTEES:
 * 1. Zero text slicing across page breaks!
 * 2. Zero orphaned signatures!
 * 3. Document is centered and balanced with clean margins on A4.
 */
function addCanvasToPdfSinglePage(pdf: jsPDF, canvas: HTMLCanvasElement): void {
  const pdfWidth = 210; // A4 width mm
  const pdfHeight = 297; // A4 height mm
  const marginX = 10; // 10mm left & right
  const marginY = 10; // 10mm top & bottom

  const maxWidth = pdfWidth - marginX * 2; // 190mm
  const maxHeight = pdfHeight - marginY * 2; // 277mm

  const imgAspect = canvas.width / canvas.height;
  let renderWidth = maxWidth;
  let renderHeight = maxWidth / imgAspect;

  // If the document height exceeds available page height, scale down proportionally
  if (renderHeight > maxHeight) {
    renderHeight = maxHeight;
    renderWidth = maxHeight * imgAspect;
  }

  // Center horizontally and vertically on the A4 page
  const posX = marginX + (maxWidth - renderWidth) / 2;
  const posY = marginY + (maxHeight - renderHeight) / 2;

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
}

/**
 * Unduh 1 elemen HTML sebagai file PDF (Rapi & Pas 1 Halaman A4)
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen dengan ID ${elementId} tidak ditemukan.`);
    return false;
  }

  try {
    const canvas = await captureElementForPdf(element);
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    addCanvasToPdfSinglePage(pdf, canvas);

    const blob = pdf.output('blob');
    triggerBlobDownload(blob, filename);
    return true;
  } catch (error) {
    console.error('Gagal membuat PDF single:', error);
    return false;
  }
}

/**
 * Unduh SEMUA 5 DOKUMEN SPJ SEKALIGUS ke dalam 1 file PDF lengkap
 * Setiap dokumen otomatis diposisikan rapi pas pada 1 lembar A4 tanpa terpotong!
 * 1. Kuitansi / Bukti Bayar (Halaman 1)
 * 2. Surat Pesanan / SPB (Halaman 2)
 * 3. BAST / Serah Terima (Halaman 3)
 * 4. Nota Kontan Toko (Halaman 4)
 * 5. Lembar SPTJM (Halaman 5)
 */
export async function downloadAll5DocumentsAsPdf(
  filename: string,
  onProgress?: (step: number, total: number, docName: string) => void
): Promise<boolean> {
  const docs: DocItemInfo[] = [
    { id: 'doc-kuitansi-print', name: '1. Kuitansi / Bukti Bayar' },
    { id: 'doc-spb-print', name: '2. Surat Pesanan (SPB)' },
    { id: 'doc-bast-print', name: '3. BAST (Serah Terima)' },
    { id: 'doc-nota-print', name: '4. Nota Kontan Toko' },
    { id: 'doc-sptjm-print', name: '5. Lembar SPTJM' },
  ];

  try {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    let renderedPagesCount = 0;

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      if (onProgress) {
        onProgress(i + 1, docs.length, doc.name);
      }

      const element = document.getElementById(doc.id);
      if (!element) {
        console.warn(`Elemen ${doc.id} tidak ditemukan`);
        continue;
      }

      // Capture with high-definition settings
      const canvas = await captureElementForPdf(element);

      if (renderedPagesCount > 0) {
        pdf.addPage('a4', 'p');
      }
      renderedPagesCount++;

      // Place cleanly on 1 page without slicing
      addCanvasToPdfSinglePage(pdf, canvas);
    }

    if (renderedPagesCount === 0) {
      console.error('Tidak ada dokumen yang berhasil dirender.');
      return false;
    }

    const blob = pdf.output('blob');
    triggerBlobDownload(blob, filename);
    return true;
  } catch (error) {
    console.error('Gagal membuat bundel 5 dokumen PDF:', error);
    return false;
  }
}

/**
 * Buka Jendela Cetak & Simpan PDF Terpisah di Tab Baru Laptop (100% Vector PDF Super Tajam)
 */
export function openPrintWindow(transactionName: string): boolean {
  const container = document.getElementById('zoomable-doc-container');
  if (!container) return false;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return false;
  }

  let styles = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((s) => {
    styles += s.outerHTML;
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>Dokumen SPJ Resmi - ${transactionName}</title>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 14mm 10mm 14mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0;
            padding: 0;
            font-family: "Times New Roman", Times, Georgia, serif !important;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
          .spj-printable-page {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 auto 30px auto !important;
            padding: 20px 25px !important;
            box-shadow: none !important;
            border: 1px solid #cbd5e1;
            background: #ffffff !important;
            max-width: 210mm !important;
          }
          .spj-printable-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
            margin-bottom: 0 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border-color: #000000 !important;
          }
          @media print {
            .no-print-bar { display: none !important; }
            .spj-printable-page {
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar" style="position: sticky; top: 0; background: #0f172a; color: #ffffff; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, -apple-system, sans-serif;">
          <div>
            <strong style="font-size: 15px; display: block;">🖨️ Cetak & Simpan PDF Resmi (Teks Vektor Super Tajam & Rapi)</strong>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">
              Pilih Tujuan: <strong>"Simpan sebagai PDF"</strong> (Save as PDF) untuk mendapatkan berkas PDF 5 halaman dengan teks paling rapi & tajam.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="window.print()" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              🖨️ Cetak / Simpan ke PDF Sekarang
            </button>
            <button onclick="window.close()" style="background: #334155; color: #ffffff; border: none; padding: 10px 16px; border-radius: 10px; font-size: 13px; cursor: pointer;">
              Tutup
            </button>
          </div>
        </div>
        <div style="max-width: 210mm; margin: 20px auto; padding: 0 10px;">
          ${container.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  return true;
}
