// Kepala halaman: tombol kembali, profil, nama kloter, jam WAS/WIB, status sinkron.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function KepalaHalaman({ v }) {
  return (<>
          <div style={css("height:58px;display:flex;align-items:center;gap:10px;padding:0 16px 0 18px;box-sizing:border-box")}>
            {v.bisaKembali ? (
              <button type="button" onClick={v.kembali} aria-label="Kembali" style={css("width:44px;height:44px;border-radius:50%;flex:none;border:1px solid var(--kartu-garis);background:var(--kartu-bg);color:var(--color-accent-700);display:grid;place-items:center;margin-left:-6px")}>
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            ) : null}
            <button type="button" ref={v.logoBox} onClick={v.openSync} aria-label="Profil dan status sinkron" style={css("width:44px;height:44px;padding:0;border:0;border-radius:50%;flex:none;background:var(--color-surface);overflow:hidden;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--color-divider)")}></button>
            <div style={css("flex:1;min-width:0;line-height:1.25")}>
              <div style={css("font-size:calc(12.5px*var(--fs,1));font-weight:600;color:var(--color-neutral-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                Assalamu'alaikum ·{" "}{txt(v.kloterLabel)}
              </div>
              <div style={css("font-weight:800;font-size:calc(16px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                {txt(v.ppihName)}
              </div>
            </div>
            <div style={css("flex:none;display:flex;align-items:center;gap:8px;height:36px;background:var(--color-surface);border-radius:12px;padding:0 10px;font-size:calc(13px*var(--fs,1));white-space:nowrap;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
              <span>
                <span style={css("color:var(--color-neutral-700);font-weight:600")}>
                  WAS
                </span>
                {" "}
                <b style={css("color:var(--color-accent-700);font-size:calc(14px*var(--fs,1))")}>
                  {txt(v.clockWas)}
                </b>
              </span>
              <span style={css("width:1px;height:18px;background:var(--color-divider)")}></span>
              <span>
                <span style={css("color:var(--color-neutral-700);font-weight:600")}>
                  WIB
                </span>
                {" "}
                <b style={css("color:var(--color-accent-2-700);font-size:calc(14px*var(--fs,1))")}>
                  {txt(v.clockWib)}
                </b>
              </span>
            </div>
          </div>
          {" "}
          <div style={css("height:38px;padding:0 20px;display:flex;align-items:center")}>
            <button type="button" onClick={v.openSync} style={css("border:0;background:transparent;padding:0;height:44px;margin:-3px 0;display:flex;align-items:center")}>
              <span style={css(`display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 12px;border-radius:999px;background:${v.hs?.bg ?? ''};color:${v.hs?.fg ?? ''};font:700 calc(13px*var(--fs,1)) var(--font-body);white-space:nowrap`)}>
                <span aria-hidden="true" style={css(`width:10px;height:10px;border-radius:50%;background:${v.hs?.dot ?? ''};flex:none`)}></span>
                {txt(v.hs?.text)}
              </span>
            </button>
          </div>
  </>);
}
