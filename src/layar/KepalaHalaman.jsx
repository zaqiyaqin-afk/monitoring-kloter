// Kepala halaman (desain Cyber-Mint): logo, salam + nama petugas + status sinkron, jam WIB | WIS.
// Warnanya ikut mode terang/gelap lewat token --m-*.
import React from 'react';
import { css, txt } from '../dc/runtime.js';

export default function KepalaHalaman({ v }) {
  const subHalaman = v.bisaKembali && !v.isMenu && !v.isKirim && !v.isProfil && !v.isDoa && !v.isKultum && !(v.isChecklist && v.ckPilih);
  return (
    <div style={css("height:76px;display:flex;align-items:center;gap:10px;padding:0 14px 0 16px;box-sizing:border-box")}>
      {subHalaman ? (
        <button type="button" onClick={v.kembali} aria-label="Kembali" style={css("width:38px;height:38px;border-radius:50%;flex:none;background:var(--m-lembut);border:0;color:var(--m-aksen-teks);display:grid;place-items:center;margin-left:-4px;padding:0;cursor:pointer")}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      ) : null}
      <button type="button" ref={v.logoBox} onClick={v.openSync} aria-label="Profil dan status sinkron" style={css("width:44px;height:44px;padding:0;border:1.5px solid var(--m-tepi);border-radius:50%;flex:none;background:var(--m-logo);overflow:hidden;display:grid;place-items:center;cursor:pointer")}></button>
      <div style={css("flex:1;min-width:0;display:grid;gap:2px;line-height:1.18")}>
        <div style={css("font-size:calc(11px*var(--fs,1));font-weight:700;color:var(--m-aksen-teks);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
          Assalamu'alaikum ·{" "}{txt(v.kloterLabel)}
        </div>
        <div style={css("font-weight:800;font-size:calc(14.5px*var(--fs,1));color:var(--m-teks);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
          {txt(v.ppihName)}
        </div>
        <div style={css("display:flex;align-items:center;min-width:0;padding-top:1px")}>
          <button type="button" onClick={v.openSync} style={css("border:0;background:transparent;padding:13px 0;margin:-13px 0;display:inline-flex;align-items:center;cursor:pointer;max-width:100%")}>
            <span style={css("display:inline-flex;align-items:center;gap:5px;height:19px;padding:0 9px;border-radius:999px;background:var(--m-lembut);color:var(--m-lembut-teks);font:700 calc(10px*var(--fs,1)) var(--font-body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
              <span aria-hidden="true" style={css(`width:6px;height:6px;border-radius:50%;background:${v.hs?.dot ?? ''};flex:none`)}></span>
              {txt(v.hs?.text)}
            </span>
          </button>
        </div>
      </div>
      <div style={css("flex:none;display:flex;align-items:center;gap:9px;min-height:46px;border-radius:14px;padding:4px 11px;white-space:nowrap;background:var(--m-jam);border:1px solid var(--m-hd-tepi)")}>
        <span style={css("display:grid;justify-items:center;gap:1px;line-height:1.05")}>
          <span style={css("font-size:calc(9.5px*var(--fs,1));font-weight:800;letter-spacing:.08em;color:var(--m-jam-wib)")}>
            WIB
          </span>
          <b style={css("font-size:calc(14px*var(--fs,1));font-weight:800;font-variant-numeric:tabular-nums;color:var(--m-teks)")}>
            {txt(v.clockWib)}
          </b>
        </span>
        <span aria-hidden="true" style={css("width:1.5px;height:26px;border-radius:2px;background:var(--m-tepi)")}></span>
        <span style={css("display:grid;justify-items:center;gap:1px;line-height:1.05")}>
          <span style={css("font-size:calc(9.5px*var(--fs,1));font-weight:800;letter-spacing:.08em;color:var(--m-aksen-teks)")}>
            WIS
          </span>
          <b style={css("font-size:calc(14px*var(--fs,1));font-weight:800;font-variant-numeric:tabular-nums;color:var(--m-teks)")}>
            {txt(v.clockWas)}
          </b>
        </span>
      </div>
    </div>
  );
}
