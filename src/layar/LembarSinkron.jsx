// Lembar sinkron data dan lembar profil petugas.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function LembarSinkron({ v }) {
  return (<>
          {v.hasSync ? (<>
            {" "}
            <div onClick={v.closeSync} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:6")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:16px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div style={css("display:flex;align-items:center;gap:12px")}>
                  {" "}
                  <div style={css("width:58px;height:58px;border-radius:50%;background:var(--color-surface);display:grid;place-items:center;box-shadow:0 2px 10px rgba(16,40,30,.14);flex:none")}>
                    <img src={v.logoSrc} alt="" width="40" height="40" style={css("width:40px;height:40px;display:block")} />
                  </div>
                  {" "}
                  <div style={css("min-width:0")}>
                    <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1));line-height:1.2")}>
                      {txt(v.ppihName)}
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                      {txt(v.idLine)}
                    </div>
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("background:var(--hero);border-radius:24px;padding:16px 18px;color:#fff;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;box-shadow:0 14px 26px -18px rgba(14,92,64,.9)")}>
                  {" "}
                  <div style={css("position:absolute;right:-50px;top:-60px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.08)")}></div>
                  {" "}
                  <div style={css("flex:1;min-width:0;position:relative")}>
                    <div style={css("font-size:calc(12.5px*var(--fs,1));font-weight:700;opacity:.85")}>
                      Status data ·{" "}{txt(v.syncTag)}
                    </div>
                    <div style={css("font-weight:800;font-size:calc(20px*var(--fs,1));margin-top:2px")}>
                      {txt(v.pf?.title)}
                    </div>
                    <div style={css("font-size:calc(12.5px*var(--fs,1));opacity:.9;margin-top:4px;line-height:1.4")}>
                      {txt(v.syncPending)}{" "}perubahan menunggu · terakhir{" "}{txt(v.syncLast)}
                    </div>
                  </div>
                  {" "}
                  <div style={css(`position:relative;width:66px;height:66px;flex:none;border-radius:50%;background:conic-gradient(#fff ${v.pf?.deg ?? ''}, rgba(255,255,255,.25) 0);display:grid;place-items:center`)}>
                    <div style={css("width:52px;height:52px;border-radius:50%;background:#0b3f2d;display:grid;place-content:center;text-align:center;line-height:1")}>
                      <div style={css("font-weight:800;font-size:calc(18px*var(--fs,1))")}>
                        {txt(v.syncPending)}
                      </div>
                      <div style={css("font-size:calc(11px*var(--fs,1));margin-top:2px")}>
                        antre
                      </div>
                    </div>
                  </div>
                  {" "}
                </div>
                {" "}
                {v.hasSyncErr ? (<>
                  <div style={css("background:var(--red-100);color:var(--red-800);border-radius:16px;padding:10px 12px;font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.4")}>
                    {txt(v.syncErr)}
                  </div>
                </>) : null}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:14px 16px;display:grid;gap:8px;font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-800)")}>
                  <b style={css("font-size:calc(14.5px*var(--fs,1));color:var(--color-text)")}>Cara kerja tanpa internet</b>
                  <span>• Semua centang, udzur, dan catatan langsung tersimpan di HP ini, walau tanpa sinyal.</span>
                  <span>• Begitu ada internet, data terkirim otomatis ke server. Kiriman ulang tidak tercatat dua kali.</span>
                  <span>• Jangan hapus data browser/aplikasi atau ganti HP sebelum angka “antre” menjadi 0. Bila terpaksa, pilih “Simpan cadangan” dulu.</span>
                  {v.installHint ? <span style={css("color:var(--color-accent-800);font-weight:600")}>• {txt(v.installHint)}</span> : null}
                  {v.canInstall ? (
                    <button onClick={v.doInstall} className="btn btn-secondary" style={css("height:44px;font-size:calc(14px*var(--fs,1));margin-top:4px")}>
                      Pasang aplikasi di layar utama HP
                    </button>
                  ) : null}
                </div>
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:2px 16px")}>
                  <button onClick={v.syncNow} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-accent-100);color:var(--color-accent);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 11a8 8 0 0 0-14.6-4.5L3 9M3 3.5V9h5.5M4 13a8 8 0 0 0 14.6 4.5L21 15M21 20.5V15h-5.5" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Sinkronkan sekarang
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        {txt(v.syncSource)}
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button onClick={v.bakSave} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-accent-2-100);color:var(--color-accent-2-700);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Simpan cadangan
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        File data yang belum terkirim · simpan sebelum ganti HP
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button onClick={v.bakLoad} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-accent-2-100);color:var(--color-accent-2-700);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21V9M7 14l5-5 5 5M4 5h16" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Pulihkan cadangan
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        Dari file cadangan · tidak terkirim dua kali
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button onClick={v.exportCsv} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-neutral-100);color:var(--color-accent-2-700);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Unduh CSV
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        Seluruh status checklist di perangkat ini
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button onClick={v.exportWa} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-accent-100);color:var(--color-accent);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 1-13.4 7.9L3 21l1.2-4.4A9 9 0 1 1 21 12z" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Teks WhatsApp
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        Rekap untuk grup
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  <button onClick={v.openSetup} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 0;min-height:58px;border-bottom:1px solid var(--color-divider);font:inherit;color:inherit")}>
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:var(--color-neutral-100);color:var(--color-neutral-800);flex:none")}>
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                      </svg>
                    </span>
                    <span style={css("flex:1;min-width:0;display:block")}>
                      <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                        Pengaturan
                      </span>
                      <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                        Identitas petugas, nama kloter, PIN
                      </span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none")}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px")}>
                  {" "}
                  {arr(v.syncCounts).map((c, i0) => (<React.Fragment key={i0}>
                    <div style={css("background:var(--color-surface);border-radius:18px;padding:10px 12px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                      <div style={css("font-weight:800;font-size:calc(20px*var(--fs,1));line-height:1")}>
                        {txt(c?.v)}
                      </div>
                      <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);margin-top:3px")}>
                        {txt(c?.l)}
                      </div>
                    </div>
                  </React.Fragment>))}
                  {" "}
                </div>
                {" "}
                <button onClick={v.lockNow} style={css("height:50px;border:0;border-radius:999px;background:var(--red-100);color:var(--red-700);font:800 calc(15px*var(--fs,1)) var(--font-body);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  Kunci aplikasi
                </button>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {v.hasPp ? (<>
            {" "}
            <div onClick={v.closePp} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:8")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:90%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:30px 30px 0 0;padding:12px 18px 24px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1));line-height:1.2")}>
                    {txt(v.pp?.title)}
                  </div>
                  <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);margin-top:3px;line-height:1.4")}>
                    {txt(v.pp?.sub)}
                  </div>
                </div>
                {" "}
                {v.pp?.hasSrc ? (<>
                  <div style={css("display:flex;gap:6px;background:var(--color-surface);border-radius:999px;padding:4px")}>
                    {arr(v.pp?.srcs).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:44px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {" "}
                <input className="input" type="search" aria-label="Cari petugas" value={v.pp?.q ?? ''} onChange={v.pp?.onQ} placeholder="Cari nama atau nomor porsi" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                <div style={css("background:var(--color-surface);border-radius:20px;padding:2px 14px")}>
                  {" "}
                  {arr(v.pp?.opts).map((o, i0) => (<React.Fragment key={i0}>
                    <button onClick={o?.on} style={css(`width:100%;border:0;background:${o?.bg ?? ''};text-align:left;cursor:pointer;font:inherit;color:inherit;display:flex;align-items:center;gap:12px;padding:10px 6px;border-bottom:1px solid var(--color-divider);border-radius:12px`)}>
                      <span style={css("flex:1;min-width:0;display:block")}>
                        <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                          {txt(o?.name)}
                        </span>
                        <span style={css("display:block;font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700)")}>
                          {txt(o?.sub)}
                        </span>
                      </span>
                      <span style={css(`width:28px;height:28px;border-radius:9px;flex:none;display:grid;place-items:center;color:var(--on-isi);font-weight:800;background:${o?.mbg ?? ''};box-shadow:inset 0 0 0 2px ${o?.mring ?? ''}`)}>
                        {txt(o?.mark)}
                      </span>
                    </button>
                  </React.Fragment>))}
                  {" "}
                  {v.pp?.empty ? (<>
                    <div style={css("padding:20px 0;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                      Tidak ada yang cocok.
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.closePp} style={css("height:50px")}>
                    Batal
                  </button>
                  <button onClick={v.savePp} style={css(`height:50px;border:0;border-radius:999px;color:#fff;font:800 calc(15px*var(--fs,1)) var(--font-body);cursor:pointer;background:${v.pp?.ctaBg ?? ''}`)}>
                    {txt(v.pp?.cta)}
                  </button>
                </div>
                {" "}
                {v.pp?.canDel ? (<>
                  <button className="btn btn-ghost" onClick={v.delPp} style={css("font-size:calc(13.5px*var(--fs,1));color:var(--red-700)")}>
                    Hapus pilihan saat ini
                  </button>
                </>) : null}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
  </>);
}
