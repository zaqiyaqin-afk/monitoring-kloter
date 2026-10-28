// Layar awal Checklist: kartu besar Haji, Umrah, Madinah (latar tenda, Ka'bah, kubah hijau Nabawi)
// lalu kartu Foto kegiatan (foto setelah kegiatan selesai, atau foto catatan kegiatan).
import React from 'react';
import { Latar, EMAS, WARNA_IBADAH } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const serif = 'Fraunces, Georgia, serif';
const POSISI = {
  haji: { width: 290, right: -50, bottom: -10, opacity: 0.2 },
  umrah: { width: 220, right: -36, bottom: -34, opacity: 0.24 },
  madinah: { width: 240, right: -40, bottom: -12, opacity: 0.3 }
};

function KartuIbadah({ x }) {
  const w = WARNA_IBADAH[x.m], emas = x.m === 'haji';
  return (
    <button onClick={x.on} style={{ position: 'relative', overflow: 'hidden', borderRadius: 26, padding: 20, minHeight: 220, boxSizing: 'border-box', background: w.kartu, border: '1.5px solid ' + w.tepi, boxShadow: x.aktif ? `0 0 0 3px var(--color-bg), 0 0 0 5px ${w.tepi}, 0 14px 30px rgba(0,0,0,.35)` : '0 14px 30px -14px rgba(0,0,0,.55)', color: EMAS.teks, display: 'grid', gap: 10, alignContent: 'start', textAlign: 'left', font: 'inherit', cursor: 'pointer', width: '100%' }}>
      <Latar jenis={w.latar} style={POSISI[x.m]} />
      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(12), fontWeight: 800, letterSpacing: '.12em', color: x.m === 'madinah' ? w.aksen : EMAS.utama }}>{x.label}</span>
        <span style={{ fontSize: fs(12), fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,.12)', color: w.aksen }}>{x.badge}</span>
      </span>
      <span style={{ position: 'relative', fontFamily: serif, fontSize: fs(30), fontWeight: 700, lineHeight: 1.05 }}>{x.judul}</span>
      <span style={{ position: 'relative', fontSize: fs(13), color: w.redup, overflowWrap: 'anywhere' }}>{x.sub}</span>
      <span style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
        <span style={{ fontSize: fs(26), fontWeight: 800, color: w.aksen }}>{x.pct}%</span>
        <span style={{ fontSize: fs(13), color: w.redup }}>{x.pct >= 100 ? 'selesai' : x.pct > 0 ? 'berjalan' : 'belum dimulai'}</span>
      </span>
      <span style={{ position: 'relative', height: 8, borderRadius: 9, background: 'rgba(0,0,0,.35)', overflow: 'hidden' }} aria-hidden="true">
        <span style={{ display: 'block', height: '100%', width: Math.max(2, x.pct) + '%', borderRadius: 9, background: emas ? `linear-gradient(90deg, ${EMAS.tua}, ${EMAS.muda})` : w.aksen }} />
      </span>
      <span style={{ position: 'relative', justifySelf: 'start', fontSize: fs(14), fontWeight: 800, padding: '11px 18px', borderRadius: 14, minHeight: 44, boxSizing: 'border-box', ...(emas ? { background: `linear-gradient(160deg, #f3dd9b, ${EMAS.tua})`, color: '#2b1d00' } : { border: '1.5px solid ' + w.tepi, color: w.aksen }) }}>{x.cta} ›</span>
    </button>
  );
}

export default function PilihIbadah({ v }) {
  const f = v.fotoCard || {};
  return (
    <div style={{ padding: '8px 20px 24px', display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 2 }}>
        <span style={{ fontSize: fs(12), color: 'var(--color-accent-2-700)', fontWeight: 800, letterSpacing: '.08em' }}>CHECKLIST MASSAL · {String(v.kloterLabel || '').toUpperCase()}</span>
        <span style={{ fontFamily: serif, fontSize: fs(30), fontWeight: 700, lineHeight: 1.1 }}>Pilih ibadah</span>
      </div>
      {(v.pilihIbadah || []).map(x => <KartuIbadah key={x.m} x={x} />)}
      <div style={{ position: 'relative', borderRadius: 24, padding: 18, background: EMAS.kartu, border: '1px solid ' + EMAS.tepi, color: EMAS.teks, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: `linear-gradient(160deg, #f3dd9b, ${EMAS.tua})`, color: '#2b1d00', flex: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
          </span>
          <div style={{ display: 'grid', minWidth: 0 }}>
            <b style={{ fontSize: fs(16) }}>Foto kegiatan</b>
            <span style={{ fontSize: fs(12.5), color: EMAS.redup, lineHeight: 1.4 }}>Foto setelah kegiatan selesai, atau foto catatan kegiatan</span>
          </div>
        </div>
        <div style={{ fontSize: fs(13), lineHeight: 1.45 }}><b>{f.judul}</b>{f.sub ? <span style={{ color: '#c9d8cf' }}> · {f.sub}</span> : null}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8 }}>
          <button onClick={v.ambilFoto} style={{ border: 0, borderRadius: 14, minHeight: 46, background: `linear-gradient(160deg, #f3dd9b, ${EMAS.tua})`, color: '#2b1d00', font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>Ambil foto</button>
          <button onClick={v.bukaGaleri} style={{ borderRadius: 14, minHeight: 46, background: 'transparent', border: '1.5px solid ' + EMAS.garis, color: EMAS.utama, font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>Lihat semua</button>
        </div>
        <input ref={v.fotoInput} type="file" accept="image/*" capture="environment" onChange={v.onFotoFile} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
