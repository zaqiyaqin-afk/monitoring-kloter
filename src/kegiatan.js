// Ikon garis (viewBox 24) untuk tiap kegiatan dan pengelompokan kegiatan haji per tempat.

const I = {
  ihram: 'M8 3h8l2 4-2 14H8L6 7zM8 3l4 5 4-5M10 13h4',
  niat: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  tenda: 'M3 20h18M5 20l7-15 7 15M12 5v15M9.5 20l2.5-5 2.5 5',
  bukit: 'M2 20h20M3 20l6-9 4 5 3-3 5 7M17 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  bulan: 'M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5zM17 4v3M15.5 5.5h3',
  bus: 'M5 17V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11zM5 11h14M8 20v-3M16 20v-3M8 14h.01M16 14h.01',
  mobil: 'M3 16V7h11v9M14 10h4l3 3v3h-7M3 16h11M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8.5 9.5v3M7 11h3',
  jumroh: 'M10 4h4v12h-4zM7 20h10M8 16h8M5 9h.01M19 11h.01M17 7h.01',
  badal: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 20a5.5 5.5 0 0 1 11 0M16 8h6M19 5l3 3-3 3M22 16h-6M19 13l-3 3 3 3',
  gunting: 'M6 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 7.5L20 18M8 16.5L20 6',
  kabah: 'M8 9h8v8H8zM8 11.5h8M3.5 13a8.5 8.5 0 0 0 15.4 5M20.5 11A8.5 8.5 0 0 0 5.1 6M19 3.5V6h-2.5',
  sai: 'M3 19l3-5 3 5M15 19l3-5 3 5M7 10h10M14 7l3 3-3 3M10 13l-3-3 3-3',
  hotel: 'M3 19V6M3 15h18v4M21 15v-2.5a3 3 0 0 0-3-3h-7V15M7 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  pulang: 'M4 12h12M12 7l5 5-5 5M20 5v14',
  miqat: 'M12 3v18M12 5h7l2 2.5-2 2.5h-7M12 12H5l-2 2.5L5 17h7M9 21h6',
  kubah: 'M5 20h14M6 20v-6a6 6 0 0 1 12 0v6M12 8V4M11 5h2M10 20v-3.5a2 2 0 0 1 4 0V20',
  centang: 'M5 12.5l4.5 4.5L19 7.5'
};

export function ikonKegiatan(r) {
  const n = String((r && r.n) || '');
  if (/^Niat/.test(n)) return I.niat;
  if (/^Ihram/.test(n)) return I.ihram;
  if (/Tarwiyah/.test(n)) return I.tenda;
  if (/Safari/.test(n)) return I.mobil;
  if (/Wukuf/.test(n)) return I.bukit;
  if (/^Murur/.test(n)) return /Mabit/.test(n) ? I.bulan : I.bus;
  if (/^Badal/.test(n)) return I.badal;
  if (/Jumroh/.test(n)) return I.jumroh;
  if (/Tahallul/.test(n)) return I.gunting;
  if (/^Mabit/.test(n)) return I.tenda;
  if (/Tanazul/.test(n)) return I.hotel;
  if (/Nafar/.test(n)) return I.pulang;
  if (/Thawaf/.test(n)) return I.kabah;
  if (/Sa'i/.test(n)) return I.sai;
  if (/Miqat/.test(n)) return I.miqat;
  if (/Raudhoh/.test(n)) return I.kubah;
  return I.centang;
}

export const TEMPAT_HAJI = [
  { k: 'awal', l: 'Persiapan', sub: 'Makkah · 7/8 Dzh', ikon: I.ihram },
  { k: 'arafah', l: 'Arafah', sub: '9 Dzh', ikon: I.bukit },
  { k: 'muzd', l: 'Muzdalifah', sub: 'Malam 10 Dzh', ikon: I.bulan },
  { k: 'mina', l: 'Mina', sub: '10–13 Dzh', ikon: I.tenda },
  { k: 'makkah', l: 'Makkah', sub: 'Ifadzoh · Wada’', ikon: I.kabah }
];

// Memakai hari bawaan kegiatan, bukan label hari yang bisa diubah petugas.
export function tempatHaji(r) {
  const d = String((r && ((r._o && r._o.day) || r.day)) || '');
  if (r && r.g === 'wukuf') return 'arafah';
  if (r && r.g === 'muzd') return 'muzd';
  if (/^7\/8/.test(d)) return 'awal';
  if (/1[0-3] Dzulhijjah/.test(d)) return 'mina';
  return 'makkah';
}
