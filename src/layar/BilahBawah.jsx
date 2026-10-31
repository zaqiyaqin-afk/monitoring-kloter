// Bilah navigasi bawah dengan tombol tengah Massal.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function BilahBawah({ v }) {
  return (<>
          <div className="kaca-blur" style={css("position:absolute;bottom:0;left:0;right:0;height:76px;background:var(--nav-bg);border-top:1px solid var(--kaca-garis);box-shadow:0 -8px 24px -12px rgba(0,0,0,.35);display:grid;grid-template-columns:repeat(5,1fr);gap:2px;align-items:center;padding:0 6px 10px;box-sizing:border-box;z-index:3")}>
            {arr(v.tabs).map((t, i0) => (<React.Fragment key={i0}>
              {t?.fab ? (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:0;background:transparent;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:var(--color-text);cursor:pointer;padding:0`)}>
                  <span className="mk-fab" style={css(`width:56px;height:56px;margin-top:-28px;border-radius:50%;display:grid;place-items:center;background:var(--emas-isi);color:${t?.fg ?? ''};outline:3px solid var(--nav-bg);box-shadow:0 0 0 2px ${t?.ring ?? ''}`)}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  </span>
                  {txt(t?.l)}
                </button>
              ) : (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:1px solid ${t?.bg && t.bg !== 'transparent' ? 'var(--kaca-garis)' : 'transparent'};height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:${t?.fg ?? ''};cursor:pointer;border-radius:16px;background-color:${t?.bg ?? ''}`)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  {txt(t?.l)}
                </button>
              )}
            </React.Fragment>))}
          </div>
  </>);
}
