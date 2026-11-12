// Menu Cetak: laporan PDF per kegiatan.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuCetak({ v }) {
  return (<>
              <div style={css("padding:12px 12px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:12px")}>
                {(() => {
                  const aktif = c => c?.a ?? /accent/.test(String(c?.bg));
                  const pil = c => `border:1px solid ${aktif(c) ? 'var(--color-accent)' : 'var(--m-tepi)'};border-radius:22px;min-height:44px;padding:0 14px;font:${aktif(c) ? 600 : 400} calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;white-space:nowrap;background:${aktif(c) ? 'var(--color-accent)' : 'var(--color-surface)'};color:${aktif(c) ? 'var(--on-accent)' : 'var(--color-text)'}`;
                  const kartu = "background:var(--color-surface);border-radius:20px;padding:16px;display:grid;gap:12px;min-width:0";
                  const judul = "font-size:calc(16px*var(--fs,1));font-weight:500";
                  const geser = "display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px";
                  return (<>
                    <div style={css(kartu + ";gap:0")}>
                      <div style={css(judul + ";margin-bottom:6px")}>Lembar</div>
                      <div role="radiogroup" aria-label="Lembar">
                        {arr(v.prSheets).map((m, i0) => (
                          <button key={i0} type="button" role="radio" aria-checked={aktif(m)} className="ketuk" onClick={m?.on} style={css(`display:flex;align-items:center;gap:12px;min-height:52px;padding:6px 0;border-top:${i0 ? '1px solid var(--color-divider)' : '0'}`)}>
                            <span aria-hidden="true" style={css(`width:22px;height:22px;border-radius:50%;flex:none;box-sizing:border-box;border:${aktif(m) ? '7px solid var(--color-accent)' : '1.5px solid var(--m-tepi)'};background:var(--color-surface)`)}></span>
                            <span style={css("flex:1;min-width:0;display:grid")}>
                              <span style={css("font-size:calc(14px*var(--fs,1))")}>{txt(m?.l)}</span>
                              <span style={css("font-size:calc(12.5px*var(--fs,1));color:var(--teks-3)")}>{txt(m?.sub)}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={css(kartu)}>
                      <div style={css(judul)}>Cakupan</div>
                      <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:4px;border-radius:26px;border:1px solid var(--m-tepi)")}>
                        {arr(v.prScopes).map((m, i0) => <button key={i0} type="button" onClick={m?.on} aria-pressed={aktif(m)} style={css(pil(m) + ";border:0;padding:0")}>{txt(m?.l)}</button>)}
                      </div>
                      {v.prIsRaud ? (<>
                        <div style={css("font-size:calc(13.5px*var(--fs,1));font-weight:500")}>Jadwal Raudhoh</div>
                        <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                          {arr(v.prSlots).map((c, i0) => <button key={i0} type="button" onClick={c?.on} aria-pressed={aktif(c)} style={css(pil(c))}>{txt(c?.l)}</button>)}
                        </div>
                      </>) : null}
                      {v.prShowR ? (
                        <div style={css(geser)}>
                          {arr(v.prRs).map((c, i0) => <button key={i0} type="button" onClick={c?.on} aria-pressed={aktif(c)} style={css(pil(c) + ";flex:none;width:44px;padding:0")}>{txt(c?.l)}</button>)}
                        </div>
                      ) : null}
                      {v.prShowG ? (
                        <div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:4px;border-radius:26px;border:1px solid var(--m-tepi)")}>
                          {arr(v.prGs).map((c, i0) => <button key={i0} type="button" onClick={c?.on} aria-pressed={aktif(c)} style={css(pil(c) + ";border:0;padding:0")}>{txt(c?.l)}</button>)}
                        </div>
                      ) : null}
                    </div>
                  </>);
                })()}
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-text)")}>
                    Pratinjau ·{" "}{txt(v.pr?.pages)}{" "}halaman A4 ·{" "}{txt(v.pr?.orientL)}
                  </div>
                  {" "}
                  <div className="kaca" style={css("border-radius:20px;padding:16px 14px;display:grid;gap:8px")}>
                    {" "}
                    <div style={css("display:flex;gap:10px;align-items:center;border-bottom:2px solid var(--color-accent);padding-bottom:8px")}>
                      {" "}
                      <div style={css("width:30px;height:30px;border-radius:9px;background:var(--color-accent);flex:none")}></div>
                      {" "}
                      <div style={css("min-width:0")}>
                        <div style={css("font-weight:600;font-size:16px;line-height:1.15")}>
                          {txt(v.pr?.title)}
                        </div>
                        <div style={css("font-size:13px;color:var(--teks-3);margin-top:2px")}>
                          {txt(v.pr?.sub)}
                        </div>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={css(`display:grid;grid-template-columns:${v.pr?.cols ?? ''};gap:0 3px;align-items:stretch;font-size:10px;font-weight:500`)}>
                      {" "}
                      <span style={css("grid-column:span 2")}></span>
                      {" "}
                      {arr(v.pr?.groups).map((g, i0) => (<React.Fragment key={i0}>
                        <span style={css(`grid-column:${g?.col ?? ''};text-align:center;background:var(--color-accent);color:#fff;border-radius:4px;padding:2px 3px;min-width:0;overflow-wrap:anywhere;hyphens:none`)}>
                          {txt(g?.label)}
                        </span>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <div style={css(`display:grid;grid-template-columns:${v.pr?.cols ?? ''};gap:0 3px;align-items:end;font-size:10px;font-weight:500;color:var(--color-text);padding:2px 0 5px;border-bottom:1.5px solid var(--color-neutral-400)`)}>
                      {" "}
                      <span>
                        No
                      </span>
                      <span>
                        Nama jamaah
                      </span>
                      {" "}
                      {arr(v.pr?.heads).map((h, i0) => (<React.Fragment key={i0}>
                        <span style={css("text-align:center;min-width:0;overflow-wrap:anywhere;hyphens:none;line-height:1.15")}>
                          {txt(h)}
                        </span>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <div style={css("display:grid")}>
                      {" "}
                      {arr(v.pr?.rows).map((w, i0) => (<React.Fragment key={i0}>
                        {" "}
                        <div style={css(`display:grid;grid-template-columns:${v.pr?.cols ?? ''};gap:0 3px;align-items:center;font-size:11px;padding:4px 0;border-bottom:1px solid var(--color-neutral-300)`)}>
                          {" "}
                          <span style={css("color:var(--teks-3)")}>
                            {txt(w?.no)}
                          </span>
                          {" "}
                          <span style={css("white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                            {txt(w?.name)}
                          </span>
                          {" "}
                          {arr(w?.cells).map((c, i1) => (<React.Fragment key={i1}>
                            <div style={css(`justify-self:center;min-width:16px;max-width:100%;height:16px;line-height:13px;padding:0 2px;border-radius:4px;box-sizing:border-box;border:1.5px solid ${c?.bd ?? ''};background:${c?.bg ?? ''};display:block;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px;font-weight:600;color:${c?.fg ?? ''}`)}>
                              {txt(c?.v)}
                            </div>
                          </React.Fragment>))}
                          {" "}
                        </div>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    {v.pr?.hasMore ? (<>
                      <div style={css("font-size:13px;color:var(--teks-3);text-align:center")}>
                        …{" "}{txt(v.pr?.more)}{" "}baris lagi
                      </div>
                    </>) : null}
                    {" "}
                    {v.pr?.hasExtra ? (<>
                      <div style={css("font-size:13px;color:var(--color-accent-700);text-align:center")}>
                        +{txt(v.pr?.extra)}{" "}kolom kegiatan lagi di hasil cetak
                      </div>
                    </>) : null}
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-text)")}>
                      <b style={css("color:var(--color-accent-700)")}>
                        ✓
                      </b>
                      {" "}selesai ·{" "}
                      <b style={css("background:var(--color-accent-2-100);color:var(--color-accent-2-800);padding:0 4px;border-radius:3px")}>
                        amber
                      </b>
                      {" "}susulan ·{" "}
                      <b>
                        S
                      </b>
                      {" "}Safari ·{" "}
                      <b>
                        M
                      </b>
                      /
                      <b>
                        T
                      </b>
                      {" "}Mabit/Tanazul ·{" "}
                      <b style={css("background:var(--color-accent-2-100);color:var(--color-accent-2-700);padding:0 4px;border-radius:3px")}>
                        B
                      </b>
                      {" "}badal · ☐ belum
                    </div>
                    {" "}
                    <div style={css("display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px;font-size:calc(13px*var(--fs,1));color:var(--color-text);text-align:center;line-height:1.25")}>
                      {" "}
                      <div style={css("display:grid;gap:22px;align-content:end")}>
                        <span>
                          Ketua Rombongan
                        </span>
                        <span style={css("border-top:1px solid var(--color-text)")}></span>
                      </div>
                      {" "}
                      <div style={css("display:grid;gap:22px;align-content:end")}>
                        <span>
                          PPIH Bimbingan Ibadah Kloter
                          <br />
                          <b>
                            {txt(v.pr?.ppih)}
                          </b>
                        </span>
                        <span style={css("border-top:1px solid var(--color-text)")}></span>
                      </div>
                      {" "}
                      <div style={css("display:grid;gap:22px;align-content:end")}>
                        <span>
                          Mengetahui,
                          <br />
                          Ketua Kloter
                        </span>
                        <span style={css("border-top:1px solid var(--color-text)")}></span>
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <button onClick={v.doPrint} style={css("width:100%;height:50px;border:0;border-radius:999px;background:var(--emas-isi);color:var(--on-emas);font:600 calc(16px*var(--fs,1)) var(--font-body);cursor:pointer;box-shadow:0 10px 24px -10px rgba(0,0,0,.5)")}>
                  Simpan PDF
                </button>
                {" "}
              </div>
              {" "}
  </>);
}
