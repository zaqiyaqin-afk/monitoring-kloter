// Menu Checklist (Massal): pilih ibadah, lalu centang per rombongan/regu/jamaah.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';
import PilihIbadah from '../PilihIbadah.jsx';

export default function MenuChecklist({ v }) {
  return (<>
              {v.ckPilih ? <PilihIbadah v={v} /> : (<>
              {" "}
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:16px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                    Checklist {txt(v.labelIbadah)}
                  </div>
                  <button onClick={v.kePilihIbadah} style={css("margin-top:6px;border:1px solid var(--color-divider);background:var(--color-surface);color:var(--color-accent-700);border-radius:999px;min-height:44px;padding:0 14px;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer")}>‹ Ganti ibadah</button>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    {txt(v.kloterLabel)}{" "}·{" "}{txt(v.d?.day)}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    Kegiatan
                  </div>
                  {" "}
                  <div ref={v.daysRef} style={css("position:relative;display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x proximity;margin:0 -20px;padding:2px 20px;scrollbar-width:none")}>
                    {arr(v.ckDays).map((c, i0) => (<React.Fragment key={i0}>
                      <button data-today={c?.today} onClick={c?.on} style={css(`flex:none;scroll-snap-align:center;border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;display:flex;align-items:center;gap:8px;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 ${c?.rw ?? ''} ${c?.ring ?? ''}`)}>
                        <span style={css(`width:8px;height:8px;border-radius:50%;background:${c?.dotBg ?? ''};display:${c?.dot ?? ''}`)}></span>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {" "}
                    {arr(v.ckPills).map((p, i0) => (<React.Fragment key={i0}>
                      <button onClick={p?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:44px;padding:0 14px;font:600 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;white-space:nowrap;line-height:1.2;display:flex;align-items:center;gap:6px;background:${p?.bg ?? ''};color:${p?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${p?.ring ?? ''}`)}>
                        {p?.locked ? (<>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="11" width="16" height="10" rx="3" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                          </svg>
                        </>) : null}
                        {p?.now ? (<>
                          <span style={css("width:9px;height:9px;border-radius:50%;background:var(--color-accent-500);box-shadow:0 0 0 2px var(--color-accent-100)")}></span>
                        </>) : null}
                        {p?.done ? (<>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </>) : null}
                        {txt(p?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  {v.ckTarw ? (<>
                    <div style={css("display:grid;gap:6px")}>
                      <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                        Tarwiyah · berangkat ke Mina tanggal
                      </div>
                      <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                        {arr(v.tarwBtns).map((m, i0) => (<React.Fragment key={i0}>
                          <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;font:600 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                            {txt(m?.l)}
                          </button>
                        </React.Fragment>))}
                      </div>
                    </div>
                  </>) : null}
                  {" "}
                  {v.isMad ? (<>
                    {" "}
                    <div style={css("display:grid;gap:10px;margin-top:4px")}>
                      {" "}
                      <div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:8px")}>
                        <span style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                          Jadwal Raudhoh
                        </span>
                        <span style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-700)")}>
                          {txt(v.sexSplit)}
                        </span>
                      </div>
                      {" "}
                      {v.noSlots ? (<>
                        <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-700);background:var(--color-surface);border-radius:20px;padding:12px 14px")}>
                          Belum ada jadwal. Isi tab “Jadwal Raudhoh” di Google Sheet atau ketuk “+ Tambah jadwal”.
                        </div>
                      </>) : null}
                      {" "}
                      <div style={css("display:flex;gap:8px;overflow-x:auto;margin:0 -20px;padding:2px 20px;scrollbar-width:none")}>
                        {arr(v.mdDays).map((c, i0) => (<React.Fragment key={i0}>
                          <button onClick={c?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:44px;padding:0 16px;font:700 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
                            {txt(c?.l)}
                          </button>
                        </React.Fragment>))}
                      </div>
                      {" "}
                      <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                        {arr(v.mdSexBtns).map((m, i0) => (<React.Fragment key={i0}>
                          <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;font:600 calc(14px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                            {txt(m?.l)}
                          </button>
                        </React.Fragment>))}
                      </div>
                      {" "}
                      <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                        {arr(v.mdJams).map((c, i0) => (<React.Fragment key={i0}>
                          <button onClick={c?.on} style={css(`border:0;border-radius:18px;min-height:56px;padding:6px 14px;text-align:left;cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 ${c?.rw ?? ''} ${c?.ring ?? ''}`)}>
                            <div style={css("font-weight:700;font-size:calc(14px*var(--fs,1))")}>
                              {txt(c?.l)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(c?.sub)}{" "}·{" "}{txt(c?.cnt)}
                            </div>
                          </button>
                        </React.Fragment>))}
                      </div>
                      {" "}
                      {v.mdNone ? (<>
                        <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-700)")}>
                          Belum ada jadwal{" "}{txt(v.mdSexName)}{" "}pada hari ini.
                        </div>
                      </>) : null}
                      {" "}
                      <div style={css("display:flex;gap:12px;align-items:center;flex-wrap:wrap")}>
                        <button className="btn btn-secondary" onClick={v.openAddSlot} style={css("height:44px;padding:0 18px;font-size:calc(14px*var(--fs,1))")}>
                          + Tambah jadwal
                        </button>
                        {v.slotActive ? (<>
                          <button className="btn btn-ghost" onClick={v.clearSlot} style={css("font-size:calc(13px*var(--fs,1));min-height:44px")}>
                            Tampilkan semua jamaah
                          </button>
                        </>) : null}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {v.ckNotCur ? (<>
                    <button className="btn btn-ghost" onClick={v.ckSetCur} style={css("justify-self:start;font-size:calc(13px*var(--fs,1));min-height:44px;padding:0")}>
                      Jadikan kegiatan yang sedang berlangsung
                    </button>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                  {" "}
                  {arr(v.ckScopes).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                      {txt(m?.l)}
                    </button>
                  </React.Fragment>))}
                  {" "}
                </div>
                {" "}
                {v.ckShowR ? (<>
                  {" "}
                  <div style={css("display:flex;gap:8px;overflow-x:auto;margin:0 -20px;padding:2px 20px;scrollbar-width:none")}>
                    {arr(v.ckRs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`flex:none;min-width:76px;min-height:44px;border:0;border-radius:16px;padding:6px 10px;display:grid;gap:5px;cursor:pointer;background:${c?.bg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
                        <div style={css(`display:flex;justify-content:space-between;gap:10px;font:700 calc(13px*var(--fs,1)) var(--font-body);color:${c?.fg ?? ''}`)}>
                          <span>
                            {txt(c?.l)}
                          </span>
                          <span>
                            {txt(c?.pct)}
                          </span>
                        </div>
                        <div style={css("height:4px;border-radius:9px;background:var(--color-neutral-200);overflow:hidden")}>
                          <div style={css(`width:${c?.pct ?? ''};height:100%;background:${c?.col ?? ''}`)}></div>
                        </div>
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.ckShowG ? (<>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px")}>
                    {" "}
                    {arr(v.ckGs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <input className="input" type="search" aria-label="Cari jamaah" value={v.ckQ ?? ''} onChange={v.onCkQ} placeholder="Cari jamaah · nama atau nomor porsi" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                <div className="mk-gelap" style={css("background:var(--hero);border:1px solid var(--kaca-garis);border-radius:24px;padding:18px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--kartu-bayang);display:grid;gap:12px")}>
                  {" "}
                  <div style={css("display:flex;justify-content:space-between;align-items:flex-end;gap:10px")}>
                    {" "}
                    <div>
                      {" "}
                      <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:rgba(255,255,255,.88)")}>
                        {txt(v.ckSum?.label)}
                      </div>
                      {" "}
                      <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(24px*var(--fs,1));line-height:1;margin-top:6px;color:#fff")}>
                        {txt(v.ckSum?.done)}
                        <span style={css("font-size:calc(18px*var(--fs,1));color:rgba(255,255,255,.8)")}>
                          {" "}/{" "}{txt(v.ckSum?.total)}
                        </span>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));color:rgba(255,255,255,.88);text-align:right;max-width:140px")}>
                      selesai{" "}{txt(v.ckSum?.rite)}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={css("height:8px;border-radius:99px;background:rgba(0,0,0,.38);overflow:hidden")}>
                    <div style={css(`height:100%;width:${v.ckSum?.pct ?? ''};background:linear-gradient(90deg,#1fcfa0,#5ff5ce);border-radius:99px;transition:width .4s`)}></div>
                  </div>
                  {" "}
                  {v.ckSum?.hasNote ? (<>
                    <div style={css("font-size:calc(13px*var(--fs,1));color:rgba(255,255,255,.88);line-height:1.4")}>
                      {txt(v.ckSum?.note)}
                    </div>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                {v.hasPel ? (<>
                  {" "}
                  <div style={css("display:grid;gap:8px")}>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                      Pelaksana badal
                    </div>
                    {" "}
                    <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:2px 16px")}>
                      {" "}
                      {arr(v.pelGroups).map((p, i0) => (<React.Fragment key={i0}>
                        {" "}
                        <div style={css("display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--color-divider)")}>
                          {" "}
                          <div style={css("width:36px;height:36px;border-radius:50%;background:var(--color-accent-200);color:var(--color-accent-800);display:grid;place-items:center;font-weight:800;font-size:calc(14px*var(--fs,1));flex:none")}>
                            {txt(p?.count)}
                          </div>
                          {" "}
                          <div style={css("min-width:0;flex:1")}>
                            <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                              {txt(p?.name)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(p?.role)}{" "}·{" "}{txt(p?.names)}
                            </div>
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.ckEmpty ? (<>
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:inset 0 0 0 1px var(--color-divider);padding:24px 16px;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
                    Tidak ada jamaah untuk kegiatan ini di cakupan ini.
                  </div>
                </>) : null}
                {" "}
                {v.ckHasRows ? (<>
                  {" "}
                  <div style={css("display:grid;gap:10px")}>
                    {" "}
                    {arr(v.ckRows).map((r, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div className={r?.mark === '✓' ? 'kartu-zamrud' : 'kartu-safir'} style={css("border-radius:20px;padding:14px 14px 14px 16px;display:grid;gap:12px")}>
                        {" "}
                        <div style={css("display:flex;align-items:center;gap:12px")}>
                          {" "}
                          <button type="button" className="ketuk" onClick={r?.onOpen} style={css("flex:1;min-width:0;min-height:44px;display:flex;align-items:center;gap:12px")}>
                            <div style={css("flex:1;min-width:0")}>
                              <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(18px*var(--fs,1));line-height:1.15")}>
                                {txt(r?.title)}
                              </div>
                              <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                                {txt(r?.sub)}
                              </div>
                            </div>
                            <span style={css(`font-size:calc(15px*var(--fs,1));font-weight:800;color:${r?.cntFg ?? ''};flex:none`)}>
                              {txt(r?.cnt)}
                            </span>
                          </button>
                          <button type="button" onClick={r?.onCheck} aria-label={'Centang semua ' + (r?.title ?? '')} style={css(`width:44px;height:44px;flex:none;border-radius:14px;border:0;font:800 calc(20px*var(--fs,1)) var(--font-body);background:${r?.bg ?? ''};color:${r?.fg ?? ''};box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
                            {txt(r?.mark)}
                          </button>
                          {" "}
                        </div>
                        {" "}
                        {r?.hasDots ? (<>
                          <div style={css("display:flex;flex-wrap:wrap;gap:3px")}>
                            {arr(r?.dots).map((o, i1) => (<React.Fragment key={i1}>
                              <div style={css(`width:28px;height:28px;box-sizing:border-box;border-radius:50%;display:grid;place-items:center;font:700 13px var(--font-body);border:${o?.bd ?? ''};background:${o?.bg ?? ''};color:${o?.fg ?? ''}`)}>
                                {txt(o?.ini)}
                              </div>
                            </React.Fragment>))}
                          </div>
                        </>) : null}
                        {" "}
                        {r?.noDots ? (<>
                          <div style={css("height:8px;border-radius:99px;background:var(--color-neutral-200);overflow:hidden")}>
                            <div style={css(`width:${r?.pct ?? ''};height:100%;border-radius:99px;background:${r?.col ?? ''}`)}></div>
                          </div>
                        </>) : null}
                        {" "}
                      </div>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.ckHasPeople ? (<>
                  {" "}
                  <div className="kaca" style={css("border-radius:22px;padding:2px 14px")}>
                    {" "}
                    {arr(v.ckPeople).map((p, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:flex;align-items:center;gap:12px;min-height:60px;padding:10px 0;border-bottom:1px solid var(--color-divider)")}>
                        {" "}
                        <button type="button" tabIndex={-1} aria-hidden="true" onClick={p?.onOpen} style={css(`width:44px;height:44px;border:0;padding:0;border-radius:50%;flex:none;display:grid;place-items:center;font:700 calc(13px*var(--fs,1)) var(--font-body);background:${p?.avBg ?? ''};color:${p?.avFg ?? ''}`)}>
                          {txt(p?.ini)}
                        </button>
                        <button type="button" className="ketuk" onClick={p?.onOpen} style={css("flex:1;min-width:0;min-height:44px")}>
                          {" "}
                          <div style={css("font-weight:600;font-size:calc(14.5px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                            {txt(p?.name)}
                          </div>
                          {" "}
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                            {txt(p?.sub)}
                          </div>
                          {" "}
                          {p?.hasTags ? (<>
                            <div style={css("display:flex;flex-wrap:wrap;gap:4px;margin-top:4px")}>
                              {arr(p?.tags).map((t, i1) => (<React.Fragment key={i1}>
                                <span style={css(`font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.3;padding:1px 9px;border-radius:999px;background:${t?.bg ?? ''};color:${t?.fg ?? ''}`)}>
                                  {txt(t?.t)}
                                </span>
                              </React.Fragment>))}
                            </div>
                          </>) : null}
                        </button>
                        {p?.canUl ? (<>
                          <button type="button" onClick={p?.onMore} aria-label={'Tandai perlu ulang: ' + (p?.name ?? '')} style={css("width:44px;height:44px;flex:none;border:0;border-radius:14px;background:transparent;font:800 calc(20px*var(--fs,1)) var(--font-body);color:var(--color-neutral-800)")}>
                            ⋯
                          </button>
                        </>) : null}
                        {" "}
                        <button type="button" onClick={p?.onCheck} aria-label={'Centang ' + (p?.name ?? '')} style={css(`width:44px;height:44px;flex:none;border-radius:14px;border:0;font:800 ${p?.mfs ?? ''} var(--font-body);background:${p?.cb ?? ''};color:${p?.cf ?? ''};box-shadow:inset 0 0 0 2px ${p?.cr ?? ''}`)}>
                          {txt(p?.mark)}
                        </button>
                        {" "}
                      </div>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <div style={css("position:sticky;bottom:10px;z-index:2")}>
                  <button onClick={v.ckSum?.onAll} style={css("width:100%;height:52px;border:0;border-radius:999px;background:var(--emas-isi);color:var(--on-emas);font:800 calc(15px*var(--fs,1)) var(--font-body);box-shadow:0 12px 26px -10px rgba(0,0,0,.55);cursor:pointer")}>
                    {txt(v.ckSum?.action)}
                  </button>
                </div>
                {" "}
              </div>
              {" "}
              <div style={css("padding:0 20px 24px")}>
                <div>
                  {" "}
                  <div style={css("display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px")}>
                    <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(20px*var(--fs,1))")}>
                      {txt(v.judulKegiatan)}
                    </div>
                    <div style={css("display:flex;gap:6px;flex:none")}>
                      {v.isUmrah ? (
                        <button type="button" onClick={v.openMiqat} style={css("border:0;border-radius:999px;background:var(--color-accent-2-100);color:var(--color-accent-2-800);font:700 calc(13px*var(--fs,1)) var(--font-body);min-height:44px;padding:0 14px")}>
                          Atur miqat
                        </button>
                      ) : null}
                      <button type="button" onClick={v.openTgl} style={css("border:0;border-radius:999px;background:var(--color-accent-100);color:var(--color-accent-800);font:700 calc(13px*var(--fs,1)) var(--font-body);min-height:44px;padding:0 14px")}>
                        Atur tanggal
                      </button>
                    </div>
                  </div>
                  {" "}
                  <div style={css("display:grid;gap:14px")}>
                    {" "}
                    {arr(v.riteGroups).map((gp, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:grid;gap:6px")}>
                        {" "}
                        <div style={css(`display:flex;justify-content:space-between;font-size:calc(13px*var(--fs,1));font-weight:700;color:${gp?.fg ?? ''};padding:0 6px`)}>
                          <span>
                            {txt(gp?.day)}
                          </span>
                          <span>
                            {txt(gp?.note)}
                          </span>
                        </div>
                        {" "}
                        <div style={css("background:var(--kartu-bg);border:1px solid var(--kartu-garis);border-radius:22px;box-shadow:var(--kartu-bayang);padding:2px 18px")}>
                          {" "}
                          {arr(gp?.items).map((r, i1) => (<React.Fragment key={i1}>
                            {" "}
                            <button type="button" className="ketuk" onClick={r?.on} style={css("display:flex;align-items:center;gap:12px;padding:12px 0;min-height:48px;border-bottom:1px solid var(--color-divider)")}>
                              <div aria-hidden="true" style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${r?.dotBg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
                                {r?.locked ? (<>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="11" width="16" height="10" rx="3" />
                                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                                  </svg>
                                </>) : null}
                                {txt(r?.mark)}
                              </div>
                              {" "}
                              <div style={css("flex:1;min-width:0")}>
                                {" "}
                                <div style={css(`font-weight:600;font-size:calc(14.5px*var(--fs,1));color:${r?.nameFg ?? ''}`)}>
                                  {txt(r?.n)}
                                </div>
                                {" "}
                                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);display:flex;gap:8px;align-items:center;flex-wrap:wrap")}>
                                  <span>
                                    {txt(r?.place)}
                                  </span>
                                  {r?.isNow ? (<>
                                    <span style={css("font-weight:800;color:var(--color-accent-700);display:flex;align-items:center;gap:4px")}>
                                      <span style={css("width:8px;height:8px;border-radius:50%;background:var(--color-accent-500)")}></span>
                                      Berjalan
                                    </span>
                                  </>) : null}
                                </div>
                                {" "}
                              </div>
                              {" "}
                              <span style={css(`font-size:calc(13px*var(--fs,1));padding:3px 10px;border-radius:999px;background:${r?.tagBg ?? ''};color:${r?.tagFg ?? ''}`)}>
                                {txt(r?.k)}
                              </span>
                              {" "}
                              <span style={css(`font-size:calc(13px*var(--fs,1));font-weight:700;min-width:56px;text-align:right;color:${r?.cntFg ?? ''}`)}>
                                {txt(r?.cnt)}
                                {r?.hasSus ? (<>
                                  <span style={css("display:block;color:var(--emas-teks)")}>
                                    {txt(r?.sus)}
                                  </span>
                                </>) : null}
                              </span>
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
                  </div>
                  {" "}
                </div>
              </div>
              </>)}
  </>);
}
