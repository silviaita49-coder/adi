/**
 * Helper pemformat mata uang, tanggal Indonesia, dan nomor berkas
 */

export function formatRupiah(amount: number, showSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return showSymbol ? 'Rp 0' : '0';
  if (amount === 0) return showSymbol ? 'Rp -' : '-';

  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return showSymbol ? `Rp ${formatted}` : formatted;
}

export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const bulanIndo = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    // Supports YYYY-MM-DD or full date
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      // Manual parse if timezone shifted
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return `${day} ${bulanIndo[month]} ${year}`;
      }
      return dateStr;
    }
    const day = d.getDate();
    const month = bulanIndo[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function getTahunFromTanggal(dateStr: string): string {
  if (!dateStr) return new Date().getFullYear().toString();
  return dateStr.substring(0, 4) || new Date().getFullYear().toString();
}

export function getRomawiBulan(bulanIdx: number): string {
  const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romawi[bulanIdx] || 'I';
}
