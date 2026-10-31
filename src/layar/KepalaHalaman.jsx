// Kepala halaman: tersusun rapi tanpa bertumpuk di semua menu (Home, Menu, Massal, Kirim, Profil).
import React from 'react';
import { css, txt } from '../dc/runtime.js';

export default function KepalaHalaman({ v }) {
  const subHalaman = v.bisaKembali && !v.isMenu && !v.isKirim && !v.isProfil && !(v.isChecklist && v.ckPilih);
  return (
    <div style={css("height:76px;display:flex;align-items:center;gap:10px;padding:0 14px 0 16px;box-sizing:border-box")}>
      {subHalaman ? (
        <button type="button" onClick={v.kembali} aria-label="Kembali" style={css("width:38px;height:38px;border-radius:50%;flex:none;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.22);color:#f8fafc;display:grid;place-items:center;margin-left:-4px;padding:0;cursor:pointer")}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      ) : null}
      <button type="button" ref={v.logoBox} onClick={v.openSync} aria-label="Profil dan status sinkron" style={css("width:42px;height:42px;padding:0;border:1.5px solid rgba(251,191,36,.65);border-radius:50%;flex:none;background:rgba(15,23,42,.65);overflow:hidden;display:grid;place-items:center;box-shadow:0 4px 12px -3px rgba(0,0,0,.35);cursor:pointer")}></button>
      <div style={css("flex:1;min-width:0;display:grid;gap:2px;line-height:1.18")}>
        <div style={css("font-size:calc(11.5px*var(--fs,1));font-weight:700;color:#6ee7b7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
          Assalamu'alaikum ·{" "}{txt(v.kloterLabel)}
        </div>
        <div style={css("font-weight:800;font-size:calc(15px*var(--fs,1));color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
          {txt(v.ppihName)}
        </div>
        <div style={css("display:flex;align-items:center;min-width:0;padding-top:1px")}>
          <button type="button" onClick={v.openSync} style={css("border:0;background:transparent;padding:0;display:inline-flex;align-items:center;cursor:pointer;max-width:100%")}>
            <span style={css("display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 8px;border-radius:999px;background:rgba(15,23,42,.72);color:#e2e8f0;border:1px solid rgba(251,191,36,.35);font:700 calc(10.5px*var(--fs,1)) var(--font-body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
              <span aria-hidden="true" style={css(`width:6px;height:6px;border-radius:50%;background:${v.hs?.dot ?? ''};flex:none`)}></span>
              {txt(v.hs?.text)}
            </span>
          </button>
        </div>
      </div>
      <div style={css("flex:none;display:flex;align-items:center;gap:9px;min-height:46px;border-radius:14px;padding:4px 11px;white-space:nowrap;background:rgba(10,25,38,.78);border:1px solid rgba(251,191,36,.48);box-shadow:0 6px 16px -4px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.14)")}>
        <span style={css("display:grid;justify-items:center;gap:1px;line-height:1.05")}>
          <span style={css("font-size:calc(9.5px*var(--fs,1));font-weight:800;letter-spacing:.08em;color:#fcd34d")}>
            WIB
          </span>
          <b style={css("font-size:calc(14.5px*var(--fs,1));font-weight:800;font-variant-numeric:tabular-nums;color:#ffffff")}>
            {txt(v.clockWib)}
          </b>
        </span>
        <span aria-hidden="true" style={css("width:1.5px;height:26px;border-radius:2px;background:rgba(251,191,36,.75)")}></span>
        <span style={css("display:grid;justify-items:center;gap:1px;line-height:1.05")}>
          <span style={css("font-size:calc(9.5px*var(--fs,1));font-weight:800;letter-spacing:.08em;color:#6ee7b7")}>
            WIS
          </span>
          <b style={css("font-size:calc(14.5px*var(--fs,1));font-weight:800;font-variant-numeric:tabular-nums;color:#ffffff")}>
            {txt(v.clockWas)}
          </b>
        </span>
      </div>
    </div>
  );
}
