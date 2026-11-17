// Sumber data aplikasi: akun Supabase. SB_URL menandai HP yang sudah memakai akun;
// HP yang masih tercatat memakai Google Sheet diminta pindah ke akun (lihat perluPindahAkun di AppLogic).
export { ambilSemua, kirimPerubahan, unggahFoto, tautanFoto, imporJamaah, ambilCentangBaru, dengarCentang } from './supabaseApi.js';

export const SB_URL = 'supabase:akun';
