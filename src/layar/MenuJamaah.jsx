// Menu Jamaah: daftar semua jamaah dan jamaah khusus.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuJamaah({ v }) {
  return (<>
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:14px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                    Jamaah
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    {txt(v.jl?.count)}{" "}jamaah ·{" "}{txt(v.jl?.scope)}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:flex;gap:6px;background:var(--color-surface);border-radius:999px;padding:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                  {arr(v.jk?.segs).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:44px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                      {txt(m?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <input className="input" type="search" aria-label="Cari jamaah" value={v.jl?.q ?? ''} onChange={v.onQuery} placeholder="Cari nama, nomor porsi, atau pendamping" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                {v.jk?.isAll ? (<>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {" "}
                    {arr(v.jl?.filters).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:44px;padding:0 14px;box-shadow:inset 0 0 0 1px var(--color-divider);font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};display:flex;gap:6px;align-items:center`)}>
                        {txt(c?.l)}
                        <span style={css("font-weight:800;opacity:.8")}>
                          {txt(c?.n)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:6px")}>
                    {" "}
                    {arr(v.jl?.rs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`width:100%;aspect-ratio:1;min-height:44px;max-width:48px;justify-self:center;padding:0;border-radius:50%;border:0;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  {v.jl?.showG ? (<>
                    {" "}
                    <div style={css("display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px")}>
                      {" "}
                      {arr(v.jl?.gs).map((c, i0) => (<React.Fragment key={i0}>
                        <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                          {txt(c?.l)}
                        </button>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  <div className="kaca" style={css("border-radius:22px;padding:2px 16px")}>
                    {" "}
                    {arr(v.jl?.rows).map((j, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <button type="button" className="ketuk" onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;padding:11px 0;min-height:48px;border-bottom:1px solid var(--color-divider)")}>
                        <div aria-hidden="true" style={css(`width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:13px;background:${j?.avBg ?? ''};color:${j?.avFg ?? ''}`)}>
                          {txt(j?.ini)}
                        </div>
                        {" "}
                        <div style={css("flex:1;min-width:0")}>
                          {" "}
                          <div style={css("display:flex;gap:6px;align-items:center;min-width:0")}>
                            <span style={css("font-weight:600;font-size:calc(14.5px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {txt(j?.name)}
                            </span>
                            {j?.risti ? (<>
                              <span style={css("flex:none;font-size:calc(13px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:2px 7px;border-radius:999px;background:var(--red-600);color:var(--on-red)")}>
                                RISTI
                              </span>
                            </>) : null}
                          </div>
                          {" "}
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(j?.sub)}
                          </div>
                          {" "}
                          {j?.hasNote ? (<>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--red-700);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {txt(j?.note)}
                            </div>
                          </>) : null}
                          {" "}
                        </div>
                        {" "}
                        <span style={css(`flex:none;font-size:calc(13px*var(--fs,1));padding:3px 10px;border-radius:999px;background:${j?.tagBg ?? ''};color:${j?.tagFg ?? ''}`)}>
                          {txt(j?.tag)}
                        </span>
                      </button>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                    {v.jl?.empty ? (<>
                      <div style={css("padding:28px 0;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                        Tidak ada jamaah yang cocok.
                      </div>
                    </>) : null}
                    {" "}
                  </div>
                  {" "}
                  {v.jl?.trunc ? (<>
                    <div style={css("text-align:center;font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                      Menampilkan 40 dari{" "}{txt(v.jl?.count)}{" "}· pilih rombongan untuk mempersempit
                    </div>
                  </>) : null}
                  {" "}
                </>) : null}
                {" "}
                {v.jk?.isKh ? (<>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.jk?.chips).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:44px;padding:0 12px;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''};display:flex;gap:6px;align-items:center`)}>
                        {txt(c?.l)}
                        <span style={css("opacity:.75")}>
                          {txt(c?.n)}
                        </span>
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                  {v.jk?.empty ? (<>
                    <div style={css("background:var(--color-surface);border-radius:22px;padding:24px 16px;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                      Tidak ada jamaah yang cocok. Tandai lansia atau kursi roda dari detail jamaah.
                    </div>
                  </>) : null}
                  {" "}
                  {arr(v.jk?.groups).map((g, i0) => (<React.Fragment key={i0}>
                    {" "}
                    <div style={css("display:grid;gap:6px")}>
                      {" "}
                      <div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:0 4px")}>
                        <div>
                          <div style={css("font-weight:800;font-size:calc(15.5px*var(--fs,1))")}>
                            {txt(g?.title)}
                          </div>
                          <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(g?.sub)}
                          </div>
                        </div>
                        <span style={css("font-size:calc(12.5px*var(--fs,1));font-weight:700;color:var(--color-accent)")}>
                          {txt(g?.n)}
                        </span>
                      </div>
                      {" "}
                      <div className="kaca" style={css("border-radius:22px;padding:2px 14px")}>
                        {" "}
                        {arr(g?.rows).map((r, i1) => (<React.Fragment key={i1}>
                          {" "}
                          <button onClick={r?.on} style={css("width:100%;border:0;background:transparent;text-align:left;cursor:pointer;font:inherit;color:inherit;display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid var(--color-divider)")}>
                            {" "}
                            <span style={css(`width:40px;height:40px;border-radius:13px;flex:none;display:grid;place-items:center;font-weight:800;font-size:13px;background:${r?.avBg ?? ''};color:${r?.avFg ?? ''}`)}>
                              {txt(r?.ini)}
                            </span>
                            {" "}
                            <span style={css("flex:1;min-width:0;display:block")}>
                              <span style={css("display:block;font-weight:700;font-size:calc(14.5px*var(--fs,1))")}>
                                {txt(r?.name)}
                              </span>
                              {" "}
                              <span style={css("display:flex;flex-wrap:wrap;gap:4px;margin-top:4px")}>
                                {arr(r?.tags).map((x, i2) => (<React.Fragment key={i2}>
                                  <span style={css(`font-size:calc(11.5px*var(--fs,1));font-weight:700;padding:1px 8px;border-radius:999px;background:${x?.bg ?? ''};color:${x?.fg ?? ''}`)}>
                                    {txt(x?.t)}
                                  </span>
                                </React.Fragment>))}
                              </span>
                              {" "}
                              <span style={css(`display:flex;align-items:center;gap:6px;margin-top:6px;font-size:calc(12.5px*var(--fs,1));font-weight:600;color:${r?.pendFg ?? ''}`)}>
                                <span style={css(`width:20px;height:20px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(9.5px*var(--fs,1));font-weight:800;background:${r?.pendBg ?? ''};color:${r?.pendIc ?? ''}`)}>
                                  {txt(r?.pendIni)}
                                </span>
                                {txt(r?.pend)}
                              </span>
                            </span>
                            {" "}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={css("flex:none;margin-top:10px")}>
                              <path d="M9 6l6 6-6 6" />
                            </svg>
                            {" "}
                          </button>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                </>) : null}
                {" "}
              </div>
              {" "}
  </>);
}
