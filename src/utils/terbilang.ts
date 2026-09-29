/**
 * Fungsi Konversi Angka ke Terbilang Bahasa Indonesia
 * Contoh: 155000 -> "Seratus lima puluh lima ribu rupiah"
 */

const satuan = [
  '',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
];

function angkaKeKata(n: number): string {
  if (n < 12) {
    return satuan[n];
  } else if (n < 20) {
    return angkaKeKata(n - 10) + ' belas';
  } else if (n < 100) {
    const sisa = n % 10;
    return angkaKeKata(Math.floor(n / 10)) + ' puluh' + (sisa ? ' ' + satuan[sisa] : '');
  } else if (n < 200) {
    return 'seratus' + (n - 100 > 0 ? ' ' + angkaKeKata(n - 100) : '');
  } else if (n < 1000) {
    const sisa = n % 100;
    return angkaKeKata(Math.floor(n / 100)) + ' ratus' + (sisa ? ' ' + angkaKeKata(sisa) : '');
  } else if (n < 2000) {
    return 'seribu' + (n - 1000 > 0 ? ' ' + angkaKeKata(n - 1000) : '');
  } else if (n < 1000000) {
    const sisa = n % 1000;
    return angkaKeKata(Math.floor(n / 1000)) + ' ribu' + (sisa ? ' ' + angkaKeKata(sisa) : '');
  } else if (n < 1000000000) {
    const sisa = n % 1000000;
    return angkaKeKata(Math.floor(n / 1000000)) + ' juta' + (sisa ? ' ' + angkaKeKata(sisa) : '');
  } else if (n < 1000000000000) {
    const sisa = n % 1000000000;
    return angkaKeKata(Math.floor(n / 1000000000)) + ' milyar' + (sisa ? ' ' + angkaKeKata(sisa) : '');
  } else if (n < 1000000000000000) {
    const sisa = n % 1000000000000;
    return angkaKeKata(Math.floor(n / 1000000000000)) + ' triliun' + (sisa ? ' ' + angkaKeKata(sisa) : '');
  }
  return '';
}

export function terbilang(nominal: number): string {
  if (isNaN(nominal) || nominal === null || nominal === undefined) {
    return 'Nol rupiah';
  }
  const nilaiBulat = Math.floor(Math.abs(nominal));
  if (nilaiBulat === 0) {
    return 'Nol rupiah';
  }
  const hasil = angkaKeKata(nilaiBulat).trim();
  // Capitalize first letter and append rupiah
  const kapital = hasil.charAt(0).toUpperCase() + hasil.slice(1);
  return `${kapital} rupiah`;
}
