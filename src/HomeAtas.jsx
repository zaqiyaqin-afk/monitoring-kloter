// Bagian atas Home: kata mutiara, waktu sholat (Waktu Arab Saudi), ringkasan jamaah,
// peringatan kegiatan terlewat, dan pengingat kegiatan berikutnya.
// Waktu sholat dihitung di HP (metode Umm al-Qura), jadi tetap jalan tanpa internet.
import React, { useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--kartu-bg)', border: '1px solid var(--kartu-garis)', borderRadius: 22, padding: '14px 16px', boxShadow: 'var(--kartu-bayang)', display: 'grid', gap: 10, minWidth: 0, position: 'relative', overflow: 'hidden' };
const judul = { fontSize: fs(12.5), fontWeight: 800, color: 'var(--color-accent-700)', letterSpacing: '.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 };
const Ikon = ({ d, s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const IKON = {
  masjid: 'M12 2c-1 2-3 3-3 5h6c0-2-2-3-3-5zM5 21V11a7 7 0 0 1 14 0v10M3 21h18M10 21v-4a2 2 0 0 1 4 0v4',
  orang: 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6',
  awas: 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  jam: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
};

const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const NAMA = [['fajr', 'Subuh'], ['dhuhr', 'Dzuhur'], ['asr', 'Ashar'], ['maghrib', 'Magrib'], ['isha', 'Isya']];
const jamWas = d => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(':', '.');
const tglWas = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);

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
    <div style={{ ...kartu, background: 'var(--pola), var(--hero)', backgroundSize: '56px 56px, auto', border: '1px solid rgba(232,207,134,.45)', color: '#fff', textAlign: 'center', gap: 6, padding: '20px 16px 18px' }}>
      <img src="emblem-256.png" alt="" aria-hidden="true" style={{ position: 'absolute', right: -26, bottom: -30, width: 120, opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ color: '#e8cf86', fontSize: fs(12), letterSpacing: '.3em' }}>✦ ✦ ✦</div>
      <div style={{ fontFamily: 'var(--font-arab)', fontSize: fs(28), color: '#f3dd9b', direction: 'rtl', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,.35)' }}>خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا</div>
      <div style={{ height: 1, width: '42%', justifySelf: 'center', background: 'linear-gradient(90deg, transparent, #e8cf86, transparent)' }} />
      <div style={{ fontSize: fs(13), opacity: 0.92, fontStyle: 'italic' }}>Melayani jamaah haji adalah kehormatan bagi kami</div>
    </div>
  );
}

function Sholat({ kotaAwal }) {
  const [kota, setKota] = useState(() => { try { return localStorage.getItem('mk.kota') || kotaAwal; } catch (e) { return kotaAwal; } });
  const [, tik] = useState(0);
  useEffect(() => { const t = setInterval(() => tik(x => x + 1), 30000); return () => clearInterval(t); }, []);
  const w = waktuSholat(kota), j = Math.floor(w.sisa / 3600000), mnt = Math.ceil((w.sisa % 3600000) / 60000);
  const pilih = k => { setKota(k); try { localStorage.setItem('mk.kota', k); } catch (e) {} };
  return (
    <div style={{ ...kartu, background: 'linear-gradient(150deg, var(--color-accent-100) 0%, transparent 55%), var(--kartu-bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={judul}><span style={{ color: 'var(--color-accent-2)' }}><Ikon d={IKON.masjid} /></span>Waktu sholat · WAS</span>
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface)', border: '1px solid var(--kartu-garis)', borderRadius: 999, padding: 3 }}>
          {Object.keys(KOTA).map(k => <button key={k} onClick={() => pilih(k)} aria-pressed={kota === k}
            style={{ border: 0, borderRadius: 999, padding: '5px 12px', font: `700 ${fs(12.5)} var(--font-body)`, cursor: 'pointer', background: kota === k ? 'var(--color-accent)' : 'transparent', color: kota === k ? 'var(--on-accent)' : 'var(--color-text)' }}>{k}</button>)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', minWidth: 0 }}>
          <span style={{ fontSize: fs(12.5), fontWeight: 700, color: 'var(--color-neutral-700)' }}>Berikutnya{w.next.besok ? ' (besok)' : ''}</span>
          <span style={{ fontSize: fs(26), fontWeight: 800, lineHeight: 1.15 }}>{w.next.l} <span style={{ color: 'var(--color-accent-700)' }}>{jamWas(w.next.t)}</span></span>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: fs(13), fontWeight: 800, color: '#3d2a00', background: 'linear-gradient(160deg,#f3dd9b,#d9ad45)', borderRadius: 999, padding: '6px 12px', whiteSpace: 'nowrap' }}>
          {j ? `${j} j ` : ''}{mnt} mnt lagi
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 9, background: 'var(--color-neutral-200)', overflow: 'hidden' }} aria-hidden="true">
        <div style={{ height: '100%', width: w.persen + '%', borderRadius: 9, background: 'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-2-500))' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 5 }}>
        {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
          return <div key={x.l} style={{ textAlign: 'center', borderRadius: 14, padding: '7px 2px', minWidth: 0, background: on ? 'var(--color-accent)' : 'var(--color-surface)', border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--kartu-garis)'), color: on ? 'var(--on-accent)' : 'var(--color-text)' }}>
            <div style={{ fontSize: 'min(' + fs(11.5) + ', 12.5px)', fontWeight: 600, opacity: on ? 0.9 : 0.75 }}>{x.l}</div>
            <div style={{ fontSize: 'min(' + fs(13.5) + ', 15px)', fontWeight: 800 }}>{jamWas(x.t)}</div>
          </div>; })}
      </div>
    </div>
  );
}

// Warna kotak ringkasan per jenis
const WARNA = {
  'Laki-laki': ['var(--color-accent-100)', 'var(--color-accent-800)'], Perempuan: ['var(--color-accent-2-100)', 'var(--color-accent-2-800)'],
  Lansia: ['#FFF1DB', '#7a4a00'], Didampingi: ['var(--color-accent-100)', 'var(--color-accent-800)'], Risti: ['var(--red-100)', 'var(--red-700)'],
  'Kursi roda': ['var(--color-accent-2-100)', 'var(--color-accent-2-800)'], Udzur: ['var(--color-neutral-200)', 'var(--color-neutral-800)'], 'JK kosong': ['var(--color-neutral-100)', 'var(--color-neutral-700)']
};

function Angka({ n, l, on }) {
  const [bg, fg] = WARNA[l] || ['var(--color-neutral-100)', 'var(--color-text)'];
  return (
    <button onClick={on} style={{ border: '1px solid color-mix(in srgb, ' + fg + ' 14%, transparent)', borderRadius: 16, padding: '9px 6px', background: bg, color: fg, cursor: on ? 'pointer' : 'default', display: 'grid', gap: 1, minWidth: 0, font: 'inherit', textAlign: 'left' }}>
      <span style={{ fontSize: fs(20), fontWeight: 800, lineHeight: 1.15 }}>{n}</span>
      <span style={{ fontSize: fs(11.5), fontWeight: 700, opacity: 0.85 }}>{l}{on ? ' ›' : ''}</span>
    </button>
  );
}

function Daftar({ judulTeks, ikon, warna, items, kanan }) {
  return (
    <div style={{ ...kartu, background: `linear-gradient(150deg, ${warna[0]} 0%, transparent 70%), var(--kartu-bg)`, borderColor: `color-mix(in srgb, ${warna[1]} 25%, transparent)` }}>
      <span style={{ ...judul, color: warna[1] }}><Ikon d={ikon} />{judulTeks}</span>
      {items.map(p => (
        <button key={p.key} onClick={p.on} style={{ border: 0, background: 'var(--color-surface)', borderRadius: 14, textAlign: 'left', padding: '10px 12px', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, font: 'inherit', boxShadow: '0 1px 2px rgba(16,40,30,.06)' }}>
          <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(14.5) }}>{p.label}</b><br /><span style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)' }}>{p.sub}</span></span>
          <span style={{ fontSize: fs(13.5), fontWeight: 800, whiteSpace: 'nowrap', color: warna[1] }}>{kanan(p)}</span>
        </button>
      ))}
    </div>
  );
}

export default function HomeAtas({ h }) {
  if (!h) return null;
  return (
    <>
      <Mutiara />
      <Sholat kotaAwal={h.kota} />
      <div style={kartu}>
        <span style={judul}><span style={{ color: 'var(--color-accent-2)' }}><Ikon d={IKON.orang} /></span>Jamaah · {h.total} orang</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(74px*var(--fs,1)), 1fr))', gap: 7 }}>
          {h.ringkas.map(x => <Angka key={x.l} {...x} />)}
        </div>
        {h.catatanData && <div style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>{h.catatanData}</div>}
      </div>
      {h.peringatan.length > 0 && <Daftar judulTeks="Belum dicentang · sudah lewat" ikon={IKON.awas} warna={['var(--red-100)', 'var(--red-700)']} items={h.peringatan} kanan={p => p.n + ' jamaah ›'} />}
      {h.pengingat.length > 0 && <Daftar judulTeks="Kegiatan berikutnya" ikon={IKON.jam} warna={['var(--color-accent-2-100)', 'var(--color-accent-2-800)']} items={h.pengingat} kanan={p => p.kapan} />}
      {h.tanpaTanggal && <div style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Atur tanggal (dan jam) kegiatan lewat tombol <b>Atur tanggal</b> supaya peringatan dan pengingat muncul di sini.</div>}
    </>
  );
}
