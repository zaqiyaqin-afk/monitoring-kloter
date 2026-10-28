// Menu Cetak: laporan PDF per kegiatan.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function MenuCetak({ v }) {
  return (<>
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
                  <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--color-divider)")}>
                    {" "}
                    {arr(v.prScopes).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
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
                        <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0 12px;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
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
                  <div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:6px")}>
                    {" "}
                    {arr(v.prRs).map((c, i0) => (<React.Fragment key={i0}>
                      <button onClick={c?.on} style={css(`width:100%;aspect-ratio:1;min-height:44px;max-width:48px;justify-self:center;padding:0;border-radius:50%;border:0;font:700 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
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
                      <button onClick={c?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13px*var(--fs,1)) var(--font-body);cursor:pointer;background:${c?.bg ?? ''};color:${c?.fg ?? ''}`)}>
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
  </>);
}
