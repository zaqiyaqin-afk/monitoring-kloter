import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';
import HomeAtas, { HomeKepala } from '../HomeAtas.jsx';

export default function MenuBeranda({ v }) {
  return (<>
              <HomeKepala h={v.home} v={v} />
              <div className="mk-kolom" style={css("padding:14px 12px 24px;grid-auto-rows:max-content;gap:14px")}>
                {v.modeCoba ? (
                  <div role="status" className="mk-penuh" style={css("border-radius:20px;padding:16px;display:grid;gap:10px;background:var(--m-kartu);color:var(--m-teks);border:1px solid var(--m-tepi)")}>
                    <div style={css("font-size:calc(14px*var(--fs,1));line-height:1.45")}>
                      <b>Mode coba · data contoh.</b> Silakan mencentang, mencatat, dan mencoba unggah Excel. Tidak ada yang dikirim ke server; data kloter asli tidak berubah.
                    </div>
                    <button className="btn btn-primary" onClick={v.selesaiCoba} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>Selesai mencoba</button>
                  </div>
                ) : null}
                {v.kloterKosong ? (
                  <div className="mk-penuh" style={css("border-radius:20px;padding:16px;display:grid;gap:10px;background:var(--m-kartu);color:var(--m-teks);border:1px solid var(--m-tepi)")}>
                    <div style={css("font-size:calc(14px*var(--fs,1));line-height:1.45")}>
                      <b>Data jamaah {txt(v.kloterLabel)} belum ada.</b> Unggah file Excel daftar jamaah di Profil, bagian Excel data jamaah. Belum siap? Coba dulu aplikasinya dengan data contoh.
                    </div>
                    <button className="btn btn-primary" onClick={v.keUnggah} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>Unggah Excel data jamaah</button>
                    <button className="btn btn-secondary" onClick={v.mulaiCoba} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>Coba dulu dengan data contoh</button>
                  </div>
                ) : null}
                <HomeAtas h={v.home} />
                {v.net ? (
                  <button onClick={v.openSync} className="mk-penuh" style={css(`border:0;text-align:left;cursor:pointer;font:inherit;display:flex;gap:12px;align-items:flex-start;border-radius:20px;padding:12px 14px;background:${v.net.bg};color:${v.net.fg}`)}>
                    <span style={css(`width:10px;height:10px;border-radius:50%;margin-top:5px;flex:none;background:${v.net.dot}`)}></span>
                    <span style={css("display:grid;gap:2px;min-width:0")}>
                      <b style={css("font-size:calc(14px*var(--fs,1))")}>{txt(v.net.title)}</b>
                      <span style={css("font-size:calc(12.5px*var(--fs,1));line-height:1.4")}>{txt(v.net.text)}</span>
                    </span>
                  </button>
                ) : null}
                {v.canInstall ? (
                  <button onClick={v.doInstall} className="btn btn-secondary mk-penuh" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")}>
                    Pasang aplikasi di layar utama HP
                  </button>
                ) : null}
              </div>
              {" "}
  </>);
}
