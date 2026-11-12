// Waktu sholat Makkah/Madinah (Umm al-Qura) untuk kepala Home dan warna gradasi yang ikut waktu sholat.
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const NAMA = [['fajr', 'Subuh'], ['dhuhr', 'Dzuhur'], ['asr', 'Ashar'], ['maghrib', 'Magrib'], ['isha', 'Isya']];
const tglWas = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);
const hariSaudi = (geser = 0) => { const [y, m, d] = tglWas(new Date()).split('-').map(Number); return new Date(y, m - 1, d + geser); };

export const kotaTersimpan = awal => { try { return localStorage.getItem('mk.kota') || awal || 'Makkah'; } catch (e) { return awal || 'Makkah'; } };
export const simpanKota = k => { try { localStorage.setItem('mk.kota', k); } catch (e) {} };

let simpanan = null;
export function waktuSholat(kota) {
  const kunci = kota + '|' + Math.floor(Date.now() / 30000);
  if (simpanan && simpanan.kunci === kunci) return simpanan.nilai;
  const nilai = hitung(kota); simpanan = { kunci, nilai }; return nilai;
}
function hitung(kota) {
  const [lat, lng] = KOTA[kota] || KOTA.Makkah, p = CalculationMethod.UmmAlQura(), c = new Coordinates(lat, lng);
  const hari = new PrayerTimes(c, hariSaudi(), p), besok = new PrayerTimes(c, hariSaudi(1), p), kemarin = new PrayerTimes(c, hariSaudi(-1), p), now = Date.now();
  const daftar = NAMA.map(([k, l]) => ({ l, t: hari[k] }));
  const i = daftar.findIndex(x => x.t.getTime() > now);
  const next = i >= 0 ? daftar[i] : { l: 'Subuh', t: besok.fajr, besok: true };
  const prev = i > 0 ? daftar[i - 1].t : i === 0 ? kemarin.isha : daftar[4].t;
  const jarak = next.t.getTime() - prev.getTime();
  // Periode yang sedang berjalan = sholat terakhir yang sudah masuk; sebelum Subuh masih dihitung Isya.
  const kini = i > 0 ? daftar[i - 1].l : 'Isya';
  return { daftar, next, kini, sisa: next.t.getTime() - now, persen: jarak > 0 ? Math.min(100, Math.max(0, 100 - ((next.t.getTime() - now) / jarak) * 100)) : 0 };
}

export const periode = kota => waktuSholat(kota).kini.toLowerCase();
