// Home tema Nusuk: kepala bergradasi dengan waktu sholat, ubin menu, kolom cari, lalu kartu kerja.
import React, { useEffect, useState } from 'react';
import { KOTA, waktuSholat, kotaTersimpan, simpanKota } from './waktu.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { borderRadius: 20, padding: 16, color: 'var(--color-text)', background: '#ffffff', display: 'grid', gap: 10, minWidth: 0 };
const redup = { fontSize: fs(12), color: 'var(--m-teks-2)', lineHeight: 1.45 };
const baris = { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 };
const ketuk = { border: 0, background: 'transparent', color: 'inherit', font: 'inherit', textAlign: 'left', padding: 0, cursor: 'pointer', width: '100%' };
const Ikon = ({ d, s = 22, t = 1.7 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={t} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}><path d={d} /></svg>;
const AWAS = 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const ORANG = 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6';
const CARI = 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5';
const PANAH = 'M5 12h14M13 6l6 6-6 6';
const AWAN_OK = 'M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10a4 4 0 0 1 0 8zM9 13l2 2 4-4';
const AWAN_TUNGGU = 'M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10a4 4 0 0 1 0 8zM12 10v3M12 15.5h.01';

const jamWas = d => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(':', '.');
const fmt = (o, d) => { try { return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', ...o }).format(d); } catch (e) { return ''; } };
function hijriah(d) {
  try { return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'long', year: 'numeric' }).format(d).replace(/\s*(AH|H)$/, '') + ' H'; }
  catch (e) { return ''; }
}

// Tombol status sinkron: ikon saja bila tersinkron; bila tidak, berlatar putih dan (di Home) menyebut keadaannya.
export function TombolSinkron({ v, ringkas }) {
  const teks = (v.hs && v.hs.text) || '', beres = /^Tersinkron/.test(teks);
  return (
    <button type="button" onClick={v.openSync} aria-label={'Status sinkron: ' + teks} className="mk-kaca-putih"
      style={{ minWidth: 44, minHeight: 44, borderRadius: 22, padding: beres || ringkas ? 0 : '0 12px 0 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, flex: 'none', cursor: 'pointer',
        background: beres ? undefined : '#ffffff', color: beres ? undefined : 'var(--color-text)', font: `500 ${fs(12.5)} var(--font-body)`, maxWidth: '52%' }}>
      <Ikon d={beres ? AWAN_OK : AWAN_TUNGGU} />
      {beres || ringkas ? null : <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teks}</span>}
    </button>
  );
}
export function TombolProfil({ v }) {
  return (
    <button type="button" onClick={v.keProfil} aria-label="Profil" style={{ width: 44, height: 44, borderRadius: 22, border: 0, flex: 'none', background: '#e9e9e9', color: '#1f1f1f', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
      <Ikon d={ORANG} />
    </button>
  );
}

// Cincin = bagian waktu yang sudah berjalan menuju sholat berikutnya.
function Cincin({ persen }) {
  const r = 23, k = 2 * Math.PI * r, sudut = (persen / 100) * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${k * persen / 100} ${k}`} transform="rotate(-90 26 26)" />
      <circle cx={26 + r * Math.cos(sudut)} cy={26 + r * Math.sin(sudut)} r="4.5" fill="#ffffff" />
    </svg>
  );
}

export function HomeKepala({ h, v }) {
  const [kota, setKota] = useState(() => kotaTersimpan(h && h.kota)), [buka, setBuka] = useState(false), [, tik] = useState(0);
  useEffect(() => { const t = setInterval(() => tik(x => x + 1), 30000); return () => clearInterval(t); }, []);
  const w = waktuSholat(kota), j = Math.floor(w.sisa / 3600000), mnt = Math.min(59, Math.ceil((w.sisa % 3600000) / 60000)), now = new Date();
  const pilih = k => { setKota(k); simpanKota(k); window.dispatchEvent(new Event('mk-kota')); };
  const sisa = (j ? j + ' jam ' : '') + mnt + ' menit lagi';
  return (
    <div style={{ background: '#ffffff', borderRadius: '0 0 28px 28px' }}>
      <div className="mk-gradasi" style={{ borderRadius: '0 0 28px 28px', padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 0', display: 'grid', gap: 12 }}>
        <div style={baris}>
          <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 1 }}>
            <span style={{ fontSize: fs(14), fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Assalamu'alaikum</span>
            <span style={{ fontSize: fs(12), lineHeight: 1.3, overflowWrap: 'anywhere' }}>{[v.ppihName, v.kloterLabel].filter(Boolean).join(' · ')}</span>
          </div>
          <TombolSinkron v={v} />
          <TombolProfil v={v} />
        </div>
        <div aria-hidden="true" style={{ height: 1, background: 'rgba(255,255,255,.25)' }} />
        <button type="button" onClick={() => setBuka(!buka)} aria-expanded={buka} aria-controls="mk-jadwal-sholat" style={{ ...ketuk, ...baris, gap: 14, minHeight: 56 }}>
          <Cincin persen={w.persen} />
          <span style={{ display: 'grid', minWidth: 0 }}>
            <span style={{ fontSize: fs(26), fontWeight: 300, lineHeight: 1.2 }}>{w.next.l} {jamWas(w.next.t)} WAS</span>
            <span style={{ fontSize: fs(12.5) }}>{sisa}{w.next.besok ? ' (besok)' : ''} · {kota}</span>
          </span>
        </button>
        <div style={{ fontSize: fs(12), textAlign: 'center' }}>{fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, now)} / {hijriah(now)}</div>
        {buka ? (
          <div id="mk-jadwal-sholat" style={{ display: 'grid', gap: 10 }}>
            <div role="group" aria-label="Kota" className="mk-kaca-putih" style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 24 }}>
              {Object.keys(KOTA).map(k => <button key={k} type="button" onClick={() => pilih(k)} aria-pressed={kota === k}
                style={{ flex: 1, minHeight: 40, border: 0, borderRadius: 20, cursor: 'pointer', font: `${kota === k ? 500 : 400} ${fs(13)} var(--font-body)`, background: kota === k ? '#ffffff' : 'transparent', color: kota === k ? '#1f1f1f' : '#ffffff' }}>{k}</button>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 4 }}>
              {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
                return <div key={x.l} style={{ minWidth: 0, textAlign: 'center', borderRadius: 12, padding: '8px 2px', background: on ? '#ffffff' : 'transparent', color: on ? '#1f1f1f' : '#ffffff' }}>
                  <div style={{ fontSize: fs(12), fontWeight: on ? 500 : 400 }}>{x.l}</div>
                  <div style={{ fontSize: fs(13.5), fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{jamWas(x.t)}</div>
                </div>; })}
            </div>
            <div style={{ fontSize: fs(12), textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>Sekarang WAS {v.clockWas} · WIB {v.clockWib}</div>
          </div>
        ) : null}
        <button type="button" onClick={() => setBuka(!buka)} aria-label={buka ? 'Tutup jadwal sholat' : 'Buka jadwal sholat lima waktu'} style={{ ...ketuk, minHeight: 44, display: 'grid', placeItems: 'center' }}>
          <span aria-hidden="true" style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.7)' }} />
        </button>
      </div>
      <div style={{ padding: '16px 12px 18px', display: 'grid', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(v.menuHome || []).length || 5}, minmax(0,1fr))`, gap: 4 }}>
          {(v.menuHome || []).map(m => <button key={m.l} type="button" className="mk-ubin-menu" onClick={m.on}><span><Ikon d={m.d} s={26} t={1.6} /></span><span>{m.l}</span></button>)}
        </div>
        <button type="button" onClick={v.cariJamaah} style={{ ...baris, gap: 10, minHeight: 48, padding: '0 16px', borderRadius: 24, border: '1px solid var(--m-tepi)', background: '#ffffff', color: 'var(--m-teks-2)', font: `400 ${fs(13.5)} var(--font-body)`, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ color: 'var(--color-text)', display: 'grid' }}><Ikon d={CARI} /></span>
          Cari nama atau nomor porsi
        </button>
      </div>
    </div>
  );
}

function Mutiara() {
  return (
    <div className="mk-gradasi mk-penuh" style={{ borderRadius: 20, padding: '10px 14px 18px', display: 'grid', gap: 2, textAlign: 'center' }}>
      <p lang="ar" dir="rtl" style={{ margin: 0, fontFamily: 'var(--font-arab)', fontSize: fs(22), lineHeight: 2.4 }}>خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا</p>
      <p style={{ margin: 0, fontSize: fs(13.5), lineHeight: 1.4 }}>Melayani jamaah haji adalah kehormatan bagi kami</p>
    </div>
  );
}

const Batang = ({ persen }) => <span aria-hidden="true" style={{ display: 'block', height: 6, borderRadius: 3, background: 'var(--trek)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: persen + '%', borderRadius: 3, background: 'var(--color-accent)' }} /></span>;
const merah = { color: 'var(--red-600)', display: 'grid', flex: 'none' };

function PeringatanPengingat({ h }) {
  const peringatan = h.peringatan || [], pengingat = h.pengingat || [], kh = h.khusus, kej = h.kejadian;
  const kosong = !peringatan.length && !pengingat.length && !(kh && kh.tanpa) && !(kej && kej.n);
  return (
    <div style={kartu}>
      <div style={baris}>
        <span style={{ flex: 1, minWidth: 0, fontSize: fs(16) }}>Peringatan & pengingat</span>
        <span className="mk-lencana">{h.simulasiJadwal ? 'Simulasi' : 'Jadwal riil'}</span>
      </div>
      {kosong && <div style={{ fontSize: fs(13.5), lineHeight: 1.45 }}>Alhamdulillah, semua kegiatan terjadwal sudah tuntas dicentang dan belum ada jadwal kegiatan berikutnya.</div>}
      {peringatan.map(p => { const sudah = Math.max(0, (p.tot || 0) - p.n), pr = p.tot ? Math.round(sudah / p.tot * 100) : 0;
        return (
          <button key={p.key} type="button" onClick={p.on} style={{ ...ketuk, display: 'grid', gap: 6, minHeight: 44, padding: '4px 0' }}>
            <span style={{ ...baris, alignItems: 'flex-start' }}>
              <span style={merah}><Ikon d={AWAS} /></span>
              <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><span style={{ fontSize: fs(13.5) }}>{p.label}</span><span style={redup}>{p.sub}</span></span>
              <span style={{ flex: 'none', fontSize: fs(13), fontWeight: 500, whiteSpace: 'nowrap' }}>{p.n} belum</span>
            </span>
            {p.tot > 0 && <><Batang persen={pr} /><span style={redup}>{sudah} dari {p.tot} jamaah sudah dicentang ({pr}%)</span></>}
          </button>
        ); })}
      {kh && kh.tanpa > 0 && <button type="button" onClick={kh.on} style={{ ...ketuk, ...baris, alignItems: 'flex-start', minHeight: 44, padding: '4px 0' }}>
        <span style={merah}><Ikon d={AWAS} /></span>
        <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><span style={{ fontSize: fs(13.5) }}>Jamaah khusus {kh.n}</span><span style={{ fontSize: fs(13), fontWeight: 500 }}>{kh.tanpa} belum punya pendamping</span></span>
      </button>}
      {kej && kej.n > 0 && <button type="button" onClick={kej.on} style={{ ...ketuk, ...baris, minHeight: 44, padding: '4px 0' }}>
        <span style={merah}><Ikon d={AWAS} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: fs(13.5) }}>Kejadian masih terbuka</span>
        <span style={{ flex: 'none', fontSize: fs(13), fontWeight: 500 }}>{kej.n}</span>
      </button>}
      {pengingat.length > 0 && <div style={{ display: 'grid', borderTop: '1px solid var(--color-divider)', paddingTop: 6 }}>
        {pengingat.map(p => (
          <button key={p.key} type="button" onClick={p.on} style={{ ...ketuk, ...baris, alignItems: 'flex-start', minHeight: 44, padding: '6px 0' }}>
            <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><span style={{ fontSize: fs(13.5) }}>{p.label}</span><span style={redup}>{p.sub}</span></span>
            <span style={{ flex: 'none', fontSize: fs(12.5), fontWeight: 500, whiteSpace: 'nowrap' }}>{p.kapan}</span>
          </button>
        ))}
      </div>}
      {h.tanpaTanggal && <div style={redup}>Menampilkan simulasi jadwal · atur tanggal riil lewat tombol Atur tanggal di Checklist.</div>}
    </div>
  );
}

function Berlangsung({ c, simulasi }) {
  return (
    <div style={{ ...kartu, gap: 6 }}>
      <div style={baris}>
        <span style={{ ...redup, flex: 1, minWidth: 0 }}>Sedang berlangsung{c.day ? ' · ' + c.day : ''}</span>
        {simulasi ? <span className="mk-lencana">Simulasi</span> : null}
      </div>
      <div style={{ ...baris, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: fs(22), fontWeight: 300, lineHeight: 1.25 }}>{c.n}</span>
        <span style={{ flex: 'none', fontSize: fs(14), fontWeight: 500 }}>{c.done} / {c.tot}</span>
      </div>
      <div style={redup}>{[c.mode, c.place, c.k, c.pct + '%'].filter(Boolean).join(' · ')}</div>
      <Batang persen={c.pct} />
      {c.ket && <div style={redup}>{c.ket}</div>}
      <button type="button" className="btn btn-primary" onClick={c.on} style={{ justifySelf: 'start', marginTop: 6, minHeight: 46, padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: fs(13.5) }}>
        Buka checklist <Ikon d={PANAH} s={18} />
      </button>
    </div>
  );
}

export default function HomeAtas({ h }) {
  if (!h) return null;
  return (
    <>
      <Mutiara />
      <PeringatanPengingat h={h} />
      {h.cur && <Berlangsung c={h.cur} simulasi={h.simulasiJadwal} />}
      {h.catatanData && <div className="mk-penuh" style={redup}>{h.catatanData}</div>}
    </>
  );
}
