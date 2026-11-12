// Bilah navigasi bawah: empat tab dan tombol Massal. Pil biru tua bergeser ke tab yang dibuka.
import React, { useLayoutEffect, useRef } from 'react';
import { txt, arr } from '../dc/runtime.js';

const kurangiGerak = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function BilahBawah({ v }) {
  const tabs = arr(v.tabs).filter(t => !t?.fab), massal = arr(v.tabs).find(t => t?.fab);
  const aktif = tabs.findIndex(t => t?.aktif);
  const nav = useRef(null), pil = useRef(null), ikon = useRef([]), xLama = useRef(null);

  // Posisi diukur dari ikon tab, bukan dihitung, supaya tetap pas di lebar layar dan ukuran huruf apa pun.
  useLayoutEffect(() => {
    const p = pil.current, i = ikon.current[aktif], n = nav.current;
    if (!p || !n) return;
    if (!i) { p.style.opacity = '0'; xLama.current = null; return; }
    const a = i.getBoundingClientRect(), b = n.getBoundingClientRect(), x = a.left - b.left, y = a.top - b.top, dari = xLama.current;
    p.style.opacity = '1'; p.style.transform = `translate(${x}px, ${y}px)`;
    if (dari != null && dari !== x && !kurangiGerak() && p.animate) {
      p.animate([{ transform: `translate(${dari}px, ${y}px) scaleX(1)` }, { transform: `translate(${(dari + x) / 2}px, ${y}px) scaleX(1.3)`, offset: 0.5 }, { transform: `translate(${x}px, ${y}px) scaleX(1)` }],
        { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    xLama.current = x;
  });

  return (
    <nav ref={nav} className="bb" aria-label="Navigasi utama">
      <span ref={pil} className="bb-pil" aria-hidden="true" style={{ opacity: 0 }}></span>
      {tabs.map((t, i) => (
        <button key={t.l} type="button" className="bb-tab" onClick={t.on} aria-current={t.aktif ? 'page' : undefined}>
          <span className="bb-ikon" ref={el => { ikon.current[i] = el; }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={t.aktif ? 1.9 : 1.6} strokeLinecap="round" strokeLinejoin="round"><path d={t.d} /></svg>
          </span>
          {txt(t.l)}
        </button>
      ))}
      {massal ? (
        <button type="button" className="bb-massal" onClick={massal.on} aria-current={massal.aktif ? 'page' : undefined}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={massal.d} /></svg>
          {txt(massal.l)}
        </button>
      ) : null}
    </nav>
  );
}
