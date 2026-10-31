// Lembar detail satu jamaah (udzur, pendamping, riwayat).
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';
import DataJamaah from '../DataJamaah.jsx';

export default function LembarJamaah({ v }) {
  return (<>
          {v.hasSel ? (<>
            {" "}
            <div onClick={v.closeSel} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:5")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:88%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:16px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div style={css("display:flex;gap:14px;align-items:center")}>
                  {" "}
                  <div style={css(`width:56px;height:56px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:18px;background:${v.sel?.avBg ?? ''};color:${v.sel?.avFg ?? ''}`)}>
                    {txt(v.sel?.ini)}
                  </div>
                  {" "}
                  <div style={css("min-width:0")}>
                    {" "}
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                      {txt(v.sel?.name)}
                    </div>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                      {txt(v.sel?.sub)}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:flex;gap:8px;flex-wrap:wrap;align-items:center")}>
                  {" "}
                  {v.sel?.risti ? (<>
                    <span style={css("font-size:calc(13px*var(--fs,1));font-weight:800;padding:4px 10px;border-radius:999px;background:var(--red-600);color:var(--on-red)")}>
                      RISTI · risiko tinggi
                    </span>
                  </>) : null}
                  {" "}
                  <a href={v.sel?.tel} style={css("display:flex;align-items:center;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-accent-700);text-decoration:none;background:var(--color-accent-100);border-radius:999px;min-height:44px;padding:0 14px;box-sizing:border-box")}>
                    Hubungi ·{" "}{txt(v.sel?.hp)}
                  </a>
                  {" "}
                </div>
                {" "}
                {v.sel?.mqTxt ? (
                  <button onClick={v.sel.openMq} style={css("display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;cursor:pointer;text-align:left;font:inherit;background:var(--color-accent-2-100);color:var(--color-accent-2-800);border-radius:18px;padding:12px 14px")}>
                    <b style={css("font-size:calc(13.5px*var(--fs,1))")}>{txt(v.sel.mqTxt)}</b>
                    <span style={css("font-size:calc(12.5px*var(--fs,1));font-weight:700;flex:none")}>Ubah</span>
                  </button>
                ) : null}
                <div style={css(`display:grid;gap:10px;background:${v.sel?.udzBg ?? ''};border-radius:22px;padding:14px`)}>
                  <div style={css("display:flex;gap:10px;align-items:flex-start")}>
                    <span style={css(`flex:none;margin-top:2px;font-size:calc(12px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:4px 10px;border-radius:999px;color:var(--on-isi);background:${v.sel?.udz ? 'var(--red-600)' : 'var(--color-accent)'}`)}>
                      {v.sel?.udz ? 'UDZUR' : 'SEHAT'}
                    </span>
                    <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.4;color:var(--color-neutral-900);min-width:0")}>
                      <b>{txt(v.sel?.udzTitle)}</b>
                      <br />
                      {txt(v.sel?.udzSub)}
                    </div>
                  </div>
                  {v.sel?.udzForm ? (
                    <div style={css("display:grid;gap:10px;background:var(--color-bg);border-radius:18px;padding:12px")}>
                      <b style={css("font-size:calc(14px*var(--fs,1))")}>{txt(v.sel.udzForm.title)}</b>
                      <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700)")}>Alasan (boleh kosong) · pilih atau ketik sendiri</div>
                      <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                        {arr(v.sel.udzForm.chips).map((c, i0) => (
                          <button key={i0} onClick={c.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(12.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c.bg};color:${c.fg}`)}>{txt(c.l)}</button>
                        ))}
                      </div>
                      <input className="input" value={v.sel.udzForm.alasan} onChange={v.sel.udzForm.onAlasan} placeholder="Tulis alasan lain…" style={css("height:44px;font-size:calc(14px*var(--fs,1))")} />
                      <div style={css("display:grid;grid-template-columns:1fr 1.6fr;gap:8px")}>
                        <button className="btn btn-secondary" onClick={v.sel.udzForm.batal} style={css("height:44px")}>Batal</button>
                        <button className="btn btn-primary" onClick={v.sel.udzForm.ok} style={css("height:44px;" + v.sel.udzForm.okStyle)}>{txt(v.sel.udzForm.okLabel)}</button>
                      </div>
                    </div>
                  ) : (
                    <button className={v.sel?.udzBtnCls} onClick={v.sel?.toggleUdz} style={css(v.sel?.udzBtnStyle)}>
                      {txt(v.sel?.udzCta)}
                    </button>
                  )}
                  {arr(v.sel?.riwayatUdz).length ? (
                    <div style={css("display:grid;gap:6px;border-top:1px solid rgba(0,0,0,.08);padding-top:10px")}>
                      <div style={css("font-size:calc(12px*var(--fs,1));font-weight:700;color:var(--color-neutral-700)")}>Riwayat udzur</div>
                      {arr(v.sel.riwayatUdz).map((r, i0) => (
                        <div key={i0} style={css("display:flex;gap:8px;align-items:flex-start;font-size:calc(12.5px*var(--fs,1));line-height:1.35")}>
                          <span style={css(`width:8px;height:8px;border-radius:50%;margin-top:5px;flex:none;background:${r.dot}`)}></span>
                          <span>{txt(r.teks)}{r.oleh ? <span style={css("color:var(--color-neutral-700)")}>{' · ' + r.oleh}</span> : null}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                {" "}
                <DataJamaah d={v.selData} />
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    Catatan
                  </div>
                  {" "}
                  <input className="input" value={v.sel?.note ?? ''} onChange={v.onNote} placeholder="Tulis catatan, mis. kursi roda" style={css("height:44px;font-size:calc(14.5px*var(--fs,1))")} />
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {" "}
                    {arr(v.sel?.noteChips).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css("border:0;border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:var(--color-surface);color:var(--color-text);box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:14px 16px;display:grid;gap:12px")}>
                  {" "}
                  <div style={css("font-weight:800;font-size:calc(15px*var(--fs,1))")}>
                    Kebutuhan khusus
                  </div>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.sk?.chips).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 14px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
                        {txt(c?.mark)}{txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                  <div style={css("display:flex;align-items:center;gap:10px;border-top:1px solid var(--color-divider);padding-top:10px")}>
                    <div style={css("flex:1;min-width:0")}>
                      <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);font-weight:600")}>
                        Pendamping (jamaah)
                      </div>
                      <div style={css(`font-weight:700;font-size:calc(14px*var(--fs,1));color:${v.sk?.pendFg ?? ''}`)}>
                        {txt(v.sk?.pend)}
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={v.sk?.onPend} style={css("flex:none;height:44px;padding:0 16px")}>
                      {txt(v.sk?.pendCta)}
                    </button>
                  </div>
                  {" "}
                  {v.sk?.showPelb ? (<>
                    <div style={css("display:flex;align-items:center;gap:10px;border-top:1px solid var(--color-divider);padding-top:10px")}>
                      <div style={css("flex:1;min-width:0")}>
                        <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);font-weight:600")}>
                          Pelaksana badal tetap · 10–13 Dzh
                        </div>
                        <div style={css(`font-weight:700;font-size:calc(14px*var(--fs,1));color:${v.sk?.pelbFg ?? ''}`)}>
                          {txt(v.sk?.pelb)}
                        </div>
                      </div>
                      <button className="btn btn-secondary" onClick={v.sk?.onPelb} style={css("flex:none;height:44px;padding:0 16px")}>
                        {txt(v.sk?.pelbCta)}
                      </button>
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                {v.sel?.canUlang ? (<>
                  <button className="btn btn-secondary" onClick={v.sel?.openUlang} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>
                    ↺ Tandai perlu ulang
                  </button>
                </>) : null}
                {" "}
                {v.hasPelNote ? (<>
                  <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-accent-2-800);background:var(--color-accent-2-100);border-radius:22px;padding:12px 14px")}>
                    {txt(v.sel?.pelNote)}
                  </div>
                </>) : null}
                {" "}
                <div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800);margin-bottom:8px")}>
                    Progres manasik · ketuk untuk ubah
                  </div>
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:2px 16px")}>
                    {" "}
                    {arr(v.sel?.rites).map((r, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:grid;gap:4px;padding:5px 0;border-bottom:1px solid var(--color-divider)")}>
                        <button type="button" className="ketuk" onClick={r?.on} style={css("display:flex;align-items:center;gap:12px;min-height:44px")}>
                          <span aria-hidden="true" style={css(`width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${r?.bg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
                            {txt(r?.mark)}
                          </span>
                          <span style={css("flex:1;min-width:0;display:grid")}>
                            <span style={css("font-size:calc(14.5px*var(--fs,1));font-weight:600")}>
                              {txt(r?.n)}
                            </span>
                            <span style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(r?.day)}
                            </span>
                          </span>
                          <span style={css(`font-size:calc(13px*var(--fs,1));color:${r?.fg ?? ''};font-weight:700;text-align:right`)}>
                            {txt(r?.st)}
                          </span>
                        </button>
                        {r?.ubahTgl ? (
                          <button type="button" onClick={r.ubahTgl} style={css("justify-self:start;margin-left:40px;min-height:44px;border:1px solid var(--color-divider);background:var(--color-bg);border-radius:999px;padding:0 14px;font:600 calc(12.5px*var(--fs,1)) var(--font-body);color:var(--color-accent-800)")}>
                            {r.tglTxt ? 'Dilaksanakan ' + r.tglTxt + ' · ubah' : 'Atur tanggal pelaksanaan'}
                          </button>
                        ) : null}
                      </div>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <button className="btn btn-secondary" onClick={v.closeSel} style={css("height:46px")}>
                  Tutup
                </button>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
  </>);
}
