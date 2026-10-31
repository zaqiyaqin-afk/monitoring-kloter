// Penghubung ke Supabase, setara dengan sheetsApi.js: fungsi dan bentuk data yang dikembalikan sama,
// jadi logika aplikasi (antrean luring, aturan konflik, tampilan) tidak perlu tahu sumbernya.
import { sb, keadaan, pesan } from './akun.js';

const yt = v => (v ? 'Ya' : 'Tidak');
// Kolom akomodasi: nama kolom di data aplikasi <-> kolom database
export const AKOMODASI = [['Hotel Makkah', 'hotel_makkah'], ['Lantai Makkah', 'lantai_makkah'], ['Kamar Makkah', 'kamar_makkah'], ['Tenda Arafah', 'tenda_arafah'],
  ['Tenda Mina', 'tenda_mina'], ['Hotel Madinah', 'hotel_madinah'], ['Lantai Madinah', 'lantai_madinah'], ['Kamar Madinah', 'kamar_madinah']];
const BATAS = 20000;

async function denganBatasWaktu(ms, kerja, pesanHabis) {
  let tm;
  try { return await Promise.race([kerja(), new Promise((_, no) => { tm = setTimeout(() => no(new Error(pesanHabis)), ms); })]); }
  catch (e) { throw new Error(e.message === pesanHabis ? pesanHabis : pesan(e)); }
  finally { clearTimeout(tm); }
}

// Supabase membatasi 1000 baris per permintaan; ambil per halaman.
async function semua(tabel, kolom, urut, saring) {
  const out = [];
  for (let dari = 0; ; dari += 1000) {
    let q = sb.from(tabel).select(kolom).range(dari, dari + 999);
    if (urut) q = q.order(urut);
    if (saring) q = saring(q);
    const { data, error } = await q;
    if (error) throw error;
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

const tglId = d => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${m[3]}/${m[2]}/${m[1]}` : ''; };
const hariRiyadh = w => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(w));

// Bentuk data memakai nama kolom tab Sheet lama, jadi logika aplikasi tidak berubah
export async function ambilSemua(_url, _key, { ping = false } = {}) {
  if (!navigator.onLine) throw new Error('Tidak ada sinyal. Sambungkan internet lalu coba lagi.');
  if (!sb || !keadaan().sesi) throw new Error('Sesi akun berakhir. Keluar lalu masuk lagi.');
  return denganBatasWaktu(BATAS, async () => {
    const p = keadaan().profil || {};
    const { data: k, error } = await sb.from('kloter').select('*').eq('id', p.kloter_id).maybeSingle();
    if (error) throw error;
    if (!k) throw new Error('Akun belum tersambung ke kloter. Hubungi admin.');
    if (ping) return { ok: true, pong: true, waktu: new Date().toISOString() };
    const [jm, pt, jr, ct, jd, ru, kj, fk] = await Promise.all([
      semua('jamaah', 'id, porsi, nama, rombongan, regu, jabatan, hp, resti, udzur, catatan, jk, lansia, kursi_roda, pendamping, perlu_badal, pelaksana_badal, miqat, tgl_lahir, hotel_makkah, lantai_makkah, kamar_makkah, tenda_arafah, tenda_mina, hotel_madinah, lantai_madinah, kamar_madinah', 'porsi'),
      semua('petugas', 'nama, jabatan, urutan', 'urutan'),
      semua('jadwal_raudhoh', 'tanggal, jam, jk, rombongan, keterangan', 'tanggal'),
      semua('centang', 'jamaah_id, kegiatan, status, tanggal, jam, susulan, waktu, pelaksana_badal, keterangan, pendamping, pilihan, alasan, ulang_ke, status_ulang', 'waktu'),
      semua('jadwal', 'mode, kegiatan, hari, tempat, tanggal, jam', 'kegiatan'),
      semua('riwayat_udzur', 'jamaah_id, udzur, alasan, petugas, perangkat, waktu, id_kirim', 'waktu'),
      semua('kejadian', 'id, jenis, waktu, lokasi, kronologi, tindak_lanjut, status, jamaah_ids, petugas, diubah', 'waktu'),
      semua('foto', 'kejadian_id, path, id_kirim', 'dibuat', q => q.not('kejadian_id', 'is', null))
    ]);
    const porsiDari = {}; jm.forEach(j => { porsiDari[j.id] = j; });
    const status = {};
    ct.forEach(c => { const j = porsiDari[c.jamaah_id]; if (!j) return;
      status[j.porsi + '|' + c.kegiatan] = { waktu: c.waktu, kegiatan: c.kegiatan, status: c.status, pelaksana: c.pelaksana_badal,
        tanggal: c.tanggal || (c.waktu ? hariRiyadh(c.waktu) : ''), jam: c.jam ? c.jam.slice(0, 5) : '', susulan: !!c.susulan,
        pendamping: c.pendamping || '', pilihan: c.pilihan || '', alasan: c.alasan || '', ulangKe: c.ulang_ke || 0, statusUlang: c.status_ulang || '' }; });
    const atur = { ...(k.pengaturan || {}) };
    if (!atur['Kloter']) atur['Kloter'] = k.kode;
    if (!atur['Embarkasi']) atur['Embarkasi'] = k.embarkasi;
    if (!atur['Gelombang'] && k.gelombang) atur['Gelombang'] = String(k.gelombang);
    if (!atur['Nama PPIH'] && p.nama) atur['Nama PPIH'] = p.nama;
    return {
      ok: true, waktu: new Date().toISOString(), sumber: 'supabase', kloter: { id: k.id, kode: k.kode },
      jamaah: jm.map(j => ({ 'Nomor Porsi': j.porsi, 'Nama': j.nama, 'Rombongan': j.rombongan ?? '', 'Regu': j.regu ?? '', 'Peran': j.jabatan || 'Jamaah',
        'Nomor HP': j.hp || '', 'Risti': j.resti ? 'Ya' : '', 'Udzur': yt(j.udzur), 'Catatan': j.catatan || '', 'Jenis Kelamin': j.jk || '',
        'Lansia': j.lansia ? 'Ya' : '', 'Kursi Roda': j.kursi_roda ? 'Ya' : '', 'Pendamping': j.pendamping || '', 'Perlu Badal': j.perlu_badal ? 'Ya' : '',
        'Pelaksana Badal': j.pelaksana_badal || '', 'Miqat': j.miqat || '', 'Tanggal Lahir': j.tgl_lahir || '',
        ...Object.fromEntries(AKOMODASI.map(([k, kol]) => [k, j[kol] || ''])) })),
      petugas: pt.map(x => ({ 'Nama': x.nama, 'Jabatan': x.jabatan })),
      jadwal: jr.map(x => ({ 'Tanggal': tglId(x.tanggal), 'Jam': x.jam, 'Jenis Kelamin': x.jk, 'Rombongan': x.rombongan, 'Keterangan': x.keterangan })),
      status,
      jadwalKegiatan: jd.map(x => ({ 'Mode': x.mode, 'Kegiatan': x.kegiatan, 'Hari': x.hari || '', 'Tempat': x.tempat || '', 'Tanggal': x.tanggal || '', 'Jam': x.jam ? x.jam.slice(0, 5) : '' })),
      pengaturan: atur, otomatis: false,
      riwayatUdzur: ru.map(r => { const j = porsiDari[r.jamaah_id] || {};
        return { 'Waktu': r.waktu, 'Nomor Porsi': j.porsi || '', 'Nama': j.nama || '', 'Status': r.udzur ? 'Udzur' : 'Tidak udzur', 'Alasan': r.alasan, 'Petugas': r.petugas, 'Perangkat': r.perangkat, 'ID Kirim': r.id_kirim || '' }; }),
      kejadian: kj.map(x => ({ kid: x.id, kategori: x.jenis, waktuKejadian: x.waktu, lokasi: x.lokasi, kronologi: x.kronologi, tindakLanjut: x.tindak_lanjut, status: x.status,
        porsi: (x.jamaah_ids || []).map(id => (porsiDari[id] || {}).porsi).filter(Boolean), petugas: x.petugas || '', diubah: x.diubah,
        foto: fk.filter(f => f.kejadian_id === x.id).map(f => ({ id: f.id_kirim || f.path, path: f.path })) }))
    };
  }, 'Tidak ada sinyal: server tidak menjawab dalam 20 detik.');
}

// Kirim antrean. Server melewati kiriman ganda (id) dan centang yang lebih lama, jadi aman diulang.
export async function kirimPerubahan(_url, _key, items) {
  return denganBatasWaktu(45000, async () => {
    // Data pribadi/akomodasi lewat fungsi tersendiri; sisanya lewat penerima utama
    const pribadi = items.filter(i => i.jenis === 'dataJamaah'), kej = items.filter(i => i.jenis === 'kejadian'),
      lain = items.filter(i => i.jenis !== 'dataJamaah' && i.jenis !== 'kejadian');
    let data = { ok: true, diterima: 0, diabaikan: 0, dobel: 0 };
    if (lain.length) { const r = await sb.rpc('terima_perubahan', { p_items: lain }); if (r.error) throw r.error; data = r.data; }
    if (pribadi.length) { const r = await sb.rpc('ubah_data_jamaah', { p_items: pribadi }); if (r.error) throw r.error; }
    if (kej.length) { const r = await sb.rpc('simpan_kejadian', { p_items: kej }); if (r.error) throw r.error; }
    return data;
  }, 'Server tidak menjawab dalam 45 detik. Data tetap aman di perangkat dan akan dikirim ulang.');
}


// Foto ke penyimpanan Supabase (folder per kloter). Unggah ulang dengan id sama tidak membuat file baru.
export async function unggahFoto(_url, _key, f, base64) {
  return denganBatasWaktu(90000, async () => {
    const p = keadaan().profil || {};
    if (!p.kloter_id) throw new Error('Akun belum tersambung ke kloter.');
    const { data: ada } = await sb.from('foto').select('path').eq('id_kirim', f.id).maybeSingle();
    if (ada) return { ok: true, url: 'supabase:' + ada.path, dobel: true };
    const bin = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const path = `${p.kloter_id}/${String(f.id).replace(/[^\w.-]/g, '_')}.jpg`;
    const up = await sb.storage.from('foto').upload(path, bin, { contentType: 'image/jpeg', upsert: true });
    if (up.error) throw up.error;
    const tgl = /^\d{4}-\d{2}-\d{2}$/.test(String(f.tanggal || '')) ? f.tanggal : hariRiyadh(Date.now());
    const baris = { kloter_id: p.kloter_id, mode: f.mode || null, kegiatan: f.kegiatan || null, kejadian_id: f.kejadian || null, tanggal: tgl,
      keterangan: String(f.keterangan || '').slice(0, 200), cakupan: String(f.cakupan || ''), path, petugas: String(f.petugas || '').slice(0, 100),
      id_kirim: String(f.id), dibuat: f.waktu || new Date().toISOString() };
    let { error } = await sb.from('foto').insert(baris);
    // Kejadiannya sudah dihapus dari HP lain: foto tetap disimpan tanpa tautan kejadian
    if (error && error.code === '23503' && baris.kejadian_id) ({ error } = await sb.from('foto').insert({ ...baris, kejadian_id: null }));
    if (error && !/duplicate/i.test(error.message)) throw error;
    return { ok: true, url: 'supabase:' + path };
  }, 'Unggah foto terlalu lama (sinyal lemah). Akan dicoba lagi.');
}

// Tautan sementara (1 jam) untuk membuka foto yang tersimpan di Supabase.
export async function tautanFoto(path) {
  const { data, error } = await sb.storage.from('foto').createSignedUrl(path, 3600);
  if (error) throw new Error(pesan(error));
  return data.signedUrl;
}

// Unggah Excel jamaah (butuh internet): porsi lama diperbarui, porsi baru ditambahkan.
export async function imporJamaah(rows) {
  if (!navigator.onLine) throw new Error('Unggah Excel butuh internet.');
  return denganBatasWaktu(60000, async () => {
    const { data, error } = await sb.rpc('impor_jamaah', { p_rows: rows });
    if (error) throw error;
    return data;
  }, 'Server tidak menjawab dalam 60 detik. Coba lagi.');
}
