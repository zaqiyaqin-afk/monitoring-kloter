// Gaya bersama layar Doa dan Kultum; warna dari token --m-* supaya ikut mode terang/gelap.
export const fs = n => `calc(${n}px*var(--fs,1))`;
export const kartu = { borderRadius: 20, padding: 16, background: 'var(--m-kartu)', boxShadow: 'var(--m-kartu-bayang)', color: 'var(--m-teks)', display: 'grid', gap: 12, minWidth: 0 };
export const judulBesar = { fontSize: fs(25), fontWeight: 800, lineHeight: 1.15, color: 'var(--m-teks)', margin: 0 };
export const label = { fontSize: fs(11), fontWeight: 800, letterSpacing: '.06em', color: 'var(--m-aksen-teks)' };
export const redup = { fontSize: fs(12.5), color: 'var(--m-teks-2)', lineHeight: 1.45, margin: 0 };
export const tombol = { border: 0, borderRadius: 14, minHeight: 44, padding: '0 16px', background: 'var(--m-ubin)', color: 'var(--m-teks)', font: `700 ${fs(13)} var(--font-body)`, cursor: 'pointer' };
export const tombolUtama = { ...tombol, background: 'var(--m-isi)', color: 'var(--m-on-isi)', fontWeight: 800 };
export const tombolTipis = { ...tombol, background: 'transparent', border: '1.5px solid var(--m-garis-kartu, var(--m-tepi))' };
export const masukan = { width: '100%', boxSizing: 'border-box', minHeight: 44, borderRadius: 12, border: '1.5px solid var(--m-tepi)', padding: '10px 12px', background: 'var(--m-ubin)', color: 'var(--m-teks)', font: `500 ${fs(14)} var(--font-body)` };
export const arab = px => ({ fontFamily: "'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif", fontSize: px, lineHeight: 2.15, direction: 'rtl', textAlign: 'right', whiteSpace: 'pre-line', margin: 0, overflowWrap: 'anywhere', color: 'var(--m-teks)' });
export const Ikon = ({ d, s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
