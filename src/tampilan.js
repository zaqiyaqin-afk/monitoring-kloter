// Pilihan tampilan per HP: tema (otomatis/terang/gelap) dan ukuran huruf.
const K = 'mk.tampilan';
export const UKURAN = [{ v: 0.9, l: 'Kecil' }, { v: 1, l: 'Normal' }, { v: 1.15, l: 'Besar' }, { v: 1.3, l: 'Sangat besar' }];
export const TEMA = [{ v: 'otomatis', l: 'Ikuti HP' }, { v: 'terang', l: 'Terang' }, { v: 'gelap', l: 'Gelap' }];

export function baca() {
  let x = {}; try { x = JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) {}
  return { tema: TEMA.some(t => t.v === x.tema) ? x.tema : 'otomatis', huruf: UKURAN.some(u => u.v === x.huruf) ? x.huruf : 1 };
}

export function terapkan(x = baca()) {
  const r = document.documentElement;
  if (x.tema === 'otomatis') r.removeAttribute('data-tema'); else r.setAttribute('data-tema', x.tema);
  r.style.setProperty('--fs', String(x.huruf));
  const gelap = x.tema === 'gelap' || (x.tema === 'otomatis' && matchMedia('(prefers-color-scheme: dark)').matches);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', gelap ? '#0b1f18' : '#0f3d2e');
}

export function simpan(ubah) {
  const x = { ...baca(), ...ubah };
  try { localStorage.setItem(K, JSON.stringify(x)); } catch (e) {}
  terapkan(x); return x;
}
