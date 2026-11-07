// Home gaya "Modern Segar Berwarna": teks Arab, waktu sholat (WAS) + tanggal hijriah, jamaah kloter (6 kotak warna berbeda),
// belum dicentang, kegiatan berikutnya, sedang berlangsung, dan perjalanan Haji (Emas) / Umrah (Safir) / Madinah (Zamrud).
import React, { useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Latar, IKON_IBADAH, WARNA_IBADAH, GAMBAR } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { position: 'relative', overflow: 'hidden', borderRadius: 22, padding: 18, color: 'var(--color-text)', display: 'grid', gap: 12, minWidth: 0 };
const atas = { position: 'relative' };
const judul = { fontSize: fs(15), fontWeight: 800, color: 'var(--color-text)' };
const serif = 'var(--font-serif)';
const SOROTAN = 'linear-gradient(135deg, #047857 0%, #0d9488 52%, #1e40af 100%)';
const tombolEmas = { border: 0, borderRadius: 14, padding: '11px 18px', minHeight: 44, background: 'var(--emas-isi)', color: 'var(--on-emas)', font: `800 ${fs(14)} var(--font-body)`, cursor: 'pointer', justifySelf: 'start', boxShadow: '0 4px 12px -2px rgba(0,0,0,.25)' };
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

// Spanduk utama Home menyeluruh ke atas (full-bleed) dengan lengkung bawah halus agar kartu Jamaah Kloter menumpuk luwes di atas tepinya
function Mutiara() {
  return (
    <div
      className="mk-gelap"
      style={{
        position: 'relative',
        overflow: 'hidden',
        margin: '-8px -20px 0',
        padding: '24px 20px 54px',
        borderRadius: '0 0 32px 32px',
        display: 'grid',
        gap: 6,
        textAlign: 'center',
        background: `linear-gradient(180deg, rgba(4,22,32,.80) 0%, rgba(6,30,42,.20) 42%, rgba(6,28,40,.46) 72%, rgba(4,18,28,.92) 100%), url(${GAMBAR.haram}) center 44% / cover no-repeat, #062834`,
        boxShadow: '0 14px 32px -12px rgba(15, 23, 42, .38)'
      }}
    >
      <p
        lang="ar"
        dir="rtl"
        style={{
          margin: 0,
          paddingTop: 6,
          fontFamily: 'var(--font-arab)',
          fontSize: fs(25),
          color: '#fde68a',
          lineHeight: 2.25,
          textShadow: '0 2px 10px rgba(0,0,0,.90), 0 1px 3px rgba(0,0,0,.95)'
        }}
      >
        خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-arti)',
          fontSize: fs(14),
          fontStyle: 'italic',
          fontWeight: 500,
          color: '#ffffff',
          lineHeight: 1.45,
          textShadow: '0 2px 8px rgba(0,0,0,.90), 0 1px 2px rgba(0,0,0,.95)'
        }}
      >
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
    <div className="kartu-zamrud" style={{ ...kartu, borderRadius: 26, padding: 20 }}>
      <Latar jenis="masjid" style={{ width: 200, right: -30, top: 30, opacity: 0.12, color: 'var(--color-accent)' }} />
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
          <span style={{ ...judul, color: 'var(--zamrud-teks)' }}>Waktu sholat · {kota}</span>
          <span style={{ fontSize: fs(13), fontWeight: 800, color: 'var(--emas-teks)' }}>{hijriah(now)}</span>
          <span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>{fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, now)}</span>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--zamrud-lembut)', flex: 'none' }}>
          {Object.keys(KOTA).map(k => <button key={k} onClick={() => pilih(k)} aria-pressed={kota === k}
            style={{ border: 0, borderRadius: 999, padding: '6px 14px', minHeight: 40, font: `800 ${fs(12)} var(--font-body)`, cursor: 'pointer', background: kota === k ? 'var(--zamrud-ikon)' : 'transparent', color: kota === k ? '#ffffff' : 'var(--zamrud-teks)', boxShadow: kota === k ? '0 3px 10px -2px rgba(5,150,105,.35)' : 'none' }}>{k}</button>)}
        </div>
      </div>
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div style={{ width: 'calc(84px*var(--fs,1))', height: 'calc(84px*var(--fs,1))', borderRadius: '50%', flex: 'none', background: `conic-gradient(var(--color-accent) 0 ${w.persen}%, var(--zamrud-lembut) ${w.persen}% 100%)`, display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px -4px rgba(5, 150, 105, .24)' }} aria-hidden="true">
          <div style={{ width: 'calc(68px*var(--fs,1))', height: 'calc(68px*var(--fs,1))', borderRadius: '50%', background: 'var(--color-surface)', display: 'grid', placeItems: 'center', alignContent: 'center' }}>
            <span style={{ fontSize: fs(j ? 19 : 17), fontWeight: 800, color: 'var(--zamrud-teks)', lineHeight: 1.1 }}>{j ? `${j}:${String(mnt === 60 ? 59 : mnt).padStart(2, '0')}` : mnt}</span>
            <span style={{ fontSize: fs(11), fontWeight: 600, color: 'var(--teks-2)' }}>{j ? 'jam lagi' : 'menit lagi'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: fs(12.5), fontWeight: 700, color: 'var(--zamrud-teks)' }}>Berikutnya{w.next.besok ? ' (besok)' : ''}</span>
          <span style={{ fontFamily: serif, fontSize: fs(34), fontWeight: 700, lineHeight: 1, color: 'var(--color-text)' }}>{w.next.l}</span>
          <span style={{ fontSize: fs(22), fontWeight: 800, color: 'var(--emas-teks)' }}>{jamWas(w.next.t)}</span>
        </div>
      </div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 4, padding: 5, borderRadius: 18, background: 'var(--color-surface)', boxShadow: 'inset 0 1px 3px rgba(15,23,42,.06)' }}>
        {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
          return <div key={x.l} style={{ minWidth: 0, textAlign: 'center', borderRadius: 14, padding: '8px 2px', background: on ? 'var(--emas-isi)' : 'transparent', color: on ? 'var(--on-emas)' : 'var(--color-text)', boxShadow: on ? '0 4px 12px -2px rgba(217, 119, 6, .38)' : 'none' }}>
            <div style={{ fontSize: fs(11.5), fontWeight: on ? 800 : 600, color: on ? 'var(--on-emas)' : 'var(--teks-2)' }}>{x.l}</div>
            <div style={{ fontSize: fs(13.5), fontWeight: 800 }}>{jamWas(x.t)}</div>
          </div>; })}
      </div>
    </div>
  );
}

// Tiap ubin statistik di kartu Jamaah memakai warna lembut tanpa garis kotak kaku (borderless soft tiles)
const WARNA_KOTAK = {
  Lansia: { bg: 'var(--emas-lembut)', titik: '#f59e0b', teks: 'var(--emas-teks)' },
  Risti: { bg: 'var(--koral-lembut)', titik: '#f43f5e', teks: 'var(--koral-teks)' },
  'Kursi roda': { bg: 'var(--safir-lembut)', titik: '#3b82f6', teks: 'var(--safir-teks)' },
  Didampingi: { bg: 'var(--zamrud-lembut)', titik: '#10b981', teks: 'var(--zamrud-teks)' },
  Udzur: { bg: 'var(--koral-lembut)', titik: '#e11d48', teks: 'var(--koral-teks)' },
  Kejadian: { bg: 'var(--emas-lembut)', titik: '#d97706', teks: 'var(--emas-teks)' }
};

function Kotak({ n, l, on }) {
  const w = WARNA_KOTAK[l] || WARNA_KOTAK.Didampingi;
  return (
    <button onClick={on} disabled={!on} style={{ minWidth: 0, textAlign: 'left', borderRadius: 18, padding: '11px 13px', background: w.bg, border: 0, color: 'var(--color-text)', cursor: on ? 'pointer' : 'default', font: 'inherit', display: 'grid', gap: 3 }}>
      <span style={{ fontSize: fs(23), fontWeight: 800, lineHeight: 1.1, color: w.teks }}>{n}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: fs(12), fontWeight: 700, color: 'var(--teks-2)', overflowWrap: 'anywhere' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: w.titik, flex: 'none' }} aria-hidden="true" />
        {l}
      </span>
    </button>
  );
}

function Jamaah({ h }) {
  const r = Object.fromEntries(h.ringkas.map(x => [x.l, x])), L = r['Laki-laki'].n, P = r['Perempuan'].n, isi = L + P || 1;
  return (
    <div className="kartu-safir" style={{ ...kartu, marginTop: -36, zIndex: 2, borderRadius: 26, padding: 20, boxShadow: '0 16px 34px -12px rgba(15, 23, 42, .16)' }}>
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="ubin ubin-safir" aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 16 }}><Ikon d={ORANG} s={24} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'grid' }}>
          <span style={{ ...judul, color: 'var(--safir-teks)' }}>Jamaah kloter</span>
          <span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>Ringkasan kondisi & pendampingan</span>
        </div>
        <span style={{ fontFamily: serif, fontSize: fs(34), fontWeight: 700, color: 'var(--safir-teks)', lineHeight: 1 }}>{h.total}</span>
      </div>
      <div style={{ ...atas, display: 'flex', height: 9, borderRadius: 9, overflow: 'hidden', background: 'var(--trek)' }} aria-hidden="true">
        <div style={{ width: (L / isi * 100) + '%', background: 'var(--safir-ikon)' }} /><div style={{ width: (P / isi * 100) + '%', background: 'var(--emas-ikon)' }} />
      </div>
      <div style={{ ...atas, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: fs(13), flexWrap: 'wrap', color: 'var(--teks-2)' }}>
        <span>Laki-laki <b style={{ color: 'var(--safir-teks)' }}>{L}</b></span>
        <span>Perempuan <b style={{ color: 'var(--emas-teks)' }}>{P}</b></span>
      </div>
      <div style={{ ...atas, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        {['Lansia', 'Risti', 'Kursi roda', 'Didampingi', 'Udzur'].map(l => <Kotak key={l} n={r[l].n} l={l} on={r[l].on} />)}
        {h.kejadian && <Kotak n={h.kejadian.n} l="Kejadian" on={h.kejadian.on} />}
      </div>
      {h.khusus && <button onClick={h.khusus.on} style={{ ...atas, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 16, padding: '11px 14px', background: 'var(--emas-lembut)', border: 0, color: 'var(--color-text)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
        <span style={{ color: 'var(--emas-teks)', flex: 'none', display: 'grid' }}><Ikon d={AWAS} /></span>
        <span style={{ fontSize: fs(13), lineHeight: 1.4, minWidth: 0 }}>Jamaah khusus <b>{h.khusus.n}</b> · <span style={{ color: h.khusus.tanpa ? 'var(--koral-teks)' : 'var(--zamrud-teks)', fontWeight: 800 }}>{h.khusus.tanpa ? h.khusus.tanpa + ' belum punya pendamping' : 'semua sudah punya pendamping'}</span></span>
      </button>}
      {h.catatanData && <div style={{ ...atas, fontSize: fs(12), color: 'var(--teks-2)', lineHeight: 1.45 }}>{h.catatanData}</div>}
    </div>
  );
}

const Lencana = ({ ikon, cls = '' }) => <span className={`ubin ${cls}`} style={{ width: 42, height: 42, borderRadius: 14 }}><Ikon d={ikon} /></span>;

function PeringatanPengingat({ h }) {
  const peringatan = h.peringatan || [], pengingat = h.pengingat || [];
  return (
    <div className="kartu-emas" style={{ ...kartu, borderRadius: 26, padding: 20, gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Lencana ikon={AWAS} cls="ubin-koral" />
          <div style={{ display: 'grid', minWidth: 0 }}>
            <span style={{ ...judul, color: 'var(--koral-teks)' }}>Peringatan & pengingat</span>
            <span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>Tindak lanjut checklist & jadwal kegiatan</span>
          </div>
        </div>
        {h.simulasiJadwal && (
          <span style={{ flex: 'none', fontSize: fs(11), fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: 'var(--emas-lembut)', color: 'var(--emas-teks)' }}>
            Simulasi
          </span>
        )}
      </div>

      {!peringatan.length && !pengingat.length && (
        <div style={{ borderRadius: 16, padding: '12px 14px', background: 'var(--zamrud-lembut)', color: 'var(--zamrud-teks)', fontSize: fs(13), fontWeight: 700, lineHeight: 1.45 }}>
          Alhamdulillah, semua kegiatan terjadwal sudah tuntas dicentang dan belum ada jadwal kegiatan berikutnya.
        </div>
      )}

      {peringatan.length > 0 && (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: fs(12.5), fontWeight: 800, color: 'var(--koral-teks)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f43f5e' }} aria-hidden="true" />
            <span>Belum dicentang · perlu tindak lanjut</span>
          </div>
          {peringatan.map(p => {
            const sudah = Math.max(0, (p.tot || 0) - p.n), pr = p.tot ? Math.round(sudah / p.tot * 100) : 0;
            return (
              <button key={p.key} onClick={p.on} style={{ display: 'grid', gap: 8, borderRadius: '6px 18px 18px 6px', padding: '12px 14px', background: 'var(--color-surface)', border: 0, borderLeft: '4px solid #f43f5e', boxShadow: '0 4px 14px -6px rgba(15,23,42,.08)', color: 'var(--color-text)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(14.5) }}>{p.label}</b><br /><span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>{p.sub}</span></span>
                  <span style={{ flex: 'none', fontSize: fs(12.5), fontWeight: 800, padding: '5px 11px', borderRadius: 999, background: 'var(--koral-lembut)', color: 'var(--koral-teks)', whiteSpace: 'nowrap' }}>{p.n} belum ›</span>
                </span>
                {p.tot > 0 && <>
                  <span style={{ height: 6, borderRadius: 9, background: 'var(--trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: pr + '%', borderRadius: 9, background: 'var(--zamrud-ikon)' }} /></span>
                  <span style={{ fontSize: fs(11.5), color: 'var(--teks-2)' }}>{sudah} dari {p.tot} jamaah sudah dicentang ({pr}%)</span>
                </>}
              </button>
            );
          })}
        </div>
      )}

      {pengingat.length > 0 && (
        <div style={{ display: 'grid', gap: 8, paddingTop: peringatan.length ? 4 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: fs(12.5), fontWeight: 800, color: 'var(--emas-teks)' }}>
            <Ikon d={JAM} s={15} />
            <span>Pengingat kegiatan berikutnya</span>
          </div>
          <div style={{ display: 'grid', gap: 0, background: 'var(--color-surface)', borderRadius: '6px 18px 18px 6px', padding: '8px 14px', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 14px -6px rgba(15,23,42,.08)' }}>
            {pengingat.map((p, i) => (
              <button key={p.key} onClick={p.on} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr) auto', gap: 10, alignItems: 'start', border: 0, background: 'transparent', color: 'var(--color-text)', font: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '6px 0', minHeight: 44 }}>
                <span style={{ display: 'grid', justifyItems: 'center', alignSelf: 'stretch', paddingTop: 5 }} aria-hidden="true">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', boxSizing: 'border-box', background: i ? 'transparent' : 'var(--emas-tua)', border: i ? '2px solid var(--emas-tua)' : 0 }} />
                  {i < pengingat.length - 1 && <span style={{ width: 2, minHeight: 24, height: '100%', background: 'var(--emas-tepi)' }} />}
                </span>
                <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(14) }}>{p.label}</b><br /><span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>{p.sub}</span></span>
                <span style={{ fontSize: fs(12.5), fontWeight: 800, color: i ? 'var(--teks-2)' : 'var(--emas-teks)', whiteSpace: 'nowrap' }}>{p.kapan}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {h.tanpaTanggal && (
        <div style={{ fontSize: fs(11.5), color: 'var(--teks-2)', lineHeight: 1.4 }}>
          Menampilkan simulasi jadwal · atur tanggal riil lewat tombol <b>Atur tanggal</b> di Checklist.
        </div>
      )}
    </div>
  );
}

function Berlangsung({ c }) {
  const m = String(c.m || c.mode || 'haji').toLowerCase();
  const w = WARNA_IBADAH[m] || WARNA_IBADAH.haji, emas = m === 'haji', safir = m === 'umrah';
  const latarKartu = emas
    ? 'linear-gradient(160deg, #78350f 0%, #451a03 60%, #291002 100%)'
    : safir
    ? 'linear-gradient(160deg, #1e3a8a 0%, #172554 60%, #0f172a 100%)'
    : 'linear-gradient(160deg, #065f46 0%, #064e3b 60%, #022c22 100%)';
  const gradien = emas
    ? 'linear-gradient(95deg, rgba(58,22,4,.90) 0%, rgba(78,32,6,.48) 46%, rgba(58,22,4,.06) 100%), linear-gradient(180deg, rgba(58,22,4,.08) 0%, rgba(41,16,2,.68) 76%, rgba(41,16,2,1) 100%)'
    : safir
    ? 'linear-gradient(95deg, rgba(23,37,84,.92) 0%, rgba(30,58,138,.60) 48%, rgba(23,37,84,.16) 100%), linear-gradient(180deg, rgba(23,37,84,.14) 0%, rgba(15,23,42,.85) 72%, rgba(15,23,42,1) 100%)'
    : 'linear-gradient(95deg, rgba(6,78,59,.92) 0%, rgba(6,95,70,.60) 48%, rgba(6,78,59,.16) 100%), linear-gradient(180deg, rgba(6,78,59,.14) 0%, rgba(2,44,34,.85) 72%, rgba(2,44,34,1) 100%)';
  const barBg = emas
    ? 'linear-gradient(90deg, #f59e0b, #fde68a)'
    : safir
    ? 'linear-gradient(90deg, #38bdf8, #93c5fd)'
    : 'linear-gradient(90deg, #10b981, #6ee7b7)';
  return (
    <div
      className="mk-gelap"
      style={{
        ...kartu,
        borderRadius: 24,
        padding: 20,
        background: latarKartu,
        border: '1.5px solid ' + w.tepi,
        boxShadow: '0 10px 24px -10px rgba(15,23,42,.32), inset 0 1px 0 rgba(255,255,255,.18)',
        color: '#f8fafc'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 190,
          backgroundImage: `${gradien}, url(${w.gambar})`,
          backgroundSize: 'cover',
          backgroundPosition: w.posisi || 'center',
          pointerEvents: 'none'
        }}
      />
      <div style={{ ...atas, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: w.aksen, flex: 'none' }} aria-hidden="true" />
        <span style={{ ...judul, color: w.aksen }}>Sedang berlangsung{c.day ? ' · ' + c.day : ''}</span>
      </div>
      <div style={{ ...atas, fontFamily: serif, fontSize: fs(28), fontWeight: 700, lineHeight: 1.1, color: '#ffffff' }}>{c.n}</div>
      <div style={{ ...atas, fontSize: fs(13), color: w.redup }}>{[c.mode, c.place, c.k].filter(Boolean).join(' · ')}</div>
      <div style={{ ...atas, display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(28), fontWeight: 800, color: w.aksen }}>{c.done}</span>
        <span style={{ fontSize: fs(14), color: w.redup }}>/ {c.tot} jamaah · {c.pct}%</span>
      </div>
      <div style={{ ...atas, height: 8, borderRadius: 9, background: 'rgba(0,0,0,.38)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }} aria-hidden="true">
        <div style={{ width: Math.max(4, c.pct) + '%', height: '100%', borderRadius: 9, background: barBg }} />
      </div>
      {c.ket && <div style={{ ...atas, fontSize: fs(12.5), color: w.redup, lineHeight: 1.4 }}>{c.ket}</div>}
      <button onClick={c.on} style={{ ...atas, ...tombolEmas, borderRadius: 999, padding: '11px 20px', background: w.ctaBg, color: w.ctaFg }}>Buka checklist</button>
    </div>
  );
}

function Perjalanan({ j }) {
  const w = WARNA_IBADAH[j.m];
  return (
    <button onClick={j.on} style={{ ...kartu, borderRadius: 24, padding: 18, background: w.kartuBg, border: '1px solid ' + w.kartuTepi, boxShadow: 'var(--kaca-sorot)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 46, height: 46, borderRadius: 16, flex: 'none', display: 'grid', placeItems: 'center', background: w.ikon, color: w.ikonFg, boxShadow: '0 4px 10px -2px rgba(15,23,42,.18)' }}><Ikon d={IKON_IBADAH[j.m]} s={24} /></span>
        <span style={{ flex: 1, minWidth: 0, display: 'grid' }}><b style={{ fontSize: fs(16.5), color: 'var(--color-text)' }}>{j.nama}</b><span style={{ fontSize: fs(12), color: 'var(--teks-2)' }}>{j.sub}</span></span>
        <span style={{ flex: 'none', fontSize: fs(20), fontWeight: 800, color: w.isi }}>{j.pct}%</span>
      </span>
      <span style={{ height: 7, borderRadius: 9, background: 'var(--trek)', overflow: 'hidden' }} aria-hidden="true"><span style={{ display: 'block', height: '100%', width: j.pct + '%', borderRadius: 9, background: w.bar }} /></span>
      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {j.titik.length > 1 && <span aria-hidden="true" style={{ position: 'absolute', top: 6, left: '10%', right: '10%', height: 2, background: 'var(--trek)', zIndex: 0 }} />}
        {j.titik.map(t => (
          <span key={t.l} style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0, display: 'grid', justifyItems: 'center', gap: 5, textAlign: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', boxSizing: 'border-box', background: t.s === 'ok' ? 'var(--color-accent)' : t.s === 'now' ? 'var(--emas-tua)' : 'var(--color-surface)', border: '2px solid ' + (t.s === 'ok' ? 'var(--color-accent)' : t.s === 'now' ? 'var(--emas-tua)' : 'var(--color-neutral-400)') }} aria-hidden="true" />
            <span style={{ fontSize: fs(12), fontWeight: t.s === 'todo' ? 500 : 700, lineHeight: 1.25, color: t.s === 'todo' ? 'var(--teks-3)' : 'var(--color-text)', overflowWrap: 'anywhere' }}>{t.l}</span>
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
      <Jamaah h={h} />
      <PeringatanPengingat h={h} />
      <Sholat kotaAwal={h.kota} />
      <div style={{ ...judul, color: 'var(--teks-2)', marginTop: 4 }}>Perjalanan ibadah</div>
      {h.cur && <Berlangsung c={h.cur} />}
      {(h.jalan || []).map(j => <Perjalanan key={j.m} j={j} />)}
    </>
  );
}
