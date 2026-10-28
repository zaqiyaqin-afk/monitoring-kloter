// Tampilan aplikasi. Dibuat dari template Claude Design lama lalu dirawat manual.
import React from 'react';
import { css, txt, arr } from './dc/runtime.js';
import HalamanBaru from './HalamanBaru.jsx';
import PilihIbadah from './PilihIbadah.jsx';
import DataJamaah from './DataJamaah.jsx';
import HomeAtas from './HomeAtas.jsx';

export default function View({ v }) {
  return (
    <>
      <div style={css(`color:var(--color-text);background:var(--mk-outer);font-family:var(--font-body);font-size:calc(15px*var(--fs,1));min-height:100vh;display:flex;justify-content:center;align-items:flex-start;padding:${v.outerPad ?? ''};box-sizing:border-box`)}>
        {" "}
        <div style={css(`width:${v.fW ?? ''};height:${v.fH ?? ''};border-radius:${v.fR ?? ''};background:var(--color-bg);overflow:hidden;position:relative;box-shadow:${v.fS ?? ''};border:${v.fB ?? ''};box-sizing:border-box;flex:none`)}>
          {" "}
          <div style={css("height:58px;display:flex;align-items:center;gap:10px;padding:0 16px 0 18px;box-sizing:border-box")}>
            {v.bisaKembali ? (
              <button onClick={v.kembali} aria-label="Kembali" style={css("width:40px;height:40px;border-radius:50%;flex:none;border:1px solid var(--kartu-garis);background:var(--kartu-bg);color:var(--color-accent-700);display:grid;place-items:center;cursor:pointer;margin-left:-6px")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            ) : null}
            <div ref={v.logoBox} onClick={v.openSync} aria-label="Profil" style={css("width:42px;height:42px;border-radius:50%;flex:none;background:var(--color-surface);overflow:hidden;display:grid;place-items:center;cursor:pointer;box-shadow:0 2px 10px rgba(16,40,30,.14)")}></div>
            <div style={css("flex:1;min-width:0;line-height:1.25")}>
              <div style={css("font-size:calc(12.5px*var(--fs,1));font-weight:600;color:var(--color-neutral-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                Assalamu'alaikum ·{" "}{txt(v.kloterLabel)}
              </div>
              <div style={css("font-weight:800;font-size:calc(16px*var(--fs,1));white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                {txt(v.ppihName)}
              </div>
            </div>
            <div style={css("flex:none;display:flex;align-items:center;gap:8px;height:36px;background:var(--color-surface);border-radius:12px;padding:0 10px;font-size:calc(13px*var(--fs,1));white-space:nowrap;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
              <span>
                <span style={css("color:var(--color-neutral-700);font-weight:600")}>
                  WAS
                </span>
                {" "}
                <b style={css("color:var(--color-accent-700);font-size:calc(14px*var(--fs,1))")}>
                  {txt(v.clockWas)}
                </b>
              </span>
              <span style={css("width:1px;height:18px;background:var(--color-divider)")}></span>
              <span>
                <span style={css("color:var(--color-neutral-700);font-weight:600")}>
                  WIB
                </span>
                {" "}
                <b style={css("color:var(--color-accent-2-500);font-size:calc(14px*var(--fs,1))")}>
                  {txt(v.clockWib)}
                </b>
              </span>
            </div>
          </div>
          {" "}
          <div style={css("height:38px;padding:0 20px;display:flex;align-items:center")}>
            <button onClick={v.openSync} aria-label="Status sinkron" style={css(`border:0;display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 12px;border-radius:999px;background:${v.hs?.bg ?? ''};color:${v.hs?.fg ?? ''};font:700 calc(13px*var(--fs,1)) var(--font-body);white-space:nowrap;cursor:pointer`)}>
              <span style={css(`width:10px;height:10px;border-radius:50%;background:${v.hs?.dot ?? ''};flex:none`)}></span>
              {txt(v.hs?.text)}
            </button>
          </div>
          {" "}
          <div ref={v.scrollRef} style={css("position:absolute;top:96px;bottom:76px;left:0;right:0;overflow-y:auto;overflow-x:hidden;padding-bottom:34px;box-sizing:border-box")}>
            {" "}
            {v.isMenu || v.isKirim || v.isProfil || v.isKejadian ? <HalamanBaru v={v} /> : null}
            {v.isBeranda ? (<>
              {" "}
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:18px")}>
                <HomeAtas h={v.home} />
                {v.net ? (
                  <button onClick={v.openSync} style={css(`border:0;text-align:left;cursor:pointer;font:inherit;display:flex;gap:12px;align-items:flex-start;border-radius:20px;padding:12px 14px;background:${v.net.bg};color:${v.net.fg}`)}>
                    <span style={css(`width:10px;height:10px;border-radius:50%;margin-top:5px;flex:none;background:${v.net.dot}`)}></span>
                    <span style={css("display:grid;gap:2px;min-width:0")}>
                      <b style={css("font-size:calc(14px*var(--fs,1))")}>{txt(v.net.title)}</b>
                      <span style={css("font-size:calc(12.5px*var(--fs,1));line-height:1.4")}>{txt(v.net.text)}</span>
                    </span>
                  </button>
                ) : null}
                {v.canInstall ? (
                  <button onClick={v.doInstall} className="btn btn-secondary" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")}>
                    Pasang aplikasi di layar utama HP
                  </button>
                ) : null}
              </div>
              {" "}
            </>) : null}
            {" "}
            {v.isJamaah ? (<>
              {" "}
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
                <div style={css("display:flex;gap:6px;background:var(--color-surface);border-radius:999px;padding:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                  {arr(v.jk?.segs).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:40px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                      {txt(m?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <input className="input" value={v.jl?.q ?? ''} onChange={v.onQuery} placeholder="Cari nama, nomor porsi, atau pendamping" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                {v.jk?.isAll ? (<>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {" "}
                    {arr(v.jl?.filters).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`flex:none;border:0;border-radius:999px;padding:8px 12px;box-shadow:inset 0 0 0 1px var(--color-divider);font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};display:flex;gap:6px;align-items:center`)}>
                        {txt(c?.l)}
                        <span style={css("font-weight:800;opacity:.8")}>
                          {txt(c?.n)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px")}>
                    {" "}
                    {arr(v.jl?.rs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`width:100%;aspect-ratio:1;max-width:44px;justify-self:center;padding:0;border-radius:50%;border:0;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
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
                        <button onClick={c?.on} style={css(`border:0;border-radius:999px;padding:8px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                          {txt(c?.l)}
                        </button>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 16px")}>
                    {" "}
                    {arr(v.jl?.rows).map((j, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                        {" "}
                        <div style={css(`width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:13px;background:${j?.avBg ?? ''};color:${j?.avFg ?? ''}`)}>
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
                              <span style={css("flex:none;font-size:calc(13px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:2px 7px;border-radius:999px;background:var(--red-600);color:#fff")}>
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
                        {" "}
                      </div>
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
                      <button onClick={c?.on} style={css(`flex:none;border:0;border-radius:999px;padding:8px 12px;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''};display:flex;gap:6px;align-items:center`)}>
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
                      <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 14px")}>
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
            </>) : null}
            {" "}
            {v.isChecklist ? (<>
              {v.ckPilih ? <PilihIbadah v={v} /> : (<>
              {" "}
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:16px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                    Checklist {txt(v.labelIbadah)}
                  </div>
                  <button onClick={v.kePilihIbadah} style={css("margin-top:6px;border:1px solid var(--color-divider);background:var(--color-surface);color:var(--color-accent-700);border-radius:999px;min-height:36px;padding:0 14px;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer")}>‹ Ganti ibadah</button>
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
                      <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
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
                      <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
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
                    <button className="btn btn-ghost" onClick={v.ckSetCur} style={css("justify-self:start;font-size:calc(13px*var(--fs,1));padding:4px 0")}>
                      Jadikan kegiatan yang sedang berlangsung
                    </button>
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                  {" "}
                  {arr(v.ckScopes).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`border:0;border-radius:999px;padding:9px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
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
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;padding:8px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <input className="input" value={v.ckQ ?? ''} onChange={v.onCkQ} placeholder="Cari jamaah · nama atau nomor porsi" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                <div style={css("background:var(--hero);border-radius:24px;padding:18px;color:#fff;position:relative;overflow:hidden;box-shadow:0 14px 26px -18px rgba(14,92,64,.9);display:grid;gap:12px")}>
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
                  <div style={css("height:8px;border-radius:99px;background:rgba(255,255,255,.22);overflow:hidden")}>
                    <div style={css(`height:100%;width:${v.ckSum?.pct ?? ''};background:var(--color-surface);border-radius:99px;transition:width .4s`)}></div>
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
                    <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 16px")}>
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
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:24px 16px;text-align:center;font-size:calc(14px*var(--fs,1));color:var(--color-neutral-700)")}>
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
                      <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:14px 14px 14px 16px;display:grid;gap:12px")}>
                        {" "}
                        <div style={css("display:flex;align-items:center;gap:12px")}>
                          {" "}
                          <div onClick={r?.onOpen} style={css("flex:1;min-width:0;cursor:pointer")}>
                            <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(18px*var(--fs,1));line-height:1.15")}>
                              {txt(r?.title)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                              {txt(r?.sub)}
                            </div>
                          </div>
                          {" "}
                          <span onClick={r?.onOpen} style={css(`font-size:calc(15px*var(--fs,1));font-weight:800;color:${r?.cntFg ?? ''};cursor:pointer;flex:none`)}>
                            {txt(r?.cnt)}
                          </span>
                          {" "}
                          <button onClick={r?.onCheck} aria-label="Centang semua" style={css(`width:44px;height:44px;flex:none;border-radius:14px;border:0;cursor:pointer;font:800 calc(20px*var(--fs,1)) var(--font-body);background:${r?.bg ?? ''};color:${r?.fg ?? ''};box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
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
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 14px")}>
                    {" "}
                    {arr(v.ckPeople).map((p, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:flex;align-items:center;gap:12px;min-height:60px;padding:10px 0;border-bottom:1px solid var(--color-divider)")}>
                        {" "}
                        <div onClick={p?.onOpen} style={css(`width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:13px;background:${p?.avBg ?? ''};color:${p?.avFg ?? ''};cursor:pointer`)}>
                          {txt(p?.ini)}
                        </div>
                        {" "}
                        <div onClick={p?.onOpen} style={css("flex:1;min-width:0;cursor:pointer")}>
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
                          {" "}
                        </div>
                        {" "}
                        {p?.canUl ? (<>
                          <button onClick={p?.onMore} aria-label="Menu · tandai perlu ulang" style={css("width:44px;height:44px;flex:none;border:0;border-radius:14px;background:transparent;cursor:pointer;font:800 calc(20px*var(--fs,1)) var(--font-body);color:var(--color-neutral-800)")}>
                            ⋯
                          </button>
                        </>) : null}
                        {" "}
                        <button onClick={p?.onCheck} aria-label="Centang" style={css(`width:44px;height:44px;flex:none;border-radius:14px;border:0;cursor:pointer;font:800 ${p?.mfs ?? ''} var(--font-body);background:${p?.cb ?? ''};color:${p?.cf ?? ''};box-shadow:inset 0 0 0 2px ${p?.cr ?? ''}`)}>
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
                  <button className="btn btn-primary" onClick={v.ckSum?.onAll} style={css("width:100%;height:52px;font-size:calc(15px*var(--fs,1));box-shadow:var(--shadow-lg)")}>
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
                        <button onClick={v.openMiqat} style={css("border:0;border-radius:999px;background:var(--color-accent-2-100);color:var(--color-accent-2-800);font:700 calc(13px*var(--fs,1)) var(--font-body);padding:8px 12px;cursor:pointer")}>
                          Atur miqat
                        </button>
                      ) : null}
                      <button onClick={v.openTgl} style={css("border:0;border-radius:999px;background:var(--color-accent-100);color:var(--color-accent-800);font:700 calc(13px*var(--fs,1)) var(--font-body);padding:8px 12px;cursor:pointer")}>
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
                            <div onClick={r?.on} style={css("display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                              {" "}
                              <div style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${r?.dotBg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
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
                                  <span style={css("display:block;color:#7a5200")}>
                                    {txt(r?.sus)}
                                  </span>
                                </>) : null}
                              </span>
                              {" "}
                            </div>
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
            </>) : null}
            {" "}
            {v.isBadal ? (<>
              {" "}
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
                    <button onClick={v.bd?.onAdd} style={css("flex:none;border:0;border-radius:999px;min-height:40px;padding:0 14px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:var(--color-accent-100);color:var(--color-accent-800)")}>
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
                <div style={css("display:flex;gap:6px;background:var(--color-surface);border-radius:999px;padding:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                  {arr(v.bd?.segs).map((m, i0) => (<React.Fragment key={i0}>
                    <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:40px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                      {txt(m?.l)}
                    </button>
                  </React.Fragment>))}
                </div>
                {" "}
                <input className="input" value={v.bd?.q ?? ''} onChange={v.bd?.onQ} placeholder="Cari jamaah atau pelaksana" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
                {" "}
                <div style={css("display:flex;gap:6px;overflow-x:auto;scrollbar-width:none")}>
                  {arr(v.bd?.days).map((d, i0) => (<React.Fragment key={i0}>
                    <button onClick={d?.on} style={css(`flex:none;border:0;border-radius:999px;min-height:40px;padding:0 16px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${d?.bg ?? ''};color:${d?.fg ?? ''};box-shadow:inset 0 0 0 1px var(--color-divider)`)}>
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
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 14px")}>
                    {" "}
                    {arr(v.bd?.rows).map((r, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div style={css("display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid var(--color-divider)")}>
                        {" "}
                        <span onClick={r?.on} style={css("width:40px;height:40px;border-radius:13px;flex:none;display:grid;place-items:center;font-weight:800;font-size:13px;background:var(--color-accent-2-100);color:var(--color-accent-2-700);cursor:pointer")}>
                          {txt(r?.ini)}
                        </span>
                        {" "}
                        <div style={css("flex:1;min-width:0")}>
                          {" "}
                          <div onClick={r?.on} style={css("cursor:pointer")}>
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
                          </div>
                          {" "}
                          <div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:8px")}>
                            {arr(r?.days).map((d, i1) => (<React.Fragment key={i1}>
                              <button onClick={d?.on} style={css(`border:0;border-radius:10px;min-height:34px;font:800 calc(12px*var(--fs,1)) var(--font-body);cursor:pointer;background:${d?.bg ?? ''};color:${d?.fg ?? ''}`)}>
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
                    <button onClick={v.bd?.onFab} style={css(`width:100%;height:52px;border:0;border-radius:999px;color:#fff;font:800 calc(15px*var(--fs,1)) var(--font-body);cursor:pointer;background:${v.bd?.fabBg ?? ''};box-shadow:var(--shadow-lg)`)}>
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
                    <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:12px 16px")}>
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
            </>) : null}
            {" "}
            {v.isRekap ? (<>
              {" "}
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
                      <span style={css("flex:none;font-size:calc(13px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:5px 10px;border-radius:999px;background:var(--red-600);color:#fff")}>
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
                    <button className="btn btn-ghost" onClick={v.askNotif} style={css("justify-self:start;font-size:calc(13px*var(--fs,1));padding:2px 0")}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:18px;display:grid;gap:14px")}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:18px 16px 14px")}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:18px 16px 8px")}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:18px 16px 8px")}>
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
                  <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:18px 16px 8px")}>
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
            </>) : null}
            {" "}
            {v.isCetak ? (<>
              {" "}
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:16px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.08")}>
                    Cetak kegiatan
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:4px")}>
                    Daftar jamaah atau rekap untuk dibagikan
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    Lembar
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:8px")}>
                    {arr(v.prSheets).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;border-radius:18px;min-height:56px;padding:8px 12px;text-align:left;cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${m?.ring ?? ''}`)}>
                        <div style={css("font-weight:700;font-size:calc(14px*var(--fs,1));line-height:1.2")}>
                          {txt(m?.l)}
                        </div>
                        <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                          {txt(m?.sub)}
                        </div>
                      </button>
                    </React.Fragment>))}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    Cakupan
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                    {" "}
                    {arr(v.prScopes).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;padding:9px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                {v.prIsRaud ? (<>
                  {" "}
                  <div style={css("display:grid;gap:8px")}>
                    {" "}
                    <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                      Jadwal Raudhoh
                    </div>
                    {" "}
                    <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                      {" "}
                      {arr(v.prSlots).map((c, i0) => (<React.Fragment key={i0}>
                        <button onClick={c?.on} style={css(`border:0;border-radius:999px;padding:7px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                          {txt(c?.l)}
                        </button>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.prShowR ? (<>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px")}>
                    {" "}
                    {arr(v.prRs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`width:100%;aspect-ratio:1;max-width:44px;justify-self:center;padding:0;border-radius:50%;border:0;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                {v.prShowG ? (<>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px")}>
                    {" "}
                    {arr(v.prGs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;padding:8px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </>) : null}
                {" "}
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    Pratinjau ·{" "}{txt(v.pr?.pages)}{" "}halaman A4 ·{" "}{txt(v.pr?.orientL)}
                  </div>
                  {" "}
                  <div style={css("background:var(--color-neutral-100);border-radius:20px;padding:16px 14px;box-shadow:var(--shadow-md);display:grid;gap:8px")}>
                    {" "}
                    <div style={css("display:flex;gap:10px;align-items:center;border-bottom:2px solid #16232B;padding-bottom:8px")}>
                      {" "}
                      <div style={css("width:30px;height:30px;border-radius:9px;background:#16232B;flex:none;box-shadow:inset 0 0 0 2px #E3A21A")}></div>
                      {" "}
                      <div style={css("min-width:0")}>
                        <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:16px;line-height:1.15")}>
                          {txt(v.pr?.title)}
                        </div>
                        <div style={css("font-size:13px;color:var(--color-neutral-700);margin-top:2px")}>
                          {txt(v.pr?.sub)}
                        </div>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={css(`display:grid;grid-template-columns:${v.pr?.cols ?? ''};gap:0 3px;align-items:stretch;font-size:10px;font-weight:700`)}>
                      {" "}
                      <span style={css("grid-column:span 2")}></span>
                      {" "}
                      {arr(v.pr?.groups).map((g, i0) => (<React.Fragment key={i0}>
                        <span style={css(`grid-column:${g?.col ?? ''};text-align:center;background:#16232B;color:#fff;border-radius:4px;padding:2px 3px;min-width:0;overflow-wrap:anywhere;hyphens:none`)}>
                          {txt(g?.label)}
                        </span>
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <div style={css(`display:grid;grid-template-columns:${v.pr?.cols ?? ''};gap:0 3px;align-items:end;font-size:10px;font-weight:700;color:var(--color-neutral-800);padding:2px 0 5px;border-bottom:1.5px solid var(--color-neutral-400)`)}>
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
                          <span style={css("color:var(--color-neutral-700)")}>
                            {txt(w?.no)}
                          </span>
                          {" "}
                          <span style={css("white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                            {txt(w?.name)}
                          </span>
                          {" "}
                          {arr(w?.cells).map((c, i1) => (<React.Fragment key={i1}>
                            <div style={css(`justify-self:center;min-width:16px;max-width:100%;height:16px;line-height:13px;padding:0 2px;border-radius:4px;box-sizing:border-box;border:1.5px solid ${c?.bd ?? ''};background:${c?.bg ?? ''};display:block;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px;font-weight:800;color:${c?.fg ?? ''}`)}>
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
                      <div style={css("font-size:13px;color:var(--color-neutral-700);text-align:center")}>
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
                    <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-800)")}>
                      <b style={css("color:var(--color-accent-700)")}>
                        ✓
                      </b>
                      {" "}selesai ·{" "}
                      <b style={css("background:#fdf0c4;color:#5a3f00;padding:0 4px;border-radius:3px")}>
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
                    <div style={css("display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px;font-size:calc(13px*var(--fs,1));color:var(--color-neutral-800);text-align:center;line-height:1.25")}>
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
                <button className="btn btn-primary" onClick={v.doPrint} style={css("width:100%;height:50px;font-size:calc(16px*var(--fs,1))")}>
                  Simpan PDF
                </button>
                {" "}
              </div>
              {" "}
            </>) : null}
            {" "}
          </div>
          {" "}
          <div style={css("position:absolute;bottom:0;left:0;right:0;height:76px;background:var(--nav-bg);border-top:1px solid var(--color-divider);box-shadow:0 -6px 18px -12px rgba(16,40,30,.18);display:grid;grid-template-columns:repeat(5,1fr);gap:2px;align-items:center;padding:0 6px 10px;box-sizing:border-box;z-index:3")}>
            {arr(v.tabs).map((t, i0) => (<React.Fragment key={i0}>
              {t?.fab ? (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:0;background:transparent;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:var(--color-text);cursor:pointer;padding:0`)}>
                  <span className="mk-fab" style={css(`width:58px;height:58px;margin-top:-30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#ecd08a,#c9a13c);color:${t?.fg ?? ''};outline:3px solid var(--nav-bg);box-shadow:0 0 0 2px ${t?.ring ?? ''}`)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  </span>
                  {txt(t?.l)}
                </button>
              ) : (
                <button onClick={t?.on} aria-label={t?.l} style={css(`border:0;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:700 calc(11.5px*var(--fs,1)) var(--font-body);color:${t?.fg ?? ''};cursor:pointer;border-radius:16px;background-color:${t?.bg ?? ''}`)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={t?.d} /></svg>
                  {txt(t?.l)}
                </button>
              )}
            </React.Fragment>))}
          </div>
          {" "}
          {v.hasSel ? (<>
            {" "}
            <div onClick={v.closeSel} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:5")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:88%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:16px;box-shadow:var(--shadow-lg)")}>
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
                    <span style={css("font-size:calc(13px*var(--fs,1));font-weight:800;padding:4px 10px;border-radius:999px;background:var(--red-600);color:#fff")}>
                      RISTI · risiko tinggi
                    </span>
                  </>) : null}
                  {" "}
                  <a href={v.sel?.tel} style={css("display:flex;align-items:center;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-accent-700);text-decoration:none;background:var(--color-accent-100);border-radius:999px;padding:6px 12px")}>
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
                    <span style={css(`flex:none;margin-top:2px;font-size:calc(12px*var(--fs,1));font-weight:800;letter-spacing:.04em;padding:4px 10px;border-radius:999px;color:#fff;background:${v.sel?.udz ? 'var(--red-600)' : 'var(--color-accent)'}`)}>
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
                          <button key={i0} onClick={c.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(12.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c.bg};color:${c.fg}`)}>{txt(c.l)}</button>
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
                      <button onClick={c?.on} style={css("border:0;border-radius:999px;padding:6px 11px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:var(--color-surface);color:var(--color-text);box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                        {txt(c?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:14px 16px;display:grid;gap:12px")}>
                  {" "}
                  <div style={css("font-weight:800;font-size:calc(15px*var(--fs,1))")}>
                    Kebutuhan khusus
                  </div>
                  {" "}
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.sk?.chips).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:40px;padding:0 14px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''};box-shadow:inset 0 0 0 1.5px ${c?.ring ?? ''}`)}>
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
                    <button className="btn btn-secondary" onClick={v.sk?.onPend} style={css("flex:none;height:40px;padding:0 16px")}>
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
                      <button className="btn btn-secondary" onClick={v.sk?.onPelb} style={css("flex:none;height:40px;padding:0 16px")}>
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
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 16px")}>
                    {" "}
                    {arr(v.sel?.rites).map((r, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div onClick={r?.on} style={css("display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                        {" "}
                        <div style={css(`width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${r?.bg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${r?.ring ?? ''}`)}>
                          {txt(r?.mark)}
                        </div>
                        {" "}
                        <div style={css("flex:1;min-width:0")}>
                          <div style={css("font-size:calc(14.5px*var(--fs,1));font-weight:600")}>
                            {txt(r?.n)}
                          </div>
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(r?.day)}
                          </div>
                          {r?.ubahTgl ? (
                            <button onClick={e => { e.stopPropagation(); r.ubahTgl(); }} style={css("margin-top:4px;border:1px solid var(--color-divider);background:var(--color-bg);border-radius:999px;padding:3px 10px;font:600 calc(12px*var(--fs,1)) var(--font-body);color:var(--color-accent-800);cursor:pointer")}>
                              {r.tglTxt ? 'Dilaksanakan ' + r.tglTxt + ' · ubah' : 'Atur tanggal pelaksanaan'}
                            </button>
                          ) : null}
                        </div>
                        {" "}
                        <span style={css(`font-size:calc(13px*var(--fs,1));color:${r?.fg ?? ''};font-weight:700;text-align:right`)}>
                          {txt(r?.st)}
                        </span>
                        {" "}
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
          {" "}
          {v.hasSlotDlg ? (<>
            {" "}
            <div onClick={v.closeSlotDlg} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
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
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
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
            <div onClick={v.closeSaf} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
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
            <div onClick={v.closeUl} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
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
                <div style={css("background:#fdf0c4;color:#5a3f00;border-radius:18px;padding:12px 14px;font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.4")}>
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
            <div onClick={v.closeSus} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
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
                        <div onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;min-height:48px;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                          <div style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;color:#fff;background:${j?.bg ?? ''};box-shadow:inset 0 0 0 2px ${j?.ring ?? ''}`)}>
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
                        </div>
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
                      <input className="input" value={v.ss?.pq ?? ''} onChange={v.susPq} placeholder="Cari petugas atau jamaah, atau ketik nama lain" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")} />
                      <div style={css("background:var(--color-surface);border-radius:20px;padding:2px 8px;max-height:200px;overflow-y:auto")}>
                        {arr(v.ss?.pOpts).map((o, i0) => (<React.Fragment key={i0}>
                          <div onClick={o?.on} style={css("display:grid;gap:1px;padding:9px 8px;min-height:44px;box-sizing:border-box;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                            <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                              {txt(o?.name)}
                            </div>
                            <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                              {txt(o?.sub)}
                            </div>
                          </div>
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
                    <input className="input" type="date" value={v.ss?.tgl ?? ''} max={v.ss?.max} onChange={v.susDate} style={css("height:48px")} />
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
                <div style={css("background:#fdf0c4;color:#5a3f00;border-radius:18px;padding:12px 14px;font-size:calc(14px*var(--fs,1));font-weight:700;line-height:1.4")}>
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
              <div className="dialog" onClick={v.stop} style={css("width:100%")}>
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
            <div onClick={v.closePicker} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:6")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;gap:14px;box-shadow:var(--shadow-lg)")}>
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
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 14px")}>
                    {" "}
                    {arr(v.pk?.jam).map((j, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div onClick={j?.on} style={css("display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--color-divider);cursor:pointer")}>
                        {" "}
                        <div style={css(`width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:calc(13px*var(--fs,1));font-weight:700;background:${j?.bg ?? ''};color:var(--color-bg);box-shadow:inset 0 0 0 2px ${j?.ring ?? ''}`)}>
                          {txt(j?.mark)}
                        </div>
                        {" "}
                        <div style={css("min-width:0;flex:1")}>
                          <div style={css("font-weight:600;font-size:calc(14px*var(--fs,1))")}>
                            {txt(j?.name)}
                          </div>
                          <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>
                            {txt(j?.sub)}
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
                <div style={css("display:grid;gap:8px")}>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));font-weight:600;color:var(--color-neutral-800)")}>
                    2. Pilih pelaksana
                  </div>
                  {" "}
                  <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                    {" "}
                    {arr(v.pk?.srcs).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;padding:9px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''};display:flex;gap:6px;justify-content:center`)}>
                        {txt(m?.l)}
                        <span style={css("opacity:.7")}>
                          {txt(m?.n)}
                        </span>
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  <input className="input" value={v.pk?.q ?? ''} onChange={v.pk?.onQ} placeholder="Cari nama, nomor porsi, atau ketik nama lain" style={css("height:44px;font-size:calc(15px*var(--fs,1))")} />
                  {" "}
                  <div style={css("background:var(--color-surface);border-radius:20px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:4px 8px;max-height:250px;overflow-y:auto")}>
                    {" "}
                    {arr(v.pk?.opts).map((o, i0) => (<React.Fragment key={i0}>
                      {" "}
                      <div onClick={o?.on} style={css(`display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:18px;cursor:pointer;background:${o?.bg ?? ''}`)}>
                        {" "}
                        <div style={css(`width:20px;height:20px;border-radius:50%;flex:none;background:${o?.dot ?? ''};box-shadow:inset 0 0 0 2px ${o?.ring ?? ''}, inset 0 0 0 5px var(--color-bg)`)}></div>
                        {" "}
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
                        {" "}
                      </div>
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
            <div style={css("position:absolute;inset:0;background:var(--color-neutral-200);z-index:8;display:flex;flex-direction:column")}>
              {" "}
              <div style={css("height:44px;flex:none")}></div>
              {" "}
              <div style={css("display:flex;align-items:center;gap:10px;padding:6px 16px 12px;flex:none")}>
                {" "}
                <button className="btn btn-ghost" onClick={v.closePdf} style={css("height:40px;padding:0 10px;font-size:calc(15px*var(--fs,1))")}>
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
            <div onClick={v.tglJadwal.tutup} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>{txt(v.tglJadwal.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-700)")}>
                  Ketik hari Hijriyah sesuai jadwal kloter, lalu pilih tanggal Masehinya. Jamaah yang melaksanakan <b>setelah</b> tanggal Masehi ini otomatis tercatat <b>Susulan</b>. Bisa diubah kapan saja, juga tanpa internet.
                </div>
                {arr(v.tglJadwal.groups).map((g, i0) => (
                  <div key={i0} style={css("background:var(--color-surface);border-radius:20px;padding:12px 14px;display:grid;gap:8px;box-shadow:0 1px 2px rgba(16,40,30,.05)")}>
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
                      <input className="input" type="date" value={g.tgl} onChange={g.onTgl} style={css("height:44px;font-size:calc(14px*var(--fs,1));flex:1 1 150px;min-width:0")} />
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
            <div onClick={v.fotoDlg.batal} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:8")}>
              <div onClick={v.stop} style={css("width:100%;max-height:94%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>Simpan foto kegiatan</div>
                <img src={v.fotoDlg.prev} alt="Pratinjau foto" style={css("width:100%;max-height:220px;object-fit:contain;border-radius:18px;background:#000")} />
                <div style={css("font-size:calc(12px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(v.fotoDlg.kb)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Kegiatan</div>
                <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {arr(v.fotoDlg.rites).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(12.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                </div>
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Cakupan</div>
                <div style={css("display:grid;grid-template-columns:repeat(3,1fr);background:var(--color-surface);border-radius:999px;padding:4px;gap:4px")}>
                  {arr(v.fotoDlg.scopes).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:0;border-radius:999px;padding:9px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                </div>
                {v.fotoDlg.showR ? <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>{arr(v.fotoDlg.rs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}</div> : null}
                {v.fotoDlg.showG ? <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>{arr(v.fotoDlg.gs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}</div> : null}
                <input className="input" value={v.fotoDlg.ket} onChange={v.fotoDlg.onKet} placeholder="Keterangan (boleh kosong)" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                <div style={css("display:grid;grid-template-columns:1fr 1.8fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.fotoDlg.batal} style={css("height:46px")}>Batal</button>
                  <button className="btn btn-primary" onClick={v.fotoDlg.simpan} style={css("height:46px")}>Simpan foto</button>
                </div>
              </div>
            </div>
          ) : null}
          {v.galeri ? (
            <div onClick={v.galeri.tutup} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:7")}>
              <div onClick={v.stop} style={css("width:100%;max-height:94%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>Foto kegiatan</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);line-height:1.45")}>
                  {v.pakaiAkun ? <>Foto disimpan di <b>penyimpanan kloter</b> (tertutup, hanya petugas kloter ini). Setelah terunggah, HP hanya menyimpan gambar kecilnya.</> : <>Foto disimpan di folder <b>Foto Kegiatan · (nama Sheet)</b> di Google Drive pemilik Sheet, per kegiatan lalu per tanggal. Setelah terunggah, HP hanya menyimpan gambar kecilnya.</>}
                </div>
                {v.galeri.kosong ? <div style={css("padding:20px;text-align:center;color:var(--color-neutral-700);font-size:calc(14px*var(--fs,1))")}>Belum ada foto.</div> : null}
                {v.galeri.adaAntre ? <button className="btn btn-secondary" onClick={v.galeri.unggah} style={css("height:44px")}>Unggah sekarang</button> : null}
                {arr(v.galeri.items).map((f, i0) => (
                  <div key={i0} style={css("display:flex;gap:12px;align-items:center;background:var(--color-surface);border-radius:18px;padding:10px")}>
                    {f.src ? <img src={f.src} alt="" style={css("width:64px;height:64px;object-fit:cover;border-radius:12px;flex:none")} /> : <div style={css("width:64px;height:64px;border-radius:12px;background:var(--color-neutral-200);flex:none")}></div>}
                    <div style={css("flex:1;min-width:0;display:grid;gap:2px")}>
                      <b style={css("font-size:calc(13.5px*var(--fs,1))")}>{txt(f.judul)}</b>
                      {f.sub ? <span style={css("font-size:calc(12px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(f.sub)}</span> : null}
                      <span style={css(`font-size:calc(12px*var(--fs,1));font-weight:700;color:${f.stFg}`)}>
                        {txt(f.st)}{f.link ? <> · <a href={f.link} onClick={f.buka} target="_blank" rel="noopener">buka</a></> : null}
                      </span>
                    </div>
                    <button onClick={f.hapus} aria-label="Hapus foto dari HP" style={css("border:0;background:transparent;color:var(--color-neutral-600);cursor:pointer;font-size:calc(12px*var(--fs,1));font-weight:700;flex:none")}>Hapus</button>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={v.galeri.tutup} style={css("height:46px")}>Tutup</button>
              </div>
            </div>
          ) : null}
          {v.mqDlg ? (
            <div onClick={v.mqDlg.batal} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:8")}>
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(19px*var(--fs,1))")}>{txt(v.mqDlg.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);line-height:1.45")}>
                  {txt(v.mqDlg.kloterInfo)}<br />Sekarang: {txt(v.mqDlg.ringkas)}
                </div>
                {arr(v.mqDlg.scopes).length ? (
                  <div style={css("display:grid;grid-template-columns:repeat(3,1fr);background:var(--color-surface);border-radius:999px;padding:4px;gap:4px")}>
                    {arr(v.mqDlg.scopes).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:0;border-radius:999px;padding:9px 0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                {v.mqDlg.showR ? (
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.mqDlg.rs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                {v.mqDlg.showG ? (
                  <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                    {arr(v.mqDlg.gs).map((s, i0) => <button key={i0} onClick={s.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:7px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${s.bg === 'transparent' ? 'var(--color-surface)' : s.bg};color:${s.fg}`)}>{txt(s.l)}</button>)}
                  </div>
                ) : null}
                <div style={css("font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>Pilih miqat atau ketik sendiri</div>
                <div style={css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {arr(v.mqDlg.opts).map((o, i0) => <button key={i0} onClick={o.on} style={css(`border:1px solid var(--color-divider);border-radius:999px;padding:8px 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${o.bg};color:${o.fg}`)}>{txt(o.l)}</button>)}
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
            <div onClick={v.tgJ.batal} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:8")}>
              <div onClick={v.stop} style={css("width:100%;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                <div style={css("font-weight:800;font-size:calc(18px*var(--fs,1))")}>Tanggal pelaksanaan</div>
                <div style={css("font-size:calc(14px*var(--fs,1));font-weight:600")}>{txt(v.tgJ.title)}</div>
                <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700)")}>{txt(v.tgJ.jadwal)}</div>
                <input className="input" type="date" value={v.tgJ.tgl} max={v.tgJ.max} onChange={v.tgJ.onTgl} style={css("height:48px;font-size:calc(15px*var(--fs,1))")} />
                {v.tgJ.hasil ? <div style={css(`border-radius:14px;padding:10px 12px;font-size:calc(13px*var(--fs,1));font-weight:700;background:${v.tgJ.hasilBg};color:${v.tgJ.hasilFg}`)}>{txt(v.tgJ.hasil)}</div> : null}
                <div style={css("display:grid;grid-template-columns:1fr 1.6fr;gap:8px")}>
                  <button className="btn btn-secondary" onClick={v.tgJ.batal} style={css("height:46px")}>Batal</button>
                  <button className="btn btn-primary" onClick={v.tgJ.simpan} style={css("height:46px")}>Simpan tanggal</button>
                </div>
              </div>
            </div>
          ) : null}
          {v.hasSync ? (<>
            {" "}
            <div onClick={v.closeSync} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:6")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:92%;overflow-y:auto;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 28px;box-sizing:border-box;display:grid;gap:16px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div style={css("display:flex;align-items:center;gap:12px")}>
                  {" "}
                  <div style={css("width:58px;height:58px;border-radius:50%;background:var(--color-surface);display:grid;place-items:center;box-shadow:0 2px 10px rgba(16,40,30,.14);flex:none")}>
                    <img src={v.logoSrc} alt="" style={css("width:40px;height:40px;display:block")} />
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
                    <div style={css("width:52px;height:52px;border-radius:50%;background:var(--color-accent-600);display:grid;place-content:center;text-align:center;line-height:1")}>
                      <div style={css("font-weight:800;font-size:calc(18px*var(--fs,1))")}>
                        {txt(v.syncPending)}
                      </div>
                      <div style={css("font-size:calc(9.5px*var(--fs,1));opacity:.85;margin-top:2px")}>
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
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:14px 16px;display:grid;gap:8px;font-size:calc(13px*var(--fs,1));line-height:1.45;color:var(--color-neutral-800)")}>
                  <b style={css("font-size:calc(14.5px*var(--fs,1));color:var(--color-text)")}>Cara kerja tanpa internet</b>
                  <span>• Semua centang, udzur, dan catatan langsung tersimpan di HP ini, walau tanpa sinyal.</span>
                  <span>• Begitu ada internet, data terkirim otomatis ke Google Sheet. Kiriman ulang tidak tercatat dua kali.</span>
                  <span>• Jangan hapus data browser/aplikasi atau ganti HP sebelum angka “antre” menjadi 0. Bila terpaksa, pilih “Simpan cadangan” dulu.</span>
                  {v.installHint ? <span style={css("color:var(--color-accent-800);font-weight:600")}>• {txt(v.installHint)}</span> : null}
                  {v.canInstall ? (
                    <button onClick={v.doInstall} className="btn btn-secondary" style={css("height:44px;font-size:calc(14px*var(--fs,1));margin-top:4px")}>
                      Pasang aplikasi di layar utama HP
                    </button>
                  ) : null}
                </div>
                {" "}
                <div style={css("background:var(--color-surface);border-radius:22px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22);padding:2px 16px")}>
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
                    <span style={css("width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:#FFF1DB;color:#C77700;flex:none")}>
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
                        Alamat sheet, kode rahasia, nama kloter, PIN
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
                    <div style={css("background:var(--color-surface);border-radius:18px;padding:10px 12px;box-shadow:0 1px 2px rgba(16,40,30,.05)")}>
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
          {" "}
          {v.hasPp ? (<>
            {" "}
            <div onClick={v.closePp} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:8")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:90%;overflow-y:auto;background:var(--color-bg);border-radius:30px 30px 0 0;padding:12px 18px 24px;box-sizing:border-box;display:grid;gap:12px;box-shadow:var(--shadow-lg)")}>
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
                      <button onClick={m?.on} style={css(`flex:1;border:0;border-radius:999px;min-height:38px;font:700 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {" "}
                <input className="input" value={v.pp?.q ?? ''} onChange={v.pp?.onQ} placeholder="Cari nama atau nomor porsi" style={css("height:46px;font-size:calc(15px*var(--fs,1));border-radius:999px")} />
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
                      <span style={css(`width:28px;height:28px;border-radius:9px;flex:none;display:grid;place-items:center;color:#fff;font-weight:800;background:${o?.mbg ?? ''};box-shadow:inset 0 0 0 2px ${o?.mring ?? ''}`)}>
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
          {" "}
          {v.hasToast ? (<>
            {" "}
            <div style={css(`position:absolute;left:16px;right:16px;bottom:${v.toastBottom ?? ''};background:#16232B;color:#fff;border-radius:999px;padding:8px 8px 8px 18px;min-height:44px;box-sizing:border-box;font-size:calc(13.5px*var(--fs,1));font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:10px;z-index:7`)}>
              {" "}
              <span>
                {txt(v.toastMsg)}
              </span>
              {" "}
              {v.hasUndo ? (<>
                <button onClick={v.doUndo} style={css("flex:none;border:0;border-radius:999px;height:34px;padding:0 14px;background:var(--color-accent-300);color:var(--color-accent-900);font:800 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer")}>
                  Batalkan
                </button>
              </>) : null}
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasWa ? (<>
            {" "}
            <div onClick={v.closeWa} style={css("position:absolute;inset:0;background:color-mix(in srgb, var(--color-neutral-900) 50%, transparent);display:flex;align-items:flex-end;z-index:9")}>
              {" "}
              <div onClick={v.stop} style={css("width:100%;max-height:90%;background:var(--color-bg);border-radius:36px 36px 0 0;padding:12px 20px 24px;box-sizing:border-box;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:12px;box-shadow:var(--shadow-lg)")}>
                {" "}
                <div style={css("width:44px;height:5px;border-radius:9px;background:var(--color-neutral-300);justify-self:center")}></div>
                {" "}
                <div>
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.15")}>
                    Rekap untuk WhatsApp
                  </div>
                  <div style={css("font-size:calc(13px*var(--fs,1));color:var(--color-neutral-700);margin-top:2px")}>
                    Periksa dulu, lalu salin atau kirim langsung
                  </div>
                </div>
                {" "}
                <pre style={css("margin:0;overflow:auto;background:var(--color-accent-100);border-radius:18px;padding:14px;font:500 calc(13px*var(--fs,1))/1.5 var(--font-body);white-space:pre-wrap;word-break:break-word;color:var(--color-text)")}>
                  {txt(v.waText)}
                </pre>
                {" "}
                <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:8px")}>
                  {" "}
                  <button className="btn btn-secondary" onClick={v.copyWa} style={css("height:48px;font-size:calc(15px*var(--fs,1))")}>
                    {txt(v.copyLabel)}
                  </button>
                  {" "}
                  <a href={v.waLink} target="_blank" rel="noopener" onClick={v.markRekap} style={css("height:48px;border-radius:999px;background:var(--color-accent-600);color:#fff;font:700 calc(15px*var(--fs,1)) var(--font-body);display:flex;align-items:center;justify-content:center;text-decoration:none")}>
                    Kirim ke WhatsApp
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.hasSetup ? (<>
            {" "}
            <div style={css("position:absolute;inset:0;background:var(--color-bg);z-index:25;overflow-y:auto")}>
              {" "}
              <div style={css("padding:56px 22px 32px;display:grid;gap:16px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-size:calc(13px*var(--fs,1));letter-spacing:.1em;text-transform:uppercase;font-weight:800;color:var(--color-accent-700)")}>
                    Monitoring Ibadah Kloter
                  </div>
                  {" "}
                  <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.1;margin-top:4px")}>
                    Pengaturan
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13.5px*var(--fs,1));line-height:1.5;color:var(--color-neutral-700);margin-top:6px")}>
                    Lengkapi identitas petugas, lalu hubungkan ke Google Sheet kloter Anda.
                  </div>
                  {" "}
                </div>
                <div style={css("background:var(--color-surface);border-radius:22px;padding:14px 16px;display:grid;gap:12px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22)")}>
                  <div style={css("display:flex;align-items:center;justify-content:space-between;gap:8px")}>
                    <b style={css("font-size:calc(15px*var(--fs,1))")}>Identitas petugas</b>
                    <span style={css("font-size:calc(12px*var(--fs,1));font-weight:700;color:var(--red-600)")}>wajib diisi</span>
                  </div>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Nama
                    <input className="input" value={v.su?.ppih ?? ''} onChange={v.suPpih} placeholder="Nama lengkap petugas" autoComplete="name" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                  </label>
                  <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Tusi
                    <div style={css("height:46px;border-radius:14px;background:var(--color-accent-100);color:var(--color-accent-800);display:flex;align-items:center;padding:0 14px;font-size:calc(14px*var(--fs,1));font-weight:700")}>
                      PPIH Bimbingan Ibadah Kloter
                    </div>
                  </div>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Kloter
                    <input className="input" value={v.su?.kloter ?? ''} onChange={v.suKloter} placeholder="mis. SOC-27" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                  </label>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Embarkasi
                    <input className="input" list="daftar-embarkasi" value={v.su?.embarkasi ?? ''} onChange={v.suEmbarkasi} placeholder="Pilih dari daftar atau ketik sendiri" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                    <datalist id="daftar-embarkasi">
                      {arr(v.embarkasiList).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </datalist>
                  </label>
                  <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                    Gelombang
                    <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-bg);border-radius:999px;overflow:hidden;padding:4px;gap:4px")}>
                      {arr(v.suGelombang).map((m, i0) => (
                        <button key={i0} onClick={m?.on} style={css(`border:0;border-radius:999px;padding:10px 0;font:600 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                          {txt(m?.l)}
                        </button>
                      ))}
                    </div>
                    <span style={css("font-size:calc(12px*var(--fs,1));font-weight:500;color:var(--color-neutral-700)")}>{txt(v.suGelombangNote)}</span>
                  </div>
                </div>
                {v.suSb ? (
                  <div style={css("background:var(--color-accent-100);color:var(--color-accent-800);border-radius:16px;padding:12px 14px;font-size:calc(13.5px*var(--fs,1));line-height:1.5")}>
                    <b>Data dari akun Anda.</b> Jamaah dan semua centang kloter {txt(v.su?.kloter)} diambil dari server aplikasi. Tidak perlu alamat Sheet atau kode rahasia.
                  </div>
                ) : (<>
                <b style={css("font-size:calc(15px*var(--fs,1));margin-top:4px")}>Koneksi Google Sheet</b>
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Web App URL
                  <input className="input" value={v.su?.url ?? ''} onChange={v.suUrl} placeholder="https://script.google.com/macros/s/…/exec" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                </label>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Kode rahasia
                  <input className="input" type="password" autoComplete="off" value={v.su?.key ?? ''} onChange={v.suKey} placeholder="Angka, sama dengan kode di menu Atur kode rahasia" inputMode="numeric" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                </label>
                </>)}
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  Perangkat ini{" "}
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:0 1px 2px rgba(16,40,30,.06)")}>
                    {" "}
                    {arr(v.suDevices).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;padding:10px 0;font:600 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                  PIN aplikasi (4 angka · terkunci 5 menit setelah 5 kali salah)
                  <input className="input" value={v.su?.pin ?? ''} onChange={v.suPin} inputMode="numeric" maxLength="4" placeholder="••••" style={css("height:46px;font-size:calc(18px*var(--fs,1));letter-spacing:.3em")} />
                </label>
                {v.suLive && v.suSheet ? (
                  <div style={css("background:var(--color-surface);border-radius:22px;padding:14px 16px;display:grid;gap:12px;box-shadow:0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22)")}>
                    <b style={css("font-size:calc(15px*var(--fs,1))")}>Pengaturan Sheet</b>
                    <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                      Jam pengingat email harian (waktu Arab Saudi, 0–23)
                      <div style={css("display:flex;gap:8px")}>
                        <input className="input" value={v.suJam ?? ''} onChange={v.suJamIn} inputMode="numeric" maxLength="2" style={css("height:46px;font-size:calc(15px*var(--fs,1));flex:1")} />
                        <button className="btn btn-secondary" onClick={v.suJamSave} style={css("height:46px;padding:0 18px")}>Simpan jam</button>
                      </div>
                    </label>
                    <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:700;color:var(--color-neutral-800)")}>
                      Ganti kode rahasia (butuh internet)
                      <div style={css("display:flex;gap:8px")}>
                        <input className="input" type="password" autoComplete="new-password" value={v.suKodeBaru} onChange={v.suKodeIn} inputMode="numeric" placeholder="Kode baru, min. 4 angka" style={css("height:46px;font-size:calc(14px*var(--fs,1));flex:1;min-width:0")} />
                        <button className="btn btn-secondary" onClick={v.suKodeSave} disabled={v.su?.gantiBusy} style={css("height:46px;padding:0 18px")}>{txt(v.suKodeCta)}</button>
                      </div>
                    </label>
                  </div>
                ) : null}
                {v.suHasErr ? (<>
                  <div style={css("background:var(--red-100);color:var(--red-700);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));font-weight:600;line-height:1.4")}>
                    {txt(v.su?.err)}
                  </div>
                </>) : null}
                {" "}
                {v.suHasOk ? (<>
                  <div style={css("background:var(--color-accent-100);color:var(--color-accent-800);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));font-weight:700;line-height:1.4")}>
                    {txt(v.su?.okMsg)}
                  </div>
                </>) : null}
                {" "}
                <div style={css("background:var(--color-accent-2-100);color:var(--color-accent-2-800);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));line-height:1.45")}>
                  <b>Butuh internet sekali saja.</b> Saat menekan “Hubungkan”, data jamaah diunduh ke HP ini. Setelah itu aplikasi bisa dipakai tanpa sinyal; semua centang tersimpan di HP dan terkirim otomatis begitu ada internet.
                </div>
                <button className="btn btn-secondary" onClick={v.suTest} disabled={v.su?.testing} style={css("height:46px;font-size:calc(15px*var(--fs,1))")}>
                  {txt(v.suTestCta)}
                </button>
                {" "}
                <button className="btn btn-primary" onClick={v.suConnect} disabled={v.su?.busy} style={css("height:50px;font-size:calc(16px*var(--fs,1))")}>
                  {txt(v.suCta)}
                </button>
                {" "}
                {v.suSheet ? (
                <button className="btn btn-ghost" onClick={v.suDemo} style={css("font-size:calc(14px*var(--fs,1))")}>
                  Coba dulu dengan data contoh
                </button>
                ) : null}
                {" "}
                {v.suCanClose ? (<>
                  <button className="btn btn-secondary" onClick={v.suClose} style={css("height:44px")}>
                    Tutup
                  </button>
                </>) : null}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
          {v.locked ? (<>
            {" "}
            <div style={css("position:absolute;inset:0;background:var(--color-accent);color:#fff;z-index:20;display:flex;flex-direction:column;align-items:center;padding:110px 32px 40px;box-sizing:border-box;gap:18px")}>
              {" "}
              <div style={css("font-size:calc(13px*var(--fs,1));letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--color-accent-200)")}>
                {txt(v.kloterLabel)}
              </div>
              {" "}
              <div style={css("font-family:var(--font-heading);font-weight:800;letter-spacing:-.01em;font-size:calc(22px*var(--fs,1));line-height:1.1;text-align:center")}>
                Masukkan PIN
              </div>
              {" "}
              <div style={css("display:flex;gap:16px;margin:6px 0")}>
                {" "}
                {arr(v.pinDots).map((d, i0) => (<React.Fragment key={i0}>
                  <div style={css(`width:16px;height:16px;border-radius:50%;background:${d?.bg ?? ''};box-shadow:inset 0 0 0 2px #fff`)}></div>
                </React.Fragment>))}
                {" "}
              </div>
              {" "}
              <div style={css(`font-size:calc(13px*var(--fs,1));min-height:36px;text-align:center;line-height:1.4;color:${v.pinMsgFg ?? ''}`)}>
                {txt(v.pinMsg)}
              </div>
              {" "}
              <div style={css("display:grid;grid-template-columns:repeat(3,72px);gap:14px 22px;margin-top:auto")}>
                {" "}
                {arr(v.pinKeys).map((k, i0) => (<React.Fragment key={i0}>
                  <button className="pc2" onClick={k?.on} style={css(`width:72px;height:72px;border-radius:50%;border:0;background:${k?.bg ?? ''};color:#fff;font:600 calc(24px*var(--fs,1)) var(--font-body);cursor:pointer;visibility:${k?.vis ?? ''};opacity:${k?.op ?? ''}`)}>
                    {txt(k?.l)}
                  </button>
                </React.Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
          {" "}
        </div>
      </div>
    </>
  );
}
