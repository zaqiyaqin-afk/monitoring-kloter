// Layar awal Checklist: 3 kartu besar berwarna khas (Haji = Emas, Umrah = Safir Biru, Madinah = Zamrud Hijau)
// dengan ilustrasi Ka'bah & Nabawi, lalu kartu Foto kegiatan.
import React from 'react';
import { WARNA_IBADAH } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const serif = 'Fraunces, Georgia, serif';

function KartuIbadah({ x }) {
  const w = WARNA_IBADAH[x.m], emas = x.m === 'haji', safir = x.m === 'umrah';
  const latarKartu = emas
    ? 'linear-gradient(160deg, #78350f 0%, #451a03 60%, #291002 100%)'
    : safir
    ? 'linear-gradient(160deg, #1e3a8a 0%, #172554 60%, #0f172a 100%)'
    : 'linear-gradient(160deg, #065f46 0%, #064e3b 60%, #022c22 100%)';
  const gradien = emas
    ? 'linear-gradient(95deg, rgba(58,22,4,.90) 0%, rgba(78,32,6,.48) 46%, rgba(58,22,4,.06) 100%), linear-gradient(180deg, rgba(58,22,4,.08) 0%, rgba(41,16,2,.68) 76%, rgba(41,16,2,1) 100%)'
    : safir
    ? 'linear-gradient(95deg, rgba(23,37,84,.92) 0%, rgba(30,58,138,.60) 48%, rgba(23,37,84,.16) 100%), linear-gradient(180deg, rgba(23,37,84,.14) 0%, rgba(15,23,42,.85) 72%, rgba(15,23,42,1) 100%)'
    : 'linear-gradient(95deg, rgba(6,78,59,.92) 0%, rgba(6,95,70,.60) 48%, rgba(6,78,59,.16) 100%), linear-gradient(180deg, rgba(6,78,59,.14) 0%, rgba(2,44,34,.85) 72%, rgba(2,44,34,1) 100%)';
  const barBg = emas
    ? 'linear-gradient(90deg, #f59e0b, #fde68a)'
    : safir
    ? 'linear-gradient(90deg, #38bdf8, #93c5fd)'
    : 'linear-gradient(90deg, #10b981, #6ee7b7)';
  return (
    <button
      onClick={x.on}
      className="mk-gelap"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        padding: 20,
        minHeight: 224,
        boxSizing: 'border-box',
        background: latarKartu,
        border: '1.5px solid ' + w.tepi,
        boxShadow: x.aktif
          ? `0 0 0 2px ${w.aksen}, 0 14px 28px -10px rgba(15,23,42,.38)`
          : '0 10px 24px -10px rgba(15,23,42,.32), inset 0 1px 0 rgba(255,255,255,.18)',
        color: '#f8fafc',
        display: 'grid',
        gap: 10,
        alignContent: 'start',
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        width: '100%'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 184,
          backgroundImage: `${gradien}, url(${w.gambar})`,
          backgroundSize: 'cover',
          backgroundPosition: w.posisi || 'center',
          pointerEvents: 'none'
        }}
      />
      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(12), fontWeight: 800, letterSpacing: '.12em', color: w.aksen }}>{x.label}</span>
        <span style={{ fontSize: fs(12), fontWeight: 700, padding: '4px 11px', borderRadius: 999, background: 'rgba(15, 23, 42, .62)', border: '1px solid ' + w.tepi, color: w.aksen }}>{x.badge}</span>
      </span>
      <span style={{ position: 'relative', fontFamily: serif, fontSize: fs(28), fontWeight: 700, lineHeight: 1.08, color: '#ffffff', marginTop: 4 }}>{x.judul}</span>
      <span style={{ position: 'relative', fontSize: fs(13), color: w.redup, overflowWrap: 'anywhere' }}>{x.sub}</span>
      <span style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: fs(28), fontWeight: 800, color: '#ffffff' }}>{x.pct}%</span>
        <span style={{ fontSize: fs(13), color: w.redup }}>{x.pct >= 100 ? 'selesai' : x.pct > 0 ? 'berjalan' : 'belum dimulai'}</span>
      </span>
      <span style={{ position: 'relative', height: 8, borderRadius: 9, background: 'rgba(0,0,0,.38)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }} aria-hidden="true">
        <span style={{ display: 'block', height: '100%', width: Math.max(4, x.pct) + '%', borderRadius: 9, background: barBg }} />
      </span>
      <span
        style={{
          position: 'relative',
          marginTop: 4,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontSize: fs(14.5),
          fontWeight: 800,
          padding: '10px 18px',
          borderRadius: 999,
          minHeight: 46,
          boxSizing: 'border-box',
          background: w.ctaBg,
          color: w.ctaFg
        }}
      >
        <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,.20)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: fs(13), lineHeight: 1 }}>→</span>
        <span>{String(x.cta || '').replace(/\s*→$/, '')}</span>
      </span>
    </button>
  );
}

export default function PilihIbadah({ v }) {
  const f = v.fotoCard || {};
  return (
    <div style={{ padding: '8px 20px 24px', display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 2 }}>
        <span style={{ fontSize: fs(12), color: 'var(--emas-teks)', fontWeight: 800, letterSpacing: '.08em' }}>CHECKLIST MASSAL · {String(v.kloterLabel || '').toUpperCase()}</span>
        <span style={{ fontFamily: serif, fontSize: fs(30), fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text)' }}>Pilih ibadah</span>
      </div>
      {(v.pilihIbadah || []).map(x => <KartuIbadah key={x.m} x={x} />)}
      <div className="kartu-emas" style={{ position: 'relative', borderRadius: 24, padding: 18, color: 'var(--color-text)', display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ubin ubin-emas" style={{ width: 46, height: 46, borderRadius: 14 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
          </span>
          <div style={{ display: 'grid', minWidth: 0 }}>
            <b style={{ fontSize: fs(16), color: 'var(--emas-teks)' }}>Foto kegiatan</b>
            <span style={{ fontSize: fs(12.5), color: 'var(--teks-2)', lineHeight: 1.4 }}>Foto setelah kegiatan selesai, atau foto catatan kegiatan</span>
          </div>
        </div>
        <div style={{ fontSize: fs(13), lineHeight: 1.45 }}><b>{f.judul}</b>{f.sub ? <span style={{ color: 'var(--teks-2)' }}> · {f.sub}</span> : null}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
          <button onClick={v.ambilFoto} style={{ border: 0, borderRadius: 999, minHeight: 46, background: 'var(--emas-isi)', color: 'var(--on-emas)', font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>Ambil foto</button>
          <button onClick={v.bukaGaleri} style={{ borderRadius: 999, minHeight: 46, background: 'var(--color-surface)', border: '1px solid var(--emas-tepi)', color: 'var(--emas-teks)', font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>Lihat semua</button>
        </div>
        <input ref={v.fotoInput} type="file" accept="image/*" capture="environment" onChange={v.onFotoFile} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
