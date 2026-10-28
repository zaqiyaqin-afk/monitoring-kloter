// Menu Badal: jamaah udzur dan pelaksana badal.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuBadal({ v }) {
  return (<>
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:14px")}>
                {" "}
                <div style={css("display:flex;justify-content:space-between;align-items:flex-end;gap:10px")}>
                  <div>
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                      Badal Jumroh
                    </div>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                      {txt(v.bd?.n)}{" "}jamaah dibadalkan · 10–13 Dzulhijjah
                    </div>
                  </div>
                  {" "}
                  {v.bd?.isJ ? (<>
                    <button onClick={v.bd?.onAdd} style={css("flex:none;border:0;border-radius:999px;min-height:44px;padding:0 14px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:var(--color-accent-100);color:var(--color-accent-800)")}>
                      + Tambah
                    </button>
                  </>) : null}
                </div>
                {" "}
                {v.bd?.notHaji ? (<>
                  <div style={css("background:var(--color-surface);border-radius:22px;padding:18px;display:grid;gap:10px;font-size:calc(14px*var(--fs,1));line-height:1.45")}>
                    Badal jumroh hanya ada di mode Haji.
                    <button className="btn btn-primary" onClick={v.bd?.toHaji} style={css("height:46px")}>
                      Pindah ke mode Haji
                    </button>
                  </div>
                </>) : null}
                {" "}
                <div style={css("display:flex;gap:6px;background:var(--color-surface);border-radius:999px;padding:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                  {arr(v.bd?.segs).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:44px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                      {txt(m?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <input className="input" type="search" aria-label="Cari jamaah atau pelaksana" value={v.bd?.q ?? ''} onChange={v.bd?.onQ} placeholder="Cari jamaah atau pelaksana" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                <div style={css("display:flex;gap:6px;overflow-x:auto;scrollbar-width:none")}>
                  {arr(v.bd?.days).map((d, i0) => (<React.Fragment key={i0}>
                    <button onClick={d?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${d?.bg ?? ''};color:${d?.fg ?? ''};box-shadow:inset 0 0 0 1px var(--color-divider)`)}>
                      {txt(d?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <div style={css("background:var(--hero);border-radius:24px;padding:16px 18px;color:#fff;display:grid;gap:8px;box-shadow:0 14px 26px -18px rgba(14,92,64,.9)")}>
                  {" "}
                  <div style={css("font-size:calc(12.5px*var(--fs,1));font-weight:700;opacity:.88")}>
                    Badal ·{" "}{txt(v.bd?.dayLbl)}
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:baseline;gap:8px")}>
                    <span style={css("font-weight:800;font-size:calc(32px*var(--fs,1));line-height:1")}>
                      {txt(v.bd?.done)}
                    </span>
                    <span style={css("font-weight:700;opacity:.9")}>
                      /{" "}{txt(v.bd?.tot)}{" "}sudah dibadalkan ·{" "}{txt(v.bd?.pct)}
                    </span>
                  </div>
                  {" "}
                  <div style={css("height:8px;border-radius:99px;background:rgba(255,255,255,.22);overflow:hidden")}>
                    <div style={css(`height:100%;width:${v.bd?.pct ?? ''};background:var(--color-surface);border-radius:99px`)}></div>
                  </div>
                  {" "}
                </div>
                {" "}
                {v.bd?.isJ ? (<>
                  {" "}
                  {v.bd?.empty ? (<>
                    <div style={css("background:var(--color-surface);border-radius:22px;padding:24px 16px;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                      Belum ada jamaah yang dibadalkan. Jamaah udzur otomatis masuk; lainnya lewat “+ Tambah”.
                    </div>
                  </>) : null}
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:2px 14px")}>
                    {" "}
                    {arr(v.bd?.rows).map((r, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid var(--color-divider)")}>
                        {" "}
                        <button type="button" tabIndex={-1} aria-hidden="true" onClick={r?.on} style={css("width:44px;height:44px;border:0;padding:0;border-radius:13px;flex:none;display:grid;place-items:center;font:800 calc(13px*var(--fs,1)) var(--font-body);background:var(--color-accent-2-100);color:var(--color-accent-2-700)")}>
                          {txt(r?.ini)}
                        </button>
                        <div style={css("flex:1;min-width:0")}>
                          <button type="button" className="ketuk" onClick={r?.on} style={css("display:block;min-height:44px")}>
                            <div style={css("display:flex;gap:6px;align-items:center;flex-wrap:wrap")}>
                              <span style={css("font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                                {txt(r?.name)}
                              </span>
                              <span style={css(`font-size:calc(11.5px*var(--fs,1));font-weight:700;padding:1px 8px;border-radius:999px;background:${r?.tagBg ?? ''};color:${r?.tagFg ?? ''}`)}>
                                {txt(r?.tag)}
                              </span>
                            </div>
                            <div style={css(`font-size:calc(12.5px*var(--fs,1));color:${r?.subFg ?? ''};margin-top:2px;line-height:1.35`)}>
                              {txt(r?.sub)}
                            </div>
                          </button>
                          <div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:8px")}>
                            {arr(r?.days).map((d, i1) => (<React.Fragment key={i1}>
                              <button type="button" onClick={d?.on} style={css(`border:0;border-radius:10px;min-height:44px;font:800 calc(12px*var(--fs,1)) var(--font-body);background:${d?.bg ?? ''};color:${d?.fg ?? ''}`)}>
                                {txt(d?.l)}
                              </button>
                            </React.Fragment>))}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <div style={css("position:sticky;bottom:10px;z-index:2")}>
                    <button onClick={v.bd?.onFab} style={css(`width:100%;height:52px;border:0;border-radius:999px;color:${String(v.bd?.fabBg).includes('neutral') ? 'var(--color-neutral-800)' : 'var(--on-emas)'};font:800 calc(15px*var(--fs,1)) var(--font-body);background:${v.bd?.fabBg ?? ''};box-shadow:var(--shadow-lg)`)}>
                      {txt(v.bd?.fab)}
                    </button>
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.bd?.isP ? (<>
                  {" "}
                  {arr(v.bd?.groups).map((g, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:12px 16px")}>
                      {" "}
                      <div style={css("display:flex;align-items:center;gap:12px")}>
                        <span style={css(`width:40px;height:40px;border-radius:13px;flex:none;display:grid;place-items:center;font-weight:800;font-size:13px;background:${g?.icBg ?? ''};color:${g?.icFg ?? ''}`)}>
                          {txt(g?.ini)}
                        </span>
                        <div style={css("flex:1;min-width:0")}>
                          <div style={css("font-weight:800;font-size:calc(14.5px*var(--fs,1))")}>
                            {txt(g?.name)}
                          </div>
                          <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.35")}>
                            {txt(g?.role)}
                          </div>
                        </div>
                        <span style={css("font-weight:800;font-size:calc(18px*var(--fs,1));color:var(--color-accent-2-700)")}>
                          {txt(g?.n)}
                        </span>
                      </div>
                      {" "}
                      <div style={css("margin-top:8px;display:grid")}>
                        {" "}
                        {arr(g?.items).map((i, i1) => (<React.Fragment key={i1}>
                          <button onClick={i?.on} style={css("border:0;background:transparent;font:inherit;color:inherit;cursor:pointer;display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-top:1px solid var(--color-divider);font-size:calc(13.5px*var(--fs,1));text-align:left")}>
                            <span>
                              {txt(i?.name)}{" "}
                              <span style={css("color:var(--color-neutral-700)")}>
                                ·{" "}{txt(i?.sub)}
                              </span>
                            </span>
                            <b style={css(`color:${i?.stFg ?? ''};flex:none`)}>
                              {txt(i?.st)}
                            </b>
                          </button>
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                  <div style={css("background:var(--color-accent-2-100);border-radius:18px;padding:12px 14px;font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-accent-2-700)")}>
                    <b>
                      Aturan:
                    </b>
                    {" "}semua jamaah boleh menjadi pelaksana dan melontar untuk dirinya sendiri serta jamaah yang dibadalkan pada waktu yang sama.
                  </div>
                  {" "}
                </>) : null}
                {" "}
              </div>
              {" "}
  </>);
}
