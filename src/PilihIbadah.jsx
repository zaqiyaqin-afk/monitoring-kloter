// Layar awal Checklist Massal (desain Cyber-Mint): 3 kartu bergambar (Haji = mint, Umrah = safir, Madinah = emas)
// dengan lapisan gelap yang sama, lalu kartu Foto kegiatan. Warna kartu biasa memakai token --m-* di tema.css.
import React from 'react';
import { WARNA_IBADAH } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;

// Warna aksen tiap ibadah di layar ini; CTA Haji mint menyala, Umrah & Madinah putih
const AKSEN = {
  haji: { aksen: '#18f59a', cta: 'var(--m-isi)', ctaBayang: 'var(--m-isi-bayang)' },
  umrah: { aksen: '#38bdf8', cta: '#ffffff', ctaBayang: '0 6px 16px -6px rgba(0,0,0,.45)' },
  madinah: { aksen: '#fbbf24', cta: '#ffffff', ctaBayang: '0 6px 16px -6px rgba(0,0,0,.45)' }
};

function KartuIbadah({ x }) {
  const w = WARNA_IBADAH[x.m] || WARNA_IBADAH.haji, a = AKSEN[x.m] || AKSEN.haji;
  return (
    <button
      onClick={x.on}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 24, padding: 18, boxSizing: 'border-box', width: '100%',
        background: `linear-gradient(90deg, rgba(5,16,15,.94) 0%, rgba(8,27,24,.78) 55%, rgba(5,16,15,.46) 100%), url(${w.gambar}) ${w.posisi || 'center'} / cover no-repeat, #081514`,
        border: '1.5px solid ' + a.aksen,
        boxShadow: x.aktif ? `0 0 0 2px ${a.aksen}, 0 14px 28px -12px rgba(0,0,0,.5)` : '0 12px 26px -12px rgba(0,0,0,.45)',
        color: '#ffffff', display: 'grid', gap: 8, alignContent: 'start', textAlign: 'left', font: 'inherit', cursor: 'pointer'
      }}
    >
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(11.5), fontWeight: 800, letterSpacing: '.08em', color: a.aksen }}>{x.label}</span>
        <span style={{ fontSize: fs(10.5), fontWeight: 800, padding: '5px 11px', borderRadius: 12, background: 'rgba(5,18,14,.72)', color: a.aksen }}>{x.badge}</span>
      </span>
      <span style={{ display: 'grid', gap: 3 }}>
        <span style={{ fontSize: fs(22), fontWeight: 800, lineHeight: 1.2 }}>{x.judul}</span>
        <span style={{ fontSize: fs(11.5), fontWeight: 500, color: '#d5ebe6', overflowWrap: 'anywhere' }}>{x.sub}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: fs(24), fontWeight: 800 }}>{x.pct}%</span>
        <span style={{ fontSize: fs(12.5), fontWeight: 600, color: a.aksen }}>{x.pct >= 100 ? 'selesai' : x.pct > 0 ? 'berjalan' : 'belum dimulai'}</span>
      </span>
      <span style={{ height: 7, borderRadius: 4, background: 'rgba(0,0,0,.53)', overflow: 'hidden' }} aria-hidden="true">
        <span style={{ display: 'block', height: '100%', width: Math.max(4, x.pct) + '%', borderRadius: 4, background: a.aksen }} />
      </span>
      <span style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, padding: '6px 16px 6px 6px', borderRadius: 22, boxSizing: 'border-box', background: a.cta, boxShadow: a.ctaBayang, color: '#05120e', fontSize: fs(13), fontWeight: 800 }}>
        <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: '50%', flex: 'none', background: '#05120e', color: '#16f298', display: 'grid', placeItems: 'center', fontSize: 14, lineHeight: 1 }}>→</span>
        <span>{String(x.cta || '').replace(/\s*→$/, '')}</span>
      </span>
    </button>
  );
}

export default function PilihIbadah({ v }) {
  const f = v.fotoCard || {};
  return (
    <div className="mk-kolom" style={{ padding: '14px 14px 24px', gap: 14 }}>
      <div className="mk-penuh" style={{ display: 'grid', gap: 4, padding: '4px 4px 0' }}>
        <span style={{ fontSize: fs(11), color: 'var(--m-aksen-teks)', fontWeight: 800, letterSpacing: '.06em' }}>CHECKLIST MASSAL · {String(v.kloterLabel || '').toUpperCase()}</span>
        <span style={{ fontSize: fs(25), fontWeight: 800, lineHeight: 1.15, color: 'var(--m-teks)' }}>Pilih ibadah</span>
      </div>
      {(v.pilihIbadah || []).map(x => <KartuIbadah key={x.m} x={x} />)}
      <div style={{ position: 'relative', borderRadius: 24, padding: 16, background: 'var(--m-kartu)', boxShadow: 'var(--m-kartu-bayang)', color: 'var(--m-teks)', display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--m-lembut)', color: 'var(--m-aksen-teks)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
          </span>
          <div style={{ display: 'grid', minWidth: 0 }}>
            <b style={{ fontSize: fs(15), color: 'var(--m-aksen-teks)' }}>Foto kegiatan</b>
            <span style={{ fontSize: fs(11.5), color: 'var(--m-teks-2)', lineHeight: 1.4 }}>Foto setelah kegiatan selesai, atau foto catatan kegiatan</span>
          </div>
        </div>
        <div style={{ borderRadius: 14, padding: '10px 14px', background: 'var(--m-ubin)', display: 'grid', gap: 2 }}>
          <b style={{ fontSize: fs(11.5) }}><span style={{ color: '#16f298' }} aria-hidden="true">● </span>{f.judul}</b>
          {f.sub ? <span style={{ fontSize: fs(10.5), color: 'var(--m-teks-2)' }}>{f.sub}</span> : null}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
          <button onClick={v.ambilFoto} style={{ border: 0, borderRadius: 24, minHeight: 48, background: 'var(--m-isi)', color: 'var(--m-on-isi)', font: `800 ${fs(13)} var(--font-body)`, cursor: 'pointer' }}>Ambil foto</button>
          <button onClick={v.bukaGaleri} style={{ borderRadius: 24, minHeight: 48, background: 'var(--m-ubin)', border: '1.5px solid var(--m-tepi)', color: 'var(--m-aksen-teks)', font: `800 ${fs(13)} var(--font-body)`, cursor: 'pointer' }}>Lihat semua</button>
        </div>
        <input ref={v.fotoInput} type="file" accept="image/*" capture="environment" onChange={v.onFotoFile} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
