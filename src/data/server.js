// Pilih sumber data: akun Supabase (alamat khusus SB_URL) atau Google Sheet (URL Web App).
// HP lama yang masih memakai Sheet tetap berjalan sampai petugas berpindah ke akun.
import * as sheet from './sheetsApi.js';
import * as supa from './supabaseApi.js';

export const SB_URL = 'supabase:akun';
const pilih = url => (url === SB_URL ? supa : sheet);

export const ambilSemua = (url, key, o) => pilih(url).ambilSemua(url, key, o);
export const kirimPerubahan = (url, key, items) => pilih(url).kirimPerubahan(url, key, items);
export const gantiKunci = (url, key, baru) => pilih(url).gantiKunci(url, key, baru);
export const unggahFoto = (url, key, f, data) => pilih(url).unggahFoto(url, key, f, data);
export const tautanFoto = supa.tautanFoto;
