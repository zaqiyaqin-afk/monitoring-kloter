// Notifikasi singkat dan dialog kirim WhatsApp.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function DialogUmum({ v }) {
  return (<>
          {v.hasToast ? (<>
            {" "}
            <div style={css(`position:absolute;left:16px;right:16px;bottom:${v.toastBottom ?? ''};background:#16232B;color:#fff;border-radius:999px;padding:8px 8px 8px 18px;min-height:44px;box-sizing:border-box;font-size:calc(13.5px*var(--fs,1));font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:10px;z-index:7`)}>
              {" "}
              <span>
                {txt(v.toastMsg)}
              </span>
              {" "}
              {v.hasUndo ? (<>
                <button onClick={v.doUndo} style={css("flex:none;border:0;border-radius:999px;height:44px;padding:0 14px;background:var(--color-accent-300);color:var(--color-accent-900);font:800 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer")}>
                  Batalkan
                </button>
              </>) : null}
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasWa ? (<>
            {" "}
            <div onClick={v.closeWa} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:9")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:90%;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:12px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                    Rekap untuk WhatsApp
                  </div>
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                    Periksa dulu, lalu salin atau kirim langsung
                  </div>
                </div>
                {" "}
                <pre style={css("margin:0;overflow:auto;background:var(--color-accent-100);border-radius:18px;padding:14px;font:500 calc(13px*var(--fs,1))/1.5 var(--font-body);white-space:pre-wrap;word-break:break-word;color:var(--color-text)")}>
                  {txt(v.waText)}
                </pre>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:8px")}>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.copyWa} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    {txt(v.copyLabel)}
                  </button>
                  {" "}
                  <a href={v.waLink} target="_blank" rel="noopener" onClick={v.markRekap} style={css("height:48px;border-radius:999px;background:var(--color-accent-600);color:var(--on-accent);font:700 calc(15px*var(--fs,1)) var(--font-body);display:flex;align-items:center;justify-content:center;text-decoration:none")}>
                    Kirim ke WhatsApp
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
  </>);
}
