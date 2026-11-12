// Menu Rekap kegiatan.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuRekap({ v }) {
  return (<>
              <div style={css("padding:12px 12px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:12px")}>
                <div style={css("background:var(--color-surface);border-radius:20px;padding:16px;display:grid;gap:12px")}>
                  <div style={css("display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap")}>
                    <span style={css("font-size:calc(12.5px*var(--fs,1));color:var(--teks-3)")}>{txt(v.rk?.sub)}</span>
                    {v.rk?.due ? <span className="mk-lencana mk-lencana-merah" style={css("padding-left:8px")}>Saatnya rekap</span> : null}
                  </div>
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:8px")}>
                    <button className="btn btn-secondary" onClick={v.openWa} style={css("min-height:48px;font-size:calc(14px*var(--fs,1))")}>Teks WhatsApp</button>
                    <button className="btn btn-secondary" onClick={v.goRekapPdf} style={css("min-height:48px;font-size:calc(14px*var(--fs,1))")}>PDF rekap</button>
                  </div>
                  <span style={css("font-size:calc(13.5px*var(--fs,1));font-weight:500")}>Ingatkan saya pukul (WAS)</span>
                  <div style={css("display:flex;gap:8px;flex-wrap:wrap")}>
                    {arr(v.rk?.hours).map((c, i0) => { const a = String(c?.bg).includes('--color-accent)'); return (
                      <button key={i0} onClick={c?.on} aria-pressed={a} style={css(`border:1px solid ${a ? 'var(--color-accent)' : 'var(--m-tepi)'};border-radius:22px;min-width:56px;min-height:44px;padding:0 12px;font:${a ? 600 : 400} calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${a ? 'var(--color-accent)' : 'var(--color-surface)'};color:${a ? 'var(--on-accent)' : 'var(--color-text)'}`)}>{txt(c?.l)}</button>
                    ); })}
                  </div>
                  {v.rk?.canNotif ? <button className="btn btn-secondary" onClick={v.askNotif} style={css("justify-self:start;font-size:calc(13px*var(--fs,1));min-height:44px")}>Aktifkan notifikasi pengingat di HP ini</button> : null}
                </div>
                {v.rkp?.complete ? (<>
                  {" "}
                  <div className="mk-gradasi" style={css("border-radius:20px;padding:16px;display:flex;gap:14px;align-items:center")}>
                    {" "}
                    <div style={css("width:56px;height:56px;border-radius:50%;background:var(--color-surface);flex:none;display:grid;place-items:center")}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </div>
                    {" "}
                    <div style={css("min-width:0")}>
                      <div style={css("font-weight:500;font-size:calc(16px*var(--fs,1));line-height:1.15")}>
                        Alhamdulillah,{" "}{txt(v.rkp?.n)}{" "}tuntas
                      </div>
                      <div style={css("font-size:calc(13.5px*var(--fs,1));margin-top:3px")}>
                        Seluruh{" "}{txt(v.rkp?.tot)}{" "}jamaah sudah tercatat.
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <div className="kaca" style={css("border-radius:20px;padding:18px;display:grid;gap:14px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    {txt(v.rkp?.n)}
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px")}>
                    <span style={css("font-weight:300;font-size:calc(28px*var(--fs,1));line-height:1")}>
                      {txt(v.rkp?.done)}
                    </span>
                    <span style={css("font-size:calc(17px*var(--fs,1));font-weight:600;color:var(--color-text)")}>
                      dari{" "}{txt(v.rkp?.tot)}{" "}·{" "}{txt(v.rkp?.pct)}
                    </span>
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:center;gap:16px")}>
                    {" "}
                    <div style={css("position:relative;width:124px;height:124px;flex:none")}>
                      {" "}
                      <div style={css(`position:absolute;inset:0;border-radius:50%;background:conic-gradient(${v.rkp?.cg ?? ''});-webkit-mask:radial-gradient(farthest-side,transparent 63%,#000 64%);mask:radial-gradient(farthest-side,transparent 63%,#000 64%)`)}></div>
                      {" "}
                      <div style={css("position:absolute;inset:0;display:grid;place-content:center;text-align:center;line-height:1.1")}>
                        <div style={css("font-weight:600;font-size:calc(22px*var(--fs,1))")}>
                          {txt(v.rkp?.pct)}
                        </div>
                        <div style={css("font-size:calc(12px*var(--fs,1));color:var(--teks-3);font-weight:600")}>
                          selesai
                        </div>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={css("flex:1;min-width:0;display:grid;gap:8px")}>
                      {" "}
                      {arr(v.rkp?.legend).map((l, i0) => (<React.Fragment key={i0}>
                        <div style={css("display:flex;align-items:center;gap:8px;font-size:calc(13.5px*var(--fs,1))")}>
                          <span style={css(`width:10px;height:10px;border-radius:50%;background:${l?.c ?? ''};flex:none`)}></span>
                          <span style={css("flex:1;min-width:0")}>
                            {txt(l?.l)}
                          </span>
                          <b>
                            {txt(l?.n)}
                          </b>
                        </div>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  {v.rkp?.hasPil ? (<>
                    <div style={css("font-size:calc(13.5px*var(--fs,1));font-weight:600;color:var(--color-text);line-height:1.45")}>
                      {txt(v.rkp?.pilTxt)}
                    </div>
                  </>) : null}
                  {" "}
                  {v.rkp?.hasUmr ? (<>
                    <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px")}>
                      {arr(v.rkp?.umr).map((u, i0) => (<React.Fragment key={i0}>
                        <div style={css(`background:${u?.bg ?? ''};border-radius:18px;padding:10px 12px`)}>
                          <div style={css(`font-weight:500;font-size:calc(16px*var(--fs,1));color:${u?.fg ?? ''}`)}>
                            {txt(u?.n)}
                          </div>
                          <div style={css(`font-size:calc(13px*var(--fs,1));color:${u?.fg ?? ''};font-weight:600;line-height:1.25`)}>
                            {txt(u?.l)}
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div className="kaca" style={css("border-radius:20px;padding:18px 16px 14px")}>
                  {" "}
                  <div style={css("padding:0 2px")}>
                    <div style={css("font-weight:500;font-size:calc(16px*var(--fs,1))")}>
                      Grafik rombongan
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--teks-3);margin-top:2px")}>
                      Persen selesai · ketuk batang untuk checklist
                    </div>
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:stretch;gap:6px;height:170px;margin-top:12px")}>
                    {" "}
                    {arr(v.rkp?.bars).map((b, i0) => (<React.Fragment key={i0}>
                      <button onClick={b?.on} aria-label={b?.aria} style={css("flex:1;min-width:0;border:0;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:0;font:inherit")}>
                        <span style={css(`font-size:calc(11px*var(--fs,1));font-weight:600;color:${b?.fg ?? ''}`)}>
                          {txt(b?.t)}
                        </span>
                        <span style={css(`width:100%;max-width:28px;height:${b?.h ?? ''};background:${b?.c ?? ''};border-radius:9px 9px 6px 6px`)}></span>
                        <span style={css("font-size:calc(12px*var(--fs,1));font-weight:500;color:var(--teks-3)")}>
                          {txt(b?.l)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="kaca" style={css("border-radius:20px;padding:18px 16px 8px")}>
                  {" "}
                  <div style={css("padding:0 2px 8px")}>
                    <div style={css("font-weight:500;font-size:calc(16px*var(--fs,1))")}>
                      Per rombongan
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--teks-3);margin-top:2px")}>
                      Terendah di atas · merah bila di bawah 70%
                    </div>
                  </div>
                  {" "}
                  {arr(v.rkp?.rombs).map((r, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <button onClick={r?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:grid;gap:6px;padding:9px 2px;min-height:44px;border-top:1px solid var(--color-divider)")}>
                      {" "}
                      <div style={css("display:flex;justify-content:space-between;gap:8px;font-size:calc(13.5px*var(--fs,1))")}>
                        <span style={css(`font-weight:500;color:${r?.fg ?? ''}`)}>
                          {txt(r?.l)}{" "}
                          <span style={css("font-weight:500;color:var(--teks-3)")}>
                            ·{" "}{txt(r?.ketua)}
                          </span>
                        </span>
                        <span style={css(`font-weight:600;color:${r?.fg ?? ''}`)}>
                          {txt(r?.txt)}
                        </span>
                      </div>
                      {" "}
                      <div style={css("height:10px;border-radius:99px;background:var(--color-neutral-200);overflow:hidden")}>
                        <div style={css(`width:${r?.pct ?? ''};height:100%;border-radius:99px;background:${r?.col ?? ''}`)}></div>
                      </div>
                      {" "}
                    </button>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                </div>
                {" "}
                <div className="kaca" style={css("border-radius:20px;padding:18px 16px 8px")}>
                  {" "}
                  <div style={css("padding:0 2px 8px")}>
                    <div style={css("font-weight:500;font-size:calc(16px*var(--fs,1))")}>
                      Perlu perhatian
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--teks-3);margin-top:2px")}>
                      {txt(v.rkp?.attSub)}
                    </div>
                  </div>
                  {" "}
                  {arr(v.rkp?.att).map((a, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <button onClick={a?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 2px;min-height:60px;border-top:1px solid var(--color-divider)")}>
                      {" "}
                      <div style={css(`width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:500;font-size:13px;background:var(--color-neutral-200);color:var(--color-text)`)}>
                        {txt(a?.ini)}
                      </div>
                      {" "}
                      <div style={css("flex:1;min-width:0")}>
                        <div style={css("font-weight:600;font-size:calc(14.5px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                          {txt(a?.name)}
                        </div>
                        <div style={css("font-size:calc(13px*var(--fs,1));color:var(--teks-3)")}>
                          {txt(a?.sub)}
                        </div>
                      </div>
                      {" "}
                      {/red/.test(String(a?.tagBg)) ? (
                        <span className="mk-lencana mk-lencana-merah" style={css("flex:none")}>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
                          {txt(a?.tag)}
                        </span>
                      ) : <span className="mk-lencana" style={css("flex:none")}>{txt(a?.tag)}</span>}
                      {" "}
                    </button>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                  {v.rkp?.attEmpty ? (<>
                    <div style={css("padding:14px 2px 18px;font-size:calc(14px*var(--fs,1));color:var(--teks-3)")}>
                      Tidak ada jamaah tertinggal atau susulan.
                    </div>
                  </>) : null}
                  {" "}
                  {v.rkp?.attMore ? (<>
                    <div style={css("padding:10px 2px 14px;font-size:calc(13px*var(--fs,1));color:var(--teks-3);border-top:1px solid var(--color-divider)")}>
                      {txt(v.rkp?.attMoreTxt)}
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                {v.rkp?.hasBl ? (<>
                  {" "}
                  <div className="kaca" style={css("border-radius:20px;padding:18px 16px 8px")}>
                    {" "}
                    <div style={css("padding:0 2px 8px")}>
                      <div style={css("font-weight:500;font-size:calc(16px*var(--fs,1))")}>
                        Badal Jumroh
                      </div>
                      <div style={css("font-size:calc(13px*var(--fs,1));color:var(--teks-3);margin-top:2px")}>
                        {txt(v.rkp?.blSub)}
                      </div>
                    </div>
                    {" "}
                    {v.rkp?.hasBlWarn ? (<>
                      <div style={css("background:var(--red-100);color:var(--red-800);border-radius:16px;padding:10px 12px;font-size:calc(13px*var(--fs,1));font-weight:500;line-height:1.4;margin-bottom:6px")}>
                        {txt(v.rkp?.blWarn)}
                      </div>
                    </>) : null}
                    {" "}
                    {arr(v.rkp?.bl).map((b, i0) => (<React.Fragment key={i0}>
                      <button onClick={b?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:grid;gap:2px;padding:10px 2px;min-height:52px;border-top:1px solid var(--color-divider)")}>
                        <div style={css("font-weight:600;font-size:calc(14.5px*var(--fs,1))")}>
                          {txt(b?.name)}{" "}→{" "}{txt(b?.pel)}
                        </div>
                        <div style={css(`font-size:calc(13px*var(--fs,1));color:${b?.fg ?? ''}`)}>
                          {txt(b?.sub)}
                        </div>
                      </button>
                    </React.Fragment>))}
                    {" "}
                    {v.rkp?.blMore ? (<>
                      <div style={css("padding:10px 2px 14px;font-size:calc(13px*var(--fs,1));color:var(--teks-3);border-top:1px solid var(--color-divider)")}>
                        {txt(v.rkp?.blMoreTxt)}
                      </div>
                    </>) : null}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <div style={css("position:sticky;bottom:10px;z-index:2;display:grid;grid-template-columns:3fr 2fr;gap:8px")}>
                  {" "}
                  <button className="btn btn-primary" onClick={v.shareCard} style={css("height:52px;font-size:calc(15px*var(--fs,1))")}>
                    Bagikan kartu
                  </button>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.copyWa} style={css("height:52px;font-size:calc(15px*var(--fs,1));background:var(--color-surface)")}>
                    {txt(v.copyLabel)}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
  </>);
}
