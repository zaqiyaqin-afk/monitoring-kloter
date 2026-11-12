// Kepala layar selain Home: gradasi pendek berisi tombol kembali, judul layar, status sinkron, dan Profil.
import React from 'react';
import { TombolSinkron, TombolProfil } from '../HomeAtas.jsx';

export default function KepalaHalaman({ v }) {
  // Layar yang dibuka dari bilah bawah adalah akar: tidak perlu tombol kembali.
  const mundur = v.isKejadian && v.kejadian && v.kejadian.form ? v.kejadian.batal : v.isKirim && v.kirim && v.kirim.jenis ? v.kirim.tutup : null, dalam = !!mundur;
  const keluar = mundur || (v.isChecklist && !v.ckPilih ? v.kePilihIbadah : v.kembali);
  const akar = !dalam && (v.isKirim || v.isKejadian || v.isJamaah || (v.isChecklist && v.ckPilih));
  return (
    <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', boxSizing: 'border-box' }}>
      {!akar ? (
        <button type="button" onClick={keluar} aria-label="Kembali" className="mk-kaca-putih" style={{ width: 44, height: 44, borderRadius: 22, flex: 'none', display: 'grid', placeItems: 'center', padding: 0, cursor: 'pointer' }}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
      ) : null}
      <div style={{ flex: 1, minWidth: 0, display: 'grid', lineHeight: 1.2 }}>
        <span style={{ fontSize: 'calc(22px*var(--fs,1))', fontWeight: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.judulLayar}</span>
        <span style={{ fontSize: 'calc(12.5px*var(--fs,1))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.kloterLabel}</span>
      </div>
      {dalam ? null : <TombolSinkron v={v} ringkas />}
      {v.isProfil || dalam ? null : <TombolProfil v={v} />}
    </div>
  );
}
