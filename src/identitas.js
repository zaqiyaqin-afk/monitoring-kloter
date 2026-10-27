// Identitas petugas: wajib lengkap sebelum aplikasi dipakai.
export const TUSI = 'PPIH Bimbingan Ibadah Kloter';

// Saran untuk kolom Embarkasi; petugas tetap boleh mengetik sendiri.
export const EMBARKASI = [
  ['BTJ', 'Aceh'], ['KNO', 'Medan'], ['PDG', 'Padang'], ['BTH', 'Batam'], ['PLM', 'Palembang'],
  ['JKG', 'Jakarta – Pondok Gede'], ['JKS', 'Jakarta – Bekasi'], ['KJT', 'Kertajati'], ['SOC', 'Solo'],
  ['SUB', 'Surabaya'], ['BDJ', 'Banjarmasin'], ['BPN', 'Balikpapan'], ['UPG', 'Makassar'], ['LOP', 'Lombok']
].map(([v, l]) => ({ v, l: v + ' · ' + l }));

export const CATATAN_GELOMBANG = {
  1: 'Gelombang 1: tiba di Madinah dulu · miqat umrah biasanya Bir Ali.',
  2: 'Gelombang 2: tiba di Jeddah · miqat umrah biasanya Yalamlam / Bandara KAIA.'
};

export function kurangIdentitas(x) {
  const k = [];
  if (!String(x.ppih || '').trim()) k.push('Nama');
  if (!String(x.kloter || '').trim()) k.push('Kloter');
  if (!String(x.embarkasi || '').trim()) k.push('Embarkasi');
  if (!['1', '2'].includes(String(x.gelombang || ''))) k.push('Gelombang');
  return k;
}

export const pesanKurang = k => 'Lengkapi identitas: ' + k.join(', ') + '.';

// Nama baris di tab "Pengaturan" pada Sheet <-> kolom identitas di aplikasi
const BARIS = { ppih: 'Nama PPIH', kloter: 'Kloter', embarkasi: 'Embarkasi', gelombang: 'Gelombang' };

export function dariPengaturan(p) {
  const o = {};
  if (p && typeof p === 'object') Object.entries(BARIS).forEach(([k, n]) => { if (p[n] != null && p[n] !== '') o[k] = String(p[n]).trim(); });
  return o;
}

export function kePengaturan(id) {
  const o = {};
  Object.entries(BARIS).forEach(([k, n]) => { if (id[k] != null) o[n] = String(id[k]); });
  return o;
}
