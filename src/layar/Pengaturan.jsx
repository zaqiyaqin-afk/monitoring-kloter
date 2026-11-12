// Layar pengaturan awal dan layar terkunci (PIN).
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';

export default function Pengaturan({ v }) {
  return (<>
          {v.hasSetup ? (<>
            {" "}
            <div className="mk-layar" style={css("position:absolute;inset:0;background:var(--color-bg);z-index:25;overflow-y:auto")}>
              {" "}
              <div style={css("padding:56px 22px 32px;display:grid;gap:16px")}>
                {" "}
                <div>
                  {" "}
                  <div style={css("font-size:calc(14px*var(--fs,1));font-weight:500;color:var(--color-accent-700)")}>
                    Monitoring Ibadah Kloter
                  </div>
                  {" "}
                  <div style={css("font-weight:300;font-size:calc(22px*var(--fs,1));line-height:1.1;margin-top:4px")}>
                    Pengaturan
                  </div>
                  {" "}
                  <div style={css("font-size:calc(13.5px*var(--fs,1));line-height:1.5;color:var(--teks-3);margin-top:6px")}>
                    Lengkapi identitas petugas dan buat PIN untuk HP ini.
                  </div>
                  {" "}
                </div>
                <div className="kaca" style={css("border-radius:20px;padding:14px 16px;display:grid;gap:12px")}>
                  <div style={css("display:flex;align-items:center;justify-content:space-between;gap:8px")}>
                    <b style={css("font-size:calc(15px*var(--fs,1))")}>Identitas petugas</b>
                    <span style={css("font-size:calc(12px*var(--fs,1));font-weight:500;color:var(--red-600)")}>wajib diisi</span>
                  </div>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    Nama
                    <input className="input" value={v.su?.ppih ?? ''} onChange={v.suPpih} placeholder="Nama lengkap petugas" autoComplete="name" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                  </label>
                  <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    Tusi
                    <div style={css("height:46px;border-radius:14px;background:var(--color-accent-100);color:var(--color-accent-800);display:flex;align-items:center;padding:0 14px;font-size:calc(14px*var(--fs,1));font-weight:500")}>
                      PPIH Bimbingan Ibadah Kloter
                    </div>
                  </div>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    Kloter
                    <input className="input" value={v.su?.kloter ?? ''} onChange={v.suKloter} placeholder="mis. SOC-27" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                  </label>
                  <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    Embarkasi
                    <input className="input" list="daftar-embarkasi" value={v.su?.embarkasi ?? ''} onChange={v.suEmbarkasi} placeholder="Pilih dari daftar atau ketik sendiri" style={css("height:46px;font-size:calc(14px*var(--fs,1))")} />
                    <datalist id="daftar-embarkasi">
                      {arr(v.embarkasiList).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </datalist>
                  </label>
                  <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                    Gelombang
                    <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-bg);border-radius:999px;overflow:hidden;padding:4px;gap:4px")}>
                      {arr(v.suGelombang).map((m, i0) => (
                        <button key={i0} onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                          {txt(m?.l)}
                        </button>
                      ))}
                    </div>
                    <span style={css("font-size:calc(12px*var(--fs,1));font-weight:500;color:var(--teks-3)")}>{txt(v.suGelombangNote)}</span>
                  </div>
                </div>
                {v.suAkun ? (
                  <div style={css("background:var(--color-accent-100);color:var(--color-accent-800);border-radius:16px;padding:12px 14px;font-size:calc(13.5px*var(--fs,1));line-height:1.5")}>
                    <b>Data dari akun Anda.</b> Jamaah dan semua centang kloter {txt(v.su?.kloter)} diambil dari server aplikasi.
                  </div>
                ) : null}
                {" "}
                <div style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                  Perangkat ini{" "}
                  <div style={css("display:grid;grid-template-columns:1fr 1fr;background:var(--color-surface);border-radius:999px;overflow:hidden;padding:4px;gap:4px;box-shadow:inset 0 0 0 1px var(--m-tepi)")}>
                    {" "}
                    {arr(v.suDevices).map((m, i0) => (<React.Fragment key={i0}>
                      <button onClick={m?.on} style={css(`border:0;border-radius:999px;min-height:44px;padding:0;font:600 calc(13.5px*var(--fs,1)) var(--font-body);cursor:pointer;background:${m?.bg ?? ''};color:${m?.fg ?? ''}`)}>
                        {txt(m?.l)}
                      </button>
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <label style={css("display:grid;gap:6px;font-size:calc(13px*var(--fs,1));font-weight:500;color:var(--color-text)")}>
                  PIN aplikasi (4 angka · terkunci 5 menit setelah 5 kali salah)
                  <input className="input" value={v.su?.pin ?? ''} onChange={v.suPin} inputMode="numeric" maxLength="4" placeholder="••••" style={css("height:46px;font-size:calc(18px*var(--fs,1));letter-spacing:.3em")} />
                </label>
                {v.suHasErr ? (<>
                  <div style={css("background:var(--red-100);color:var(--red-700);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));font-weight:600;line-height:1.4")}>
                    {txt(v.su?.err)}
                  </div>
                </>) : null}
                {" "}
                {v.suHasOk ? (<>
                  <div style={css("background:var(--color-accent-100);color:var(--color-accent-800);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));font-weight:500;line-height:1.4")}>
                    {txt(v.su?.okMsg)}
                  </div>
                </>) : null}
                {" "}
                <div style={css("background:var(--color-bg);color:var(--color-text);border-radius:16px;padding:10px 14px;font-size:calc(13px*var(--fs,1));line-height:1.45")}>
                  <b>Butuh internet sekali saja.</b> Saat menekan “Mulai”, data jamaah diunduh ke HP ini. Setelah itu aplikasi bisa dipakai tanpa sinyal; semua centang tersimpan di HP dan terkirim otomatis begitu ada internet.
                </div>
                {" "}
                <button className="btn btn-primary" onClick={v.suConnect} disabled={v.su?.busy} style={css("height:50px;font-size:calc(16px*var(--fs,1))")}>
                  {txt(v.suCta)}
                </button>
                {" "}
                <button className="btn btn-ghost" onClick={v.suDemo} style={css("font-size:calc(14px*var(--fs,1))")}>
                  Coba dulu dengan data contoh
                </button>
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
          {v.locked ? (<>
            {" "}
            <div role="dialog" aria-modal="true" aria-label="Masukkan PIN" className="mk-gradasi" style={css("position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;padding:110px 32px 40px;box-sizing:border-box;gap:18px")}>
              <div style={css("font-size:calc(13px*var(--fs,1));font-weight:500;color:#fff")}>
                {txt(v.kloterLabel)}
              </div>
              <h1 style={css("margin:0;font-weight:300;font-size:calc(22px*var(--fs,1));line-height:1.1;text-align:center")}>
                Masukkan PIN
              </h1>
              <div aria-hidden="true" style={css("display:flex;gap:16px;margin:6px 0")}>
                {arr(v.pinDots).map((d, i0) => (<React.Fragment key={i0}>
                  <div style={css(`width:16px;height:16px;border-radius:50%;background:${d?.bg ?? ''};box-shadow:inset 0 0 0 2px #fff`)}></div>
                </React.Fragment>))}
              </div>
              <div role="status" style={css(`font-size:calc(13px*var(--fs,1));min-height:36px;text-align:center;line-height:1.4;color:#fff;font-weight:${String(v.pinMsgFg).includes('red') ? 700 : 400}`)}>
                {txt(v.pinMsg)}
              </div>
              <div style={css("display:grid;grid-template-columns:repeat(3,72px);gap:14px 22px;margin-top:auto")}>
                {arr(v.pinKeys).map((k, i0) => (<React.Fragment key={i0}>
                  <button type="button" className="pc2" onClick={k?.on} aria-label={k?.l === '⌫' ? 'Hapus satu angka' : undefined} style={css(`width:72px;height:72px;border-radius:50%;border:0;background:${k?.bg === 'transparent' ? 'transparent' : 'rgba(255,255,255,.16)'};color:#fff;font:600 calc(24px*var(--fs,1)) var(--font-body);visibility:${k?.vis ?? ''};opacity:${k?.op ?? ''}`)}>
                    {txt(k?.l)}
                  </button>
                </React.Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>) : null}
  </>);
}
