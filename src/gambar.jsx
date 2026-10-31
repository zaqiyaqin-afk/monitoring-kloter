// Gambar garis transparan untuk latar kartu (Ka'bah, masjid, jamaah berkumpul, tenda Mina, kubah hijau Nabawi),
// ilustrasi bitmap kecil (WebP) untuk kartu ibadah, dan ikon tiap ibadah.
// Warna kartu memakai token tema.css supaya ikut mode terang/gelap ("Kaca Malam Haramain", DESIGN.md).
import React from 'react';
import gbKabah from './ilustrasi/kabah.webp';
import gbNabawi from './ilustrasi/nabawi.webp';
import gbMakkah from './ilustrasi/makkah.webp';
import gbHaram from './ilustrasi/haram.webp';
import gbArafah from './ilustrasi/arafah.webp';

export const GAMBAR = { kabah: gbKabah, nabawi: gbNabawi, makkah: gbMakkah, haram: gbHaram, arafah: gbArafah };

export const EMAS = { muda: 'var(--emas-muda)', utama: 'var(--emas-teks)', tua: 'var(--emas-tua)', garis: 'var(--kaca-garis)', teks: 'var(--color-text)', redup: 'var(--teks-2)', kartu: 'var(--kaca)', tepi: 'var(--kaca-garis)' };

// Garis memakai currentColor; warnanya diatur dari style `color` pada <Latar>
const garis = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

const LATAR = {
  kabah: { vb: '0 0 180 160', isi: <path d="M30 40L90 25l60 15v80l-60 20-60-20zM30 40l60 15 60-15M90 55v85M30 58l60 15 60-15M30 66l60 15 60-15M104 98l20-5v34l-20 6z" {...garis} fill="currentColor" fillOpacity=".18" /> },
  masjid: { vb: '0 0 200 140', isi: <path d="M60 130V82a40 40 0 0 1 80 0v48M100 42V28M100 18a5 5 0 1 0 .1 0M40 130h120M18 130V52l7-12 7 12v78M168 130V52l7-12 7 12v78M85 130v-22a15 15 0 0 1 30 0v22M18 70h14M168 70h14" {...garis} /> },
  kumpul: { vb: '0 0 300 130', isi: <g {...garis}><circle cx="60" cy="52" r="13" /><path d="M34 112c0-18 12-30 26-30s26 12 26 30" /><circle cx="110" cy="40" r="15" /><path d="M80 112c0-22 13-36 30-36s30 14 30 36" /><circle cx="165" cy="46" r="14" /><path d="M137 112c0-20 13-33 28-33s28 13 28 33" /><circle cx="218" cy="54" r="12" /><path d="M194 112c0-17 11-28 24-28s24 11 24 28" /><circle cx="262" cy="60" r="11" /><path d="M240 112c0-15 10-25 22-25s22 10 22 25" /><path d="M10 116h290" /></g> },
  tenda: { vb: '0 0 210 120', isi: <path d="M5 115L55 40l50 75M55 40v75M95 115l50-75 50 75M145 40v75M0 115h210M55 40V22l15 6-15 6M145 40V22l15 6-15 6M30 115l25-35 25 35M120 115l25-35 25 35" {...garis} /> },
  nabawi: { vb: '0 0 200 140', isi: <g><path d="M62 98c0-30 16-46 38-52 22 6 38 22 38 52z" fill="#2fd08a" fillOpacity=".45" stroke="#bff5dc" strokeWidth="2" /><path d="M100 46V30M95 24a6 6 0 1 0 9 6 5 5 0 0 1-9-6zM55 135V98h90v37M30 135h150M165 135V44l7-12 7 12v91M165 62h14M88 135v-16a12 12 0 0 1 24 0v16" {...garis} stroke="#bff5dc" /></g> }
};

// Gambar latar: diletakkan absolut di dalam kartu (kartu wajib position:relative; overflow:hidden)
export function Latar({ jenis, style }) {
  const g = LATAR[jenis];
  return <svg viewBox={g.vb} aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none', color: 'var(--emas-teks)', ...style }}>{g.isi}</svg>;
}

export const IKON_IBADAH = {
  haji: 'M3 20L12 5l9 15M12 5v15M7.5 20L12 13l4.5 7M2 20h20',
  umrah: 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M4 10.5l8 4 8-4',
  madinah: 'M12 2v2M8 9a4 4 0 0 1 8 0M6 21v-9h12v9M3 21h19M20 21V8l1-2 1 2v13M10 21v-3a2 2 0 0 1 4 0v3'
};
// ikon/isi: ubin dan angka di Home (ikut tema). gambar/tepi/aksen/redup: kartu bergambar Pilih ibadah.
// Haji memakai Emas, Umrah memakai Safir Biru, dan Madinah memakai Zamrud Hijau agar tiap ibadah punya warna khas.
export const WARNA_IBADAH = {
  haji: {
    ikon: 'var(--emas-ikon)', ikonFg: '#ffffff', isi: 'var(--emas-teks)',
    kartuBg: 'var(--emas-bg)', kartuTepi: 'var(--emas-tepi)', bar: 'var(--emas-ikon)',
    gambar: gbArafah, posisi: '82% 55%', tepi: '#f59e0b', aksen: '#fde68a', redup: '#fef3c7',
    ctaBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 55%, #d97706 100%)', ctaFg: '#1c1202', emas: true
  },
  umrah: {
    ikon: 'var(--safir-ikon)', ikonFg: '#ffffff', isi: 'var(--safir-teks)',
    kartuBg: 'var(--safir-bg)', kartuTepi: 'var(--safir-tepi)', bar: 'var(--safir-ikon)',
    gambar: gbKabah, posisi: '78% 55%', tepi: '#38bdf8', aksen: '#bae6fd', redup: '#e0f2fe',
    ctaBg: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)', ctaFg: '#ffffff', safir: true
  },
  madinah: {
    ikon: 'var(--zamrud-ikon)', ikonFg: '#ffffff', isi: 'var(--zamrud-teks)',
    kartuBg: 'var(--zamrud-bg)', kartuTepi: 'var(--zamrud-tepi)', bar: 'var(--zamrud-ikon)',
    gambar: gbNabawi, posisi: '80% 50%', tepi: '#34d399', aksen: '#a7f3d0', redup: '#d1fae5',
    ctaBg: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', ctaFg: '#03221c', zamrud: true
  }
};
