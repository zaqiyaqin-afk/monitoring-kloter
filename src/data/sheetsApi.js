// Penghubung ke Google Sheet (Web App Apps Script).
// Semua akses server lewat file ini: nanti cukup buat file setara untuk Supabase
// dengan dua fungsi yang sama (ambilSemua, kirimPerubahan).

const BATAS_AMBIL = 20000;
const BATAS_KIRIM = 45000;

async function denganBatasWaktu(ms, kerja, pesanHabis) {
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), ms);
  try { return await kerja(ctl.signal); }
  catch (e) {
    if (e.name === 'AbortError') throw new Error(pesanHabis);
    throw new Error('Tidak ada sinyal atau alamat tidak bisa dijangkau. Periksa sinyal dan URL.');
  } finally { clearTimeout(tm); }
}

async function bacaJson(res) {
  try { return await res.json(); }
  catch (e) { throw new Error('URL salah: alamat ini bukan Web App Kloter. Pakai URL Deploy yang berakhiran /exec dengan akses “Siapa saja”.'); }
}

function pesanServer(data, bawaan) {
  return /kode|kunci/i.test(data.error || '') ? 'Kode rahasia salah. Samakan dengan kode di Sheet (tab Pengaturan) atau KUNCI di Code.gs.' : (data.error || bawaan);
}

// Ambil seluruh data kloter: jamaah, petugas, jadwal, status checklist terakhir.
export async function ambilSemua(url, key, { ping = false } = {}) {
  if (!navigator.onLine) throw new Error('Tidak ada sinyal. Sambungkan internet lalu coba lagi.');
  const res = await denganBatasWaktu(BATAS_AMBIL,
    signal => fetch(url + (url.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(key) + (ping ? '&aksi=ping' : '') + '&t=' + Date.now(), { signal }),
    'Tidak ada sinyal: server tidak menjawab dalam 20 detik.');
  const data = await bacaJson(res);
  if (!data.ok) throw new Error(pesanServer(data, 'Gagal membaca sheet'));
  return data;
}

// Ganti kode rahasia di server. Harus online; tidak lewat antrean.
export async function gantiKunci(url, key, baru) {
  if (!navigator.onLine) throw new Error('Ganti kode rahasia butuh internet.');
  const res = await denganBatasWaktu(BATAS_AMBIL,
    signal => fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, aksi: 'gantiKunci', baru }), signal }),
    'Server tidak menjawab dalam 20 detik.');
  const data = await bacaJson(res);
  if (!data.ok) throw new Error(pesanServer(data, 'Gagal mengganti kode'));
  return data;
}

// Unggah satu foto (base64 JPEG) ke Google Drive lewat Apps Script. Server melewati ID yang sudah ada.
export async function unggahFoto(url, key, foto, data) {
  const res = await denganBatasWaktu(90000,
    signal => fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, aksi: 'foto', foto, data }), signal }),
    'Unggah foto terlalu lama (sinyal lemah). Akan dicoba lagi.');
  const out = await bacaJson(res);
  if (!out.ok) throw new Error(pesanServer(out, 'Gagal mengunggah foto'));
  return out;
}

// Kirim antrean perubahan. Server menolak kiriman ganda lewat "ID Kirim",
// jadi aman diulang bila jawaban server tidak sampai.
export async function kirimPerubahan(url, key, items) {
  const res = await denganBatasWaktu(BATAS_KIRIM,
    signal => fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, items }), signal }),
    'Server tidak menjawab dalam 45 detik. Data tetap aman di perangkat dan akan dikirim ulang.');
  const data = await bacaJson(res);
  if (!data.ok) throw new Error(pesanServer(data, 'Gagal mengirim'));
  return data;
}
