// Gambar garis transparan untuk latar kartu (Ka'bah, masjid, jamaah berkumpul, tenda Mina, kubah hijau Nabawi)
// dan ikon tiap ibadah. Warna kartu gaya "Emas Klasik" juga disimpan di sini agar sama di Home dan Checklist.
import React from 'react';

export const EMAS = { muda: '#f6e2a4', utama: '#e8cf86', tua: '#c9a34b', garis: '#5c4a1b', teks: '#f1ead9', redup: '#9fb8aa', kartu: '#13291f', tepi: '#3b5f4c' };

const garis = { fill: 'none', stroke: EMAS.muda, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

const LATAR = {
  kabah: { vb: '0 0 180 160', isi: <path d="M30 40L90 25l60 15v80l-60 20-60-20zM30 40l60 15 60-15M90 55v85M30 58l60 15 60-15M30 66l60 15 60-15M104 98l20-5v34l-20 6z" {...garis} fill={EMAS.utama} fillOpacity=".18" /> },
  masjid: { vb: '0 0 200 140', isi: <path d="M60 130V82a40 40 0 0 1 80 0v48M100 42V28M100 18a5 5 0 1 0 .1 0M40 130h120M18 130V52l7-12 7 12v78M168 130V52l7-12 7 12v78M85 130v-22a15 15 0 0 1 30 0v22M18 70h14M168 70h14" {...garis} /> },
  kumpul: { vb: '0 0 300 130', isi: <g {...garis}><circle cx="60" cy="52" r="13" /><path d="M34 112c0-18 12-30 26-30s26 12 26 30" /><circle cx="110" cy="40" r="15" /><path d="M80 112c0-22 13-36 30-36s30 14 30 36" /><circle cx="165" cy="46" r="14" /><path d="M137 112c0-20 13-33 28-33s28 13 28 33" /><circle cx="218" cy="54" r="12" /><path d="M194 112c0-17 11-28 24-28s24 11 24 28" /><circle cx="262" cy="60" r="11" /><path d="M240 112c0-15 10-25 22-25s22 10 22 25" /><path d="M10 116h290" /></g> },
  tenda: { vb: '0 0 210 120', isi: <path d="M5 115L55 40l50 75M55 40v75M95 115l50-75 50 75M145 40v75M0 115h210M55 40V22l15 6-15 6M145 40V22l15 6-15 6M30 115l25-35 25 35M120 115l25-35 25 35" {...garis} /> },
  nabawi: { vb: '0 0 200 140', isi: <g><path d="M62 98c0-30 16-46 38-52 22 6 38 22 38 52z" fill="#2fd08a" fillOpacity=".45" stroke="#bff5dc" strokeWidth="2" /><path d="M100 46V30M95 24a6 6 0 1 0 9 6 5 5 0 0 1-9-6zM55 135V98h90v37M30 135h150M165 135V44l7-12 7 12v91M165 62h14M88 135v-16a12 12 0 0 1 24 0v16" {...garis} stroke="#bff5dc" /></g> }
};

// Gambar latar: diletakkan absolut di dalam kartu (kartu wajib position:relative; overflow:hidden)
export function Latar({ jenis, style }) {
  const g = LATAR[jenis];
  return <svg viewBox={g.vb} aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none', ...style }}>{g.isi}</svg>;
}

export const IKON_IBADAH = {
  haji: 'M3 20L12 5l9 15M12 5v15M7.5 20L12 13l4.5 7M2 20h20',
  umrah: 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M4 10.5l8 4 8-4',
  madinah: 'M12 2v2M8 9a4 4 0 0 1 8 0M6 21v-9h12v9M3 21h19M20 21V8l1-2 1 2v13M10 21v-3a2 2 0 0 1 4 0v3'
};
export const WARNA_IBADAH = {
  haji: { ikon: 'linear-gradient(150deg, #8a6a1c, #4a3810)', isi: EMAS.utama, latar: 'tenda', kartu: 'radial-gradient(circle at 100% 0%, #6b5316 0%, #2a2008 45%, #13291f 100%)', tepi: EMAS.tua, aksen: EMAS.muda, redup: '#e5d9b8' },
  umrah: { ikon: 'linear-gradient(150deg, #2a2a2a, #000)', isi: '#5fe0a6', latar: 'kabah', kartu: 'radial-gradient(circle at 100% 0%, #3a3a3a 0%, #121212 50%, #13291f 100%)', tepi: '#8a7433', aksen: '#9ff0c9', redup: '#d9d2bf' },
  madinah: { ikon: 'linear-gradient(150deg, #2fa877, #0f6b4c)', isi: '#7fd0a8', latar: 'nabawi', kartu: 'radial-gradient(circle at 100% 0%, #2c8a62 0%, #104a35 50%, #13291f 100%)', tepi: '#5fbf93', aksen: '#bff5dc', redup: '#cfe9dc' }
};
