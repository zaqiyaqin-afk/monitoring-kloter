// Data menu Doa dan Kultum. Isi doa dibaca dari Supabase (hanya akun aktif) lalu disimpan di HP agar tetap terbuka tanpa sinyal.
// Laporan kesalahan dan catatan kultum yang dibuat saat offline menunggu di antrean HP, lalu dikirim saat ada internet.
import { sb, keadaan, pesan } from '../data/akun.js';

const K_DOA = 'mk.doa.isi', K_LAPOR = 'mk.doa.lapor', K_KULTUM = 'mk.kultum', K_KULTUM_Q = 'mk.kultum.antre';
const baca = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const tulis = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const profil = () => keadaan().profil || null;
const masuk = () => !!(sb && keadaan().sesi && profil() && profil().status === 'aktif');
export const sayaAdmin = () => masuk() && profil().peran === 'admin';
// Uji lokal tanpa akun: isi doa diambil dari public/doa-lokal.json (berkas ini tidak ikut ke GitHub)
const ujiLokal = () => import.meta.env.DEV && !masuk();

export function doaTersimpan() { return baca(K_DOA, null); }

export async function ambilDoa() {
  if (ujiLokal()) {
    const ada = doaTersimpan();
    if (ada) return { daftar: ada.daftar, dari: 'uji' };
    const r = await fetch('/doa-lokal.json').catch(() => null);
    if (!r || !r.ok) return { daftar: [], dari: 'kosong' };
    const daftar = await r.json();
    tulis(K_DOA, { daftar, waktu: new Date().toISOString() });
    return { daftar, dari: 'uji' };
  }
  if (!masuk()) return { daftar: [], dari: 'perlu-masuk' };
  const lama = doaTersimpan();
  if (!navigator.onLine) return lama ? { daftar: lama.daftar, dari: 'hp' } : { daftar: [], dari: 'offline' };
  kirimLaporanTertunda();
  const { data, error } = await sb.from('doa').select('id, kategori, judul, hal, sumber, arab, latin, arti, catatan, urutan, versi, diubah').order('urutan');
  if (error) { if (lama) return { daftar: lama.daftar, dari: 'hp' }; throw new Error(pesan(error)); }
  tulis(K_DOA, { daftar: data, waktu: new Date().toISOString() });
  return { daftar: data, dari: 'server' };
}

// Admin menyimpan perbaikan. Versi lama ikut dikirim supaya tidak menimpa perbaikan admin lain yang lebih baru.
export async function simpanDoa(lama, ubah) {
  const isi = { judul: ubah.judul, arab: ubah.arab, latin: ubah.latin, arti: ubah.arti, catatan: ubah.catatan };
  if (ujiLokal()) {
    const ada = doaTersimpan(); if (!ada) return null;
    const baru = { ...lama, ...isi, versi: (lama.versi || 1) + 1, diubah: new Date().toISOString() };
    tulis(K_DOA, { ...ada, daftar: ada.daftar.map(d => (d.id === lama.id ? baru : d)) });
    return baru;
  }
  if (!sayaAdmin()) throw new Error('Hanya admin yang boleh mengubah doa.');
  if (!navigator.onLine) throw new Error('Menyimpan perbaikan doa butuh internet.');
  const { data, error } = await sb.from('doa').update(isi).eq('id', lama.id).eq('versi', lama.versi).select().maybeSingle();
  if (error) throw new Error(pesan(error));
  if (!data) throw new Error('Doa ini baru saja diubah admin lain. Muat ulang lalu ulangi perbaikan.');
  const ada = doaTersimpan();
  if (ada) tulis(K_DOA, { ...ada, daftar: ada.daftar.map(d => (d.id === data.id ? data : d)) });
  return data;
}

// Admin mengisi atau memperbarui banyak doa sekaligus dari berkas JSON (daftar baris tabel doa).
export async function imporDoa(daftar) {
  const KOLOM = ['id', 'kategori', 'judul', 'hal', 'sumber', 'arab', 'latin', 'arti', 'catatan', 'urutan'];
  const baris = (Array.isArray(daftar) ? daftar : []).filter(d => d && d.id && d.judul && d.arab)
    .map(d => Object.fromEntries(KOLOM.map(k => [k, k === 'urutan' ? Number(d[k]) || 0 : String(d[k] ?? '')])));
  if (!baris.length) throw new Error('Berkas tidak berisi doa yang bisa dibaca.');
  if (!sayaAdmin()) throw new Error('Hanya admin yang boleh mengimpor doa.');
  for (let i = 0; i < baris.length; i += 25) {
    const { error } = await sb.from('doa').upsert(baris.slice(i, i + 25), { onConflict: 'id' });
    if (error) throw new Error(pesan(error));
  }
  return baris.length;
}

export async function riwayatDoa(id) {
  if (ujiLokal()) return [];
  const { data, error } = await sb.from('doa_riwayat').select('id, versi, isi, diubah').eq('doa_id', id).order('versi', { ascending: false }).limit(20);
  if (error) throw new Error(pesan(error));
  return data;
}

export async function kembalikanDoa(riwayatId) {
  const { error } = await sb.rpc('kembalikan_doa', { p_riwayat: riwayatId });
  if (error) throw new Error(pesan(error));
}

// ---------- Laporan kesalahan ----------
export function laporkan(doa, isiPesan) {
  const p = profil() || {};
  const it = { doa_id: doa.id, pesan: String(isiPesan).trim().slice(0, 2000), pelapor_nama: p.nama || '', kloter_id: p.kloter_id || null, dibuat: new Date().toISOString() };
  if (ujiLokal()) return 'uji';
  tulis(K_LAPOR, baca(K_LAPOR, []).concat(it));
  kirimLaporanTertunda();
  return navigator.onLine ? 'terkirim' : 'antre';
}

let _kirimLapor = false;
export async function kirimLaporanTertunda() {
  if (_kirimLapor || !masuk() || !navigator.onLine) return;
  const antre = baca(K_LAPOR, []);
  if (!antre.length) return;
  _kirimLapor = true;
  try {
    const { error } = await sb.from('doa_laporan').insert(antre);
    if (!error) tulis(K_LAPOR, baca(K_LAPOR, []).slice(antre.length));
  } finally { _kirimLapor = false; }
}

export async function daftarLaporan() {
  if (!sayaAdmin()) return [];
  const { data, error } = await sb.from('doa_laporan').select('id, doa_id, pesan, pelapor_nama, dibuat, status').eq('status', 'baru').order('dibuat', { ascending: false });
  if (error) throw new Error(pesan(error));
  return data;
}

export async function tandaiLaporan(id) {
  const { error } = await sb.from('doa_laporan').update({ status: 'selesai' }).eq('id', id);
  if (error) throw new Error(pesan(error));
}

// ---------- Catatan kultum (satu catatan per tanggal per kloter) ----------
export function catatanKultum() {
  const tersimpan = baca(K_KULTUM, {}), antre = baca(K_KULTUM_Q, []);
  const hasil = { ...tersimpan };
  antre.forEach(c => { hasil[c.tanggal] = c; });
  return hasil;
}

export async function muatCatatanKultum() {
  if (!masuk() || !navigator.onLine) return catatanKultum();
  await kirimKultumTertunda();
  const { data, error } = await sb.from('kultum_catatan').select('tanggal, materi_id, pengisi, tempat, status, petugas, diubah').eq('kloter_id', profil().kloter_id);
  if (!error) tulis(K_KULTUM, Object.fromEntries(data.map(c => [c.tanggal, c])));
  return catatanKultum();
}

export function simpanCatatanKultum(c) {
  const it = { ...c, petugas: (profil() || {}).nama || c.petugas || '', diubah: new Date().toISOString() };
  if (!masuk()) { tulis(K_KULTUM, { ...baca(K_KULTUM, {}), [it.tanggal]: it }); return 'lokal'; }
  tulis(K_KULTUM_Q, baca(K_KULTUM_Q, []).filter(x => x.tanggal !== it.tanggal).concat(it));
  kirimKultumTertunda();
  return navigator.onLine ? 'terkirim' : 'antre';
}

let _kirimKultum = false;
export async function kirimKultumTertunda() {
  if (_kirimKultum || !masuk() || !navigator.onLine) return;
  const antre = baca(K_KULTUM_Q, []);
  if (!antre.length) return;
  _kirimKultum = true;
  try {
    const k = profil().kloter_id;
    const { error } = await sb.from('kultum_catatan').upsert(antre.map(c => ({ ...c, kloter_id: k })), { onConflict: 'kloter_id,tanggal' });
    if (!error) {
      tulis(K_KULTUM, { ...baca(K_KULTUM, {}), ...Object.fromEntries(antre.map(c => [c.tanggal, c])) });
      const sisa = baca(K_KULTUM_Q, []).filter(x => !antre.some(a => a.tanggal === x.tanggal && a.diubah === x.diubah));
      tulis(K_KULTUM_Q, sisa);
    }
  } finally { _kirimKultum = false; }
}

export const kultumMenunggu = () => baca(K_KULTUM_Q, []).length;
