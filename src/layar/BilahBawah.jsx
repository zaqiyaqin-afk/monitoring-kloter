// Bilah navigasi bawah dengan tombol tengah Massal.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function BilahBawah({ v }) {
  return (<>
          <div style={css("position:absolute;bottom:0;left:0;right:0;height:76px;background:var(--nav-bg);border-top:1px solid var(--color-divider);box-shadow:0 -6px 18px -12px rgba(16,40,30,.18);display:grid;grid-template-columns:repeat(5,1fr);gap:2px;align-items:center;padding:0 6px 10px;box-sizing:border-box;z-index:3")}>
            {arr(v.tabs).map((t, i0) => (<React.Fragment key={i0}>
              {t?.fab ? (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:0;background:transparent;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:var(--color-text);cursor:pointer;padding:0`)}>
                  <span className="mk-fab" style={css(`width:58px;height:58px;margin-top:-30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#ecd08a,#c9a13c);color:${t?.fg ?? ''};outline:3px solid var(--nav-bg);box-shadow:0 0 0 2px ${t?.ring ?? ''}`)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  </span>
                  {txt(t?.l)}
                </button>
              ) : (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:0;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:${t?.fg ?? ''};cursor:pointer;border-radius:16px;background-color:${t?.bg ?? ''}`)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  {txt(t?.l)}
                </button>
              )}
            </React.Fragment>))}
          </div>
  </>);
}
