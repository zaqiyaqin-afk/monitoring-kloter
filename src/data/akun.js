// Akun petugas di Supabase: masuk, daftar, status persetujuan admin.
// Sesi dan profil terakhir disimpan di HP supaya aplikasi tetap terbuka tanpa internet.
import { createClient } from '@supabase/supabase-js';

const URL_SB = import.meta.env.VITE_SUPABASE_URL, KUNCI_SB = import.meta.env.VITE_SUPABASE_KEY;
export const aktif = !!(URL_SB && KUNCI_SB);
export const sb = aktif ? createClient(URL_SB, KUNCI_SB, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'mk.sesi' } }) : null;

const KP = 'mk.profil';
let st = { siap: !aktif, sesi: null, profil: bacaProfil(), galat: '' };
const pendengar = new Set();

function bacaProfil() { try { return JSON.parse(localStorage.getItem(KP) || 'null'); } catch (e) { return null; } }
function simpanProfil(p) { try { p ? localStorage.setItem(KP, JSON.stringify(p)) : localStorage.removeItem(KP); } catch (e) {} }
function ubah(x) { st = { ...st, ...x }; pendengar.forEach(f => f(st)); }

export const keadaan = () => st;
export function dengar(f) { pendengar.add(f); return () => pendengar.delete(f); }

// Pesan galat Supabase -> bahasa petugas
export function pesan(e) {
  const m = String((e && (e.message || e.error_description)) || e || '');
  if (/Invalid login credentials/i.test(m)) return 'Email atau kata sandi salah.';
  if (/Email not confirmed/i.test(m)) return 'Email belum dikonfirmasi. Buka tautan konfirmasi di email Anda dulu.';
  if (/already registered|already been registered/i.test(m)) return 'Email ini sudah terdaftar. Silakan masuk.';
  if (/Password should be at least/i.test(m)) return 'Kata sandi minimal 6 karakter.';
  if (/rate limit/i.test(m)) return 'Terlalu sering mencoba. Tunggu beberapa menit.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'Tidak ada internet. Coba lagi saat tersambung.';
  if (/BUKAN_ADMIN/.test(m)) return 'Hanya admin yang boleh melakukan ini.';
  if (/IDENTITAS_BELUM_LENGKAP/.test(m)) return 'Kloter atau embarkasi pendaftar belum diisi.';
  return m || 'Terjadi kesalahan.';
}

export async function muatProfil() {
  if (!sb || !st.sesi) return st.profil;
  const { data, error } = await sb.from('profil').select('*, kloter:kloter_id (kode, nomor, embarkasi, gelombang)').eq('id', st.sesi.user.id).maybeSingle();
  if (error) { ubah({ galat: pesan(error) }); return st.profil; }
  simpanProfil(data); ubah({ profil: data, galat: '' });
  return data;
}

export async function mulai() {
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  ubah({ sesi: data.session, siap: true });
  if (data.session && navigator.onLine !== false) muatProfil();
  sb.auth.onAuthStateChange((_ev, sesi) => {
    ubah({ sesi });
    if (!sesi) { simpanProfil(null); ubah({ profil: null }); }
  });
}

export async function masuk(email, sandi) {
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password: sandi });
  if (error) throw new Error(pesan(error));
  ubah({ sesi: data.session });
  return muatProfil();
}

// Identitas ikut dikirim sebagai data pendaftaran; profil dibuat otomatis di database.
export async function daftar({ email, sandi, nama, kloter, embarkasi, gelombang }) {
  const { data, error } = await sb.auth.signUp({
    email: email.trim(), password: sandi,
    options: { data: { nama: nama.trim(), kloter: String(kloter).trim(), embarkasi: embarkasi.trim().toUpperCase(), gelombang: String(gelombang) },
               emailRedirectTo: location.origin + location.pathname }
  });
  if (error) throw new Error(pesan(error));
  if (data.session) { ubah({ sesi: data.session }); await muatProfil(); return { perluKonfirmasi: false }; }
  return { perluKonfirmasi: true };
}

export async function keluar() {
  try { await sb.auth.signOut(); } catch (e) {}
  simpanProfil(null); ubah({ sesi: null, profil: null });
}

// ---- Admin ----
export async function daftarAkun() {
  const { data, error } = await sb.from('profil').select('id, email, nama, kloter_diminta, embarkasi, gelombang, status, peran, dibuat, kloter:kloter_id (kode)').order('dibuat', { ascending: false });
  if (error) throw new Error(pesan(error));
  return data || [];
}
export async function setujui(id) { const { error } = await sb.rpc('setujui_petugas', { p_user: id }); if (error) throw new Error(pesan(error)); }
export async function tolak(id) { const { error } = await sb.rpc('tolak_petugas', { p_user: id }); if (error) throw new Error(pesan(error)); }
