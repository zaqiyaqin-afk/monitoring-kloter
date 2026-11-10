// Bilah navigasi bawah melayang: kapsul 6 tombol + tombol tengah Massal yang menonjol tanpa tulisan.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function BilahBawah({ v }) {
  return (
    <nav aria-label="Navigasi utama" style={css("position:absolute;left:14px;right:14px;bottom:calc(14px + env(safe-area-inset-bottom, 0px));height:66px;max-width:560px;margin:0 auto;z-index:3;pointer-events:none")}>
      <div className="kaca-blur" style={css("position:absolute;inset:0;border-radius:33px;background:var(--bb-isi);box-shadow:inset 0 0 0 1.5px var(--bb-tepi), var(--bb-bayang)")}></div>
      <div style={css(`position:relative;height:100%;display:grid;grid-template-columns:repeat(${arr(v.tabs).length || 5},minmax(0,1fr));align-items:center;padding:0 4px;box-sizing:border-box;pointer-events:auto`)}>
        {arr(v.tabs).map((t, i0) => (<React.Fragment key={i0}>
          {t?.fab ? (
            <div style={css("position:relative;height:100%;display:flex;justify-content:center")}>
              <span aria-hidden="true" style={css("position:absolute;top:-34px;width:72px;height:72px;border-radius:50%;background:var(--bb-soket)")}></span>
              <button className="mk-fab" onClick={t?.on} aria-label={t?.l} aria-current={t?.aktif ? 'page' : undefined} style={css("position:absolute;top:-30px;width:64px;height:64px;border:0;border-radius:50%;display:grid;place-items:center;padding:0;cursor:pointer")}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
              </button>
            </div>
          ) : (
            <button onClick={t?.on} aria-current={t?.aktif ? 'page' : undefined} style={css(`border:0;background:transparent;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0;cursor:pointer;color:${t?.aktif ? 'var(--bb-aktif)' : 'var(--bb-fg)'};min-width:0;white-space:nowrap;font:${t?.aktif ? 700 : 500} calc(10.5px*min(var(--fs,1),1.1)) var(--font-body)`)}>
              <span style={css(`width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:${t?.aktif ? 'var(--bb-sinar)' : 'transparent'};box-shadow:${t?.aktif ? '0 4px 18px var(--bb-sinar)' : 'none'}`)}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={t?.aktif ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
              </span>
              {txt(t?.l)}
            </button>
          )}
        </React.Fragment>))}
      </div>
    </nav>
  );
}
