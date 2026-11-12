// Layar awal Massal: satu kartu per ibadah (Haji, Umrah, Madinah) berisi progres dan tombol buka, lalu kartu Foto kegiatan.
import React from 'react';
import { IKON_IBADAH } from './kegiatan.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, display: 'grid', gap: 8, minWidth: 0 };
const kecil = { fontSize: fs(12.5), color: 'var(--teks-3)', lineHeight: 1.45 };
const NAMA = { haji: 'Haji', umrah: 'Umrah', madinah: 'Madinah' };
const Ikon = ({ d, s = 20 }) => <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d={d} /></svg>;

function KartuIbadah({ x }) {
  const status = x.pct >= 100 ? 'selesai' : x.pct > 0 ? 'berjalan' : 'belum dimulai';
  return (
    <div style={kartu}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {IKON_IBADAH[x.m] ? <span aria-hidden="true" style={{ width: 52, height: 52, flex: 'none', borderRadius: 26, display: 'grid', placeItems: 'center', background: 'var(--color-bg)', color: 'var(--color-accent)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={IKON_IBADAH[x.m]} /></svg>
        </span> : null}
        <span style={{ flex: 1, minWidth: 0, fontSize: fs(22), fontWeight: 300, lineHeight: 1.2 }}>{NAMA[x.m] || x.judul}</span>
        <span style={{ flex: 'none', fontSize: fs(13), fontWeight: 500 }}>{x.pct}% {status}</span>
      </div>
      <div style={kecil}>{[x.badge, NAMA[x.m] ? x.judul : ''].filter(Boolean).join(' · ')}</div>
      <div style={{ fontSize: fs(13.5), overflowWrap: 'anywhere' }}>{x.sub}</div>
      <div role="progressbar" aria-valuenow={x.pct} aria-valuemin={0} aria-valuemax={100} aria-label={'Progres ' + (NAMA[x.m] || x.judul)} style={{ height: 5, borderRadius: 3, background: 'var(--m-trek)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: x.pct + '%', borderRadius: 3, background: 'var(--color-accent)' }} />
      </div>
      <button type="button" className="btn btn-primary" onClick={x.on} style={{ justifySelf: 'start', minHeight: 44, marginTop: 6, padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: fs(13.5) }}>
        {String(x.cta || '').replace(/\s*→$/, '')}<Ikon d="M5 12h14M13 6l6 6-6 6" />
      </button>
    </div>
  );
}

export default function PilihIbadah({ v }) {
  const f = v.fotoCard || {};
  return (
    <div className="mk-kolom" style={{ padding: '12px 12px 24px', gap: 12 }}>
      {(v.pilihIbadah || []).map(x => <KartuIbadah key={x.m} x={x} />)}
      <div style={kartu}>
        <div style={{ fontSize: fs(16), fontWeight: 500 }}>Foto kegiatan</div>
        <div style={kecil}>Foto setelah kegiatan selesai, atau foto catatan kegiatan</div>
        <div style={{ fontSize: fs(13.5) }}>{f.judul}</div>
        {f.sub ? <div style={kecil}>{f.sub}</div> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginTop: 6 }}>
          <button type="button" className="btn btn-secondary" onClick={v.ambilFoto} style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: fs(13.5) }}>
            <Ikon d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />Ambil foto
          </button>
          <button type="button" className="btn btn-secondary" onClick={v.bukaGaleri} style={{ minHeight: 48, fontSize: fs(13.5) }}>Lihat semua</button>
        </div>
        <input ref={v.fotoInput} type="file" accept="image/*" capture="environment" onChange={v.onFotoFile} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
