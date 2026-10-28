// Menu Rekap kegiatan.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuRekap({ v }) {
  return (<>
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:16px")}>
                <div style={css(`background:${v.rk?.bg ?? ''};border-radius:28px;padding:18px;display:grid;gap:12px;box-shadow:inset 0 0 0 ${v.rk?.ring ?? ''}`)}>
                  {" "}
                  <div style={css("display:flex;justify-content:space-between;align-items:flex-start;gap:10px")}>
                    {" "}
                    <div style={css("min-width:0")}>
                      <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1));line-height:1.15")}>
                        Rekap harian
                      </div>
                      <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:3px")}>
                        {txt(v.rk?.sub)}
                      </div>
                    </div>
                    {" "}
                    {v.rk?.due ? (<>
                      <span style={css("flex:none;font-size:calc(13px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:5px 10px;border-radius:999px;background:var(--red-600);color:var(--on-red)")}>
                        SAATNYA REKAP
                      </span>
                    </>) : null}
                    {" "}
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:8px")}>
                    {" "}
                    <button className="btn btn-primary" onClick={v.openWa} style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")}>
                      Teks WhatsApp
                    </button>
                    {" "}
                    <button className="btn btn-secondary" onClick={v.goRekapPdf} style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")}>
                      PDF rekap
                    </button>
                    {" "}
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap")}>
                    {" "}
                    <span style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                      Ingatkan saya pukul (WAS)
                    </span>
                    {" "}
                    <div style={css("display:flex;gap:4px")}>
                      {" "}
                      {arr(v.rk?.hours).map((c, i0) => (<React.Fragment key={i0}>
                        <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-width:44px;min-height:44px;padding:0 10px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                          {txt(c?.l)}
                        </button>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  {v.rk?.canNotif ? (<>
                    <button className="btn btn-ghost" onClick={v.askNotif} style={css("justify-self:start;font-size:calc(13px*var(--fs,1));min-height:44px;padding:0")}>
                      Aktifkan notifikasi pengingat di HP ini
                    </button>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                    Rekap
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    {txt(v.rkp?.sub)}
                  </div>
                  {" "}
                </div>
                {" "}
                {v.rkp?.complete ? (<>
                  {" "}
                  <div style={css("background:var(--hero);color:#fff;border-radius:24px;padding:18px;display:flex;gap:14px;align-items:center;box-shadow:0 14px 26px -18px rgba(14,92,64,.9)")}>
                    {" "}
                    <div style={css("width:56px;height:56px;border-radius:50%;background:var(--color-surface);flex:none;display:grid;place-items:center")}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </div>
                    {" "}
                    <div style={css("min-width:0")}>
                      <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1));line-height:1.15")}>
                        Alhamdulillah,{" "}{txt(v.rkp?.n)}{" "}tuntas
                      </div>
                      <div style={css("font-size:calc(13.5px*var(--fs,1));margin-top:3px;color:var(--color-accent-100)")}>
                        Seluruh{" "}{txt(v.rkp?.tot)}{" "}jamaah sudah tercatat.
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:18px;display:grid;gap:14px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    {txt(v.rkp?.n)}
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px")}>
                    <span style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(24px*var(--fs,1));line-height:1")}>
                      {txt(v.rkp?.done)}
                    </span>
                    <span style={css("font-size:calc(17px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
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
                        <div style={css("font-weight:800;font-size:calc(22px*var(--fs,1))")}>
                          {txt(v.rkp?.pct)}
                        </div>
                        <div style={css("font-size:calc(12px*var(--fs,1));color:var(--color-neutral-700);font-weight:600")}>
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
                    <div style={css("font-size:calc(13.5px*var(--fs,1));font-weight:600;color:var(--color-neutral-800);line-height:1.45")}>
                      {txt(v.rkp?.pilTxt)}
                    </div>
                  </>) : null}
                  {" "}
                  {v.rkp?.hasUmr ? (<>
                    <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px")}>
                      {arr(v.rkp?.umr).map((u, i0) => (<React.Fragment key={i0}>
                        <div style={css(`background:${u?.bg ?? ''};border-radius:18px;padding:10px 12px`)}>
                          <div style={css(`font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1));color:${u?.fg ?? ''}`)}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:18px 16px 14px")}>
                  {" "}
                  <div style={css("padding:0 2px")}>
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1))")}>
                      Grafik rombongan
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                      Persen selesai · ketuk batang untuk checklist
                    </div>
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:stretch;gap:6px;height:170px;margin-top:12px")}>
                    {" "}
                    {arr(v.rkp?.bars).map((b, i0) => (<React.Fragment key={i0}>
                      <button onClick={b?.on} aria-label={b?.aria} style={css("flex:1;min-width:0;border:0;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:0;font:inherit")}>
                        <span style={css(`font-size:calc(11px*var(--fs,1));font-weight:800;color:${b?.fg ?? ''}`)}>
                          {txt(b?.t)}
                        </span>
                        <span style={css(`width:100%;max-width:28px;height:${b?.h ?? ''};background:${b?.c ?? ''};border-radius:9px 9px 6px 6px`)}></span>
                        <span style={css("font-size:calc(12px*var(--fs,1));font-weight:700;color:var(--color-neutral-700)")}>
                          {txt(b?.l)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:18px 16px 8px")}>
                  {" "}
                  <div style={css("padding:0 2px 8px")}>
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1))")}>
                      Per rombongan
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                      Terendah di atas · merah bila di bawah 70%
                    </div>
                  </div>
                  {" "}
                  {arr(v.rkp?.rombs).map((r, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <button onClick={r?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:grid;gap:6px;padding:9px 2px;min-height:44px;border-top:1px solid var(--color-divider)")}>
                      {" "}
                      <div style={css("display:flex;justify-content:space-between;gap:8px;font-size:calc(13.5px*var(--fs,1))")}>
                        <span style={css(`font-weight:700;color:${r?.fg ?? ''}`)}>
                          {txt(r?.l)}{" "}
                          <span style={css("font-weight:500;color:var(--color-neutral-700)")}>
                            ·{" "}{txt(r?.ketua)}
                          </span>
                        </span>
                        <span style={css(`font-weight:800;color:${r?.fg ?? ''}`)}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:18px 16px 8px")}>
                  {" "}
                  <div style={css("padding:0 2px 8px")}>
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1))")}>
                      Perlu perhatian
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                      {txt(v.rkp?.attSub)}
                    </div>
                  </div>
                  {" "}
                  {arr(v.rkp?.att).map((a, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <button onClick={a?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 2px;min-height:60px;border-top:1px solid var(--color-divider)")}>
                      {" "}
                      <div style={css(`width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:13px;background:${a?.tagBg ?? ''};color:${a?.tagFg ?? ''}`)}>
                        {txt(a?.ini)}
                      </div>
                      {" "}
                      <div style={css("flex:1;min-width:0")}>
                        <div style={css("font-weight:600;font-size:calc(14.5px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                          {txt(a?.name)}
                        </div>
                        <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                          {txt(a?.sub)}
                        </div>
                      </div>
                      {" "}
                      <span style={css(`flex:none;font-size:calc(13px*var(--fs,1));font-weight:700;padding:2px 10px;border-radius:999px;background:${a?.tagBg ?? ''};color:${a?.tagFg ?? ''}`)}>
                        {txt(a?.tag)}
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                  {v.rkp?.attEmpty ? (<>
                    <div style={css("padding:14px 2px 18px;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                      Tidak ada jamaah tertinggal atau susulan.
                    </div>
                  </>) : null}
                  {" "}
                  {v.rkp?.attMore ? (<>
                    <div style={css("padding:10px 2px 14px;font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);border-top:1px solid var(--color-divider)")}>
                      {txt(v.rkp?.attMoreTxt)}
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                {v.rkp?.hasBl ? (<>
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:18px 16px 8px")}>
                    {" "}
                    <div style={css("padding:0 2px 8px")}>
                      <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1))")}>
                        Badal Jumroh
                      </div>
                      <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                        {txt(v.rkp?.blSub)}
                      </div>
                    </div>
                    {" "}
                    {v.rkp?.hasBlWarn ? (<>
                      <div style={css("background:var(--red-100);color:var(--red-800);border-radius:16px;padding:10px 12px;font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.4;margin-bottom:6px")}>
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
                      <div style={css("padding:10px 2px 14px;font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);border-top:1px solid var(--color-divider)")}>
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
                  <button className="btn btn-primary" onClick={v.shareCard} style={css("height:52px;font-size:calc(15px*var(--fs,1));box-shadow:var(--shadow-lg)")}>
                    Bagikan kartu
                  </button>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.copyWa} style={css("height:52px;font-size:calc(15px*var(--fs,1));background:var(--color-surface);box-shadow:var(--shadow-lg)")}>
                    {txt(v.copyLabel)}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
  </>);
}
