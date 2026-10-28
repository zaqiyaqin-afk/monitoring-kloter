// Home gaya "Emas Klasik": kata mutiara, waktu sholat (WAS) + tanggal hijriah, jamaah kloter (termasuk jamaah khusus),
// belum dicentang, kegiatan berikutnya, sedang berlangsung, dan perjalanan Haji/Umrah/Madinah.
// Kartu selalu hijau tua berbingkai emas (terang maupun gelap). Waktu sholat dihitung di HP (Umm al-Qura), jalan tanpa internet.
import React, { useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Latar, EMAS, IKON_IBADAH, WARNA_IBADAH } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { position: 'relative', overflow: 'hidden', borderRadius: 24, padding: 18, background: EMAS.kartu, border: '1px solid ' + EMAS.tepi, color: EMAS.teks, display: 'grid', gap: 12, minWidth: 0 };
const atas = { position: 'relative' };
const judul = { fontSize: fs(12), fontWeight: 800, letterSpacing: '.1em', color: EMAS.utama, textTransform: 'uppercase' };
const serif = 'Fraunces, Georgia, serif';
// Satu gradasi untuk kartu yang disorot (teks Arab, sedang berlangsung); merah dan emas hanya untuk status.
const SOROTAN = 'radial-gradient(circle at 50% 0%, #1f7a56 0%, #0c3f2d 70%)';
const tombolEmas = { border: 0, borderRadius: 14, padding: '11px 18px', minHeight: 44, background: `linear-gradient(160deg, var(--emas-muda), ${EMAS.tua})`, color: 'var(--emas-gelap)', font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer', justifySelf: 'start' };
const Ikon = ({ d, s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const AWAS = 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const JAM = 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z';

const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const NAMA = [['fajr', 'Subuh'], ['dhuhr', 'Dzuhur'], ['asr', 'Ashar'], ['maghrib', 'Magrib'], ['isha', 'Isya']];
const jamWas = d => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(':', '.');
const tglWas = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);
const fmt = (o, d) => { try { return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', ...o }).format(d); } catch (e) { return ''; } };
function hijriah(d) {
  try { return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'long', year: 'numeric' }).format(d).replace(/\s*(AH|H)$/, '') + ' H'; }
  catch (e) { return ''; }
}

// Tanggal kalender Arab Saudi sebagai Date lokal untuk adhan (yang memakai tahun-bulan-hari)
function hariSaudi(geser = 0) { const [y, m, d] = tglWas(new Date()).split('-').map(Number); return new Date(y, m - 1, d + geser); }

function waktuSholat(kota) {
  const [lat, lng] = KOTA[kota], p = CalculationMethod.UmmAlQura(), c = new Coordinates(lat, lng);
  const hari = new PrayerTimes(c, hariSaudi(), p), besok = new PrayerTimes(c, hariSaudi(1), p), kemarin = new PrayerTimes(c, hariSaudi(-1), p), now = Date.now();
  const daftar = NAMA.map(([k, l]) => ({ l, t: hari[k] }));
  const i = daftar.findIndex(x => x.t.getTime() > now);
  const next = i >= 0 ? daftar[i] : { l: 'Subuh', t: besok.fajr, besok: true };
  const prev = i > 0 ? daftar[i - 1].t : i === 0 ? kemarin.isha : daftar[4].t;
  const jarak = next.t.getTime() - prev.getTime();
  return { daftar, next, sisa: next.t.getTime() - now, persen: jarak > 0 ? Math.min(100, Math.max(0, 100 - ((next.t.getTime() - now) / jarak) * 100)) : 0 };
}

function Mutiara() {
  return (
    <div style={{ ...kartu, textAlign: 'center', gap: 6, padding: '26px 20px 22px', background: SOROTAN, border: '1.5px solid ' + EMAS.tua, boxShadow: `0 0 0 4px var(--color-bg), 0 0 0 5px ${EMAS.garis}` }}>
      <Latar jenis="kabah" style={{ width: 230, left: '50%', marginLeft: -115, bottom: -40, opacity: 0.16 }} />
      <p lang="ar" dir="rtl" style={{ ...atas, margin: 0, fontFamily: 'var(--font-arab)', fontSize: fs(26), color: EMAS.muda, lineHeight: 2.2 }}>خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا</p>
      <div aria-hidden="true" style={{ ...atas, height: 1, width: '50%', justifySelf: 'center', background: `linear-gradient(90deg, transparent, ${EMAS.utama}, transparent)` }} />
      <p style={{ ...atas, margin: 0, fontFamily: 'var(--font-arti)', fontSize: fs(17), fontStyle: 'italic', fontWeight: 400, lineHeight: 1.4 }}>Melayani jamaah haji adalah kehormatan bagi kami</p>
    </div>
  );
}

function Sholat({ kotaAwal }) {
  const [kota, setKota] = useState(() => { try { return localStorage.getItem('mk.kota') || kotaAwal; } catch (e) { return kotaAwal; } });
  const [, tik] = useState(0);
  useEffect(() => { const t = setInterval(() => tik(x => x + 1), 30000); return () => clearInterval(t); }, []);
  const w = waktuSholat(kota), j = Math.floor(w.sisa / 3600000), mnt = Math.ceil((w.sisa % 3600000) / 60000), now = new Date();
  const pilih = k => { setKota(k); try { localStorage.setItem('mk.kota', k); } catch (e) {} };
  return (
    <div style={kartu}>
      <Latar jenis="masjid" style={{ width: 220, right: -30, top: 26, opacity: 0.13 }} />
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          <span style={judul}>Waktu sholat · {kota}</span>
          <span style={{ fontSize: fs(13.5), fontWeight: 700 }}>{hijriah(now)}</span>
          <span style={{ fontSize: fs(12), color: EMAS.redup }}>{fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, now)}</span>
        </div>
        <div style={{ display: 'flex', gap: 3, padding: 3, borderRadius: 999, border: '1px solid ' + EMAS.tepi, flex: 'none' }}>
          {Object.keys(KOTA).map(k => <button key={k} onClick={() => pilih(k)} aria-pressed={kota === k}
            style={{ border: 0, borderRadius: 999, padding: '6px 12px', minHeight: 44, font: `700 ${fs(12)} var(--font-body)`, cursor: 'pointer', background: kota === k ? EMAS.utama : 'transparent', color: kota === k ? 'var(--emas-gelap)' : 'var(--teks-gelap-2)' }}>{k}</button>)}
        </div>
      </div>
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div style={{ width: 'calc(84px*var(--fs,1))', height: 'calc(84px*var(--fs,1))', borderRadius: '50%', flex: 'none', background: `conic-gradient(${EMAS.utama} 0 ${w.persen}%, var(--kartu-trek) ${w.persen}% 100%)`, display: 'grid', placeItems: 'center' }} aria-hidden="true">
          <div style={{ width: 'calc(70px*var(--fs,1))', height: 'calc(70px*var(--fs,1))', borderRadius: '50%', background: 'var(--kartu-gelap)', display: 'grid', placeItems: 'center', alignContent: 'center' }}>
            <span style={{ fontSize: fs(j ? 19 : 17), fontWeight: 800, color: EMAS.muda, lineHeight: 1.1 }}>{j ? `${j}:${String(mnt === 60 ? 59 : mnt).padStart(2, '0')}` : mnt}</span>
            <span style={{ fontSize: fs(11), color: EMAS.redup }}>{j ? 'jam lagi' : 'menit lagi'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: fs(13), color: EMAS.redup }}>Berikutnya{w.next.besok ? ' (besok)' : ''}</span>
          <span style={{ fontFamily: serif, fontSize: fs(34), fontWeight: 700, lineHeight: 1 }}>{w.next.l}</span>
          <span style={{ fontSize: fs(22), fontWeight: 800, color: EMAS.utama }}>{jamWas(w.next.t)}</span>
        </div>
      </div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 5 }}>
        {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
          return <div key={x.l} style={{ minWidth: 0, textAlign: 'center', borderRadius: 12, padding: '8px 0', background: on ? `linear-gradient(160deg, var(--emas-muda), ${EMAS.tua})` : 'rgba(16,42,32,.75)', border: on ? 0 : '1px solid var(--kartu-tepi)', color: on ? 'var(--emas-gelap)' : EMAS.teks }}>
            <div style={{ fontSize: fs(12), fontWeight: on ? 700 : 600, color: on ? 'var(--emas-gelap)' : EMAS.redup }}>{x.l}</div>
            <div style={{ fontSize: fs(13.5), fontWeight: 800 }}>{jamWas(x.t)}</div>
          </div>; })}
      </div>
    </div>
  );
}

function Kotak({ n, l, on, merah }) {
  return (
    <button onClick={on} disabled={!on} style={{ minWidth: 0, textAlign: 'left', border: 0, borderTop: '2px solid ' + (merah ? 'var(--merah-garis)' : EMAS.utama), borderRadius: 16, padding: '10px', background: merah ? 'rgba(58,26,23,.92)' : 'rgba(26,58,45,.92)', color: EMAS.teks, cursor: on ? 'pointer' : 'default', font: 'inherit', display: 'grid', gap: 1 }}>
      <span style={{ fontSize: fs(21), fontWeight: 800, lineHeight: 1.15 }}>{n}</span>
      <span style={{ fontSize: fs(12), color: merah ? 'var(--merah-teks)' : 'var(--teks-gelap-2)', overflowWrap: 'anywhere' }}>{l}</span>
    </button>
  );
}

function Jamaah({ h }) {
  const r = Object.fromEntries(h.ringkas.map(x => [x.l, x])), L = r['Laki-laki'].n, P = r['Perempuan'].n, isi = L + P || 1;
  return (
    <div style={kartu}>
      <Latar jenis="kumpul" style={{ width: 300, right: -40, top: 4, opacity: 0.11 }} />
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={judul}>Jamaah kloter</span>
        <span style={{ fontFamily: serif, fontSize: fs(30), fontWeight: 700, color: EMAS.muda, lineHeight: 1 }}>{h.total}</span>
      </div>
      <div style={{ ...atas, display: 'flex', height: 10, borderRadius: 9, overflow: 'hidden', background: 'var(--kartu-trek)' }} aria-hidden="true">
        <div style={{ width: (L / isi * 100) + '%', background: 'var(--hijau-status)' }} /><div style={{ width: (P / isi * 100) + '%', background: EMAS.tua }} />
      </div>
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: fs(13), flexWrap: 'wrap' }}><span>Laki-laki <b>{L}</b></span><span>Perempuan <b>{P}</b></span></div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(92px*var(--fs,1)), 1fr))', gap: 8 }}>
        {['Lansia', 'Risti', 'Kursi roda', 'Didampingi', 'Udzur'].map(l => <Kotak key={l} n={r[l].n} l={l} on={r[l].on} merah={l === 'Risti'} />)}
        {h.kejadian && <Kotak n={h.kejadian.n} l="Kejadian" on={h.kejadian.on} merah={h.kejadian.n > 0} />}
      </div>
      {h.khusus && <button onClick={h.khusus.on} style={{ ...atas, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 14, padding: '10px 12px', background: 'rgba(232,207,134,.10)', border: '1px dashed var(--emas-cincin)', color: EMAS.teks, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
        <span style={{ color: EMAS.utama, flex: 'none', display: 'grid' }}><Ikon d={AWAS} /></span>
        <span style={{ fontSize: fs(13), lineHeight: 1.4, minWidth: 0 }}>Jamaah khusus <b>{h.khusus.n}</b> · <span style={{ color: h.khusus.tanpa ? 'var(--merah-teks)' : 'var(--hijau-muda)' }}>{h.khusus.tanpa ? h.khusus.tanpa + ' belum punya pendamping' : 'semua sudah punya pendamping'}</span></span>
      </button>}
      {h.catatanData && <div style={{ ...atas, fontSize: fs(12), color: EMAS.redup, lineHeight: 1.45 }}>{h.catatanData}</div>}
    </div>
  );
}

const Lencana = ({ ikon, bg, fg }) => <span style={{ width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', background: bg, color: fg, flex: 'none' }}><Ikon d={ikon} /></span>;

function Belum({ items }) {
  return (
    <div style={{ ...kartu, background: 'linear-gradient(160deg, var(--merah-latar) 0%, var(--kartu-gelap) 60%)', borderColor: 'var(--merah-tua)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lencana ikon={AWAS} bg="var(--merah-tua)" fg="var(--merah-teks)" />
        <div style={{ display: 'grid' }}><span style={{ ...judul, color: 'var(--merah-judul)' }}>Belum dicentang</span><span style={{ fontSize: fs(12), color: 'var(--merah-redup)' }}>Kegiatan sudah lewat</span></div>
      </div>
      {items.map(p => { const sudah = Math.max(0, (p.tot || 0) - p.n), pr = p.tot ? Math.round(sudah / p.tot * 100) : 0;
        return <button key={p.key} onClick={p.on} style={{ display: 'grid', gap: 8, borderRadius: 16, padding: 12, background: 'rgba(27,51,40,.92)', border: 0, color: EMAS.teks, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(14.5) }}>{p.label}</b><br /><span style={{ fontSize: fs(12), color: EMAS.redup }}>{p.sub}</span></span>
            <span style={{ flex: 'none', fontSize: fs(13), fontWeight: 800, padding: '5px 10px', borderRadius: 999, background: 'var(--merah-tua)', color: 'var(--merah-teks)', whiteSpace: 'nowrap' }}>{p.n} jamaah ›</span>
          </span>
          {p.tot > 0 && <>
            <span style={{ height: 6, borderRadius: 9, background: 'var(--merah-trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: pr + '%', borderRadius: 9, background: `linear-gradient(90deg, var(--hijau-status), ${EMAS.utama})` }} /></span>
            <span style={{ fontSize: fs(11.5), color: EMAS.redup }}>{sudah} dari {p.tot} sudah dicentang</span>
          </>}
        </button>; })}
    </div>
  );
}

function Berikutnya({ items }) {
  return (
    <div style={{ ...kartu, background: 'linear-gradient(160deg, var(--emas-latar) 0%, var(--kartu-gelap) 60%)', borderColor: EMAS.garis }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lencana ikon={JAM} bg={`linear-gradient(160deg, var(--emas-muda), ${EMAS.tua})`} fg="var(--emas-gelap)" />
        <span style={judul}>Kegiatan berikutnya</span>
      </div>
      <div style={{ display: 'grid', gap: 0 }}>
        {items.map((p, i) => (
          <button key={p.key} onClick={p.on} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr) auto', gap: 12, alignItems: 'start', border: 0, background: 'transparent', color: EMAS.teks, font: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '6px 0', opacity: i ? 0.8 : 1 }}>
            <span style={{ display: 'grid', justifyItems: 'center', alignSelf: 'stretch', paddingTop: 5 }} aria-hidden="true">
              <span style={{ width: 10, height: 10, borderRadius: '50%', boxSizing: 'border-box', background: i ? 'transparent' : EMAS.utama, border: i ? '2px solid var(--emas-cincin)' : 0 }} />
              {i < items.length - 1 && <span style={{ width: 2, minHeight: 24, height: '100%', background: EMAS.garis }} />}
            </span>
            <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(14.5) }}>{p.label}</b><br /><span style={{ fontSize: fs(12), color: EMAS.redup }}>{p.sub}</span></span>
            <span style={{ fontSize: fs(13), fontWeight: 800, color: i ? EMAS.teks : EMAS.utama, whiteSpace: 'nowrap' }}>{p.kapan}</span>
          </button>))}
      </div>
    </div>
  );
}

function Berlangsung({ c }) {
  return (
    <div style={{ ...kartu, background: SOROTAN, border: '1.5px solid ' + EMAS.tua }}>
      <Latar jenis="tenda" style={{ width: 230, right: -36, bottom: -14, opacity: 0.14 }} />
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--hijau-status)', flex: 'none' }} aria-hidden="true" />
        <span style={judul}>Sedang berlangsung{c.day ? ' · ' + c.day : ''}</span>
      </div>
      <div style={{ ...atas, fontFamily: serif, fontSize: fs(28), fontWeight: 700, lineHeight: 1.1 }}>{c.n}</div>
      <div style={{ ...atas, fontSize: fs(13), color: 'var(--teks-gelap-2)' }}>{[c.mode, c.place, c.k].filter(Boolean).join(' · ')}</div>
      <div style={{ ...atas, display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(28), fontWeight: 800, color: EMAS.muda }}>{c.done}</span>
        <span style={{ fontSize: fs(14), color: 'var(--teks-gelap-2)' }}>/ {c.tot} jamaah · {c.pct}%</span>
      </div>
      <div style={{ ...atas, height: 8, borderRadius: 9, background: 'rgba(0,0,0,.3)', overflow: 'hidden' }} aria-hidden="true"><div style={{ width: c.pct + '%', height: '100%', borderRadius: 9, background: `linear-gradient(90deg, var(--hijau-status), ${EMAS.utama})` }} /></div>
      {c.ket && <div style={{ ...atas, fontSize: fs(12.5), color: 'var(--teks-gelap-2)', lineHeight: 1.4 }}>{c.ket}</div>}
      <button onClick={c.on} style={{ ...atas, ...tombolEmas }}>Buka checklist</button>
    </div>
  );
}

function Perjalanan({ j }) {
  const w = WARNA_IBADAH[j.m];
  return (
    <button onClick={j.on} style={{ ...kartu, borderRadius: 22, padding: 16, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'grid', placeItems: 'center', background: w.ikon, color: EMAS.muda, border: '1px solid rgba(232,207,134,.25)' }}><Ikon d={IKON_IBADAH[j.m]} s={24} /></span>
        <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><b style={{ fontSize: fs(16.5) }}>{j.nama}</b><span style={{ fontSize: fs(12), color: EMAS.redup }}>{j.sub}</span></span>
        <span style={{ flex: 'none', fontSize: fs(18), fontWeight: 800, color: w.isi }}>{j.pct}%</span>
      </span>
      <span style={{ height: 6, borderRadius: 9, background: 'var(--kartu-trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: j.pct + '%', borderRadius: 9, background: w.isi }} /></span>
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {j.titik.map(t => (
          <span key={t.l} style={{ flex: 1, minWidth: 0, display: 'grid', justifyItems: 'center', gap: 5, textAlign: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', boxSizing: 'border-box', background: t.s === 'ok' ? 'var(--hijau-status)' : t.s === 'now' ? EMAS.utama : 'transparent', border: '2px solid ' + (t.s === 'ok' ? 'var(--hijau-status)' : t.s === 'now' ? EMAS.utama : 'var(--kartu-tepi)') }} aria-hidden="true" />
            <span style={{ fontSize: fs(12), lineHeight: 1.25, color: t.s === 'todo' ? 'var(--teks-gelap-3)' : EMAS.teks, overflowWrap: 'anywhere' }}>{t.l}</span>
          </span>))}
      </span>
    </button>
  );
}

export default function HomeAtas({ h }) {
  if (!h) return null;
  return (
    <>
      <Mutiara />
      <Sholat kotaAwal={h.kota} />
      <Jamaah h={h} />
      {h.peringatan.length > 0 && <Belum items={h.peringatan} />}
      {h.pengingat.length > 0 && <Berikutnya items={h.pengingat} />}
      {h.tanpaTanggal && <div style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Atur tanggal (dan jam) kegiatan lewat tombol <b>Atur tanggal</b> di Checklist supaya peringatan dan pengingat muncul di sini.</div>}
      {h.cur && <Berlangsung c={h.cur} />}
      <div style={{ ...judul, color: 'var(--color-accent-2-700)', marginTop: 4 }}>Perjalanan ibadah</div>
      {(h.jalan || []).map(j => <Perjalanan key={j.m} j={j} />)}
    </>
  );
}
