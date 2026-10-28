// Catatan kejadian: daftar jenis dan bentuk satu catatan (sama di antrean, salinan data, dan server).
export const JENIS_KEJADIAN = [
  { v: 'sakit', l: 'Sakit / dirawat', w: '#c0392b', d: 'M12 21s-7-4.4-9.3-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.3 6C19 16.6 12 21 12 21z' },
  { v: 'terpisah', l: 'Terpisah / tersesat', w: '#d35400', d: 'M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { v: 'barang_hilang', l: 'Barang hilang', w: '#8e6c1f', d: 'M6 7h12l-1 13H7L6 7zM9 7V5a3 3 0 0 1 6 0v2' },
  { v: 'wafat', l: 'Wafat', w: '#4a5560', d: 'M6 21V10a6 6 0 0 1 12 0v11M3 21h18M14.2 11.4a2.6 2.6 0 1 1-2.9-3.1 2.1 2.1 0 0 0 2.9 3.1z' },
  { v: 'kecelakaan', l: 'Kecelakaan', w: '#b03a6e', d: 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z' },
  { v: 'konflik', l: 'Konflik / keluhan', w: '#6c4bb5', d: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 11h.01M12 11h.01M15 11h.01' },
  { v: 'lainnya', l: 'Lainnya', w: '#1f6f54', d: 'M5 12h.01M12 12h.01M19 12h.01' }
];
export const labelKejadian = v => (JENIS_KEJADIAN.find(j => j.v === v) || JENIS_KEJADIAN[6]).l;

// Ambil isian catatan saja (tanpa data antrean/tampilan)
export const dariKejadian = r => ({
  kid: r.kid, kategori: r.kategori || 'lainnya', waktuKejadian: r.waktuKejadian || new Date().toISOString(),
  lokasi: String(r.lokasi || '').trim().slice(0, 200), kronologi: String(r.kronologi || '').trim().slice(0, 4000),
  tindakLanjut: String(r.tindakLanjut || '').trim().slice(0, 4000), status: r.status === 'selesai' ? 'selesai' : 'terbuka',
  porsi: [...new Set(r.porsi || [])], petugas: r.petugas || '', diubah: r.diubah || ''
});

export const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
