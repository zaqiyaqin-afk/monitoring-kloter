// Sorotan pilihan yang bergeser: setiap grup tombol dengan satu tombol aria-pressed="true" mendapat
// pil di belakangnya yang meluncur ke tombol baru, sama seperti pil di bilah navigasi bawah.
// Grup bertanda data-sorot="tidak" atau berisi baris .ketuk (daftar centang) dilewati.

const keadaan = new WeakMap();
const kurangiGerak = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function lepas(c) {
  const k = keadaan.get(c); if (!k) return;
  k.pil.remove(); c.removeAttribute('data-sorot'); keadaan.delete(c);
}

function atur(c, aktif) {
  let k = keadaan.get(c);
  if (!k) {
    const pil = document.createElement('span'); pil.className = 'mk-sorot-pil'; pil.setAttribute('aria-hidden', 'true');
    c.insertBefore(pil, c.firstChild); c.setAttribute('data-sorot', ''); k = { pil, el: null, r: null }; keadaan.set(c, k);
  }
  const r = { x: aktif.offsetLeft, y: aktif.offsetTop, w: aktif.offsetWidth, h: aktif.offsetHeight }, p = k.pil;
  const sama = k.r && k.r.x === r.x && k.r.y === r.y && k.r.w === r.w && k.r.h === r.h && k.el === aktif;
  if (sama) return;
  p.style.background = aktif.style.background || aktif.style.backgroundColor || 'var(--color-accent)';
  p.style.borderRadius = getComputedStyle(aktif).borderRadius;
  const ke = { width: r.w + 'px', height: r.h + 'px', transform: `translate(${r.x}px, ${r.y}px)` };
  Object.assign(p.style, ke);
  if (k.el && k.el !== aktif && k.r && !kurangiGerak() && p.animate)
    p.animate([{ width: k.r.w + 'px', height: k.r.h + 'px', transform: `translate(${k.r.x}px, ${k.r.y}px)` }, ke], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' });
  k.el = aktif; k.r = r;
}

function pindai() {
  const grup = new Set();
  document.querySelectorAll('button[aria-pressed]').forEach(b => { if (b.parentElement) grup.add(b.parentElement); });
  grup.forEach(c => {
    const tb = [...c.children].filter(x => x.tagName === 'BUTTON' && x.hasAttribute('aria-pressed')), on = tb.filter(x => x.getAttribute('aria-pressed') === 'true');
    const lewati = c.getAttribute('data-sorot') === 'tidak' || tb.some(x => x.classList.contains('ketuk'));
    if (lewati || tb.length < 2 || on.length !== 1) lepas(c); else atur(c, on[0]);
  });
}

let antre = 0;
export function mulaiSorot() {
  if (typeof MutationObserver !== 'function') return;
  const jadwal = () => { if (!antre) antre = requestAnimationFrame(() => { antre = 0; pindai(); }); };
  new MutationObserver(jadwal).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed', 'style'] });
  window.addEventListener('resize', jadwal);
  jadwal();
}
