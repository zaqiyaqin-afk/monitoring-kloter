// Pilihan tampilan per HP: tema (otomatis/terang/gelap) dan ukuran huruf.
// Tema terang "Modern Segar Berwarna" adalah bawaan (DESIGN.md).
const K = 'mk.tampilan.v3';
export const UKURAN = [{ v: 0.9, l: 'Kecil' }, { v: 1, l: 'Normal' }, { v: 1.15, l: 'Besar' }, { v: 1.3, l: 'Sangat besar' }];
export const TEMA = [{ v: 'terang', l: 'Terang' }];

export function baca() {
  let x = {};
  try {
    x = JSON.parse(localStorage.getItem(K) || '{}') || {};
    if (!x.huruf) {
      const lama = JSON.parse(localStorage.getItem('mk.tampilan.v2') || localStorage.getItem('mk.tampilan') || '{}') || {};
      if (UKURAN.some(u => u.v === lama.huruf)) x.huruf = lama.huruf;
    }
  } catch (e) {}
  return { tema: TEMA.some(t => t.v === x.tema) ? x.tema : 'terang', huruf: UKURAN.some(u => u.v === x.huruf) ? x.huruf : 1 };
}

// Tema gelap sudah dihapus: aplikasi selalu terang, yang tersimpan per HP tinggal ukuran huruf.
export function terapkan(x = baca()) {
  const r = document.documentElement;
  r.setAttribute('data-tema', 'terang');
  r.style.setProperty('--fs', String(x.huruf));
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#1b2a6b');
}

export function simpan(ubah) {
  const x = { ...baca(), ...ubah };
  try { localStorage.setItem(K, JSON.stringify(x)); } catch (e) {}
  terapkan(x); return x;
}
