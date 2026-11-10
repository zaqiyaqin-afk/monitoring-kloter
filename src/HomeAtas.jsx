// Home desain Cyber-Mint; warna dari token --m-* di tema.css supaya ikut mode terang/gelap.
import React, { useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Latar, IKON_IBADAH, WARNA_IBADAH, GAMBAR } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { position: 'relative', overflow: 'hidden', borderRadius: 26, padding: 16, color: 'var(--m-teks)', background: 'var(--m-kartu)', boxShadow: 'var(--m-kartu-bayang)', display: 'grid', gap: 12, minWidth: 0 };
const atas = { position: 'relative' };
const judul = { fontSize: fs(14.5), fontWeight: 800, color: 'var(--m-teks)' };
const redup = { fontSize: fs(11.5), color: 'var(--m-teks-2)' };
const tepiMint = '1.5px solid var(--m-tepi)';
const tombolMint = { border: 0, borderRadius: 999, padding: '11px 22px', minHeight: 44, background: 'var(--m-isi)', color: 'var(--m-on-isi)', font: `800 ${fs(13)} var(--font-body)`, cursor: 'pointer', justifySelf: 'start', boxShadow: 'var(--m-isi-bayang)' };
const Ikon = ({ d, s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const AWAS = 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const JAM = 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z';
const KABAH = 'M4 7l8-3 8 3v11l-8 3-8-3zM4 7l8 3 8-3M12 10v11M4 10.5l8 3 8-3';
const ORANG = 'M9 7a3 3 0 1 0 0 .01M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 8a2.5 2.5 0 1 0 0 .01M16.5 13.2c2.6.4 4.5 2.6 4.5 5.3';

const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const NAMA = [['fajr', 'Subuh'], ['dhuhr', 'Dzuhur'], ['asr', 'Ashar'], ['maghrib', 'Magrib'], ['isha', 'Isya']];
const jamWas = d => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(':', '.');
const tglWas = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);
const fmt = (o, d) => { try { return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', ...o }).format(d); } catch (e) { return ''; } };
function hijriah(d) {
  try { return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'long', year: 'numeric' }).format(d).replace(/\s*(AH|H)$/, '') + ' H'; }
  catch (e) { return ''; }
}

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

// Spanduk mutiara: kartu bergambar Masjidil Haram dengan tepi mint
function Mutiara() {
  return (
    <div className="mk-penuh" style={{ position: 'relative', overflow: 'hidden', borderRadius: 26, border: tepiMint, padding: '24px 16px 18px', display: 'grid', gap: 2, textAlign: 'center',
      background: `linear-gradient(180deg, rgba(5,26,24,.86) 0%, rgba(9,46,40,.50) 45%, rgba(6,24,22,.96) 100%), url(${GAMBAR.haram}) center 44% / cover no-repeat, #062624` }}>
      <p lang="ar" dir="rtl" style={{ margin: 0, paddingTop: 'calc(6px*var(--fs,1))', fontFamily: 'var(--font-arab)', fontSize: fs(22), color: '#fde68a', lineHeight: 2.4, textShadow: '0 2px 10px rgba(0,0,0,.9)' }}>
        خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا
      </p>
      <p style={{ margin: 0, fontFamily: 'var(--font-arti)', fontSize: fs(13.5), fontStyle: 'italic', fontWeight: 500, color: '#ffffff', lineHeight: 1.4, textShadow: '0 2px 8px rgba(0,0,0,.9)' }}>
        Melayani jamaah haji adalah kehormatan bagi kami
      </p>
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
    <div className="mk-penuh" style={kartu}>
      <Latar jenis="masjid" style={{ width: 170, right: -10, top: 34, opacity: 0.14, color: 'var(--m-aksen)' }} />
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          <span style={{ ...judul, color: 'var(--m-aksen-teks)' }}>Waktu sholat · {kota}</span>
          <span style={{ fontSize: fs(11.5), fontWeight: 600, color: 'var(--m-emas)' }}>{hijriah(now)} · {fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, now)}</span>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--m-ubin)', flex: 'none' }}>
          {Object.keys(KOTA).map(k => <button key={k} onClick={() => pilih(k)} aria-pressed={kota === k}
            style={{ border: 0, borderRadius: 999, padding: '6px 13px', minHeight: 44, font: `${kota === k ? 800 : 600} ${fs(11.5)} var(--font-body)`, cursor: 'pointer', background: kota === k ? 'var(--m-isi)' : 'transparent', color: kota === k ? 'var(--m-on-isi)' : 'var(--m-teks-2)' }}>{k}</button>)}
        </div>
      </div>
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div style={{ width: 'calc(72px*var(--fs,1))', height: 'calc(72px*var(--fs,1))', borderRadius: '50%', flex: 'none', background: `conic-gradient(#16f298 0 ${w.persen}%, var(--m-ubin) ${w.persen}% 100%)`, display: 'grid', placeItems: 'center' }} aria-hidden="true">
          <div style={{ width: 'calc(60px*var(--fs,1))', height: 'calc(60px*var(--fs,1))', borderRadius: '50%', background: 'var(--m-kartu)', display: 'grid', placeItems: 'center', alignContent: 'center' }}>
            <span style={{ fontSize: fs(j ? 15 : 14), fontWeight: 800, color: 'var(--m-aksen-teks)', lineHeight: 1.1 }}>{j ? `${j}:${String(mnt === 60 ? 59 : mnt).padStart(2, '0')}` : mnt}</span>
            <span style={{ fontSize: fs(9.5), fontWeight: 600, color: 'var(--m-teks-2)' }}>{j ? 'jam lagi' : 'menit lagi'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: fs(11.5), fontWeight: 800, color: 'var(--m-aksen-teks)' }}>Berikutnya{w.next.besok ? ' (besok)' : ''}</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: fs(26), fontWeight: 800, lineHeight: 1.1, color: 'var(--m-teks)' }}>{w.next.l}</span>
            <span style={{ fontSize: fs(18), fontWeight: 800, color: 'var(--m-emas)' }}>{jamWas(w.next.t)} WAS</span>
          </span>
        </div>
      </div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 4, padding: 4, borderRadius: 16, background: 'var(--m-ubin)' }}>
        {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
          return <div key={x.l} style={{ minWidth: 0, textAlign: 'center', borderRadius: 12, padding: '6px 2px', background: on ? 'var(--m-isi)' : 'transparent', color: on ? 'var(--m-on-isi)' : 'var(--m-teks)' }}>
            <div style={{ fontSize: fs(10.5), fontWeight: on ? 800 : 500, color: on ? 'var(--m-on-isi)' : 'var(--m-teks-2)' }}>{x.l}</div>
            <div style={{ fontSize: fs(12.5), fontWeight: 800 }}>{jamWas(x.t)}</div>
          </div>; })}
      </div>
    </div>
  );
}

// Kotak statistik: Lansia & Kejadian menyala mint, sisanya ubin redup dengan titik warna
const WARNA_KOTAK = { Lansia: { titik: '#fbbf24' }, Risti: { titik: '#f43f5e' }, 'Kursi roda': { titik: '#38bdf8' }, Didampingi: { titik: '#18f59a' }, Udzur: { titik: '#fb7185' }, Kejadian: { titik: '#f43f5e', waspada: true } };

function Kotak({ n, l, on }) {
  const w = WARNA_KOTAK[l] || {}, awas = w.waspada && n > 0;
  return (
    <button onClick={on} disabled={!on} style={{ minWidth: 0, textAlign: 'left', borderRadius: 16, padding: '9px 10px', background: awas ? 'var(--m-koral-bg)' : 'var(--m-ubin)', border: 0, color: awas ? 'var(--m-koral)' : 'var(--m-teks)', cursor: on ? 'pointer' : 'default', font: 'inherit', display: 'grid', gap: 2 }}>
      <span style={{ fontSize: fs(20), fontWeight: 800, lineHeight: 1.2 }}>{n}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'calc(11px*min(var(--fs,1),1.12))', fontWeight: 600, color: awas ? 'var(--m-koral)' : 'var(--m-teks-2)', overflowWrap: 'break-word' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: w.titik, flex: 'none' }} aria-hidden="true" />
        {l}
      </span>
    </button>
  );
}

function Jamaah({ h }) {
  const r = Object.fromEntries(h.ringkas.map(x => [x.l, x])), L = r['Laki-laki'].n, P = r['Perempuan'].n, isi = L + P || 1;
  return (
    <div style={{ ...kartu, borderRadius: 28, background: 'var(--m-jamaah)', border: tepiMint }}>
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--m-isi)', color: 'var(--m-on-isi)' }}><Ikon d={ORANG} s={23} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'grid' }}>
          <span style={{ ...judul, fontSize: fs(16) }}>Jamaah kloter</span>
          <span style={redup}>Ringkasan kondisi & pendampingan</span>
        </div>
        <span style={{ fontSize: fs(34), fontWeight: 800, color: 'var(--m-aksen-teks)', lineHeight: 1 }}>{h.total}</span>
      </div>
      <div style={{ ...atas, height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--m-trek)' }} aria-hidden="true">
        <div style={{ width: (L / isi * 100) + '%', height: '100%', borderRadius: 4, background: 'var(--m-isi)' }} />
      </div>
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: fs(11.5), fontWeight: 800, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--m-aksen-teks)' }}>Laki-laki {L}</span>
        <span style={{ color: 'var(--m-teks)' }}>Perempuan {P}</span>
      </div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        {['Lansia', 'Risti', 'Kursi roda', 'Didampingi', 'Udzur'].map(l => <Kotak key={l} n={r[l].n} l={l} on={r[l].on} />)}
        {h.kejadian && <Kotak n={h.kejadian.n} l="Kejadian" on={h.kejadian.on} />}
      </div>
      {h.khusus && <button onClick={h.khusus.on} style={{ ...atas, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 19, padding: '9px 14px', minHeight: 44, background: 'var(--m-kartu)', border: 0, color: 'var(--m-teks)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
        <span style={{ color: '#f43f5e', flex: 'none', display: 'grid' }}><Ikon d={AWAS} /></span>
        <span style={{ fontSize: fs(11.5), fontWeight: 700, lineHeight: 1.4, minWidth: 0 }}>Jamaah khusus {h.khusus.n} · <span style={{ color: h.khusus.tanpa ? 'var(--m-koral)' : 'var(--m-aksen-teks)' }}>{h.khusus.tanpa ? h.khusus.tanpa + ' belum punya pendamping' : 'semua sudah didampingi'}</span> ›</span>
      </button>}
      {h.catatanData && <div style={{ ...atas, ...redup, lineHeight: 1.45 }}>{h.catatanData}</div>}
    </div>
  );
}

function PeringatanPengingat({ h }) {
  const peringatan = h.peringatan || [], pengingat = h.pengingat || [];
  return (
    <div style={{ ...kartu, gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--m-koral-bg)', color: '#f43f5e' }}><Ikon d={AWAS} s={20} /></span>
          <div style={{ display: 'grid', minWidth: 0 }}>
            <span style={judul}>Peringatan & pengingat</span>
            <span style={redup}>Tindak lanjut checklist & jadwal kegiatan</span>
          </div>
        </div>
        <span style={{ flex: 'none', fontSize: fs(10.5), fontWeight: 800, padding: '5px 10px', borderRadius: 12, background: h.simulasiJadwal ? 'var(--m-emas-bg)' : 'var(--m-lembut)', color: h.simulasiJadwal ? 'var(--m-emas)' : 'var(--m-aksen-teks)' }}>
          {h.simulasiJadwal ? 'Simulasi' : 'Jadwal riil'}
        </span>
      </div>

      {!peringatan.length && !pengingat.length && (
        <div style={{ borderRadius: 16, padding: '12px 14px', background: 'var(--m-lembut)', color: 'var(--m-lembut-teks)', fontSize: fs(13), fontWeight: 700, lineHeight: 1.45 }}>
          Alhamdulillah, semua kegiatan terjadwal sudah tuntas dicentang dan belum ada jadwal kegiatan berikutnya.
        </div>
      )}

      {peringatan.map(p => {
        const sudah = Math.max(0, (p.tot || 0) - p.n), pr = p.tot ? Math.round(sudah / p.tot * 100) : 0;
        return (
          <button key={p.key} onClick={p.on} style={{ display: 'grid', gap: 7, borderRadius: 16, padding: '11px 14px', background: 'var(--m-kartu-2)', border: 0, color: 'var(--m-teks)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ minWidth: 0, display: 'grid' }}><b style={{ fontSize: fs(13) }}>{p.label}</b><span style={{ ...redup, fontSize: fs(11) }}>{p.sub}</span></span>
              <span style={{ flex: 'none', fontSize: fs(11), fontWeight: 800, padding: '5px 10px', borderRadius: 12, background: 'var(--m-koral-bg)', color: 'var(--m-koral)', whiteSpace: 'nowrap' }}>{p.n} belum ›</span>
            </span>
            {p.tot > 0 && <>
              <span style={{ height: 5, borderRadius: 3, background: 'var(--m-trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: pr + '%', borderRadius: 3, background: 'var(--m-isi)' }} /></span>
              <span style={{ ...redup, fontSize: fs(10.5) }}>{sudah} dari {p.tot} jamaah sudah dicentang ({pr}%)</span>
            </>}
          </button>
        );
      })}

      {pengingat.length > 0 && (
        <div style={{ display: 'grid', background: 'var(--m-kartu-2)', borderRadius: 16, padding: '6px 14px' }}>
          {pengingat.map((p, i) => (
            <button key={p.key} onClick={p.on} style={{ display: 'grid', gridTemplateColumns: '12px minmax(0,1fr) auto', gap: 10, alignItems: 'start', border: 0, background: 'transparent', color: 'var(--m-teks)', font: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '6px 0', minHeight: 44 }}>
              <span style={{ display: 'grid', justifyItems: 'center', alignSelf: 'stretch', paddingTop: 5 }} aria-hidden="true">
                <span style={{ width: 8, height: 8, borderRadius: '50%', boxSizing: 'border-box', background: i ? 'transparent' : '#16f298', border: i ? '2px solid var(--m-emas)' : 0 }} />
                {i < pengingat.length - 1 && <span style={{ width: 2, minHeight: 20, height: '100%', background: 'var(--m-garis)' }} />}
              </span>
              <span style={{ minWidth: 0, display: 'grid' }}><b style={{ fontSize: fs(12.5) }}>{p.label}</b><span style={{ ...redup, fontSize: fs(11) }}>{p.sub}</span></span>
              <span style={{ fontSize: fs(11.5), fontWeight: 800, color: i ? 'var(--m-emas)' : 'var(--m-aksen-teks)', whiteSpace: 'nowrap' }}>{p.kapan}</span>
            </button>
          ))}
        </div>
      )}

      {h.tanpaTanggal && (
        <div style={{ ...redup, lineHeight: 1.4 }}>
          Menampilkan simulasi jadwal · atur tanggal riil lewat tombol <b>Atur tanggal</b> di Checklist.
        </div>
      )}
    </div>
  );
}

// Kartu sedang berlangsung: gambar lokasi ibadah dengan lapisan gelap kehijauan dan tepi mint
function Berlangsung({ c }) {
  const m = String(c.m || c.mode || 'haji').toLowerCase();
  const w = WARNA_IBADAH[m] || WARNA_IBADAH.haji;
  return (
    <div className="mk-penuh" style={{ ...kartu, borderRadius: 24, border: tepiMint, color: '#ffffff', gap: 10,
      background: `linear-gradient(90deg, rgba(5,22,20,.92) 0%, rgba(9,36,32,.75) 55%, rgba(5,22,20,.53) 100%), url(${w.gambar}) ${w.posisi || 'center'} / cover no-repeat, #081816` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16f298', flex: 'none' }} aria-hidden="true" />
        <span style={{ fontSize: fs(12.5), fontWeight: 800, color: '#16f298' }}>Sedang berlangsung{c.day ? ' · ' + c.day : ''}</span>
      </div>
      <div style={{ display: 'grid', gap: 3 }}>
        <div style={{ fontSize: fs(19.5), fontWeight: 800, lineHeight: 1.2 }}>{c.n}</div>
        <div style={{ fontSize: fs(12), fontWeight: 500, color: '#ccfbf1' }}>{[c.mode, c.place, c.k].filter(Boolean).join(' · ')}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(24), fontWeight: 800, color: '#16f298' }}>{c.done}</span>
        <span style={{ fontSize: fs(13), fontWeight: 600 }}>/ {c.tot} jamaah · {c.pct}%</span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: 'rgba(0,0,0,.5)', overflow: 'hidden' }} aria-hidden="true">
        <div style={{ width: Math.max(4, c.pct) + '%', height: '100%', borderRadius: 4, background: 'var(--m-isi)' }} />
      </div>
      {c.ket && <div style={{ fontSize: fs(12), color: '#ccfbf1', lineHeight: 1.4 }}>{c.ket}</div>}
      <button onClick={c.on} style={tombolMint}>Buka checklist →</button>
    </div>
  );
}

// Warna tiap ibadah di kartu perjalanan: Haji emas, Umrah safir, Madinah mint
const WARNA_JALAN = {
  haji: { teks: 'var(--m-emas)', bar: '#fbbf24' },
  umrah: { teks: 'var(--m-safir)', bar: '#38bdf8' },
  madinah: { teks: 'var(--m-aksen-teks)', bar: '#16f298' }
};

function Perjalanan({ j }) {
  const w = WARNA_JALAN[j.m] || WARNA_JALAN.madinah;
  return (
    <button onClick={j.on} style={{ ...kartu, borderRadius: 20, padding: '14px 12px', gap: 9, border: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 11, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--m-lembut)', color: w.teks }}><Ikon d={IKON_IBADAH[j.m]} s={20} /></span>
        <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><b style={{ fontSize: fs(13.5) }}>{j.nama}</b><span style={{ ...redup, fontSize: fs(11) }}>{j.sub}</span></span>
        <span style={{ flex: 'none', fontSize: fs(16), fontWeight: 800, color: w.teks }}>{j.pct}%</span>
      </span>
      <span style={{ height: 6, borderRadius: 3, background: 'var(--m-trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: j.pct + '%', borderRadius: 3, background: w.bar }} /></span>
      <span style={{ fontSize: fs(10.5), fontWeight: 500, color: 'var(--m-teks-2)', lineHeight: 1.5 }}>
        {j.titik.map((t, i) => (
          <React.Fragment key={t.l}>
            {i > 0 && <span aria-hidden="true">{' → '}</span>}
            <span style={{ whiteSpace: 'nowrap', fontWeight: t.s === 'now' ? 800 : t.s === 'ok' ? 600 : 500, color: t.s === 'now' ? w.teks : t.s === 'ok' ? 'var(--m-teks)' : 'var(--m-teks-2)' }}>{t.l}</span>
          </React.Fragment>
        ))}
      </span>
    </button>
  );
}

export default function HomeAtas({ h }) {
  if (!h) return null;
  return (
    <>
      <Mutiara />
      <Jamaah h={h} />
      <PeringatanPengingat h={h} />
      <Sholat kotaAwal={h.kota} />
      <div className="mk-penuh" style={{ ...judul, fontSize: fs(14), color: 'var(--m-teks-2)', marginTop: 2 }}>Perjalanan ibadah</div>
      {h.cur && <Berlangsung c={h.cur} />}
      <div className="mk-penuh mk-tiga">{(h.jalan || []).map(j => <Perjalanan key={j.m} j={j} />)}</div>
    </>
  );
}
