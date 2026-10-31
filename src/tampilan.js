// Pilihan tampilan per HP: tema (otomatis/terang/gelap) dan ukuran huruf.
// Tema terang "Modern Segar Berwarna" adalah bawaan (DESIGN.md).
const K = 'mk.tampilan.v3';
export const UKURAN = [{ v: 0.9, l: 'Kecil' }, { v: 1, l: 'Normal' }, { v: 1.15, l: 'Besar' }, { v: 1.3, l: 'Sangat besar' }];
export const TEMA = [{ v: 'otomatis', l: 'Ikuti HP' }, { v: 'terang', l: 'Terang' }, { v: 'gelap', l: 'Gelap' }];

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

const mqGelap = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

// data-tema selalu berisi "terang" atau "gelap" supaya tema.css cukup punya satu blok gelap
export function terapkan(x = baca()) {
  const r = document.documentElement;
  const gelap = x.tema === 'gelap' || (x.tema === 'otomatis' && !!(mqGelap && mqGelap.matches));
  r.setAttribute('data-tema', gelap ? 'gelap' : 'terang');
  r.style.setProperty('--fs', String(x.huruf));
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', gelap ? '#0b1324' : '#059669');
}

// "Ikuti HP": ikut berganti saat HP berpindah mode terang/gelap
if (mqGelap && mqGelap.addEventListener) mqGelap.addEventListener('change', () => { if (baca().tema === 'otomatis') terapkan(); });

export function simpan(ubah) {
  const x = { ...baca(), ...ubah };
  try { localStorage.setItem(K, JSON.stringify(x)); } catch (e) {}
  terapkan(x); return x;
}
