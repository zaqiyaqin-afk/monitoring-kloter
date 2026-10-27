// Foto kegiatan di HP: diperkecil dulu, disimpan di IndexedDB, lalu diunggah satu per satu.
// Setelah terunggah, file penuh dihapus dan yang tersisa hanya gambar kecil + tautan Drive.
import { bukaDb } from './localStore.js';

const UKURAN = 1280, MUTU = 0.75, UKURAN_KECIL = 240;

async function gambarDari(file) {
  if (window.createImageBitmap) {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* lanjut cara lama */ }
  }
  return new Promise((ok, gagal) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => gagal(new Error('Berkas bukan gambar')); im.src = URL.createObjectURL(file); });
}

function keJpeg(img, maks, mutu) {
  const w = img.width, h = img.height, s = Math.min(1, maks / Math.max(w, h));
  const c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(h * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, 'image/jpeg', mutu));
}

export async function kompres(file) {
  const img = await gambarDari(file);
  const [penuh, kecil] = await Promise.all([keJpeg(img, UKURAN, MUTU), keJpeg(img, UKURAN_KECIL, 0.6)]);
  if (img.close) img.close();
  return { penuh, kecil };
}

export function keBase64(blob) {
  return new Promise((ok, gagal) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1] || ''); r.onerror = () => gagal(r.error); r.readAsDataURL(blob); });
}

async function tx(mode, kerja) {
  const db = await bukaDb();
  return new Promise((ok, gagal) => {
    const t = db.transaction('foto', mode), hasil = kerja(t.objectStore('foto'));
    t.oncomplete = () => { db.close(); ok(hasil && 'result' in hasil ? hasil.result : undefined); };
    t.onerror = () => { db.close(); gagal(t.error); };
  });
}

export const simpanFoto = f => tx('readwrite', s => s.put(f));
export const hapusFoto = id => tx('readwrite', s => s.delete(id));
export const semuaFoto = async () => ((await tx('readonly', s => s.getAll())) || []).sort((a, b) => Date.parse(b.waktu) - Date.parse(a.waktu));
