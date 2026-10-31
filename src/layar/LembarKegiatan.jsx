// Lembar dan dialog kegiatan: jadwal, shaf, ulang, susulan, konfirmasi, pelaksana, PDF, tanggal, foto, galeri, miqat.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function LembarKegiatan({ v }) {
  return (<>
          {v.hasSlotDlg ? (<>
            {" "}
            <div onClick={v.closeSlotDlg} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                  Tambah jadwal Raudhoh
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Tanggal
                  <input className="input" type="date" value={v.sd?.tgl ?? ''} onChange={v.sdTgl} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                </label>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:10px")}>
                  {" "}
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Jam mulai
                    <input className="input" type="time" value={v.sd?.a ?? ''} onChange={v.sdA} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                  </label>
                  {" "}
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Jam selesai
                    <input className="input" type="time" value={v.sd?.b ?? ''} onChange={v.sdB} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                  </label>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Jenis kelamin{" "}
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                    {arr(v.sd?.sexBtns).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;font:600 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Rombongan (boleh pilih banyak){" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                    {arr(v.sd?.rs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`min-width:52px;min-height:44px;border:0;border-radius:999px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Keterangan (opsional)
                  <input className="input" value={v.sd?.ket ?? ''} onChange={v.sdKet} placeholder="mis. Pintu 25 · pemandu" style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                </label>
                {" "}
                <div style={css("background:var(--color-accent-100);color:var(--color-accent-800);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));font-weight:600;line-height:1.4")}>
                  {txt(v.sd?.prev)}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:10px")}>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.closeSlotDlg} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    Batal
                  </button>
                  {" "}
                  <button className="btn btn-primary" onClick={v.saveSlot} disabled={v.sd?.noSave} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    Simpan
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasSaf ? (<>
            {" "}
            <div onClick={v.closeSaf} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                    Alasan Safari Wukuf
                  </div>
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    {txt(v.sf?.who)}{" "}· wajib diisi · tetap dihitung sah wukuf, jumlahnya ditampilkan terpisah
                  </div>
                </div>
                {" "}
                <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                  {arr(v.sf?.whys).map((o, i0) => (<React.Fragment key={i0}>
                    <button onClick={o?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o?.bg ?? ''};color:${o?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${o?.ring ?? ''}`)}>
                      {txt(o?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  {txt(v.sf?.catReq)}
                  <input className="input" value={v.sf?.cat ?? ''} onChange={v.safCat} placeholder="mis. dirawat di KKHI Makkah" style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                </label>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.closeSaf} style={css("height:48px")}>
                    Batal
                  </button>
                  <button className="btn btn-primary" onClick={v.saveSaf} disabled={v.sf?.noSave} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    Simpan Safari Wukuf
                  </button>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasUl ? (<>
            {" "}
            <div onClick={v.closeUl} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                    ↺ Tandai perlu ulang
                  </div>
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    {txt(v.ul?.who)}{" "}· riwayat lama tetap tersimpan di Log
                  </div>
                </div>
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Tahap yang kurang
                  <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                    {arr(v.ul?.tahaps).map((o, i0) => (<React.Fragment key={i0}>
                      <button onClick={o?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o?.bg ?? ''};color:${o?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${o?.ring ?? ''}`)}>
                        {txt(o?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                </div>
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Alasan
                  <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                    {arr(v.ul?.whys).map((o, i0) => (<React.Fragment key={i0}>
                      <button onClick={o?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o?.bg ?? ''};color:${o?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${o?.ring ?? ''}`)}>
                        {txt(o?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  {txt(v.ul?.catReq)}
                  <input className="input" value={v.ul?.cat ?? ''} onChange={v.ulCat} placeholder="mis. baru 6 putaran" style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                </label>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Rencana tanggal ulang
                  <input className="input" type="date" value={v.ul?.rencana ?? ''} min={v.ul?.min} onChange={v.ulRencana} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                </label>
                {" "}
                <div style={css("background:var(--color-accent-2-100);color:var(--color-accent-2-800);border-radius:18px;padding:12px 14px;font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.4")}>
                  Status menjadi “Perlu ulang”, tidak dihitung selesai, dan masuk “Perlu perhatian”.
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.closeUl} style={css("height:48px")}>
                    Batal
                  </button>
                  <button className="btn btn-primary" onClick={v.saveUl} disabled={v.ul?.noSave} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    Tandai perlu ulang
                  </button>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasSus ? (<>
            {" "}
            <div onClick={v.closeSus} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                  {txt(v.ss?.title)}
                </div>
                {" "}
                {v.ss?.hasWho ? (<>
                  <div style={css("background:var(--color-surface);border-radius:22px;padding:12px 14px;display:grid;gap:2px")}>
                    {" "}
                    <div style={css("font-weight:700;font-size:calc(15px*var(--fs,1))")}>
                      {txt(v.ss?.who)}
                    </div>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                      {txt(v.ss?.whoSub)}
                    </div>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-accent-800);margin-top:4px")}>
                      Jadwal kloter ·{" "}{txt(v.ss?.hari)}
                    </div>
                    {" "}
                  </div>
                </>) : null}
                {" "}
                {v.ss?.hasCand ? (<>
                  <div style={css("display:grid;gap:8px")}>
                    <div style={css("display:flex;justify-content:space-between;gap:8px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                      <span>
                        Pilih jamaah · jadwal kloter{" "}{txt(v.ss?.hari)}
                      </span>
                      <span style={css("flex:none")}>
                        {txt(v.ss?.candN)}
                      </span>
                    </div>
                    <div style={css("background:var(--color-surface);border-radius:22px;padding:2px 14px;max-height:220px;overflow-y:auto")}>
                      {arr(v.ss?.cand).map((j, i0) => (<React.Fragment key={i0}>
                        <button type="button" className="ketuk" onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;min-height:48px;border-bottom:1px solid var(--color-divider)")}>
                          <div aria-hidden="true" style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--on-isi);background:${j?.bg ?? ''};box-shadow:inset 0 0 0 2px ${j?.ring ?? ''}`)}>
                            {txt(j?.mark)}
                          </div>
                          <div style={css("min-width:0;flex:1")}>
                            <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                              {txt(j?.name)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(j?.sub)}
                            </div>
                          </div>
                        </button>
                      </React.Fragment>))}
                    </div>
                  </div>
                </>) : null}
                {" "}
                {v.ss?.needPend ? (<>
                  <div style={css("display:grid;gap:8px")}>
                    <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                      Pendamping (wajib)
                    </div>
                    {" "}
                    {v.ss?.hasPend ? (<>
                      <div style={css("display:flex;align-items:center;gap:10px;background:var(--color-accent-100);border-radius:18px;padding:4px 6px 4px 14px")}>
                        <div style={css("flex:1;min-width:0;font-size:calc(14px*var(--fs,1));font-weight:700;color:var(--color-accent-800)")}>
                          {txt(v.ss?.pendName)}
                        </div>
                        <button className="btn btn-ghost" onClick={v.ss?.clearPend} style={css("min-height:44px;font-size:calc(13px*var(--fs,1))")}>
                          Ganti
                        </button>
                      </div>
                    </>) : null}
                    {" "}
                    {v.ss?.noPend ? (<>
                      <input className="input" type="search" aria-label="Cari pelaksana" value={v.ss?.pq ?? ''} onChange={v.susPq} placeholder="Cari petugas atau jamaah, atau ketik nama lain" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")} />
                      <div style={css("background:var(--color-surface);border-radius:20px;padding:2px 8px;max-height:200px;overflow-y:auto")}>
                        {arr(v.ss?.pOpts).map((o, i0) => (<React.Fragment key={i0}>
                          <button type="button" className="ketuk" onClick={o?.on} style={css("display:grid;gap:1px;padding:9px 8px;min-height:44px;border-bottom:1px solid var(--color-divider)")}>
                            <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                              {txt(o?.name)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(o?.sub)}
                            </div>
                          </button>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    {" "}
                  </div>
                </>) : null}
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Dikerjakan tanggal (waktu Arab Saudi)
                  </div>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                    {arr(v.ss?.opts).map((o, i0) => (<React.Fragment key={i0}>
                      <button onClick={o?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o?.bg ?? ''};color:${o?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${o?.ring ?? ''}`)}>
                        {txt(o?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                  {v.ss?.other ? (<>
                    <input className="input" type="date" aria-label="Tanggal susulan" value={v.ss?.tgl ?? ''} max={v.ss?.max} onChange={v.susDate} style={css("height:48px")} />
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:10px")}>
                  {" "}
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Jam (opsional)
                    <input className="input" type="time" value={v.ss?.jam ?? ''} onChange={v.susJam} style={css("height:46px")} />
                  </label>
                  {" "}
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Keterangan
                    <input className="input" value={v.ss?.ket ?? ''} onChange={v.susKet} placeholder="mis. terlambat dari Mina" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")} />
                  </label>
                  {" "}
                </div>
                {" "}
                <div style={css("background:var(--color-accent-2-100);color:var(--color-accent-2-800);border-radius:18px;padding:12px 14px;font-size:calc(14px*var(--fs,1));font-weight:700;line-height:1.4")}>
                  Akan tercatat sebagai{" "}{txt(v.ss?.prev)}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:8px")}>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.closeSus} style={css("height:48px")}>
                    Batal
                  </button>
                  {" "}
                  <button className="btn btn-primary" onClick={v.confirmSus} disabled={v.ss?.noSave} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    {txt(v.ss?.cta)}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasConfirm ? (<>
            {" "}
            <div onClick={v.closeConfirm} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;padding:12px;z-index:6")}>
              {" "}
              <div className="dialog" role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%")}>
                {" "}
                <div className="dialog-title">
                  {txt(v.confirm?.title)}
                </div>
                {" "}
                <div className="dialog-body">
                  {txt(v.confirm?.body)}
                </div>
                {" "}
                <div className="dialog-actions">
                  {" "}
                  <button className="btn btn-secondary" onClick={v.closeConfirm} style={css("height:44px;padding:0 20px")}>
                    Batal
                  </button>
                  {" "}
                  <button className="btn btn-primary" onClick={v.applyConfirm} style={css("height:44px;padding:0 20px")}>
                    {txt(v.confirm?.cta)}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasPicker ? (<>
            {" "}
            <div onClick={v.closePicker} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:6")}>
              {" "}
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                    Catat badal · pelaksana wajib
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                    {txt(v.pk?.rite)}{" "}· pelaksana boleh melontar untuk dirinya dan jamaah lain bersamaan
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    1. Jamaah yang dibadalkan ·{" "}{txt(v.pk?.selCount)}{" "}dipilih
                  </div>
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:2px 14px")}>
                    {" "}
                    {arr(v.pk?.jam).map((j, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <button type="button" className="ketuk" onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;padding:10px 0;min-height:48px;border-bottom:1px solid var(--color-divider)")}>
                        <div aria-hidden="true" style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${j?.bg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${j?.ring ?? ''}`)}>
                          {txt(j?.mark)}
                        </div>
                        <div style={css("min-width:0;flex:1")}>
                          <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                            {txt(j?.name)}
                          </div>
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(j?.sub)}
                          </div>
                        </div>
                      </button>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    2. Pilih pelaksana
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                    {" "}
                    {arr(v.pk?.srcs).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''};display:flex;gap:6px;justify-content:center`)}>
                        {txt(m?.l)}
                        <span style={css("opacity:.7")}>
                          {txt(m?.n)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <input className="input" type="search" aria-label="Cari pelaksana" value={v.pk?.q ?? ''} onChange={v.pk?.onQ} placeholder="Cari nama, nomor porsi, atau ketik nama lain" style={css("height:44px;font-size:calc(15px*var(--fs,1))")} />
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:4px 8px;max-height:250px;overflow-y:auto")}>
                    {" "}
                    {arr(v.pk?.opts).map((o, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <button type="button" className="ketuk" onClick={o?.on} style={css(`display:flex;align-items:center;gap:12px;padding:10px 8px;min-height:48px;border-radius:18px;background:${o?.bg ?? ''}`)}>
                        <div aria-hidden="true" style={css(`width:20px;height:20px;border-radius:50%;flex:none;background:${o?.dot ?? ''};box-shadow:inset 0 0 0 2px ${o?.ring ?? ''}, inset 0 0 0 5px var(--color-bg)`)}></div>
                        <div style={css("min-width:0;flex:1")}>
                          <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                            {txt(o?.name)}
                          </div>
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(o?.sub)}
                          </div>
                        </div>
                        {" "}
                        {o?.hasLoad ? (<>
                          <span className="tag tag-accent" style={css("flex:none")}>
                            {txt(o?.load)}
                          </span>
                        </>) : null}
                      </button>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                    {v.pk?.empty ? (<>
                      <div style={css("padding:18px 0;text-align:center;font-size:calc(13.5px*var(--fs,1));color:var(--color-neutral-700)")}>
                        Tidak ditemukan.
                      </div>
                    </>) : null}
                    {" "}
                  </div>
                  {" "}
                  {v.pk?.hasWarn ? (<>
                    <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.4;color:var(--color-accent-800);background:var(--color-accent-100);border-radius:18px;padding:10px 12px")}>
                      {txt(v.pk?.warn)}
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 2fr;gap:8px")}>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.closePicker} style={css("height:46px")}>
                    Batal
                  </button>
                  {" "}
                  <button className="btn btn-primary" onClick={v.applyPicker} disabled={v.pk?.disabled} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>
                    {txt(v.pk?.cta)}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasPdf ? (<>
            {" "}
            <div role="dialog" aria-modal="true" aria-label="Pratinjau PDF" style={css("position:absolute;inset:0;background:var(--color-neutral-200);z-index:8;display:flex;flex-direction:column")}>
              {" "}
              <div style={css("height:44px;flex:none")}></div>
              {" "}
              <div style={css("display:flex;align-items:center;gap:10px;padding:6px 16px 12px;flex:none")}>
                {" "}
                <button className="btn btn-ghost" onClick={v.closePdf} style={css("height:44px;padding:0 10px;font-size:calc(15px*var(--fs,1))")}>
                  ‹ Kembali
                </button>
                {" "}
                <div style={css("flex:1;min-width:0;text-align:center")}>
                  {" "}
                  <div style={css("font-weight:700;font-size:calc(14px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                    {txt(v.pr?.title)}
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                    {txt(v.pr?.pages)}{" "}halaman A4 ·{" "}{txt(v.pr?.sub)}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("width:72px;flex:none")}></div>
                {" "}
              </div>
              {" "}
              <iframe ref={v.pdfRef} srcDoc={v.pdfHtml} title="Pratinjau PDF" style={css("flex:1;width:100%;border:0;background:transparent")}></iframe>
              {" "}
              <div style={css("padding:12px 20px 24px;background:var(--color-bg);flex:none;display:grid;gap:6px")}>
                {" "}
                <button className="btn btn-primary" onClick={v.savePdf} style={css("width:100%;height:50px;font-size:calc(16px*var(--fs,1))")}>
                  Unduh PDF
                </button>
                {" "}
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);text-align:center")}>
                  Pilih “Simpan sebagai PDF” pada jendela berikutnya
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.tglJadwal ? (
            <div onClick={v.tglJadwal.tutup} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>{txt(v.tglJadwal.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-700)")}>
                  Ketik hari Hijriyah sesuai jadwal kloter, lalu pilih tanggal Masehinya. Jamaah yang melaksanakan <b>setelah</b> tanggal Masehi ini otomatis tercatat <b>Susulan</b>. Bisa diubah kapan saja, juga tanpa internet.
                </div>
                {arr(v.tglJadwal.groups).map((g, i0) => (
                  <div key={i0} style={css("background:var(--color-surface);border-radius:20px;padding:12px 14px;display:grid;gap:8px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                    <div style={css("display:flex;justify-content:space-between;gap:8px;align-items:baseline")}>
                      <b style={css("font-size:calc(14.5px*var(--fs,1))")}>{txt(g.day)}</b>
                      <span style={css(`font-size:calc(12.5px*var(--fs,1));font-weight:700;color:${g.adaTgl ? 'var(--color-accent-800)' : 'var(--red-600)'}`)}>{txt(g.hari)}</span>
                    </div>
                    <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.4")}>{txt(g.names)}</div>
                    <label style={css("display:grid;gap:4px;font-size:calc(12px*var(--fs,1));font-weight:700;color:var(--color-neutral-700)")}>
                      Hari (Hijriyah)
                      <div style={css("display:flex;gap:8px")}>
                        <input className="input" value={g.hijri} onChange={g.onHijri} placeholder="mis. 5 Dzulqa'dah" style={css("height:44px;font-size:calc(14px*var(--fs,1));flex:1;min-width:0")} />
                        {g.ubahHijri ? <button className="btn btn-primary" onClick={g.simpanHijri} style={css("height:44px;padding:0 14px;font-size:calc(13px*var(--fs,1))")}>Simpan</button> : null}
                      </div>
                    </label>
                    <div style={css("font-size:calc(12px*var(--fs,1));font-weight:700;color:var(--color-neutral-700)")}>Tanggal (Masehi) dan jam (WAS)</div>
                    <div style={css("display:flex;flex-wrap:wrap;gap:8px;min-width:0")}>
                      <input className="input" type="date" aria-label="Tanggal (Masehi)" value={g.tgl} onChange={g.onTgl} style={css("height:44px;font-size:calc(14px*var(--fs,1));flex:1 1 150px;min-width:0")} />
                      <input className="input" type="time" value={g.jam} onChange={g.onJam} aria-label="Jam (WAS)" style={css("height:44px;font-size:calc(14px*var(--fs,1));flex:1 1 110px;min-width:0")} />
                      {g.adaTgl ? <button className="btn btn-ghost" onClick={g.hapus} style={css("height:44px;padding:0 12px;font-size:calc(13px*var(--fs,1))")}>Kosongkan</button> : null}
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={v.tglJadwal.tutup} style={css("height:48px")}>Selesai</button>
              </div>
            </div>
          ) : null}
          {v.fotoDlg ? (
            <div onClick={v.fotoDlg.batal} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:8")}>
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:94%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>Simpan foto kegiatan</div>
                <img src={v.fotoDlg.prev} alt="Pratinjau foto" width="320" height="220" style={css("width:100%;height:220px;object-fit:contain;border-radius:18px;background:#000")} />
                <div style={css("font-size:calc(12px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(v.fotoDlg.kb)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Kegiatan</div>
                <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {arr(v.fotoDlg.rites).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(12.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                </div>
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Cakupan</div>
                <div style={css("display:grid;grid-template-columns:repeat(3,1fr);background:var(--color-surface);border-radius:999px;padding:4px;gap:4px")}>
                  {arr(v.fotoDlg.scopes).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                </div>
                {v.fotoDlg.showR ? <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>{arr(v.fotoDlg.rs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}</div> : null}
                {v.fotoDlg.showG ? <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>{arr(v.fotoDlg.gs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}</div> : null}
                <input className="input" value={v.fotoDlg.ket} onChange={v.fotoDlg.onKet} placeholder="Keterangan (boleh kosong)" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                <div style={css("display:grid;grid-template-columns:1fr 1.8fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.fotoDlg.batal} style={css("height:46px")}>Batal</button>
                  <button className="btn btn-primary" onClick={v.fotoDlg.simpan} style={css("height:46px")}>Simpan foto</button>
                </div>
              </div>
            </div>
          ) : null}
          {v.galeri ? (
            <div onClick={v.galeri.tutup} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:7")}>
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:94%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>Foto kegiatan</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);line-height:1.45")}>
                  {v.pakaiAkun ? <>Foto disimpan di <b>penyimpanan kloter</b> (tertutup, hanya petugas kloter ini). Setelah terunggah, HP hanya menyimpan gambar kecilnya.</> : <>Foto disimpan di folder <b>Foto Kegiatan · (nama Sheet)</b> di Google Drive pemilik Sheet, per kegiatan lalu per tanggal. Setelah terunggah, HP hanya menyimpan gambar kecilnya.</>}
                </div>
                {v.galeri.kosong ? <div style={css("padding:20px;text-align:center;color:var(--color-neutral-700);font-size:calc(14px*var(--fs,1))")}>Belum ada foto.</div> : null}
                {v.galeri.adaAntre ? <button className="btn btn-secondary" onClick={v.galeri.unggah} style={css("height:44px")}>Unggah sekarang</button> : null}
                {arr(v.galeri.items).map((f, i0) => (
                  <div key={i0} style={css("display:flex;gap:12px;align-items:center;background:var(--color-surface);border-radius:18px;padding:10px")}>
                    {f.src ? <img src={f.src} alt="" width="64" height="64" style={css("width:64px;height:64px;object-fit:cover;border-radius:12px;flex:none")} /> : <div style={css("width:64px;height:64px;border-radius:12px;background:var(--color-neutral-200);flex:none")}></div>}
                    <div style={css("flex:1;min-width:0;display:grid;gap:2px")}>
                      <b style={css("font-size:calc(13.5px*var(--fs,1))")}>{txt(f.judul)}</b>
                      {f.sub ? <span style={css("font-size:calc(12px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(f.sub)}</span> : null}
                      <span style={css(`font-size:calc(12px*var(--fs,1));font-weight:700;color:${f.stFg}`)}>
                        {txt(f.st)}{f.link ? <> · <a href={f.link} onClick={f.buka} target="_blank" rel="noopener">buka</a></> : null}
                      </span>
                    </div>
                    <button onClick={f.hapus} aria-label="Hapus foto dari HP" style={css("border:0;background:transparent;color:var(--color-neutral-600);cursor:pointer;font-size:calc(12px*var(--fs,1));font-weight:700;flex:none;min-height:44px;min-width:44px")}>Hapus</button>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={v.galeri.tutup} style={css("height:46px")}>Tutup</button>
              </div>
            </div>
          ) : null}
          {v.mqDlg ? (
            <div onClick={v.mqDlg.batal} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:8")}>
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>{txt(v.mqDlg.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);line-height:1.45")}>
                  {txt(v.mqDlg.kloterInfo)}<br />Sekarang: {txt(v.mqDlg.ringkas)}
                </div>
                {arr(v.mqDlg.scopes).length ? (
                  <div style={css("display:grid;grid-template-columns:repeat(3,1fr);background:var(--color-surface);border-radius:999px;padding:4px;gap:4px")}>
                    {arr(v.mqDlg.scopes).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                {v.mqDlg.showR ? (
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.mqDlg.rs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                {v.mqDlg.showG ? (
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.mqDlg.gs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Pilih miqat atau ketik sendiri</div>
                <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {arr(v.mqDlg.opts).map((o, i0) => <button key={i0} onClick={o.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o.bg};color:${o.fg}`)}>{txt(o.l)}</button>)}
                </div>
                <input className="input" value={v.mqDlg.val} onChange={v.mqDlg.onVal} placeholder="Ketik nama miqat lain…" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                {v.mqDlg.note ? <div style={css("font-size:calc(12.5px*var(--fs,1));color:var(--color-neutral-700);line-height:1.4")}>{txt(v.mqDlg.note)}</div> : null}
                <div style={css("display:grid;grid-template-columns:1fr 1.8fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.mqDlg.batal} style={css("height:46px")}>Batal</button>
                  <button className="btn btn-primary" onClick={v.mqDlg.simpan} style={css("height:46px")}>{txt(v.mqDlg.cta)}</button>
                </div>
              </div>
            </div>
          ) : null}
          {v.tgJ ? (
            <div onClick={v.tgJ.batal} style={css("position:absolute;inset:0;background:var(--scrim);display:flex;align-items:flex-end;z-index:8")}>
              <div role="dialog" aria-modal="true" onClick={v.stop} style={css("width:100%;background:var(--lembar-bg);border-top:1px solid var(--kaca-garis);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(18px*var(--fs,1))")}>Tanggal pelaksanaan</div>
                <div style={css("font-size:calc(14px*var(--fs,1));font-weight:600")}>{txt(v.tgJ.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(v.tgJ.jadwal)}</div>
                <input className="input" type="date" aria-label="Tanggal pelaksanaan" value={v.tgJ.tgl} max={v.tgJ.max} onChange={v.tgJ.onTgl} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                {v.tgJ.hasil ? <div style={css(`border-radius:14px;padding:10px 12px;font-size:calc(13px*var(--fs,1));font-weight:700;background:${v.tgJ.hasilBg};color:${v.tgJ.hasilFg}`)}>{txt(v.tgJ.hasil)}</div> : null}
                <div style={css("display:grid;grid-template-columns:1fr 1.6fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.tgJ.batal} style={css("height:46px")}>Batal</button>
                  <button className="btn btn-primary" onClick={v.tgJ.simpan} style={css("height:46px")}>Simpan tanggal</button>
                </div>
              </div>
            </div>
          ) : null}
  </>);
}
